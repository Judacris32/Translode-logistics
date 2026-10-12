import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase keys are in .env.local. Until then the site runs on demo data. */
export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Anonymous client for the public website. It can only do what the database
 * allows a signed-out visitor to do: look up a waybill and send a quote request.
 */
export function publicClient(): SupabaseClient {
  if (!url || !anonKey) throw new Error("Supabase is not configured.");
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
