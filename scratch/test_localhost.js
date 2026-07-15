const http = require('http');
const fs = require('fs');

const payload = fs.readFileSync('scratch/dummy_payload.json', 'utf8');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/iot/sesi/selesai',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'x-api-key': 'gema-super-rahasia-2025'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(Problem with request: );
});

req.write(payload);
req.end();
