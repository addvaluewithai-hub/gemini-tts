// Episode 3: the night fair. The drop tower and its seat ring, the fairground beyond (tents, a Ferris wheel, strings of
// bulbs), the prize stall with its shelf of stitched pink alien plush toys (each in a different silly hat, so Peek's
// fedora is one hat among several), and a bench under a lamp. Kept apart from night.js and moon.js.
import { def, rnd, clamp, lerp } from "../lib/fx.js";
import * as X from "../lib/explain.js";

const memo = new Map();
const once = (key, f) => { if (!memo.has(key)) memo.set(key, f()); return memo.get(key); };
const at = (x, y, k, rot, inner) => `<g transform="translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) rotate(${(+rot || 0).toFixed(2)}) scale(${(+k).toFixed(3)})">${inner}</g>`;
const BULB = ["#ffe08a", "#ff9fd0", "#9fe6ff", "#ffd27a", "#b9ff9f"];

// a string of bulbs hanging between two points (sag in px); t makes them chase
export function bulbs(x0, y0, x1, y1, sag, n, t = 0, r = 7, o = 1) {
  let s = `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}" stroke="#1a1430" stroke-width="3" fill="none"/>`;
  for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u) + 4 * sag * u * (1 - u), on = 0.55 + 0.45 * Math.sin(t * 5 - i * 0.9);
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r * 2.6}" fill="${BULB[i % 5]}" opacity="${(0.18 * on * o).toFixed(2)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${BULB[i % 5]}" opacity="${((0.6 + 0.4 * on) * o).toFixed(2)}"/>`; }
  return s;
}
// a Ferris wheel: hub at (x, y), radius r, turning with t
export function ferris(x, y, r, t = 0, o = 1) {
  const a0 = t * 0.12, n = 12;
  let s = `<path d="M${x - r * 0.55} ${y + r * 1.25} L${x} ${y} L${x + r * 0.55} ${y + r * 1.25}" stroke="#2a2350" stroke-width="${r * 0.05}" fill="none"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#3a2f6e" stroke-width="${r * 0.035}"/><circle cx="${x}" cy="${y}" r="${r * 0.86}" fill="none" stroke="#2a2350" stroke-width="${r * 0.02}"/>`;
  for (let i = 0; i < n; i++) { const a = a0 + i * Math.PI * 2 / n, cx = x + Math.cos(a) * r, cy = y + Math.sin(a) * r;
    s += `<path d="M${x} ${y} L${cx.toFixed(1)} ${cy.toFixed(1)}" stroke="#2a2350" stroke-width="${r * 0.012}"/>`
      + `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r * 0.05}" fill="${BULB[i % 5]}" opacity=".9"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r * 0.13}" fill="${BULB[i % 5]}" opacity=".18"/>`
      + `<path d="M${(cx - r * 0.07).toFixed(1)} ${(cy + r * 0.04).toFixed(1)} h${r * 0.14} v${r * 0.09} h${-r * 0.14} Z" fill="#c2405a" opacity=".85"/>`; }
  return `<g opacity="${o}">${s}<circle cx="${x}" cy="${y}" r="${r * 0.06}" fill="#ffd27a"/></g>`;
}
// a striped tent top (x centre, y base, w wide, h high)
export const tent = (x, y, w, h, c1 = "#c2405a", c2 = "#f0e6d8") => { let s = ""; const n = 6;
  for (let i = 0; i < n; i++) { const xa = x - w / 2 + i * w / n, xb = xa + w / n; s += `<path d="M${x} ${y - h} L${xa} ${y} L${xb} ${y} Z" fill="${i % 2 ? c2 : c1}" opacity=".9"/>`; }
  return s + `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h * 0.9}" fill="#1c1640"/><path d="M${x} ${y - h} v-30" stroke="#1c1640" stroke-width="5"/><path d="M${x} ${y - h - 30} l26 8 l-26 8 Z" fill="#ffd27a"/>`; };

