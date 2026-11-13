#!/usr/bin/env node
// A vertical Short (1080 x 1920) cut out of an explain episode, drawn by the same renderer:
//   node short.cjs <episode dir> <key> <voice.tight.wav> <out.mp4> [--still t1,t2]   (times in episode seconds)
// Reads the Short from <episode>/youtube/shorts.json: `parts` are [from, to] in seconds of the finished episode
// (the time of cues/<episode>.json). Each part is rendered from the episode's own cue file with `vertical: true`
// (editor.cjs / studio.html: the board as a card above the host, captions between them), then the parts are joined.
// The voice is the tightened WAV that produce.sh makes (<work>/<episode>.tight.wav).
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const [epArg, key, wav, out] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!epArg || !key || !wav || !out) { console.error("usage: node short.cjs <episode dir> <key> <voice.tight.wav> <out.mp4> [--still t1,t2]"); process.exit(2); }
const ep = path.resolve(epArg), name = path.basename(ep);
const spec = JSON.parse(fs.readFileSync(path.join(ep, "youtube", "shorts.json"), "utf8")).shorts.find((s) => s.key === key);
if (!spec) { console.error("no Short called " + key); process.exit(2); }
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "cues", name + ".json"), "utf8"));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "short-")), env = { ...process.env, NODE_PATH: process.env.NODE_PATH || "/opt/node-tools/node_modules" };
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: "inherit", env, cwd: __dirname }); if (r.status !== 0) throw new Error(cmd + " failed"); };
const cue = (from, to, hold) => {
  const f = path.join(tmp, `cues-${from}.json`);
  fs.writeFileSync(f, JSON.stringify({ ...base, edit: base.edit.filter((e) => e.t < to - 0.05), episode: ep, size: [1080, 1920], vertical: true, boardZoom: spec.boardZoom || 0.68, from, to, lead: 0, hold, tail: 0 }));
  return f;
};
const stills = flag("--still");
if (stills) { const [a, b] = spec.parts[0]; run("node", ["clip.cjs", cue(a, b, 0), path.resolve(wav), path.resolve(out), "--still", stills, "--workers", "1"]); process.exit(0); }
const clips = spec.parts.map(([a, b], i) => {
  const f = path.join(tmp, `part${i}.mp4`), last = i === spec.parts.length - 1;
  run("node", ["clip.cjs", cue(a, b, last ? 0.8 : 0.15), path.resolve(wav), f, "--workers", process.env.WORKERS || "5"]);
  return f;
});
const inputs = clips.flatMap((f) => ["-i", f]), join = clips.map((_, i) => `[${i}:v][${i}:a]`).join("") + `concat=n=${clips.length}:v=1:a=1[v][a0];[a0]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]`;
run("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", join, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", path.resolve(out)]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("wrote", out);
