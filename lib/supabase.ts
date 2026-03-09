import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Log clearly but don't throw at module load — throwing here crashes the
  // Vercel serverless function before Express can return a proper error response.
  console.error(
    "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
    "Add these to your Vercel project environment variables or local .env file."
  );
}

// Server-side Supabase client using the service role key.
// This bypasses Row Level Security — keep this key server-side only, never in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseKey ?? "placeholder",
  { auth: { persistSession: false } }
);
