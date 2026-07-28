"use client";

import { useActionState } from "react";

type MulaiSesiState = { error?: string };

export default function MulaiSesiButton({
  action,
  disabled,
  disabledLabel = "Sedang Merekam...",
}: {
  action: (prevState: MulaiSesiState, formData: FormData) => Promise<MulaiSesiState>;
  disabled: boolean;
  disabledLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={disabled || isPending}
          className={`w-full lg:w-auto px-8 py-4 rounded-full font-gohan text-xl font-bold transition-all ${
            disabled || isPending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gema-tosca text-white hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          {isPending ? "Memulai..." : disabled ? disabledLabel : "+ Mulai Sesi Baru"}
        </button>
      </form>
      {state.error && (
        <p className="text-red-500 text-sm font-gilroy mt-2 max-w-xs">{state.error}</p>
      )}
    </div>
  );
}
