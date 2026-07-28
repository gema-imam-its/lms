import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/siswa/HeroSection";
import FiturCard from "@/components/siswa/FiturCard";

const fitur = [
  {
    title: "Modul Belajar",
    description: "Belajar gerakan dan bacaan sholat langkah demi langkah, dengan kuis yang seru.",
    iconUrl: "/assets/items/quran-open.svg",
    bgColorClass: "bg-gema-sky",
    href: "/modul",
  },
  {
    title: "Rapor Praktik",
    description: "Lihat hasil dan perkembangan latihan sholatmu setiap saat.",
    iconUrl: "/assets/shapes/star-green.svg",
    bgColorClass: "bg-gema-mint",
    href: "/rapor",
  },
  {
    title: "Tentang Kami",
    description: "Kenali lebih jauh semangat di balik Gema Imam.",
    iconUrl: "/assets/architecture/lantern.svg",
    bgColorClass: "bg-gema-pink",
    href: "/tentang",
  },
];

export default function Page() {
  return (
    <div>
      <HeroSection />

      {/* Fitur Utama */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <div className="text-center mb-12">
          <h2 className="font-gohan text-4xl text-gema-navy mb-4">
            Apa yang Bisa Kamu Lakukan?
          </h2>
          <p className="font-gilroy text-lg text-gema-ocean max-w-xl mx-auto">
            Semua yang kamu butuhkan untuk belajar sholat, ada di sini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fitur.map(({ href, ...f }) => (
            <Link
              key={f.title}
              href={href}
              className="block rounded-2xl focus:outline-none focus:ring-4 focus:ring-gema-tosca/50"
            >
              <FiturCard {...f} />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Penutup */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bg-gema-navy text-white rounded-3xl pt-4 pb-12 px-10 md:px-14 text-center flex flex-col items-center gap-4 shadow-xl relative overflow-hidden border-4 border-gema-tosca/30">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gema-mint opacity-20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gema-sky opacity-20 rounded-full blur-3xl" />

          <div className="relative z-10 w-40 h-40 -mt-4 drop-shadow-xl animate-mascot-bob">
            <Image
              src="/images/mascot-hello.svg"
              alt="Mascot Gema Imam"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="font-gohan text-3xl md:text-4xl relative z-10">
            Yuk, Mulai Belajar Sholat!
          </h2>
          <p className="font-gilroy text-gema-sky text-lg max-w-xl relative z-10">
            Klik tombol di bawah ini untuk memulai modul belajar pertamamu.
          </p>
          <Link
            href="/modul"
            className="min-h-12 flex items-center justify-center gap-2 mt-2 relative z-10 px-8 rounded-full bg-gema-tosca text-white font-gilroy font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:opacity-90 transition-all duration-300 shadow-md focus:ring-4 focus:ring-gema-tosca/50 focus:outline-none"
          >
            Mulai Belajar Sekarang
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
