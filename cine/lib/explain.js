// Things for the report pictures, drawn in the same soft, lit style as Peek: a deep-space board, objects with
// gradients and highlights, glowing pull arrows, and word-timed captions.
import { def, rnd, clamp, lerp, W, H, easeOut, seg } from "./fx.js";

const G = (id, stops, attrs = 'cx=".36" cy=".3" r=".8"') => def(id, `<radialGradient id="${id}" ${attrs}>${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? "" : ` stop-opacity="${a}"`}/>`).join("")}</radialGradient>`);
const at = (x, y, k, rot, inner) => `<g transform="translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) rotate(${(+rot || 0).toFixed(2)}) scale(${Array.isArray(k) ? k.map((v) => (+v).toFixed(3)).join(" ") : (+k).toFixed(3)})">${inner}</g>`;

let STARS = null;
export function board(t, tone = "#1c2250") {
  G("boardg", [[0, tone], [1, "#080a20"]], 'cx=".5" cy=".4" r=".85"');
  STARS ??= Array.from({ length: 120 }, (_, i) => [rnd(i * 3) * W, rnd(i * 7) * H, 0.8 + rnd(i * 11) * 2.4, 0.2 + rnd(i * 13) * 0.6, rnd(i * 17) * 6.28]);
  return `<rect width="${W}" height="${H}" fill="url(#boardg)"/>${STARS.map(([x, y, r, o, p]) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(o * (0.6 + 0.4 * Math.sin(t * 2 + p))).toFixed(2)}"/>`).join("")}`;
}
const soft = (x, y, rx, ry, o = 0.35) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#03040c" opacity="${o}"/>`;

export const apple = (x, y, r = 60, rot = 0) => { G("appleg", [[0, "#ff8a7a"], [0.45, "#e5333f"], [1, "#7a0f1c"]]);
  return at(x, y, r / 60, rot, `<path d="M0 -44 C-34 -70 -70 -36 -62 12 C-56 52 -24 66 0 54 C24 66 56 52 62 12 C70 -36 34 -70 0 -44 Z" fill="url(#appleg)"/>
    <path d="M0 -46 C2 -62 8 -72 18 -78" fill="none" stroke="#5a3a1a" stroke-width="7" stroke-linecap="round"/><path d="M14 -72 C34 -92 58 -84 62 -68 C44 -58 26 -60 14 -72 Z" fill="#5cc24a"/>
    <ellipse cx="-28" cy="-14" rx="12" ry="20" fill="#fff" opacity=".35" transform="rotate(-24 -28 -14)"/>`); };
export const cup = (x, y, r = 60, rot = 0) => { G("cupg", [[0, "#ffffff"], [0.5, "#e9e2d0"], [1, "#9c937c"]]);
  return at(x, y, r / 60, rot, `<path d="M40 -22 C84 -26 86 30 38 30" fill="none" stroke="#cfc6ae" stroke-width="13" stroke-linecap="round"/>
    <path d="M-48 -44 H48 L40 40 C38 54 -38 54 -40 40 Z" fill="url(#cupg)"/><ellipse cx="0" cy="-44" rx="48" ry="12" fill="#5a3a22"/><ellipse cx="0" cy="-45" rx="48" ry="11" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <rect x="-34" y="-20" width="12" height="46" rx="6" fill="#fff" opacity=".5"/>`); };
export const rock = (x, y, r = 60, rot = 0) => { G("rockg", [[0, "#c9cede"], [0.5, "#7d86a6"], [1, "#333a58"]]);
  return at(x, y, r / 60, rot, `<path d="M-52 -18 L-22 -56 L28 -58 L60 -22 L54 28 L18 58 L-34 52 L-62 16 Z" fill="url(#rockg)" stroke-linejoin="round"/>
    <path d="M-22 -56 L-6 -18 L28 -58 M-6 -18 L-34 52 M-6 -18 L54 28" stroke="#2a3050" stroke-width="3" opacity=".35" fill="none"/><ellipse cx="-22" cy="-30" rx="14" ry="8" fill="#fff" opacity=".3"/>`); };
export const phone = (x, y, r = 60, rot = 0, crack = 0) => { G("phoneg", [[0, "#7fd4ff"], [1, "#2a3fa8"]], 'cx=".3" cy=".2" r="1"');
  return at(x, y, r / 60, rot, `<rect x="-36" y="-66" width="72" height="132" rx="14" fill="#11131f"/><rect x="-30" y="-58" width="60" height="116" rx="8" fill="url(#phoneg)"/>
    <rect x="-22" y="-50" width="16" height="50" rx="6" fill="#fff" opacity=".25"/>${crack > 0 ? `<path d="M-6 -20 L10 4 L-2 22 L18 50 M10 4 L28 -6 M-2 22 L-26 30 M-6 -20 L-24 -40" stroke="#fff" stroke-width="3" fill="none" opacity="${crack}"/>` : ""}`); };
