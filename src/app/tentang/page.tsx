import Image from "next/image";
import Link from "next/link";

export default function TentangPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-8 w-full flex-1 flex flex-col gap-12">
        {/* Header Tentang */}
        <div className="text-center mt-10">
          <h1 className="font-gohan text-5xl text-gema-navy mb-6">Tentang Gema Imam</h1>
          <div className="w-24 h-1.5 bg-gema-tosca rounded-full mx-auto mb-8" />
          <p className="font-gilroy font-medium text-xl text-gema-ocean leading-relaxed">
            Gema Imam lahir dari semangat untuk mendemokratisasi pendidikan melalui teknologi, 
            menjadikan proses belajar yang adaptif, interaktif, dan inklusif.
          </p>
        </div>

        {/* Konten Utama */}
        <div className="bg-white p-10 lg:p-14 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
          
          <section>
            <h2 className="font-gohan text-3xl text-gema-navy mb-4">Misi Kami</h2>
            <p className="font-gilroy font-medium text-gema-ocean text-lg leading-relaxed">
              Kami percaya bahwa setiap individu memiliki potensi yang tak terbatas. 
              Misi kami adalah menyediakan wadah belajar yang tidak hanya fokus pada teori, 
              tetapi juga memvisualisasikan materi agar lebih mudah dicerna, menyenangkan, 
              serta dapat disesuaikan dengan ritme belajar masing-masing pengguna.
            </p>
          </section>

          <section>
            <h2 className="font-gohan text-3xl text-gema-navy mb-4">Nilai-Nilai Utama</h2>
            <ul className="flex flex-col gap-4 mt-2">
              {[
                { title: "Inovatif", desc: "Terus mengembangkan cara baru yang efektif dalam belajar." },
                { title: "Inklusif", desc: "Akses pembelajaran yang dapat dijangkau oleh siapapun." },
                { title: "Interaktif", desc: "Belajar dua arah melalui studi kasus dan evaluasi gamifikasi." },
              ].map((nilai, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 shrink-0 bg-gema-tosca rounded-lg flex items-center justify-center text-white font-gohan font-bold text-xl">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-gilroy font-extrabold text-lg text-gema-navy">{nilai.title}</h3>
                    <p className="font-gilroy font-medium text-gema-ocean">{nilai.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* CTA */}
        <div className="bg-gema-navy text-white rounded-3xl p-10 mt-10 text-center flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gema-mint opacity-20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gema-sky opacity-20 rounded-full blur-2xl" />
          
          <div className="relative z-10 w-48 h-48 mb-[-2rem]">
            <Image
              src="/images/mascot-book.svg"
              alt="Mascot Book"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>

          <h3 className="font-gohan text-3xl relative z-10">Siap untuk Memulai Petualanganmu?</h3>
          <p className="font-gilroy font-medium text-gema-sky text-lg max-w-xl relative z-10">
            Bergabunglah sekarang dan rasakan pengalaman belajar yang berbeda dari sebelumnya.
          </p>
          <Link 
            href="/modul" 
            className="mt-2 relative z-10 px-8 py-4 rounded-xl bg-gema-tosca text-white font-gilroy font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-md"
          >
            Mulai Belajar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
