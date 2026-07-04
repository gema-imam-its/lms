# Logbook Pengembangan LMS

| Tanggal Kegiatan | Deskripsi Kegiatan | Bukti |
| :--- | :--- | :--- |
| **27 Juni 2026**<br>15.30 - 17.00 | **Perencanaan & Arsitektur**<br>- Mapping kebutuhan fitur LMS (prioritas 1, 2, 3)<br>- Menentukan tech stack final<br>- Merancang skema database<br>- Menentukan strategi hosting (4 bulan VPS → hibah ke RPi)<br>- Memilih package manager: pnpm<br><br>**Setup Project**<br>- Buat GitHub Organization `gema-imam`<br>- Init Next.js 14 (App Router + TypeScript + Tailwind)<br>- Migrasi dari npm ke pnpm<br>- Install dependencies:<br>  - `@supabase/supabase-js`<br>  - `@supabase/ssr` (pengganti auth-helpers yang deprecated)<br>  - `cloudinary`<br>  - `lucide-react`<br>  - `clsx` + `tailwind-merge`<br>- Buat struktur folder lengkap (siswa, guru, api, components, lib) | ![Bukti 27 Juni](images/27-juni.png) |
| **28 Juni 2026** | - Setup github gema imam organization<br>- Push commit repository structure ke github. | ![Bukti 28 Juni Part 1](images/28-juni-1.png)<br>![Bukti 28 Juni Part 2](images/28-juni-2.png) |
| **30 Juni 2026** | - | - |
| **1 Juli 2026** | - Setup UI/UX gema imam di figma, define gsm, rules, references | ![Bukti 1 Juli](images/1-juli.png) |
| **2 Juli 2026** | - Redesign system dan structure technical meliputi konten yang akan ditampilkan di web dan konsep website. | ![Bukti 2 Juli](images/2-juli.png) |
| **4 Juli 2026** | **Setup Frontend & Bug Fixing**<br>- Setup Navbar menggunakan Semantic HTML (`<nav>`, `<header>`, dll) dan Tailwind CSS.<br>- Memperbaiki issue TypeScript (`any` type) pada `children` di `layout.tsx`.<br>- Memperbaiki issue styling yang rusak (mengembalikan `globals.css` import).<br>- Memperbaiki hydration mismatch akibat ekstensi browser (menambahkan `suppressHydrationWarning`).<br>- Menghapus warning obsolete `version` di `docker-compose.yml`. | ![Bukti 4 Juli](images/4-juli.png) |
