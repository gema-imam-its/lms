import Link from "next/link";
import { BookOpen } from "lucide-react"; // Ikon bawaan dari lucide-react

export default function Navbar() {
  return (
    // <header> untuk membungkus area header/navbar
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      {/* <nav> sebagai penanda semantik navigasi utama */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Bagian Kiri: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
              LMS<span className="text-blue-600">Pintar</span>
            </Link>
          </div>

          {/* Bagian Tengah: Daftar Menu (<ul> & <li>) */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/courses" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Kursus
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
            </li>
          </ul>

          {/* Bagian Kanan: Tombol Aksi */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              Daftar
            </Link>
          </div>
          
        </div>
      </nav>
    </header>
  );
}
