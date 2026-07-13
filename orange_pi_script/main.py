import time
import requests

# ==========================================
# KONFIGURASI WEB & API
# ==========================================
# Jika mengetes secara lokal, gunakan IP laptop (misal: 192.168.1.5)
# Jika sudah di-deploy ke Vercel, ganti dengan URL publik (misal: https://lms.vercel.app)
WEB_URL = "http://192.168.1.15:3000" 

HEADERS = {
    # Sandi ini HARUS SAMA dengan IOT_SECRET_KEY di file .env.local milik Web
    "x-api-key": "gema-super-rahasia-2025", 
    "Content-Type": "application/json"
}

def check_status():
    """
    Fungsi ini melakukan 'Polling' (mengetuk pintu Web secara berkala).
    Bertujuan mengecek apakah guru sudah menekan tombol 'Mulai Praktik' di Web.
    """
    try:
        response = requests.get(f"{WEB_URL}/api/iot/status", headers=HEADERS)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print("[Error] Gagal koneksi ke Web. Pastikan server nyala dan IP benar.", e)
    
    return {"status": "idle"}

def start_ai_recording(session_id, student_name):
    """
    Fungsi Utama. Kamera OpenCV dan Deteksi AI berjalan di dalam sini.
    HANYA dieksekusi ketika ada instruksi dari Web.
    """
    print(f"\n[AI START] Mengaktifkan Kamera! Siswa yang akan sholat: {student_name}")
    print(f"ID Sesi: {session_id}\n")
    
    # === CONTOH INTEGRASI KODE AI / OPENCV ===
    # kamera = cv2.VideoCapture(0)
    # while True:
    #     ret, frame = kamera.read()
    #     hasil_ai = model_pose_detection.proses(frame)
    #
    #     # Simulasi mendeteksi gerakan rukuk
    #     if hasil_ai.gerakan == 'rukuk' and hasil_ai.sudah_stabil:
    #         akurasi = hasil_ai.hitung_sudut()
    #         kirim_nilai_ke_web(session_id, "rukuk", akurasi)
    #         
    #     # Jika sequence sholat sudah mencapai gerakan terakhir (salam)
    #     if hasil_ai.gerakan == 'salam':
    #         break
    # =========================================
    
    # [HAPUS BAGIAN INI: Ini hanya simulasi agar script bisa dicoba tanpa kamera]
    time.sleep(2)
    kirim_nilai_ke_web(session_id, "berdiri", 95)
    time.sleep(2)
    kirim_nilai_ke_web(session_id, "rukuk", 80)
    time.sleep(2)
    kirim_nilai_ke_web(session_id, "sujud", 90)
    # [HAPUS SAMPAI SINI]
    
    print("\n[AI SELESAI] Rangkaian sholat selesai. Menutup kamera.")
    
    # Wajib lapor ke web bahwa sesi sudah tuntas agar halaman web guru otomatis refresh ke Rapor
    lapor_sesi_selesai(session_id)

def kirim_nilai_ke_web(session_id, gerakan, nilai):
    """Mengirim akurasi gerakan spesifik (1 demi 1) ke database Web."""
    payload = {
        "session_id": session_id,
        "movement_type": gerakan,
        "accuracy_score": nilai
    }
    
    try:
        res = requests.post(f"{WEB_URL}/api/iot/gerakan/catat", json=payload, headers=HEADERS)
        if res.status_code == 200:
            print(f" -> Berhasil dikirim: {gerakan} ({nilai}%)")
        else:
            print(f" -> Gagal mengirim {gerakan}. Status: {res.status_code}")
    except Exception as e:
        print(" -> Error pengiriman jaringan:", e)

def lapor_sesi_selesai(session_id):
    """Menutup sesi praktik pada Database"""
    try:
        payload = {
            "sesi_id": session_id,
            "status": "Selesai",
            "durasi_detik": 120, # Contoh durasi
            "total_rakaat": 1,
            "total_kesalahan_imam": 0,
            "skor_tumaninah_persen": 85 # Contoh skor akhir
        }
        res = requests.post(f"{WEB_URL}/api/iot/sesi/selesai", json=payload, headers=HEADERS)
        if res.status_code == 200:
            print(" -> Sesi berhasil ditutup di server.")
        else:
            print(f" -> Gagal menutup sesi. Status HTTP: {res.status_code}")
    except Exception as e:
        print(" -> Error saat menutup sesi:", e)


if __name__ == "__main__":
    print("========================================")
    print(" ORANGE PI STANDBY MODE ACTIVE ")
    print("========================================")
    print("Menunggu perintah 'Mulai' dari Web LMS...")

    # Infinite Loop (Standby Mode)
    while True:
        data = check_status()
        
        # Jika respon web mengatakan "active", jalankan Kamera
        if data.get("status") == "active":
            session_id = data.get("session_id")
            student_name = data.get("student_name")
            
            start_ai_recording(session_id, student_name)
            
            print("\n[STANDBY] Kembali ke mode Standby. Menunggu siswa berikutnya...\n")
            
        else:
            # Tidak ada perintah, Orange Pi istirahat (Idle)
            # Tidur 2 detik agar CPU tidak overhead saat menunggu
            time.sleep(2)
