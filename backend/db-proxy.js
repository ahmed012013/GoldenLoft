const net = require('net');
const tls = require('tls');

const LOCAL_PORT = 5433;
const REMOTE_HOST =
  'ep-silent-mud-agfbf3y4-pooler.c-2.eu-central-1.aws.neon.tech';
const REMOTE_PORT = 443;

const server = net.createServer((clientSocket) => {
  // Pause data immediately to prevent loss before upstream is ready
  clientSocket.pause();
  console.log('🔌 Client connected');

  const remoteSocket = tls.connect(
    REMOTE_PORT,
    REMOTE_HOST,
    {
      rejectUnauthorized: false, // For robustness
      servername: REMOTE_HOST, // SNI required
    },
    () => {
      console.log('✅ Upstream connected (TLS)');
      // Pipe flows
      clientSocket.pipe(remoteSocket);
      remoteSocket.pipe(clientSocket);
      // Resume client flow now that upstream is ready
      clientSocket.resume();
    }
  );

  remoteSocket.on('error', (err) => {
    console.error('❌ Remote error:', err.message);
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('❌ Client error:', err.message);
    remoteSocket.end();
  });

  remoteSocket.on('close', () => {
    console.log('🔒 Remote closed');
    clientSocket.end();
  });

  clientSocket.on('close', () => {
    console.log('🔒 Client closed');
    remoteSocket.end();
  });
});

// Listen on all interfaces (IPv4 and IPv6)
server.listen(LOCAL_PORT, '0.0.0.0', () => {
  console.log(`
🚀 Database Proxy Running! (Robust Mode)
----------------------------------------
Local Port:   ${LOCAL_PORT}
Target Host:  ${REMOTE_HOST}
Target Port:  ${REMOTE_PORT} (TLS)
----------------------------------------
Keep this window open while the app is running.
`);
});
