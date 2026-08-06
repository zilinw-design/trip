# 部署指南

## 整体架构

```
手机浏览器
    │
    ├── 生产环境（GitHub Pages）
    │   └── Cloudflare Worker ──→ 高德 API（key 在 Worker 环境变量）
    │
    └── 本地开发（server.js）
        └── 直连高德 API（key 在 config.js，已 gitignore）
```

---

## 第一步：部署 Cloudflare Worker

### 1. 注册 Cloudflare
打开 https://dash.cloudflare.com/sign-up ，用邮箱注册（免费）。

### 2. 安装 Wrangler CLI
```powershell
npm install -g wrangler
```

### 3. 登录
```powershell
wrangler login
```
会弹出浏览器，点 "Allow" 授权。

### 4. 部署 Worker
```powershell
cd worker
npx wrangler deploy
```

部署成功后会显示类似：
```
https://changsha-amap-proxy.你的用户名.workers.dev
```

### 5. 配置环境变量
打开 Cloudflare 控制台 → Workers & Pages → 点击你的 Worker → Settings → Variables → Add：

| 变量名 | 值 |
|--------|-----|
| `AMAP_KEY` | 你的高德 API Key |

**点 "Deploy" 保存。**

### 6. 验证 Worker
浏览器打开：
```
https://changsha-amap-proxy.你的用户名.workers.dev/api/search?keyword=橘子洲
```
应该返回 JSON 搜索结果。

---

## 第二步：关联前端到 Worker

编辑 `js/amap.js` 第 14 行，把 Worker 地址改成你自己的：

```js
const AMAP_PROXY = 'https://changsha-amap-proxy.你的用户名.workers.dev';
```

提交并推送到 GitHub。

---

## 第三步：启用 GitHub Pages

GitHub 仓库 → Settings → Pages → Source: `main` 分支, `/ (root)` → Save。

等几分钟，访问 `https://你的用户名.github.io/仓库名/` 即可使用。

---

## 本地开发

```powershell
# 复制配置文件
copy js\config.example.js js\config.js

# 编辑 config.js 填入你的高德 Key

# 启动本地服务器
$env:AMAP_KEY="你的key"; node server.js

# 浏览器打开 http://localhost:3000
```

本地开发时 `window.AMAP_KEY` 存在，自动直连高德 API，不走 Worker。
