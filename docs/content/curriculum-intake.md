# LMS Curriculum Intake — Guru Guide &amp; Fill-in Template

> **Draft for internal (PM) review.** A **Bahasa Indonesia** version will be prepared before
> sending to the guru. This is how the SLB teacher tells us exactly what each lesson teaches;
> we build it into the app faithfully.

## 1. What we need from you, Bapak/Ibu Guru (and why)

We (the tech team) built the app's *structure* — the screens, the quizzes, the mascot, the
reports. **You are the content expert.** You decide *what* is taught and *how it's worded*
for your students; we turn it into the app. You do **not** need to design layouts, animations,
scoring, or the "let's review" flow — those are automatic. Just the teaching content + quizzes.

## 2. How one lesson is built (plain version)

A **Modul** is a sequence of full-screen **slides**. Two kinds:

- **Slide Materi (teaching):** one picture + the mascot + a very short caption (**max 2 short
  sentences**). Optionally the mascot **speaks** a short line (voice) — you mark which slides.
- **Slide Kuis (quiz):** three kinds —
  - **Pilih Gambar** — the child taps the correct picture out of 2–4.
  - **Pasangkan** — connect a word to its matching picture (2 pairs).
  - **Urutkan** — put step-cards in the correct order (3 steps).

## 3. Rules every slide must follow (please keep these)

- **Max 2 short, simple sentences** per screen. Everyday words.
- **The picture must carry the meaning** — not words alone (many students read little).
- **Must work with the sound off** — some students are deaf/hard-of-hearing. Voice is a *bonus*,
  never the only way to understand a slide.
- **Religiously correct:** complete movement order (including **duduk di antara dua sujud** and
  the **second sujud**), complete recitations, correct posture & attire. Note **gender
  differences** where they matter (e.g. mukena vs. koko; women's more compact posture).
- **Encouraging, never punishing. No time pressure.**

## 4. Mascot animation — pick one state per slide

Choose from this fixed set (leave blank for a neutral pose):

| State | When to use |
|---|---|
| `hai` | greeting / start of a module |
| `semangat` | cheering the student on |
| `ajak-belajar` | gently guiding / "let's look at this" |
| `rayakan` | celebrating a correct answer / finish |
| `tepuk-tangan` | applauding effort |

## 5. Voice (optional, per slide)

Some slides can have the mascot **speak** a short guide line. If you want voice on a slide,
mark **"Suara: ya"** and write the **exact sentence** to be recorded. Keep it to one short line.
Remember rule #3 — the slide must still make sense silently.

## 6. Fill-in template — copy this block for every module

```
MODUL: ____________________________________________
Tujuan belajar (1 kalimat): ______________________________________

SLIDE 1 — MATERI
  Gambar (jelaskan singkat): ______________________________________
  Teks (maks 2 kalimat): __________________________________________
  Animasi mascot: [ hai / semangat / ajak-belajar / rayakan / tepuk-tangan / — ]
  Suara mascot?  [ tidak ]  /  [ ya → skrip: "________________________" ]

SLIDE 2 — KUIS (jenis: pilih-gambar / pasangkan / urutkan)
  Pertanyaan: _____________________________________________________
  Pilihan / kartu: ________________________________________________
  Jawaban benar: __________________________________________________
  Hint (jika salah): ______________________________________________

  ...(tambahkan SLIDE 3, 4, dst. sampai modul selesai)
```

### Worked example (so the format is clear) — *Modul: Gerakan Rukuk*

```
SLIDE 1 — MATERI
  Gambar: anak laki-laki rukuk, punggung datar, tangan memegang lutut
  Teks: "Ini gerakan rukuk. Punggung lurus dan datar."
  Animasi mascot: ajak-belajar
  Suara mascot: ya → "Yuk, kita belajar gerakan rukuk!"

SLIDE 2 — KUIS (pilih-gambar)
  Pertanyaan: "Mana gambar rukuk yang benar?"
  Pilihan: [rukuk benar] [berdiri] [sujud]
  Jawaban benar: rukuk benar
  Hint: "Lihat punggungnya, harus datar."
```

## 7. Who does what

| You (Guru) | We (Tech team) |
|---|---|
| Lesson content, wording, order | Build slides, quizzes, player, reports |
| Image *concepts* (describe them) | Produce the actual illustrations |
| Which slides get voice + the script | Record (with voice actor) & wire the audio |
| Religious accuracy sign-off | Accessibility, layout, animation, scoring |

## 8. What we need back

- The filled template **per module** (text is enough — we handle the art).
- A note of any module that must be reviewed by a religious reference/ustadz.
- **Timeline:** _[PM to fill — e.g. Modul 1–2 by <date>, so voice scripts can be finalized]_.
