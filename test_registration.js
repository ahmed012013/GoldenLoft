const fetch = require('node-fetch');

async function testRegistration() {
    console.log('--- Testing Weak Password ---');
    try {
        const response = await fetch('http://localhost:3002/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_weak_' + Date.now() + '@example.com',
                password: '123', // Weak password
                name: 'Test Weak',
                role: 'USER'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }

    console.log('\n--- Testing XSS Sanitization ---');
    try {
        const response = await fetch('http://localhost:3002/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test_xss_' + Date.now() + '@example.com',
                password: 'Password123!', // Strong password
                name: '<script>alert("xss")</script>Test XSS',
                role: 'USER'
            })
        });
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testRegistration();
