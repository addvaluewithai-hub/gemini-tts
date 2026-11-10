// Sound design in code: every effect and the music bed are synthesised here, sample by sample, so an
// episode needs no audio files besides the voice. Deterministic.
//   const { effects, music, writeWav } = require("./sfx.cjs")
//   effects(events, seconds) -> Float32Array     events: [{ t, type, gain?, len? }], t in seconds
//   music(seconds, { bpm })  -> Float32Array
const fs = require("fs");
const SR = 48000, TAU = 2 * Math.PI;
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// A sound is a function of (seconds since it started, sample index) -> sample, plus a length.
function voice(len, fn) { const n = Math.ceil(len * SR), out = new Float32Array(n); for (let i = 0; i < n; i++) out[i] = fn(i / SR, i); return out; }
// Band-passed noise whose centre moves over time (a state-variable filter).
function sweep(len, seed, freq, q, env) {
  const R = rng(seed); let lo = 0, bp = 0;
  return voice(len, (t) => { const f = 2 * Math.sin(Math.PI * Math.min(0.24, freq(t / len) / SR)), x = R() * 2 - 1; lo += f * bp; const hi = x - lo - q * bp; bp += f * hi; return bp * env(t / len); });
}
const tone = (len, freq, env, shape = Math.sin) => { let ph = 0; return voice(len, (t) => { ph += TAU * freq(t) / SR; return shape(ph) * env(t); }); };
const mixin = (a, b, g = 1) => { for (let i = 0; i < Math.min(a.length, b.length); i++) a[i] += b[i] * g; return a; };
const tri = (p) => Math.sin(p) + 0.28 * Math.sin(3 * p) + 0.08 * Math.sin(5 * p);

const MAKE = {
  whoosh: () => sweep(0.34, 3, (p) => 350 + 2600 * Math.sin(Math.PI * p) ** 2, 0.9, (p) => 0.55 * Math.sin(Math.PI * p) ** 1.6),
  swipe: () => sweep(0.24, 5, (p) => 2600 + 2600 * p, 0.7, (p) => 0.2 * Math.sin(Math.PI * p)),
  shutter: () => { const R = rng(9); const click = (at, f) => (t) => t < at ? 0 : ((R() * 2 - 1) * Math.exp(-(t - at) * 260) * 0.5 + Math.sin(TAU * f * (t - at)) * Math.exp(-(t - at) * 120) * 0.35);
    const a = click(0, 2300), b = click(0.075, 1700); return voice(0.2, (t) => a(t) + b(t)); },
  impact: () => { const R = rng(11); let lp = 0; return voice(0.6, (t) => { lp += 0.2 * ((R() * 2 - 1) - lp); return Math.tanh(1.8 * (Math.sin(TAU * (38 * t + (110 / 18) * (1 - Math.exp(-18 * t)))) * Math.exp(-t * 6.5) + lp * 2.2 * Math.exp(-t * 34))) * 0.8; }); },
  thud: () => { const R = rng(13); let lp = 0; return voice(0.5, (t) => { lp += 0.35 * ((R() * 2 - 1) - lp); const rattle = t > 0.09 && t < 0.3 ? (R() * 2 - 1) * 0.25 * Math.exp(-(t - 0.09) * 22) : 0; return Math.tanh(2 * Math.sin(TAU * (55 * t + (70 / 22) * (1 - Math.exp(-22 * t)))) * Math.exp(-t * 11) + lp * 2 * Math.exp(-t * 50)) * 0.7 + rattle; }); },
  tick: () => tone(0.14, (t) => 50 + 60 * Math.exp(-t * 30), (t) => 0.5 * Math.exp(-t * 24)),
  pop: () => tone(0.09, (t) => 420 + 700 * (t / 0.09), (t) => 0.32 * Math.sin(Math.PI * Math.min(1, t / 0.09)) ** 0.7),
  ding: () => mixin(tone(0.8, () => 1174.7, (t) => 0.13 * Math.exp(-t * 6)), tone(0.8, () => 1760, (t) => 0.07 * Math.exp(-t * 8))),
  down: () => tone(0.34, (t) => 900 * Math.pow(0.27, t / 0.34) * (1 + 0.02 * Math.sin(TAU * 28 * t)), (t) => 0.22 * Math.sin(Math.PI * Math.min(1, t / 0.34)) ** 0.6),
  up: () => tone(0.22, (t) => 300 * Math.pow(3.3, t / 0.22), (t) => 0.22 * Math.sin(Math.PI * Math.min(1, t / 0.22)) ** 0.6),
  riser: (e) => { const len = e.len || 0.55; return mixin(sweep(len, 17, (p) => 300 + 4200 * p * p, 0.6, (p) => 0.32 * p * p), tone(len, (t) => 180 + 700 * (t / len) ** 2, (t) => 0.1 * (t / len) ** 2)); },
  drone: (e) => { const len = e.len || 3, saw = (p) => 2 * ((p / TAU) % 1) - 1; let a = 0, b = 0;
    return voice(len, (t) => { const fall = t > len - 0.3 ? 1 - 0.55 * (t - (len - 0.3)) / 0.3 : 1, f = 168 * fall; a += TAU * f / SR; b += TAU * f * 2.02 / SR;
      return (saw(a) * 0.5 + saw(b) * 0.3) * (0.75 + 0.25 * Math.sin(TAU * 31 * t)) * 0.075 * Math.min(1, t / 0.5) * Math.min(1, (len - t) / 0.06); }); },
};

