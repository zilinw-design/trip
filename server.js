const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

// 简单 MIME 映射
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  // /js/config.js —— 动态注入环境变量中的 API Key
  if (req.url === '/js/config.js') {
    const key = process.env.AMAP_KEY || '';
    if (!key) {
      console.warn('⚠️  环境变量 AMAP_KEY 未设置！请先运行: set AMAP_KEY=你的key');
    }
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(`// 此文件由 server.js 从环境变量 AMAP_KEY 动态生成，不会写入磁盘
window.AMAP_KEY = ${JSON.stringify(key)};
`);
    return;
  }

  // 其他静态文件
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  // 基础防目录穿越
  if (!filePath.startsWith(ROOT)) { res.statusCode = 403; return res.end('Forbidden'); }

  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('Not Found'); }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const key = process.env.AMAP_KEY;
  if (key) {
    console.log(`✅ 已读取环境变量 AMAP_KEY (${key.length} 字符)`);
  } else {
    console.warn('⚠️  环境变量 AMAP_KEY 未设置！');
    console.warn('   PowerShell: $env:AMAP_KEY="你的key"; node server.js');
    console.warn('   CMD:       set AMAP_KEY=你的key && node server.js');
  }
  console.log(`🌐 服务器已启动: http://localhost:${PORT}`);
});
