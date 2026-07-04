"use client";
import React, { useState } from "react";
import { Menu, CircleX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/modul", label: "Modul" },
    { href: "/tentang", label: "Tentang" },
  ];

  return (
    <nav className="top-0 absolute w-full z-50 bg-white px-8 lg:px-16 py-5 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-360 mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.svg"
            alt="Logo Gema Imam"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <p className="font-gohan font-bold text-gema-navy text-xl">
            Gema Imam
          </p>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-gilroy font-medium text-lg
                after:absolute after:left-0 after:bottom-0 after:h-0.5
                after:bg-current after:transition-all after:duration-300
                ${
                  pathname === link.href
                    ? "text-gema-tosca after:w-full"
                    : "text-gema-navy after:w-0 hover:after:w-full hover:text-gema-tosca"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/modul"
            className="px-6 py-2 rounded-lg bg-gema-tosca text-white
                       font-gilroy font-medium hover:opacity-90
                       hover:scale-105 transition-all duration-300"
          >
            Mulai Belajar
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} aria-label="Open menu">
            <Menu color="#10B5AE" size={28} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`h-full overflow-y-auto fixed inset-0 z-30 bg-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}
      >
        <div className="flex flex-col items-center justify-between h-full py-20">
          <div className="flex flex-col items-center text-center gap-7">
            <Image
              src="/images/logo.svg"
              alt="Logo Gema Imam"
              width={100}
              height={100}
              className="h-24 w-auto mb-4"
            />

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={`h-9.75 w-48 rounded-2xl flex items-center
                  justify-center shadow-md transition-all duration-200
                  ${
                    pathname === link.href
                      ? "bg-gema-tosca"
                      : "bg-white hover:bg-gema-mint border border-gray-100"
                  }`}
              >
                <p
                  className={`font-gilroy font-medium text-lg
                  ${pathname === link.href ? "text-white" : "text-gema-navy"}`}
                >
                  {link.label}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 mt-20">
            <Link
              href="/modul"
              onClick={toggleMenu}
              className="w-[256px] h-9.75 px-6 rounded-lg bg-gema-tosca
                         flex items-center justify-center"
            >
              <p className="font-gilroy text-white font-medium">
                Mulai Belajar
              </p>
            </Link>

            <button onClick={toggleMenu} aria-label="Close menu">
              <CircleX size={70} strokeWidth={1} color="#10B5AE" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
