const { createServer } = require('http');
const next = require('next');

const configuredPort = process.env.Port ?? process.env.PORT ?? '3000';
const port = Number.parseInt(configuredPort, 10);
const hostname = '0.0.0.0';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${configuredPort}`);
}

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((error) => {
  console.error('Failed to start Next.js server:', error);
  process.exit(1);
});
