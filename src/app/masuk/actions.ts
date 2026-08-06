"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string } | undefined;

/**
 * Guru login. Verifies credentials with Supabase Auth; on success the SSR
 * client writes the session cookies and we redirect into the guru zone.
 */
export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau kata sandi salah." };
  }

  // redirect() throws internally, so it must sit outside the try/return above.
  redirect("/rapor");
}

/** Guru logout — clears the session and returns to the login page. */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/masuk");
}
