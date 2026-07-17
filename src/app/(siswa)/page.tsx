import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// TODO(rewrite): temporary placeholder so `/` renders and the navbar is
// viewable. Replace with the real Beranda per docs/spec/lessons.md.
export default function BerandaPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <Image
        src="/images/mascot-hello.svg"
        alt="Maskot Gema Imam menyapa"
        width={200}
        height={200}
        className="h-44 w-auto"
        priority
      />
      <h1 className="font-gohan text-3xl font-bold text-gema-navy">
        Ayo Belajar Sholat
      </h1>
      <p className="font-gilroy text-lg text-gema-navy/70">
        Belajar gerakan sholat langkah demi langkah.
      </p>
      <Link
        href="/modul"
        className="flex min-h-14 items-center gap-2 rounded-full bg-gema-tosca px-8 font-gilroy text-xl font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-gema-tosca/40"
      >
        Mulai Belajar
        <ArrowRight className="h-6 w-6" />
      </Link>
    </section>
  );
}
