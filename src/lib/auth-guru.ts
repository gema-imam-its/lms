import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * The guru authorization gate. Call it at the top of **every** guru page,
 * Server Action, and Route Handler — the proxy and the `(guru)` layout are
 * optimistic helpers only, not the authoritative check.
 *
 * It uses `getUser()`, which re-verifies the JWT with Supabase's auth server —
 * never `getSession()`, which only decodes the (spoofable) cookie. Any
 * authenticated user counts as a guru (accounts are created by hand; there is
 * no public signup).
 *
 * Memoized with React `cache` so multiple calls in one render/request pass hit
 * Supabase once.
 */
export const requireGuru = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }

  return user;
});

/** Like `requireGuru`, but returns `null` instead of redirecting. */
export const getGuru = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
