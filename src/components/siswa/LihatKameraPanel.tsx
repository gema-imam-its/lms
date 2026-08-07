"use client";

import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";

// Matches the Orange Pi's own /api/iot/status poll cadence (~2-3s) closely
// enough that the preview doesn't lag noticeably — see previewChannel.ts.
const POLL_INTERVAL_MS = 1000;

/**
 * On-demand, low-fps camera preview — not video, a still frame refreshed
 * every second via /api/preview/frame. Every poll while this is open also
 * re-arms the server-side "someone is watching" window (see
 * src/lib/previewChannel.ts), which is what tells the Orange Pi (via its
 * existing /api/iot/status poll) to keep sending frames — closing this
 * panel simply stops the polling and lets that lapse on its own.
 */
export default function LihatKameraPanel() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    if (!open) return;

    const tick = () => setSrc(`/api/preview/frame?t=${Date.now()}`);
    tick();
    const interval = setInterval(tick, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [open]);

  const toggleOpen = () => {
    setOpen((v) => {
      const next = !v;
      if (!next) setHasFrame(false);
      return next;
    });
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-full lg:w-auto px-6 py-4 rounded-full font-gohan text-lg font-bold transition-all flex items-center justify-center gap-2 ${
          open
            ? "bg-gema-navy text-white hover:bg-gema-navy/90"
            : "bg-gema-tosca/10 text-gema-tosca hover:bg-gema-tosca/20"
        }`}
      >
        {open ? <X size={20} /> : <Camera size={20} />}
        {open ? "Tutup Kamera" : "Lihat Kamera"}
      </button>

      {open && (
        <div className="mt-4 rounded-2xl overflow-hidden bg-gema-navy aspect-video relative flex items-center justify-center">
          {src && (
            // Deliberately a plain <img>, not next/image — this is a
            // constantly-changing, cache-busted, unoptimizable poll target,
            // not a static asset. opacity:0 while !hasFrame hides the
            // browser's own broken-image glyph while a poll 404s (no frame
            // sent yet) — the placeholder text below is the only thing
            // that should be visible in that state, not a cracked-icon.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Pratinjau kamera langsung"
              className="w-full h-full object-contain transition-opacity"
              style={{ opacity: hasFrame ? 1 : 0 }}
              onLoad={() => setHasFrame(true)}
              onError={() => setHasFrame(false)}
            />
          )}
          {!hasFrame && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 font-gilroy text-sm text-center px-6 pointer-events-none">
              Menunggu gambar dari kamera... (bisa sampai beberapa detik)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
