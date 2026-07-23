import type { SupabaseClient } from "@supabase/supabase-js";

// Ambang batas sesi ACTIVE/PENDING dianggap "macet" (mis. Orange Pi
// crash/mati listrik sebelum sempat memanggil /api/iot/sesi/selesai).
export const STALE_SESSION_MINUTES = 45;

export interface BlockingSession {
  id: string;
  imamId: string;
  studentName: string;
  ageMinutes: number;
  isStale: boolean;
}

/**
 * Cari sesi PENDING/ACTIVE tertua di SELURUH sistem — secara fisik cuma ada
 * satu Orange Pi/kamera, jadi hanya boleh ada satu sesi non-terminal pada
 * satu waktu. Dipakai untuk memberi pesan yang jelas ke guru sebelum mereka
 * mencoba memulai sesi baru untuk siswa lain saat alat masih dipakai.
 */
export async function findBlockingSession(
  supabase: SupabaseClient
): Promise<BlockingSession | null> {
  const { data, error } = await supabase
    .from("sholat_sessions")
    .select("id, imam_id, created_at, imams(nama)")
    .in("status", ["PENDING", "ACTIVE"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const ageMinutes = (Date.now() - new Date(data.created_at).getTime()) / 60000;
  const imams = data.imams as unknown;
  const studentName = Array.isArray(imams)
    ? (imams[0] as { nama?: string } | undefined)?.nama
    : (imams as { nama?: string } | null)?.nama;

  return {
    id: data.id as string,
    imamId: data.imam_id as string,
    studentName: studentName || "siswa lain",
    ageMinutes,
    isStale: ageMinutes >= STALE_SESSION_MINUTES,
  };
}

/**
 * Cek apakah sesi (dilihat dari `created_at`-nya) sudah melewati ambang
 * batas "macet". Fungsi biasa (bukan komponen) supaya panggilan Date.now()
 * di sini tidak melanggar aturan purity komponen React saat dipakai di
 * body Server Component.
 */
export function isSessionStale(createdAt: string): boolean {
  return (Date.now() - new Date(createdAt).getTime()) / 60000 >= STALE_SESSION_MINUTES;
}
