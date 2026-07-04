# Logbook Pengembangan LMS

| Tanggal Kegiatan | Deskripsi Kegiatan | Bukti |
| :--- | :--- | :--- |
| **27 Juni 2026**<br>15.30 - 17.00 | **Perencanaan & Arsitektur**<br>- Mapping kebutuhan fitur LMS (prioritas 1, 2, 3)<br>- Menentukan tech stack final<br>- Merancang skema database<br>- Menentukan strategi hosting (4 bulan VPS → hibah ke RPi)<br>- Memilih package manager: pnpm<br><br>**Setup Project**<br>- Membuat GitHub Organization `gema-imam`<br>- Inisialisasi Next.js 14 (App Router + TypeScript + Tailwind)<br>- Migrasi dari npm ke pnpm<br>- Instalasi dependencies utama:<br>  - `@supabase/supabase-js`<br>  - `@supabase/ssr` (pengganti auth-helpers yang deprecated)<br>  - `cloudinary`<br>  - `lucide-react`<br>  - `clsx` + `tailwind-merge`<br>- Membuat struktur folder lengkap (siswa, guru, api, components, lib) | ![Bukti 27 Juni](images/27-juni.png) |
| **28 Juni 2026** | - Setup GitHub organization `gema-imam`.<br>- Melakukan push commit awal untuk struktur repository ke GitHub. | ![Bukti 28 Juni Part 1](images/28-juni-1.png)<br>![Bukti 28 Juni Part 2](images/28-juni-2.png) |
| **30 Juni 2026** | - | - |
| **1 Juli 2026** | - Setup UI/UX `gema-imam` di Figma.<br>- Mendefinisikan Global Style Management (GSM), aturan desain, dan referensi. | ![Bukti 1 Juli](images/1-juli.png) |
| **2 Juli 2026** | - Redesign sistem dan penyesuaian struktur teknikal.<br>- Menentukan alur konten yang akan ditampilkan di web serta konsep dasar aplikasi. | ![Bukti 2 Juli](images/2-juli.png) |
| **4 Juli 2026** | **Setup Frontend & Bug Fixing**<br>- Mengimplementasikan Navbar responsif dengan Semantic HTML dan Tailwind CSS.<br>- Memperbaiki isu *type safety* pada parameter `children` di Root Layout.<br>- Memperbaiki konfigurasi *styling* global dengan mengembalikan *import* CSS utama.<br>- Menangani error *hydration mismatch* akibat intervensi ekstensi browser.<br>- Menghapus atribut *obsolete version* pada `docker-compose.yml`. | ![Bukti 4 Juli](images/4-juli.png) |
