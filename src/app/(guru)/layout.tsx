import { LogOut } from "lucide-react";
import { requireGuru } from "@/lib/auth-guru";
import { logout } from "@/app/masuk/actions";

/**
 * Guards the guru zone and provides a "Keluar" (logout) affordance.
 *
 * This is an OPTIMISTIC extra layer, not the sole gate: layouts don't re-render
 * on every navigation and Server Actions are separate entry points, so every
 * guru page and action still calls requireGuru() itself.
 *
 * Renders `{children}` unwrapped — the existing rapor pages already bring
 * their own full-width `min-h-screen` + `pt-24` chrome (to clear the site's
 * absolutely-positioned Navbar), so this only adds a fixed-position "Keluar"
 * button rather than another layout wrapper that would double up on that
 * spacing or constrain their width.
 */
export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGuru();

  return (
    <>
      <form action={logout} className="fixed top-24 right-4 z-40 md:right-8">
        <button
          type="submit"
          className="flex min-h-12 items-center gap-2 rounded-full bg-white px-4 font-gilroy text-sm font-medium text-gema-navy/70 shadow-md transition-colors hover:text-gema-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </form>
      {children}
    </>
  );
}
