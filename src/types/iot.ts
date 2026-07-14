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
  status: "PENDING" | "ACTIVE" | "Selesai" | "Dibatalkan";
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
  exit_time?: string | null;
  exit_reason?: "NORMAL_FINISH" | "CANCELLED" | null; // kenapa exit_time null
  duration_seconds?: number | null;
  tumaninah_terpenuhi?: boolean | null;
  gerakan_menyimpang?: string[];
  hip_angle?: number | null;
  knee_angle?: number | null;
  arm_angle?: number | null;
  foto_pose_url?: string | null; // URL Cloudinary
  urutan?: number | null; // urutan asli di log_transisi, dipakai untuk timeline
}

// --- API Request Body Types ---

export interface SelesaiSesiRequest {
  sesi_id: string;
  status?: "Selesai" | "Dibatalkan";
  durasi_detik?: number;
  total_rakaat_dilewati?: number;
  kesalahan_imam?: number;
  statistik_tumaninah?: {
    total_gerakan_tumaninah?: number;
    terpenuhi?: number;
    tidak_terpenuhi?: number;
    skor_persentase?: number;
  };
  log_transisi?: Array<{
    rakaat?: number;
    state?: string;
    entry_time?: string;
    exit_time?: string | null;
    duration_seconds?: number | string | null;
    tumaninah_met?: boolean | null;
    gerakan_menyimpang?: string[];
    hip_angle?: number | string | null;
    knee_angle?: number | string | null;
    arm_angle?: number | string | null;
    foto_pose_url?: string;
  }>;
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
