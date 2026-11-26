#!/usr/bin/env node
// A standalone Short (shorts lab, Nov 2026), rendered straight from its own storyboard in portrait:
//   node lab.cjs <storyboard.json> <voice.tight.wav> <out.mp4> [--still t1,t2] [--workers n]
// Reads cues/<storyboard dir>.json (made by `storyboard.cjs cues`) and renders it at 1080 x 1920 with the sets drawn
// for the tall frame. The storyboard's `lab` block sets the look: { peek: { h, side, sides } | null, bigHost: {...} }.
const fs = require("fs"), os = require("os"), path = require("path"), { spawnSync } = require("child_process");
const [sbArg, wav, out] = process.argv.slice(2);
const flag = (n) => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };
if (!sbArg || !wav || !out) { console.error("usage: node lab.cjs <storyboard.json> <voice.tight.wav> <out.mp4> [--still t1,t2]"); process.exit(2); }
const sbPath = path.resolve(sbArg), sb = JSON.parse(fs.readFileSync(sbPath, "utf8")), name = path.basename(path.dirname(sbPath));
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "cues", name + ".json"), "utf8")), lab = sb.lab || {};
const cues = { ...base, size: [1080, 1920], vertical: true, portraitSets: true, boardZoom: 1, captions: !!lab.captions,
  ...(lab.peek ? { peekFixed: { h: 0.27, side: "right", ...lab.peek } } : {}), ...(lab.bigHost || {}) };
const f = path.join(__dirname, "cues", name + ".lab.json"); fs.writeFileSync(f, JSON.stringify(cues));   // beside the episode cues, so its relative paths hold
const args = ["clip.cjs", f, path.resolve(wav), path.resolve(out)];
if (flag("--still")) args.push("--still", flag("--still"), "--workers", "1"); else args.push("--workers", flag("--workers") || "4");
const r = spawnSync("node", args, { stdio: "inherit", cwd: __dirname, env: { ...process.env, NODE_PATH: process.env.NODE_PATH || "/opt/node-tools/node_modules" } });
process.exit(r.status || 0);
