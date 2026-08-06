/**
 * Cloudflare Worker —— 高德 API 代理
 *
 * 部署步骤：
 *   1. npx wrangler deploy
 *   2. 在 Cloudflare Dashboard → Workers → 你的 Worker → Settings → Variables
 *      添加环境变量：AMAP_KEY = 你的高德 Key
 *
 * 本地测试：
 *   npx wrangler dev
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---- CORS 预检 ----
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: cors(),
      });
    }

    // ---- /api/search?keyword=xxx ----
    if (url.pathname === '/api/search') {
      const keyword = url.searchParams.get('keyword');
      if (!keyword) {
        return json({ status: '0', info: '缺少 keyword 参数', pois: [] }, 400);
      }

      const amapURL = `https://restapi.amap.com/v3/place/text?keywords=${encodeURIComponent(keyword)}&city=长沙&output=JSON&key=${env.AMAP_KEY}`;

      const res = await fetch(amapURL);
      const data = await res.json();

      return json(data, 200);
    }

    // ---- 其他路径 ----
    return new Response('Not Found', { status: 404 });
  },
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...cors(),
    },
  });
}
