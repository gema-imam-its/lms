import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { GerakanRequest, GerakanResponse } from "@/types/iot";

/**
 * POST /api/iot/gerakan
 *
 * Dipanggil secara real-time oleh Orange Pi setiap kali
 * state machine mengonfirmasi perubahan gerakan sholat.
 * Menyimpan satu baris log ke tabel movement_logs.
 */
export async function POST(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    // 2. Parse request body
    const body: GerakanRequest = await req.json();

    // 3. Validasi field wajib
    if (!body.sesi_id || !body.nama_gerakan || body.rakaat === undefined) {
      return NextResponse.json(
        { success: false, error: "Field sesi_id, rakaat, dan nama_gerakan wajib diisi" },
        { status: 400 }
      );
    }

    // 4. Insert ke Supabase
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("movement_logs")
      .insert({
        sesi_id: body.sesi_id,
        rakaat: body.rakaat,
        nama_gerakan: body.nama_gerakan,
        entry_time: body.entry_time,
        exit_time: body.exit_time || null,
        duration_seconds: body.duration_seconds || null,
        tumaninah_terpenuhi: body.tumaninah_terpenuhi ?? null,
        gerakan_menyimpang: body.gerakan_menyimpang || [],
        hip_angle: body.hip_angle || null,
        knee_angle: body.knee_angle || null,
        arm_angle: body.arm_angle || null,
        foto_pose_url: body.foto_pose_url || null,
      });

    if (error) {
      console.error("[API /gerakan] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 5. Return success
    const response: GerakanResponse = {
      success: true,
      message: "Gerakan tersimpan",
    };

    console.log(`[API] Log gerakan '${body.nama_gerakan}' tersimpan untuk sesi ${body.sesi_id}`);
    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /gerakan] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
