import { createClient } from "@supabase/supabase-js";

// Admin client for server-side operations (creating users, etc.)
// Uses the service role key — NEVER expose this to the client
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
