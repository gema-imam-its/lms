import { ModuleDefinition } from "@/types/module";

export const modules: ModuleDefinition[] = [
  {
    id: "1",
    title: "Perbedaan Imam dan Makmum",
    description: "Pelajari siapa itu Imam dan Makmum dalam sholat berjamaah.",
    iconUrl: "/assets/items/quran-open.svg",
    slides: [
      {
        type: "content",
        mascot: "hello",
        text: "Assalamu'alaikum! Hari ini kita belajar siapa itu Imam dan Makmum",
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam adalah orang yang memimpin sholat",
        imageUrl: "/images/modul/formasi-imam.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Makmum adalah orang yang mengikuti imam dari belakang",
        imageUrl: "/images/modul/formasi-makmum.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam berdiri sendiri di depan. Makmum berdiri di belakang imam",
        imageUrl: "/images/modul/formasi-jamaah.png",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Hubungkan gambar dengan posisinya yang benar!",
        pairs: [
          {
            id: "imam",
            leftImageUrl: "/images/modul/formasi-imam.png",
            leftLabel: "Sendiri di depan",
            rightLabel: "IMAM",
          },
          {
            id: "makmum",
            leftImageUrl: "/images/modul/formasi-makmum.png",
            leftLabel: "Banyak di belakang",
            rightLabel: "MAKMUM",
          },
        ],
        hint: "Ingat, Imam selalu di depan!",
        relatedSlideIndex: 3,
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam mengucapkan takbir lebih dulu, makmum mengikuti setelahnya",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Siapa yang takbir duluan?",
        pairs: [
          {
            id: "imam-takbir",
            leftImageUrl: "/images/modul/formasi-imam.png",
            leftLabel: "Takbir Duluan",
            rightLabel: "IMAM",
          },
          {
            id: "makmum-takbir",
            leftImageUrl: "/images/modul/formasi-makmum.png",
            leftLabel: "Takbir Belakangan",
            rightLabel: "MAKMUM",
          },
        ],
        hint: "Makmum selalu mengikuti Imam.",
        relatedSlideIndex: 5,
      },
    ],
  },
  {
    id: "2",
    title: "Nama-Nama Gerakan Sholat",
    description: "Mari kenali nama setiap gerakan dalam sholat.",
    iconUrl: "/assets/items/quran-closed-green.svg",
    slides: [
      {
        type: "content",
        mascot: "book",
        text: "Yuk kenali gerakan-gerakan sholat!",
      },
      {
        type: "content",
        mascot: "book",
        text: "Ini namanya BERDIRI (Qiyam)",
        imageUrl: "/images/modul/gerakan-berdiri.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Ini namanya RUKUK",
        imageUrl: "/images/modul/gerakan-rukuk.png",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya RUKUK?",
        options: [
          { id: "berdiri", imageUrl: "/images/modul/gerakan-berdiri.png", label: "Berdiri" },
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud" },
        ],
        correctAnswerId: "rukuk",
        hint: "Rukuk itu membungkuk dan memegang lutut.",
        relatedSlideIndex: 2,
      },
      {
        type: "content",
        mascot: "book",
        text: "Ini namanya SUJUD",
        imageUrl: "/images/modul/gerakan-sujud.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Ini namanya DUDUK (Tahiyyat)",
        imageUrl: "/images/modul/gerakan-duduk.png",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya SUJUD?",
        options: [
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud" },
          { id: "duduk", imageUrl: "/images/modul/gerakan-duduk.png", label: "Duduk" },
        ],
        correctAnswerId: "sujud",
        hint: "Sujud itu saat dahi menempel ke lantai.",
        relatedSlideIndex: 4,
      },
      {
        type: "content",
        mascot: "book",
        text: "Ini namanya SALAM",
        imageUrl: "/images/modul/gerakan-salam.png",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya DUDUK?",
        options: [
          { id: "berdiri", imageUrl: "/images/modul/gerakan-berdiri.png", label: "Berdiri" },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud" },
          { id: "duduk", imageUrl: "/images/modul/gerakan-duduk.png", label: "Duduk" },
          { id: "salam", imageUrl: "/images/modul/gerakan-salam.png", label: "Salam" },
        ],
        correctAnswerId: "duduk",
        hint: "Duduk dilakukan setelah sujud.",
        relatedSlideIndex: 5,
      },
    ],
  },
  {
    id: "3",
    title: "Mencocokkan Gerakan dan Bacaan Sholat",
    description: "Belajar mengaitkan gerakan dengan bacaannya.",
    iconUrl: "/assets/architecture/lantern.svg",
    slides: [
      {
        type: "content",
        mascot: "book",
        text: "Setiap gerakan sholat punya bacaan sendiri!",
      },
      {
        type: "content",
        mascot: "book",
        text: "Saat BERDIRI, kita membaca Al-Fatihah",
        imageUrl: "/images/modul/gerakan-berdiri.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Saat RUKUK, kita membaca Subhaana Rabbiyal 'Azhiimi wa bihamdih",
        imageUrl: "/images/modul/gerakan-rukuk.png",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Cocokkan gerakan dengan bacaannya!",
        pairs: [
          {
            id: "berdiri-bacaan",
            leftImageUrl: "/images/modul/gerakan-berdiri.png",
            leftLabel: "Berdiri",
            rightLabel: "Al-Fatihah",
          },
          {
            id: "rukuk-bacaan",
            leftImageUrl: "/images/modul/gerakan-rukuk.png",
            leftLabel: "Rukuk",
            rightLabel: "Subhaana Rabbiyal 'Azhiimi wa bihamdih",
          },
        ],
        hint: "Perhatikan gerakannya baik-baik.",
        relatedSlideIndex: 2,
      },
      {
        type: "content",
        mascot: "book",
        text: "Saat SUJUD, kita membaca Subhaana Rabbiyal A'laa wa bihamdih",
        imageUrl: "/images/modul/gerakan-sujud.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "Saat DUDUK, kita membaca Tahiyyat",
        imageUrl: "/images/modul/gerakan-duduk.png",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Cocokkan gerakan dengan bacaannya!",
        pairs: [
          {
            id: "sujud-bacaan",
            leftImageUrl: "/images/modul/gerakan-sujud.png",
            leftLabel: "Sujud",
            rightLabel: "Subhaana Rabbiyal A'laa wa bihamdih",
          },
          {
            id: "duduk-bacaan",
            leftImageUrl: "/images/modul/gerakan-duduk.png",
            leftLabel: "Duduk",
            rightLabel: "Tahiyyat",
          },
        ],
        hint: "Ingat-ingat lagi bacaan saat sujud dan duduk.",
        relatedSlideIndex: 5,
      },
    ],
  },
  {
    id: "4",
    title: "Urutan Gerakan Sholat",
    description: "Mengetahui urutan gerakan sholat yang benar.",
    iconUrl: "/assets/shapes/star-green.svg",
    slides: [
      {
        type: "content",
        mascot: "hello",
        text: "Gerakan sholat itu ada urutannya!",
      },
      {
        type: "content",
        mascot: "book",
        text: "1. Pertama: Berdiri tegak (Takbiratul Ihram)",
        imageUrl: "/images/modul/gerakan-berdiri.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "2. Kedua: Bersedekap membaca Al-Fatihah",
        imageUrl: "/images/modul/gerakan-sedekap.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "3. Ketiga: Rukuk",
        imageUrl: "/images/modul/gerakan-rukuk.png",
      },
      {
        type: "quiz",
        quizType: "sort-order",
        question: "Susun 3 gerakan pertama ini dengan benar!",
        items: [
          { id: "berdiri", imageUrl: "/images/modul/gerakan-berdiri.png", label: "Berdiri", correctOrder: 1 },
          { id: "sedekap", imageUrl: "/images/modul/gerakan-sedekap.png", label: "Sedekap", correctOrder: 2 },
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk", correctOrder: 3 },
        ],
        hint: "Mulai dari berdiri tegak, lalu tangan bersedekap, baru membungkuk.",
        relatedSlideIndex: 3,
      },
      {
        type: "content",
        mascot: "book",
        text: "4. Keempat: I'tidal (berdiri setelah rukuk)",
        imageUrl: "/images/modul/gerakan-itidal.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "5. Kelima: Sujud pertama",
        imageUrl: "/images/modul/gerakan-sujud.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "6. Keenam: Duduk di antara dua sujud",
        imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png",
      },
      {
        type: "content",
        mascot: "book",
        text: "7. Ketujuh: Sujud kedua",
        imageUrl: "/images/modul/gerakan-sujud.png",
      },
      // NOTE: modul 2 ("nama gerakan") & modul 3 ("gerakan + bacaan") still use
      // the simplified single-"Duduk" set; add "duduk di antara dua sujud" there
      // too if we later want full consistency across all modules.
      {
        type: "quiz",
        quizType: "sort-order",
        question: "Susun urutan sujud yang benar!",
        items: [
          { id: "sujud1", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud Pertama", correctOrder: 1 },
          { id: "duduk-antara", imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png", label: "Duduk (2 sujud)", correctOrder: 2 },
          { id: "sujud2", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud Kedua", correctOrder: 3 },
        ],
        hint: "Setelah sujud pertama, kita duduk sebentar, lalu sujud lagi.",
        relatedSlideIndex: 7,
      },
    ],
  },
  {
    id: "5",
    title: "Evaluasi Akhir",
    description: "Uji pengetahuanmu tentang semua materi sholat.",
    iconUrl: "/assets/shapes/sparkle-blue.svg",
    slides: [
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Siapa yang berdiri paling depan saat sholat berjamaah?",
        options: [
          { id: "imam", imageUrl: "/images/modul/formasi-imam.png", label: "Imam" },
          { id: "makmum", imageUrl: "/images/modul/formasi-makmum.png", label: "Makmum" },
        ],
        correctAnswerId: "imam",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Hubungkan posisi yang tepat!",
        pairs: [
          {
            id: "imam-pos",
            leftImageUrl: "/images/modul/formasi-imam.png",
            leftLabel: "Di Depan",
            rightLabel: "IMAM",
          },
          {
            id: "makmum-pos",
            leftImageUrl: "/images/modul/formasi-makmum.png",
            leftLabel: "Di Belakang",
            rightLabel: "MAKMUM",
          },
        ],
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya Rukuk?",
        options: [
          { id: "berdiri", imageUrl: "/images/modul/gerakan-berdiri.png", label: "Berdiri" },
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud" },
        ],
        correctAnswerId: "rukuk",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya Sujud?",
        options: [
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk" },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud" },
          { id: "duduk", imageUrl: "/images/modul/gerakan-duduk.png", label: "Duduk" },
        ],
        correctAnswerId: "sujud",
      },
      {
        type: "quiz",
        quizType: "matching-line",
        question: "Hubungkan gerakan dengan bacaannya!",
        pairs: [
          {
            id: "berdiri-bacaan",
            leftImageUrl: "/images/modul/gerakan-berdiri.png",
            leftLabel: "Berdiri",
            rightLabel: "Al-Fatihah",
          },
          {
            id: "rukuk-bacaan",
            leftImageUrl: "/images/modul/gerakan-rukuk.png",
            leftLabel: "Rukuk",
            rightLabel: "Subhaana Rabbiyal 'Azhiimi wa bihamdih",
          },
        ],
      },
      {
        type: "quiz",
        quizType: "sort-order",
        question: "Susun urutan gerakan sholat ini!",
        items: [
          { id: "berdiri", imageUrl: "/images/modul/gerakan-berdiri.png", label: "Berdiri", correctOrder: 1 },
          { id: "rukuk", imageUrl: "/images/modul/gerakan-rukuk.png", label: "Rukuk", correctOrder: 2 },
          { id: "sujud", imageUrl: "/images/modul/gerakan-sujud.png", label: "Sujud", correctOrder: 3 },
          { id: "duduk", imageUrl: "/images/modul/gerakan-duduk.png", label: "Duduk", correctOrder: 4 },
        ],
      },
    ],
  },
];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}
