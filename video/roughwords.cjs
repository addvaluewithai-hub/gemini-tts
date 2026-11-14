#!/usr/bin/env node
// Word timings for a short recording when no transcript is available: the text's words are spread over the parts of
// the WAV that have sound (ffmpeg silencedetect), in proportion to their length. Good enough for lip sync, not captions.
//   node roughwords.cjs <audio.wav> <text> <out.json>      (text may contain <short pause> tags; they are dropped)
const fs = require("fs"), { spawnSync } = require("child_process");
const [wav, text, out] = process.argv.slice(2);
const r = spawnSync("ffmpeg", ["-hide_banner", "-i", wav, "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"], { encoding: "utf8" });
const dur = Number((r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/) || []).slice(1).reduce((a, x, i) => a + Number(x) * [3600, 60, 1][i], 0));
const sil = []; let s0 = null;
for (const l of r.stderr.split("\n")) { let m;
  if ((m = l.match(/silence_start: ([\d.]+)/))) s0 = Number(m[1]);
  if ((m = l.match(/silence_end: ([\d.]+)/))) { sil.push([s0 ?? 0, Number(m[1])]); s0 = null; } }
if (s0 !== null) sil.push([s0, dur]);
const voiced = []; let t = 0; for (const [a, b] of sil) { if (a > t + 0.05) voiced.push([t, a]); t = b; } if (dur > t + 0.05) voiced.push([t, dur]);
const words = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean), total = voiced.reduce((a, [x, y]) => a + y - x, 0);
const weight = (w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5, W = words.reduce((a, w) => a + weight(w), 0);
let acc = 0; const at = (u) => { for (const [x, y] of voiced) { if (u <= y - x) return x + u; u -= y - x; } return dur; };
const list = words.map((w) => { const a = acc; acc += weight(w) / W * total; return { text: w, start_ms: Math.round(at(a + 0.01) * 1000), end_ms: Math.round(at(acc - 0.01) * 1000) }; });
fs.writeFileSync(out, JSON.stringify({ duration_ms: Math.round(dur * 1000), words: list, rough: true }));
console.log(`${words.length} words over ${voiced.length} voiced stretches, ${total.toFixed(1)} of ${dur.toFixed(1)} s`);
