import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { SelesaiSesiRequest, SelesaiSesiResponse } from "@/types/iot";

/**
 * POST /api/iot/sesi/selesai
 *
 * Dipanggil oleh Orange Pi setelah sholat berakhir
 * (Salam terdeteksi) atau dibatalkan di tengah jalan.
 * Meng-update baris sesi yang sudah ada dengan ringkasan data,
 * dan menyimpan seluruh log_transisi sebagai movement_logs —
 * keduanya dalam satu transaksi atomik lewat RPC selesaikan_sesi_sholat
 * (lihat supabase-migration-002-fixes.sql), supaya movement_logs tidak
 * pernah kosong untuk sesi yang statusnya sudah "Selesai".
 */
export async function POST(req: NextRequest) {
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    const body: SelesaiSesiRequest = await req.json();

    if (!body.sesi_id) {
      return NextResponse.json(
        { success: false, error: "Field sesi_id wajib ada di payload!" },
        { status: 400 }
      );
    }

    // Sanitasi log_transisi di sisi TypeScript (lebih mudah dibaca/diuji
    // daripada di SQL) — RPC selesaikan_sesi_sholat hanya menulis data bersih.
    const sessionStatus = body.status || "Selesai";
    const movementsToInsert = Array.isArray(body.log_transisi)
      ? body.log_transisi.map((log) => {
          const rawExit = log.exit_time;
          const isInvalidExit = rawExit === "Batal" || rawExit === "Selesai" || !rawExit;
          // Sanitize entry_time karena dari AI bisa berupa "-"
          const isInvalidEntry = log.entry_time === "-" || !log.entry_time;

          // Sanitize numerics karena AI sering kirim "-" untuk angle yang tidak valid
          const parseNumeric = (val: unknown) =>
            val === "-" || val === undefined || val === null || isNaN(parseFloat(String(val)))
              ? null
              : parseFloat(String(val));

          // exit_reason mencatat KENAPA exit_time kosong, supaya UI tidak
          // salah menampilkan gerakan yang berakhir normal ("Selesai") sebagai
          // "Batal" (dua sentinel berbeda yang dulunya sama-sama jadi null).
          let exitReason: "NORMAL_FINISH" | "CANCELLED" | null = null;
          if (isInvalidExit) {
            if (rawExit === "Batal") exitReason = "CANCELLED";
            else if (rawExit === "Selesai") exitReason = "NORMAL_FINISH";
            else {
              // Langkah terakhir dari Orange Pi biasanya kirim exit_time = null
              // (bukan string sentinel) — turunkan alasannya dari status sesi.
              exitReason = sessionStatus === "Dibatalkan" ? "CANCELLED" : "NORMAL_FINISH";
            }
          }

          return {
            rakaat: log.rakaat || 1, // Wajib ada di tabel
            nama_gerakan: log.state || "Unknown",
            tumaninah_terpenuhi: log.tumaninah_met ?? null,
            entry_time: isInvalidEntry ? "00:00:00" : log.entry_time,
            exit_time: isInvalidExit ? null : log.exit_time,
            exit_reason: exitReason,
            duration_seconds: parseNumeric(log.duration_seconds),
            gerakan_menyimpang: log.gerakan_menyimpang || [],
            hip_angle: parseNumeric(log.hip_angle),
            knee_angle: parseNumeric(log.knee_angle),
            arm_angle: parseNumeric(log.arm_angle),
            foto_pose_url: log.foto_pose_url || null,
          };
        })
      : [];

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.rpc("selesaikan_sesi_sholat", {
      p_sesi_id: body.sesi_id,
      p_status: sessionStatus,
      p_durasi_detik: body.durasi_detik || 0,
      p_total_rakaat: body.total_rakaat_dilewati || 0,
      p_total_kesalahan_imam: body.kesalahan_imam || 0,
      p_skor_tumaninah_persen: body.statistik_tumaninah?.skor_persentase || 0,
      p_movements: movementsToInsert,
    });

    if (error) {
      if (error.code === "P0002") {
        return NextResponse.json({ success: false, error: "Sesi tidak ditemukan" }, { status: 404 });
      }
      console.error("[API /sesi/selesai] RPC error:", error);
      // Jangan telan error ini — biar terdeteksi di log console IoT.
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const response: SelesaiSesiResponse = {
      success: true,
      message: "Sesi berhasil ditutup & data transisi tersimpan.",
    };
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
