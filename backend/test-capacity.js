const API_URL = 'http://localhost:3002';

async function testCapacity() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
      }),
    });

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status, await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('Logged in. Token acquired.');

    // 2. Create Loft
    console.log('Creating loft...');
    const createRes = await fetch(`${API_URL}/lofts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Test Loft Capacity',
        capacity: 100,
      }),
    });

    if (!createRes.ok) {
      console.error('Create failed:', createRes.status, await createRes.text());
      return;
    }

    const loft = await createRes.json();
    console.log('Loft created:', JSON.stringify(loft, null, 2));

    if (loft.capacity !== 100) {
      console.error(
        '❌ FAIL: Created loft capacity is ' + loft.capacity + ', expected 100'
      );
    } else {
      console.log('✅ PASS: Created loft capacity is 100');
    }

    // 3. Update Loft
    console.log('Updating loft capacity to 200...');
    const updateRes = await fetch(`${API_URL}/lofts/${loft.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ capacity: 200 }),
    });

    if (!updateRes.ok) {
      console.error('Update failed:', updateRes.status, await updateRes.text());
      return;
    }

    const updatedLoft = await updateRes.json();
    console.log('Loft updated:', JSON.stringify(updatedLoft, null, 2));

    if (updatedLoft.capacity !== 200) {
      console.error(
        '❌ FAIL: Updated loft capacity is ' +
          updatedLoft.capacity +
          ', expected 200'
      );
    } else {
      console.log('✅ PASS: Updated loft capacity is 200');
    }

    // 4. Clean up
    console.log('Deleting loft...');
    await fetch(`${API_URL}/lofts/${loft.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Loft deleted.');
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

testCapacity();
