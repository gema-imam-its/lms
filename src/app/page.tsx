import Link from "next/link";
import Image from "next/image";
import HeroSection from "@/components/siswa/HeroSection";
import FiturCard from "@/components/siswa/FiturCard";
import ModulCard from "@/components/siswa/ModulCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section di-import dari komponen independen */}
      <HeroSection />

      {/* 2. Fitur Section - Background diubah ke putih bersih agar tidak bertabrakan dengan Hero */}
      <section className="py-20 px-8 lg:px-16 bg-white w-full">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="font-gohan text-4xl text-gema-navy mb-4">Fitur Unggulan</h2>
            <p className="font-gilroy font-light text-gema-ocean text-lg max-w-2xl mx-auto">
              Kami menyediakan berbagai fitur untuk mendukung proses belajarmu menjadi jauh lebih mudah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FiturCard 
              title="Materi Interaktif" 
              description="Modul yang didesain agar mudah dipahami secara visual dan intuitif."
              iconUrl="/assets/items/quran-open.svg"
              bgColorClass="bg-gema-mint"
            />
            <FiturCard 
              title="Video Pembelajaran" 
              description="Tonton video materi yang dijelaskan langsung secara detail, dilengkapi subtitle & isyarat."
              iconUrl="/assets/architecture/lantern.svg"
              bgColorClass="bg-gema-sky"
            />
            <FiturCard 
              title="Kuis & Evaluasi" 
              description="Ukur kemampuanmu dengan kuis menarik di setiap akhir modul pembelajaran."
              iconUrl="/assets/shapes/star-green.svg"
              bgColorClass="bg-gema-pink"
            />
          </div>
        </div>
      </section>

      {/* 3. Modul Cards Section - Background abu-abu terang sangat cocok untuk transisi setelah putih */}
      <section className="py-20 px-8 lg:px-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="font-gohan text-4xl text-gema-navy mb-4">Mulai dari Mana?</h2>
              <p className="font-gilroy font-light text-gema-ocean text-lg">Pilih modul yang ingin kamu pelajari hari ini.</p>
            </div>
            <Link 
              href="/modul" 
              className="font-gilroy font-bold text-gema-tosca hover:text-gema-navy transition-colors min-h-[48px] flex items-center"
            >
              Lihat Semua Modul &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModulCard
              id="1"
              title="Mari Mengenal Huruf Hijaiyah"
              description="Pelajari dasar-dasar pengucapan dan penulisan huruf hijaiyah dengan benar."
              category="Dasar"
              thumbnailUrl="/assets/items/quran-closed-green.svg"
              hasCC={true}
              hasSignLanguage={true}
            />
            <ModulCard
              id="2"
              title="Rukun Islam dan Iman"
              description="Pahami pilar-pilar penting dalam beragama Islam secara interaktif."
              category="Akidah"
              thumbnailUrl="/assets/architecture/minaret-cyan.svg"
              hasCC={false}
              hasSignLanguage={true}
            />
            <ModulCard
              id="3"
              title="Tata Cara Wudhu"
              description="Panduan langkah demi langkah cara bersuci sebelum melaksanakan salat."
              category="Fikih"
              thumbnailUrl="/assets/shapes/sparkle-blue.svg"
              hasCC={true}
              hasSignLanguage={false}
            />
            <ModulCard
              id="4"
              title="Mengenal Alat Ibadah"
              description="Mengenal tasbih, sajadah, peci, dan alat ibadah lainnya."
              category="Umum"
              thumbnailUrl="/assets/prayer-mats/prayer-mat-small-pink.svg"
              hasCC={false}
              hasSignLanguage={false}
            />
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-gema-navy text-white pt-16 pb-8 px-8 lg:px-16 w-full mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
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
              Platform pembelajaran interaktif yang berdedikasi untuk menciptakan pengalaman edukasi yang lebih baik dan inklusif.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-gilroy font-bold text-lg text-gema-mint">Menu</h4>
            <Link href="/" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">Beranda</Link>
            <Link href="/modul" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">Modul</Link>
            <Link href="/tentang" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">Tentang</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-gilroy font-bold text-lg text-gema-mint">Bantuan</h4>
            <Link href="#" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">FAQ</Link>
            <Link href="#" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">Kontak Kami</Link>
            <Link href="#" className="font-gilroy font-medium text-gray-300 hover:text-white min-h-[48px] flex items-center">Syarat & Ketentuan</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/20 text-center font-gilroy font-light text-sm text-gema-sky">
          &copy; {new Date().getFullYear()} Gema Imam. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
