"use client";

import Image from "next/image";
import { ContentSlide } from "@/types/module";
import MascotBubble from "./MascotBubble";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideContentProps {
  slide: ContentSlide;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SlideContent({
  slide,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: SlideContentProps) {
  return (
    <div className="flex flex-col h-full w-full justify-between animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8">
        {/* Optional Main Image */}
        {slide.imageUrl && (
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 drop-shadow-xl rounded-3xl overflow-hidden bg-white border-8 border-white">
            <Image
              src={slide.imageUrl}
              alt="Ilustrasi Materi"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Mascot + Text */}
        <div className="w-full max-w-4xl">
          <MascotBubble
            mascot={slide.mascot}
            message={slide.text}
            size="lg"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-8 border-t-2 border-gray-100">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`min-h-[64px] min-w-[64px] rounded-full flex items-center justify-center transition-all ${
            isFirst
              ? "opacity-30 cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-white text-gema-navy hover:bg-gray-50 hover:scale-105 shadow-md active:scale-95"
          }`}
          aria-label="Kembali ke slide sebelumnya"
        >
          <ChevronLeft size={36} strokeWidth={3} />
        </button>

        <button
          onClick={onNext}
          className="min-h-[64px] px-8 rounded-full flex items-center justify-center gap-4 bg-gema-tosca hover:bg-[#1bb3a2] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0"
        >
          <span className="font-gohan text-2xl font-bold">
            {isLast ? "Selesai" : "Lanjut"}
          </span>
          <ChevronRight size={32} strokeWidth={4} />
        </button>
      </div>
    </div>
  );
}
