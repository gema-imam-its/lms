import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for Client Components (e.g. a client-side logout).
 * Uses the anon/publishable key and reads the same auth cookies the server
 * client writes.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
