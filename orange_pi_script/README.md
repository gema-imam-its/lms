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

### B. Endpoint Kirim Nilai (Mencatat Gerakan)
Setelah alat mendeteksi Budi selesai melakukan gerakan (misal Rukuk), Orange Pi langsung mengirim nilainya via `POST`.

*   **URL:** `http://[IP_WEB_ATAU_VERCEL]/api/iot/gerakan/catat`
*   **Header:** `{"x-api-key": "gema-super-rahasia-2025", "Content-Type": "application/json"}`
*   **Body (JSON):**
    ```json
    {
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "movement_type": "rukuk",
      "accuracy_score": 85
    }
    ```

---

## 3. Contoh Implementasi di Python (Pseudo-code)

Berikut adalah kerangka *script* Python (`main.py`) yang bisa di-*copy-paste* dan disesuaikan oleh tim IoT:

```python
import time
import requests
# import modul_ai_kamera_kalian

WEB_URL = "http://192.168.x.x:3000" # Ganti dengan IP laptop atau Vercel URL
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
    
    # === MASUKKAN KODE AI / OPENCV KALIAN DI SINI ===
    # kamera.open()
    # while True:
    #     frame = kamera.read()
    #     hasil_ai = model.deteksi(frame)
    # 
    #     # Saat gerakan RUKUK selesai dideteksi, langsung kirim:
    #     if hasil_ai.gerakan == 'rukuk':
    #         kirim_nilai_ke_web(session_id, "rukuk", hasil_ai.akurasi)
    #
    #     # Jika sequence sholat sudah selesai (salam), break
    #     if hasil_ai.selesai:
    #         break
    # ===============================================
    
    # Beri tahu web kalau sesi sholat ini sudah tuntas
    print("Sesi sholat selesai, matikan kamera.")
    requests.post(f"{WEB_URL}/api/iot/sesi/selesai", json={"session_id": session_id}, headers=HEADERS)

def kirim_nilai_ke_web(session_id, gerakan, nilai):
    payload = {
        "session_id": session_id,
        "movement_type": gerakan,
        "accuracy_score": nilai
    }
    requests.post(f"{WEB_URL}/api/iot/gerakan/catat", json=payload, headers=HEADERS)
    print(f"Dikirim: {gerakan} -> {nilai}")


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
