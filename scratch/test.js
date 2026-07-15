
const payload = {
  sesi_id: 'bd78feb5-f7d9-4a89-9cb8-c40abfc7c2bf',
  status: 'Dibatalkan',
  durasi_detik: 15,
  total_rakaat_dilewati: 1,
  log_transisi: [
    {
      rakaat: 1,
      state: 'BERDIRI_TEGAK',
      entry_time: '-',
      exit_time: 'Batal',
      duration_seconds: 1.39,
      tumaninah_met: null,
      gerakan_menyimpang: [],
      hip_angle: 166.5,
      knee_angle: 175.0,
      arm_angle: 45.8
    }
  ]
};

fetch('http://localhost:3000/api/iot/sesi/selesai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'gema-super-rahasia-2025'
  },
  body: JSON.stringify(payload)
})
.then(async r => console.log('Status:', r.status, 'Body:', await r.text()))
.catch(console.error);

