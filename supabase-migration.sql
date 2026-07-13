-- ============================================
-- Migrasi Database GEMA Imam — Supabase (PostgreSQL)
-- ============================================
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste seluruh isi file ini
--   3. Klik "Run"
-- ============================================

-- -----------------------------------------------
-- Tabel 1: imams (Profil Siswa / Imam)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS imams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE imams IS 'Profil siswa tunarungu (imam) yang terdaftar di SLB.';

-- -----------------------------------------------
-- Tabel 2: sholat_sessions (Metadata Sesi Sholat)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS sholat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imam_id UUID REFERENCES imams(id) ON DELETE CASCADE,
    nama_sholat VARCHAR(20) NOT NULL,
    tanggal TIMESTAMP WITH TIME ZONE NOT NULL,
    durasi_detik NUMERIC(5, 1) DEFAULT 0.0,
    status VARCHAR(20) NOT NULL,
    total_rakaat INTEGER DEFAULT 0,
    total_kesalahan_imam INTEGER DEFAULT 0,
    skor_tumaninah_persen NUMERIC(4, 1) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE sholat_sessions IS 'Menyimpan informasi utama satu sesi sholat dari awal hingga akhir.';
COMMENT ON COLUMN sholat_sessions.nama_sholat IS 'Subuh, Dhuhur, Ashar, Maghrib, atau Isya.';
COMMENT ON COLUMN sholat_sessions.status IS 'Selesai atau Dibatalkan.';
COMMENT ON COLUMN sholat_sessions.skor_tumaninah_persen IS 'Persentase gerakan yang memenuhi threshold tuma''ninah (>= 3 detik).';

-- -----------------------------------------------
-- Tabel 3: movement_logs (Detail Gerakan Per Sesi)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS movement_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesi_id UUID REFERENCES sholat_sessions(id) ON DELETE CASCADE,
    rakaat INTEGER NOT NULL,
    nama_gerakan VARCHAR(50) NOT NULL,
    entry_time TIME NOT NULL,
    exit_time TIME,
    duration_seconds NUMERIC(5, 2),
    tumaninah_terpenuhi BOOLEAN,
    gerakan_menyimpang TEXT[],
    hip_angle NUMERIC(4, 1),
    knee_angle NUMERIC(4, 1),
    arm_angle NUMERIC(4, 1),
    foto_pose_url VARCHAR(255)
);

COMMENT ON TABLE movement_logs IS 'Riwayat gerakan demi gerakan di setiap rakaat sholat.';
COMMENT ON COLUMN movement_logs.nama_gerakan IS 'berdiri, sedekap, rukuk, itidal, sujud, duduk, tahiyat, salam, dll.';
COMMENT ON COLUMN movement_logs.tumaninah_terpenuhi IS 'TRUE jika durasi >= threshold, FALSE jika terburu-buru, NULL untuk gerakan non-tumaninah.';
COMMENT ON COLUMN movement_logs.gerakan_menyimpang IS 'Array string mencatat gerakan aneh/jitter yang terdeteksi saat pose ini.';
COMMENT ON COLUMN movement_logs.foto_pose_url IS 'URL Cloudinary berisi visualisasi deteksi sendi (skeleton overlay).';

-- -----------------------------------------------
-- Index untuk performa query dashboard
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sessions_imam_id ON sholat_sessions(imam_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tanggal ON sholat_sessions(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_movement_sesi_id ON movement_logs(sesi_id);

-- -----------------------------------------------
-- Data Dummy (1 imam untuk testing)
-- -----------------------------------------------
INSERT INTO imams (nama, kelas)
VALUES ('Ahmad (Siswa Test)', 'VIII-A')
ON CONFLICT DO NOTHING;
