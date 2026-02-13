const http = require('http');

const url = 'http://localhost:3001/'; // Or a simple public endpoint
const totalRequests = 50;
let completed = 0;
let success = 0;
let failed = 0;
let throttled = 0;

console.log(`Starting ${totalRequests} requests to ${url}...`);

for (let i = 0; i < totalRequests; i++) {
  const req = http.get(url, (res) => {
    if (res.statusCode === 200 || res.statusCode === 404) {
      // 404 is fine, means server reached
      success++;
    } else if (res.statusCode === 429) {
      throttled++;
    } else {
      failed++;
      console.log(`Request ${i} failed with status: ${res.statusCode}`);
    }
    completed++;
    checkDone();
  });

  req.on('error', (e) => {
    failed++;
    console.error(`Request ${i} error: ${e.message}`);
    completed++;
    checkDone();
  });
}

function checkDone() {
  if (completed === totalRequests) {
    console.log('--- Results ---');
    console.log(`Total: ${completed}`);
    console.log(`Success (200/404): ${success}`);
    console.log(`Throttled (429): ${throttled}`);
    console.log(`Failed (Other): ${failed}`);

    if (throttled === 0 && success === totalRequests) {
      console.log('VERIFICATION PASSED: No throttling observed.');
    } else {
      console.log('VERIFICATION FAILED: Throttling or errors observed.');
    }
  }
}
