const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const body = {
  "sesi_id": "7cfb163e-76a7-4e08-a4ab-64ab3446d379",
  "log_transisi": [
    {
      "rakaat": 1,
      "state": "BERDIRI_TEGAK",
      "entry_time": "03:00:30",
      "exit_time": "03:00:34",
      "duration_seconds": 3.69,
      "tumaninah_met": null,
      "bacaan_terpotong": null,
      "gerakan_menyimpang": [],
      "hip_angle": 168.5,
      "knee_angle": 176.5,
      "arm_angle": 90.8,
      "wrist_dist_x": 0.472,
      "head_offset_x": -0.027
    },
    {
      "rakaat": 1,
      "state": "ITIDAL",
      "entry_time": "03:00:56",
      "exit_time": null,
      "duration_seconds": null,
      "tumaninah_met": null,
      "bacaan_terpotong": null,
      "gerakan_menyimpang": [],
      "hip_angle": null,
      "knee_angle": null,
      "arm_angle": null,
      "wrist_dist_x": null,
      "head_offset_x": null
    }
  ]
};

const movementsToInsert = body.log_transisi.map((log) => {
  const isInvalidExit = log.exit_time === "Batal" || log.exit_time === "Selesai" || !log.exit_time;
  const isInvalidEntry = log.entry_time === "-" || !log.entry_time;
  const parseNumeric = (val) => (val === "-" || isNaN(parseFloat(val))) ? null : parseFloat(val);
  
  return {
    sesi_id: body.sesi_id,
    rakaat: log.rakaat || 1,
    nama_gerakan: log.state || "Unknown",
    tumaninah_terpenuhi: log.tumaninah_met,
    entry_time: isInvalidEntry ? "00:00:00" : log.entry_time,
    exit_time: isInvalidExit ? null : log.exit_time,
    duration_seconds: parseNumeric(log.duration_seconds),
    gerakan_menyimpang: log.gerakan_menyimpang || [],
    hip_angle: parseNumeric(log.hip_angle),
    knee_angle: parseNumeric(log.knee_angle),
    arm_angle: parseNumeric(log.arm_angle)
  }
});

async function run() {
    const { data, error } = await supabase.from("movement_logs").insert(movementsToInsert);
    console.log("Error:", error);
}
run();
