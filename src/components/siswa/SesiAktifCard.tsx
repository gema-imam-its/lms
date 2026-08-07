"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, WifiOff } from "lucide-react";
import MulaiSesiButton from "./MulaiSesiButton";
import LihatKameraPanel from "./LihatKameraPanel";

type SesiStatus = "PENDING" | "ACTIVE" | null;

interface StatusResult {
  status: "PENDING" | "ACTIVE";
  isStale: boolean;
}

type MulaiSesiState = { error?: string };

// Orange Pi polls its own /api/iot/status every ~2-3s before flipping a
// session PENDING -> ACTIVE, so matching that cadence here keeps this card
// from lagging noticeably behind the moment the camera actually picks it up.
const POLL_INTERVAL_MS = 3000;

// If a session is still PENDING this long after being created, the Pi is
// most likely offline/unreachable rather than just slow to start (its own
// poll interval is ~2-3s, so this leaves generous headroom for camera/model
// init too) — past this point we stop treating "standby" as a normal
// transient state and unlock cancellation instead of leaving the guru stuck.
const PENDING_OFFLINE_TIMEOUT_MS = 20000;

export default function SesiAktifCard({
  initialStatus,
  initialIsStale,
  checkStatus,
  cancelSesi,
  mulaiSesiAction,
}: {
  initialStatus: SesiStatus;
  initialIsStale: boolean;
  checkStatus: () => Promise<StatusResult | null>;
  cancelSesi: () => Promise<void>;
  mulaiSesiAction: (
    prevState: MulaiSesiState,
    formData: FormData,
  ) => Promise<MulaiSesiState>;
}) {
  const [status, setStatus] = useState<SesiStatus>(initialStatus);
  const [isStale, setIsStale] = useState(initialIsStale);
  const [isPendingTimedOut, setIsPendingTimedOut] = useState(false);
  const [isCancelling, startCancelTransition] = useTransition();

  // Re-check status on an interval while a session is PENDING or ACTIVE, so
  // the standby -> recording transition (and an end-of-session detected
  // elsewhere, e.g. the Pi finishing or another tab cancelling) reflects here
  // without the guru needing to manually reload the page.
  useEffect(() => {
    if (!status) return;

    let cancelled = false;
    const interval = setInterval(async () => {
      const result = await checkStatus();
      if (cancelled) return;
      setStatus(result?.status ?? null);
      setIsStale(result?.isStale ?? false);
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, checkStatus]);

  // Detects "the Pi is probably offline" independently of the polling above —
  // a session can sit PENDING indefinitely if the Pi never picks it up at
  // all, and without this the guru would be stuck: cancel disabled forever,
  // and (since there's only one camera) every other student blocked too.
  useEffect(() => {
    // Gated on isPending at render time below (isLikelyOffline), so leaving
    // this flag stale-true after the session moves past PENDING is harmless
    // — no need to reset it here, which would mean calling setState
    // synchronously in the effect body.
    if (status !== "PENDING") return;
    const timeout = setTimeout(
      () => setIsPendingTimedOut(true),
      PENDING_OFFLINE_TIMEOUT_MS,
    );
    return () => clearTimeout(timeout);
  }, [status]);

  function handleCancel() {
    startCancelTransition(async () => {
      await cancelSesi();
      setStatus(null);
      setIsStale(false);
    });
  }

  const isPending = status === "PENDING";
  const isActive = status === "ACTIVE";
  const isLikelyOffline = isPending && isPendingTimedOut;
  const cancelDisabled = (isPending && !isPendingTimedOut) || isCancelling;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gema-tosca/30 flex flex-col gap-6 mb-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6 min-w-0">
        <div className="w-20 h-20 relative shrink-0">
          <Image
            src="/images/mascot-hello.svg"
            alt="Mascot"
            fill
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-gohan text-2xl text-gema-navy">
            Ayo Mulai Praktik!
          </h3>
          <p
            className={`font-gilroy flex items-center gap-2 flex-wrap ${isStale || isLikelyOffline ? "text-orange-600 font-bold" : "text-gray-600"}`}
          >
            {isPending && !isPendingTimedOut && (
              <>
                <Loader2
                  size={16}
                  className="shrink-0 animate-spin text-gema-tosca"
                  aria-hidden="true"
                />
                Alat masih standby, menunggu kamera mulai merekam...
              </>
            )}
            {isLikelyOffline && (
              <>
                <WifiOff size={16} className="shrink-0" aria-hidden="true" />
                Alat tidak merespons — sepertinya sedang offline. Anda bisa
                membatalkan sesi ini.
              </>
            )}
            {isActive &&
              (isStale
                ? 'Sesi ini sudah berjalan lama dan mungkin macet. Jika alat tidak lagi merekam, klik "Batalkan Sesi".'
                : "Sesi sedang berlangsung! Alat IoT sedang merekam di depan...")}
            {!status && "Alat IoT sudah siap? Klik tombol di samping untuk mulai."}
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 lg:w-auto lg:flex-row">
        {status && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelDisabled}
            className={`w-full lg:w-auto px-6 py-4 rounded-full font-gohan text-lg font-bold transition-all ${
              cancelDisabled
                ? "bg-red-100/50 text-red-300 opacity-50 cursor-not-allowed"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            {isCancelling ? "Membatalkan..." : "Batalkan Sesi"}
          </button>
        )}

        <MulaiSesiButton
          action={mulaiSesiAction}
          disabled={!!status}
          disabledLabel={
            isPending
              ? isPendingTimedOut
                ? "Alat Tidak Merespons"
                : "Menyiapkan..."
              : "Sedang Merekam..."
          }
        />
      </div>
      </div>

      {/* Bantu guru mengatur posisi imam di depan kamera — cuma tersedia
          selagi ada sesi PENDING/ACTIVE, karena hanya saat itu Orange Pi
          benar-benar berjalan dan bisa mengirim frame. */}
      {status && <LihatKameraPanel />}
    </div>
  );
}
