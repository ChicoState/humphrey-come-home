/**
 * Supabase client singleton.
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from env.
 * Throws at startup if either variable is missing.
 *
 * @exports supabase — the initialized Supabase client
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Copy .env.example to .env.local and fill in your keys."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
