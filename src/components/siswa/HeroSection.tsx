import React from "react";
import Link from "next/link";
import InteractiveMascot from "./InteractiveMascot";

interface HeroSectionProps {
  moduleCount: number;
}

export default function HeroSection({ moduleCount }: HeroSectionProps) {
  return (
    <section className="relative w-full pt-32 pb-20 px-8 lg:px-16 overflow-hidden bg-geometric-pink-blue bg-cover bg-center flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gema-mint opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gema-sky opacity-20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 z-10 w-full">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          
          <h1 
            className="font-gohan text-5xl lg:text-7xl text-gema-navy leading-tight drop-shadow-md"
            style={{ textShadow: "0px 2px 4px rgba(255, 255, 255, 0.8)" }}
          >
            Platform Edukasi <span className="text-gema-tosca">Interaktif</span> untuk Semua
          </h1>
          
          <div className="backdrop-blur-sm bg-white/40 rounded-lg px-4 py-2 max-w-2xl border border-white/50 shadow-sm">
            <p className="font-gilroy font-semibold text-slate-900 text-lg">
              Belajar jadi lebih menyenangkan dan efektif dengan materi yang disesuaikan dengan kebutuhan belajarmu. Mulai petualangan belajarmu sekarang!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/modul"
              className="min-h-[48px] flex items-center justify-center px-8 rounded-full bg-gema-tosca text-white font-gilroy font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:opacity-90 transition-all duration-300 focus:ring-4 focus:ring-gema-tosca/50 focus:outline-none"
            >
              Mulai Belajar
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
        <div className="flex-1 flex justify-center relative w-full">
          <div className="w-80 h-80 lg:w-[28rem] lg:h-[28rem] relative flex items-center justify-center group">
            <div className="w-full h-full bg-gradient-to-tr from-gema-mint to-gema-tosca rounded-[3rem] rotate-6 absolute inset-0 opacity-20 shadow-xl group-hover:rotate-12 transition-transform duration-500 ease-in-out" />
            <div className="w-full h-full bg-white rounded-[3rem] -rotate-3 absolute inset-0 border border-gray-100 flex items-center justify-center p-8 group-hover:-rotate-6 transition-transform duration-500 ease-in-out">
              <InteractiveMascot
                greeting="Halo! Aku siap bantu kamu belajar sholat 👋"
                className="w-full h-full p-4"
              />
            </div>

            {/* Floating stat badge, echoing the reference's completion-rate card */}
            <div className="absolute -bottom-4 -left-4 md:-left-10 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 z-20">
              <div className="w-10 h-10 rounded-full bg-gema-tosca/10 flex items-center justify-center">
                <span className="font-gohan text-gema-tosca text-lg">{moduleCount}</span>
              </div>
              <p className="font-gilroy font-semibold text-xs text-gema-navy leading-tight">
                Modul Interaktif
                <br />
                Siap Dipelajari
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
