import { NextRequest, NextResponse } from "next/server";
import { validateIoTApiKey } from "@/lib/auth-iot";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic'; // Selalu ambil data terbaru

export async function GET(req: NextRequest) {
  // 1. Validasi API Key
  const authError = validateIoTApiKey(req);
  if (authError) return authError;

  try {
    const supabase = createSupabaseServerClient();
    
    // Cari sesi yang statusnya PENDING
    const { data, error } = await supabase
      .from("sholat_sessions")
      .select("id, imam_id, imams(nama)")
      .eq("status", "PENDING")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // Tidak ada sesi yang PENDING
      return NextResponse.json({ status: "idle" }, { status: 200 });
    }

    // Jika ada sesi PENDING, ubah statusnya jadi ACTIVE dan suruh Orange Pi merekam
    await supabase
      .from("sholat_sessions")
      .update({ status: "ACTIVE" })
      .eq("id", data.id);

    const studentName = Array.isArray(data.imams) 
      ? data.imams[0]?.nama 
      : data.imams?.nama;

    return NextResponse.json({
      status: "active",
      session_id: data.id,
      student_name: studentName || "Siswa",
    }, { status: 200 });

  } catch (err: unknown) {
    console.error("[API /status] Error:", err);
    return NextResponse.json(
      { status: "idle", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
