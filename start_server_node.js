/**
 * 六级背单词 - Node.js HTTP服务器
 * 备用方案：当没有Python时使用Node.js启动
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIRECTORY = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.css':  'text/css; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.pdf':  'application/pdf',
};

// 获取局域网IP
function getLocalIP() {
  const os = require('os');
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const server = http.createServer((req, res) => {
  // 解码URL（处理中文文件名）
  let filePath = decodeURIComponent(req.url);
  if (filePath === '/') filePath = '/背单词.html';
  
  filePath = path.join(DIRECTORY, filePath);
  
  // 安全检查：防止路径穿越
  if (!filePath.startsWith(DIRECTORY)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found: ' + path.basename(filePath));
      return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const localIP = getLocalIP();
  const url = `http://${localIP}:${PORT}/背单词.html`;
  const localUrl = `http://localhost:${PORT}/背单词.html`;
  
  console.log('============================================================');
  console.log('  🎓 六级背单词 - HTTP服务器 (Node.js)');
  console.log('============================================================');
  console.log();
  console.log(`  📍 本机访问: ${localUrl}`);
  console.log(`  📱 手机访问: ${url}`);
  console.log();
  console.log('  💡 手机浏览器打开后，选择「添加到主屏幕」即可安装为App');
  console.log('  ⌨️  按 Ctrl+C 停止服务器');
  console.log();
  
  // 自动打开浏览器
  const { exec } = require('child_process');
  const platform = require('os').platform();
  if (platform === 'win32') {
    exec(`start "" "${localUrl}"`);
  } else if (platform === 'darwin') {
    exec(`open "${localUrl}"`);
  } else {
    exec(`xdg-open "${localUrl}"`);
  }
});
