import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { modules } from "@/data/modules";
import GenderToggle from "@/components/modul/GenderToggle";

export default function ModulListPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="font-gohan text-4xl md:text-5xl text-gema-navy mb-4">
            Daftar Modul Belajar
          </h1>
          <p className="font-gilroy text-xl text-gray-600 max-w-2xl mx-auto">
            Mari belajar langkah demi langkah. Pilih modul di bawah ini untuk memulai!
          </p>

          <div className="mt-8 flex justify-center">
            <GenderToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((modul, index) => {
            const cardBg =
              index % 3 === 0 ? "bg-gema-sky/20" : index % 3 === 1 ? "bg-gema-mint/20" : "bg-gema-pink/20";

            const cardContent = (
              <>
                {/* Card Header with Icon */}
                <div className={`h-40 flex items-center justify-center p-6 ${cardBg}`}>
                  <div className="relative w-24 h-24 drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={modul.iconUrl}
                      alt={modul.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="inline-block px-4 py-1 bg-gray-100 text-gray-600 font-gohan font-bold rounded-full text-sm w-fit">
                      Modul {modul.id}
                    </div>
                    {modul.locked && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-500 font-gohan font-bold rounded-full text-sm w-fit">
                        <Lock size={14} /> Segera Hadir
                      </div>
                    )}
                  </div>

                  <h2 className="font-gohan text-2xl text-gema-navy font-bold mb-4 line-clamp-2">
                    {modul.title}
                  </h2>

                  <p className="font-gilroy text-gray-600 text-lg mb-8 flex-1">
                    {modul.description}
                  </p>

                  {modul.locked ? (
                    <div className="mt-auto w-full py-4 rounded-full bg-gray-200 text-gray-400 font-gohan text-xl text-center font-bold min-h-[48px] flex items-center justify-center gap-2">
                      <Lock size={20} /> Segera Hadir
                    </div>
                  ) : (
                    <div className="mt-auto w-full py-4 rounded-full bg-gema-tosca text-white font-gohan text-xl text-center font-bold min-h-[48px] shadow-md group-hover:bg-[#1bb3a2] transition-colors flex items-center justify-center">
                      Mulai Belajar &rarr;
                    </div>
                  )}
                </div>
              </>
            );

            if (modul.locked) {
              return (
                <div
                  key={modul.id}
                  aria-disabled="true"
                  className="bg-white rounded-3xl shadow-md border-2 border-transparent overflow-hidden flex flex-col h-full opacity-60 grayscale cursor-not-allowed"
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                href={`/modul/${modul.id}`}
                key={modul.id}
                className="group block bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-gema-tosca overflow-hidden flex flex-col h-full"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
