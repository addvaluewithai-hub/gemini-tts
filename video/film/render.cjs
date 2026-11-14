#!/usr/bin/env node
// Renders a film scene: a page that exposes window.draw(t, voice) and window.DUR (see pilot01.html).
//   node film/render.cjs <page.html> <out.mp4> [--audio mix.wav] [--still t1,t2,...] [--from s] [--to s]
// --audio is the finished sound for the scene; its level also drives the host's mouth when he is on screen.
const fs = require("fs"), path = require("path"), http = require("http"), { spawn } = require("child_process"), { chromium } = require("playwright");
const [page_, out] = process.argv.slice(2), flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!out) { console.error("usage: node film/render.cjs <page.html> <out.mp4> [--audio mix.wav] [--still t1,t2] [--from s] [--to s]"); process.exit(2); }
const ROOT = path.resolve(__dirname, ".."), FPS = 30, MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2" };
const audio = flag("--audio"), voiceFile = flag("--voice") || audio;
let level = () => 0;
if (voiceFile) {                         // RMS of the voice in a 50 ms window, as 0..1
  const b = fs.readFileSync(voiceFile); let p = 12, rate = 24000, ch = 1, data = null;
  while (p + 8 <= b.length) { const id = b.toString("ascii", p, p + 4), n = b.readUInt32LE(p + 4); if (id === "fmt ") { ch = b.readUInt16LE(p + 10); rate = b.readUInt32LE(p + 12); } if (id === "data") { data = b.subarray(p + 8, Math.min(b.length, p + 8 + n)); break; } p += 8 + n + (n & 1); }
  const pcm = new Int16Array(data.buffer, data.byteOffset, Math.floor(data.length / 2));
  level = (t) => { const a = Math.max(0, Math.floor((t - 0.025) * rate)) * ch, z = Math.min(pcm.length, Math.floor((t + 0.025) * rate) * ch); if (z <= a) return 0; let s = 0; for (let i = a; i < z; i += ch) s += pcm[i] * pcm[i]; return Math.min(1, Math.sqrt(s / ((z - a) / ch)) / 32768 * 9); };
}
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
server.listen(0, "127.0.0.1", async () => {
  const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/${path.relative(ROOT, path.resolve(page_))}`); await page.waitForFunction("window.__ready === true");
  const dur = await page.evaluate("window.DUR"), from = Number(flag("--from") || 0), to = Number(flag("--to") || dur);
  const stills = flag("--still");
  if (stills) { for (const s of stills.split(",")) { await page.evaluate(([t, v]) => window.draw(t, v), [Number(s), level(Number(s))]); await page.screenshot({ path: out.replace(/\.\w+$/, "") + `-${s}.jpg`, type: "jpeg", quality: 85 }); } await browser.close(); server.close(); return; }
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", ...(audio ? ["-ss", String(from), "-t", String(to - from), "-i", audio] : []),
    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", ...(audio ? ["-c:a", "aac", "-b:a", "192k", "-shortest"] : []), "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg " + c)))));
  const cdp = await page.context().newCDPSession(page), N = Math.round((to - from) * FPS);
  for (let i = 0; i < N; i++) { const t = from + i / FPS; await page.evaluate(([tt, v]) => window.draw(tt, v), [t, level(t)]);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 92 }); if (!ff.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ff.stdin.once("drain", r)); }
  ff.stdin.end(); await done; await browser.close(); server.close(); console.log(`wrote ${out}: ${N} frames, ${(N / FPS).toFixed(1)} s`);
});
