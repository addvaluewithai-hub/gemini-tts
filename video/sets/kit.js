// Drawing kit for illustrated sets: full-frame scenes that carry the meaning of a line with no words on screen.
// Everything is a pure function of time and returns SVG text; nothing is kept between frames.
//
// How a set is built with it:
//   - one camera per shot, `camAt(t, keys)`, and every layer goes through `layer(inner, cam, depth)`, so far things
//     move less than near things and a zoom is a real change of scale (it is interpolated in log space);
//   - solid shapes with one shade step (`two`, `disc`) and glow as hard rings (`rings`), not blur;
//   - things arrive with weight: `spring` for a pop with one overshoot, `hop` for a drop that settles;
//   - a shot hands over to the next through a shape both of them have (`through`), not through a fade.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = (p) => { p = clamp(p); return p * p * (3 - 2 * p); };
export const easeOut = (p) => 1 - Math.pow(1 - clamp(p), 3);
export const easeIn = (p) => Math.pow(clamp(p), 3);
export const seg = (t, a, b) => clamp((t - a) / (b - a));                                            // 0..1 across [a, b]
export const spring = (a, k = 9, w = 16) => (a <= 0 ? 0 : 1 - Math.exp(-k * a) * Math.cos(w * a));     // 0 → 1 in `a` seconds, one overshoot
export const rnd = (n) => { let t = (n + 0x6D2B79F5) | 0; t = Math.imul(t ^ (t >>> 15), 1 | t); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const esc = (t) => String(t ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
// the value at time t of keys [[t, v], ...], eased between neighbours
export const kf = (t, keys, f = ease) => { if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], f((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1]; };
// a point on a quadratic curve from a over c to b
export const bez = (a, c, b, p) => [(1 - p) * (1 - p) * a[0] + 2 * (1 - p) * p * c[0] + p * p * b[0], (1 - p) * (1 - p) * a[1] + 2 * (1 - p) * p * c[1] + p * p * b[1]];

// ---- the frame: 1920 x 1080 for the episode, 1080 x 1920 for a Short (portrait shots, see README) ----
export let FW = 1920, FH = 1080;
export const setFrame = (w, h) => { FW = w; FH = h; };
export const portrait = () => FH > FW;

// ---- camera ----
// keys are [t, x, y, zoom]: the world point at the centre of the frame, and the scale
let VMOD = null;   // while a landscape shot is reframed for portrait: how its camera is moved (see makeSet)
export const camAt = (t, keys) => { const c = { x: kf(t, keys.map((k) => [k[0], k[1]])), y: kf(t, keys.map((k) => [k[0], k[2]])), z: Math.exp(kf(t, keys.map((k) => [k[0], Math.log(k[3])]))) }; return VMOD ? VMOD(c, t) : c; };
// a layer seen through the camera; depth 1 is the subject, smaller is further away (moves and scales less), larger is nearer
export const layer = (inner, c, d = 1) => { const cx = FW / 2, cy = FH / 2; return `<g transform="translate(${cx} ${cy}) scale(${Math.pow(c.z, d).toFixed(4)}) translate(${(-(cx + (c.x - cx) * d)).toFixed(2)} ${(-(cy + (c.y - cy) * d)).toFixed(2)})">${inner}</g>`; };
// where a world point lands on screen at depth 1
export const toScreen = (c, x, y) => [FW / 2 + (x - c.x) * c.z, FH / 2 + (y - c.y) * c.z];
// One shot handing over to the next through a shape: the frame grows out of (or shrinks back into) the point (fx, fy)
// while a flat colour, the colour of that shape, covers the last part. p = 0 is the plain frame, p = 1 is all colour.
export const through = (inner, fx, fy, p, colour, zmax = 16) => { if (p <= 0) return inner; const z = Math.exp(Math.log(zmax) * p), m = ease(p);
  return `<g transform="translate(${lerp(fx, FW / 2, m).toFixed(2)} ${lerp(fy, FH / 2, m).toFixed(2)}) scale(${z.toFixed(4)}) translate(${-fx} ${-fy})">${inner}</g><rect width="${FW}" height="${FH}" fill="${colour}" opacity="${seg(p, 0.55, 0.95).toFixed(3)}"/>`; };

// ---- shapes ----
let uid = 0;
export const begin = () => { uid = 0; };          // call once per frame, so ids repeat from frame to frame
export const rr = (x, y, w, h, r = 0) => (r <= 0 ? `M${x} ${y}h${w}v${h}h${-w}Z` : `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`);
export const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
// a solid shape with one shade step: the whole path in the shade colour, the base colour on a copy moved toward the light
export const two = (d, base, shade, dx = 10, dy = 8) => { const id = "k" + uid++;
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${shade}"/><g clip-path="url(#${id})"><path d="${d}" fill="${base}" transform="translate(${-dx} ${-dy})"/></g>`; };
export const disc = (x, y, r, base, shade, k = 0.16) => two(circ(x, y, r), base, shade, r * k, r * k);
// glow, flat: two hard rings
export const rings = (x, y, r, colour, o = 0.16, grow = 1.6) => `<circle cx="${x}" cy="${y}" r="${(r * grow).toFixed(1)}" fill="${colour}" opacity="${(o * 0.55).toFixed(3)}"/><circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${colour}" opacity="${o}"/>`;
export const text = (x, y, t, size, fill, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.anchor || "middle"}" font-family="Anton" font-size="${size}" fill="${fill}" ${o.opacity === undefined ? "" : `opacity="${o.opacity}"`} ${o.extra || ""}>${esc(t)}</text>`;
// a number set digit by digit, so a digit that flies in lands exactly where the finished number has it
export const digitX = (cx, n, i, size) => cx + (i - (n - 1) / 2) * size * 0.5;
export const number = (cx, y, str, size, fill) => [...String(str)].map((ch, i, all) => text(digitX(cx, all.length, i, size), y, ch, size, fill)).join("");
// a line that draws itself: p is how much of it is there
export const drawn = (d, p, stroke, width, extra = "") => (p <= 0 ? "" : `<path d="${d}" pathLength="1" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${clamp(p).toFixed(4)} 1" ${extra}/>`);
export const at = (x, y, inner, k = 1, rot = 0, extra = "") => `<g transform="translate(${(+x).toFixed(2)} ${(+y).toFixed(2)})${rot ? ` rotate(${(+rot).toFixed(2)})` : ""}${k !== 1 ? ` scale(${Array.isArray(k) ? k.map((v) => (+v).toFixed(4)).join(" ") : (+k).toFixed(4)})` : ""}" ${extra}>${inner}</g>`;
export const check = (x, y, r, colour, a) => (a <= 0 ? "" : at(x, y, `<circle r="${r}" fill="${colour}"/>${drawn(`M${-r * 0.45} ${r * 0.02}L${-r * 0.1} ${r * 0.36}L${r * 0.48} ${-r * 0.32}`, seg(a, 0.05, 0.25), "#fff", r * 0.24, 'stroke-linejoin="round"')}`, 0.4 + 0.6 * spring(a, 10, 18)));
export const cross = (x, y, r, colour, a) => (a <= 0 ? "" : at(x, y, `<circle r="${r}" fill="${colour}"/>${drawn(`M${-r * 0.38} ${-r * 0.38}L${r * 0.38} ${r * 0.38}`, seg(a, 0.03, 0.15), "#fff", r * 0.24)}${drawn(`M${r * 0.38} ${-r * 0.38}L${-r * 0.38} ${r * 0.38}`, seg(a, 0.12, 0.24), "#fff", r * 0.24)}`, 0.4 + 0.6 * spring(a, 10, 18)));

// ---- a set: shots in a row, one per step ----
// Runs shot `step` at `age`. When the board was already on screen in the beat before (total > age), the shot comes in
// through the shape the previous one left by: `s.ends[k]` is how long shot k ran (sets/beats.cjs writes it). Every shot returns { g, in, inC, inZ, out, outC, outZ }.
const OUT = 0.2, IN = 0.45;
export function play(SHOTS, s, step, age, total) {
  begin(); const ends = s.ends || []; const k = Math.min(step, SHOTS.length - 1), cont = k > 0 && total - age > 0.1 && ends && ends[k - 1]; let g;
  if (cont && age < OUT) { const prev = SHOTS[k - 1](ends[k - 1] + age, total, s); g = prev.out ? through(prev.g, prev.out[0], prev.out[1], age / OUT, prev.outC, prev.outZ || 16) : prev.g; }
  else { const cur = SHOTS[k](age, total, s); g = cont && cur.in && age < OUT + IN ? through(cur.g, cur.in[0], cur.in[1], 1 - easeOut((age - OUT) / IN), cur.inC, cur.inZ || 16) : cur.g; }
  return g;
}
// the frame every set is drawn in, with the two skies of the bank set
export const frame = (g, P) => `<svg viewBox="0 0 ${FW} ${FH}" width="${FW}" height="${FH}" data-frame="${FW}x${FH}" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0"><defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky0}"/><stop offset=".55" stop-color="${P.sky1}"/><stop offset="1" stop-color="${P.sky2}"/></linearGradient>
  <linearGradient id="bnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.night0}"/><stop offset="1" stop-color="${P.night1}"/></linearGradient><linearGradient id="bstorm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f3a"/><stop offset=".6" stop-color="#5a1f5e"/><stop offset="1" stop-color="#a8344f"/></linearGradient><clipPath id="bclip"><rect width="${FW}" height="${FH}"/></clipPath></defs><g clip-path="url(#bclip)">${g}</g></svg>`;

// ---- a set, in both frames ----
// makeSet(SHOTS, V, P): the board function of a set. In an episode it plays SHOTS at 1920 x 1080. In a Short (cfg.vertical)
// it draws 1080 x 1920: V[k] is either a portrait shot of its own (a function like the others, drawn for the tall frame) or
// { z, dx, dy, keys } to show landscape shot k through a moved camera (zoom times z, shifted by dx, dy; or `keys`, a function
// (camera, t) -> camera). A shot whose subject sits in the middle reframes well; one with things side by side needs its own.
// bg: [top, bottom], two flat colours behind a shot whose world ends above or below the tall frame (a room, a table)
const reframe = (fn, m = {}) => (a, tot, s) => { VMOD = m.keys || ((c) => ({ x: c.x + (m.dx || 0), y: c.y + (m.dy || 0), z: c.z * (m.z || 1) }));
  try { const r = fn(a, tot, s), bg = m.bg || ["#1a1240", "#1a1240"]; return { ...r, g: `<rect width="1080" height="960" fill="${bg[0]}"/><rect y="960" width="1080" height="960" fill="${bg[1]}"/>` + r.g }; } finally { VMOD = null; } };   // never let the studio show through
// { stack: true }: the landscape shot cut in two and stacked, its left part above its right part, each a 1080 x 960 panel
// at the episode's own scale (z multiplies it; dy moves the panels' cameras, one value or [top, bottom]; split moves the cut,
// 0.5 = the middle; or cx: [top, bottom], the x of the episode's frame each panel is centred on)
const stacked = (fn, m = {}) => (a, tot, s) => {
  const k = m.z || 1, H = 960, panels = [-1, 1].map((side) => { setFrame(1080, H);
    VMOD = (c) => { const z = c.z * k, half = (1920 / c.z - 1080 / z) / 2, sh = (m.split ?? 0.5) - 0.5; return { x: m.cx ? c.x + (m.cx[(side + 1) / 2] - 960) / c.z : c.x + side * half + sh * 1920 / c.z, y: c.y + (Array.isArray(m.dy) ? m.dy[(side + 1) / 2] : m.dy || 0), z }; };
    try { return fn(a, tot, s); } finally { VMOD = null; setFrame(1080, 1920); } });
  const seam = m.seam ?? "#0d0b33";
  const g = `<clipPath id="vtop"><rect width="1080" height="${H}"/></clipPath><clipPath id="vbot"><rect width="1080" height="${H}"/></clipPath><g clip-path="url(#vtop)">${panels[0].g}</g><g transform="translate(0 ${H})"><g clip-path="url(#vbot)">${panels[1].g}</g></g><rect y="${H - 6}" width="1080" height="12" fill="${seam}"/>`;
  const pick = (p, key) => (p[key] ? [p[key][0], p[key][1] + (p === panels[1] ? H : 0)] : null);
  return { g, in: pick(panels[0], "in") || pick(panels[1], "in"), inC: panels[0].inC || panels[1].inC, inZ: panels[0].inZ, out: pick(panels[1], "out") || pick(panels[0], "out"), outC: panels[1].outC || panels[0].outC, outZ: panels[1].outZ };
};
export const makeSet = (SHOTS, V, P) => (s, step, age, total, cfg = {}) => {
  if (!cfg.vertical) return frame(play(SHOTS, s, step, age, total), P);
  setFrame(1080, 1920);
  try { return frame(play(SHOTS.map((fn, i) => (typeof V[i] === "function" ? V[i] : V[i] && V[i].stack ? stacked(fn, V[i]) : reframe(fn, V[i]))), s, step, age, total), P); } finally { setFrame(1920, 1080); }
};
