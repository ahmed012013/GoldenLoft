const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000';

async function reproduce() {
  try {
    // 1. Register/Login
    const email = `test.upload.${Date.now()}@example.com`;
    const password = 'password123';

    console.log('Registering user...');
    await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      loftName: 'Test Loft',
    });

    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = loginRes.data.access_token;
    console.log('Got token.');

    console.log('Fetching user loft...');
    const loftRes = await axios.get(`${API_URL}/lofts/my-loft`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let lofts = loftRes.data;
    if (!lofts || lofts.length === 0) {
      console.log('No loft found. Creating one...');
      const createLoftRes = await axios.post(
        `${API_URL}/lofts`,
        { name: 'Test Loft ' + Date.now() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      lofts = [createLoftRes.data];
    }
    const loftId = lofts[0].id;
    console.log('Got Loft ID:', loftId);

    // 2. Create Dummy Image
    const imagePath = path.join(__dirname, 'test.png');
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    fs.writeFileSync(imagePath, pngBuffer);

    // 3. Upload
    const form = new FormData();
    form.append('ringNumber', 'EG-2026-' + Date.now()); // Unique ring number
    form.append('name', 'Golden Bird');
    form.append('loftId', loftId);
    form.append('gender', 'male');
    form.append('color', 'Blue');
    form.append('image', fs.createReadStream(imagePath));

    console.log('Uploading image...');
    try {
      const res = await axios.post(`${API_URL}/birds`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Upload Success:', res.data);

      console.log('Verifying List...');
      const listRes = await axios.get(`${API_URL}/birds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myBird = listRes.data.find((b) =>
        b.ringNumber === form.getHeaders ? 'EG-2026-...' : '...'
      ); // finding logic might be tricky with dynamic ring number
      // Just log the whole list image fields
      console.log(
        'List Images:',
        listRes.data.map((b) => ({ ring: b.ringNumber, image: b.image }))
      );
    } catch (err) {
      console.error(
        'Upload Failed:',
        err.response ? err.response.data : err.message
      );
    }

    // Cleanup
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Script Error:', error.message);
    if (error.response) console.error(error.response.data);
  }
}

reproduce();
