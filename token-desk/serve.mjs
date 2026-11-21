import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const mime = new Map(Object.entries({
  html: 'text/html; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}));

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const name = pathname === '/' ? 'index.html' : pathname.slice(1);
    const type = mime.get(name.split('.').at(-1));
    if (!/^[a-zA-Z0-9_-]+\.[a-z]+$/.test(name) || !type) {
      response.writeHead(404).end();
      return;
    }
    const file = await readFile(new URL(name, import.meta.url));
    response.writeHead(200, { 'Content-Type': type }).end(file);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, '127.0.0.1', () => console.log('http://localhost:4173/'));
