// Simple static server for the playground folder.
// Handles Unity gzip-compressed .unityweb assets by setting Content-Encoding.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 8080;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.data': 'application/octet-stream',
  '.wasm.gz': 'application/wasm',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.join(root, urlPath);

  // Prevent path traversal outside root.
  if (!filePath.startsWith(root)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + urlPath); return; }
    if (stat.isDirectory()) { filePath = path.join(filePath, 'index.html'); }

    const headers = {};
    const ext = path.extname(filePath).toLowerCase();

    // Unity gzip-compressed assets.
    if (ext === '.unityweb' || ext === '.gz') {
      headers['Content-Encoding'] = 'gzip';
      const inner = filePath.replace(/\.(unityweb|gz)$/, '');
      if (/\.wasm$/.test(inner)) headers['Content-Type'] = 'application/wasm';
      else if (/\.js$/.test(inner)) headers['Content-Type'] = 'application/javascript';
      else headers['Content-Type'] = 'application/octet-stream';
    } else {
      headers['Content-Type'] = mime[ext] || 'application/octet-stream';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
  console.log('Playgrounds:');
  for (const d of fs.readdirSync(root)) {
    if (fs.statSync(path.join(root, d)).isDirectory()) {
      console.log(`  http://localhost:${port}/${d}/`);
    }
  }
});
