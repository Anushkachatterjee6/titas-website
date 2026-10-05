import { supabase } from "./supabase";

/** Mirrors the Edge Function's own limits so the UI can guide the customer
 *  before a request is even sent — the server still enforces these itself. */
export const CHAT_MAX_MESSAGE_LENGTH = 600;
export const CHAT_MAX_HISTORY_TURNS = 6;

export type ChatTurn = { role: "user" | "model"; text: string };

const FALLBACK_ERROR =
  "Sorry, I'm having trouble responding right now. Please try again or visit our FAQs.";

/** Calls the `chat-assistant` Edge Function. Works for logged-out visitors
 *  too — supabase-js automatically attaches the public anon key (or the
 *  user's session token, if logged in) as the request's credentials either
 *  way. No customer personal data is included in the payload, only the
 *  message text and a short slice of recent conversation turns. */
export async function sendChatMessage(
  message: string,
  history: ChatTurn[],
): Promise<{ reply: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.functions.invoke<{ reply?: string; error?: string }>(
      "chat-assistant",
      {
        body: {
          message,
          history: history.slice(-CHAT_MAX_HISTORY_TURNS * 2),
        },
      },
    );

    if (error) {
      // FunctionsHttpError etc. carry the response body separately; try to
      // surface the function's own friendly message if present.
      const context = (error as { context?: Response }).context;
      if (context) {
        try {
          const body = await context.clone().json();
          if (typeof body?.error === "string") return { reply: null, error: body.error };
        } catch {
          /* ignore — fall through to generic message */
        }
      }
      return { reply: null, error: FALLBACK_ERROR };
    }

    if (!data?.reply) {
      return { reply: null, error: data?.error || FALLBACK_ERROR };
    }

    return { reply: data.reply, error: null };
  } catch {
    return { reply: null, error: FALLBACK_ERROR };
  }
}