function effects(events, seconds) {
  const out = new Float32Array(Math.ceil(seconds * SR)), cache = {};
  for (const e of events) {
    if (!MAKE[e.type]) throw new Error("unknown sound: " + e.type);
    const key = e.type + (e.len ? e.len.toFixed(3) : ""), buf = cache[key] || (cache[key] = MAKE[e.type](e)), at = Math.round(e.t * SR), g = e.gain ?? 1;
    for (let i = 0; i < buf.length; i++) { const j = at + i; if (j >= 0 && j < out.length) out[j] += buf[i] * g; }
  }
  return out;
}

// The bed: a dry little spy groove. Bass riff, kick, rim, hats and a vibraphone answer every other bar.
function music(seconds, { bpm = 104, end = seconds } = {}) {
  const out = new Float32Array(Math.ceil(seconds * SR)), beat = 60 / bpm, eighth = beat / 2, R = rng(31);
  const put = (t, buf, g = 1) => { const at = Math.round(t * SR); for (let i = 0; i < buf.length; i++) { const j = at + i; if (j >= 0 && j < out.length) out[j] += buf[i] * g; } };
  const hz = (semi) => 82.41 * Math.pow(2, semi / 12);                 // semitones above E2
  const bass = (semi, len) => tone(len, () => hz(semi), (t) => 0.5 * Math.min(1, t / 0.006) * Math.exp(-t * 4.2) * Math.min(1, (len - t) / 0.02), tri);
  const kick = tone(0.22, (t) => 46 + 90 * Math.exp(-t * 38), (t) => 0.7 * Math.exp(-t * 15));
  const hat = (() => { const Rh = rng(41); let prev = 0; return voice(0.05, (t) => { const x = Rh() * 2 - 1, y = x - prev; prev = x; return y * 0.11 * Math.exp(-t * 95); }); })();
  const rim = mixin(sweep(0.09, 43, () => 1900, 0.5, (p) => 0.34 * Math.exp(-p * 7)), tone(0.09, () => 330, (t) => 0.16 * Math.exp(-t * 60)));
  const vibe = (semi) => tone(1.5, () => hz(semi + 24), (t) => 0.1 * Math.min(1, t / 0.004) * Math.exp(-t * 2.8) * (0.8 + 0.2 * Math.sin(TAU * 5.5 * t)));
  // two-bar riff in eighths: semitones above E2, null = rest
  const RIFF = [[0, null, 0, 3, null, 5, null, 6], [7, null, 7, 10, null, 7, 5, 3], [0, null, 0, 3, null, 5, null, 6], [7, null, 5, null, 3, null, 2, null]];
  const bars = Math.ceil(end / (4 * beat));
  for (let b = 0; b < bars; b++) {
    const t0 = b * 4 * beat, riff = RIFF[b % RIFF.length];
    riff.forEach((n, k) => { if (n !== null && t0 + k * eighth < end - 0.3) put(t0 + k * eighth, bass(n, eighth * 1.6), 1); });
    for (let k = 0; k < 8; k++) { const t = t0 + k * eighth + (k % 2 ? 0.012 : 0); if (t < end - 0.2) put(t, hat, k % 2 ? 1 : 0.55 + 0.2 * R()); }
    for (const k of [0, 2.5]) if (t0 + k * beat < end - 0.3) put(t0 + k * beat, kick, 0.9);
    for (const k of [1, 3]) if (t0 + k * beat < end - 0.3) put(t0 + k * beat, rim, 0.8);
    if (b % 2 === 1 && t0 + 2.5 * beat < end - 1) for (const [n, d] of [[7, 0], [10, 0.02], [14, 0.04]]) put(t0 + 2.5 * beat + d, vibe(n), 1);
  }
  for (const [n, d] of [[0, 0], [7, 0.03], [10, 0.06], [14, 0.09]]) put(end - 0.15 + d, vibe(n), 1.5);     // a last chord to land on
  put(end - 0.15, bass(0, 1.4), 1.2);
  for (let i = 0; i < out.length; i++) out[i] *= 0.5;                  // headroom: the bed never clips on its own
  return out;
}

function writeWav(file, samples, gain = 1) {
  const b = Buffer.alloc(44 + samples.length * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + samples.length * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * gain)) * 32767), 44 + i * 2);
  fs.writeFileSync(file, b);
}

module.exports = { effects, music, writeWav, SR };
