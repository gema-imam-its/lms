"use client";

import Image from "next/image";
import { useGender, type Gender } from "@/context/GenderContext";

const OPTIONS: { value: Gender; label: string; avatarUrl: string }[] = [
  { value: "male", label: "Laki-laki", avatarUrl: "/images/modul/male/gerakan-sedekap.png" },
  { value: "female", label: "Perempuan", avatarUrl: "/images/modul/female/gerakan-sedekap.png" },
];

/**
 * Picks which illustration set (male/female) the prayer modules show.
 * `compact` renders a small pill toggle for the module-player top bar; the
 * default renders large friendly buttons for the module list page. Avatars
 * are cropped from the existing gerakan-sedekap character art (already
 * cartoon-style, no emoji) rather than a separately generated icon.
 */
export default function GenderToggle({ compact = false }: { compact?: boolean }) {
  const { gender, setGender } = useGender();

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1 shrink-0"
        role="group"
        aria-label="Pilih karakter"
      >
        {OPTIONS.map((opt) => {
          const active = gender === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              aria-pressed={active}
              className={`min-h-[40px] px-3 rounded-full font-gohan text-sm font-bold flex items-center gap-1.5 transition-all ${
                active
                  ? "bg-gema-tosca text-white shadow"
                  : "text-gray-500 hover:text-gema-navy"
              }`}
            >
              <span className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 bg-white/50" aria-hidden>
                <Image
                  src={opt.avatarUrl}
                  alt=""
                  fill
                  className="object-cover object-top scale-[2.1]"
                />
              </span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-gilroy text-gray-600 text-lg">Pilih karakter kamu:</p>
      <div className="inline-flex gap-3" role="group" aria-label="Pilih karakter">
        {OPTIONS.map((opt) => {
          const active = gender === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGender(opt.value)}
              aria-pressed={active}
              className={`min-h-[64px] px-8 rounded-2xl font-gohan text-xl font-bold flex items-center gap-3 border-4 transition-all active:scale-95 ${
                active
                  ? "bg-gema-tosca text-white border-gema-tosca shadow-lg scale-105"
                  : "bg-white text-gema-navy border-gray-200 hover:border-gema-tosca"
              }`}
            >
              <span className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white/50 border-2 border-white/80" aria-hidden>
                <Image
                  src={opt.avatarUrl}
                  alt=""
                  fill
                  className="object-cover object-top scale-[2.1]"
                />
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
