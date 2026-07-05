import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ModulCardProps {
  id: string | number;
  title: string;
  description: string;
  thumbnailUrl: string;
  category?: string;
  hasCC?: boolean;
  hasSignLanguage?: boolean;
}

export default function ModulCard({
  id,
  title,
  description,
  thumbnailUrl,
  category = "Kategori",
  hasCC = false,
  hasSignLanguage = false,
}: ModulCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="h-40 bg-gray-200 relative">
        <Image
          src={thumbnailUrl}
          alt={`Sampul modul untuk ${title}`}
          fill
          className="object-cover"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-10">
          {hasCC && (
            <span className="bg-gema-navy text-white text-xs px-2 py-1 rounded-md font-gilroy font-bold shadow-sm" aria-label="Tersedia Subtitle (CC)">
              CC
            </span>
          )}
          {hasSignLanguage && (
            <span className="bg-gema-tosca text-white text-xs px-2 py-1 rounded-md font-gilroy font-bold shadow-sm" aria-label="Tersedia Bahasa Isyarat">
              🤟
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs font-gilroy font-bold text-gema-tosca mb-2 tracking-wider uppercase">
          {category}
        </div>
        
        <h3 className="font-gohan text-xl text-gema-navy mb-3 line-clamp-2">
          {title}
        </h3>
        
        <p className="font-gilroy font-medium text-sm text-gema-ocean mb-6 line-clamp-2 flex-1">
          {description}
        </p>
        
        <Link 
          href={`/modul/${id}`} 
          className="font-gilroy font-bold text-center flex items-center justify-center min-h-[48px] rounded-lg border-2 border-gray-100 text-gema-navy hover:bg-gema-navy hover:text-white hover:border-gema-navy transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gema-tosca/50"
          aria-label={`Mulai pelajari modul ${title}`}
        >
          Mulai Belajar
        </Link>
      </div>
    </div>
  );
}
