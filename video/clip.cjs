#!/usr/bin/env node
// Renders an animated clip of the host from episode audio and word timestamps.
//   node clip.cjs <cues.json> <audio.wav> <out.mp4> [--still t1,t2,...] [--workers n]
// Every frame is a pure function of time: the director below turns audio level, word timings and the
// cue file into plain state, the page draws it, Chromium screenshots it, ffmpeg encodes it.
const fs = require("fs"), path = require("path"), http = require("http"), { spawn } = require("child_process");
const { chromium } = require("playwright");
const lipsync = require("./lipsync.cjs");

const [cuesPath, wavPath, outPath] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!cuesPath || !wavPath || !outPath) { console.error("usage: node clip.cjs <cues.json> <audio.wav> <out.mp4> [--still t1,t2] [--workers n]"); process.exit(2); }
const FPS = 30, ROOT = __dirname;
const cues = JSON.parse(fs.readFileSync(cuesPath, "utf8"));
const epDir = path.resolve(path.dirname(cuesPath), cues.episode);
const words = JSON.parse(fs.readFileSync(path.join(epDir, cues.transcript), "utf8")).words
  .map((w) => ({ s: w.start_ms / 1000, e: Math.max(w.end_ms, w.start_ms + 60) / 1000, t: w.text }));

// ---- audio level per frame, from the WAV itself --------------------------------------------------
function readWav(file) {
  const b = fs.readFileSync(file); let p = 12, fmt = null, data = null;
  while (p + 8 <= b.length) { const id = b.toString("ascii", p, p + 4), n = b.readUInt32LE(p + 4);
    if (id === "fmt ") fmt = { ch: b.readUInt16LE(p + 10), rate: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
    if (id === "data") { data = b.subarray(p + 8, Math.min(b.length, p + 8 + n)); break; }
    p += 8 + n + (n & 1); }
  if (!fmt || !data || fmt.bits !== 16) throw new Error("expected 16-bit PCM WAV");
  return { ...fmt, pcm: new Int16Array(data.buffer, data.byteOffset, Math.floor(data.length / 2)) };
}
const wav = readWav(wavPath);
const level = (t) => {           // RMS over a 40 ms window centred on t
  const a = Math.max(0, Math.floor((t - 0.02) * wav.rate)) * wav.ch, b = Math.min(wav.pcm.length, Math.floor((t + 0.02) * wav.rate) * wav.ch);
  if (b <= a) return 0; let s = 0; for (let i = a; i < b; i += wav.ch) s += wav.pcm[i] * wav.pcm[i];
  return Math.sqrt(s / ((b - a) / wav.ch)) / 32768;
};

// ---- director -------------------------------------------------------------------------------------
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (p) => p * p * (3 - 2 * p);
const dur = cues.to - cues.from + cues.lead, N = Math.round(dur * FPS);
const tAudio = (i) => cues.from - cues.lead + i / FPS;

const isDead = (t) => cues.deadpan.some(([a, b]) => t >= a && t <= b);
const REST = { idle: { w: 1, smile: 0.365, jaw: 0, smirk: 1, tongue: 0 }, dead: { w: 0.85, smile: 0.03, jaw: 0, smirk: 0, tongue: 0 } };
const BETWEEN = { w: 0.84, smile: 0.18, jaw: 0.03, smirk: 0.35, tongue: 0 };   // lips together mid-sentence, not back to the smirk
const LEAD = 0.035;                                                              // the mouth moves a frame ahead of the sound
let mouths = [];
function directMouth(lip) {
  const cur = { ...REST.idle }; mouths = [];
  for (let i = 0; i < N; i++) {
    const t = tAudio(i) + LEAD, shape = t >= cues.from ? lip.shapeAt(t) : null;
    let goal, rate;
    if (shape) { goal = { ...shape, smirk: 0.35 }; rate = { w: 0.5, smile: 0.5, jaw: shape.viseme === "M" ? 0.85 : 0.62, smirk: 0.3, tongue: 0.6 }; }
    else {
      const next = lip.segs.find((g) => g.s > t), last = [...lip.segs].reverse().find((g) => g.e <= t);
      const mid = next && last && next.s - t < 0.28 && t - last.e < 0.28;      // a short gap inside a phrase
      goal = mid ? BETWEEN : isDead(tAudio(i)) ? REST.dead : REST.idle;
      rate = mid ? { w: 0.5, smile: 0.5, jaw: 0.7, smirk: 0.3, tongue: 0.6 } : { w: 0.2, smile: 0.2, jaw: 0.6, smirk: 0.16, tongue: 0.6 };
    }
    for (const k of Object.keys(cur)) cur[k] += ((goal[k] ?? 0) - cur[k]) * rate[k];
    mouths.push({ ...cur });
  }
}
const r = rng(21), blinks = []; for (let t = 1.6; t < dur; t += 2.4 + r() * 2.2) blinks.push(t);
const glances = []; { const g = rng(8); let t = 0, v = 0; while (t < dur) { glances.push({ t, v }); t += 1.1 + g() * 1.8; v = (g() - 0.5) * 0.7; } }
const SLIDE = 0.32;

function paperAt(t) {
  let k = 0; while (k + 1 < cues.paper.length && cues.paper[k + 1].t <= t) k++;
  const cur = cues.paper[k], before = cues.paper[k - 1], p = clamp((t - cur.t) / SLIDE);
  if (before && p < 1) {
    if (cur.pose === "pockets") return { paper: before.pose, shift: smooth(p) * 800 };          // paper drops away
    if (before.pose === "pockets") return { paper: cur.pose, shift: (1 - smooth(p)) * 800 };    // paper comes up
  }
  return { paper: cur.pose, shift: 0 };
}

function frame(i) {
  const tv = i / FPS, t = tAudio(i);
  const { paper, shift } = paperAt(t);
  const dead = isDead(t);
  const hidden = paper === "holes" && shift < 400, reading = paper === "over" && shift < 400;
  let look = 0; { let k = 0; while (k + 1 < glances.length && glances[k + 1].t <= tv) k++; const a = glances[Math.max(0, k - 1)].v, b = glances[k].v; look = a + (b - a) * smooth(clamp((tv - glances[k].t) / 0.18)); }
  if (hidden) look = tv < 0.42 ? -0.9 * smooth(clamp(tv / 0.14)) : tv < 0.8 ? -0.9 + 1.8 * smooth(clamp((tv - 0.42) / 0.14)) : 0.9 * (1 - smooth(clamp((tv - 0.8) / 0.14)));
  if (reading) look = 0.55 * Math.sin(2 * Math.PI * 0.75 * tv);
  if (dead) look = 0.85;
  let lid = dead ? 0.58 : reading ? 0.26 : 0.14;
  for (const b of blinks) { const d = (tv - b) * FPS; if (d >= 0 && d < 6) lid = Math.max(lid, d < 2 ? (d + 1) / 2 : 1 - (d - 2) / 4); }
  const m = mouths[i], o = m.jaw;
  const e = { lid, look, m };
  const bob = -7 * o + 2.2 * Math.sin(2 * Math.PI * 0.27 * tv), tilt = 1.4 * Math.sin(2 * Math.PI * 0.13 * tv + 1) + (dead ? 3.2 : 0) - 1.6 * o;

  // captions: the phrase being spoken, words lighting up as they land
  let wi = -1; for (let k = 0; k < words.length; k++) if (words[k].s <= t) wi = k;
  let a = Math.max(0, wi), b; while (a > 0 && !/[.!?]$/.test(words[a - 1].t) && wi - a < 60) a--;
  b = a; while (b < words.length - 1 && !/[.!?]$/.test(words[b].t)) b++;
  if (wi < 0) { a = 0; b = -1; }
  const chunk = 7, start = a + Math.floor(Math.max(0, wi - a) / chunk) * chunk;
  const shown = words.slice(start, Math.min(b + 1, start + chunk)).map((w, k) => {
    const idx = start + k, age = t - w.s;
    return { t: w.t, state: idx > wi ? "off" : idx === wi ? "on now" : "on", scale: idx === wi ? (1 + 0.14 * Math.max(0, 1 - age / 0.16)).toFixed(3) : 1 };
  });
  const ts = Math.max(0, t), mm = String(Math.floor(ts / 60)).padStart(2, "0"), ss = String(Math.floor(ts % 60)).padStart(2, "0"), ff = String(Math.floor((ts % 1) * FPS)).padStart(2, "0");
  return { e, face: cues.face, paper, shift, bob, tilt, label: cues.label, chapter: cues.chapter, words: shown, recOn: Math.floor(tv * 1.2) % 2 === 0, tc: `${mm}:${ss}:${ff}`, progress: clamp(i / (N - 1)) };
}

// ---- render ---------------------------------------------------------------------------------------
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});

