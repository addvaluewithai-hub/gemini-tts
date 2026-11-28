#!/usr/bin/env node
// Stills for checking the look: node v2b/shot.cjs <page-relative-url> <out.jpg> [scale]
//   node v2b/shot.cjs "v2b/sheet.html?w=chars" /tmp/chars.jpg
//   node v2b/shot.cjs "v2b/index.html?t=12.5" /tmp/f.jpg
const path = require("path"), http = require("http"), fs = require("fs");
const { chromium } = require(process.env.PLAYWRIGHT || "/opt/node-tools/node_modules/playwright");
const ROOT = path.resolve(__dirname, ".."), MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff" };
const [url, out, scale] = process.argv.slice(2);
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
server.listen(0, "127.0.0.1", async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] }), page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: Number(scale || 0.5) });
  page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  page.on("console", (m) => { if (m.type() === "error") console.error("console:", m.text()); });
  await page.goto(`http://127.0.0.1:${server.address().port}/${url}`);
  await page.waitForFunction("window.__ready === true", null, { timeout: 15000 }).catch(() => console.error("not ready"));
  await page.screenshot({ path: out, type: "jpeg", quality: 88 });
  await browser.close(); server.close();
});
