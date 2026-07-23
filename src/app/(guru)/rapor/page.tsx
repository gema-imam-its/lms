import { createClient } from "@/lib/supabase/server";
import { requireGuru } from "@/lib/auth-guru";
import Link from "next/link";
import { UserCircle2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import DeleteSiswaButton from "@/components/guru/DeleteSiswaButton";

export const revalidate = 0;

export default async function DaftarSiswaRapor() {
  await requireGuru();
  const supabase = await createClient();

  // Server Action untuk tambah siswa
  async function tambahSiswa(formData: FormData) {
    "use server";
    await requireGuru();

    const nama = formData.get("nama") as string;
    const kelas = formData.get("kelas") as string;

    if (!nama) return;

    const supabaseServer = await createClient();
    const { error } = await supabaseServer.from("imams").insert([{ nama, kelas }]);

    if (error) {
      console.error("Gagal tambah siswa:", error);
    }

    revalidatePath("/rapor");
  }

  // Server Action untuk hapus siswa — mengecek ulang di server (bukan cuma
  // mengandalkan tombol yang di-disable di client) supaya sesi PENDING/ACTIVE
  // yang baru dibuat detik itu juga tetap memblokir penghapusan.
  async function hapusSiswa(imamId: string) {
    "use server";
    await requireGuru();
    const supabaseServer = await createClient();

    const { data: activeSession } = await supabaseServer
      .from("sholat_sessions")
      .select("id")
      .eq("imam_id", imamId)
      .in("status", ["PENDING", "ACTIVE"])
      .maybeSingle();

    if (activeSession) {
      return {
        error:
          "Tidak bisa dihapus — siswa ini sedang punya sesi yang berjalan. Selesaikan atau batalkan sesi tersebut dulu.",
      };
    }

    const { error } = await supabaseServer
      .from("imams")
      .delete()
      .eq("id", imamId);

    if (error) {
      return { error: "Gagal menghapus siswa: " + error.message };
    }

    revalidatePath("/rapor");
    return {};
  }

  // Ambil daftar imam/siswa dari Supabase, sekaligus status sesi mereka —
  // dipakai untuk pesan konfirmasi hapus (jumlah sesi) dan guard sesi aktif.
  const { data: imams, error } = await supabase
    .from("imams")
    .select("*, sholat_sessions(id, status)")
    .order("nama", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-2xl text-red-500">Gagal mengambil data siswa</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="font-gohan text-4xl md:text-5xl text-gema-navy mb-4">
          Rapor Praktik Sholat
        </h1>
        <p className="font-gilroy text-xl text-gray-600">
          Pilih nama siswa untuk melihat riwayat evaluasi praktik sholat mereka.
        </p>
      </div>

      {/* Form Tambah Siswa */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10">
        <h2 className="font-gohan text-2xl text-gema-navy mb-4">Tambah Siswa Baru</h2>
        <form action={tambahSiswa} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="nama" className="block text-sm font-gilroy font-bold text-gray-600 mb-1">Nama Siswa</label>
            <input type="text" id="nama" name="nama" required placeholder="Contoh: Budi" className="w-full min-h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gema-tosca outline-none font-gilroy" />
          </div>
          <div className="flex-1 w-full">
            <label htmlFor="kelas" className="block text-sm font-gilroy font-bold text-gray-600 mb-1">Kelas</label>
            <input type="text" id="kelas" name="kelas" placeholder="Contoh: 1A" className="w-full min-h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gema-tosca outline-none font-gilroy" />
          </div>
          <button type="submit" className="w-full sm:w-auto min-h-12 px-8 bg-gema-tosca text-white rounded-xl font-gohan font-bold hover:bg-gema-navy transition-colors flex items-center justify-center gap-2">
            <Plus size={20} /> Tambah
          </button>
        </form>
      </div>

      {(!imams || imams.length === 0) ? (
        <div className="bg-white p-8 rounded-3xl text-center shadow-sm">
          <p className="font-gilroy text-xl text-gray-500 mb-4">Belum ada siswa yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imams.map((imam) => {
            const sessions = imam.sholat_sessions as { id: string; status: string }[] | null;
            const sessionCount = sessions?.length ?? 0;
            const hasActiveSession =
              sessions?.some((s) => s.status === "PENDING" || s.status === "ACTIVE") ?? false;

            return (
              <div
                key={imam.id}
                className="group relative flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-gema-tosca border-4 border-transparent transition-all hover:-translate-y-2"
              >
                <Link
                  href={`/rapor/siswa/${imam.id}`}
                  aria-label={`Lihat riwayat ${imam.nama}`}
                  className="absolute inset-0 rounded-3xl"
                />

                <div className="w-24 h-24 bg-gema-sky/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UserCircle2 size={64} className="text-gema-navy" strokeWidth={1.5} />
                </div>
                <h2 className="font-gohan text-2xl text-gema-navy font-bold text-center mb-2">
                  {imam.nama}
                </h2>
                <div className="px-4 py-1 bg-gray-100 rounded-full font-gilroy text-gray-600 text-sm font-semibold mb-4">
                  Kelas: {imam.kelas || "-"}
                </div>

                <DeleteSiswaButton
                  deleteAction={hapusSiswa.bind(null, imam.id)}
                  studentName={imam.nama}
                  sessionCount={sessionCount}
                  disabled={hasActiveSession}
                  disabledReason={
                    hasActiveSession
                      ? "Ada sesi berjalan — selesaikan/batalkan dulu"
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