server.listen(0, "127.0.0.1", async () => {
  const lip = await lipsync.build(words.filter((w) => w.e > cues.from - 1 && w.s < cues.to + 1), level);
  directMouth(lip);
  if (lip.missing.length) console.log("not in the pronouncing dictionary, guessed from spelling:", lip.missing.join(", "));
  const url = `http://127.0.0.1:${server.address().port}/stage.html`;
  const browser = await chromium.launch();
  const open1 = async () => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on("pageerror", (err) => { console.error("PAGE ERROR", err.message); process.exitCode = 1; });
    await page.goto(url); await page.waitForFunction("window.__ready === true", null, { timeout: 20000 });
    return { page, cdp: await page.context().newCDPSession(page) };
  };
  const shot = async (w, i, format = "jpeg") => {
    await w.page.evaluate((st) => window.draw(st), frame(i));
    const { data } = await w.cdp.send("Page.captureScreenshot", format === "png" ? { format } : { format, quality: 93 });
    return Buffer.from(data, "base64");
  };
  const stills = flag("--still");
  if (stills) {
    const w = await open1();
    for (const s of stills.split(",")) { const i = clamp(Math.round((Number(s) - cues.from + cues.lead) * FPS), 0, N - 1); const f = outPath.replace(/\.\w+$/, "") + `-${s}.png`; fs.writeFileSync(f, await shot(w, i, "png")); console.log("still", s, "->", f); }
    await browser.close(); server.close(); return;
  }
  const workers = await Promise.all(Array.from({ length: Number(flag("--workers") || 4) }, open1));
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-ss", String(cues.from), "-t", String(cues.to - cues.from), "-i", wavPath,
    "-filter_complex", `[1:a]adelay=${Math.round(cues.lead * 1000)}:all=1,apad[a]`, "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", outPath], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exited " + c)))));
  const buf = new Map(); let next = 0, cursor = 0; const t0 = Date.now();
  const flush = async () => { while (buf.has(next)) { const b = buf.get(next); buf.delete(next); if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once("drain", r)); next++; if (next % 150 === 0) console.log(`frame ${next}/${N}  ${(next / ((Date.now() - t0) / 1000)).toFixed(1)} fps`); } };
  await Promise.all(workers.map(async (w) => { for (;;) { const i = cursor++; if (i >= N) return; while (i - next > 48) await new Promise((r) => setTimeout(r, 5)); buf.set(i, await shot(w, i)); await flush(); } }));
  await flush(); ff.stdin.end(); await done;
  await browser.close(); server.close();
  console.log(`wrote ${outPath}: ${N} frames, ${dur.toFixed(2)} s, ${((Date.now() - t0) / 1000).toFixed(0)} s to render`);
});
