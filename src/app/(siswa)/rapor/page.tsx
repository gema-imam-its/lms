import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";
import { UserCircle2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

// Server Component (can be made dynamic)
export const revalidate = 0;

export default async function DaftarSiswaRapor() {
  const supabase = createSupabaseServerClient();
  
  // Server Action untuk tambah siswa
  async function tambahSiswa(formData: FormData) {
    "use server";
    const nama = formData.get("nama") as string;
    const kelas = formData.get("kelas") as string;
    
    if (!nama) return;
    
    const supabaseServer = createSupabaseServerClient();
    const { error } = await supabaseServer.from("imams").insert([{ nama, kelas }]);
    
    if (error) {
      console.error("Gagal tambah siswa:", error);
      // Anda bisa melihat error ini di terminal tempat Next.js (npm run dev) berjalan.
    }

    revalidatePath("/rapor");
  }

  // Ambil daftar imam/siswa dari Supabase
  const { data: imams, error } = await supabase
    .from("imams")
    .select("*")
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
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
              <input type="text" id="nama" name="nama" required placeholder="Contoh: Budi" className="w-full min-h-[48px] px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gema-tosca outline-none font-gilroy" />
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="kelas" className="block text-sm font-gilroy font-bold text-gray-600 mb-1">Kelas</label>
              <input type="text" id="kelas" name="kelas" placeholder="Contoh: 1A" className="w-full min-h-[48px] px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gema-tosca outline-none font-gilroy" />
            </div>
            <button type="submit" className="w-full sm:w-auto min-h-[48px] px-8 bg-gema-tosca text-white rounded-xl font-gohan font-bold hover:bg-gema-navy transition-colors flex items-center justify-center gap-2">
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
            {imams.map((imam) => (
              <Link 
                href={`/rapor/siswa/${imam.id}`}
                key={imam.id}
                className="group flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-gema-tosca border-4 border-transparent transition-all hover:-translate-y-2"
              >
                <div className="w-24 h-24 bg-gema-sky/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <UserCircle2 size={64} className="text-gema-navy" strokeWidth={1.5} />
                </div>
                <h2 className="font-gohan text-2xl text-gema-navy font-bold text-center mb-2">
                  {imam.nama}
                </h2>
                <div className="px-4 py-1 bg-gray-100 rounded-full font-gilroy text-gray-600 text-sm font-semibold">
                  Kelas: {imam.kelas || "-"}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
