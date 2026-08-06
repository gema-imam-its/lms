import { ModuleDefinition } from "@/types/module";

export const modules: ModuleDefinition[] = [
  {
    id: "1",
    title: "Perbedaan Imam dan Makmum",
    description: "Pelajari siapa itu Imam dan Makmum dalam sholat berjamaah.",
    iconUrl: "/assets/items/quran-open.svg",
    locked: false,
    slides: [
      {
        type: "content",
        mascot: "hello",
        text: "Ayo mulai belajar! Halo teman-teman, ayo belajar sholat berjamaah",
        narrationUrl: ["/audio/system/mulai.ogg", "/audio/modul-1/intro.ogg"],
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam memimpin di depan",
        imageUrl: "/images/modul/formasi-imam.png",
        narrationUrl: "/audio/modul-1/imam.ogg",
      },
      {
        type: "content",
        mascot: "book",
        text: "Makmum mengikuti Imam",
        imageUrl: "/images/modul/formasi-makmum.png",
        narrationUrl: "/audio/modul-1/makmum.ogg",
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam memimpin di depan, Makmum mengikuti Imam",
        imageUrl: "/images/modul/formasi-jamaah.png",
        narrationUrl: ["/audio/modul-1/imam.ogg", "/audio/modul-1/makmum.ogg"],
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Siapa yang berdiri sendiri di depan?",
        options: [
          {
            id: "imam",
            imageUrl: "/images/modul/formasi-imam.png",
            label: "Imam",
          },
          {
            id: "makmum",
            imageUrl: "/images/modul/formasi-makmum.png",
            label: "Makmum",
          },
        ],
        correctAnswerId: "imam",
        hint: "Ingat, Imam selalu di depan!",
        relatedSlideIndex: 3,
        narrationUrl: "/audio/modul-1/kuis-1-instruksi.ogg",
      },
      {
        type: "content",
        mascot: "book",
        text: "Imam bertakbir dulu, Makmum mengikuti sesudahnya",
        narrationUrl: "/audio/modul-1/takbir.ogg",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Siapa yang takbir duluan?",
        options: [
          {
            id: "imam",
            imageUrl: "/images/modul/formasi-imam.png",
            label: "Imam",
          },
          {
            id: "makmum",
            imageUrl: "/images/modul/formasi-makmum.png",
            label: "Makmum",
          },
        ],
        correctAnswerId: "imam",
        hint: "Makmum selalu mengikuti Imam.",
        relatedSlideIndex: 5,
        // Reverted from the generic "Pilih gambar yang benar, ya" (which
        // matched pilih.ogg's audio but gave no clue this quiz is about
        // takbir order rather than position, reusing the same Imam/Makmum
        // images as Quiz 1) — the specific question is clearer even though
        // it no longer matches the generic audio prompt verbatim.
        narrationUrl: "/audio/system/pilih.ogg",
      },
    ],
  },
  {
    id: "2",
    title: "Nama-Nama Gerakan Sholat",
    description: "Mari kenali nama setiap gerakan dalam sholat.",
    iconUrl: "/assets/items/quran-closed-green.svg",
    locked: false,
    slides: [
      {
        // index 0 — text matches the recorded intro.ogg exactly ("Modul 2,
        // ayo belajar nama gerakan sholat"), not a paraphrase, so the
        // read-along highlight tracks correctly.
        type: "content",
        mascot: "hello",
        text: "Modul 2. Ayo belajar nama gerakan sholat!",
        narrationUrl: ["/audio/system/mulai.ogg", "/audio/modul-2/intro.ogg"],
      },
      {
        // index 1 — text matches takbir.ogg ("Ini takbir, sholat dimulai").
        type: "content",
        mascot: "book",
        text: "Ini Takbir. Sholat dimulai.",
        imageUrl: "/images/modul/gerakan-takbiratul-ihram.png",
        narrationUrl: "/audio/modul-2/takbir.ogg",
      },
      {
        // index 2 — text matches rukuk.ogg ("Ini rukuk, punggung lurus dan datar").
        type: "content",
        mascot: "book",
        text: "Ini Rukuk. Punggung lurus dan datar.",
        imageUrl: "/images/modul/gerakan-rukuk.png",
        narrationUrl: "/audio/modul-2/rukuk.ogg",
      },
      {
        // index 3 — text matches itidal.ogg ("Ini i'tidal, kita berdiri tegak lagi").
        type: "content",
        mascot: "book",
        text: "Ini I'tidal. Kita berdiri tegak lagi.",
        imageUrl: "/images/modul/gerakan-itidal.png",
        narrationUrl: "/audio/modul-2/itidal.ogg",
      },
      {
        // index 4
        type: "content",
        mascot: "book",
        text: "Ini Sujud. Dahi menyentuh lantai.",
        imageUrl: "/images/modul/gerakan-sujud.png",
        narrationUrl: "/audio/modul-2/sujud.ogg",
      },
      {
        // index 5 — text matches duduk.ogg ("Ini duduk di antara dua sujud").
        type: "content",
        mascot: "book",
        text: "Ini Duduk di Antara Dua Sujud.",
        imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png",
        narrationUrl: "/audio/modul-2/duduk.ogg",
      },
      {
        // index 6 — distinct pose from the "Duduk" above (index 5); the
        // matching-line/sort-order quizzes below only cover
        // takbir/rukuk/sujud/salam, so this stays taught-not-quizzed, same
        // as I'tidal (index 3). Text matches duduk-tasyahud.ogg ("Ini duduk
        // tasyahud").
        type: "content",
        mascot: "book",
        text: "Ini Duduk Tasyahud.",
        imageUrl: "/images/modul/gerakan-duduk-tahiyat.png",
        narrationUrl: "/audio/modul-2/duduk-tasyahud.ogg",
      },
      {
        // index 7 — text matches salam.ogg ("Ini salam, sholat selesai").
        type: "content",
        mascot: "book",
        text: "Ini Salam. Sholat Selesai.",
        imageUrl: "/images/modul/gerakan-salam.png",
        narrationUrl: "/audio/modul-2/salam.ogg",
      },
      {
        // index 8 — quiz 1
        type: "quiz",
        quizType: "image-choice",
        question: "Mana gambar RUKUK?",
        options: [
          {
            id: "itidal",
            imageUrl: "/images/modul/gerakan-itidal.png",
            label: "I'tidal",
          },
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
          },
          {
            id: "takbir",
            imageUrl: "/images/modul/gerakan-takbiratul-ihram.png",
            label: "Takbir",
          },
        ],
        correctAnswerId: "rukuk",
        hint: "Rukuk itu membungkuk, punggung lurus.",
        relatedSlideIndex: 2,
        narrationUrl: "/audio/modul-2/kuis-rukuk-instruksi.ogg",
        hideLabels: true,
      },
      {
        // index 9 — quiz 2
        type: "quiz",
        quizType: "image-choice",
        question: "Mana gambar SUJUD?",
        options: [
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
          },
          {
            id: "duduk",
            imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png",
            label: "Duduk (Antara Sujud)",
          },
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
          },
        ],
        correctAnswerId: "sujud",
        hint: "Sujud itu dahi menyentuh lantai.",
        relatedSlideIndex: 4,
        narrationUrl: "/audio/system/pilih.ogg",
        hideLabels: true,
      },
      {
        // index 10 — quiz 3
        type: "quiz",
        quizType: "matching-line",
        question: "Cocokkan gerakan dengan namanya!",
        pairs: [
          {
            id: "takbir-nama",
            leftImageUrl: "/images/modul/gerakan-takbiratul-ihram.png",
            leftLabel: "Takbir",
            rightLabel: "Takbir",
          },
          {
            id: "rukuk-nama",
            leftImageUrl: "/images/modul/gerakan-rukuk.png",
            leftLabel: "Rukuk",
            rightLabel: "Rukuk",
          },
          {
            id: "sujud-nama",
            leftImageUrl: "/images/modul/gerakan-sujud.png",
            leftLabel: "Sujud",
            rightLabel: "Sujud",
          },
          {
            id: "salam-nama",
            leftImageUrl: "/images/modul/gerakan-salam.png",
            leftLabel: "Salam",
            rightLabel: "Salam",
          },
        ],
        hint: "Ingat lagi bentuk setiap gerakan, ya.",
        relatedSlideIndex: 1,
        narrationUrl: "/audio/modul-2/kuis-cocokkan.ogg",
        hideLabels: true,
      },
      {
        // index 11 — quiz 4
        type: "quiz",
        quizType: "sort-order",
        question: "Susun urutan gerakan ini!",
        items: [
          {
            id: "takbir",
            imageUrl: "/images/modul/gerakan-takbiratul-ihram.png",
            label: "Takbir",
            correctOrder: 1,
          },
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
            correctOrder: 2,
          },
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
            correctOrder: 3,
          },
        ],
        hint: "Mulai dari Takbir, lalu Rukuk, baru Sujud.",
        relatedSlideIndex: 1,
        narrationUrl: "/audio/modul-2/kuis-urutkan.ogg",
      },
      {
        // index 12 — quiz 5. Question spells out WHICH duduk (the module now
        // teaches two: antara-sujud at index 5, tasyahud at index 6) and
        // includes the tasyahud pose as a distractor so the quiz actually
        // tests telling the two apart, not just "duduk vs. everything else".
        type: "quiz",
        quizType: "image-choice",
        question: "Mana gambar DUDUK ANTARA DUA SUJUD?",
        options: [
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
          },
          {
            id: "duduk-tasyahud",
            imageUrl: "/images/modul/gerakan-duduk-tahiyat.png",
            label: "Duduk Tasyahud",
          },
          {
            id: "duduk",
            imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png",
            label: "Duduk (Antara Sujud)",
          },
          {
            id: "salam",
            imageUrl: "/images/modul/gerakan-salam.png",
            label: "Salam",
          },
        ],
        correctAnswerId: "duduk",
        hint: "Bukan yang duduk tasyahud. Duduk ini ada di antara dua sujud.",
        relatedSlideIndex: 5,
        narrationUrl: "/audio/system/pilih.ogg",
        hideLabels: true,
      },
    ],
  },
  {
    id: "3",
    title: "Mencocokkan Gerakan dan Bacaan Sholat",
    description: "Belajar mengaitkan gerakan dengan bacaannya.",
    iconUrl: "/assets/architecture/lantern.svg",
    locked: true,
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
    locked: true,
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
          {
            id: "berdiri",
            imageUrl: "/images/modul/gerakan-berdiri.png",
            label: "Berdiri",
            correctOrder: 1,
          },
          {
            id: "sedekap",
            imageUrl: "/images/modul/gerakan-sedekap.png",
            label: "Sedekap",
            correctOrder: 2,
          },
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
            correctOrder: 3,
          },
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
          {
            id: "sujud1",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud Pertama",
            correctOrder: 1,
          },
          {
            id: "duduk-antara",
            imageUrl: "/images/modul/gerakan-duduk-antara-sujud.png",
            label: "Duduk (2 sujud)",
            correctOrder: 2,
          },
          {
            id: "sujud2",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud Kedua",
            correctOrder: 3,
          },
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
    locked: true,
    slides: [
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Siapa yang berdiri paling depan saat sholat berjamaah?",
        options: [
          {
            id: "imam",
            imageUrl: "/images/modul/formasi-imam.png",
            label: "Imam",
          },
          {
            id: "makmum",
            imageUrl: "/images/modul/formasi-makmum.png",
            label: "Makmum",
          },
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
          {
            id: "berdiri",
            imageUrl: "/images/modul/gerakan-berdiri.png",
            label: "Berdiri",
          },
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
          },
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
          },
        ],
        correctAnswerId: "rukuk",
      },
      {
        type: "quiz",
        quizType: "image-choice",
        question: "Mana yang namanya Sujud?",
        options: [
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
          },
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
          },
          {
            id: "duduk",
            imageUrl: "/images/modul/gerakan-duduk.png",
            label: "Duduk",
          },
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
          {
            id: "berdiri",
            imageUrl: "/images/modul/gerakan-berdiri.png",
            label: "Berdiri",
            correctOrder: 1,
          },
          {
            id: "rukuk",
            imageUrl: "/images/modul/gerakan-rukuk.png",
            label: "Rukuk",
            correctOrder: 2,
          },
          {
            id: "sujud",
            imageUrl: "/images/modul/gerakan-sujud.png",
            label: "Sujud",
            correctOrder: 3,
          },
          {
            id: "duduk",
            imageUrl: "/images/modul/gerakan-duduk.png",
            label: "Duduk",
            correctOrder: 4,
          },
        ],
      },
    ],
  },
];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}
