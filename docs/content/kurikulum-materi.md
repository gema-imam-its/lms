# Kurikulum &amp; Materi — LMS Gema Imam (Belajar Sholat)

> **Draf materi untuk tim.** Berisi isi lengkap tiap slide dari 5 modul, siap direview lalu
> dimasukkan ke aplikasi. Aplikasi ini **alat bantu guru** di layar besar kelas — guru tetap
> menjelaskan; materi ini menemani penjelasan guru.
>
> ⚠️ **Cek kebenaran:** materi keagamaan (urutan gerakan, bacaan Arab, aturan) mohon
> dicocokkan dulu dengan **satu referensi terpercaya** (mis. Kemenag) dan dikonfirmasi guru
> sebelum dikunci. Untuk audiens ini: **sedikit tapi benar** lebih baik daripada banyak.

## Cara membaca dokumen ini

Setiap modul berisi **slide** berurutan. Dua jenis slide:

- **Materi** — 1 gambar + maskot + teks pendek (maks 2 kalimat). Bisa ada **Suara** maskot.
- **Kuis** — 3 jenis: **Pilih Gambar**, **Pasangkan**, **Urutkan**.

Aturan tiap slide: **maks 2 kalimat pendek**, kata sederhana, gambar yang menjelaskan, nada
menyemangati (tidak pernah menyalahkan), tanpa batas waktu.

**Maskot (pilih 1 per slide):** `hai` · `semangat` · `ajak-belajar` · `rayakan` · `tepuk-tangan`

**Catatan suara:** suara maskot adalah **bonus** (ada siswa tunarungu) — slide harus tetap
dimengerti walau suara mati. Bacaan Arab **tidak** direkam maskot biasa (lihat Modul 3).

---

## Urutan Gerakan Baku (dipakai Modul 2, 3, 4 — harus konsisten)

| #   | Gerakan                   | Bacaan (untuk Modul 3)                   |
| --- | ------------------------- | ---------------------------------------- |
| 1   | Takbiratul Ihram (takbir) | "Allaahu Akbar"                          |
| 2   | Rukuk                     | "Subhaana Rabbiyal 'Azhiimi wa bihamdih" |
| 3   | I'tidal (berdiri lagi)    | "Rabbanaa lakal hamdu…"                  |
| 4   | Sujud (pertama)           | "Subhaana Rabbiyal A'laa wa bihamdih"    |
| 5   | Duduk di antara dua sujud | "Rabbighfirlii warhamnii…"               |
| 6   | Sujud (kedua)             | (sama seperti sujud pertama)             |
| 7   | Duduk Tasyahud            | "Attahiyyaatu lillaahi…"                 |
| 8   | Salam                     | "Assalaamu'alaikum wa rahmatullaah"      |

---

## MODUL 1 — Perbedaan Imam &amp; Makmum

**Tujuan:** siswa tahu beda imam dan makmum.
**Catatan gambar:** figur **anak laki-laki**, **semua menghadap kiblat**, **imam di depan**,
makmum di belakang. (Perbaiki dari versi lama yang arah hadapnya terbalik.)

**Slide 1 — Materi**

- Gambar: maskot menyapa
- Teks: "Sholat bisa dilakukan bersama-sama. Ini namanya sholat berjamaah."
- Maskot: `hai` · Suara: "Halo teman-teman! Ayo belajar sholat berjamaah!"

**Slide 2 — Materi**

- Gambar: satu anak di depan (imam)
- Teks: "Imam ada di depan. Imam memimpin sholat."
- Maskot: `ajak-belajar` · Suara: "Imam memimpin di depan."

**Slide 3 — Materi**

- Gambar: beberapa anak di belakang (makmum)
- Teks: "Makmum ada di belakang. Makmum mengikuti imam."
- Maskot: `ajak-belajar` · Suara: "Makmum mengikuti imam."

**Slide 4 — Materi**

- Gambar: formasi lengkap (imam depan, makmum baris di belakang, menghadap kiblat)
- Teks: "Imam di depan, makmum di belakang. Semua menghadap kiblat."
- Maskot: `semangat`

