-- ============================================
-- Migrasi Database GEMA Imam — Fase 2 (Fix & Hardening)
-- ============================================
-- Jalankan SETELAH supabase-migration.sql (skema awal).
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste seluruh isi file ini
--   3. Klik "Run"
-- ============================================

-- -----------------------------------------------
-- 1. Kolom baru di movement_logs
-- -----------------------------------------------
ALTER TABLE movement_logs
  ADD COLUMN IF NOT EXISTS exit_reason VARCHAR(20),
  ADD COLUMN IF NOT EXISTS urutan INTEGER;

COMMENT ON COLUMN movement_logs.exit_reason IS
  'Alasan exit_time NULL: NORMAL_FINISH (sholat selesai wajar di gerakan ini) atau CANCELLED (sesi dibatalkan). NULL kalau exit_time terisi normal (transisi ke gerakan berikutnya).';
COMMENT ON COLUMN movement_logs.urutan IS
  'Urutan asli gerakan ini di log_transisi (0-based index array dari Orange Pi). Dipakai untuk urutan timeline karena entry_time bisa disanitasi ke 00:00:00 saat data dari AI tidak valid.';

-- -----------------------------------------------
-- 2. CHECK constraint untuk sholat_sessions.status
-- -----------------------------------------------
ALTER TABLE sholat_sessions DROP CONSTRAINT IF EXISTS sholat_sessions_status_check;
ALTER TABLE sholat_sessions
  ADD CONSTRAINT sholat_sessions_status_check
  CHECK (status IN ('PENDING', 'ACTIVE', 'Selesai', 'Dibatalkan'));

-- -----------------------------------------------
-- 3. Guard: maksimal SATU sesi non-terminal (PENDING/ACTIVE)
--    di seluruh sistem — secara fisik cuma ada satu kamera/alat.
--    Trik partial unique index pada ekspresi konstan: semua baris
--    yang match WHERE punya nilai index yang sama, jadi Postgres
--    cuma izinkan satu baris seperti itu ada di satu waktu.
-- -----------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_session_system_wide
  ON sholat_sessions ((1))
  WHERE status IN ('PENDING', 'ACTIVE');

-- -----------------------------------------------
-- 4. Index tambahan untuk query polling GET /api/iot/status
--    (filter berulang setiap ~2-3 detik oleh Orange Pi)
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sholat_sessions(status);

-- -----------------------------------------------
-- 5. RPC: tutup sesi + bulk-insert movement_logs
--    dalam SATU transaksi atomik.
--    Dipanggil dari POST /api/iot/sesi/selesai setelah data
--    disanitasi di sisi TypeScript (parseNumeric, isInvalidEntry/
--    isInvalidExit, dsb) — RPC ini hanya menulis data yang sudah bersih.
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION selesaikan_sesi_sholat(
  p_sesi_id UUID,
  p_status VARCHAR,
  p_durasi_detik NUMERIC,
  p_total_rakaat INTEGER,
  p_total_kesalahan_imam INTEGER,
  p_skor_tumaninah_persen NUMERIC,
  p_movements JSONB DEFAULT '[]'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_updated_id UUID;
BEGIN
  UPDATE sholat_sessions
  SET status = p_status,
      durasi_detik = p_durasi_detik,
      total_rakaat = p_total_rakaat,
      total_kesalahan_imam = p_total_kesalahan_imam,
      skor_tumaninah_persen = p_skor_tumaninah_persen
  WHERE id = p_sesi_id
  RETURNING id INTO v_updated_id;

  IF v_updated_id IS NULL THEN
    RAISE EXCEPTION 'Sesi % tidak ditemukan', p_sesi_id USING ERRCODE = 'P0002';
  END IF;

  IF p_movements IS NOT NULL AND jsonb_array_length(p_movements) > 0 THEN
    INSERT INTO movement_logs (
      sesi_id, rakaat, nama_gerakan, tumaninah_terpenuhi,
      entry_time, exit_time, exit_reason, duration_seconds,
      gerakan_menyimpang, hip_angle, knee_angle, arm_angle,
      foto_pose_url, urutan
    )
    SELECT
      p_sesi_id,
      (elem->>'rakaat')::INTEGER,
      elem->>'nama_gerakan',
      (elem->>'tumaninah_terpenuhi')::BOOLEAN,
      (elem->>'entry_time')::TIME,
      NULLIF(elem->>'exit_time', '')::TIME,
      elem->>'exit_reason',
      (elem->>'duration_seconds')::NUMERIC,
      CASE WHEN elem->'gerakan_menyimpang' IS NULL THEN ARRAY[]::TEXT[]
           ELSE ARRAY(SELECT jsonb_array_elements_text(elem->'gerakan_menyimpang')) END,
      (elem->>'hip_angle')::NUMERIC,
      (elem->>'knee_angle')::NUMERIC,
      (elem->>'arm_angle')::NUMERIC,
      elem->>'foto_pose_url',
      (ordinality - 1)::INTEGER
    FROM jsonb_array_elements(p_movements) WITH ORDINALITY AS t(elem, ordinality);
  END IF;

  RETURN v_updated_id;
END;
$$;
