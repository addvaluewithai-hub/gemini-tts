#!/usr/bin/env node
// Adds real mouth shapes to a cue file: every word Peek says is looked up in the CMU pronouncing dictionary
// (lib/lipsync.cjs, from the Arabic channel's engine) and turned into a mouth shape per video frame.
//   node audio/mouths.cjs out/ep01.json [who=peek]
// Writes cues.mouth[who] = [[presence, w, smile, jaw, tongue], ...] at cues.fps; presence eases in and out of speech.
const fs = require("fs"), path = require("path"), lipsync = require("../lib/lipsync.cjs");
(async () => {
  const file = process.argv[2], who = process.argv[3] || "peek", cues = JSON.parse(fs.readFileSync(file, "utf8")), env = cues[who], fps = cues.fps;
  const level = (t) => { const x = t * fps, i = Math.floor(x), f = x - i; return ((env[i] || 0) * (1 - f) + (env[i + 1] || 0) * f); };
  const words = cues.words.filter((w) => w.who === who).map((w) => ({ s: w.t, e: w.e, t: w.w }));
  const lip = await lipsync.build(words, level, { threshold: 0.12 });
  const N = Math.ceil(cues.dur * fps) + 2, raw = [];
  for (let i = 0; i < N; i++) { const a = lip.shapeAt(i / fps), b = lip.shapeAt((i + 0.5) / fps), s = a || b; raw.push(s ? [s.w, s.smile, s.jaw, s.tongue] : null); }
  const out = []; let last = [0.85, 0.1, 0, 0], p = 0;
  for (let i = 0; i < N; i++) { const s = raw[i];
    if (s) { last = last.map((v, k) => v + (s[k] - v) * 0.7); p = Math.min(1, p + 0.6); } else { p = Math.max(0, p - 0.34); last = [last[0], last[1], last[2] * 0.6, 0]; }
    out.push([+p.toFixed(2), ...last.map((v) => +v.toFixed(3))]); }
  cues.mouth = { ...(cues.mouth || {}), [who]: out };
  fs.writeFileSync(file, JSON.stringify(cues));
  console.log(`${path.basename(file)}: ${words.length} words, ${lip.segs.length} mouth shapes${lip.missing.length ? ", guessed: " + lip.missing.join(" ") : ""}`);
})();
