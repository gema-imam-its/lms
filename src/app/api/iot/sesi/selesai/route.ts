import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { SelesaiSesiRequest, SelesaiSesiResponse } from "@/types/iot";

/**
 * POST /api/iot/sesi/selesai
 *
 * Dipanggil oleh Orange Pi setelah sholat berakhir
 * (Salam terdeteksi) atau dibatalkan di tengah jalan.
 * Meng-update baris sesi yang sudah ada dengan ringkasan data.
 */
export async function POST(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    // 2. Parse request body
    const body: SelesaiSesiRequest = await req.json();

    // 3. Validasi field wajib
    if (!body.sesi_id || !body.status) {
      return NextResponse.json(
        { success: false, error: "Field sesi_id dan status wajib diisi" },
        { status: 400 }
      );
    }

    // 4. Update sesi di Supabase
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("sholat_sessions")
      .update({
        status: body.status,
        durasi_detik: body.durasi_detik || 0,
        total_rakaat: body.total_rakaat || 0,
        total_kesalahan_imam: body.total_kesalahan_imam || 0,
        skor_tumaninah_persen: body.skor_tumaninah_persen || 0,
      })
      .eq("id", body.sesi_id);

    if (error) {
      console.error("[API /sesi/selesai] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 5. Return success
    const response: SelesaiSesiResponse = {
      success: true,
      message: "Sesi sholat ditutup",
    };

    console.log(`[API] Sesi ${body.sesi_id} ditutup dengan status: ${body.status}`);
    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /sesi/selesai] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
