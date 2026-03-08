import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.\n" +
    "Copy .env.example to .env and fill in your Supabase project credentials."
  );
}

// Server-side Supabase client using the service role key.
// This bypasses Row Level Security — keep this key server-side only, never in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
