import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Guru-only path prefixes. Everything else (student zone + /masuk) is public.
const GURU_PREFIXES = ["/rapor"];

/**
 * Runs before every matched request. Two jobs:
 *  1. Refresh the Supabase session cookie (plumbing, so gurus don't get logged
 *     out mid-session).
 *  2. Optimistic redirects only — unauthenticated users off guru paths, and
 *     authenticated users away from the login page.
 *
 * This is NOT the security gate. The authoritative check is `requireGuru()`
 * inside each guru page and Server Action (a moved/renamed action can silently
 * fall outside this matcher — see the proxy docs).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run logic between creating the client and getUser() — Supabase
  // guidance, to avoid intermittent logouts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isGuruPath = GURU_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isGuruPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    return NextResponse.redirect(url);
  }

  if (path === "/masuk" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/rapor";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except API (IoT uses x-api-key), Next internals, and
    // static assets.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
