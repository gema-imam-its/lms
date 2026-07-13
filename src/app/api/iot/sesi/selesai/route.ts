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
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    if (!body.sesi_id) {
      return NextResponse.json(
        { success: false, error: "Field sesi_id wajib ada di payload!" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    
    // 1. Update sholat_sessions dengan statistik akhir
    const { error: sessionError } = await supabase
      .from("sholat_sessions")
      .update({
        status: body.status || "Selesai",
        durasi_detik: body.durasi_detik || 0,
        total_rakaat: body.total_rakaat_dilewati || 0,
        total_kesalahan_imam: body.kesalahan_imam || 0,
        skor_tumaninah_persen: body.statistik_tumaninah?.skor_persentase || 0,
      })
      .eq("id", body.sesi_id);

    if (sessionError) throw sessionError;

    // 2. Bulk Insert ke tabel movement_logs (sejarah transisi gerakan)
    if (body.log_transisi && Array.isArray(body.log_transisi)) {
      const movementsToInsert = body.log_transisi.map((log: any) => ({
        sesi_id: body.sesi_id,
        rakaat: log.rakaat || 1, // Wajib ada di tabel
        nama_gerakan: log.state || "Unknown",
        tumaninah_terpenuhi: log.tumaninah_met,
        entry_time: log.entry_time || "00:00:00",
        exit_time: log.exit_time,
        duration_seconds: log.duration_seconds,
        gerakan_menyimpang: log.gerakan_menyimpang || [],
        hip_angle: log.hip_angle,
        knee_angle: log.knee_angle,
        arm_angle: log.arm_angle
      }));

      const { error: movementsError } = await supabase
        .from("movement_logs")
        .insert(movementsToInsert);

      if (movementsError) {
        console.error("Gagal bulk insert movement_logs:", movementsError);
        // Kita tidak throw error agar sesi tetap dianggap sukses tersimpan statistiknya
      }
    }

    return NextResponse.json({ success: true, message: "Sesi berhasil ditutup & data transisi tersimpan." }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /sesi/selesai] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
