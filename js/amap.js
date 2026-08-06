// ┌─────────────────────────────────────────┐
// │ 高德地图 API 搜索                        │
// │                                          │
// │ 生产环境（GitHub Pages）：                │
// │   → Cloudflare Worker 代理               │
// │   → key 存在 Worker 端，永不泄露          │
// │                                          │
// │ 本地开发（server.js）：                  │
// │   → window.AMAP_KEY 直连高德             │
// └─────────────────────────────────────────┘

// Cloudflare Worker 代理地址（已部署）
const AMAP_PROXY = 'https://changsha-amap-proxy.zilinw015.workers.dev';

async function searchAMap(k) {
  let url;

  if (window.AMAP_KEY) {
    // 本地开发：直连高德 API
    url = `https://restapi.amap.com/v3/place/text?keywords=${encodeURIComponent(k)}&city=长沙&output=JSON&key=${window.AMAP_KEY}`;
  } else {
    // 生产环境：通过 Cloudflare Worker 代理
    url = `${AMAP_PROXY}/api/search?keyword=${encodeURIComponent(k)}`;
  }

  const r = await fetch(url);
  const d = await r.json();
  return d.pois || [];
}
