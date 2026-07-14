import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Activity } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import DeleteSesiButton from "@/components/siswa/DeleteSesiButton";
import MulaiSesiButton from "@/components/siswa/MulaiSesiButton";
import { findBlockingSession, isSessionStale } from "@/lib/sesi-guard";

export const revalidate = 0;

export default async function DaftarSesiSiswa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;
  const supabase = createSupabaseServerClient();

  // Server action untuk men-trigger Orange Pi
  async function mulaiPraktikSekarang(_prevState: { error?: string }, _formData: FormData) {
    "use server";
    const supabaseServer = createSupabaseServerClient();

    // Secara fisik cuma ada satu alat/kamera — cek dulu apakah sesi lain
    // (siswa manapun) sedang berjalan sebelum membuat sesi PENDING baru.
    // Ini hanya untuk pesan yang jelas; jaminan sebenarnya ada di partial
    // unique index `idx_one_active_session_system_wide` pada DB.
    const blocking = await findBlockingSession(supabaseServer);
    if (blocking && blocking.imamId !== studentId) {
      const menit = Math.round(blocking.ageMinutes);
      return {
        error: blocking.isStale
          ? `Alat sedang "dipakai" ${blocking.studentName} sejak ${menit} menit lalu — sesi ini kemungkinan macet. Buka halaman ${blocking.studentName} dan klik "Batalkan Sesi" untuk membebaskan alat.`
          : `Alat sedang dipakai ${blocking.studentName} (dimulai ${menit} menit lalu). Tunggu sampai sesi tersebut selesai.`,
      };
    }

    // Kita buat sesi dengan status PENDING
    // Nanti script Python Orange Pi akan mendeteksi baris PENDING ini
    const { error } = await supabaseServer.from("sholat_sessions").insert({
      imam_id: studentId,
      nama_sholat: "Latihan",
      tanggal: new Date().toISOString(),
      status: "PENDING",
      durasi_detik: 0,
      total_rakaat: 0,
      total_kesalahan_imam: 0,
      skor_tumaninah_persen: 0
    });

    if (error) {
      // Safety net untuk race langka: dua guru submit hampir bersamaan dan
      // lolos pre-check di atas — unique index di DB yang menolaknya.
      if (error.code === "23505") {
        return { error: "Alat baru saja dipakai siswa lain. Coba lagi beberapa saat." };
      }
      return { error: "Gagal memulai sesi: " + error.message };
    }

    revalidatePath(`/rapor/siswa/${studentId}`);
    return {};
  }

  // 1. Ambil data siswa
  const { data: student, error: studentError } = await supabase
    .from("imams")
    .select("*")
    .eq("id", studentId)
    .single();

  // 2. Ambil daftar sesi praktik sholat siswa ini
  const { data: sessions, error: sessionError } = await supabase
    .from("sholat_sessions")
    .select("*")
    .eq("imam_id", studentId)
    .order("tanggal", { ascending: false });

  if (studentError) {
    return <div className="p-8 text-center">Siswa tidak ditemukan.</div>;
  }

  // Query sesi gagal (bukan sekadar "belum ada sesi") — jangan lanjut render,
  // karena `sessions` juga menentukan isSesiBerjalan (status tombol Mulai Sesi).
  if (sessionError) {
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat riwayat sesi: {sessionError.message}
      </div>
    );
  }

  // Cek apakah ada sesi yang masih PENDING atau ACTIVE
  const isSesiBerjalan = sessions?.some(s => s.status === "PENDING" || s.status === "ACTIVE");
  const activeSession = sessions?.find(s => s.status === "PENDING" || s.status === "ACTIVE");
  const activeIsStale = activeSession ? isSessionStale(activeSession.created_at) : false;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-6 mb-8">
          <Link 
            href="/rapor"
            className="w-12 h-12 bg-white flex items-center justify-center rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft size={24} className="text-gema-navy" />
          </Link>
          <div>
            <h1 className="font-gohan text-3xl md:text-4xl text-gema-navy font-bold">
              Riwayat Praktik: {student.nama}
            </h1>
            <p className="font-gilroy text-gray-500">Kelas {student.kelas || "-"}</p>
          </div>
        </div>

        {/* Cta Mulai Praktik */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gema-tosca/30 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 relative shrink-0">
              <Image src="/images/mascot-hello.svg" alt="Mascot" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-gohan text-2xl text-gema-navy">Ayo Mulai Praktik!</h3>
              <p className={`font-gilroy ${activeIsStale ? "text-orange-600 font-bold" : "text-gray-600"}`}>
                {isSesiBerjalan
                  ? (activeIsStale
                      ? "Sesi ini sudah berjalan lama dan mungkin macet. Jika alat tidak lagi merekam, klik \"Batalkan Sesi\"."
                      : "Sesi sedang berlangsung! Alat IoT sedang merekam di depan...")
                  : "Alat IoT sudah siap? Klik tombol di samping untuk mulai."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {isSesiBerjalan && (
              <form action={async () => {
                "use server";
                const supabaseServer = createSupabaseServerClient();
                await supabaseServer.from("sholat_sessions")
                  .update({ status: "Dibatalkan" })
                  .in("status", ["PENDING", "ACTIVE"])
                  .eq("imam_id", studentId);
                revalidatePath(`/rapor/siswa/${studentId}`);
              }}>
                <button type="submit" className="px-6 py-4 rounded-full font-gohan text-lg font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all shrink-0">
                  Batalkan Sesi
                </button>
              </form>
            )}

            <MulaiSesiButton action={mulaiPraktikSekarang} disabled={!!isSesiBerjalan} />
          </div>
        </div>

        {/* List of Sessions */}
        <h2 className="font-gohan text-2xl text-gray-700 mb-6">Daftar Sesi Sebelumnya</h2>

        {(!sessions || sessions.length === 0) ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm">
            <p className="font-gilroy text-xl text-gray-500">{student.nama} belum pernah melakukan praktik sholat.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => {
              const date = new Date(session.tanggal);
              const formattedDate = date.toLocaleDateString("id-ID", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta'
              });
              const formattedTime = date.toLocaleTimeString("id-ID", {
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
              });

              let stars = 1;
              const score = session.skor_tumaninah_persen || 0;
              if (score >= 80) stars = 3;
              else if (score >= 50) stars = 2;

              return (
                <div 
                  key={session.id}
                  className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-gema-tosca flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <h3 className="font-gohan text-2xl text-gema-navy font-bold mb-2">
                      Sholat {session.nama_sholat}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm font-gilroy text-gray-500 mb-4 lg:mb-0">
                      <span className="flex items-center gap-1"><Calendar size={16} /> {formattedDate}</span>
                      <span className="flex items-center gap-1"><Clock size={16} /> {formattedTime}</span>
                      <span className="flex items-center gap-1"><Activity size={16} /> {session.durasi_detik} detik</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                    <div className="text-center">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Skor Tuma'ninah</div>
                      <div className="font-gohan text-3xl text-gema-tosca">{score}%</div>
                    </div>
                    
                    <div className="flex gap-1 shrink-0">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className={`text-2xl ${star <= stars ? "" : "opacity-20 grayscale"}`}>
                          ⭐
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 w-full lg:w-auto mt-4 lg:mt-0">
                      <DeleteSesiButton deleteAction={async () => {
                        "use server";
                        const supabaseServer = createSupabaseServerClient();
                        await supabaseServer.from("sholat_sessions").delete().eq("id", session.id);
                        revalidatePath(`/rapor/siswa/${studentId}`);
                      }} />

                      <Link
                        href={`/rapor/sesi/${session.id}`}
                        className="min-h-[48px] px-6 bg-gema-navy text-white rounded-xl font-gohan font-bold hover:bg-gema-tosca transition-colors flex items-center justify-center w-full sm:w-auto"
                      >
                        Detail &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
