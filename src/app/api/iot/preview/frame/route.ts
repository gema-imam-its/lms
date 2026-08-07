import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { storeFrame } from "@/lib/previewChannel";
import type { PreviewFrameUploadResponse } from "@/types/iot";

/**
 * POST /api/iot/preview/frame
 *
 * Menerima satu frame JPEG dari Orange Pi via multipart form-data (field
 * "file", sama seperti /api/iot/media/upload) dan menyimpannya sebagai
 * frame preview terbaru — di memori saja, bukan Cloudinary/DB, karena ini
 * cuma tampilan "live" untuk bantu guru mengatur posisi imam, bukan arsip.
 *
 * Orange Pi hanya perlu memanggil ini selama `preview_requested` bernilai
 * true pada respons /api/iot/status yang sudah dipoll setiap ~2-3 detik —
 * lihat src/lib/previewChannel.ts.
 */
export async function POST(req: NextRequest) {
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file yang diunggah" } satisfies PreviewFrameUploadResponse,
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = storeFrame(buffer, file.type || "image/jpeg");

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.reason } satisfies PreviewFrameUploadResponse,
        { status: 413 },
      );
    }

    return NextResponse.json({ success: true } satisfies PreviewFrameUploadResponse, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /iot/preview/frame] Error:", message);
    return NextResponse.json(
      { success: false, error: message } satisfies PreviewFrameUploadResponse,
      { status: 500 },
    );
  }
}
