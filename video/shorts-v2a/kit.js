// Small animation kit for code-drawn Shorts: everything is a pure function of time, so any frame can be drawn alone.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const E = {
  lin: (x) => x,
  in2: (x) => x * x, out2: (x) => 1 - (1 - x) * (1 - x), io2: (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  in3: (x) => x * x * x, out3: (x) => 1 - Math.pow(1 - x, 3), io3: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out5: (x) => 1 - Math.pow(1 - x, 5), in5: (x) => Math.pow(x, 5),
  outBack: (x) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  outBackBig: (x) => 1 + 4.2 * Math.pow(x - 1, 3) + 3.2 * Math.pow(x - 1, 2),
  inBack: (x) => 2.70158 * x * x * x - 1.70158 * x * x,
  outElastic: (x) => (x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI / 3)) + 1),
  outBounce: (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; },
};
// a to b between t0 and t1
export const tw = (t, t0, t1, a, b, e = E.io3) => (t <= t0 ? a : t >= t1 ? b : a + (b - a) * e((t - t0) / (t1 - t0)));
// keyframes: [[time, value, ease into this key], ...]
export const kf = (t, keys) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e = E.io3] = keys[i]; return v0 + (v1 - v0) * e((t - t0) / (t1 - t0)); }
  return keys[keys.length - 1][1];
};
export const pop = (t, t0, d = 0.36) => (t < t0 ? 0 : t > t0 + d ? 1 : E.outBack((t - t0) / d));          // 0 to 1 with overshoot
export const unpop = (t, t0, d = 0.22) => (t < t0 ? 1 : t > t0 + d ? 0 : 1 - E.inBack((t - t0) / d));       // 1 to 0 with anticipation
export const wob = (t, t0, f = 4, z = 5, amp = 1) => (t < t0 ? 0 : amp * Math.exp(-z * (t - t0)) * Math.sin(2 * Math.PI * f * (t - t0)));   // decaying wobble
export const bump = (t, t0, d) => { const x = (t - t0) / d; return x <= 0 || x >= 1 ? 0 : Math.sin(Math.PI * x); };
export const on = (t, a, b) => t >= a && t < b;
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(rnd(i + seed * 57.3), rnd(i + 1 + seed * 57.3), u) * 2 - 1; };
export const n2 = (v) => (Math.round(v * 100) / 100).toString();
export const T = (x, y, r = 0, sx = 1, sy = sx) => `translate(${n2(x)} ${n2(y)})${r ? ` rotate(${n2(r)})` : ""}${sx !== 1 || sy !== 1 ? ` scale(${(+sx).toFixed(4)} ${(+sy).toFixed(4)})` : ""}`;
export const G = (tf, inner, extra = "") => `<g transform="${tf}"${extra ? " " + extra : ""}>${inner}</g>`;
// mix two parameter objects (numbers only; other values switch at half way)
export const mix = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[key], y = b[key]; o[key] = typeof x === "number" && typeof y === "number" ? x + (y - x) * k : typeof (x ?? y) === "number" ? ((x ?? 0) + ((y ?? 0) - (x ?? 0)) * k) : (k < 0.5 ? x ?? y : y ?? x); } return o; };
// a pose track: [[time, pose object, seconds to ease in, ease], ...] -> blended pose at t
export const poseAt = (t, track, defaults = {}) => {
  let cur = { ...defaults, ...track[0][1] };
  for (let i = 1; i < track.length; i++) { const [t0, p, d = 0.25, e = E.io3] = track[i]; if (t <= t0) break; const next = { ...cur, ...p }; cur = t >= t0 + d ? next : mix(cur, next, e((t - t0) / d)); }
  return cur;
};
// two-bone arm: returns the elbow for shoulder S, hand H, bone lengths a, b; dir picks the bend side
export const elbow = (S, H, a, b, dir = 1) => {
  let dx = H.x - S.x, dy = H.y - S.y, d = Math.hypot(dx, dy) || 1e-3; const max = a + b - 2;
  if (d > max) { H = { x: S.x + dx / d * max, y: S.y + dy / d * max }; dx = H.x - S.x; dy = H.y - S.y; d = max; }
  const k = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - k * k));
  return { E: { x: S.x + dx / d * k - dir * dy / d * h, y: S.y + dy / d * k + dir * dx / d * h }, H };
};
export const star = (r, r2 = r * 0.28, n = 4) => { let d = ""; for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2, q = i % 2 ? r2 : r; d += `${i ? "L" : "M"}${n2(Math.cos(a) * q)} ${n2(Math.sin(a) * q)}`; } return d + "Z"; };