// the planet: oceans, continents that turn, a soft night side and an air glow
export function earth(x, y, r, turn = 0, face = null) {
  G("earthg", [[0, "#6fd6ff"], [0.5, "#1f96e8"], [1, "#0a3f86"]]); G("earthsh", [[0.55, "#000", 0], [1, "#02061c", 0.75]], 'cx=".34" cy=".3" r=".9"');
  G("airg", [[0.78, "#7fd4ff", 0], [0.9, "#7fd4ff", 0.5], [1, "#7fd4ff", 0]], 'cx=".5" cy=".5" r=".5"');
  const id = def(`earthc${Math.round(r)}`, `<clipPath id="earthc${Math.round(r)}"><circle r="${r}"/></clipPath>`);
  const land = [[-0.5, -0.35, 0.34, 0.26], [0.15, -0.5, 0.22, 0.16], [0.35, 0.1, 0.36, 0.3], [-0.35, 0.4, 0.26, 0.2], [0.95, -0.2, 0.3, 0.34], [-1.1, 0.05, 0.3, 0.26], [1.5, 0.35, 0.28, 0.2]];
  const sh = (((turn % 2.6) + 2.6) % 2.6);
  return at(x, y, 1, 0, `<circle r="${r * 1.14}" fill="url(#airg)"/><circle r="${r}" fill="url(#earthg)"/>
    <g clip-path="url(#${id})">${[-2.6, 0].map((o) => land.map(([a, b, c, d2]) => `<ellipse cx="${((a + sh + o) * r).toFixed(1)}" cy="${(b * r).toFixed(1)}" rx="${(c * r).toFixed(1)}" ry="${(d2 * r).toFixed(1)}" fill="#5fd27a"/><ellipse cx="${((a + sh + o + 0.05) * r).toFixed(1)}" cy="${((b + 0.04) * r).toFixed(1)}" rx="${(c * 0.6 * r).toFixed(1)}" ry="${(d2 * 0.55 * r).toFixed(1)}" fill="#3aa85e"/>`).join("")).join("")}
    <ellipse cx="${-0.2 * r}" cy="${-0.62 * r}" rx="${0.5 * r}" ry="${0.1 * r}" fill="#fff" opacity=".35"/><ellipse cx="${0.3 * r}" cy="${0.55 * r}" rx="${0.4 * r}" ry="${0.07 * r}" fill="#fff" opacity=".3"/></g>
    <circle r="${r}" fill="url(#earthsh)"/>${face ? earthFace(r, face) : ""}`);
}
const earthFace = (r, f) => `<g opacity="${f.o ?? 1}"><ellipse cx="${-0.3 * r}" cy="${-0.1 * r}" rx="${0.11 * r}" ry="${0.11 * r * (1 - (f.lid ?? 0.5))}" fill="#fff"/><ellipse cx="${0.3 * r}" cy="${-0.1 * r}" rx="${0.11 * r}" ry="${0.11 * r * (1 - (f.lid ?? 0.5))}" fill="#fff"/>
  <circle cx="${-0.3 * r + (f.look ?? 0) * 0.04 * r}" cy="${-0.09 * r}" r="${0.05 * r * (1 - (f.lid ?? 0.5) * 0.6)}" fill="#0a1030"/><circle cx="${0.3 * r + (f.look ?? 0) * 0.04 * r}" cy="${-0.09 * r}" r="${0.05 * r * (1 - (f.lid ?? 0.5) * 0.6)}" fill="#0a1030"/>
  <path d="M${-0.44 * r} ${-0.2 * r} H${-0.16 * r} M${0.16 * r} ${-0.2 * r} H${0.44 * r}" stroke="#0a3f86" stroke-width="${0.035 * r}" stroke-linecap="round"/>
  <path d="M${-0.14 * r} ${0.2 * r} H${0.14 * r}" stroke="#0a1030" stroke-width="${0.03 * r}" stroke-linecap="round"/></g>`;
export function moon(x, y, r) { G("moong2", [[0, "#fffdf0"], [0.7, "#f3ecd2"], [1, "#b9b196"]], 'cx=".4" cy=".36" r=".75"'); G("moonglow2", [[0, "#cfe0ff", 0.5], [1, "#9fb8ff", 0]], "");
  return at(x, y, 1, 0, `<circle r="${r * 2.2}" fill="url(#moonglow2)"/><circle r="${r}" fill="url(#moong2)"/>${[[-0.35, -0.2, 0.2], [0.3, 0.28, 0.26], [0.1, -0.45, 0.12], [-0.42, 0.38, 0.14], [0.5, -0.15, 0.1]].map(([a, b, c]) => `<circle cx="${a * r}" cy="${b * r}" r="${c * r}" fill="#b9b196" opacity=".4"/>`).join("")}`); }