**Slide 5 — Kuis (Pilih Gambar)**

- Pertanyaan: "Mana gambar imam?"
- Pilihan: [imam di depan ✅] · [makmum di belakang] · [anak berdiri biasa]
- Jawaban: imam di depan · Hint: "Imam ada di paling depan." (ulang ke Slide 2)

**Slide 6 — Kuis (Pilih Gambar)**

- Pertanyaan: "Mana gambar makmum?"
- Pilihan: [imam] · [makmum di belakang ✅] · [anak bermain]
- Jawaban: makmum di belakang · Hint: "Makmum ada di belakang." (ulang ke Slide 3)

**Slide 7 — Kuis (Pasangkan)**

- Pertanyaan: "Pasangkan yang benar!"
- Pasangan: Imam ↔ Depan · Makmum ↔ Belakang
- Hint: "Imam memimpin di depan." (ulang ke Slide 4)

---

## MODUL 2 — Nama Gerakan Sholat

**Status: ✅ Shipped** (`src/data/modules.ts`, id `"2"`, `locked: false`). Diperluas dari draf
awal — 5 kuis (bukan 3) sesuai permintaan, dan pakai I'tidal + Duduk-antara-sujud (bukan
"Berdiri"/"Duduk Tahiyat") karena itu ilustrasi yang benar-benar ada di
`public/images/modul/{male,female}/`. Duduk Tasyahud (slide 6) ditambahkan setelah rekaman
suaranya masuk — diajarkan, dan juga muncul sebagai pengecoh di Kuis 5.

**Teks tiap slide materi disamakan persis dengan isi audio yang sudah direkam** (bukan
sebaliknya) — supaya highlight kata-per-kata saat audio diputar tetap sinkron.

**Kuis Pilih Gambar & Pasangkan sekarang menyembunyikan label nama** (`hideLabels: true`) —
sebelumnya nama gerakan ditulis persis di bawah/samping gambar, yang membuat kuis jadi
"mencocokkan teks dengan teks" alih-alih menguji pengenalan visual. Kuis Urutkan (Kuis 4) tetap
menampilkan label, karena tugasnya menguji urutan, bukan pengenalan pose.

**Tujuan:** siswa tahu nama gerakan. **Urutan yang diajarkan:** Takbiratul Ihram → Rukuk →
I'tidal → Sujud → Duduk (antara dua sujud) → Duduk Tasyahud → Salam.

**Slide 0 — Materi**

- Teks: "Modul 2. Ayo belajar nama gerakan sholat!"
- Maskot: `hello` · Suara: `system/mulai.ogg` + `modul-2/intro.ogg`

**Slide 1 — Materi**

- Gambar: `gerakan-takbiratul-ihram.png`
- Teks: "Ini Takbir. Sholat dimulai."
- Maskot: `book` · Suara: `modul-2/takbir.ogg`

**Slide 2 — Materi**

- Gambar: `gerakan-rukuk.png`
- Teks: "Ini Rukuk. Punggung lurus dan datar."
- Suara: `modul-2/rukuk.ogg`

**Slide 3 — Materi**

- Gambar: `gerakan-itidal.png`
- Teks: "Ini I'tidal. Kita berdiri tegak lagi."
- Suara: `modul-2/itidal.ogg`

**Slide 4 — Materi**

- Gambar: `gerakan-sujud.png`
- Teks: "Ini Sujud. Dahi menyentuh lantai."
- Suara: `modul-2/sujud.ogg`

**Slide 5 — Materi**

- Gambar: `gerakan-duduk-antara-sujud.png`
- Teks: "Ini Duduk di Antara Dua Sujud."
- Suara: `modul-2/duduk.ogg`

**Slide 6 — Materi**

- Gambar: `gerakan-duduk-tahiyat.png` (pose berbeda dari Slide 5 — jari telunjuk menunjuk)
- Teks: "Ini Duduk Tasyahud."
- Suara: `modul-2/duduk-tasyahud.ogg`

**Slide 7 — Materi**

