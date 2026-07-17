import { LogOut } from "lucide-react";
import { requireGuru } from "@/lib/auth-guru";
import { logout } from "@/app/masuk/actions";

/**
 * Guards the guru zone and provides its shared chrome (title + Keluar).
 *
 * This is an OPTIMISTIC extra layer, not the sole gate: layouts don't re-render
 * on every navigation and Server Actions are separate entry points, so every
 * guru page and action still calls requireGuru() itself.
 */
export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGuru();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between border-b border-gema-navy/10 pb-4">
        <span className="font-gohan text-lg font-bold text-gema-navy">
          Area Guru
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="flex min-h-12 items-center gap-2 rounded-full px-4 font-gilroy text-sm font-medium text-gema-navy/70 transition-colors hover:text-gema-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gema-tosca"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
