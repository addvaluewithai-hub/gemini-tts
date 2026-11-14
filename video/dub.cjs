#!/usr/bin/env node
// A second voice for a finished video. Takes another language's recording of the same storyboard (same beats, in
// the same order) and fits it beat by beat into the timing of the video that already exists, so it can be added
// as an extra audio track without touching the picture.
//   node dub.cjs <video cues.json> <dub cues.json> <dub voice.wav> <out.wav> [--srt out.srt]
// Both cue files come from storyboard.cjs; the dub voice is the tightened recording the dub cues were made from.
// Each beat is sped up or slowed down a little to fill its slot (0.9x to 1.22x, up to 1.3x when running behind).
// Nothing is cut: a line too long for its slot spills into the next one, and the lateness is reported. The result is at the video's own tempo: mix it with `clip.cjs ... --dub <out.wav>`.
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const [vidPath, dubPath, wavPath, outPath] = process.argv.slice(2);
const srtOut = ((i) => (i < 0 ? null : process.argv[i + 1]))(process.argv.indexOf("--srt"));
if (!outPath) { console.error("usage: node dub.cjs <video cues.json> <dub cues.json> <dub voice.wav> <out.wav> [--srt out.srt]"); process.exit(2); }
const SR = 24000, vid = JSON.parse(fs.readFileSync(vidPath, "utf8")), dub = JSON.parse(fs.readFileSync(dubPath, "utf8"));
const words = (c, p) => JSON.parse(fs.readFileSync(path.resolve(path.dirname(p), c.episode, c.transcript), "utf8"));
const vW = words(vid, vidPath), dW = words(dub, dubPath), vT = vid.tempo || 1, dT = dub.tempo || 1;
const beats = (c) => c.edit.filter((e) => !(e.board && e.board.kind === "endcard")).map((e) => Math.max(0, e.t));
const A = beats(vid), B = beats(dub);
if (A.length !== B.length) throw new Error(`the two cue files do not have the same beats: ${A.length} and ${B.length}`);
const endA = vW.duration_ms / 1000 / vT, endB = dW.duration_ms / 1000 / dT;      // cue times are in sped-up time
const out = new Int16Array(Math.ceil((endA + 0.5) * SR)), report = [], map = [];
let cursor = 0, worst = 0;
for (let i = 0; i < A.length; i++) {
  const a0 = A[i], a1 = i + 1 < A.length ? A[i + 1] : endA, b0 = B[i], b1 = i + 1 < B.length ? B[i + 1] : endB, len = b1 - b0;
  if (a1 - a0 <= 0.02 || len <= 0.02) continue;
  // A beat starts where its picture starts, or where the last beat's words ended if those ran over. Nothing is ever cut:
  // a line that is too long for its slot is sped up (more when we are already behind) and may spill into the next slot.
  const start = Math.max(a0, cursor), late = start - a0, room = Math.max(0.3, a1 - start), want = len / room;
  const f = Math.min(late > 0.35 ? 1.3 : 1.22, Math.max(0.9, want));
  const r = spawnSync("ffmpeg", ["-v", "error", "-ss", String(b0 * dT), "-t", String(len * dT), "-i", wavPath, "-af", `atempo=${(dT * f).toFixed(5)}`, "-ac", "1", "-ar", String(SR), "-f", "s16le", "-"], { maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr.toString());
  const pcm = new Int16Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.length / 2)), at = Math.round(start * SR), fade = Math.round(0.008 * SR), n = pcm.length;
  for (let k = 0; k < n && at + k < out.length; k++) { const g = Math.min(1, k / fade, (n - k) / fade); out[at + k] = Math.max(-32768, Math.min(32767, out[at + k] + Math.round(pcm[k] * g))); }
  cursor = start + len / f; map.push({ b0, b1, a0: start, f, late });
  if (late > worst) worst = late;
  if (late > 0.5) report.push(`beat ${i + 1} at ${a0.toFixed(1)}s starts ${late.toFixed(2)} s after its picture`);
}
const head = Buffer.alloc(44); head.write("RIFF", 0); head.writeUInt32LE(36 + out.length * 2, 4); head.write("WAVEfmt ", 8); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20); head.writeUInt16LE(1, 22);
head.writeUInt32LE(SR, 24); head.writeUInt32LE(SR * 2, 28); head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34); head.write("data", 36); head.writeUInt32LE(out.length * 2, 40);
fs.writeFileSync(outPath, Buffer.concat([head, Buffer.from(out.buffer, out.byteOffset, out.length * 2)]));
const fs_ = map.map((m) => m.f).sort((x, y) => x - y);
console.log(`${map.length} beats fitted; speed change median ${fs_[fs_.length >> 1].toFixed(2)}x, range ${fs_[0].toFixed(2)}x to ${fs_[fs_.length - 1].toFixed(2)}x; latest start ${worst.toFixed(2)} s behind its picture; ${report.length} beats more than half a second late; ends ${(cursor - endA).toFixed(2)} s ${cursor > endA ? "after" : "before"} the original voice`);
report.forEach((l) => console.log("  " + l));

if (srtOut) {          // the dub's own words, moved to the video's timing
  const lead = vid.lead ?? 0, at = (t) => { const m = map.find((x) => t >= x.b0 - 0.001 && t < x.b1) || map[map.length - 1]; return m.a0 + (t - m.b0) / m.f + lead; };
  const stamp = (t) => { const ms = Math.max(0, Math.round(t * 1000)); return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
  const ws = dW.words.map((w) => ({ s: at(w.start_ms / 1000 / dT), e: at(w.end_ms / 1000 / dT), t: w.text })), lines = []; let cur = [];
  ws.forEach((w, i) => { cur.push(w); const nx = ws[i + 1]; if (!nx || /[.!?:]$/.test(w.t) || cur.length >= 8 || nx.s - w.e > 0.6) { lines.push(cur); cur = []; } });
  fs.writeFileSync(srtOut, lines.map((l, i) => { const s = l[0].s, nx = lines[i + 1] ? lines[i + 1][0].s : Infinity, e = Math.min(Math.max(l[l.length - 1].e + 0.25, s + 0.9), nx - 0.04); return `${i + 1}\n${stamp(s)} --> ${stamp(e)}\n${l.map((w) => w.t).join(" ")}\n`; }).join("\n"));
  console.log(`wrote ${srtOut}: ${lines.length} lines`);
}
