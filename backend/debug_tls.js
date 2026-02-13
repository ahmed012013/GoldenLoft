const tls = require('tls');

const host = 'ep-silent-mud-agfbf3y4-pooler.c-2.eu-central-1.aws.neon.tech';
const port = 443;

console.log(`Attempting TLS connection to ${host}:${port}...`);

const socket = tls.connect(
  port,
  host,
  {
    rejectUnauthorized: false, // To test connection first, ignore cert validation errors
  },
  () => {
    console.log(
      '✅ TLS Connection established!',
      socket.authorized ? 'Authorized' : 'Unauthorized'
    );
    if (!socket.authorized) {
      console.log('Authorization Error:', socket.authorizationError);
    }
    socket.end();
  }
);

socket.on('error', (err) => {
  console.error('❌ TLS Connection failed:', err);
});

socket.setTimeout(5000);
socket.on('timeout', () => {
  console.log('⏰ TLS Timeout');
  socket.destroy();
});
