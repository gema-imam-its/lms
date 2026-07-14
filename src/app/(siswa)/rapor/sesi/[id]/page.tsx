import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

export default async function DetailSesiRapor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = await params;
  const supabase = createSupabaseServerClient();

  // 1. Ambil data sesi + data imam (siswa)
  const { data: session, error: sessionError } = await supabase
    .from("sholat_sessions")
    .select(`
      *,
      imams (id, nama, kelas)
    `)
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return <div className="p-8 text-center">Data sesi tidak ditemukan.</div>;
  }

  // 2. Ambil detail gerakan (movement_logs)
  // Urutkan berdasarkan `urutan` (index asli dari log_transisi Orange Pi) —
  // entry_time bisa disanitasi ke "00:00:00" saat data AI tidak valid, jadi
  // tidak bisa diandalkan sendirian untuk urutan timeline. Baris lama
  // (sebelum kolom `urutan` ada) fallback ke entry_time.
  const { data: movements, error: movementsError } = await supabase
    .from("movement_logs")
    .select("*")
    .eq("sesi_id", sessionId)
    .order("urutan", { ascending: true, nullsFirst: false })
    .order("entry_time", { ascending: true });

  const imamsData = session.imams as any;
  const student = Array.isArray(imamsData) ? imamsData[0] : imamsData;
  const score = session.skor_tumaninah_persen || 0;
  
  // Evaluasi UI
  let mascot = "/images/mascot-hello.svg";
  let titleMessage = "Hebat Sekali!";
  let subtitleMessage = "Pertahankan gerakan sholatmu ya!";
  let headerColor = "bg-green-500";
  
  if (score < 50) {
    mascot = "/images/mascot-book.svg";
    titleMessage = "Ayo Semangat Latihan!";
    subtitleMessage = "Masih ada beberapa gerakan yang perlu diperbaiki.";
    headerColor = "bg-orange-500";
  } else if (score < 80) {
    mascot = "/images/mascot.svg";
    titleMessage = "Sudah Bagus!";
    subtitleMessage = "Sedikit lagi sempurna, perhatikan detail gerakannya ya.";
    headerColor = "bg-gema-tosca";
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Top Banner (Score) */}
      <div className={`w-full ${headerColor} pt-36 pb-24 px-4 relative overflow-hidden mt-[-80px]`}>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex-1">
            <Link 
              href={`/rapor/siswa/${student?.id}`}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-gohan font-bold mb-8 transition-all backdrop-blur-sm gap-2 w-full sm:w-auto"
            >
              <ArrowLeft size={20} /> Kembali ke Riwayat
            </Link>
            <h1 className="font-gohan text-4xl md:text-5xl font-bold mb-2">
              {titleMessage}
            </h1>
            <p className="font-gilroy text-xl opacity-90 mb-8">
              {subtitleMessage}
            </p>
            <div className="inline-block bg-white/20 px-6 py-3 rounded-2xl font-gohan text-xl backdrop-blur-sm">
              Skor Keseluruhan: <span className="font-bold text-3xl ml-2">{score}%</span>
            </div>
          </div>
          
          <div className="w-48 h-48 relative shrink-0 drop-shadow-2xl">
            <Image src={mascot} alt="Mascot Feedback" fill className="object-contain" />
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-8 flex flex-wrap gap-8 justify-between">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Siswa</div>
            <div className="font-gohan text-2xl text-gema-navy">{student?.nama || "-"}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Materi</div>
            <div className="font-gohan text-2xl text-gema-navy">Sholat {session.nama_sholat}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Kesalahan</div>
            <div className="font-gohan text-2xl text-orange-500">{session.total_kesalahan_imam} kali</div>
          </div>
        </div>

        {/* Timeline Gerakan */}
        <h2 className="font-gohan text-2xl text-gray-700 mb-6">Detail Evaluasi Tiap Gerakan</h2>
        
        {movementsError ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border-2 border-red-100">
            <p className="font-gilroy text-red-500">Gagal memuat rincian gerakan: {movementsError.message}</p>
          </div>
        ) : (!movements || movements.length === 0) ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm">
            <p className="font-gilroy text-gray-500">Belum ada rincian gerakan terekam.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
            <div className="relative border-l-4 border-gray-100 ml-6 md:ml-8 space-y-10 py-4">
              
              {movements.map((mov, index) => {
                // Tentukan status UI
                // Karena tumaninah_terpenuhi bersifat nullable (bool | null), kita cek eksplisit
                const isCorrect = mov.tumaninah_terpenuhi === true;
                const isWrong = mov.tumaninah_terpenuhi === false;
                const isNeutral = mov.tumaninah_terpenuhi === null;
                
                let iconColor = isNeutral ? "bg-gray-300" : (isCorrect ? "bg-green-500" : "bg-orange-500");
                
                // Pesan Feedback (Pedagogical & Informatif)
                let feedbackText = "";
                if (isCorrect) {
                  feedbackText = "Sempurna! Anda menahan postur ini dengan tenang (Tuma'ninah tercapai).";
                } else if (isWrong) {
                  feedbackText = "Gerakan terlalu cepat (Tuma'ninah belum tercapai).";
                } else {
                  // isNeutral (Transisi seperti Sedekap, Berdiri)
                  feedbackText = "Postur transisi terekam dengan durasi yang wajar.";
                }
                    
                // Kalau ada gerakan_menyimpang, tambahkan sebagai catatan perbaikan
                if (mov.gerakan_menyimpang && mov.gerakan_menyimpang.length > 0) {
                  const penyimpangan = mov.gerakan_menyimpang.join(", ");
                  feedbackText += ` Catatan Postur: ${penyimpangan}.`;
                }

                // Coba match nama gerakan dengan gambar yang ada
                const gerakanClean = mov.nama_gerakan.toLowerCase();
                let imgUrl = "/images/mascot.svg"; // fallback
                if (gerakanClean.includes("berdiri") || gerakanClean.includes("takbir")) imgUrl = "/images/modul/gerakan-berdiri.png";
                if (gerakanClean.includes("sedekap") || gerakanClean.includes("fatihah")) imgUrl = "/images/modul/gerakan-sedekap.png";
                if (gerakanClean.includes("rukuk")) imgUrl = "/images/modul/gerakan-rukuk.png";
                if (gerakanClean.includes("itidal")) imgUrl = "/images/modul/gerakan-itidal.png";
                if (gerakanClean.includes("sujud")) imgUrl = "/images/modul/gerakan-sujud.png";
                if (gerakanClean.includes("duduk") || gerakanClean.includes("tahiyat")) imgUrl = "/images/modul/gerakan-duduk.png";
                if (gerakanClean.includes("salam")) imgUrl = "/images/modul/gerakan-salam.png";

                return (
                  <div key={mov.id} className="relative pl-8 md:pl-12">
                    {/* Node di garis vertikal */}
                    <div className={`absolute -left-[14px] top-2 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${iconColor}`}>
                      {isCorrect && <CheckCircle2 size={12} className="text-white" />}
                      {isWrong && <XCircle size={12} className="text-white" />}
                    </div>
                    
                    <div className={`border-2 rounded-2xl p-6 flex flex-col md:flex-row gap-6 transition-all ${
                      isWrong ? "border-orange-200 bg-orange-50/30" : "border-gray-100 hover:border-gray-200"
                    }`}>
                      
                      {/* Thumbnail Gambar Pose */}
                      <div className="w-24 h-24 relative bg-white rounded-xl border-2 border-gray-100 p-2 shrink-0 self-start md:self-center">
                        <Image src={mov.foto_pose_url || imgUrl} alt={mov.nama_gerakan} fill className="object-contain" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2 gap-2">
                          <h3 className="font-gohan text-2xl text-gema-navy capitalize flex items-center gap-3">
                            {mov.nama_gerakan}
                            <span className="text-sm font-gilroy text-gray-400 font-normal mt-1">
                              ({mov.entry_time} - {mov.exit_time || (mov.exit_reason === "CANCELLED" ? "Dibatalkan" : mov.exit_reason === "NORMAL_FINISH" ? "Selesai" : "-")})
                            </span>
                          </h3>
                          <span className="font-gilroy text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                            {mov.duration_seconds != null ? `${mov.duration_seconds} detik` : "-"}
                          </span>
                        </div>

                        <p className={`font-gilroy text-lg ${isWrong ? "text-orange-600" : "text-gray-600"}`}>
                          {feedbackText}
                        </p>

                        {/* Sudut sendi untuk guru (debug info) */}
                        <div className="mt-4 flex gap-4 text-xs font-gilroy text-gray-400 border-t border-gray-100 pt-3">
                          {mov.hip_angle != null && <span>Panggul: {mov.hip_angle}°</span>}
                          {mov.knee_angle != null && <span>Lutut: {mov.knee_angle}°</span>}
                          {mov.arm_angle != null && <span>Lengan: {mov.arm_angle}°</span>}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
