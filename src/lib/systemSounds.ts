import { playAudioClip, stopCurrentAudio } from "./audioChannel";

const SYSTEM_SOUNDS = {
  benar: "/audio/system/benar.ogg",
  belum: "/audio/system/belum.ogg",
  hampir: "/audio/system/hampir.ogg",
  ulang: "/audio/system/ulang.ogg",
  cobaLagi: "/audio/system/coba-lagi.ogg",
  berusaha: "/audio/system/berusaha.ogg",
  bintang: "/audio/system/bintang.ogg",
  selesai: "/audio/system/selesai.ogg",
} as const;

export type SystemSoundName = keyof typeof SYSTEM_SOUNDS;

/**
 * Event-triggered feedback (correct/wrong/retry/complete) — separate from
 * useNarrationPlayback, which handles per-slide narration tied to slide
 * entry. Same accessibility contract as that hook: purely supplementary, so
 * a blocked/missing file is silently swallowed rather than surfaced. Routes
 * through the shared audio channel, so playing this always stops whatever
 * narration or other system sound was playing before it.
 */
export function playSystemSound(name: SystemSoundName) {
  playSystemSounds([name]);
}

/** Plays several system sounds back-to-back (e.g. star reveal, then "selesai"). */
export function playSystemSounds(names: SystemSoundName[]) {
  const [first, ...rest] = names;
  if (!first) {
    stopCurrentAudio();
    return;
  }
  playAudioClip(SYSTEM_SOUNDS[first], () => playSystemSounds(rest));
}
