"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // The immersive module player (/modul/<id>) uses the full viewport height
  // with its own scroll region — same reason Navbar hides itself there.
  if (/^\/modul\/[^/]+$/.test(pathname ?? "")) return null;

  return (
    <footer className="bg-gema-navy text-white pt-16 pb-8 px-8 lg:px-16 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Logo Gema Imam"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="font-gohan text-2xl">Gema Imam</span>
          </div>
          <p className="font-gilroy font-light text-gema-sky max-w-sm">
            Platform pembelajaran interaktif yang berdedikasi untuk menciptakan
            pengalaman edukasi yang lebih baik dan inklusif.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-gilroy font-bold text-lg text-gema-mint">Menu</h4>
          <Link
            href="/"
            className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center"
          >
            Beranda
          </Link>
          <Link
            href="/modul"
            className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center"
          >
            Modul Belajar
          </Link>
          <Link
            href="/rapor"
            className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center"
          >
            Rapor Praktik
          </Link>
          <Link
            href="/tentang"
            className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center"
          >
            Tentang
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/20 text-center font-gilroy font-light text-sm text-gema-sky">
        &copy; {new Date().getFullYear()} Gema Imam. All rights reserved.
      </div>
    </footer>
  );
}
