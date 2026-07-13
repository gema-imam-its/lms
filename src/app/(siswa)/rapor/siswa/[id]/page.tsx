import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Activity } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function DaftarSesiSiswa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;
  const supabase = createSupabaseServerClient();

  // Server action untuk men-trigger Orange Pi
  async function mulaiPraktikSekarang() {
    "use server";
    const supabaseServer = createSupabaseServerClient();
    
    // Kita buat sesi dengan status PENDING
    // Nanti script Python Orange Pi akan mendeteksi baris PENDING ini
    await supabaseServer.from("sholat_sessions").insert({
      imam_id: studentId,
      nama_sholat: "Latihan",
      tanggal: new Date().toISOString(),
      status: "PENDING", 
      durasi_detik: 0,
      total_rakaat: 0,
      total_kesalahan_imam: 0,
      skor_tumaninah_persen: 0
    });
    
    revalidatePath(`/rapor/siswa/${studentId}`);
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

  // Cek apakah ada sesi yang masih PENDING atau ACTIVE
  const isSesiBerjalan = sessions?.some(s => s.status === "PENDING" || s.status === "ACTIVE");

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
              <p className="font-gilroy text-gray-600">
                {isSesiBerjalan 
                  ? "Sesi sedang berlangsung! Alat IoT sedang merekam di depan..." 
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

            <form action={mulaiPraktikSekarang}>
              <button 
                type="submit"
                disabled={isSesiBerjalan}
                className={`px-8 py-4 rounded-full font-gohan text-xl font-bold transition-all shrink-0 ${
                  isSesiBerjalan 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gema-tosca text-white hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {isSesiBerjalan ? "Sedang Merekam..." : "+ Mulai Sesi Baru"}
              </button>
            </form>
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
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              });
              const formattedTime = date.toLocaleTimeString("id-ID", {
                hour: '2-digit', minute: '2-digit'
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
                      <form action={async () => {
                        "use server";
                        const supabaseServer = createSupabaseServerClient();
                        await supabaseServer.from("sholat_sessions").delete().eq("id", session.id);
                        revalidatePath(`/rapor/siswa/${studentId}`);
                      }}>
                        <button type="submit" className="min-h-[48px] px-6 border-2 border-red-100 text-red-500 rounded-xl font-gohan font-bold hover:bg-red-50 hover:border-red-200 transition-colors w-full sm:w-auto">
                          Hapus
                        </button>
                      </form>
                      
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
