// The 2.5D film kit: a multiplane camera with depth of field, lights, weather and film finish, all as SVG text.
// A frame is a pure function of time. Build it with frame(() => [...layers]) so filters are declared once.
export const W = 1080, H = 1920;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = (p) => { p = clamp(p); return p * p * (3 - 2 * p); };
export const easeOut = (p) => 1 - Math.pow(1 - clamp(p), 3);
export const easeIn = (p) => Math.pow(clamp(p), 3);
export const easeOutBack = (p) => { p = clamp(p); const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const pulse = (t, a, b, edge = 0.1) => Math.min(seg(t, a, a + edge), 1 - seg(t, b - edge, b));
export const spring = (a, k = 7, w = 18) => (a <= 0 ? 0 : Math.exp(-k * a) * Math.sin(w * a));        // a decaying wobble after a jolt
export const rnd = (n) => { let t = (n + 0x6D2B79F5) | 0; t = Math.imul(t ^ (t >>> 15), 1 | t); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, a = rnd(i * 7919 + seed * 104729), b = rnd((i + 1) * 7919 + seed * 104729); return lerp(a, b, f * f * (3 - 2 * f)) * 2 - 1; };
export const kf = (t, keys, f = ease) => { if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], f((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1]; };
export const mix = (a, b, p) => { const out = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[k], y = b[k];
  out[k] = typeof x === "number" && typeof y === "number" ? lerp(x, y, p) : (p < 0.5 ? (x ?? y) : (y ?? x)); } return out; };

// ---- per-frame filter registry
let DEFS = new Map();
const def = (id, text) => { if (!DEFS.has(id)) DEFS.set(id, text); return id; };
export function frame(build, { bg = "#000" } = {}) {
  DEFS = new Map();
  const body = build();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${[...DEFS.values()].join("")}</defs><rect width="${W}" height="${H}" fill="${bg}"/>${Array.isArray(body) ? body.join("") : body}</svg>`;
}
export const blurId = (sx, sy = sx) => { sx = Math.round(sx * 2) / 2; sy = Math.round(sy * 2) / 2; if (sx <= 0 && sy <= 0) return null;
  return def(`bl${sx}_${sy}`.replace(/\./g, "p"), `<filter id="${`bl${sx}_${sy}`.replace(/\./g, "p")}" filterUnits="userSpaceOnUse" x="-80" y="-80" width="${W + 160}" height="${H + 160}"><feGaussianBlur stdDeviation="${sx} ${sy}"/></filter>`); };
export const blurred = (inner, sx, sy = sx) => { const id = blurId(sx, sy); return id ? `<g filter="url(#${id})">${inner}</g>` : inner; };

// ---- camera
// cam = { x, y, z, rot }: the world point at the centre of the frame, the zoom, the roll in degrees.
// depth 1 is the subject plane; smaller is further (moves and scales less), larger is nearer.
export const camera = (t, keys, f = ease) => ({ x: kf(t, keys.map((k) => [k[0], k[1]]), f), y: kf(t, keys.map((k) => [k[0], k[2]]), f),
  z: Math.exp(kf(t, keys.map((k) => [k[0], Math.log(k[3])]), f)), rot: kf(t, keys.map((k) => [k[0], k[4] ?? 0]), f) });
export const shake = (c, t, amp, seed = 1, freq = 9) => ({ ...c, x: c.x + noise(t * freq, seed) * amp / c.z, y: c.y + noise(t * freq, seed + 5) * amp / c.z, rot: (c.rot || 0) + noise(t * freq * 0.7, seed + 9) * amp * 0.012 });
// focus: the depth that is sharp; dof: blur in px per unit of depth away from it
export const layer = (inner, c, d = 1, { focus = 1, dof = 0, blur = 0 } = {}) => {
  const z = Math.pow(c.z, d), cx = W / 2, cy = H / 2;
  const g = `<g transform="translate(${cx} ${cy}) rotate(${(-(c.rot || 0)).toFixed(3)}) scale(${z.toFixed(4)}) translate(${(-(cx + (c.x - cx) * d)).toFixed(2)} ${(-(cy + (c.y - cy) * d)).toFixed(2)})">${inner}</g>`;
  return blurred(g, blur + dof * Math.abs(d - focus));
};
export const toScreen = (c, x, y, d = 1) => { const z = Math.pow(c.z, d), a = -(c.rot || 0) * Math.PI / 180, dx = (x - (W / 2 + (c.x - W / 2) * d)) * z, dy = (y - (H / 2 + (c.y - H / 2) * d)) * z;
  return [W / 2 + dx * Math.cos(a) - dy * Math.sin(a), H / 2 + dx * Math.sin(a) + dy * Math.cos(a)]; };

// ---- light on a drawn figure
// A filter for a whole character: the picture is tinted by the ambient colour (night), then light is added along the
// edges that face each lamp (the alpha is blurred into a soft bump and lit, so the rim follows the silhouette).
//   lights: [{ color, az (degrees, 0 = from the right, 90 = from below, 270 = from above), el, power, size }]
export function litFilter(id, { ambient = [0.55, 0.6, 0.9], lights = [], bright = 0 } = {}) {
  const [r, g, b] = ambient, add = bright;
  let prims = `<feColorMatrix in="SourceGraphic" type="matrix" values="${r} 0 0 0 ${add}  0 ${g} 0 0 ${add}  0 0 ${b} 0 ${add}  0 0 0 1 0" result="base"/>`;
  let last = "base";
  lights.forEach((L, i) => {
    prims += `<feGaussianBlur in="SourceAlpha" stdDeviation="${L.size ?? 12}" result="bump${i}"/>
      <feSpecularLighting in="bump${i}" surfaceScale="${L.height ?? 10}" specularConstant="${L.power ?? 1}" specularExponent="${L.sharp ?? 30}" lighting-color="${L.color}" result="sp${i}"><feDistantLight azimuth="${L.az}" elevation="${L.el ?? 12}"/></feSpecularLighting>
      <feComposite in="sp${i}" in2="SourceAlpha" operator="in" result="spi${i}"/>
      <feComposite in="${last}" in2="spi${i}" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit${i}"/>`;
    last = `lit${i}`;
  });
  return def(id, `<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">${prims}</filter>`);
}
// The figure as a flat shadow (for a cast shadow on the ground or a wall).
export const shadowFilter = (id = "shadowf", color = "#03040c", blur = 6) => def(id, `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix type="matrix" values="0 0 0 0 0.012  0 0 0 0 0.016  0 0 0 0 0.047  0 0 0 1 0"/><feGaussianBlur stdDeviation="${blur}"/></filter>`);