- Gambar: `gerakan-salam.png`
- Teks: "Ini Salam. Sholat Selesai."
- Suara: `modul-2/salam.ogg`

**Slide 8 — Kuis 1 (Pilih Gambar, label disembunyikan)**

- Pertanyaan: "Mana gambar RUKUK?"
- Pilihan (tanpa label): I'tidal · Rukuk ✅ · Takbir
- Hint: "Rukuk itu membungkuk, punggung lurus." (ulang ke Slide 2) · Suara: `modul-2/kuis-rukuk-instruksi.ogg`

**Slide 9 — Kuis 2 (Pilih Gambar, label disembunyikan)**

- Pertanyaan: "Mana gambar SUJUD?"
- Pilihan (tanpa label): Rukuk · Duduk (Antara Sujud) · Sujud ✅
- Hint: "Sujud itu dahi menyentuh lantai." (ulang ke Slide 4) · Suara: `system/pilih.ogg`

**Slide 10 — Kuis 3 (Pasangkan, label gambar kiri disembunyikan)**

- Pertanyaan: "Cocokkan gerakan dengan namanya!"
- Pasangan: [gambar Takbir] ↔ "Takbir" · [gambar Rukuk] ↔ "Rukuk" · [gambar Sujud] ↔ "Sujud" · [gambar Salam] ↔ "Salam"
- Hint: "Ingat lagi bentuk setiap gerakan, ya." (ulang ke Slide 1) · Suara: `modul-2/kuis-cocokkan.ogg`

**Slide 11 — Kuis 4 (Urutkan — label tetap tampil, menguji urutan bukan pengenalan)**

- Pertanyaan: "Susun urutan gerakan ini!"
- Kartu (acak): "Takbir", "Rukuk", "Sujud" · Urutan benar: Takbir → Rukuk → Sujud
- Hint: "Mulai dari Takbir, lalu Rukuk, baru Sujud." (ulang ke Slide 1) · Suara: `modul-2/kuis-urutkan.ogg`

**Slide 12 — Kuis 5 (Pilih Gambar, label disembunyikan)**

- Pertanyaan: "Mana gambar DUDUK ANTARA DUA SUJUD?" (dipertegas, karena modul sekarang mengajarkan
  dua pose duduk berbeda)
- Pilihan (tanpa label): Sujud · Duduk Tasyahud (pengecoh) · Duduk (Antara Sujud) ✅ · Salam
- Hint: "Bukan yang duduk tasyahud. Duduk ini ada di antara dua sujud." (ulang ke Slide 5) ·
  Suara: `system/pilih.ogg`

---

## MODUL 3 — Cocokkan Gerakan &amp; Bacaan

**Tujuan:** siswa mengenal bacaan tiap gerakan, dan bisa mencocokkan yang pendek.
**Prinsip: ajarkan semua, kuis yang mudah saja.** Bacaan **pendek** (rukuk, iktidal, sujud,
duduk) diajarkan penuh + dikuis; bacaan **panjang** (doa iftitah, tahiyat) cukup **dikenalkan**
(guru yang melengkapi). **Al-Fatihah diajarkan terpisah** (bukan di modul ini). Slide materi
**pakai Suara**. Bacaan Arab: cek pelafalan (lihat catatan bawah) + referensi terpercaya.

**Slide 1 — Materi**

- Gambar: maskot
- Teks: "Setiap gerakan punya bacaan. Ayo kita kenali!"
- Maskot: `hai` · Suara: "Ayo kenali bacaan tiap gerakan!"

**Slide 2 — Materi (kenalkan — bacaan panjang)**

- Gambar: anak berdiri, sesudah takbir
- Teks: "Setelah takbir, kita membaca Doa Iftitah."
- Maskot: `ajak-belajar` · Suara: "Setelah takbir, ada doa iftitah."
- Catatan: bacaan panjang — kenalkan saja; teks lengkap dari guru.

**Slide 3 — Materi (rukuk)**

- Gambar: anak rukuk + tulisan bacaan
- Teks: "Saat rukuk: Subhaana Rabbiyal 'Azhiimi wa bihamdih."
- Suara pengantar: "Saat rukuk, kita membaca tasbih rukuk."

