import { NextRequest, NextResponse } from "next/server";
import { requireGuru } from "@/lib/auth-guru";
import { getLatestFrame, requestPreview } from "@/lib/previewChannel";

export const dynamic = "force-dynamic";

/**
 * GET /api/preview/frame
 *
 * Guru-facing (session-cookie auth via requireGuru(), NOT x-api-key —
 * this lives outside /api/iot/* on purpose since it's consumed by the
 * browser, not the Orange Pi). Polled directly as an <img> src on an
 * interval by the "Lihat Kamera" panel.
 *
 * proxy.ts's guru matcher only covers /rapor pages, not arbitrary API
 * routes, so this route must self-check — requireGuru() here is the only
 * thing gating it.
 *
 * Every call both reads AND re-arms the preview window (requestPreview()),
 * so simply polling this while the panel is open is what keeps telling the
 * Orange Pi (via /api/iot/status) to keep sending frames — closing the
 * panel/tab stops the polling and lets it lapse on its own.
 */
export async function GET(_req: NextRequest) {
  await requireGuru();

  requestPreview();

  const frame = getLatestFrame();
  if (!frame) {
    return NextResponse.json(
      { error: "Belum ada frame — menunggu kamera mengirim gambar pertama." },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(frame.buffer), {
    status: 200,
    headers: {
      "Content-Type": frame.contentType,
      "Cache-Control": "no-store",
      "X-Captured-At": String(frame.capturedAt),
    },
  });
}
