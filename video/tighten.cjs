#!/usr/bin/env node
// Takes the dead air out of a voice track. Every silence longer than `max` seconds is cut down to `keep`
// seconds, and the transcript's word times are moved to match, so everything downstream (the storyboard
// alignment, captions, lip sync) works on the tightened audio as if it had been recorded that way.
//   node tighten.cjs <voice.wav> <transcript.json> <out.wav> <out.transcript.json> [--max 0.3] [--keep 0.2]
// The pauses between a script's turns are the long ones; a deliberate beat before a punchline survives as
// a short one.
const fs = require("fs");
const [wavIn, trIn, wavOut, trOut] = process.argv.slice(2);
const flag = (n, d) => { const i = process.argv.indexOf(n); return i < 0 ? d : Number(process.argv[i + 1]); };
if (!trOut) { console.error("usage: node tighten.cjs <voice.wav> <transcript.json> <out.wav> <out.transcript.json> [--max 0.3] [--keep 0.2]"); process.exit(2); }
const MAX = flag("--max", 0.3), KEEP = flag("--keep", 0.2);

const b = fs.readFileSync(wavIn); let p = 12, fmt = null, data = null;
while (p + 8 <= b.length) { const id = b.toString("ascii", p, p + 4), n = b.readUInt32LE(p + 4);
  if (id === "fmt ") fmt = { ch: b.readUInt16LE(p + 10), rate: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
  if (id === "data") { data = b.subarray(p + 8, Math.min(b.length, p + 8 + n)); break; }
  p += 8 + n + (n & 1); }
if (!fmt || !data || fmt.bits !== 16 || fmt.ch !== 1) throw new Error("expected 16-bit mono PCM WAV");
const pcm = new Int16Array(data.buffer, data.byteOffset, Math.floor(data.length / 2)), SR = fmt.rate;

// loudness in 10 ms frames; "silent" is well under the level of ordinary speech
const hop = Math.round(SR * 0.01), frames = Math.floor(pcm.length / hop), rms = new Float32Array(frames);
for (let f = 0; f < frames; f++) { let s = 0; for (let i = f * hop; i < (f + 1) * hop; i++) s += pcm[i] * pcm[i]; rms[f] = Math.sqrt(s / hop) / 32768; }
const sorted = [...rms].sort((x, y) => x - y), speech = sorted[Math.floor(frames * 0.9)], thr = Math.max(0.006, speech * 0.07);

// every silent run longer than MAX loses its middle
const cuts = []; let run = -1;
for (let f = 0; f <= frames; f++) { const quiet = f < frames && rms[f] < thr;
  if (quiet && run < 0) run = f;
  if (!quiet && run >= 0) { const len = (f - run) * 0.01, atStart = run === 0, atEnd = f === frames;
    if (len > MAX && !atEnd) { const keep = atStart ? 0.06 : KEEP, a = atStart ? 0 : run * 0.01 + keep / 2, z = f * 0.01 - keep / 2; if (z - a > 0.02) cuts.push({ a, z }); }
    run = -1; } }
const removedBefore = (t) => { let r = 0; for (const c of cuts) { if (t >= c.z) r += c.z - c.a; else if (t > c.a) r += t - c.a; } return r; };
const map = (t) => t - removedBefore(t);

// write the kept audio, with a 4 ms fade either side of each join so it does not click
const keepRanges = []; let at = 0; for (const c of cuts) { keepRanges.push([at, c.a]); at = c.z; } keepRanges.push([at, pcm.length / SR]);
const total = keepRanges.reduce((n, [a, z]) => n + Math.round(z * SR) - Math.round(a * SR), 0), out = new Int16Array(total), fade = Math.round(SR * 0.004); let w = 0;
keepRanges.forEach(([a, z], k) => { const i0 = Math.round(a * SR), i1 = Math.round(z * SR), n = i1 - i0;
  for (let i = 0; i < n; i++) { let g = 1; if (k > 0 && i < fade) g = i / fade; if (k < keepRanges.length - 1 && n - i <= fade) g = Math.min(g, (n - i) / fade); out[w++] = Math.round(pcm[i0 + i] * g); } });
const head = Buffer.alloc(44); head.write("RIFF", 0); head.writeUInt32LE(36 + out.length * 2, 4); head.write("WAVEfmt ", 8); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20); head.writeUInt16LE(1, 22);
head.writeUInt32LE(SR, 24); head.writeUInt32LE(SR * 2, 28); head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34); head.write("data", 36); head.writeUInt32LE(out.length * 2, 40);
fs.writeFileSync(wavOut, Buffer.concat([head, Buffer.from(out.buffer, out.byteOffset, out.length * 2)]));

const tr = JSON.parse(fs.readFileSync(trIn, "utf8"));
tr.words = tr.words.map((x) => ({ ...x, start_ms: Math.round(map(x.start_ms / 1000) * 1000), end_ms: Math.round(map(x.end_ms / 1000) * 1000) }));
tr.duration_ms = Math.round(out.length / SR * 1000); tr.tightened = { max: MAX, keep: KEEP, cuts: cuts.length, removed_ms: Math.round((pcm.length - out.length) / SR * 1000) };
fs.writeFileSync(trOut, JSON.stringify(tr) + "\n");
console.log(`${cuts.length} silences shortened, ${((pcm.length - out.length) / SR).toFixed(1)} s removed: ${(pcm.length / SR).toFixed(1)} s -> ${(out.length / SR).toFixed(1)} s`);