**Slide 4 — Materi (iktidal)**

- Gambar: anak iktidal
- Teks: "Saat iktidal: Rabbanaa lakal hamd."
- Suara pengantar: "Saat berdiri lagi, ada bacaan iktidal."

**Slide 5 — Materi (sujud)**

- Gambar: anak sujud + tulisan bacaan
- Teks: "Saat sujud: Subhaana Rabbiyal A'laa wa bihamdih."
- Suara pengantar: "Saat sujud, kita membaca tasbih sujud."

**Slide 6 — Materi (duduk antara dua sujud)**

- Gambar: anak duduk
- Teks: "Saat duduk: Rabbighfirlii warhamnii."
- Suara pengantar: "Saat duduk di antara dua sujud, ada bacaannya."

**Slide 7 — Materi (kenalkan — bacaan panjang)**

- Gambar: anak duduk tasyahud
- Teks: "Saat duduk tasyahud, kita membaca Tahiyat."
- Maskot: `ajak-belajar` · Suara: "Saat duduk terakhir, ada bacaan tahiyat."
- Catatan: bacaan panjang — kenalkan saja; teks lengkap dari guru.

**Slide 8 — Kuis (Pasangkan) — bacaan pendek, batch 1**

- Pertanyaan: "Pasangkan gerakan dengan bacaannya!"
- Pasangan: [rukuk] ↔ "…'Azhiim…" · [sujud] ↔ "…A'laa…"
- Hint: "Rukuk 'Azhiim, sujud A'laa." (ulang ke Slide 3/5)

**Slide 9 — Kuis (Pasangkan) — bacaan pendek, batch 2**

- Pertanyaan: "Pasangkan lagi, ya!"
- Pasangan: [iktidal] ↔ "Rabbanaa lakal hamd" · [duduk] ↔ "Rabbighfirlii…"
- Hint: "Iktidal = berdiri lagi; duduk = di antara sujud." (ulang ke Slide 4/6)

**Slide 10 — Kuis (Pilih Gambar)**

- Pertanyaan: "Bacaan 'Subhaana Rabbiyal A'laa' untuk gerakan apa?"
- Pilihan: [rukuk] · [sujud ✅] · [duduk]
- Jawaban: sujud · Hint: "A'laa untuk sujud." (ulang ke Slide 5)

> **Catatan bacaan Arab:** bacaan Arab sebaiknya **tidak** direkam pengisi suara maskot biasa.
> Kalau diputar sebagai audio, rekam oleh yang **fasih/tajwid benar** atau pakai audio
> terpercaya — maskot cukup memberi pengantar Bahasa Indonesia. Transliterasi di atas
> **disederhanakan/dipendekkan**; teks lengkap (iftitah, tahiyat, dll.) dari guru/referensi.

---

## MODUL 4 — Urutan Gerakan Sholat

**Tujuan:** siswa tahu urutan gerakan.
**Wajib:** sertakan **duduk di antara dua sujud** dan **sujud kedua** (kebenaran ibadah).

**Slide 1 — Materi**

- Gambar: maskot
- Teks: "Gerakan sholat ada urutannya. Ayo kita pelajari!"
- Maskot: `hai` · Suara: "Ayo belajar urutan gerakan sholat!"

**Slide 2 — Materi**

- Gambar: takbir → berdiri
- Teks: "Pertama takbir. Lalu berdiri membaca."
- Maskot: `ajak-belajar`

**Slide 3 — Materi**

- Gambar: rukuk → iktidal
- Teks: "Setelah itu rukuk. Lalu berdiri lagi (iktidal)."

**Slide 4 — Materi (bagian penting)**

- Gambar: sujud → duduk → sujud
- Teks: "Lalu sujud. Duduk sebentar. Lalu sujud lagi."
- Maskot: `ajak-belajar`

**Slide 5 — Materi**

- Gambar: duduk tasyahud → salam
- Teks: "Terakhir duduk tasyahud, lalu salam."

