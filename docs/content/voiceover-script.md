# Naskah Suara Mascot — untuk Direkam

> Naskah siap-rekam untuk pengisi suara (mascot). Baca panduan nada dulu, lalu rekam
> **satu file per baris** sesuai nama file. Bahasa: **Indonesia sederhana**.
>
> Konteks: aplikasi ini **alat bantu guru** di layar besar kelas — suara mascot **menemani**
> penjelasan guru, bukan menggantikannya. Semua tetap bisa dimengerti walau suara dimatikan
> (ada siswa tunarungu), jadi suara = penyemangat & penuntun, bukan satu-satunya sumber info.

## Panduan nada (baca dulu)

- Suara **hangat & ramah**, seperti kakak atau guru yang sabar dan menyayangi.
- **Pelan dan jelas.** Beri jeda kecil antar kalimat. Beri anak waktu.
- **Selalu menyemangati** — apalagi saat salah. **Tidak pernah kecewa, marah, atau meremehkan.**
- Karakter dan energi **sama di semua baris** (konsisten).
- Bukan suara kartun berlebihan; ramah dan tenang.

> **Kapan suara diputar (catatan tim dev):** suara **tidak** diputar paksa berulang. Pemicunya
> **ketuk untuk memutar** (guru/siswa menekan maskot) atau **putar sekali** saat slide pertama
> kali dibuka — supaya guru yang sudah hafal tidak terganggu.

---

## Batch A — Baris Sistem (REKAM DULU — dipakai di semua modul)

Ini kalimat tetap mascot yang muncul di mana-mana. Aman direkam sekarang (tidak akan berubah).

| Nama file | Kata yang dibaca | Nada |
|---|---|---|
| `sys-halo.wav` | "Halo teman-teman! Ayo belajar sholat!" | ceria, menyapa |
| `sys-mulai.wav` | "Ayo kita mulai!" | semangat |
| `sys-lanjut.wav` | "Bagus! Ayo lanjut." | ceria |
| `sys-benar.wav` | "Benar! Hebat sekali!" | merayakan |
| `sys-belum.wav` | "Belum tepat. Ayo coba lagi, ya." | lembut, menyemangati (**bukan kecewa**) |
| `sys-hampir.wav` | "Hampir! Coba sekali lagi ya." | menyemangati, ringan |
| `sys-ulang.wav` | "Yuk, kita lihat lagi sebentar." | tenang, mengajak |
| `sys-coba-lagi.wav` | "Ayo coba lagi!" | menyemangati |
| `sys-berusaha.wav` | "Kamu sudah berusaha. Hebat!" | hangat, bangga |
| `sys-bintang.wav` | "Kamu dapat bintang!" | ceria |
| `sys-selesai.wav` | "Modul selesai! Kamu keren!" | merayakan besar |
| `sys-pilih.wav` | "Pilih gambar yang benar, ya." | ramah, mengarahkan |
| `sys-cocokkan.wav` | "Ayo pasangkan yang benar." | ramah |
| `sys-urutkan.wav` | "Ayo urutkan dari awal." | ramah |

> **Catatan khusus `sys-belum`:** nada baris ini paling menentukan. Bayangkan sedang **memeluk
> anak yang hampir menangis** — suaramu harus membuatnya ingin mencoba lagi, bukan menyerah.

---

## Batch B — Pembuka Modul (1 per modul)

| Nama file | Kata yang dibaca |
|---|---|
| `m1-intro.wav` | "Modul satu. Ayo belajar imam dan makmum." |
| ~~`m2-intro.wav`~~ | *(superseded — see `modul-2/intro.ogg` below)* |
| `m3-intro.wav` | "Modul tiga. Ayo cocokkan gerakan dan bacaannya." |
| `m4-intro.wav` | "Modul empat. Ayo belajar urutan gerakan sholat." |
| `m5-intro.wav` | "Evaluasi. Ayo ulang semua yang sudah kita pelajari!" |

---

## Batch C — Baris Penuntun per Slide (DRAF)

> ⚠️ **Draf** — cocokkan dengan teks slide final dari guru sebelum direkam. Kata-kata bisa
> sedikit berubah. Aman direkam **setelah** guru mengunci teks modul.

### Modul 1 — Imam & Makmum
| Nama file | Kata yang dibaca |
|---|---|
| `m1-imam.wav` | "Imam ada di depan. Imam memimpin sholat." |
| `m1-makmum.wav` | "Makmum ada di belakang. Makmum mengikuti imam." |
| `m1-formasi.wav` | "Semua menghadap kiblat. Imam di depan, makmum di belakang." |

### Modul 2 — Nama Gerakan (shipped in `src/data/modules.ts`, id `"2"`)

