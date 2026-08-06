import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — **BYPASSES Row-Level Security**. Server-only.
 *
 * Use ONLY for the IoT device routes (`/api/iot/*`), which authenticate the
 * Orange Pi via the `x-api-key` header rather than a user session. Never import
 * this into guru-facing page/action code — doing so would defeat RLS, which is
 * the database-level backstop protecting student data.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah diisi di .env.local"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
