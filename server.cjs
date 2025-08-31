const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const ROOT = path.resolve(__dirname, 'site');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const sanitized = decoded.replace(/\\.\\./g, '');
  const targetPath = path.join(root, sanitized);
  if (!targetPath.startsWith(root)) return root; // fallback
  return targetPath;
}

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body); else res.end();
}

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = req.url || '/';

    // redirect root to /BSix.com/
    if (urlPath === '/' || urlPath === '/index.html') {
      res.writeHead(302, { Location: '/BSix.com/' });
      return res.end();
    }

    let filePath = safeJoin(ROOT, urlPath);

    // If directory, serve index.html if exists
    try {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        if (fs.existsSync(indexPath)) filePath = indexPath;
      }
    } catch (_) {
      // not exist, try adding .html for pretty URLs
      if (!path.extname(filePath)) {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) filePath = htmlPath;
      }
    }

    if (!fs.existsSync(filePath)) {
      return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, '404 Not Found');
    }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    // Stream file
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext.match(/\.(js|css|svg|png|jpg|jpeg|gif|map)$/) ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('Server error:', err);
    send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, '500 Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running at http://0.0.0.0:${PORT} serving: ${ROOT}`);
});
