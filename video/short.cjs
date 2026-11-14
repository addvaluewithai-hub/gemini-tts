#!/usr/bin/env node
// A vertical Short (1080 x 1920) cut out of an explain episode, drawn by the same renderer:
//   node short.cjs <episode dir> <key> <voice.tight.wav> <out.mp4> [--still t1,t2]   (times in episode seconds)
//   node short.cjs <episode dir> <key> <voice.tight.wav> <out.m4a> --dub <episode dub.wav> --end-dub <line.wav>   (another language's soundtrack)
// Reads the Short from <episode>/youtube/shorts.json: `parts` are [from, to] in seconds of the finished episode
// (the time of cues/<episode>.json). Each part is rendered from the episode's own cue file with `vertical: true`
// (editor.cjs / studio.html: the board as a card above the host, captions between them), then the parts are joined.
// `end`, if given, closes the Short on its own recorded line (`audio`, a WAV, with `words` timings) over the
// `shortend` board (boards.js); the bell comes in on the word اشترك. The voice is the tightened WAV that produce.sh
// makes (<work>/<episode>.tight.wav).
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const [epArg, key, wav, out] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!epArg || !key || !wav || !out) { console.error("usage: node short.cjs <episode dir> <key> <voice.tight.wav> <out.mp4> [--still t1,t2] [--end-only]"); process.exit(2); }
const ep = path.resolve(epArg), name = path.basename(ep), kit = path.join(ep, "youtube");
const all = JSON.parse(fs.readFileSync(path.join(kit, "shorts.json"), "utf8")), spec = all.shorts.find((s) => s.key === key);
if (!spec) { console.error("no Short called " + key); process.exit(2); }
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "cues", name + ".json"), "utf8"));
const zoom = spec.boardZoom || all.boardZoom || 0.68;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "short-")), env = { ...process.env, NODE_PATH: process.env.NODE_PATH || "/opt/node-tools/node_modules" };
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: "inherit", env, cwd: __dirname }); if (r.status !== 0) throw new Error(cmd + " failed"); };
const vertical = { size: [1080, 1920], vertical: true, boardZoom: zoom, lead: 0, tail: 0 };
const cue = (from, to, hold) => {
  const f = path.join(tmp, `cues-${from}.json`);
  fs.writeFileSync(f, JSON.stringify({ ...base, edit: base.edit.filter((e) => e.t < to - 0.05).map((e) => (e.t > from && e.t < from + 0.2 ? { ...e, t: from - 0.01, ...(e.stepT === e.t ? { stepT: from - 0.01 } : {}) } : e)),
    episode: ep, ...vertical, from, to, hold }));                                  // no cut into the next beat during the hold
  return f;
};
// the closing card: its own little "episode" folder holding the recorded line's word timings
const endCue = () => {
  const dir = path.join(tmp, "end"), tempo = base.tempo || 1; fs.mkdirSync(dir);
  const words = JSON.parse(fs.readFileSync(path.join(kit, spec.end.words), "utf8")); fs.writeFileSync(path.join(dir, "transcript.json"), JSON.stringify(words));
  const w = words.words, first = w[0].start_ms / 1000 / tempo, last = w[w.length - 1].end_ms / 1000 / tempo;
  const sub = w.find((x) => /اشترك/.test(x.text)), board = { kind: "shortend", ...spec.end.card };
  const edit = [{ t: -1, shot: "show", kind: "board", board, step: 0, stepT: first - 0.1, story: null, music: 1 }];
  if (sub) edit.push({ t: sub.start_ms / 1000 / tempo - 0.05, kind: "board", board, step: 1 });
  const f = path.join(tmp, "cues-end.json");
  fs.writeFileSync(f, JSON.stringify({ ...base, episode: dir, transcript: "transcript.json", slides: "none.json", edit, ...vertical, from: Math.max(0, first - 0.08), to: last + 0.3, hold: 1.0 }));
  return f;
};
// --dub <episode dub.wav> --end-dub <closing line.wav>: no picture. The Short's soundtrack in another language: the
// episode's dub track (dub.cjs output, already in the video's timing and tempo) cut to the same parts, and the Short's
// own closing line in that language fitted to the end card's length, each mixed with the same effects and music.
const dubPath = flag("--dub");
if (dubPath) {
  const tempo = base.tempo || 1, pieces = [], ff = (args) => run("ffmpeg", ["-y", "-loglevel", "error", ...args]);
  const piece = (cueFile, wavIn, i) => { const f = path.join(tmp, `dub${i}.m4a`); run("node", ["clip.cjs", cueFile, path.resolve(wav), f, "--dub", wavIn]); pieces.push(f); };
  spec.parts.forEach(([a, b], i) => {
    const last = i === spec.parts.length - 1 && !spec.end, hold = last ? 0.8 : 0.15, seg = path.join(tmp, `seg${i}.wav`);
    ff(["-ss", String(a), "-t", String(b - a + hold), "-i", path.resolve(dubPath), "-ac", "1", "-ar", "24000", seg]);
    piece(cue(a, b, hold), seg, i);
  });
  if (spec.end) {
    const endFile = endCue(), c = JSON.parse(fs.readFileSync(endFile, "utf8")), room = c.to - c.from + c.hold - 0.3, seg = path.join(tmp, "endseg.wav");
    const len = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", flag("--end-dub")], { encoding: "utf8" }).stdout) / tempo;
    const f = Math.max(1, len / room);                                        // only ever faster, and only if it would not fit
    ff(["-i", flag("--end-dub"), "-af", `silenceremove=start_periods=1:start_threshold=-45dB,atempo=${(tempo * f).toFixed(4)}`, "-ac", "1", "-ar", "24000", seg]);
    if (f > 1.001) console.log(`closing line sped up ${f.toFixed(2)}x to fit the card`);
    piece(endFile, seg, "end");
  }
  const list = path.join(tmp, "list.txt"); fs.writeFileSync(list, pieces.map((p) => `file '${p}'`).join("\n"));
  ff(["-f", "concat", "-safe", "0", "-i", list, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000", "-c:a", "aac", "-b:a", "192k", path.resolve(out)]);
  fs.rmSync(tmp, { recursive: true, force: true }); console.log("wrote", out); process.exit(0);
}
const stills = flag("--still");
if (stills) { const [a, b] = spec.parts[0]; run("node", ["clip.cjs", cue(a, b, 0), path.resolve(wav), path.resolve(out), "--still", stills, "--workers", "1"]); process.exit(0); }
const workers = process.env.WORKERS || "5", clips = [];
if (!process.argv.includes("--end-only")) spec.parts.forEach(([a, b], i) => {
  const f = path.join(tmp, `part${i}.mp4`), last = i === spec.parts.length - 1 && !spec.end;
  run("node", ["clip.cjs", cue(a, b, last ? 0.8 : 0.15), path.resolve(wav), f, "--workers", workers]); clips.push(f);
});
if (spec.end) { const f = path.join(tmp, "end.mp4"); run("node", ["clip.cjs", endCue(), path.join(kit, spec.end.audio), f, "--workers", workers]); clips.push(f); }
const inputs = clips.flatMap((f) => ["-i", f]), join = clips.map((_, i) => `[${i}:v][${i}:a]`).join("") + `concat=n=${clips.length}:v=1:a=1[v][a0];[a0]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]`;
run("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", join, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", path.resolve(out)]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("wrote", out);
