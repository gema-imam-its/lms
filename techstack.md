# Tech Stack & Integrasi Web Gema Imam

Dokumen ini berisi informasi mengenai *tech stack*, *deployment* web Gema Imam, dan panduan integrasi untuk tim *Hardware/IoT* (Raspberry Pi).

> **⚠️ Bagian 3 & 4 di bawah ini adalah catatan diskusi awal (pra-implementasi) dan sudah tidak sesuai dengan kode aktual** — `POST /api/iot/gerakan` dan `POST /api/iot/sesi/mulai` sudah dihapus, dan bentuk payload di sini berbeda dari kontrak yang sebenarnya berjalan. Lihat `CLAUDE.md` bagian "IoT ingestion contract" untuk alur dan endpoint yang berlaku sekarang.

## 1. Tech Stack Web Gema Imam

### Frontend + Backend
- **Framework** : Next.js 14 (App Router)
- **Language**   : TypeScript
- **Styling**    : Tailwind CSS v4
- **Runtime**    : Node.js 20

### Database
- **Database**   : PostgreSQL (via Supabase)
- **ORM**        : Supabase JS Client

### Storage
- **Video/Image**: Cloudinary

### Package Manager
- **Package Manager**: pnpm

---

## 2. Deployment

- **Hosting**    : VPS Jagoan Hosting (Nebula) - 2 Core CPU, 2GB RAM, 40GB SSD
- **OS**         : Linux Ubuntu
- **Containerization**: Docker + Docker Compose
- **Domain**     : gemaimam.com (dalam proses setup)
- **SSL**        : Certbot (Let's Encrypt)
- **Reverse Proxy**: Nginx

---

## 3. Endpoint untuk Integrasi IoT (RPi 4)

Teman-teman IoT perlu memperhatikan ini untuk mengirimkan data dari sensor/alat ke *server* web.

**Base URL:**
`https://gemaimam.com/api`

### A. Endpoint Menerima Data Gerakan
Menerima data gerakan imam secara *real-time* dari RPi.
- **Endpoint**: `POST /api/iot/gerakan`
- **Body (JSON)**:
  ```json
  {
    "sesi_id": "string",
    "gerakan": "rukuk" | "sujud" | "berdiri" | "duduk" | "itidal",
    "timestamp": 1234567890
  }
  ```
- **Response (Berhasil)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "gerakan": "rukuk",
      "timestamp": 1234567890
    }
  }
  ```

### B. Endpoint Mulai Sesi Sholat
Men-trigger dimulainya sebuah sesi sholat.
- **Endpoint**: `POST /api/iot/sesi/mulai`
- **Body (JSON)**:
  ```json
  {
    "imam_id": "string"
  }
  ```
- **Response (Berhasil)**:
  ```json
  {
    "success": true,
    "sesi_id": "string"
  }
  ```

### C. Endpoint Selesai Sesi Sholat
Men-trigger selesainya sesi sholat yang sedang berlangsung.
- **Endpoint**: `POST /api/iot/sesi/selesai`
- **Body (JSON)**:
  ```json
  {
    "sesi_id": "string"
  }
  ```
- **Response (Berhasil)**:
  ```json
  {
    "success": true,
    "message": "Sesi selesai"
  }
  ```

---

## 4. Cara RPi Mengirim Data ke Web

Berikut adalah contoh implementasi pada skrip Python di Raspberry Pi menggunakan *library* `requests`:

```python
import requests
import time

BASE_URL = "https://gemaimam.com/api"
SECRET_KEY = "nanti_diisi_bersama"  # Autentikasi sederhana

headers = {
  "Content-Type": "application/json",
  "x-api-key": SECRET_KEY
}

# Fungsi: Mulai sesi sholat
def mulai_sesi():
  res = requests.post(
    f"{BASE_URL}/iot/sesi/mulai",
    json={"imam_id": "imam_1"},
    headers=headers
  )
  return res.json()["sesi_id"]

# Fungsi: Kirim data gerakan saat imam bergerak
def kirim_gerakan(sesi_id, gerakan):
  requests.post(
    f"{BASE_URL}/iot/gerakan",
    json={
      "sesi_id": sesi_id,
      "gerakan": gerakan,
      "timestamp": int(time.time())
    },
    headers=headers
  )

# Fungsi: Selesai sesi sholat
def selesai_sesi(sesi_id):
  requests.post(
    f"{BASE_URL}/iot/sesi/selesai",
    json={"sesi_id": sesi_id},
    headers=headers
  )
```

---

## 5. Autentikasi IoT

Untuk alasan keamanan, RPi harus menyertakan API Key pada setiap HTTP Header *request* yang dikirimkan:

`x-api-key: [SECRET_KEY]`

Secret key nanti akan disepakati bersama dan disimpan secara rahasia di:
- **Web**: Environment variable (`.env`)
- **RPi**: *Hardcode* di skrip Python atau lebih baik pada file `.env` terpisah.

---

## 6. Poin Diskusi Lanjutan (Akan didiskusikan bersama)

1. **Format data gerakan dari sensor**
   - Apakah kita akan mengirimkan *string literal* (misal: `"rukuk"`, `"sujud"`) atau *kode angka* (misal: `1`, `2`) agar lebih ringan?
2. **Frekuensi pengiriman data**
   - Apakah data langsung dikirim setiap kali ada perubahan *state* gerakan, atau mengirim *ping/stream* terus-menerus setiap X detik?
3. **Koneksi internet di lokasi implementasi**
   - Apakah akan memanfaatkan *WiFi* dari SLB, atau *modem/hotspot* terdedikasi (seperti *tethering* HP)?
   - Apakah kita memerlukan fitur antrian/simpan-lokal (*local queue & fallback*) di RPi jika sewaktu-waktu koneksi internet terputus di tengah sesi sholat?
4. **Sesi Sholat**
   - Siapa yang berhak men-trigger dimulainya dan selesainya sesi?
   - Apakah akan terdeteksi *otomatis* oleh RPi (misal, saat imam menempati sajadah), atau di-*trigger manual* (tombol fisik / aplikasi *dashboard* web)?
