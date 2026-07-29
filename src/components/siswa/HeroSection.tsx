import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-32 pb-20 px-8 lg:px-16 overflow-hidden bg-geometric-pink-blue bg-cover bg-center flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gema-mint opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gema-sky opacity-20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 z-10 w-full">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Unified content card — guarantees text contrast against the busy
              background image regardless of what's underneath, instead of the
              old text-shadow trick that only worked by luck of positioning. */}
          <div className="backdrop-blur-sm bg-white/70 rounded-3xl px-6 py-6 md:px-8 md:py-8 max-w-2xl border border-white/60 shadow-sm flex flex-col gap-4">
            <h1 className="font-gohan text-4xl lg:text-6xl text-gema-navy leading-tight">
              Belajar Sholat dengan <span className="text-gema-tosca">Cara yang Menyenangkan</span>
            </h1>
            <p className="font-gilroy font-semibold text-slate-900 text-lg">
              Modul visual dan interaktif yang membantu setiap anak memahami gerakan
              dan bacaan sholat, sesuai kecepatan belajarnya sendiri.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Link
              href="/modul"
              className="min-h-[48px] flex items-center justify-center gap-2 px-8 rounded-full bg-gema-tosca text-white font-gilroy font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:opacity-90 transition-all duration-300 focus:ring-4 focus:ring-gema-tosca/50 focus:outline-none"
            >
              Mulai Belajar
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/tentang"
              className="min-h-[48px] flex items-center justify-center px-8 rounded-full bg-white border-2 border-gema-navy text-gema-navy font-gilroy font-bold text-lg hover:-translate-y-1 hover:shadow-md transition-all duration-300 focus:ring-4 focus:ring-gema-navy/30 focus:outline-none"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>

        {/* Right Content / Mascot */}
        <div className="flex-1 flex justify-center relative w-full animate-in fade-in zoom-in-95 duration-700 delay-150">
          <div className="w-80 h-80 lg:w-[28rem] lg:h-[28rem] relative flex items-center justify-center group">
            <div className="w-full h-full bg-gradient-to-tr from-gema-mint to-gema-tosca rounded-[3rem] rotate-6 absolute inset-0 opacity-20 shadow-xl group-hover:rotate-12 transition-transform duration-500 ease-in-out" />
            <div className="w-full h-full bg-white rounded-[3rem] -rotate-3 absolute inset-0 border border-gray-100 flex items-center justify-center p-8 group-hover:-rotate-6 transition-transform duration-500 ease-in-out">
              <Image
                src="/images/mascot-hello.svg"
                alt="Maskot Gema Imam melambaikan tangan menyapa"
                fill
                className="object-contain p-4 hover:scale-110 transition-transform duration-500 drop-shadow-md"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
