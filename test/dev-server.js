#!/usr/bin/env node

/**
 * Development server with auto-reload
 * Watches for file changes and automatically rebuilds and refreshes the browser
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const WATCH_DIRS = ['src', 'test', 'index.js'];

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Track connected clients for live reload
const clients = [];

// Inject live reload script into HTML
const liveReloadScript = `
<script>
  // Live reload client
  const evtSource = new EventSource('/live-reload');
  evtSource.onmessage = (event) => {
    if (event.data === 'reload') {
      console.log('🔄 Files changed, reloading...');
      location.reload();
    }
  };
  evtSource.onerror = () => {
    console.log('❌ Live reload disconnected');
  };
  console.log('✨ Live reload enabled');
</script>
`;

function createServer() {
  return http.createServer((req, res) => {
  // Server-Sent Events endpoint for live reload
  if (req.url === '/live-reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    clients.push(res);
    
    // Send initial connection message
    res.write('data: connected\n\n');
    
    req.on('close', () => {
      const index = clients.indexOf(res);
      if (index !== -1) clients.splice(index, 1);
    });
    return;
  }

  console.log(`${req.method} ${req.url}`);

  let filePath = path.join(ROOT_DIR, req.url === '/' ? '/test/index.html' : req.url);
  
  // Check if path is a directory and serve index.html from it
  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 - File Not Found</h1>', 'utf-8');
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`, 'utf-8');
        }
      } else {
        // Inject live reload script into HTML files
        if (extname === '.html') {
          content = content.toString().replace('</body>', `${liveReloadScript}</body>`);
        }
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content, 'utf-8');
      }
    });
  });
  });
}

// Build project
function build() {
  console.log('🔨 Building...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
    if (stderr) {
      console.error('Build stderr:', stderr);
    }
    console.log('✅ Build complete');
    notifyClients();
  });
}

// Notify all connected clients to reload
function notifyClients() {
  console.log(`📡 Notifying ${clients.length} client(s) to reload`);
  clients.forEach(client => {
    client.write('data: reload\n\n');
  });
}

// Watch for file changes
function watchFiles() {
  const watchers = [];
  
  WATCH_DIRS.forEach(dir => {
    const fullPath = path.join(ROOT_DIR, dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${dir} (not found)`);
      return;
    }
    
    const watcher = fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith('.js') || filename.endsWith('.html') || filename.endsWith('.css'))) {
        console.log(`📝 File changed: ${dir}/${filename}`);
        build();
      }
    });
    
    watchers.push(watcher);
    console.log(`👀 Watching: ${dir}/`);
  });
  
  return watchers;
}

// Try to find an available port
function startServer(port) {
  const server = createServer();

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  server.listen(port, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Dev server with live reload running!`);
    console.log(`   URL: http://localhost:${port}/test/`);
    console.log(`${'='.repeat(60)}\n`);

    // Initial build
    build();

    // Start watching
    watchFiles();
  });
}

const startPort = parseInt(process.env.PORT) || 3000;
startServer(startPort);
