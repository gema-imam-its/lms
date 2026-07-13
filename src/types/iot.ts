// ============================================
// Type definitions untuk integrasi IoT GEMA Imam
// ============================================

// --- Database Entity Types ---

export interface Imam {
  id: string; // UUID
  nama: string;
  kelas?: string;
  created_at: string;
}

export interface SholatSession {
  id: string; // UUID
  imam_id: string; // FK → imams.id
  nama_sholat: string; // Subuh, Dhuhur, Ashar, Maghrib, Isya
  tanggal: string; // ISO 8601
  durasi_detik: number;
  status: "Selesai" | "Dibatalkan";
  total_rakaat: number;
  total_kesalahan_imam: number;
  skor_tumaninah_persen: number;
  created_at: string;
}

export interface MovementLog {
  id: string; // UUID
  sesi_id: string; // FK → sholat_sessions.id
  rakaat: number;
  nama_gerakan: string; // berdiri, sedekap, rukuk, itidal, sujud, duduk, dll
  entry_time: string; // HH:MM:SS
  exit_time?: string;
  duration_seconds?: number;
  tumaninah_terpenuhi?: boolean | null;
  gerakan_menyimpang?: string[];
  hip_angle?: number;
  knee_angle?: number;
  arm_angle?: number;
  foto_pose_url?: string; // URL Cloudinary
}

// --- API Request Body Types ---

export interface MulaiSesiRequest {
  imam_id: string;
  nama_sholat: string;
  timestamp: string; // ISO 8601
}

export interface MulaiSesiResponse {
  success: boolean;
  sesi_id?: string;
  error?: string;
}

export interface GerakanRequest {
  sesi_id: string;
  rakaat: number;
  nama_gerakan: string;
  entry_time: string;
  exit_time?: string;
  duration_seconds?: number;
  tumaninah_terpenuhi?: boolean | null;
  gerakan_menyimpang?: string[];
  hip_angle?: number;
  knee_angle?: number;
  arm_angle?: number;
  foto_pose_url?: string;
}

export interface GerakanResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SelesaiSesiRequest {
  sesi_id: string;
  status: "Selesai" | "Dibatalkan";
  durasi_detik: number;
  total_rakaat: number;
  total_kesalahan_imam: number;
  skor_tumaninah_persen: number;
}

export interface SelesaiSesiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface MediaUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}
