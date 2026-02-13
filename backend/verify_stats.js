const axios = require('axios');
const API_URL = 'http://localhost:4000';

async function verifyStats() {
  try {
    const email = `stats.test.${Date.now()}@example.com`;
    const password = 'password123';

    // Register & Login
    await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      loftName: 'Stats Loft',
    });
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = loginRes.data.access_token;

    // Fetch Stats
    console.log('Fetching Stats...');
    const statsRes = await axios.get(`${API_URL}/birds/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Stats Response:', statsRes.data);

    if (statsRes.status === 200 && statsRes.data.total !== undefined) {
      console.log('VERIFICATION PASSED');
    } else {
      console.log('VERIFICATION FAILED');
    }
  } catch (e) {
    console.error('Error:', e.message);
    if (e.response) console.error(e.response.data);
  }
}
verifyStats();
