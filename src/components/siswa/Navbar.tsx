"use client";

import React, { useState } from "react";
import { Menu, CircleX, Home, BookOpen, Info, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  // The immersive module player (/modul/<id>) renders its own top bar; hide the
  // global (absolute) nav there so the two don't overlap and the player can use
  // the full viewport height.
  if (/^\/modul\/[^/]+$/.test(pathname ?? "")) return null;

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/modul", label: "Modul", icon: BookOpen },
    { href: "/rapor", label: "Rapor", icon: Activity },
    { href: "/tentang", label: "Tentang", icon: Info },
  ];

  return (
    <nav className="top-0 absolute w-full z-50 bg-white/90 backdrop-blur-md px-8 lg:px-16 py-5 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-lg p-1">
          <Image
            src="/images/logo.svg"
            alt="Logo utama Gema Imam"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <p className="font-gohan font-bold text-gema-navy text-xl">
            Gema Imam
          </p>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center flex-row gap-1.5 font-gilroy font-medium text-lg min-h-[48px] px-2 py-1
                  after:absolute after:left-0 after:bottom-1 after:h-0.5
                  after:bg-current after:transition-all after:duration-300 focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-md
                  ${
                    isActive
                      ? "text-gema-tosca after:w-full"
                      : "text-gema-navy after:w-0 hover:after:w-full hover:text-gema-tosca"
                  }`}
              >
                <IconComponent className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/modul"
            className="min-h-[48px] px-8 rounded-full bg-gema-tosca text-white
                       font-gilroy font-medium hover:opacity-90 flex items-center justify-center
                       hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-gema-tosca/50 focus:outline-none"
          >
            Mulai Belajar
          </Link>
        </div>

        <div className="lg:hidden">
          <button 
            onClick={toggleMenu} 
            aria-label="Buka menu navigasi"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-lg"
          >
            <Menu color="#10B5AE" size={28} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 bg-white/95 backdrop-blur-sm
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}
      >
        <div className="flex flex-col items-center justify-between h-full py-16 overflow-y-auto">
          <div className="flex flex-col items-center text-center gap-7">
            <Image
              src="/images/logo.svg"
              alt="Logo Gema Imam"
              width={80}
              height={80}
              className="h-20 w-auto mb-4"
            />

            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className={`min-h-[48px] h-12 w-56 rounded-2xl flex items-center
                    justify-center gap-1.5 shadow-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-gema-tosca text-white"
                        : "bg-white hover:bg-gema-mint border border-gray-100 text-gema-navy"
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <p className="font-gilroy font-medium text-lg">
                    {link.label}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-6 mt-10">
            <Link
              href="/modul"
              onClick={toggleMenu}
              className="w-56 min-h-[48px] rounded-full bg-gema-tosca
                         flex items-center justify-center hover:opacity-90 transition-all hover:scale-105"
            >
              <p className="font-gilroy text-white font-medium">
                Mulai Belajar
              </p>
            </Link>

            <button 
              onClick={toggleMenu} 
              aria-label="Tutup menu navigasi"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gema-tosca rounded-full"
            >
              <CircleX size={56} strokeWidth={1} color="#10B5AE" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
