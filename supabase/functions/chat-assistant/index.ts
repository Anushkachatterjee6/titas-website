// Supabase Edge Function: TiTAS AI Assistant
//
// Frontend -> this function -> Gemini API -> reply.
// GEMINI_API_KEY lives ONLY in Supabase's server-side Edge Function secrets
// (Deno.env) and is never returned to, or reachable from, the browser.
//
// Auth: the chatbot is open to every visitor, logged in or not. `verify_jwt =
// true` in supabase/config.toml still requires SOME valid Supabase JWT before
// this code runs — but supabase-js always attaches one automatically (the
// public anon key for a logged-out visitor, or the session token for a
// logged-in one), so that platform-level check never blocks a normal browser
// caller either way; it only blocks requests with no Supabase credentials at
// all (e.g. a bare curl), which stays in place unchanged. Below, we resolve
// the user from that JWT *if present* purely for nicer per-user rate
// limiting — a missing/anonymous session is expected and allowed through.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
// Kept as an env-overridable constant rather than hardcoded so the model can
// be swapped later without a code change — set GEMINI_MODEL in the function's
// secrets to override. Defaults to a current Gemini free-tier-eligible model.
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// --- Usage protection (Part 9) -------------------------------------------
const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6; // last N user+assistant turns forwarded to Gemini
const MAX_OUTPUT_TOKENS = 300; // keeps replies concise and protects quota
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 12;

// Simple in-memory sliding-window limiter. Edge Function instances are
// short-lived/per-region, so this resets on cold start and isn't shared
// globally — a deliberate, documented trade-off for a first version rather
// than standing up dedicated rate-limit infrastructure. It still meaningfully
// curbs bursts from a single warm instance, which is the common abuse case.
const requestLog = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(userId) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(userId, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLog.set(userId, timestamps);
  return false;
}

// --- Approved TiTAS knowledge (Part 6) ------------------------------------
// Transcribed only from information already approved elsewhere in this
// project (src/data/*.ts). Nothing here is invented.
const SYSTEM_PROMPT = `You are "TiTAS Assistant", the official informational chatbot for TiTAS packaged drinking water, operated by SUJIT AQUA ENTERPRISE (brand: TiTAS, tagline "Ekti Jaler Naam", "Banglar Jal, Banglar Bharsha", serving since 1999).

Answer ONLY using the approved information below. If something isn't covered here, say that information isn't currently available and point the customer to TiTAS contact/FAQs — never guess or invent an answer.

PRODUCTS (final approved prices):
- 500 ml — ₹160 per case of 24 pieces
- 1 L — ₹135 per case of 24 pieces
- 2 L — ₹155 per case of 24 pieces
- 5 L — ₹45 per jar
- 20 L — ₹80 per jar

SERVICES:
Home & Residential Supply · Office & Commercial Supply · Institutional Supply · Events & Bulk Orders · Regular & Scheduled Supply · Wholesale & Retailer Supply · Distributor & Dealer Supply · Custom Bulk Enquiry / Business Supply.

DELIVERY & ORDERING:
- Delivery is available within TiTAS's applicable service areas, potentially up to ~200 km depending on location, quantity and feasibility — always tell the customer to confirm their exact location with the team.
- Minimum bulk order is approximately 100 cases (subject to pack size, location, terms).
- Orders within ~10 km may qualify for free delivery, subject to conditions; otherwise delivery charges depend on location, quantity and order type.
- Customers can order via the TiTAS website or WhatsApp, subject to availability.
- Payment methods: UPI, credit/debit cards, net banking, supported wallets, payment links, bank transfer for eligible bulk orders, and cash on delivery where available.
- Dealers/distributors/wholesalers/retailers are welcome to enquire — direct them to contact the TiTAS team with their business details and location.

PURIFICATION (high level only — do not invent technical specifics beyond this):
TiTAS water goes through a multi-stage process: raw water extraction, sand and carbon filtration, nano-filtration, reverse osmosis, mineral dosing, UV treatment and ozonisation, before automatic bottle filling and packaging. If asked for exact technical parameters not listed here, say you don't have that level of detail and suggest contacting TiTAS.

QUALITY:
TiTAS water has been lab-tested (microbiological, organoleptic/physical, and chemical parameters) by an independent testing laboratory. FSSAI licence and GST registration are currently PENDING, not yet obtained — never claim TiTAS holds any certification, licence, ISI mark or award unless a customer says otherwise; if asked, say licensing is in progress.

CONTACT:
Phone/WhatsApp and email are available via the Contact page on the TiTAS website; direct customers there or to the FAQs page for the exact current details rather than guessing a number.

STRICT RULES:
- Never invent prices, delivery charges, delivery time promises, certifications, licences, refund policies, water-quality claims, company history or contact details beyond what's given above.
- Never claim an order, payment, refund or address change has been completed — you have no access to orders, payments or customer accounts. Direct such requests to the Account page or TiTAS support.
- Keep answers concise, friendly and customer-service appropriate — a few short sentences, not an essay.
- You are informational only. Do not ask for or reference the customer's name, email, phone, password, address or payment details.`;

