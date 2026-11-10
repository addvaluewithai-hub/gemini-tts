// Renders one PNG card per character plus an overview strip. Usage: node characters/render-sheet.cjs <outDir>
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "out"));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});
server.listen(0, "127.0.0.1", async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/characters/sheet.html`);
  await page.waitForFunction("window.__ready === true", null, { timeout: 15000 });
  const ids = await page.$$eval(".card", (els) => els.map((e) => e.id));
  for (const id of ids) { await (await page.$("#" + id)).screenshot({ path: path.join(OUT, id.replace("card-", "") + ".png") }); }
  console.log("cards:", ids.join(", "));
  await browser.close(); server.close();
});
