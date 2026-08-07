// In-memory, server-only "live" camera preview channel — deliberately not
// persisted anywhere (no DB row, no Cloudinary upload). This is a live look
// for positioning, not an archival record, and only works because prod runs
// as one persistent Node container (docker-compose.prod.yml), not
// serverless — module state here survives across requests in that process.
//
// No per-session/per-imam keying: the one-active-session DB constraint
// already guarantees there's only ever one physical camera in play system-
// wide, so a single global "latest frame" is all that's needed.

const PREVIEW_TTL_MS = 90_000;
const MAX_FRAME_BYTES = 500 * 1024;

let requestedUntil = 0;
let latestFrame: { buffer: Buffer; contentType: string; capturedAt: number } | null = null;

/**
 * Marks the preview as wanted for the next PREVIEW_TTL_MS. Called both when
 * a guru first opens the preview panel and on every subsequent frame poll
 * from their browser — each poll is itself proof someone is still watching,
 * so it doubles as the heartbeat that keeps pushing the expiry forward.
 * Closing the panel/tab means no more polls, so this naturally lapses
 * without needing an explicit "stop" action.
 */
export function requestPreview() {
  requestedUntil = Date.now() + PREVIEW_TTL_MS;
}

/** Polled by the Orange Pi (via /api/iot/status) to know whether to start sending frames. */
export function isPreviewRequested(): boolean {
  return Date.now() < requestedUntil;
}

/** Rejects oversized frames so a misbehaving/misconfigured client can't grow server memory unbounded. */
export function storeFrame(
  buffer: Buffer,
  contentType: string,
): { ok: true } | { ok: false; reason: string } {
  if (buffer.byteLength > MAX_FRAME_BYTES) {
    return { ok: false, reason: "Frame melebihi batas ukuran" };
  }
  latestFrame = { buffer, contentType, capturedAt: Date.now() };
  return { ok: true };
}

export function getLatestFrame() {
  return latestFrame;
}
