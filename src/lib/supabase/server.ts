import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Authenticated Supabase client for Server Components, Server Actions, and
 * Route Handlers. It is bound to the request's auth cookies, so it acts *as the
 * logged-in guru* — every query it runs is subject to Row-Level Security.
 *
 * This is NOT the service-role client. For the IoT device routes that must
 * bypass RLS, use `./service.ts` instead.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `set` throws in a Server Component (cookies are read-only there).
            // The proxy refreshes the session cookie on each request, so it is
            // safe to ignore here.
          }
        },
      },
    },
  );
}
