const axios = require('axios');
const API_URL = 'http://localhost:4000';

async function checkBirds() {
  try {
    // Login again to get a fresh token for the test user
    console.log('Logging in...');
    // Note: I don't know the exact user the USER is using in the browser.
    // But I can check my test user from reproduce_issue.js or register a new one.
    // Better to register a transient one to check generic API behavior.
    const email = `debug.${Date.now()}@example.com`;
    const password = 'password123';

    await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      loftName: 'Debug Loft',
    });
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // Create Token
    const token = loginRes.data.access_token;

    // Ensure Loft
    const loftRes = await axios.get(`${API_URL}/lofts/my-loft`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let loftId;
    if (loftRes.data.length > 0) {
      loftId = loftRes.data[0].id;
    } else {
      console.log('Creating Loft...');
      const newLoft = await axios.post(
        `${API_URL}/lofts`,
        { name: 'Debug Loft' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loftId = newLoft.data.id;
    }

    console.log('Creating bird...');
    const birdRes = await axios.post(
      `${API_URL}/birds`,
      {
        ringNumber: 'DBG-' + Date.now(),
        name: 'Debug Bird',
        loftId: loftId,
        image: '/uploads/birds/debug-image.png',
        color: 'Red',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Fetch birds
    console.log('Fetching birds...');
    const listRes = await axios.get(`${API_URL}/birds`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Birds List Response:', JSON.stringify(listRes.data, null, 2));
  } catch (e) {
    console.error(e.message);
    if (e.response) console.error(e.response.data);
  }
}
checkBirds();