// a human, as a friendly sign-like figure. arms / legs: angles in degrees; mood: "ok" | "shock"
export function human(x, y, k = 1, { color = "#ffd27a", armL = 20, armR = -20, bend = 0, mood = "ok", jumpStretch = 0 } = {}) {
  G(`hum${color.replace("#", "")}`, [[0, "#fff6d8"], [0.5, color], [1, "#b9812a"]]);
  const f = `url(#hum${color.replace("#", "")})`;
  const face = mood === "shock" ? `<circle cx="-13" cy="-246" r="7" fill="#3a2a10"/><circle cx="13" cy="-246" r="7" fill="#3a2a10"/><ellipse cx="0" cy="-222" rx="9" ry="12" fill="#3a2a10"/>` : `<circle cx="-13" cy="-244" r="5" fill="#3a2a10"/><circle cx="13" cy="-244" r="5" fill="#3a2a10"/><path d="M-10 -226 Q0 -218 10 -226" stroke="#3a2a10" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return at(x, y, [k, k * (1 + jumpStretch)], 0, `<path d="M-22 -96 L-28 ${-6 + bend * 0} " stroke="${color}" stroke-width="26" stroke-linecap="round"/><path d="M22 -96 L28 -6" stroke="${color}" stroke-width="26" stroke-linecap="round"/>
    <g transform="rotate(${armL} -40 -186)"><path d="M-40 -186 L-46 -96" stroke="${color}" stroke-width="22" stroke-linecap="round"/></g><g transform="rotate(${armR} 40 -186)"><path d="M40 -186 L46 -96" stroke="${color}" stroke-width="22" stroke-linecap="round"/></g>
    <rect x="-46" y="-200" width="92" height="120" rx="36" fill="${f}"/><circle cx="0" cy="-240" r="38" fill="${f}"/>${face}`);
}
// a glowing arrow from a to b; `w` is its weight; dashes run along it with time
export function arrow(x1, y1, x2, y2, w = 14, color = "#ffe66d", t = 0, o = 1) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hx = x2 - ux * w * 2.2, hy = y2 - uy * w * 2.2;
  if (L < w * 2.4 || o <= 0) return "";
  return `<g opacity="${o}"><path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="${color}" stroke-width="${w * 2.2}" stroke-linecap="round" opacity=".18"/>
    <path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${w * 2.4} ${w * 1.6}" stroke-dashoffset="${(-t * w * 9).toFixed(1)}"/>
    <path d="M${x2.toFixed(1)} ${y2.toFixed(1)} L${(hx - uy * w * 1.5).toFixed(1)} ${(hy + ux * w * 1.5).toFixed(1)} L${(hx + uy * w * 1.5).toFixed(1)} ${(hy - ux * w * 1.5).toFixed(1)} Z" fill="${color}"/></g>`;
}
export const label = (x, y, text, size = 64, fill = "#fff", o = 1, k = 1) => (o <= 0 ? "" : `<text x="${x}" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" letter-spacing="2" fill="${fill}" opacity="${o}" stroke="#080a20" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke" transform="translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})">${text}</text>`);

// ---- captions: up to three words at a time, the spoken word in yellow
export function captions(words, t, { y = 1340, size = 92 } = {}) {
  if (!words || !words.length) return "";
  if (!words.groups) { const groups = []; let g = [];
    const chars = (q) => q.reduce((n, w) => n + w.w.length + 1, 0);      // a line must fit the frame: about 22 characters
    words.forEach((w, i) => { g.push(w); const nxt = words[i + 1]; if (g.length >= 3 || /[.,?!:]$/.test(w.w) || !nxt || nxt.t - w.e > 0.45 || nxt.line !== w.line || chars(g) + nxt.w.length > 22) { groups.push(g); g = []; } });
    words.groups = groups; }
  const g = words.groups.find((q) => t >= q[0].t - 0.04 && t < Math.max(q[q.length - 1].e + 0.25, q[q.length - 1].t + 0.5) && true);
  if (!g) return ""; const nextG = words.groups[words.groups.indexOf(g) + 1]; if (nextG && t >= nextG[0].t - 0.04) return "";
  const pop = 1 + 0.12 * (1 - easeOut(seg(t, g[0].t - 0.04, g[0].t + 0.12)));
  const spans = g.map((w) => `<tspan fill="${t >= w.t - 0.03 && t < w.e + 0.06 ? "#ffe66d" : "#ffffff"}">${w.w.toUpperCase().replace(/&/g, "&amp;").replace(/</g, "&lt;")} </tspan>`).join("");
  return `<text x="540" y="${y}" text-anchor="middle" font-family="Anton" font-size="${size}" letter-spacing="1.5" stroke="#06071a" stroke-width="16" stroke-linejoin="round" paint-order="stroke" transform="translate(540 ${y}) scale(${pop.toFixed(3)}) translate(-540 ${-y})">${spans}</text>`;
}
