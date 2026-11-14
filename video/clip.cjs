#!/usr/bin/env node
// Renders an animated clip of the host from episode audio and word timestamps.
//   node clip.cjs <cues.json> <audio.wav> <out.mp4> [--still t1,t2,...] [--workers n] [--plan]
// Every frame is a pure function of time: the director turns audio level, word timings and the cue file
// into plain state, the page draws it, Chromium screenshots it, ffmpeg encodes it.
// A cue file with an `edit` list is a studio episode: editor.cjs cuts it into shots on the news-desk set
// (studio.html), with screenshots from the episode's slides folder, and sfx.cjs supplies effects and music.
// `tempo` speeds the voice up without changing its pitch; every time in the cue file is then in sped-up time.
const fs = require("fs"), os = require("os"), path = require("path"), http = require("http"), { spawn, spawnSync } = require("child_process");
const { chromium } = require("playwright");
const lipsync = require("./lipsync.cjs");

const [cuesPath, wavPath, outPath] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!cuesPath || !wavPath || !outPath) { console.error("usage: node clip.cjs <cues.json> <audio.wav> <out.mp4> [--still t1,t2] [--workers n]"); process.exit(2); }
const FPS = 30, ROOT = __dirname;
const cues = JSON.parse(fs.readFileSync(cuesPath, "utf8"));
const epDir = path.resolve(path.dirname(cuesPath), cues.episode);
const transcript = JSON.parse(fs.readFileSync(path.join(epDir, cues.transcript), "utf8"));
const words = transcript.words.map((w) => ({ s: w.start_ms / 1000, e: Math.max(w.end_ms, w.start_ms + 60) / 1000, t: w.text }));
const studio = Array.isArray(cues.edit), tmp = fs.mkdtempSync(path.join(os.tmpdir(), "clip-"));
let voicePath = wavPath;
if (cues.tempo && cues.tempo !== 1) {
  voicePath = path.join(tmp, "voice.wav");
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wavPath, "-filter:a", `atempo=${cues.tempo}`, "-c:a", "pcm_s16le", voicePath], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("could not change the tempo");
  for (const w of words) { w.s /= cues.tempo; w.e /= cues.tempo; } transcript.duration_ms /= cues.tempo;
}
if (cues.to == null) cues.to = Math.round((transcript.duration_ms / 1000 + (cues.tail ?? 0.9)) * 10) / 10;   // whole episode, with a beat to react at the end

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
const wav = readWav(voicePath);
const level = (t) => {           // RMS over a 40 ms window centred on t
  const a = Math.max(0, Math.floor((t - 0.02) * wav.rate)) * wav.ch, b = Math.min(wav.pcm.length, Math.floor((t + 0.02) * wav.rate) * wav.ch);
  if (b <= a) return 0; let s = 0; for (let i = a; i < b; i += wav.ch) s += wav.pcm[i] * wav.pcm[i];
  return Math.sqrt(s / ((b - a) / wav.ch)) / 32768;
};

// ---- direction and captions ------------------------------------------------------------------------
const { direct } = require("./director.cjs");
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const dur = cues.to - cues.from + cues.lead, N = Math.round(dur * FPS);
const tAudio = (i) => cues.from - cues.lead + i / FPS;
let acting = [], chapters = [];

// Cue entries may say `match` (a pattern found in a sentence) instead of a time. Resolve them once.
function resolveCues() {
  const { sentences } = require("./director.cjs");
  const sents = sentences(words.filter((w) => w.e > cues.from && w.s < cues.to));
  const find = (m) => sents.find((q) => new RegExp(m, "i").test(q.text));
  const paper = [];
  for (const c of cues.paper || []) {
    if (c.match === undefined) { paper.push(c); continue; }
    const q = find(c.match); if (!q) { console.warn("cue not found:", c.match); continue; }
    const end = c.until ? (find(c.until) || q).e : q.e;
    paper.push({ t: q.s - 0.3, pose: c.pose }, { t: end + 0.15, pose: "pockets" });
  }
  cues.paper = paper.sort((a, b) => a.t - b.t);
  cues.acting = (cues.acting || []).map((c) => { if (c.match === undefined) return c; const q = find(c.match); if (!q) { console.warn("cue not found:", c.match); return null; } return { ...c, from: q.s, to: q.e }; }).filter(Boolean);
  chapters = (cues.chapters || []).map((c) => { if (c.match === undefined) return c; const q = find(c.match); if (!q) { console.warn("chapter not found:", c.match); return null; } return { t: q.s - 0.2, label: c.label }; }).filter(Boolean).sort((a, b) => a.t - b.t);
  // caption fixes: [["heard words", "shown text"], ...]. A phrase of several words collapses onto its first word;
  // the punctuation after the last word is kept. Only the captions change, never the timing.
  const norm = require("./editor.cjs").norm;
  for (const w of words) w.show = w.t;
  for (const [from, to] of cues.fix || []) {
    const want = from.split(/\s+/).map(norm);
    for (let i = 0; i + want.length <= words.length; i++) {
      if (!want.every((x, k) => norm(words[i + k].t) === x)) continue;
      const tail = (words[i + want.length - 1].t.match(/[^\p{L}\p{N}]+$/u) || [""])[0];
      words[i].show = to + tail; for (let k = 1; k < want.length; k++) words[i + k].show = "";
    }
  }
}