// A beam of light: from (x, y) toward angle a (degrees), `len` long, `spread` degrees wide.
export function beam(x, y, a, len, spread, color = "#fff6dc", o = 0.5, soft = 14) {
  const id = def(`beam${color.replace("#", "")}`, `<radialGradient id="beam${color.replace("#", "")}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1"><stop offset="0" stop-color="${color}" stop-opacity="1"/><stop offset=".6" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
  const h = Math.tan(spread * Math.PI / 360) * len;
  return blurred(`<g transform="translate(${x} ${y}) rotate(${a}) scale(${len})" style="mix-blend-mode:screen" opacity="${o}"><path d="M0 -0.01 L1 ${-h / len} A1 1 0 0 1 1 ${h / len} L0 0.01 Z" fill="url(#${id})"/></g>`, soft);
}
export const glow = (x, y, r, color, o = 0.6) => { const id = def(`glow${color.replace("#", "")}`, `<radialGradient id="glow${color.replace("#", "")}"><stop offset="0" stop-color="${color}" stop-opacity="1"/><stop offset=".35" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})" opacity="${o}" style="mix-blend-mode:screen"/>`; };

// ---- weather
// Rain in screen space: streaks that fall along `angle` (degrees from vertical). `time` is world time, so slow motion
// slows the drops; `streak` shortens them when time is slow.
export function rain(time, { n = 140, speed = 2600, angle = 8, len = 90, o = 0.35, seed = 1, width = 2.2, color = "#bcd6ff" } = {}) {
  const a = angle * Math.PI / 180, dx = Math.sin(a), dy = Math.cos(a), span = H + 400;
  let d = "";
  for (let i = 0; i < n; i++) {
    const sp = speed * (0.7 + 0.6 * rnd(i * 3 + seed)), l = len * (0.6 + 0.8 * rnd(i * 5 + seed));
    const y = ((rnd(i * 11 + seed) * span + time * sp) % span) - 200, x = rnd(i * 17 + seed) * (W + 500) - 250 + dx * y;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}l${(dx * l).toFixed(1)} ${(dy * l).toFixed(1)}`;
  }
  return `<path d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none" opacity="${o}"/>`;
}
export function fog(time, { y = 1300, h = 500, color = "#6f7fc0", o = 0.25, seed = 3 } = {}) {
  const id = def(`fog${seed}`, `<linearGradient id="fog${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset=".5" stop-color="${color}" stop-opacity="1"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`);
  let s = "";
  for (let i = 0; i < 4; i++) { const x = ((rnd(i + seed) * 2400 + time * (20 + 25 * rnd(i * 3 + seed))) % 2600) - 900;
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y + (rnd(i * 7 + seed) - 0.5) * h * 0.6}" rx="${700 + 400 * rnd(i * 9 + seed)}" ry="${h * 0.35}" fill="url(#fog${seed})" opacity="${o}"/>`; }
  return s;
}
export function speedLines(time, { n = 26, angle = 0, o = 0.5, seed = 2, color = "#ffffff", len = 500, speed = 5200 } = {}) {
  const a = angle * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a); let d = "";
  for (let i = 0; i < n; i++) { const off = (rnd(i * 13 + seed) - 0.5) * 2400, travel = ((rnd(i * 7 + seed) * 3000 + time * speed * (0.6 + 0.8 * rnd(i + seed))) % 3400) - 1700, l = len * (0.4 + rnd(i * 3 + seed));
    const x = W / 2 + ux * travel - uy * off, y = H / 2 + uy * travel + ux * off; d += `M${x.toFixed(0)} ${y.toFixed(0)}l${(ux * l).toFixed(0)} ${(uy * l).toFixed(0)}`; }
  return `<path d="${d}" stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none" opacity="${o}"/>`;
}
export function impact(x, y, p, { n = 22, color = "#fff", seed = 4 } = {}) {       // radial burst, p 0..1
  if (p <= 0 || p >= 1) return ""; let d = "";
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd(i + seed), r0 = 120 + 900 * easeOut(p) * (0.5 + rnd(i * 3 + seed)), r1 = r0 + 260 * (1 - p) * (0.5 + rnd(i * 5 + seed));
    d += `M${(x + Math.cos(a) * r0).toFixed(0)} ${(y + Math.sin(a) * r0).toFixed(0)}L${(x + Math.cos(a) * r1).toFixed(0)} ${(y + Math.sin(a) * r1).toFixed(0)}`; }
  return `<path d="${d}" stroke="${color}" stroke-width="${10 * (1 - p)}" stroke-linecap="round" fill="none" opacity="${1 - p}"/>`;
}

// ---- finish
export const vignette = (o = 0.6) => { def("vig", `<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#01020a" stop-opacity="1"/></radialGradient>`); return `<rect width="${W}" height="${H}" fill="url(#vig)" opacity="${o}"/>`; };
export const tint = (color, o, mode = "soft-light") => (o <= 0 ? "" : `<rect width="${W}" height="${H}" fill="${color}" opacity="${o}" style="mix-blend-mode:${mode}"/>`);
export const flash = (o, color = "#fff") => (o <= 0.003 ? "" : `<rect width="${W}" height="${H}" fill="${color}" opacity="${clamp(o).toFixed(3)}"/>`);
export const grain = (t, o = 0.12) => { const s = Math.floor(t * 30) % 97; def("grain", `<filter id="grain" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${s}"/><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/></filter>`);
  return `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${o}" style="mix-blend-mode:overlay"/>`; };
export const bars = (p, h = 150) => (p <= 0 ? "" : `<rect width="${W}" height="${h * p}" fill="#000"/><rect y="${H - h * p}" width="${W}" height="${h * p}" fill="#000"/>`);
