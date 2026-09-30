import { createClient } from "@supabase/supabase-js";

/**
 * Single shared Supabase client for the whole app. Only the public
 * (publishable/anon) key is ever used here — it's safe in the browser
 * because every table it can reach is protected by Row Level Security.
 * Never import a service-role/secret key into frontend code.
 */

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Set them in your .env file (see .env.example).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
