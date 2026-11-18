#!/usr/bin/env node
// node brand/render.cjs  ->  out/brand/banner.png (2560x1440), out/brand/avatar.png (800x800)
const fs = require("fs"), path = require("path"), http = require("http"), { chromium } = require("playwright");
const ROOT = path.join(__dirname, ".."), OUT = path.join(ROOT, "out", "brand"); fs.mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2" };
const PAGE = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}svg{display:block}@font-face{font-family:Anton;src:url(/node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2) format("woff2")}</style><div id="s"></div>
<script type="module">const b = await import("/brand/brand.js"); await document.fonts.load("40px Anton"); window.art = (n) => { document.getElementById("s").innerHTML = b[n](); }; window.__ready = true;</script>`;
const server = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split("?")[0]); if (u === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
server.listen(0, "127.0.0.1", async () => {
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 2560, height: 1440 } });
  page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/`); await page.waitForFunction("window.__ready === true", null, { timeout: 60000 });
  for (const [n, w, h] of [["banner", 2560, 1440], ["avatar", 800, 800]]) { await page.setViewportSize({ width: w, height: h }); await page.evaluate((k) => window.art(k), n);
    await page.screenshot({ path: path.join(OUT, n + ".png"), clip: { x: 0, y: 0, width: w, height: h } }); console.log("wrote", n, w + "x" + h); }
  await browser.close(); server.close();
});
