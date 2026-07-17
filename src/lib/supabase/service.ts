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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
