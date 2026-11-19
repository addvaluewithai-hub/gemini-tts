#!/usr/bin/env node
// Render a 3D shot frame by frame in headless Chromium (WebGL2 on the CPU through SwiftShader), then encode.
//   node render.mjs shots/s01-coldopen.js out/s01.mp4 [--from 0] [--to 10] [--scale 1] [--stills 0.5,2,4]
// --stills writes JPEGs only (quick look-dev); otherwise every frame at the shot's fps, then an H.264 MP4.
import http from "node:http";
import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { extname, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i < 0 ? d : args[i + 1]; };
const [shotPath, outPath] = args;
if (!shotPath || !outPath) { console.error("usage: node render.mjs <shot.js> <out.mp4|dir> [--from s] [--to s] [--scale k] [--stills t,t]"); process.exit(1); }

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".wav": "audio/wav" };
const server = http.createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = resolve(join(ROOT, p === "/" ? "index.html" : p));
    if (!file.startsWith(ROOT)) throw new Error("outside");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-sandbox"] });
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.error("[page]", m.text()); });
page.on("pageerror", (e) => console.error("[page error]", e.message));
await page.goto(`http://127.0.0.1:${port}/index.html?shot=${encodeURIComponent(shotPath)}&scale=${opt("scale", "1")}&off=${opt("off", "")}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const meta = await page.evaluate(async () => {
  const s = (await import("/" + new URLSearchParams(location.search).get("shot"))).default;
  return { fps: s.fps, duration: s.duration };
});

const dump = async (t, file) => {
  const url = await page.evaluate((tt) => window.__render(tt), t);
  await writeFile(file, Buffer.from(url.split(",")[1], "base64"));
};

const stills = opt("stills");
const started = Date.now();
if (stills) {
  await mkdir(outPath, { recursive: true });
  for (const t of stills.split(",").map(Number)) { await dump(t, join(outPath, `t${t.toFixed(2)}.jpg`)); console.log("still", t); }
} else {
  const from = Number(opt("from", 0)), to = Number(opt("to", meta.duration));
  const frames = join(dirname(outPath), ".frames-" + Date.now());
  await mkdir(frames, { recursive: true });
  const n0 = Math.round(from * meta.fps), n1 = Math.round(to * meta.fps);
  for (let n = n0; n < n1; n++) {
    await dump(n / meta.fps, join(frames, `f${String(n - n0).padStart(5, "0")}.jpg`));
    if ((n - n0) % 30 === 0) console.log(`frame ${n - n0}/${n1 - n0}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
  }
  const r = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(meta.fps), "-i", join(frames, "f%05d.jpg"),
    "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", outPath], { stdio: "inherit" });
  if (r.status !== 0) process.exitCode = 1;
  await rm(frames, { recursive: true, force: true });
}
console.log(`done in ${((Date.now() - started) / 1000).toFixed(0)}s`);
await browser.close();
server.close();
