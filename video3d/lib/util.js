// Small helpers shared by the 3D shots: seeded random, easing, curves, procedural textures.
import * as THREE from "three";

export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
export const easeIn = (t) => Math.pow(clamp(t), 3);
// 0..1 progress of t inside [a, b]
export const seg = (t, a, b) => clamp((t - a) / (b - a));
// A damped spring kick: how a thing settles after a jolt at time 0.
export const spring = (t, freq = 9, damp = 5) => (t < 0 ? 0 : Math.exp(-damp * t) * Math.sin(freq * t));

// Smooth 1D noise (value noise) for handheld camera shake and idle motion.
export function noise1(seed = 7) {
  const r = rng(seed); const v = Array.from({ length: 512 }, r);
  return (x) => {
    const i = Math.floor(x), f = x - i, a = v[((i % 512) + 512) % 512], b = v[(((i + 1) % 512) + 512) % 512];
    return lerp(a, b, f * f * (3 - 2 * f)) * 2 - 1;
  };
}

export function lathe(profile, segments = 48) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}

// A smooth lathe profile through control points (Catmull-Rom).
export function smoothProfile(points, n = 40) {
  const c = new THREE.SplineCurve(points.map(([r, y]) => new THREE.Vector2(r, y)));
  return c.getPoints(n).map((p) => [Math.max(0, p.x), p.y]);
}

export function canvasTexture(w, h, draw, { repeat = [1, 1], srgb = true } = {}) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function brickTexture({ seed = 3, base = "#5a2f27", mortar = "#2a1d1a", rows = 16, cols = 8 } = {}) {
  const r = rng(seed);
  return canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = mortar; g.fillRect(0, 0, w, h);
    const bh = h / rows, bw = w / cols;
    for (let y = 0; y < rows; y++) for (let x = -1; x < cols + 1; x++) {
      const off = (y % 2) * bw / 2, l = 0.75 + r() * 0.35;
      const c = new THREE.Color(base).multiplyScalar(l);
      g.fillStyle = `#${c.getHexString()}`;
      g.fillRect(x * bw + off + 2, y * bh + 2, bw - 4, bh - 4);
      g.fillStyle = `rgba(0,0,0,${r() * 0.25})`;
      g.fillRect(x * bw + off + 2, y * bh + bh * 0.6, bw - 4, bh * 0.4 - 2);
    }
  });
}

export function noiseTexture({ seed = 5, size = 256, lo = 0.2, hi = 0.8, blotches = 220 } = {}) {
  const r = rng(seed);
  return canvasTexture(size, size, (g, w, h) => {
    const v = Math.round(((lo + hi) / 2) * 255); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(0, 0, w, h);
    for (let i = 0; i < blotches; i++) {
      const x = r() * w, y = r() * h, rad = 4 + r() * 30, c = Math.round((lo + r() * (hi - lo)) * 255);
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `rgba(${c},${c},${c},0.9)`); gr.addColorStop(1, `rgba(${c},${c},${c},0)`);
      g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  }, { srgb: false });
}

export function windowsTexture({ seed = 9, lit = 0.45, cols = 6, rows = 10 } = {}) {
  const r = rng(seed);
  return canvasTexture(256, 512, (g, w, h) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
    const cw = w / cols, rh = h / rows;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (r() > lit) continue;
      const warm = r() > 0.25;
      g.fillStyle = warm ? `hsl(${30 + r() * 15},90%,${55 + r() * 20}%)` : `hsl(${190 + r() * 30},70%,${60 + r() * 15}%)`;
      g.fillRect(x * cw + cw * 0.2, y * rh + rh * 0.2, cw * 0.6, rh * 0.55);
    }
  });
}
