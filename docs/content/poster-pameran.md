# GEMA Imam — Konten Poster Pameran

## Nama Produk
**GEMA Imam**
LMS (Learning Management System) untuk siswa SLB (Sekolah Luar Biasa) belajar praktik sholat.

## Tagline (pilih salah satu)
- "Belajar Sholat, Ramah untuk Semua"
- "Bantu Siswa Tunarungu & Tunagrahita Belajar Sholat dengan Visual dan Teknologi"

## Latar Belakang (singkat)
Siswa tunarungu dan tunagrahita di SLB kesulitan belajar gerakan & bacaan sholat lewat metode konvensional (ceramah/teks panjang). GEMA Imam hadir sebagai media belajar visual interaktif, dilengkapi teknologi kamera pintar untuk memantau praktik langsung siswa.

## Fitur Utama

### 1. Modul Pembelajaran Interaktif
- Materi disajikan lewat **slide visual** (gambar besar + karakter maskot), kalimat singkat dan sederhana — cocok untuk siswa tunarungu (tanpa suara) dan tunagrahita (tanpa banyak teks).
- **3 jenis kuis interaktif**: pilih gambar, mencocokkan gambar, dan urutkan gerakan.
- Sistem feedback yang lembut dan tidak menghukum — jika salah, siswa diajak mengulang materi dulu, bukan langsung dinyatakan gagal.
- Progres belajar & bintang pencapaian tersimpan otomatis.

### 2. Rapor Praktik Sholat Berbasis IoT & AI
- Kamera (Orange Pi + AI MediaPipe) mendeteksi **gerakan sholat siswa secara real-time** — rukuk, sujud, duduk, dst.
- Sistem menilai ketepatan postur dan **tuma'ninah** (ketenangan saat menahan gerakan).
- Guru dapat melihat **riwayat & rincian evaluasi tiap sesi praktik** per siswa — bukan cuma nilai akhir, tapi detail tiap gerakan.
- Setiap gerakan yang tercatat disertai **foto bukti postur siswa** saat itu, bukan cuma skor angka.
- Guru bisa memulai/mengelola sesi praktik langsung dari halaman web, tanpa perlu menyentuh alat.

## Teknologi yang Digunakan
- **Web**: Next.js (React)
- **Computer Vision**: Orange Pi 4 Pro + MediaPipe (deteksi pose tubuh)
- **Database**: Supabase (PostgreSQL)

## Manfaat
- Membantu guru SLB mengajar praktik sholat lebih visual, terukur, dan terdokumentasi.
- Siswa belajar dengan cara yang sesuai kebutuhan mereka (visual, tanpa tekanan, tanpa perlu mendengar instruksi lisan).
- Evaluasi praktik jadi berbasis data, bukan hanya pengamatan manual guru.
