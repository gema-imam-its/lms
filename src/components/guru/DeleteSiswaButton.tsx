"use client";

import { useState, useTransition } from "react";

interface DeleteSiswaButtonProps {
  deleteAction: () => Promise<{ error?: string }>;
  studentName: string;
  sessionCount: number;
  disabled?: boolean;
  disabledReason?: string;
}

// Bigger blast radius than DeleteSesiButton (one session) — deleting a siswa
// cascades to ALL their sholat_sessions + movement_logs, so the confirm
// states the count, and a live PENDING/ACTIVE session blocks deletion
// (checked again server-side in the action itself, not just here).
export default function DeleteSiswaButton({
  deleteAction,
  studentName,
  sessionCount,
  disabled,
  disabledReason,
}: DeleteSiswaButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = confirm(
      sessionCount > 0
        ? `Hapus ${studentName} beserta ${sessionCount} sesi riwayatnya? Tindakan ini tidak bisa dikembalikan.`
        : `Hapus ${studentName}? Tindakan ini tidak bisa dikembalikan.`,
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAction();
      setError(result.error ?? null);
    });
  }

  return (
    <div className="relative z-10">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isPending}
        title={disabled ? disabledReason : undefined}
        className="min-h-12 w-full px-4 border-2 border-red-100 text-red-500 rounded-xl font-gohan text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        {isPending ? "Menghapus..." : "Hapus Siswa"}
      </button>
      {disabled && disabledReason && (
        <p className="mt-1 text-center text-xs text-gray-400 font-gilroy">
          {disabledReason}
        </p>
      )}
      {error && (
        <p className="mt-1 text-center text-xs text-red-500 font-gilroy">
          {error}
        </p>
      )}
    </div>
  );
}
