import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// TODO(rewrite): temporary placeholder for the slide player (/modul/[id]).
// The shell navbar hides itself on this route (see components/Navbar.tsx) so
// the player owns the full screen. Replace with the real player.
export default function ModulPlayerPage() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-gohan text-xl text-gema-navy">
        Pemutar modul sedang dibangun.
      </p>
      <Link
        href="/modul"
        className="flex min-h-12 items-center gap-2 rounded-full border-2 border-gema-navy/15 px-6 font-gilroy font-medium text-gema-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
      >
        <ArrowLeft className="h-5 w-5" />
        Kembali ke Modul
      </Link>
    </section>
  );
}
