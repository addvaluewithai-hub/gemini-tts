// Small deterministic animation kit: every value is a pure function of time, so any frame can be drawn alone.
export const TAU = Math.PI * 2;
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, u) => a + (b - a) * u;
export const E = {
  lin: (u) => u,
  in2: (u) => u * u,
  out2: (u) => 1 - (1 - u) ** 2,
  in3: (u) => u * u * u,
  out3: (u) => 1 - (1 - u) ** 3,
  out5: (u) => 1 - (1 - u) ** 5,
  io2: (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2),
  io3: (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  back: (u) => 1 + 2.70158 * (u - 1) ** 3 + 1.70158 * (u - 1) ** 2,
  back2: (u) => 1 + 4.2 * (u - 1) ** 3 + 3.2 * (u - 1) ** 2,
  inBack: (u) => 2.70158 * u * u * u - 1.70158 * u * u,
  elastic: (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 2 ** (-10 * u) * Math.sin((u * 10 - 0.75) * (TAU / 3)) + 1),
  bounce: (u) => { const n = 7.5625, d = 2.75; if (u < 1 / d) return n * u * u; if (u < 2 / d) return n * (u -= 1.5 / d) * u + 0.75; if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + 0.9375; return n * (u -= 2.625 / d) * u + 0.984375; },
};
// eased progress 0..1 between two times
export const seg = (t, a, b, e = E.io3) => e(clamp((t - a) / (b - a)));
// eased progress starting at a, lasting d
export const tw = (t, a, d, e = E.io3) => e(clamp((t - a) / d));
// keyframes [[time, value, easeIntoThisKey]]
export function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1, e = E.io3] = keys[i]; return lerp(v0, v1, e((t - t0) / (t1 - t0))); }
  }
  return keys[keys.length - 1][1];
}
// a damped spring from 0 to 1 that starts at t0 (overshoots, then settles)
export const spring = (t, t0, f = 3.2, d = 6) => (t < t0 ? 0 : 1 - Math.exp(-d * (t - t0)) * Math.cos(TAU * f * (t - t0)));
// a decaying wobble around 0 that starts at t0 (for follow-through)
export const ring = (t, t0, f = 4, d = 5) => (t < t0 ? 0 : Math.exp(-d * (t - t0)) * Math.sin(TAU * f * (t - t0)));
// 0 -> 1 -> 0 hump
export const bump = (t, t0, d) => { const u = (t - t0) / d; return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u); };
// organic idle noise in -1..1
export const wob = (t, seed = 0, f = 1) => Math.sin(t * f * TAU + seed * 12.9898) * 0.6 + Math.sin(t * f * TAU * 1.71 + seed * 78.233) * 0.4;
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
// lid closure 0..1: a blink roughly every 2.6 to 4 s
export function blink(t, seed = 0) {
  const period = 3.3, k = Math.floor((t + seed * 1.7) / period), at = k * period - seed * 1.7 + 0.4 + rnd(k + seed * 31) * 1.6, u = (t - at) / 0.16;
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 0.6;
}
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (a, b, u) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(u))).toString(16).padStart(2, "0")).join(""); };
export const f1 = (n) => Math.round(n * 10) / 10;
// transform string: translate, rotate (deg), scale
export const tr = (x = 0, y = 0, r = 0, sx = 1, sy = sx) => `translate(${f1(x)} ${f1(y)})${r ? ` rotate(${f1(r)})` : ""}${sx !== 1 || sy !== 1 ? ` scale(${Math.round(sx * 1000) / 1000} ${Math.round(sy * 1000) / 1000})` : ""}`;
export const g = (transform, inner, extra = "") => `<g transform="${transform}" ${extra}>${inner}</g>`;
let uid = 0;
export const nextId = (p = "i") => p + (++uid);
export const resetIds = () => { uid = 0; };
// two-bone arm: shoulder S, hand H, lengths a and b, bend +1 or -1. Returns the elbow.
export function ik(sx, sy, hx, hy, a, b, bend = 1) {
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy) || 0.001; const max = a + b - 1;
  if (d > max) { hx = sx + (dx / d) * max; hy = sy + (dy / d) * max; dx = hx - sx; dy = hy - sy; d = max; }
  const u = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - u * u));
  return { ex: sx + (dx / d) * u - (dy / d) * h * bend, ey: sy + (dy / d) * u + (dx / d) * h * bend, hx, hy };
}
// a cloud: overlapping circles that share one fill. blobs: [[x, y, r]]
export const cloud = (blobs, fill, extra = "") => `<g fill="${fill}" ${extra}>${blobs.map(([x, y, r]) => (r > 0.5 ? `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>` : "")).join("")}</g>`;
// four-point sparkle
export const sparkle = (x, y, r, fill = "#fff", rot = 0, op = 1) => r <= 0.5 ? "" : `<path transform="${tr(x, y, rot)}" opacity="${f1(op)}" fill="${fill}" d="M0 ${-r} C ${r * 0.12} ${-r * 0.3} ${r * 0.3} ${-r * 0.12} ${r} 0 C ${r * 0.3} ${r * 0.12} ${r * 0.12} ${r * 0.3} 0 ${r} C ${-r * 0.12} ${r * 0.3} ${-r * 0.3} ${r * 0.12} ${-r} 0 C ${-r * 0.3} ${-r * 0.12} ${-r * 0.12} ${-r * 0.3} 0 ${-r} Z"/>`;
