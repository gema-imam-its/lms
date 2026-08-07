"use client";

import { useEffect, type ReactNode } from "react";
import { GenderProvider } from "@/context/GenderContext";
import { primeAudioPlayback } from "@/lib/audioChannel";

// Client-side context providers mounted once at the root layout.
export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Some browsers (Safari/WebKit especially — common on school tablets
    // and locked-down lab devices) only grant audio playback trust to an
    // element once it has actually played during a real user gesture.
    // Priming on the very first tap anywhere means even the first slide's
    // auto-narration works, instead of needing one throwaway manual tap
    // first. See src/lib/audioChannel.ts for the shared element this reuses.
    //
    // Deliberately "click", not "pointerdown" — verified via a
    // --autoplay-policy=user-gesture-required Chromium run that pointerdown
    // fires before the browser has actually granted user-activation credit
    // for media playback, so priming there was itself silently blocked
    // (harmless, since a same-tick click handler elsewhere usually bails
    // this out, but not guaranteed). "click" fires after activation is
    // granted, so priming here actually succeeds instead of just hoping to.
    const prime = () => primeAudioPlayback();
    document.addEventListener("click", prime, { once: true, capture: true });
    return () => document.removeEventListener("click", prime, { capture: true });
  }, []);

  return <GenderProvider>{children}</GenderProvider>;
}
