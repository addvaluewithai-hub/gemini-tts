#!/usr/bin/env node
// A vertical Short (1080 x 1920) cut out of an explain episode, drawn by the same renderer:
//   node short.cjs <episode dir> <key> <voice.tight.wav> <out.mp4> [--still t1,t2]   (times in episode seconds)
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
