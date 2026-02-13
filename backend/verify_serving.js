const axios = require('axios');

async function checkImage() {
  const filename = '7e5b158f-8c3b-41a3-b2a6-6fd36ab7c43f.png'; // File seen in list_dir
  const url = `http://localhost:4000/uploads/birds/${filename}`;
  console.log(`Checking URL: ${url}`);
  try {
    const res = await axios.head(url);
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers['content-type']);
    console.log('Content-Length:', res.headers['content-length']);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
    }
  }
}

checkImage();
