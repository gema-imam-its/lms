
const fs = require('fs');
const payload = JSON.parse(fs.readFileSync('scratch/payload.json'));
payload.sesi_id = '2f9f4a5b-2aec-4e28-9156-b2c21a6e4c83';

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

