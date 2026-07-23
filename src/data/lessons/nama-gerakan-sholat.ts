import type { Lesson } from "@/types/lesson";

// Golden lesson for Milestone 1 — ported from the as-built "Nama-Nama Gerakan
// Sholat" module (main branch, src/data/modules.ts, id "2"), which already
// went through real classroom use. Reusing proven content here rather than
// authoring new, religiously-unreviewed copy (see docs/spec/pm-review-lessons.md
// blocker B3). Chosen as the first lesson because every quiz is image-choice —
// the simplest, purest visual-first interaction type (per the review's
// recommended build order), unlike the movement-order lesson which needs
// sort-order (Milestone 2).
export const namaGerakanSholat: Lesson = {
  id: "nama-gerakan-sholat",
  title: "Nama-Nama Gerakan Sholat",
  description: "Mari kenali nama setiap gerakan dalam sholat.",
  icon: "/assets/items/quran-closed-green.svg",
  slides: [
    {
      id: "intro",
      type: "content",
      mascot: "hai",
      text: "Yuk kenali gerakan-gerakan sholat!",
      image: "/images/modul/gerakan-berdiri.png",
    },
    {
      id: "content-berdiri",
      type: "content",
      mascot: "ajak-belajar",
      text: "Ini namanya BERDIRI (Qiyam)",
      image: "/images/modul/gerakan-berdiri.png",
    },
    {
      id: "content-rukuk",
      type: "content",
      mascot: "ajak-belajar",
      text: "Ini namanya RUKUK",
      image: "/images/modul/gerakan-rukuk.png",
    },
    {
      id: "quiz-rukuk",
      type: "image-choice",
      question: "Mana yang namanya RUKUK?",
      options: [
        { image: "/images/modul/gerakan-berdiri.png", label: "Berdiri" },
        { image: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
        { image: "/images/modul/gerakan-sujud.png", label: "Sujud" },
      ],
      correctIndex: 1,
      hint: "Rukuk itu membungkuk dan memegang lutut.",
      relatedSlideId: "content-rukuk",
    },
    {
      id: "content-sujud",
      type: "content",
      mascot: "ajak-belajar",
      text: "Ini namanya SUJUD",
      image: "/images/modul/gerakan-sujud.png",
    },
    {
      id: "content-duduk",
      type: "content",
      mascot: "ajak-belajar",
      text: "Ini namanya DUDUK (Tahiyyat)",
      image: "/images/modul/gerakan-duduk.png",
    },
    {
      id: "quiz-sujud",
      type: "image-choice",
      question: "Mana yang namanya SUJUD?",
      options: [
        { image: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
        { image: "/images/modul/gerakan-sujud.png", label: "Sujud" },
        { image: "/images/modul/gerakan-duduk.png", label: "Duduk" },
      ],
      correctIndex: 1,
      hint: "Sujud itu saat dahi menempel ke lantai.",
      relatedSlideId: "content-sujud",
    },
    {
      id: "content-salam",
      type: "content",
      mascot: "ajak-belajar",
      text: "Ini namanya SALAM",
      image: "/images/modul/gerakan-salam.png",
    },
    {
      id: "quiz-duduk",
      type: "image-choice",
      question: "Mana yang namanya DUDUK?",
      options: [
        { image: "/images/modul/gerakan-berdiri.png", label: "Berdiri" },
        { image: "/images/modul/gerakan-sujud.png", label: "Sujud" },
        { image: "/images/modul/gerakan-duduk.png", label: "Duduk" },
        { image: "/images/modul/gerakan-salam.png", label: "Salam" },
      ],
      correctIndex: 2,
      hint: "Duduk dilakukan setelah sujud.",
      relatedSlideId: "content-duduk",
    },
  ],
};

export const lessons: Lesson[] = [namaGerakanSholat];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