> ⚠️ **Filenames below are the real, live paths the app requests** — they differ from the
> `m2-*.wav` draft above (that naming was from an earlier abandoned rewrite attempt). Save each
> file to `public/audio/modul-2/<nama-file>` as **`.ogg`**, matching Modul 1's convention
> (`public/audio/modul-1/*.ogg`). Until recorded, narration is silently skipped — the app stays
> fully usable text-only, so these can be recorded incrementally.

> Teks yang dibaca di kolom "Kata yang dibaca" adalah isi **audio yang sudah direkam**
> (dikonfirmasi oleh yang merekam) — teks di layar (`src/data/modules.ts`) sudah disamakan
> persis dengan ini, bukan sebaliknya, supaya highlight kata-per-kata tetap sinkron.

| Status | Nama file (di `public/audio/modul-2/`) | Kata yang dibaca | Dipakai di |
|---|---|---|---|
| ✅ | `intro.ogg` | "Modul 2, ayo belajar nama gerakan sholat." | Slide pembuka (setelah `system/mulai.ogg`) |
| ✅ | `takbir.ogg` | "Ini takbir, sholat dimulai." | Slide materi Takbir |
| ✅ | `rukuk.ogg` | "Ini rukuk, punggung lurus dan datar." | Slide materi Rukuk |
| ✅ | `itidal.ogg` | "Ini i'tidal, kita berdiri tegak lagi." | Slide materi I'tidal |
| ✅ | `sujud.ogg` | "Ini Sujud. Dahi menyentuh lantai." | Slide materi Sujud |
| ✅ | `duduk.ogg` | "Ini duduk di antara dua sujud." | Slide materi Duduk (antara sujud) |
| ✅ | `duduk-tasyahud.ogg` | "Ini duduk tasyahud." | Slide materi Duduk Tasyahud |
| ✅ | `salam.ogg` | "Ini salam, sholat selesai." | Slide materi Salam |
| ✅ | `kuis-urutkan.ogg` | "Ayo urutkan gerakan ini dari awal!" | Kuis 4 (Urutkan) |
| ✅ | `kuis-rukuk-instruksi.ogg` | "Yuk, cari gambar Rukuk!" | Kuis 1 (Pilih Gambar — Rukuk) |
| ✅ | `kuis-cocokkan.ogg` | "Ayo cocokkan gerakan dengan namanya!" | Kuis 3 (Pasangkan) |

Kuis 2 dan Kuis 5 memakai ulang `system/pilih.ogg` (sudah direkam), sama seperti pola hemat-rekam
di Modul 1. **Semua baris Modul 2 sudah lengkap direkam** (10/10 file khusus modul + 2 baris
sistem yang dipakai ulang).

### Modul 3 — Gerakan & Bacaan (penuntun Bahasa Indonesia; bacaan Arab lihat catatan bawah)
| Nama file | Kata yang dibaca |
|---|---|
| `m3-iftitah.wav` | "Setelah takbir, ada doa iftitah." |
| `m3-rukuk.wav` | "Saat rukuk, kita membaca tasbih rukuk." |
| `m3-itidal.wav` | "Saat berdiri lagi, ada bacaan iktidal." |
| `m3-sujud.wav` | "Saat sujud, kita membaca tasbih sujud." |
| `m3-duduk.wav` | "Saat duduk di antara dua sujud, ada bacaannya." |
| `m3-tahiyat.wav` | "Saat duduk terakhir, ada bacaan tahiyat." |

### Modul 4 — Urutan
| Nama file | Kata yang dibaca |
|---|---|
| `m4-urut.wav` | "Ayo kita urutkan gerakan sholat, dari awal sampai akhir." |
| `m4-bagus.wav` | "Bagus! Kamu sudah tahu urutannya." |

---

## ⚠️ Catatan penting — Bacaan Arab (jangan direkam sembarangan)

Bacaan sholat dalam bahasa Arab (mis. *"Subhaana Rabbiyal A'laa wa bihamdih"*) **tidak** masuk
naskah mascot di atas. Kalau bacaan Arab mau diputar sebagai audio:
- Sebaiknya direkam oleh orang yang **fasih & benar pelafalannya (tajwid)**, atau pakai audio
  yang sudah terpercaya — bukan sekadar dibaca biasa.
- Mascot cukup **menuntun** ("saat sujud, kita membaca…"); bacaan Arabnya file terpisah.

Konfirmasikan dengan guru bacaan mana yang dipakai (rekomendasi audiens ini: mulai dari
**Rukuk & Sujud** karena pendek dan sering).

---

## Cara rekam & kirim

- **Satu file per baris**, nama persis seperti di tabel.
- Format: **WAV 48 kHz, mono** (atau MP3 320 kbps kalau tidak bisa WAV).
- **Ruangan sunyi**, tanpa musik/berisik, jarak mikrofon tetap.
- Kirim ke: _[isi — folder Drive bersama]_.
- Urutan aman: **Batch A dulu** (pasti dipakai) → Batch B → Batch C setelah teks final.
