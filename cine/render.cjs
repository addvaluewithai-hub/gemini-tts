#!/usr/bin/env node
// Renders a cine shot (a module exporting DUR and draw(t)) in headless Chromium, frame by frame, to H.264.
//   node render.cjs shots/x.js out.mp4 [--audio mix.wav] [--still t1,t2] [--from s] [--to s] [--fps 30]
const fs = require("fs"), path = require("path"), http = require("http"), { spawn } = require("child_process"), { chromium } = require("playwright");
const [shot, out] = process.argv.slice(2), flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!out) { console.error("usage: node render.cjs <shot.js> <out.mp4|prefix> [--audio mix.wav] [--still t1,t2] [--from s] [--to s]"); process.exit(2); }
const ROOT = __dirname, FPS = Number(flag("--fps") || 30), W = 1080, H = 1920;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".woff2": "font/woff2" };
const audio = flag("--audio");
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
server.listen(0, "127.0.0.1", async () => {
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/stage.html?shot=${encodeURIComponent(shot)}`);
  await page.waitForFunction("window.__ready === true", null, { timeout: 60000 });
  const dur = await page.evaluate("window.DUR"), from = Number(flag("--from") || 0), to = Number(flag("--to") || dur);
  const stills = flag("--still");
  if (stills) { for (const s of stills.split(",")) { await page.evaluate((t) => window.draw(t), Number(s)); await page.screenshot({ path: `${out}-${Number(s).toFixed(2)}.jpg`, type: "jpeg", quality: 88 }); }
    await browser.close(); server.close(); return; }
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", ...(audio ? ["-i", audio] : []),
    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", ...(audio ? ["-c:a", "aac", "-b:a", "192k"] : []), "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg " + c)))));
  const cdp = await page.context().newCDPSession(page), N = Math.round((to - from) * FPS), t0 = Date.now();
  for (let i = 0; i < N; i++) { await page.evaluate((t) => window.draw(t), from + i / FPS);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 93 });
    if (!ff.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ff.stdin.once("drain", r)); }
  ff.stdin.end(); await done; await browser.close(); server.close();
  console.log(`wrote ${out}: ${N} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
});
