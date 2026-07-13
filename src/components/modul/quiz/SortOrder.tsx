"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { SortItem } from "@/types/module";
import { Check, X } from "lucide-react";

interface SortOrderProps {
  items: SortItem[];
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export default function SortOrder({
  items,
  onAnswer,
  disabled,
}: SortOrderProps) {
  const [shuffledItems, setShuffledItems] = useState<SortItem[]>([]);
  // Array of placed item IDs. Index represents the slot (0-based)
  const [placedItemIds, setPlacedItemIds] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Shuffle on mount
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
    setPlacedItemIds([]);
    setIsChecking(false);
  }, [items]);

  const handlePlaceItem = (id: string) => {
    if (disabled || isChecking) return;
    
    // Add to next available slot
    if (placedItemIds.length < items.length && !placedItemIds.includes(id)) {
      setPlacedItemIds([...placedItemIds, id]);
    }
  };

  const handleRemoveItem = (id: string) => {
    if (disabled || isChecking) return;
    
    // Remove from slots
    setPlacedItemIds(placedItemIds.filter(itemId => itemId !== id));
  };

  const checkAnswer = () => {
    if (placedItemIds.length !== items.length) return;
    
    setIsChecking(true);
    
    // Check if placed items are in correct order (1-based to 0-based array)
    const isCorrect = placedItemIds.every((id, index) => {
      const item = items.find(i => i.id === id);
      return item && item.correctOrder === index + 1;
    });

    setTimeout(() => {
      onAnswer(isCorrect);
      if (!isCorrect) {
        setTimeout(() => {
          setPlacedItemIds([]);
          setIsChecking(false);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto gap-12 p-4">
      {/* Top: Numbered Slots */}
      <div className="bg-white/50 p-6 rounded-3xl border-2 border-dashed border-gray-300">
        <h3 className="font-gohan text-xl text-center text-gray-500 mb-6">Urutan yang benar:</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(items.length)].map((_, index) => {
            const placedId = placedItemIds[index];
            const placedItem = placedId ? items.find(i => i.id === placedId) : null;
            
            // Validation states
            let isItemCorrect = false;
            let isItemWrong = false;
            
            if (isChecking && placedItem) {
              isItemCorrect = placedItem.correctOrder === index + 1;
              isItemWrong = !isItemCorrect;
            }

            return (
              <div 
                key={`slot-${index}`}
                className="relative flex flex-col items-center gap-3"
              >
                {/* Number Indicator */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-gohan text-2xl font-bold shadow-sm z-10 ${
                  placedItem ? "bg-gema-tosca text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {index + 1}
                </div>
                
                {/* Slot Area */}
                <button
                  onClick={() => placedId && handleRemoveItem(placedId)}
                  disabled={!placedId || disabled || isChecking}
                  className={`relative w-full aspect-[3/4] rounded-2xl flex flex-col items-center justify-center p-2 transition-all border-4 ${
                    placedItem 
                      ? isChecking
                        ? isItemCorrect 
                          ? "bg-white border-green-500 shadow-lg shadow-green-500/20" 
                          : "bg-white border-red-500 shadow-lg shadow-red-500/20 opacity-80"
                        : "bg-white border-gema-tosca shadow-md cursor-pointer hover:bg-red-50 group"
                      : "bg-gray-100 border-dashed border-gray-300"
                  }`}
                >
                  {placedItem ? (
                    <>
                      <div className="relative w-full h-2/3">
                        <Image
                          src={placedItem.imageUrl}
                          alt={placedItem.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-gohan text-sm md:text-base font-bold text-gema-navy text-center mt-auto">
                        {placedItem.label}
                      </span>
                      
                      {/* Remove Overlay (Hover) */}
                      {!isChecking && !disabled && (
                        <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <X size={32} className="text-red-500" strokeWidth={3} />
                        </div>
                      )}
                      
                      {/* Check Status Overlay */}
                      {isChecking && (
                        <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-md ${
                          isItemCorrect ? "bg-green-500" : "bg-red-500"
                        }`}>
                          {isItemCorrect ? (
                            <Check size={16} className="text-white" strokeWidth={4} />
                          ) : (
                            <X size={16} className="text-white" strokeWidth={4} />
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-300 font-gohan text-4xl">?</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Available Cards */}
      <div>
        <h3 className="font-gohan text-xl text-center text-gray-500 mb-6">Pilih gambar di bawah ini:</h3>
        
        <div className="flex flex-wrap justify-center gap-4">
          {shuffledItems.map((item) => {
            const isPlaced = placedItemIds.includes(item.id);
            
            return (
              <button
                key={`card-${item.id}`}
                onClick={() => handlePlaceItem(item.id)}
                disabled={isPlaced || disabled || isChecking}
                className={`relative w-28 md:w-36 aspect-[3/4] bg-white rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-all min-h-[48px] ${
                  isPlaced 
                    ? "border-gray-200 opacity-30 grayscale cursor-not-allowed scale-95" 
                    : "border-transparent shadow-md hover:border-gema-tosca hover:-translate-y-2 hover:shadow-lg active:scale-95 cursor-pointer"
                }`}
              >
                <div className="relative w-full h-2/3">
                  <Image
                    src={item.imageUrl}
                    alt={item.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-gohan text-xs md:text-sm font-bold text-gema-navy text-center mt-auto leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={checkAnswer}
          disabled={placedItemIds.length !== items.length || isChecking || disabled}
          className={`px-12 py-4 rounded-full font-gohan text-2xl font-bold min-h-[64px] transition-all shadow-lg ${
            placedItemIds.length === items.length && !isChecking && !disabled
              ? "bg-gema-tosca text-white hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isChecking ? "Mengecek..." : "Cek Jawaban"}
        </button>
      </div>
    </div>
  );
}
