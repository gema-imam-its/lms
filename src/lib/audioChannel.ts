// Single shared audio channel for the whole app — narration and system
// feedback sounds both route through this, so starting any new clip always
// stops whatever was playing before it. Without this, a slide's narration
// can keep talking underneath a "Benar!" sound, or into the next slide's
// own narration, which is exactly the crashing/overlapping sound bug this
// fixes.
//
// One <audio> element is created lazily and reused for every clip for the
// rest of the session — deliberately never `new Audio(src)` per call.
// Browsers that require a user gesture before allowing audio to play
// (Safari/WebKit especially, common on school tablets/lab browsers) tie
// that "this is allowed to play" trust to the specific element, not the
// page. A fresh element per clip re-triggers the gesture requirement every
// single time, which is why auto-advancing narration silently failed to
// play on real devices even though the click that triggered it was a
// perfectly real user gesture — the play() call itself just landed on a
// brand-new, never-approved element. Reusing one element means the first
// clip that actually plays under a real click (e.g. the student manually
// tapping the mascot once) keeps that element trusted for every clip after.
let sharedAudio: HTMLAudioElement | null = null;
let generation = 0;

function getSharedAudio(): HTMLAudioElement {
  if (!sharedAudio) sharedAudio = new Audio();
  return sharedAudio;
}

export function stopCurrentAudio() {
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
  }
  generation++; // invalidates any in-flight clip's callbacks/stop closure
}

/**
 * Plays one clip, stopping anything else first. Fires onEnded when it
 * finishes naturally (not when interrupted), and onProgress (0-1) as it
 * plays, for UI that wants to sync to playback (e.g. a word-highlight
 * effect). Returns a "safe stop" — it only stops audio if this clip is
 * still the one actually playing, so a caller that stops late (e.g. a
 * slide's cleanup running after some other, newer sound already took over)
 * can't accidentally cut off that newer sound.
 */
export function playAudioClip(
  src: string,
  onEnded?: () => void,
  onProgress?: (ratio: number) => void,
): () => void {
  const audio = getSharedAudio();
  audio.pause();
  const myGen = ++generation;

  audio.ontimeupdate = onProgress
    ? () => {
        if (myGen === generation && audio.duration > 0) {
          onProgress(audio.currentTime / audio.duration);
        }
      }
    : null;

  audio.onended = () => {
    if (myGen === generation) onEnded?.();
  };

  audio.src = src;
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Autoplay blocked or file missing. Still fire onEnded — otherwise a
    // caller waiting for this clip to finish (e.g. a celebration modal
    // waiting to dismiss) would wait forever for an "ended" event that can
    // now never happen, since the clip never actually started.
    if (myGen === generation) onEnded?.();
  });

  return () => {
    if (myGen === generation) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
}

// Reuses an existing, already-shipped clip rather than a dedicated silent
// file — any real decodable source works equally well for earning trust,
// and this avoids adding a new asset just for this.
const PRIME_SRC = "/audio/system/benar.ogg";

/**
 * Best-effort unlock for the shared element — call once from the very
 * first user gesture on the page (see src/app/providers.tsx). Without
 * this, the shared element only earns playback trust once *some* clip
 * happens to play under a real click, which means the very first
 * automatic narration attempt on a freshly loaded page can still fail
 * once. Plays and pauses back-to-back so nothing audible actually escapes;
 * guarded by the generation counter so it can't stomp on a real clip that
 * starts playing on this same element before the priming play() promise
 * settles.
 */
export function primeAudioPlayback() {
  const audio = getSharedAudio();
  const myGen = ++generation;
  audio.src = PRIME_SRC;
  audio.currentTime = 0;
  audio
    .play()
    .then(() => {
      if (myGen === generation) {
        audio.pause();
        audio.currentTime = 0;
      }
    })
    .catch(() => {
      // Still blocked — fine, this was only a best-effort prime.
    });
}
