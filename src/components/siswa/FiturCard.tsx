import React from "react";
import Image from "next/image";

interface FiturCardProps {
  title: string;
  description: string;
  iconUrl: string; // The specific concrete SVG icon path
  bgColorClass?: string; // e.g. "bg-gema-mint"
}

export default function FiturCard({
  title,
  description,
  iconUrl,
  bgColorClass = "bg-gema-mint",
}: FiturCardProps) {
  return (
    <div className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group hover:opacity-90 min-h-[48px] flex flex-col items-center md:items-start text-center md:text-left">
      <div className={`w-16 h-16 rounded-xl ${bgColorClass} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
        <Image 
          src={iconUrl} 
          alt={`Ikon untuk fitur ${title}`} 
          width={32} 
          height={32} 
          className="object-contain"
        />
      </div>
      <h3 className="font-gohan font-extrabold text-2xl text-gema-navy mb-3">
        {title}
      </h3>
      <p className="font-gilroy font-medium text-gema-ocean leading-relaxed">
        {description}
      </p>
    </div>
  );
}
