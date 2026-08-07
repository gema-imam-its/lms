import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createServiceClient } from "@/lib/supabase/service";
import { isPreviewRequested } from "@/lib/previewChannel";

export const dynamic = 'force-dynamic'; // Selalu ambil data terbaru

interface ImamNameRelation {
  nama: string;
}

export async function GET(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    const supabase = createServiceClient();

    // Mode "cek sesi berjalan": dipanggil oleh Orange Pi SELAMA merekam
    // (bukan saat standby) untuk tahu apakah sesi ini sudah dibatalkan dari
    // web (tombol "Batalkan Sesi") sementara alat masih merekam.
    const checkSessionId = req.nextUrl.searchParams.get("session_id");
    if (checkSessionId) {
      const { data: session, error: sessionError } = await supabase
        .from("sholat_sessions")
        .select("status")
        .eq("id", checkSessionId)
        .single();

      if (sessionError || !session) {
        // Sesi tidak ditemukan (mis. dihapus) — anggap tidak aktif lagi.
        return NextResponse.json(
          { active: false, status: "not_found", preview_requested: isPreviewRequested() },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          active: session.status === "ACTIVE",
          status: session.status,
          preview_requested: isPreviewRequested(),
        },
        { status: 200 }
      );
    }

    // Cari sesi yang statusnya PENDING (FIFO — sesi terlama duluan)
    const { data, error } = await supabase
      .from("sholat_sessions")
      .select("id, imam_id, imams(nama)")
      .eq("status", "PENDING")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      // Tidak ada sesi yang PENDING
      return NextResponse.json(
        { status: "idle", preview_requested: isPreviewRequested() },
        { status: 200 },
      );
    }

    // Jika ada sesi PENDING, ubah statusnya jadi ACTIVE dan suruh Orange Pi merekam
    await supabase
      .from("sholat_sessions")
      .update({ status: "ACTIVE" })
      .eq("id", data.id);

    const imams = data.imams as ImamNameRelation | ImamNameRelation[] | null;
    const studentName = Array.isArray(imams) 
      ? imams[0]?.nama 
      : imams?.nama;

    return NextResponse.json({
      status: "active",
      session_id: data.id,
      student_name: studentName || "Siswa",
      preview_requested: isPreviewRequested(),
    }, { status: 200 });

  } catch (err: unknown) {
    console.error("[API /status] Error:", err);
    return NextResponse.json(
      { status: "idle", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
