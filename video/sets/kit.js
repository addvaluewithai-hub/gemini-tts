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

// ---- camera ----
// keys are [t, x, y, zoom]: the world point at the centre of the frame, and the scale
export const camAt = (t, keys) => ({ x: kf(t, keys.map((k) => [k[0], k[1]])), y: kf(t, keys.map((k) => [k[0], k[2]])), z: Math.exp(kf(t, keys.map((k) => [k[0], Math.log(k[3])]))) });
// a layer seen through the camera; depth 1 is the subject, smaller is further away (moves and scales less), larger is nearer
export const layer = (inner, c, d = 1) => `<g transform="translate(960 540) scale(${Math.pow(c.z, d).toFixed(4)}) translate(${(-(960 + (c.x - 960) * d)).toFixed(2)} ${(-(540 + (c.y - 540) * d)).toFixed(2)})">${inner}</g>`;
// where a world point lands on screen at depth 1
export const toScreen = (c, x, y) => [960 + (x - c.x) * c.z, 540 + (y - c.y) * c.z];
// One shot handing over to the next through a shape: the frame grows out of (or shrinks back into) the point (fx, fy)
// while a flat colour, the colour of that shape, covers the last part. p = 0 is the plain frame, p = 1 is all colour.
export const through = (inner, fx, fy, p, colour, zmax = 16) => { if (p <= 0) return inner; const z = Math.exp(Math.log(zmax) * p), m = ease(p);
  return `<g transform="translate(${lerp(fx, 960, m).toFixed(2)} ${lerp(fy, 540, m).toFixed(2)}) scale(${z.toFixed(4)}) translate(${-fx} ${-fy})">${inner}</g><rect width="1920" height="1080" fill="${colour}" opacity="${seg(p, 0.55, 0.95).toFixed(3)}"/>`; };

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