// captions: the phrase being spoken, words lighting up as they land
function caption(i) {
  if (cues.captions === false) return { words: [] };          // no burned-in captions: the platform's own subtitles do the job in every language
  const t = tAudio(i);
  let wi = -1; for (let k = 0; k < words.length; k++) if (words[k].s <= t) wi = k;
  let a = Math.max(0, wi), b; while (a > 0 && !/[.!?؟]$/.test(words[a - 1].t) && wi - a < 60) a--;
  b = a; while (b < words.length - 1 && !/[.!?؟]$/.test(words[b].t)) b++;
  if (wi < 0) { a = 0; b = -1; }
  const chunk = cues.captionChunk ?? 7, start = a + Math.floor(Math.max(0, wi - a) / chunk) * chunk;
  const shown = words.slice(start, Math.min(b + 1, start + chunk)).map((w, k) => {
    const idx = start + k, age = t - w.s;
    return { t: w.show ?? w.t, state: idx > wi ? "off" : idx === wi ? "on now" : "on", scale: idx === wi ? (1 + 0.14 * Math.max(0, 1 - age / 0.16)).toFixed(3) : 1 };
  });
  return { words: wi >= 0 && t > words[Math.min(b, words.length - 1)].e + 0.5 ? [] : shown };
}
let studioFrames = null;
function frame(i) {
  if (studioFrames) return studioFrames[i];
  const tv = i / FPS, t = tAudio(i), a0 = acting[i], shown = caption(i).words;
  const ts = Math.max(0, t), mm = String(Math.floor(ts / 60)).padStart(2, "0"), ss = String(Math.floor(ts % 60)).padStart(2, "0"), ff = String(Math.floor((ts % 1) * FPS)).padStart(2, "0");
  return { ...a0, face: cues.face, label: cues.label, status: cues.status ?? "REC", chapter: ([...chapters].reverse().find((c) => c.t <= t) || {}).label ?? cues.chapter ?? "", words: shown, recOn: Math.floor(tv * 1.2) % 2 === 0, tc: `${mm}:${ss}:${ff}`, progress: clamp(i / (N - 1)) };
}

// ---- render ---------------------------------------------------------------------------------------
const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {          // the video folder, plus the episode folder under /ep/
  const u = decodeURIComponent(req.url.split("?")[0]), base = u.startsWith("/ep/") ? epDir : ROOT, f = path.join(base, u.startsWith("/ep/") ? u.slice(4) : u);
  if (!f.startsWith(base) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});

