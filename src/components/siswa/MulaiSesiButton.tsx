"use client";

import { useActionState } from "react";

type MulaiSesiState = { error?: string };

export default function MulaiSesiButton({
  action,
  disabled,
}: {
  action: (prevState: MulaiSesiState, formData: FormData) => Promise<MulaiSesiState>;
  disabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={disabled || isPending}
          className={`px-8 py-4 rounded-full font-gohan text-xl font-bold transition-all shrink-0 ${
            disabled || isPending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gema-tosca text-white hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          {isPending ? "Memulai..." : disabled ? "Sedang Merekam..." : "+ Mulai Sesi Baru"}
        </button>
      </form>
      {state.error && (
        <p className="text-red-500 text-sm font-gilroy mt-2 max-w-xs">{state.error}</p>
      )}
    </div>
  );
}
