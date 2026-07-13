"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MASCOT_URLS } from "@/types/module";
import { Check, X } from "lucide-react";

interface QuizFeedbackProps {
  correct: boolean;
  onContinue: () => void;
  message?: string;
}

export default function QuizFeedback({
  correct,
  onContinue,
  message,
}: QuizFeedbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay to trigger entry animation safely
    const t = setTimeout(() => setShow(true), 50);
    
    // Auto-dismiss if correct
    let t2: NodeJS.Timeout;
    if (correct) {
      t2 = setTimeout(() => {
        onContinue();
      }, 2500);
    }
    
    return () => {
      clearTimeout(t);
      if (t2) clearTimeout(t2);
    };
  }, [correct, onContinue]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
        show ? (correct ? "bg-green-500/20 backdrop-blur-sm" : "bg-orange-500/20 backdrop-blur-sm") : "bg-transparent backdrop-blur-none"
      }`}
    >
      <div 
        className={`bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center text-center transform transition-all duration-500 ${
          show ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        {/* Icon & Mascot Header */}
        <div className="relative w-full flex justify-center mb-6">
          <div className="relative w-40 h-40 drop-shadow-xl z-10">
            <Image
              src={correct ? MASCOT_URLS.hello : MASCOT_URLS.book}
              alt="Feedback Mascot"
              fill
              className="object-contain"
            />
          </div>
          
          {/* Status Badge */}
          <div className={`absolute -bottom-4 z-20 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-lg ${
            correct ? "bg-green-500" : "bg-orange-500"
          }`}>
            {correct ? (
              <Check size={32} className="text-white" strokeWidth={4} />
            ) : (
              <X size={32} className="text-white" strokeWidth={4} />
            )}
          </div>
        </div>

        {/* Text Content */}
        <h2 className={`font-gohan text-4xl mb-4 ${
          correct ? "text-green-600" : "text-orange-500"
        }`}>
          {message || (correct ? "Horeee, Benar! 🎉" : "Masih Kurang Tepat 💪")}
        </h2>
        
        {!correct && (
          <p className="font-gilroy text-xl text-gray-600 mb-8">
            Jangan menyerah, ayo kita coba sekali lagi!
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={onContinue}
          className={`w-full min-h-[64px] rounded-full font-gohan text-2xl font-bold text-white transition-transform active:scale-95 shadow-lg hover:shadow-xl ${
            correct 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {correct ? "Lanjut" : "Coba Lagi"}
        </button>
      </div>

      {/* Basic Confetti Effect if correct */}
      {correct && show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <span className="text-3xl">⭐</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
