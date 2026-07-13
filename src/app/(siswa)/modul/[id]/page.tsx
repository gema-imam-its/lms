"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getModuleById } from "@/data/modules";
import SlidePresentation from "@/components/modul/SlidePresentation";
import { ModuleResult } from "@/types/module";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ModulDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  
  // Use React.use to unwrap the Promise in App Router Next.js 14+
  const { id } = use(params);
  const modul = getModuleById(id);

  if (!modul) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h1 className="font-gohan text-4xl text-gema-navy mb-4">Modul tidak ditemukan!</h1>
        <p className="font-gilroy text-xl text-gray-600 mb-8">
          Maaf, modul yang kamu cari tidak ada.
        </p>
        <Link 
          href="/modul"
          className="px-8 py-4 bg-gema-tosca text-white rounded-full font-gohan font-bold text-xl"
        >
          Kembali ke Daftar Modul
        </Link>
      </div>
    );
  }

  const handleComplete = (result: ModuleResult) => {
    console.log("Module completed!", result);
    // Here we would typically save the result to Supabase
    // e.g. await saveStudentProgress(studentId, result)
  };

  const handleBack = () => {
    router.push("/modul");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar for Modul Page */}
      <div className="w-full bg-white shadow-sm p-4 flex items-center gap-6">
        <button 
          onClick={handleBack}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={28} className="text-gema-navy" />
        </button>
        <h1 className="font-gohan text-2xl md:text-3xl text-gema-navy font-bold">
          {modul.title}
        </h1>
      </div>

      {/* Presentation Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col justify-center">
        <SlidePresentation 
          module={modul} 
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
