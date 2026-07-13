# Panduan Integrasi Alat IoT (Orange Pi) dengan Web LMS

Halo Tim IoT! Saat ini alat Orange Pi langsung melakukan *recording* dan deteksi AI sejak pertama kali dinyalakan. Untuk menyambungkannya dengan Web LMS agar rapor bisa dipisah per siswa, kita perlu mengubah sedikit cara kerja *script* utama di Orange Pi dari **"Selalu Merekam"** menjadi **"Standby & Menunggu Perintah"**.

Berikut adalah panduan arsitektur dan contoh kode yang bisa diterapkan di Orange Pi.

---

## 1. Perubahan Logika (Flow) Program

**Alur Lama:**
Alat Menyala ➔ Buka Kamera ➔ Looping Deteksi AI ➔ Selesai (Hard stop).

**Alur Baru:**
Alat Menyala ➔ **Masuk Mode Standby (Kamera Off/Idle)** ➔ Cek ke Web apakah ada siswa yang siap praktik ➔ Jika ADA perintah: Buka Kamera & Deteksi AI ➔ Kirim Nilai ke Web ➔ Tutup Kamera ➔ Kembali ke Mode Standby.

---

## 2. Cara Berkomunikasi dengan Web (REST API)

Kita sepakati bahwa Web LMS akan bertindak sebagai "Bos" dan Orange Pi sebagai "Pekerja". Orange Pi harus sering-sering bertanya ke Web dengan metode **Polling** (misal tiap 3 detik sekali).

### A. Endpoint Cek Status (Polling)
Orange Pi melakukan `GET` request ke Web untuk melihat apakah ada sesi praktik yang baru dibuat oleh guru.

*   **URL:** `http://[IP_WEB_ATAU_VERCEL]/api/iot/status`
*   **Header:** `{"x-api-key": "gema-super-rahasia-2025"}`

*Contoh Respon dari Web jika sedang TIDAK ADA yang praktik:*
```json
{
  "status": "idle"
}
```

*Contoh Respon jika guru mengklik "Mulai Praktik Budi" di Web:*
```json
{
  "status": "active",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "student_name": "Budi"
}
```

### B. Endpoint Kirim Ringkasan (Setelah Sholat Selesai / Dibatalkan)
Setelah alat mendeteksi Salam (sesi tuntas) ATAU ada perintah Reset dari Telegram (dibatalkan), alat mengumpulkan semua data gerakan menjadi satu JSON utuh dan mengirimkannya sekaligus (Bulk Report).

*   **URL:** `http://[IP_WEB_ATAU_VERCEL]/api/iot/sesi/selesai`
*   **Header:** `{"x-api-key": "gema-super-rahasia-2025", "Content-Type": "application/json"}`
*   **Body (JSON):**
    ```json
    {
      "sesi_id": "550e8400-e29b-41d4-a716-446655440000",
      "sholat": "Isya",
      "durasi_detik": 261.8,
      "status": "Selesai", // Atau "Dibatalkan" jika di-reset via telegram
      "total_rakaat_dilewati": 4,
      "kesalahan_imam": 2,
      "statistik_tumaninah": {
        "skor_persentase": 80.0
      },
      "log_transisi": [
        {
          "rakaat": 1,
          "state": "RUKUK",
          "entry_time": "01:15:58",
          "exit_time": "01:16:07",
          "duration_seconds": 9.02,
          "tumaninah_met": true,
          "gerakan_menyimpang": [],
          "hip_angle": 126.8,
          "knee_angle": 163.0,
          "arm_angle": 175.6
        }
        // ... (masukkan semua log transisi ke array ini)
      ]
    }
    ```

---

## 3. Contoh Implementasi di Python (Pseudo-code)

Berikut adalah kerangka *script* Python (`main.py`) yang harus dipastikan agar **AI tidak looping sendirian**:

```python
import time
import requests

WEB_URL = "https://[nama-vercel-mu].vercel.app" 
HEADERS = {
    "x-api-key": "gema-super-rahasia-2025",
    "Content-Type": "application/json"
}

def check_status():
    """Fungsi untuk bertanya ke Web apakah ada perintah mulai"""
    try:
        response = requests.get(f"{WEB_URL}/api/iot/status", headers=HEADERS)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print("Gagal konek ke Web:", e)
    return {"status": "idle"}

def start_ai_recording(session_id, student_name):
    """Fungsi utama AI kalian dijalankan di sini"""
    print(f"Memulai rekam untuk {student_name}...")
    
    status_akhir = "Selesai"
    # === CONTOH LOGIC AI / OPENCV ===
    # kamera.open()
    # while True:
    #     frame = kamera.read()
    #     hasil_ai = model.deteksi(frame)
    # 
    #     # PENTING: Jika ada trigger RESET dari TELEGRAM:
    #     if trigger_telegram_reset():
    #         status_akhir = "Dibatalkan"
    #         break  <-- Keluar dari loop kamera segera!
    #
    #     # Jika sequence sholat normal sudah selesai (salam):
    #     if hasil_ai.selesai:
    #         status_akhir = "Selesai"
    #         break  <-- Keluar dari loop kamera segera!
    # ===============================================
    
    # Beri tahu web kalau sesi sholat ini sudah tutup/batal (beserta datanya)
    print(f"Sesi ditutup dengan status: {status_akhir}")
    
    # Kumpulkan summary-nya
    payload_ai = {
        "sesi_id": session_id,
        "status": status_akhir,
        "sholat": "Isya", # (isi dari AI)
        "durasi_detik": 120, # (isi dari AI)
        "total_rakaat_dilewati": 1, # (isi dari AI)
        "kesalahan_imam": 0, # (isi dari AI)
        "statistik_tumaninah": { "skor_persentase": 85 },
        "log_transisi": [] # (isi dengan array log_transisi dari AI)
    }
    
    requests.post(f"{WEB_URL}/api/iot/sesi/selesai", json=payload_ai, headers=HEADERS)


# ==========================================
# LOOP UTAMA (STANDBY MODE)
# ==========================================
print("Orange Pi Menyala. Standby menunggu perintah dari Web...")

while True:
    data = check_status()
    
    if data.get("status") == "active":
        # Ada perintah masuk dari Web!
        session_id = data.get("session_id")
        student_name = data.get("student_name")
        
        # Jalankan AI
        start_ai_recording(session_id, student_name)
        
        # Setelah selesai, dia otomatis akan kembali ke mode Standby
        print("Kembali ke mode Standby...")
        
    else:
        # Tidak ada perintah, tidur 2 detik biar CPU tidak panas
        time.sleep(2)
```

## 4. Keuntungan Arsitektur Ini
1. **Tidak boros listrik & CPU**: Kamera dan AI hanya menyala ketika benar-benar ada anak yang bersiap praktik.
2. **Tidak usah Repot SSH**: IoT dan Web berkomunikasi layaknya aplikasi modern (via API HTTP).
3. **Data Tidak Tercampur**: Karena Web mengirimkan `session_id`, data akurasi gerakan akan masuk persis ke rapor anak yang sedang dipanggil oleh guru.
