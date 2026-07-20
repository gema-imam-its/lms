// ============================================
// Skor sesi sholat — dihitung di sisi Web LMS dari log_transisi mentah,
// BUKAN dipercaya begitu saja dari angka yang dikirim Orange Pi.
// ============================================
//
// Tiga komponen, digabung dengan rata-rata berbobot:
//   - Tuma'ninah (60%): % gerakan yang wajib tuma'ninah (rukuk, itidal, sujud,
//     duduk di antara dua sujud) yang ditahan >= threshold-nya.
//   - Postur (25%): seberapa dekat hip_angle ke bentuk yang baik, HANYA untuk
//     gerakan yang punya gerbang sudut jelas di cv/config.py (berdiri/itidal,
//     rukuk, sujud) — gerakan duduk/salam tidak punya gerbang sudut sama
//     sekali di classifier, jadi tidak dinilai di sini (bukan 0, cuma diabaikan).
//   - Kesalahan bacaan (15%): dikurangi proporsional terhadap jumlah gerakan
//     dalam sesi, bukan pengurangan tetap per kesalahan — supaya sesi panjang
//     (rakaat lebih banyak) tidak dihukum lebih berat hanya karena punya lebih
//     banyak kesempatan salah.
//
// Kalau salah satu komponen tidak punya data sama sekali di sesi ini (mis.
// sesi dibatalkan sebelum sempat rukuk), bobotnya didistribusikan ulang ke
// komponen yang ada — bukan dianggap 0.

interface ScorableMovement {
  nama_gerakan: string;
  tumaninah_terpenuhi: boolean | null;
  hip_angle: number | null;
}

const WEIGHT_TUMANINAH = 0.6;
const WEIGHT_POSTUR = 0.25;
const WEIGHT_KESALAHAN = 0.15;

// Sama seperti gerbang sudut di cv/config.py THRESHOLDS
const HIP_STRAIGHT_MIN = 150; // berdiri/itidal: hip_angle >= ini dianggap tegak
const HIP_RUKU_MIN = 55;
const HIP_RUKU_MAX = 130;
const HIP_SUJUD_MAX = 90;

const STANDING_POSES = new Set(["BERDIRI_TEGAK", "BERSEDEKAP", "ITIDAL", "TAKBIRATUL_IHRAM", "IQOMAH"]);
const SUJUD_POSES = new Set(["SUJUD_PERTAMA", "SUJUD_KEDUA"]);

/** Skor postur 0-100 untuk satu gerakan, atau null kalau gerakan ini tidak
 * punya gerbang sudut yang jelas (duduk/salam/dll) atau hip_angle-nya kosong. */
function postureScoreFor(m: ScorableMovement): number | null {
  if (m.hip_angle == null) return null;

  if (STANDING_POSES.has(m.nama_gerakan)) {
    // Makin lurus (mendekati 180°) makin baik; di bawah gerbang minimal = 0
    const clamped = Math.min(Math.max(m.hip_angle, HIP_STRAIGHT_MIN), 180);
    return ((clamped - HIP_STRAIGHT_MIN) / (180 - HIP_STRAIGHT_MIN)) * 100;
  }

  if (m.nama_gerakan === "RUKUK") {
    // Makin dekat ke tengah rentang valid (~92.5°, badan membungkuk rata-rata
    // sejajar pinggang) makin baik dibanding mepet ke tepi gerbang
    const mid = (HIP_RUKU_MIN + HIP_RUKU_MAX) / 2;
    const halfRange = (HIP_RUKU_MAX - HIP_RUKU_MIN) / 2;
    const distance = Math.min(Math.abs(m.hip_angle - mid), halfRange);
    return ((halfRange - distance) / halfRange) * 100;
  }

  if (SUJUD_POSES.has(m.nama_gerakan)) {
    // Tidak ada batas bawah yang didefinisikan classifier untuk sujud — lulus/
    // tidak lulus saja terhadap gerbang yang sama dipakai untuk klasifikasi
    return m.hip_angle <= HIP_SUJUD_MAX ? 100 : 0;
  }

  return null;
}

function computeTumaninahScore(movements: ScorableMovement[]): number | null {
  const eligible = movements.filter((m) => m.tumaninah_terpenuhi !== null);
  if (eligible.length === 0) return null;
  const met = eligible.filter((m) => m.tumaninah_terpenuhi === true).length;
  return (met / eligible.length) * 100;
}

function computePostureScore(movements: ScorableMovement[]): number | null {
  const scores = movements
    .map(postureScoreFor)
    .filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function computeKesalahanScore(movementCount: number, kesalahanImam: number): number | null {
  if (movementCount === 0) return null;
  return Math.max(0, 100 - (kesalahanImam / movementCount) * 100);
}

/** Skor keseluruhan 0-100 (1 desimal, sesuai kolom NUMERIC(4,1)) dari data
 * mentah satu sesi. Ini yang disimpan sebagai skor_tumaninah_persen. */
export function computeSholatScore(
  movements: ScorableMovement[],
  kesalahanImam: number
): number {
  const tumaninah = computeTumaninahScore(movements);
  const postur = computePostureScore(movements);
  const kesalahan = computeKesalahanScore(movements.length, kesalahanImam);

  const weighted: Array<[score: number, weight: number]> = [];
  if (tumaninah !== null) weighted.push([tumaninah, WEIGHT_TUMANINAH]);
  if (postur !== null) weighted.push([postur, WEIGHT_POSTUR]);
  if (kesalahan !== null) weighted.push([kesalahan, WEIGHT_KESALAHAN]);

  if (weighted.length === 0) return 0;

  const totalWeight = weighted.reduce((sum, [, w]) => sum + w, 0);
  const weightedSum = weighted.reduce((sum, [s, w]) => sum + s * w, 0);
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}