**Slide 6 — Kuis (Urutkan)** — _bagian dua sujud_

- Pertanyaan: "Urutkan yang benar!"
- Kartu (acak): "Sujud Pertama", "Duduk", "Sujud Kedua"
- Urutan benar: Sujud Pertama → Duduk → Sujud Kedua
- Hint: "Sujud, duduk, sujud lagi." (ulang ke Slide 4)
- ⚠️ Catatan teknis: pakai id berbeda untuk "Sujud Pertama" &amp; "Sujud Kedua" walau gambarnya mirip.

**Slide 7 — Kuis (Urutkan)** — _urutan besar (disederhanakan)_

- Pertanyaan: "Urutkan dari awal!"
- Kartu (acak): "Takbir", "Rukuk", "Sujud", "Salam"
- Urutan benar: Takbir → Rukuk → Sujud → Salam
- Hint: "Mulai dari takbir, selesai dengan salam." (ulang ke Slide 2)

---

## MODUL 5 — Evaluasi

**Tujuan:** mengulang Modul 1–4. **Hanya di sisi pelajaran** (tidak masuk rapor) — tampil di
layar besar kelas. **Tidak ada materi baru** — hanya kuis campuran.

**Slide 1 — Materi (pembuka)**

- Gambar: maskot semangat
- Teks: "Ini evaluasi! Ayo tunjukkan yang sudah kamu pelajari."
- Maskot: `semangat` · Suara: "Ayo kita ulang semuanya!"

**Slide 2 — Kuis (Pilih Gambar) — dari M1**

- "Mana gambar imam?" → [imam ✅] · [makmum] · [anak berdiri]

**Slide 3 — Kuis (Pilih Gambar) — dari M2**

- "Mana gambar rukuk?" → [rukuk ✅] · [sujud] · [berdiri]

**Slide 4 — Kuis (Pasangkan) — dari M2**

- "Pasangkan gerakan dan namanya!" → [rukuk]↔"Rukuk" · [sujud]↔"Sujud"

**Slide 5 — Kuis (Pasangkan) — dari M3**

- "Pasangkan gerakan dan bacaannya!" → [rukuk]↔"…'Azhiim…" · [sujud]↔"…A'laa…"

**Slide 6 — Kuis (Urutkan) — dari M4**

- "Urutkan gerakan sholat!" → Takbir → Rukuk → Sujud → Salam

**Slide 7 — Kuis (Pilih Gambar) — dari M2**

- "Mana gambar sujud?" → [berdiri] · [sujud ✅] · [rukuk]

**Slide 8 — Kuis (Pilih Gambar) — dari M1**

- "Mana gambar makmum?" → [imam] · [makmum ✅] · [anak bermain]

**Penutup (otomatis):** layar "Modul Selesai!" + bintang (nilai keseluruhan). Setiap usaha
tetap dapat bintang — tidak ada yang gagal.

---

## Ringkasan jumlah slide

| Modul | Judul                | Slide | Materi | Kuis |
| ----- | -------------------- | ----- | ------ | ---- |
| 1     | Imam &amp; Makmum    | 7     | 4      | 3    |
| 2     | Nama Gerakan         | 13    | 8      | 5    |
| 3     | Gerakan &amp; Bacaan | 10    | 7      | 3    |
| 4     | Urutan Gerakan       | 7     | 5      | 2    |
| 5     | Evaluasi             | 8     | 1      | 7    |

> Semua ≤10 slide/modul (sesuai kesepakatan). Angka bisa disesuaikan guru.

## Yang masih perlu dikonfirmasi tim/guru

1. **Cek kebenaran** urutan + bacaan dengan referensi terpilih.
2. **Slide mana yang pakai suara** (rekomendasi: pembuka tiap modul + Modul 3).
3. **Aset gambar** per gerakan (lihat "Catatan gambar" tiap modul).
4. Modul 3: teks **lengkap** bacaan panjang (doa iftitah, tahiyat) dari guru/referensi; dan
   konfirmasi transliterasi pendek (rukuk, iktidal, sujud, duduk) sudah benar.
