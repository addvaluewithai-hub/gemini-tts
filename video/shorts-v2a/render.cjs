// Draws frames of a code-drawn Short in headless Chromium and pipes them to ffmpeg.
//   node render.cjs --data data.json --out video.mp4 [--from s --to s] [--workers 4] [--m bleach]
//   node render.cjs --data data.json --stills 0.05,0.5,1.5 --dir shots [--scale 0.5]
const http = require("http"), fs = require("fs"), path = require("path"), { spawn, spawnSync } = require("child_process");
const { chromium } = require("playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i < 0 ? d : process.argv[i + 1]; };
const ROOT = path.resolve(__dirname, ".."), FPS = 30, W = 1080, H = 1920;
const data = fs.readFileSync(arg("data")), mod = arg("m", "bleach");
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  if (u === "/data.json") { res.writeHead(200, { "content-type": "application/json" }); return res.end(data); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});
server.listen(0, "127.0.0.1", async () => {
  const url = `http://127.0.0.1:${server.address().port}/shorts-v2a/stage.html?m=${mod}`;
  const browser = await chromium.launch({ args: ["--no-sandbox", "--force-color-profile=srgb"] });
  const open = async (scale = 1) => { const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale }); p.on("pageerror", (e) => console.error("page error:", e.message)); p.on("console", (m) => m.type() === "error" && console.error("console:", m.text())); await p.goto(url); await p.waitForFunction("window.__ready === true", null, { timeout: 30000 }); return p; };
  try {
    if (arg("stills")) {
      const dir = arg("dir", "shots"); fs.mkdirSync(dir, { recursive: true }); const p = await open(+arg("scale", 0.5));
      for (const s of arg("stills").split(",")) { const t = +s; await p.evaluate((t) => window.draw(t), t); await p.screenshot({ path: path.join(dir, `t${t.toFixed(2).padStart(6, "0")}.png`) }); }
    } else {
      const total = JSON.parse(data).total, from = +arg("from", 0), to = +arg("to", total), n0 = Math.round(from * FPS), n1 = Math.round(to * FPS), workers = +arg("workers", 4);
      const out = arg("out", "out.mp4"), tmp = out + ".parts"; fs.mkdirSync(tmp, { recursive: true });
      const per = Math.ceil((n1 - n0) / workers), t0 = Date.now(); let done = 0;
      await Promise.all([...Array(workers)].map(async (_, w) => {
        const a = n0 + w * per, b = Math.min(n1, a + per); if (a >= b) return;
        const p = await open(1), part = path.join(tmp, `p${w}.mp4`);
        const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "15", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-vf", "scale=out_color_matrix=bt709:out_range=tv", part], { stdio: ["pipe", "inherit", "inherit"] });
        for (let i = a; i < b; i++) { await p.evaluate((t) => window.draw(t), i / FPS); const buf = await p.screenshot({ type: "jpeg", quality: 96 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r)); if (++done % 150 === 0) console.log(`${done}/${n1 - n0} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
        ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await p.close();
      }));
      const list = path.join(tmp, "list.txt"); fs.writeFileSync(list, [...Array(workers)].map((_, w) => path.join(tmp, `p${w}.mp4`)).filter((f) => fs.existsSync(f)).map((f) => `file '${path.resolve(f)}'`).join("\n"));
      const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", out], { stdio: "inherit" }); if (r.status !== 0) throw new Error("concat failed");
      fs.rmSync(tmp, { recursive: true }); console.log(`wrote ${out}: ${n1 - n0} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
  } finally { await browser.close(); server.close(); }
});