// the fairground seen beyond (a wide band; base at y)
export const fairground = (y = 1700, t = 0) => once(`fg${y}`, () => tent(250, y - 120, 360, 200) + tent(1650, y - 100, 300, 170, "#3a6ec2") + tent(2350, y - 140, 420, 230, "#c28a2a")
  + `<rect x="-800" y="${y - 120}" width="4000" height="900" fill="#120f2c"/>`)
  + ferris(980, y - 560, 420, t) + bulbs(-300, y - 260, 700, y - 300, 40, 14, t) + bulbs(1350, y - 300, 2600, y - 250, 50, 16, t + 1);

// ---- the drop tower: a lattice column from y top to y base at x, with a light strip; the seat ring at ringY
export function tower(x, top, base, t = 0, w = 130) {
  const h = base - top, bands = Math.floor(h / 120);
  let s = `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" fill="#241e48"/><rect x="${x - w / 2}" y="${top}" width="${w * 0.18}" height="${h}" fill="#3b3374"/>`;
  for (let i = 0; i < bands; i++) { const y = top + i * 120; s += `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y + 120} M${x + w / 2} ${y} L${x - w / 2} ${y + 120}" stroke="#171233" stroke-width="7"/>`; }
  for (let i = 0; i < bands * 2; i++) { const y = top + 30 + i * 60, on = 0.5 + 0.5 * Math.sin(t * 6 - i * 0.5); s += `<circle cx="${x}" cy="${y}" r="7" fill="#ff9fd0" opacity="${(0.4 + 0.6 * on).toFixed(2)}"/>`; }
  return s + `<path d="M${x - w} ${top} L${x} ${top - 140} L${x + w} ${top} Z" fill="#3b3374"/><circle cx="${x}" cy="${top - 150}" r="16" fill="#ff4f6d"/><circle cx="${x}" cy="${top - 150}" r="44" fill="#ff4f6d" opacity=".25"/>`;
}
// the seat ring seen from the front: `back` goes behind the riders, `front` (lap bars, the ring band) in front.
// Seats at offsets (in px from the column) -2..2; returns { back, front, seat(i) -> [x, y] where a rider sits }
export function seatRing(x, y, k = 1) {
  const offs = [-2, -1, 0, 1, 2], sx = (i) => x + i * 150 * k, depth = (i) => 1 - Math.abs(i) * 0.08;
  const back = offs.map((i) => { const X0 = sx(i), d = depth(i);
    return `<g transform="translate(${X0} ${y}) scale(${(k * d).toFixed(3)})"><rect x="-62" y="-210" width="124" height="230" rx="34" fill="#7a1f3a"/><rect x="-50" y="-196" width="100" height="204" rx="26" fill="#a3304f"/><rect x="-66" y="10" width="132" height="34" rx="10" fill="#4a1426"/></g>`; }).join("");
  const front = `<rect x="${x - 400 * k}" y="${y + 40 * k}" width="${800 * k}" height="${70 * k}" rx="${20 * k}" fill="#2f2860"/><rect x="${x - 400 * k}" y="${y + 40 * k}" width="${800 * k}" height="${14 * k}" rx="${7 * k}" fill="#5a50a8"/>`
    + offs.map((i) => { const X0 = sx(i), d = depth(i);
      return `<g transform="translate(${X0} ${y}) scale(${(k * d).toFixed(3)})"><path d="M-50 -100 C-50 -20 -30 0 0 0 C30 0 50 -20 50 -100" fill="none" stroke="#ffd23f" stroke-width="18" stroke-linecap="round"/><path d="M-50 -100 C-50 -20 -30 0 0 0 C30 0 50 -20 50 -100" fill="none" stroke="#fff3a8" stroke-width="5" stroke-linecap="round" opacity=".6"/></g>`; }).join("");
  return { back, front, seat: (i) => [sx(i), y + 10 * k] };
}

