export type MascotState =
  | "hai"
  | "semangat"
  | "ajak-belajar"
  | "rayakan"
  | "tepuk-tangan";

export interface ContentSlide {
  type: "content";
  image: string;
  text: string | string[];
  mascot?: MascotState;
  voiceScript?: string;
  signVideo?: string;
}

export interface ImageChoiceSlide {
  type: "image-choice";
  question: string;
  options: {
    image: string;
    label?: string;
  }[];
  correctIndex: number;
  hint?: string;
  relatedSlideIndex?: number;
}

export interface MatchingSlide {
  type: "matching-line";
  question: string;
  pairs: {
    image: string;
    label: string;
  }[];
  hint?: string;
  relatedSlideIndex?: number;
}

export interface SortOrderSlide {
  type: "sort-order";
  question: string;
  items: {
    id: string;
    label: string;
    image?: string;
  }[];
  correctOrder: string[];
  hint?: string;
  relatedSlideIndex?: number;
}

export type Slide =
  | ContentSlide
  | ImageChoiceSlide
  | MatchingSlide
  | SortOrderSlide;

export interface Lesson {
  id: string;

  title: string;
  description: string;
  icon?: string;
  slides: Slide[];
}

export const MAX_QUIZ_ATTEMPTS = 3;
export const FINAL_RETRY_ATTEMPTS = 1;