server.listen(0, "127.0.0.1", async () => {
  resolveCues();
  let plan = null; const slides = {};
  if (studio) {
    const listFile = path.join(epDir, cues.slides || "slides.json"), list = fs.existsSync(listFile) ? JSON.parse(fs.readFileSync(listFile, "utf8")) : {}, capFile = path.join(epDir, "slides", "captured.json");
    const got = fs.existsSync(capFile) ? JSON.parse(fs.readFileSync(capFile, "utf8")) : {};
    for (const [k, v] of Object.entries(list)) slides[k] = { ...v, ...(got[k] && got[k].ok ? { file: got[k].file, focus: got[k].focus, headline: got[k].headline, screens: got[k].screens || 1 } : {}) };
    plan = require("./editor.cjs").resolve(cues, words, slides);
    cues.acting.push(...plan.acting); cues.paper = [...plan.paper, ...cues.paper.filter((c) => c.t > -99)].sort((a, b) => a.t - b.t);
  }
  const lip = await lipsync.build(words.filter((w) => w.e > cues.from - 1 && w.s < cues.to + 1), level);
  const show = await direct({ words: words.filter((w) => w.e > cues.from && w.s < cues.to), lip, level, cues, N, FPS, tAudio });
  acting = show.frames;
  if (studio) studioFrames = require("./editor.cjs").build({ cues, plan, acting, slides, N, FPS, tAudio, caption });
  if (lip.missing.length) console.log("not in the pronouncing dictionary, guessed from spelling:", lip.missing.join(", "));
  if (process.argv.includes("--plan") && plan) for (const g of plan.segs) console.log(`${g.t.toFixed(2).padStart(7)}  ${(g.cut ? g.shot : "  ·").padEnd(7)} ${(g.trans || "").padEnd(7)} ${[g.slide && g.shot === "insert" ? "slide:" + g.slide : "", g.fact ? "fact:" + g.fact.big : "", g.duck ? "duck" : "", g.lurk ? "lurk" : "", g.peek ? "peek" : "", g.emote || "", g.gesture || ""].filter(Boolean).join(" ")}`);
  if (process.argv.includes("--plan")) for (const q of show.sents) console.log(`${q.s.toFixed(1).padStart(6)}  ${q.emote.padEnd(10)} ${q.gesture.padEnd(12)} ${(q.react || "-").padEnd(9)} ${q.text.slice(0, 70)}`);
  const url = `http://127.0.0.1:${server.address().port}/${studio ? "studio.html" : "stage.html"}`;
  const browser = await chromium.launch();
  const open1 = async () => {
    const [vw, vh] = cues.size || [1920, 1080];
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    page.on("pageerror", (err) => { console.error("PAGE ERROR", err.message); process.exitCode = 1; });
    await page.goto(url); await page.waitForFunction("window.__ready === true", null, { timeout: 20000 });
    if (studio) await page.evaluate((c) => window.setup(c), { slides, face: cues.face, date: cues.date || "", rtl: !!cues.rtl, layout: cues.layout || "", brand: cues.brand || null, theme: cues.theme || null });
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
  // sound: the voice alone, or voice + effects + a music bed that ducks under the voice
  const delay = `adelay=${Math.round(cues.lead * 1000)}:all=1,apad`, extra = [];
  let mix = `[1:a]${delay}[a]`;
  if (studio) {
    const sfx = require("./sfx.cjs"), toVideo = (e) => ({ ...e, t: e.t - cues.from + cues.lead });
    sfx.writeWav(path.join(tmp, "sfx.wav"), sfx.effects(plan.sfx.map(toVideo), dur), cues.sfxGain ?? 0.6);
    sfx.writeWav(path.join(tmp, "music.wav"), sfx.music(dur, { bpm: cues.bpm, end: dur - 0.25, levels: plan.music.map(toVideo) }));
    extra.push("-i", path.join(tmp, "sfx.wav"), "-i", path.join(tmp, "music.wav"));
    mix = `[1:a]aresample=48000,volume=${cues.voiceGain ?? 1},${delay},asplit=2[v][key];[3:a][key]sidechaincompress=threshold=0.03:ratio=4:attack=15:release=380[m];` +
      `[v][2:a][m]amix=inputs=3:normalize=0:weights=1 1 ${cues.musicGain ?? 0.5}[x];[x]loudnorm=I=-16:TP=-2.5:LRA=11,aresample=48000[a]`;
  }
  // --dub <voice.wav>: no picture. Mix another voice track (already in this video's timing and tempo, see dub.cjs)
  // with this episode's own effects and music, for a second audio language on the same video.
  const dub = flag("--dub");
  if (dub) {
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-i", dub, ...extra, "-filter_complex", mix, "-map", "[a]", "-t", String(dur), "-c:a", "aac", "-b:a", "192k", outPath], { stdio: "inherit" });
    await browser.close(); server.close(); if (r.status !== 0) throw new Error("could not mix the dub"); console.log(`wrote ${outPath}: ${dur.toFixed(2)} s of audio`); return;
  }
  const workers = await Promise.all(Array.from({ length: Number(flag("--workers") || 4) }, open1));
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-ss", String(cues.from), "-t", String(cues.to - cues.from), "-i", voicePath, ...extra,
    "-filter_complex", mix, "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", outPath], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exited " + c)))));
  const buf = new Map(); let next = 0, cursor = 0; const t0 = Date.now();
  const flush = async () => { while (buf.has(next)) { const b = buf.get(next); buf.delete(next); if (!ff.stdin.write(b)) await new Promise((r) => ff.stdin.once("drain", r)); next++; if (next % 150 === 0) console.log(`frame ${next}/${N}  ${(next / ((Date.now() - t0) / 1000)).toFixed(1)} fps`); } };
  await Promise.all(workers.map(async (w) => { for (;;) { const i = cursor++; if (i >= N) return; while (i - next > 48) await new Promise((r) => setTimeout(r, 5)); buf.set(i, await shot(w, i)); await flush(); } }));
  await flush(); ff.stdin.end(); await done;
  await browser.close(); server.close();
  console.log(`wrote ${outPath}: ${N} frames, ${dur.toFixed(2)} s, ${((Date.now() - t0) / 1000).toFixed(0)} s to render`);
});