type ChatTurn = { role: "user" | "model"; text: string };

interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const FRIENDLY_ERROR =
  "Sorry, I'm having trouble responding right now. Please try again or visit our FAQs.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured for this Edge Function.");
    return json({ error: FRIENDLY_ERROR }, 500);
  }

  // --- Identify the caller, login optional ---------------------------------
  // Logged-in visitors get resolved to their user id purely for a more
  // precise per-user rate-limit bucket; a logged-out visitor is still fully
  // served, just rate-limited by IP instead.
  const authHeader = req.headers.get("Authorization");
  let rateLimitKey: string | null = null;
  if (authHeader) {
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (user) {
      rateLimitKey = `user:${user.id}`;
      console.log("[chat-assistant] authenticated user", user.id);
    }
  }
  if (!rateLimitKey) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    rateLimitKey = `ip:${ip}`;
  }

  // --- Rate limit (Part 9.6) ------------------------------------------
  if (isRateLimited(rateLimitKey)) {
    return json(
      { error: "You're sending messages a little too fast — please wait a moment and try again." },
      429,
    );
  }

  // --- Validate the request body (Part 9.7, 9.2, 9.3) ----------------------
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return json({ error: "Please type a message." }, 400);
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json(
      { error: `Please keep messages under ${MAX_MESSAGE_LENGTH} characters.` },
      400,
    );
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: ChatTurn[] = rawHistory
    .filter(
      (t): t is ChatTurn =>
        !!t &&
        typeof t === "object" &&
        (t.role === "user" || t.role === "model") &&
        typeof t.text === "string" &&
        t.text.length <= MAX_MESSAGE_LENGTH,
    )
    .slice(-MAX_HISTORY_TURNS * 2); // user+model pairs

  // --- Call Gemini (server-side only) --------------------------------------
  const contents = [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  console.log(
    "[chat-assistant] calling Gemini",
    JSON.stringify({ model: GEMINI_MODEL, historyTurns: history.length, messageLength: message.length }),
  );

  try {
    const geminiRes = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: 0.4,
        },
      }),
    });

    console.log("[chat-assistant] Gemini responded", geminiRes.status);

    if (geminiRes.status === 429) {
      return json(
        { error: "TiTAS Assistant is a little busy right now. Please try again shortly." },
        429,
      );
    }
    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("[chat-assistant] Gemini API error", geminiRes.status, errText);
      return json({ error: FRIENDLY_ERROR }, 502);
    }

    const data = await geminiRes.json();
    const reply: string | undefined =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ||
      undefined;

    if (!reply) {
      console.error("[chat-assistant] Gemini returned no usable text", JSON.stringify(data));
      return json({ error: FRIENDLY_ERROR }, 502);
    }

    return json({ reply: reply.trim() });
  } catch (err) {
    console.error("[chat-assistant] unexpected error", err);
    return json({ error: FRIENDLY_ERROR }, 500);
  }
});
