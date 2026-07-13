import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { MulaiSesiRequest, MulaiSesiResponse } from "@/types/iot";

/**
 * POST /api/iot/sesi/mulai
 *
 * Dipanggil oleh Orange Pi saat kamera mendeteksi imam berdiri tegak
 * (sholat dimulai). Membuat baris baru di tabel sholat_sessions
 * dan mengembalikan sesi_id ke Orange Pi.
 */
export async function POST(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    // 2. Parse request body
    const body: MulaiSesiRequest = await req.json();

    // 3. Validasi field wajib
    if (!body.imam_id || !body.nama_sholat) {
      return NextResponse.json(
        { success: false, error: "Field imam_id dan nama_sholat wajib diisi" },
        { status: 400 }
      );
    }

    // 4. Insert ke Supabase
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("sholat_sessions")
      .insert({
        imam_id: body.imam_id,
        nama_sholat: body.nama_sholat,
        tanggal: body.timestamp || new Date().toISOString(),
        status: "Selesai", // Default, akan di-update saat selesai
        durasi_detik: 0,
        total_rakaat: 0,
        total_kesalahan_imam: 0,
        skor_tumaninah_persen: 0,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[API /sesi/mulai] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // 5. Return sesi_id
    const response: MulaiSesiResponse = {
      success: true,
      sesi_id: data.id,
    };

    console.log(`[API] Sesi sholat baru dimulai: ${data.id}`);
    return NextResponse.json(response, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[API /sesi/mulai] Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
