"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function MasukPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="font-gohan text-2xl font-bold text-gema-navy">
          Masuk Guru
        </h1>
        <p className="mt-2 font-gilroy text-sm text-gema-navy/60">
          Area laporan untuk guru &amp; orang tua.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-gilroy text-sm font-medium text-gema-navy">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="min-h-12 rounded-xl border-2 border-gema-navy/15 px-4 font-gilroy text-gema-navy focus:border-gema-tosca focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-gilroy text-sm font-medium text-gema-navy">
            Kata Sandi
          </span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="min-h-12 rounded-xl border-2 border-gema-navy/15 px-4 font-gilroy text-gema-navy focus:border-gema-tosca focus:outline-none"
          />
        </label>

        {state?.error && (
          <p className="font-gilroy text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="min-h-12 rounded-full bg-gema-tosca px-6 font-gilroy font-semibold text-white transition hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-gema-tosca/40 disabled:opacity-60"
        >
          {pending ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </section>
  );
}
