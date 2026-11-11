#!/usr/bin/env node
// Everything an upload needs besides the video.
//   node youtube.cjs kit <storyboard.json> <cues.json> <outDir>   -> description.txt, chapters, captions.srt, upload.md
//   node youtube.cjs art <specs.json> <outDir>                    -> one image per spec (thumbnails, avatar, banner)
// The storyboard's `youtube` block holds what a person writes (titles, the opening lines, tags); chapters come
// from the cue file's story changes, sources from slides.json, captions from the script's own timed words.
const fs = require("fs"), path = require("path"), http = require("http");
const [cmd, a, b, c] = process.argv.slice(2);
const stamp = (t, srt) => { const ms = Math.max(0, Math.round(t * 1000)), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return srt ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}` : `${h ? h + ":" : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`; };

if (cmd === "kit") {
  const sb = JSON.parse(fs.readFileSync(a, "utf8")), cues = JSON.parse(fs.readFileSync(b, "utf8")), yt = sb.youtube || {}, dir = path.dirname(a);
  const slides = ((f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {}))(path.join(sb.slidesFrom ? path.resolve(dir, sb.slidesFrom) : dir, "slides.json"));
  fs.mkdirSync(c, { recursive: true });
  // chapters: 0:00, then every change of story
  const lead = cues.lead ?? 0, chapters = [{ t: 0, name: yt.intro || "Intro" }];
  for (const e of cues.edit) if ("story" in e && e.t > 5) chapters.push({ t: e.t + lead, name: e.story ? `${e.story.n}. ${e.story.tag}` : yt.outro || "Final assessment" });
  const chapterLines = chapters.map((x) => `${stamp(x.t)} ${x.name}`);
  const used = [...new Set(sb.scenes.flatMap((s) => [s.slide, ...s.beats.map((x) => x.slide)]).filter(Boolean))];
  const sources = used.map((k) => `${slides[k].source} (${slides[k].date}): ${slides[k].url}`);
  const description = [...(yt.description || []), "", yt.chaptersTitle || "Chapters", ...chapterLines, "", yt.sourcesTitle || "Sources", ...sources, "", ...(yt.footer || []), "", (yt.hashtags || []).join(" ")].join("\n").trim() + "\n";
  fs.writeFileSync(path.join(c, "description.txt"), description);
  // captions from the script's own words: a new line at each sentence end, long pause or seventh word
  const wordsFile = path.resolve(path.dirname(b), cues.episode, cues.transcript);
  const tempo = cues.tempo || 1, words = JSON.parse(fs.readFileSync(wordsFile, "utf8")).words.map((w) => ({ s: w.start_ms / 1000 / tempo + lead, e: w.end_ms / 1000 / tempo + lead, t: w.text }));
  const lines = []; let cur = [];
  words.forEach((w, i) => { cur.push(w); const next = words[i + 1];
    if (!next || /[.!?؟:]$/.test(w.t) || cur.length >= 7 || next.s - w.e > 0.6) { lines.push(cur); cur = []; } });
  const srt = lines.map((l, i) => { const s = l[0].s, nextS = lines[i + 1] ? lines[i + 1][0].s : Infinity, e = Math.min(Math.max(l[l.length - 1].e + 0.25, s + 0.9), nextS - 0.04);
    return `${i + 1}\n${stamp(s, true)} --> ${stamp(e, true)}\n${l.map((w) => w.t).join(" ")}\n`; }).join("\n");
  fs.writeFileSync(path.join(c, "captions.srt"), srt);
  const md = [`# YouTube upload: ${sb.title}`, "", "## Title", "", ...(yt.titles || []).map((t, i) => `${i + 1}. ${t}${i ? "" : "  ← recommended"}`), "",
    "## Description", "", "Paste `description.txt` as it is. It already holds the chapters and the sources.", "",
    "## Tags", "", (yt.tags || []).join(", "), "", "## Settings", "", ...(yt.settings || []).map((x) => `- ${x}`), "",
    "## Files", "", "- `thumbnail-a.jpg` (recommended) and `thumbnail-b.jpg`: 1280 x 720", "- `captions.srt`: upload under Subtitles, language as set above", "- `description.txt`", "",
    "## Pinned comment", "", yt.pinned || "", ""];
  fs.writeFileSync(path.join(c, "upload.md"), md.join("\n"));
  console.log(`chapters ${chapters.length}, sources ${sources.length}, caption lines ${lines.length}, description ${description.length} chars`);
}

if (cmd === "art") {
  const { chromium } = require("playwright"), ROOT = __dirname, specs = JSON.parse(fs.readFileSync(a, "utf8"));
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2" };
  const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res); });
  server.listen(0, "127.0.0.1", async () => {
    const browser = await chromium.launch(), page = await browser.newPage({ viewport: { width: 2600, height: 1500 } });
    page.on("pageerror", (e) => { console.error("PAGE ERROR", e.message); process.exitCode = 1; });
    await page.goto(`http://127.0.0.1:${server.address().port}/youtube/art.html`); await page.waitForFunction("window.__ready === true");
    for (const s of specs) { const out = path.join(b, s.file); fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.evaluate((x) => window.render(x), s);
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width: s.w, height: s.h }, ...(out.endsWith(".png") ? {} : { type: "jpeg", quality: 92 }) }); console.log("wrote", out); }
    await browser.close(); server.close();
  });
}
