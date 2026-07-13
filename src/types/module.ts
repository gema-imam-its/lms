// ============================================
// Type definitions untuk Modul Interaktif GEMA Imam
// ============================================

// --- Tipe Mascot ---
export type MascotVariant = "hello" | "book" | "sleep" | "default";

// --- Tipe Kuis ---
export type QuizType = "image-choice" | "matching-line" | "sort-order";

// --- Opsi Kuis ---
export interface ImageChoiceOption {
  id: string;
  imageUrl: string;
  label: string;
}

export interface MatchingPair {
  id: string;
  leftImageUrl: string;
  leftLabel: string;
  rightLabel: string;
}

export interface SortItem {
  id: string;
  imageUrl: string;
  label: string;
  correctOrder: number; // urutan yang benar (1-based)
}

// --- Slide Types ---
export interface ContentSlide {
  type: "content";
  title?: string;
  text: string; // 1-2 kalimat saja (prinsip tuna grahita)
  imageUrl?: string;
  mascot: MascotVariant;
}

export interface ImageChoiceQuizSlide {
  type: "quiz";
  quizType: "image-choice";
  question: string;
  options: ImageChoiceOption[];
  correctAnswerId: string;
  hint?: string; // Petunjuk jika salah
  relatedSlideIndex?: number; // Index slide materi terkait (untuk review)
}

export interface MatchingLineQuizSlide {
  type: "quiz";
  quizType: "matching-line";
  question: string;
  pairs: MatchingPair[];
  hint?: string;
  relatedSlideIndex?: number;
}

export interface SortOrderQuizSlide {
  type: "quiz";
  quizType: "sort-order";
  question: string;
  items: SortItem[];
  hint?: string;
  relatedSlideIndex?: number;
}

export type QuizSlide = ImageChoiceQuizSlide | MatchingLineQuizSlide | SortOrderQuizSlide;
export type Slide = ContentSlide | QuizSlide;

// --- Module Definition ---
export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  slides: Slide[];
}

// --- Quiz Result ---
export interface QuizResult {
  slideIndex: number;
  correct: boolean;
  attempts: number; // Jumlah percobaan
}

// --- Module Result ---
export interface ModuleResult {
  moduleId: string;
  totalQuizzes: number;
  correctAnswers: number;
  quizResults: QuizResult[];
  stars: number; // 1-3 bintang
  completed: boolean;
}

// --- Constants ---
export const MAX_QUIZ_ATTEMPTS = 3;
export const FINAL_RETRY_ATTEMPTS = 1;

// --- Mascot URL mapping ---
export const MASCOT_URLS: Record<MascotVariant, string> = {
  hello: "/images/mascot-hello.svg",
  book: "/images/mascot-book.svg",
  sleep: "/images/mascot-sleep.svg",
  default: "/images/mascot.svg",
};
