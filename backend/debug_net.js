const net = require('net');
const dns = require('dns');

const host = 'ep-silent-mud-agfbf3y4-pooler.c-2.eu-central-1.aws.neon.tech';
const port = 5432;

console.log(`Resolving ${host} (IPv6)...`);

dns.resolve6(host, (err, addresses) => {
  if (err) {
    console.error('DNS IPv6 Resolution failed:', err.message);
  } else {
    console.log('DNS IPv6 Addresses:', addresses);
    addresses.forEach(testConnection);
  }
});

console.log(`Resolving ${host} (IPv4)...`);

dns.resolve4(host, (err, addresses) => {
  if (err) {
    console.error('DNS IPv4 Resolution failed:', err.message);
  } else {
    console.log('DNS IPv4 Addresses:', addresses);
    addresses.forEach(testConnection);
  }
});

function testConnection(addr) {
  console.log(`Attempting connection to ${addr}...`);
  const socket = net.createConnection(port, addr);

  socket.on('connect', () => {
    console.log(`✅ Connected successfully to ${addr}`);
    socket.end();
  });

  socket.on('error', (e) => {
    console.error(`❌ Connection failed to ${addr}:`, e.message);
  });

  socket.setTimeout(8000);
  socket.on('timeout', () => {
    console.log(`⏰ Timeout connecting to ${addr}`);
    socket.destroy();
  });
}
