export type MascotState =
  | "hai"
  | "semangat"
  | "ajak-belajar"
  | "rayakan"
  | "tepuk-tangan";

export interface ContentSlide {
  id: string;
  type: "content";
  image: string;
  text: string | string[];
  mascot?: MascotState;
  voiceScript?: string;
  signVideo?: string;
}

export interface ImageChoiceSlide {
  id: string;
  type: "image-choice";
  question: string;
  options: {
    image: string;
    label?: string;
  }[];
  correctIndex: number;
  hint?: string;
  relatedSlideId?: string;
}

export interface MatchingSlide {
  id: string;
  type: "matching-line";
  question: string;
  pairs: {
    image: string;
    label: string;
  }[];
  hint?: string;
  relatedSlideId?: string;
}

export interface SortOrderSlide {
  id: string;
  type: "sort-order";
  question: string;
  items: {
    id: string;
    label: string;
    image?: string;
  }[];
  correctOrder: string[];
  hint?: string;
  relatedSlideId?: string;
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
