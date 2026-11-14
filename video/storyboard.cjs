#!/usr/bin/env node
// A storyboard is the script and its direction in one file: scenes made of beats, each beat a line the
// host says plus what the picture does while he says it. From it this tool writes the factory request,
// and, once the audio exists, a cue file with every beat placed on the transcript.
//   node storyboard.cjs request <storyboard.json> <job-id>         -> request.json, dispatch.json, script.md beside it
//   node storyboard.cjs cues <storyboard.json> <transcript.json> <out-cues.json>
// A beat: { say, shot: wide|host|close|low } for the host alone, or { say, show: slide|fact|meme, ... } for
// something full screen with the host small in the corner. Scene fields `slide` and `story` carry down.
// Everything else on a beat (emote, gesture, duck, mark, zoom, center, fact, meme ...) goes to the editor as is.
// A scene can set `music` (0..1, how loud the bed is) and `calm` (hands stay down) for a passage that is not a joke.
const fs = require("fs"), path = require("path");
const { norm } = require("./editor.cjs");
const [cmd, sbPath, a, b] = process.argv.slice(2);
if (!cmd || !sbPath) { console.error("usage: node storyboard.cjs request <storyboard.json> <job-id> | cues <storyboard.json> <transcript.json> <out.json>"); process.exit(2); }
const sb = JSON.parse(fs.readFileSync(sbPath, "utf8")), dir = path.dirname(sbPath);
const plain = (t) => t.replace(/\s*<[^>]+>\s*/g, " ").trim();

if (cmd === "request") {
  const turns = sb.scenes.map((s) => ({ style: `${sb.style} ${s.style || ""}`.trim(), text: s.beats.map((x) => x.say).join(" ") }));
  const rel = path.relative(path.resolve(__dirname, ".."), dir);
  const request = { turns, voice: sb.voice, routing: "quality", format: "wav", sample_rate: 24000, temperature: 1,
    transcript: { language_codes: [sb.language], write_vtt: true },
    metadata: { channel: path.basename(path.dirname(dir)), title: sb.title, language: sb.language, recorded_for: sb.recorded_for || "", script: `${rel}/script.md` } };
  fs.writeFileSync(path.join(dir, "request.json"), JSON.stringify(request, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "dispatch.json"), JSON.stringify({ event_type: "tts.generate", client_payload: { job_id: a, request } }, null, 2) + "\n");
  const md = [`# ${sb.title}`, "", ...(sb.notes || []), "", "## Script", "", ...sb.scenes.flatMap((s) => [`### ${s.story ? `${s.story.n}. ${s.story.tag}` : s.id}`, "", s.beats.map((x) => plain(x.say)).join(" "), ""]),
    "## Sources", "", ...Object.entries(((f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : {}))(path.join(sb.slidesFrom ? path.resolve(dir, sb.slidesFrom) : dir, "slides.json"))).map(([k, v]) => `- ${k}: ${v.source}, ${v.date}, ${v.url}`), ""];
  fs.writeFileSync(path.join(dir, "script.md"), md.join("\n"));
  console.log(`turns ${turns.length}, words ${turns.reduce((n, t) => n + plain(t.text).split(/\s+/).length, 0)}`);
}

