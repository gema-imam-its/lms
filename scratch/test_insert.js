const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const payload = JSON.parse(fs.readFileSync('scratch/payload.json'));
payload.sesi_id = '2f9f4a5b-2aec-4e28-9156-b2c21a6e4c83';

const body = payload;
const movementsToInsert = body.log_transisi.map((log) => ({
    sesi_id: body.sesi_id,
    rakaat: log.rakaat || 1,
    nama_gerakan: log.state || "Unknown",
    tumaninah_terpenuhi: log.tumaninah_met,
    entry_time: log.entry_time || "00:00:00",
    exit_time: log.exit_time,
    duration_seconds: log.duration_seconds,
    gerakan_menyimpang: log.gerakan_menyimpang || [],
    hip_angle: log.hip_angle,
    knee_angle: log.knee_angle,
    arm_angle: log.arm_angle
}));

async function run() {
    const { data, error } = await supabase.from("movement_logs").insert(movementsToInsert);
    console.log("Error:", error);
}
run();
