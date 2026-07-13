import { NextRequest, NextResponse } from "next/server";

/**
 * Validasi API Key dari header x-api-key.
 * Digunakan oleh semua endpoint /api/iot/* untuk memastikan
 * hanya Orange Pi yang terautentikasi yang bisa mengirim data.
 *
 * @returns null jika valid, NextResponse 401 jika invalid
 */
export function validateIoTApiKey(req: NextRequest): NextResponse | null {
  const apiKey = req.headers.get("x-api-key");
  const secretKey = process.env.IOT_SECRET_KEY;

  if (!secretKey) {
    console.error("[AUTH] IOT_SECRET_KEY belum diset di environment variables.");
    return NextResponse.json(
      { success: false, error: "Server misconfiguration" },
      { status: 500 }
    );
  }

  if (!apiKey || apiKey !== secretKey) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — API key tidak valid" },
      { status: 401 }
    );
  }

  // Valid — lanjutkan ke handler
  return null;
}
