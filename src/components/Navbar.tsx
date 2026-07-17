"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, BookOpen, GraduationCap } from "lucide-react";
import type { ComponentType } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

// Student-facing destinations only. Rapor and the future login live behind the
// quiet "Guru" gate (below) — never in the student's primary navigation.
const STUDENT_LINKS: NavItem[] = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/modul", label: "Modul", icon: BookOpen },
];

// The guru/parent gate. Points at rapor for now; becomes the login entry once
// authentication exists, without changing the student-facing nav.
const GURU_HREF = "/rapor";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The immersive lesson player (/modul/<id>) owns its own header, so hide the
// global shell nav there and let the player use the full screen.
function isImmersivePlayer(pathname: string) {
  return /^\/modul\/[^/]+/.test(pathname);
}

export default function NavBar() {
  const pathname = usePathname();
  if (isImmersivePlayer(pathname)) return null;

  return (
    <>
      {/* Top bar — every breakpoint. Sticky + in-flow, so it never overlaps
          content (the old absolute nav did) and never traps a `fixed` child. */}
      <header className="sticky top-0 z-50 w-full border-b border-gema-navy/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-12">
          <Link
            href="/"
            aria-label="Gema Imam — Beranda"
            className="flex min-h-12 items-center gap-2.5 rounded-xl px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
          >
            <Image
              src="/images/logo.svg"
              alt=""
              width={40}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <span className="font-gohan text-lg font-bold text-gema-navy">
              Gema Imam
            </span>
          </Link>

          {/* Student links — desktop */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-2 lg:flex">
            {STUDENT_LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center gap-2 rounded-full px-5 font-gilroy text-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca ${
                    active
                      ? "bg-gema-tosca/10 text-gema-tosca"
                      : "text-gema-navy hover:bg-gema-navy/5"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Quiet guru/parent gate (all sizes) */}
          <Link
            href={GURU_HREF}
            aria-current={isActive(pathname, GURU_HREF) ? "page" : undefined}
            title="Area guru & orang tua"
            className={`flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 font-gilroy text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca ${
              isActive(pathname, GURU_HREF)
                ? "text-gema-tosca"
                : "text-gema-navy/60 hover:text-gema-navy"
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="hidden sm:inline">Guru</span>
          </Link>
        </div>
      </header>

      {/* Bottom tab bar — mobile only. It's a sibling of the backdrop-blurred
          header (not a child), so its `position: fixed` resolves to the
          viewport. That was the hamburger's bug: a fixed drawer nested inside a
          `backdrop-filter` element is clamped to that element's box. */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gema-navy/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {STUDENT_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-15 flex-1 flex-col items-center justify-center gap-1 py-2 font-gilroy text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gema-tosca ${
                  active ? "text-gema-tosca" : "text-gema-navy/70"
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