// Place each beat on the transcript. The transcriber respells names and writes numbers as digits, so the
// two word lists are aligned as a whole (the classic edit-distance table) instead of searched phrase by phrase.
if (cmd === "cues") {
  const words = JSON.parse(fs.readFileSync(a, "utf8")).words;
  const heard = words.map((w) => norm(w.text)), beats = sb.scenes.flatMap((s) => s.beats.map((x) => ({ ...x, scene: s })));
  const said = [], owner = [], written = [];
  beats.forEach((x, k) => { for (const raw of plain(x.say).split(/\s+/)) { const tok = norm(raw); if (tok) { said.push(tok); owner.push(k); written.push(raw); } else if (written.length) written[written.length - 1] += raw; } });
  const n = said.length, m = heard.length, W = m + 1, cost = new Float32Array((n + 1) * W), from = new Uint8Array((n + 1) * W);
  const sim = (p, q) => { if (p === q) return 0; if (p.length > 2 && q.length > 2 && (p.includes(q) || q.includes(p))) return 0.4; return 1; };
  for (let j = 1; j <= m; j++) { cost[j] = j * 0.7; from[j] = 2; }
  for (let i = 1; i <= n; i++) { cost[i * W] = i * 0.7; from[i * W] = 1;
    for (let j = 1; j <= m; j++) { const d = cost[(i - 1) * W + j - 1] + sim(said[i - 1], heard[j - 1]), u = cost[(i - 1) * W + j] + 0.7, l = cost[i * W + j - 1] + 0.7;
      if (d <= u && d <= l) { cost[i * W + j] = d; from[i * W + j] = 0; } else if (u <= l) { cost[i * W + j] = u; from[i * W + j] = 1; } else { cost[i * W + j] = l; from[i * W + j] = 2; } } }
  const match = new Int32Array(n).fill(-1);
  for (let i = n, j = m; i > 0 || j > 0;) { const f = from[i * W + j]; if (f === 0) { match[i - 1] = j - 1; i--; j--; } else if (f === 1) i--; else j--; }
  // a beat starts at its first word that was heard; failing that, where the previous beat's last heard word ends
  const start = beats.map(() => null); let exact = 0;
  // The script's own words, timed by the heard word each one lines up with (or spread across the gap when it
  // has none): captions then show what was written, names and spelling included, not what the transcriber typed.
  const timed = written.map((text, i) => (match[i] >= 0 ? { s: words[match[i]].start_ms, e: words[match[i]].end_ms, text } : { s: null, e: null, text }));
  for (let i = 0; i < n; i++) { if (timed[i].s !== null) { if (said[i] === heard[match[i]]) exact++; continue; }
    let q = i; while (q < n && timed[q].s === null) q++;
    const lo = i ? timed[i - 1].e : 0, hi = q < n ? timed[q].s : words[m - 1].end_ms, step = Math.max(0, hi - lo) / (q - i);
    for (let r = i; r < q; r++) { timed[r].s = Math.round(lo + step * (r - i)); timed[r].e = Math.round(lo + step * (r - i + 1)); } i = q - 1; }
  for (let i = 1; i < n; i++) { if (timed[i].s < timed[i - 1].s) timed[i].s = timed[i - 1].s; if (timed[i].e < timed[i].s + 60) timed[i].e = timed[i].s + 60; }
  for (let i = 0; i < n; i++) if (start[owner[i]] === null) start[owner[i]] = timed[i].s / 1000;
  const scriptWords = b.replace(/\.json$/, "") + ".words.json";
  fs.writeFileSync(scriptWords, JSON.stringify({ note: "The storyboard's words on the transcript's timings; generated by storyboard.cjs.", duration_ms: JSON.parse(fs.readFileSync(a, "utf8")).duration_ms, words: timed.map((w) => ({ start_ms: w.s, end_ms: w.e, text: w.text })) }) + "\n");
  const tempo = (sb.settings || {}).tempo || 1, VIEW = { top: {}, body: { center: [0.5, 1.05] }, deep: { center: [0.5, 1.65] } };
  const edit = [], boardStep = {}, boardSince = {}; let story, slide, showing = null, level = 1;
  beats.forEach((x, k) => {
    const { say, scene, show, view, ...rest } = x, e = { t: Math.round((start[k] - 0.07) / tempo * 100) / 100, say: plain(say).slice(0, 48), ...rest };
    if (k === 0) e.t = -((sb.settings || {}).lead ?? 0.4);
    if (scene.story !== story) { story = scene.story; e.story = story ?? null; }
    const wantLevel = rest.music ?? scene.music ?? 1;                    // a beat or a scene can lower the music; it comes back by itself
    if (wantLevel !== level) { level = wantLevel; e.music = level; } else delete e.music;
    if (scene.calm || rest.calm) { e.calm = true; if (e.gesture === undefined) e.gesture = "pockets"; }
    const want = rest.slide !== undefined ? rest.slide : scene.slide ?? null;
    if (want !== slide) { slide = want; e.slide = slide; }
    // a board is named once (in the scene's or the storyboard's `boards`) and each beat on it moves it one step on,
    // even when the host cuts in between
    let boardId = null;
    if (show === "board") { boardId = typeof x.board === "string" ? x.board : x.board.id || "b" + k; const spec = typeof x.board === "string" ? (scene.boards || {})[x.board] || (sb.boards || {})[x.board] : x.board;
      if (!spec) throw new Error("no board called " + x.board); e.board = spec;
      // step: "hold" keeps the board where it is (the host talks over it); otherwise each beat moves it one step on
      e.step = x.step === "hold" ? boardStep[boardId] ?? 0 : x.step ?? (boardId in boardStep ? boardStep[boardId] + 1 : 0);
      if (e.step !== boardStep[boardId] || !(boardId in boardSince)) boardSince[boardId] = e.t; boardStep[boardId] = e.step; e.stepT = boardSince[boardId]; }
    const key = show ? (show === "slide" ? "slide:" + slide : show === "board" ? "board:" + boardId : "card:" + k) : null;
    if (show && key === showing) delete e.shot;                           // same page as the beat before: keep scrolling, no cut
    else if (show) { e.shot = "show"; e.kind = show; }
    showing = key;
    if (show) { if (show === "slide") { if (view === "top" || view === undefined) { if (e.mark === undefined) e.mark = "headline"; } else Object.assign(e, { ...VIEW[view], ...e }); } }
    edit.push(e);
  });
  const last = words[words.length - 1].end_ms / 1000 / tempo;
  if (sb.ending && sb.ending.card) edit.push({ t: Math.round((last + 0.7) * 100) / 100, shot: "show", kind: "board", board: { kind: "endcard", ...sb.ending.card }, step: 0, story: null, music: 1 });
  else if (sb.ending) edit.push({ t: Math.round((last + 0.25) * 100) / 100, shot: "wide", duck: !!sb.ending.duck, emote: "sly" }, ...(sb.ending.lurk ? [{ t: Math.round((last + 1.0) * 100) / 100, lurk: true }] : []));
  const epRel = path.relative(path.dirname(path.resolve(b)), sb.slidesFrom ? path.resolve(dir, sb.slidesFrom) : dir);
  const cues = { note: `Generated from ${path.basename(sbPath)} by storyboard.cjs; edit the storyboard, not this file.`, episode: epRel, transcript: path.relative(path.resolve(path.dirname(b), epRel), path.resolve(scriptWords)),
    slides: "slides.json", face: sb.face || "pear", date: sb.date, rtl: !!sb.rtl, layout: sb.layout || "solo", ...(sb.size ? { size: sb.size } : {}), ...(sb.brand ? { brand: sb.brand } : {}), ...(sb.theme ? { theme: sb.theme } : {}), from: 0, to: null, ...(sb.settings || {}), fix: sb.fix || [], edit };
  fs.writeFileSync(b, JSON.stringify(cues, null, 1) + "\n");
  console.log(`beats ${beats.length}, script words ${n}, heard ${m}, matched exactly ${exact} (${Math.round(exact / n * 100)}%)`);
}