// ---- the prize stall (world x 0..1080; the top shelf at SHELF_Y; the counter top at COUNTER_Y; the ground at FLOOR_Y)
export const SHELF_Y = 1080, COUNTER_Y = 1250, FLOOR_Y = 1880;
export function stall(t = 0) {
  const stripes = Array.from({ length: 10 }, (_, i) => `<path d="M${-40 + i * 120} 150 h120 v190 q-60 50 -120 0 Z" fill="${i % 2 ? "#f0e6d8" : "#c2405a"}"/>`).join("");
  return once("stallBody", () => `<rect x="-200" y="120" width="1480" height="1800" fill="#1a1236"/>
    <rect x="-40" y="330" width="1160" height="${COUNTER_Y - 330}" fill="#3a1e4e"/><rect x="-40" y="330" width="1160" height="${COUNTER_Y - 330}" fill="url(#stallG)"/>
    <defs><radialGradient id="stallG" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#ffd27a" stop-opacity=".28"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
    <rect x="-20" y="${SHELF_Y}" width="1120" height="26" fill="#7a4a2a"/><rect x="-20" y="${SHELF_Y}" width="1120" height="7" fill="#b07a4a"/>
    <rect x="-20" y="760" width="1120" height="22" fill="#7a4a2a"/>
    ${[[110, 760], [300, 760], [520, 760], [760, 760], [960, 760]].map(([x, y], i) => `<circle cx="${x}" cy="${y - 60}" r="58" fill="${["#ffd23f", "#57c8ff", "#5fd27a", "#ff9fd0", "#c9a3ff"][i]}"/><ellipse cx="${x - 18}" cy="${y - 80}" rx="18" ry="11" fill="#fff" opacity=".5"/>`).join("")}`)
    + stripes + Array.from({ length: 20 }, (_, i) => { const x = -20 + i * 60, on = 0.55 + 0.45 * Math.sin(t * 4 - i * 0.7); return `<circle cx="${x}" cy="342" r="24" fill="#ffe08a" opacity="${(0.25 * on).toFixed(2)}"/><circle cx="${x}" cy="342" r="10" fill="#ffe08a" opacity="${(0.6 + 0.4 * on).toFixed(2)}"/>`; }).join("")
    + `<rect x="300" y="40" width="480" height="110" rx="18" fill="#2a1a4a" stroke="#ffd27a" stroke-width="6"/>` + X.label(540, 122, "WIN A PRIZE", 70, "#ffd27a");
}
export const counter = () => once("counter", () => `<rect x="-60" y="${COUNTER_Y}" width="1200" height="${FLOOR_Y - COUNTER_Y + 60}" fill="#5a1f3a"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${-60 + i * 140}" y="${COUNTER_Y + 40}" width="70" height="${FLOOR_Y - COUNTER_Y}" fill="#7a2a4e"/>`).join("")}
  <rect x="-60" y="${COUNTER_Y - 18}" width="1200" height="40" rx="8" fill="#b07a4a"/><rect x="-60" y="${COUNTER_Y - 18}" width="1200" height="10" fill="#e0a86a" opacity=".7"/>`);

// ---- a cheap stitched copy of a pink alien: felt body, seams, button eyes, felt buck teeth, pom-pom antennae, a hang tag,
// and a silly hat ("party" | "cowboy" | "crown" | "beanie"). Base at (x, y); about 300 tall at k = 1. teeth: size of the teeth.
export function plush(x, y, k = 1, hat = "party", { teeth = 1, tilt = 0, price = "$5" } = {}) {
  const T = 30 * teeth;
  const hats = {
    party: `<path d="M-40 -238 L0 -340 L40 -238 Z" fill="#57c8ff"/><path d="M-26 -272 L26 -272 M-14 -305 L14 -305" stroke="#ffd23f" stroke-width="8"/><circle cx="0" cy="-344" r="14" fill="#ff4fa3"/>`,
    cowboy: `<ellipse cx="0" cy="-238" rx="96" ry="18" fill="#8a5a2a"/><path d="M-50 -238 C-52 -300 -20 -290 0 -276 C20 -290 52 -300 50 -238 Z" fill="#a8743a"/><rect x="-50" y="-252" width="100" height="12" fill="#5a3a1a"/>`,
    crown: `<path d="M-56 -236 L-56 -296 L-30 -264 L0 -306 L30 -264 L56 -296 L56 -236 Z" fill="#ffd23f" stroke="#c99a1f" stroke-width="5"/><circle cx="0" cy="-262" r="10" fill="#ff4f6d"/>`,
    beanie: `<path d="M-70 -228 C-70 -306 70 -306 70 -228 Z" fill="#3a6ec2"/><rect x="-74" y="-240" width="148" height="22" rx="10" fill="#2a4e94"/><circle cx="0" cy="-300" r="20" fill="#f0e6d8"/>`,
  };
  return at(x, y, k, tilt, `<ellipse cx="0" cy="4" rx="90" ry="12" fill="#05030c" opacity=".35"/>
    <path d="M-30 -232 C-56 -270 -70 -290 -80 -300 M30 -232 C56 -270 70 -290 80 -300" stroke="#e0458a" stroke-width="9" fill="none"/><circle cx="-82" cy="-304" r="16" fill="#ffd23f"/><circle cx="82" cy="-304" r="16" fill="#ffd23f"/>
    <path d="M-88 -10 C-110 -110 -80 -230 0 -236 C80 -230 110 -110 88 -10 C60 6 -60 6 -88 -10 Z" fill="#f25ea6"/>
    <path d="M-60 -200 C-40 -224 40 -224 60 -200" stroke="#ffb3d5" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>
    <path d="M0 -234 C-4 -150 -4 -60 0 2" stroke="#b8336f" stroke-width="3" stroke-dasharray="7 7" fill="none"/>
    <path d="M-92 -110 C-128 -96 -136 -70 -124 -54 M92 -110 C128 -96 136 -70 124 -54" stroke="#f25ea6" stroke-width="30" stroke-linecap="round" fill="none"/>
    <circle cx="-34" cy="-160" r="18" fill="#141020"/><circle cx="34" cy="-160" r="18" fill="#141020"/><circle cx="-40" cy="-166" r="5" fill="#fff" opacity=".8"/><circle cx="28" cy="-166" r="5" fill="#fff" opacity=".8"/>
    <path d="M-34 -122 Q0 -104 34 -122" stroke="#7a1846" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="${-T - 2}" y="-118" width="${T}" height="${T * 1.15}" rx="4" fill="#fffbe8" stroke="#c9b98a" stroke-width="2"/><rect x="2" y="-118" width="${T}" height="${T * 1.15}" rx="4" fill="#fffbe8" stroke="#c9b98a" stroke-width="2"/>
    <path d="M${-T - 2 + 4} -112 l4 4 M${2 + 4} -112 l4 4" stroke="#c9b98a" stroke-width="2"/>
    ${hats[hat] || ""}
    <path d="M70 -60 L96 -30" stroke="#c9b98a" stroke-width="3"/><g transform="translate(98 -28) rotate(18)"><rect x="-4" y="0" width="54" height="34" rx="6" fill="#fffbe8"/><circle cx="4" cy="8" r="3" fill="#c9b98a"/><text x="27" y="26" text-anchor="middle" font-family="Anton" font-size="20" fill="#c2405a">${price}</text></g>`);
}

// ---- the bench and the lamp for the tag
export const bench = (x, y) => `<rect x="${x - 220}" y="${y - 150}" width="440" height="26" rx="8" fill="#3a2a22"/><rect x="${x - 220}" y="${y - 240}" width="440" height="22" rx="8" fill="#3a2a22"/><rect x="${x - 220}" y="${y - 200}" width="440" height="20" rx="8" fill="#32241e"/>
  <rect x="${x - 200}" y="${y - 130}" width="18" height="130" fill="#15131c"/><rect x="${x + 182}" y="${y - 130}" width="18" height="130" fill="#15131c"/>`;
export const lamp = (x, y, h = 900) => `<rect x="${x - 10}" y="${y - h}" width="20" height="${h}" fill="#15131c"/><path d="M${x - 50} ${y - h} h100 l-24 -40 h-52 Z" fill="#1d1a28"/>
  <circle cx="${x}" cy="${y - h + 10}" r="300" fill="url(#lampG)"/><circle cx="${x}" cy="${y - h + 6}" r="16" fill="#fff1c4"/>
  <defs><radialGradient id="lampG"><stop offset="0" stop-color="#ffd59a" stop-opacity=".55"/><stop offset=".4" stop-color="#ffb866" stop-opacity=".16"/><stop offset="1" stop-color="#ffb866" stop-opacity="0"/></radialGradient></defs>`;
