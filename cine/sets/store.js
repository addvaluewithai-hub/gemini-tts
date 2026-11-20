// Episode 4: a closed superstore at night. Tall pallet racks with boxes, aisle signs, a bowling-ball rack, half-lit ceiling
// lamps, shiny floor tiles (one cracked by the ball), a pillow display, the customer-service desk with a gooseneck
// microphone and a security-camera dome, and the TV wall in electronics. Kept apart from the other sets.
//
// World units are the same as Crowe's rig (lib/crowe.js, about 1170 tall with the hat at k = 1; drawn at k 0.85 he is
// about 1.9 m), so 1 m is about 524 px. The top deck of Peek's rack is 4.9 m (2570 px) above the floor.
import { rnd, lerp, clamp } from "../lib/fx.js";
import * as X from "../lib/explain.js";

const memo = new Map();
const once = (key, f) => { if (!memo.has(key)) memo.set(key, f()); return memo.get(key); };
const at = (x, y, k, rot, inner) => `<g transform="translate(${(+x).toFixed(1)} ${(+y).toFixed(1)}) rotate(${(+rot || 0).toFixed(2)}) scale(${(+k).toFixed(3)})">${inner}</g>`;

export const PXM = 524;                                   // px per metre
export const FLOOR_Y = 1880, TOP_Y = FLOOR_Y - Math.round(4.9 * PXM);   // the floor; the top deck of the rack (4.9 m up)
export const RACK_X = 600;                                // the aisle-side face of Peek's rack (the rack runs to the right)
export const LEVELS = [FLOOR_Y - 700, FLOOR_Y - 1400, FLOOR_Y - 2050, TOP_Y];
export const BALL_X = 250, APPLE_X = 520;                 // where the ball and the apple sit on the plank (and land)
export const BALL_R = 57, APPLE_R = 24;                   // a 21.6 cm bowling ball, a large 9 cm apple, to scale

// ---- a cardboard box with a printed label
export const box = (x, y, w, h, label = "", tone = "#b8865a") => `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${tone}"/>
  <rect x="${x}" y="${y - h}" width="${w}" height="${h * 0.16}" fill="#000" opacity=".12"/><path d="M${x + w / 2} ${y - h} v${h * 0.3}" stroke="#d9b07a" stroke-width="${Math.max(4, w * 0.04)}"/>
  <rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="none" stroke="#6a4a2e" stroke-width="3"/>`
  + (label ? `<text x="${x + w / 2}" y="${y - h * 0.38}" text-anchor="middle" font-family="Anton" font-size="${Math.min(w * 0.2, h * 0.24).toFixed(0)}" fill="#5a3a22" opacity=".85">${label}</text>` : "");

// ---- pallet racking from x0 to x1 (orange uprights, blue beams), boxes on every level; `top` adds boxes on the top deck
export function rack(x0, x1, { top = true, seed = 1, labels = ["PILLOWS", "DUVETS", "PILLOWS", "SHEETS"] } = {}) {
  return once(`rack${x0}_${x1}_${top}_${seed}`, () => {
    let s = "";
    const bays = Math.max(1, Math.round((x1 - x0) / 520));
    for (let b = 0; b <= bays; b++) { const x = lerp(x0, x1, b / bays); s += `<rect x="${x - 18}" y="${TOP_Y}" width="36" height="${FLOOR_Y - TOP_Y}" fill="#e0782a"/><rect x="${x - 18}" y="${TOP_Y}" width="10" height="${FLOOR_Y - TOP_Y}" fill="#f59a4a"/>`; }
    LEVELS.forEach((y, li) => {
      for (let b = 0; b < bays; b++) {
        const xa = lerp(x0, x1, b / bays) + 24, xb = lerp(x0, x1, (b + 1) / bays) - 24; let x = xa, k = 0;
        if (li < 3 || top) while (x < xb - 60) { const w = Math.min(xb - x, 140 + rnd(seed * 100 + li * 17 + b * 5 + k) * 120), h = 220 + rnd(seed * 50 + li * 13 + b * 3 + k) * 260;
          if (li === 3 && !top) break;
          s += box(x, y - 4, w - 8, Math.min(h, li === 3 ? 360 : 560), rnd(seed + li * 7 + k + b) > 0.45 ? labels[(li + k + b) % labels.length] : "", ["#b8865a", "#c49468", "#a87850"][(li + k) % 3]); x += w; k++; }
      }
      s += `<rect x="${x0 - 24}" y="${y}" width="${x1 - x0 + 48}" height="44" fill="#2f5fb8"/><rect x="${x0 - 24}" y="${y}" width="${x1 - x0 + 48}" height="10" fill="#5a8ae0"/>`;
    });
    return s;
  });
}
// ---- the store beyond: the far wall, the ceiling with its lamps (some off at night), the hanging aisle signs, racks receding
export function back(t = 0) {
  return once("storeBack", () => {
    let s = `<rect x="-3000" y="-2600" width="7000" height="${FLOOR_Y + 2600}" fill="#171a3e"/><rect x="-3000" y="-2600" width="7000" height="700" fill="#0c0d24"/>`;
    for (let row = 0; row < 3; row++) for (let i = 0; i < 14; i++) {                 // a row of ceiling lights receding (smaller and dimmer up the frame)
      const x = -2600 + i * 440 + row * 220, y = -1880 + row * 150, w = 300 - row * 70, on = (i + row) % 4 !== 2;
      s += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${20 - row * 4}" rx="6" fill="${on ? "#eaf2ff" : "#3a3e64"}" opacity="${1 - row * 0.25}"/>` + (on ? `<ellipse cx="${x}" cy="${y + 140}" rx="${w * 1.1}" ry="200" fill="#cfe0ff" opacity="${(0.06 - row * 0.015).toFixed(3)}"/>` : ""); }
    const stock = ["#e83e5a", "#3fb27a", "#ffd23f", "#57c8ff", "#c98aff", "#ff9a3a"];
    for (let i = 0; i < 6; i++) { const x = -2600 + i * 900; s += `<rect x="${x}" y="-300" width="600" height="${FLOOR_Y + 300}" fill="#20245a"/>`
      + [400, 900, 1400].map((y) => `<rect x="${x}" y="${y}" width="600" height="18" fill="#2f5fb8" opacity=".7"/>`).join("")
      + [-140, 360, 860, 1360].map((y, r) => Array.from({ length: 6 }, (_, k) => `<rect x="${x + 14 + k * 98}" y="${y + 10 + (k % 2) * 30}" width="86" height="${120 - (k % 2) * 30}" rx="6" fill="${stock[(i + k + r) % 6]}" opacity=".42"/>`).join("")).join(""); }
    s += `<g transform="translate(-1500 -520)"><rect x="-120" y="-50" width="240" height="100" rx="10" fill="#0e5a2e"/><rect x="-120" y="-50" width="240" height="100" rx="10" fill="none" stroke="#5aff9a" stroke-width="6"/>${X.label(0, 30, "EXIT", 70, "#9affc4", 1)}</g>
      <ellipse cx="-1500" cy="-520" rx="300" ry="200" fill="#3aff8a" opacity=".1"/>`;
    return s;
  }) + sign(-80, -980, "SPORTS") + sign(1550, -1040, "BEDDING");
}
// a shaft of pale light from a skylight onto the aisle (centre x at the floor, width at the floor)
export const shaft = (x, w = 900, o = 0.12) => `<defs><linearGradient id="shaftG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe8ff" stop-opacity="${o * 0.4}"/><stop offset="1" stop-color="#dfe8ff" stop-opacity="${o}"/></linearGradient></defs>
  <path d="M${x - 140} -1900 L${x + 140} -1900 L${x + w / 2} ${FLOOR_Y + 40} L${x - w / 2} ${FLOOR_Y + 40} Z" fill="url(#shaftG)"/><ellipse cx="${x}" cy="${FLOOR_Y + 40}" rx="${w * 0.55}" ry="70" fill="#dfe8ff" opacity="${o * 0.9}"/>`;
export const sign = (x, y, text) => `<path d="M${x - 120} -1900 V${y - 70} M${x + 120} -1900 V${y - 70}" stroke="#4a4e7a" stroke-width="5"/>
  <rect x="${x - 230}" y="${y - 80}" width="460" height="120" rx="12" fill="#e83e5a"/><rect x="${x - 230}" y="${y - 80}" width="460" height="22" rx="10" fill="#ff6a82" opacity=".5"/>` + X.label(x, y + 18, text, 80, "#fff", 1);
// ---- the floor: tiles with a sheen; cracked = 0..1 for the tile under the ball
export function floor(cracked = 0) {
  let s = `<rect x="-3000" y="${FLOOR_Y}" width="7000" height="900" fill="#2a2d52"/>`;
  s += once("tiles", () => Array.from({ length: 50 }, (_, i) => `<path d="M${-3000 + i * 140} ${FLOOR_Y} V${FLOOR_Y + 900}" stroke="#1d2044" stroke-width="4"/>`).join("")
    + [60, 160, 300, 500].map((d) => `<path d="M-3000 ${FLOOR_Y + d} H4000" stroke="#1d2044" stroke-width="4"/>`).join("")
    + `<rect x="-3000" y="${FLOOR_Y}" width="7000" height="60" fill="#8fa0ff" opacity=".1"/>`
    + `<defs><linearGradient id="floorRef" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb8ff" stop-opacity=".16"/><stop offset=".5" stop-color="#9fb8ff" stop-opacity="0"/></linearGradient></defs>`
    + `<rect x="-3000" y="${FLOOR_Y}" width="7000" height="500" fill="url(#floorRef)"/>`
    + Array.from({ length: 14 }, (_, i) => `<rect x="${-2600 + i * 440 - 80}" y="${FLOOR_Y + 30}" width="160" height="${90 + (i % 3) * 30}" rx="20" fill="#eaf2ff" opacity=".05"/>`).join(""));
  if (cracked > 0) s += `<g opacity="${clamp(cracked)}" stroke="#0c0d22" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M${BALL_X} ${FLOOR_Y + 2} l-70 18 l-40 26 M${BALL_X} ${FLOOR_Y + 2} l60 22 l50 10 M${BALL_X} ${FLOOR_Y + 2} l-10 34 M${BALL_X - 40} ${FLOOR_Y + 12} l-30 -6"/></g>`;
  return s;
}
// ---- the bowling ball (r = radius; spin in degrees) and its rack
export const ball = (x, y, r = BALL_R, spin = 0) => at(x, y, r / 100, spin, `<circle r="100" fill="url(#ballG)"/>
  <path d="M-92 -20 C-40 -70 30 -10 92 -44 C78 24 14 48 -56 76 C-16 24 -66 16 -92 -20 Z" fill="#ffd23f" opacity=".35"/>
  <circle cx="-22" cy="-40" r="12" fill="#3a0d0a"/><circle cx="14" cy="-46" r="12" fill="#3a0d0a"/><circle cx="-4" cy="-8" r="14" fill="#3a0d0a"/>
  <circle r="98" fill="none" stroke="#ffe6c0" stroke-width="4" opacity=".55"/>
  <ellipse cx="-40" cy="-58" rx="30" ry="16" fill="#fff" opacity=".85" transform="rotate(-30 -40 -58)"/><circle cx="-62" cy="-30" r="7" fill="#fff" opacity=".7"/>
  <defs><radialGradient id="ballG" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#ffb070"/><stop offset=".45" stop-color="#ff5a1f"/><stop offset="1" stop-color="#a8200c"/></radialGradient></defs>`);
export const ballRack = (x, y) => `<rect x="${x}" y="${y - 40}" width="520" height="40" fill="#4a4e7a"/>` + [0, 1, 2, 3].map((i) => ball(x + 70 + i * 128, y - 96, 57, i * 40)).join("");
// ---- the plank (from x0 out to x1 at deck height y)
export const plank = (x0, x1, y) => `<rect x="${Math.min(x0, x1)}" y="${y - 18}" width="${Math.abs(x1 - x0)}" height="22" fill="#c8a06a"/><rect x="${Math.min(x0, x1)}" y="${y - 18}" width="${Math.abs(x1 - x0)}" height="6" fill="#e8c890"/><rect x="${Math.min(x0, x1)}" y="${y + 4}" width="${Math.abs(x1 - x0)}" height="4" fill="#000" opacity=".25"/>`;
// ---- the pillow display on the floor in front of the rack
export const pillows = (x, y, squash = 0) => [0, 1, 2, 3, 4].map((i) => { const px = x + (i % 3) * 150 - 150 + (i > 2 ? 75 : 0), py = y - (i > 2 ? 90 : 0) + (i > 2 ? squash * 30 : 0);
  return `<rect x="${px - 80}" y="${py - 70}" width="160" height="${70 - (i > 2 ? squash * 20 : 0)}" rx="34" fill="${["#f0e6ff", "#ffe0ec", "#e0f0ff"][i % 3]}" stroke="#b8a8d8" stroke-width="3"/>`; }).join("");
// feathers in the air: drifting slowly down from (x, y) after t0, swaying
export function feathers(t, t0, x, y, n = 14, spread = 300, k = 1) {
  if (t < t0) return ""; const u = t - t0;
  return Array.from({ length: n }, (_, i) => { const up = 160 + rnd(i * 3) * 260, vx = (rnd(i * 5) - 0.5) * spread, fall = Math.max(0, u - 0.3) * (55 + rnd(i * 9) * 40);
    const fx_ = x + vx * Math.min(1, u * 3) + Math.sin(u * 3 + i) * 30, fy = y - up * Math.min(1, u * 4) * (1 - Math.min(1, u * 0.1)) + fall, rot = Math.sin(u * 2.5 + i) * 40;
    return feather(fx_, fy, (0.5 + rnd(i * 11) * 0.4) * k, rot); }).join("");
}
export const feather = (x, y, k = 1, rot = 0) => at(x, y, k, rot, `<path d="M0 -60 C26 -40 30 20 4 60 C-2 64 -6 64 -8 58 C-30 20 -24 -40 0 -60 Z" fill="#f4f0ff" stroke="#c8c0e8" stroke-width="2"/><path d="M0 -60 L-2 70" stroke="#b8b0d8" stroke-width="3"/>`);

// ---- the customer-service desk (world x around 0..1080), the gooseneck microphone, the camera dome
export const DESK_Y = FLOOR_Y - 560;                       // the desk top (about 1.07 m)
export function desk(t = 0) {
  return once("desk", () => `<rect x="-600" y="-400" width="2400" height="${FLOOR_Y + 400}" fill="#181a3e"/>
    ${Array.from({ length: 7 }, (_, i) => `<rect x="${-500 + i * 330}" y="80" width="220" height="16" rx="6" fill="#eaf2ff" opacity=".9"/><ellipse cx="${-390 + i * 330}" cy="200" rx="260" ry="140" fill="#cfe0ff" opacity=".05"/>`).join("")}
    
    <rect x="80" y="280" width="920" height="170" rx="16" fill="#2a8a6a"/><rect x="80" y="280" width="920" height="30" rx="14" fill="#4ab08a"/>` + X.label(540, 400, "CUSTOMER SERVICE", 86, "#fff")
    + `<rect x="120" y="${DESK_Y - 520}" width="840" height="420" rx="10" fill="#22264e"/>` + [0, 1, 2].map((i) => `<rect x="${170 + i * 270}" y="${DESK_Y - 470}" width="230" height="320" rx="8" fill="#2c3264"/>`).join("")
    + `<rect x="-200" y="${DESK_Y}" width="1480" height="${FLOOR_Y - DESK_Y}" fill="#3a3f78"/><rect x="-220" y="${DESK_Y - 30}" width="1520" height="40" rx="8" fill="#d8dcf0"/>
    <rect x="-200" y="${DESK_Y + 60}" width="1480" height="16" fill="#2a8a6a"/><g transform="translate(830 1600) scale(0.62)"><rect x="-150" y="-200" width="300" height="400" rx="12" fill="#ffd23f"/><rect x="-130" y="-180" width="260" height="120" fill="#e83e5a"/>${X.label(0, -98, "SALE", 80, "#fff", 1)}${X.label(0, 60, "50%", 110, "#e83e5a", 1)}${X.label(0, 150, "PILLOWS", 52, "#2a2d52", 1)}</g>` + floor());
}
export const mic = (x, y) => `<rect x="${x - 50}" y="${y - 14}" width="100" height="18" rx="8" fill="#1a1a2a"/><path d="M${x} ${y - 10} C${x} ${y - 160} ${x - 60} ${y - 220} ${x - 140} ${y - 250}" stroke="#2a2a3a" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x - 150}" cy="${y - 254}" rx="26" ry="18" fill="#3a3a4a" transform="rotate(-20 ${x - 150} ${y - 254})"/><circle cx="${x + 30}" cy="${y - 6}" r="6" fill="#ff3b3b"/>`;
export const dome = (x, y, led = 1) => `<rect x="${x - 70}" y="${y - 20}" width="140" height="22" fill="#2a2d52"/><path d="M${x - 62} ${y} A62 62 0 0 0 ${x + 62} ${y} Z" fill="#0b0c1e" opacity=".9"/>
  <path d="M${x - 62} ${y} A62 62 0 0 0 ${x + 62} ${y} Z" fill="none" stroke="#4a4e7a" stroke-width="4"/><circle cx="${x + 10}" cy="${y + 28}" r="7" fill="#ff3b3b" opacity="${led}"/>`;

// ---- the TV wall: cols x rows screens from (x, y) (top left), each w x h; content(i) draws inside a screen centred at 0,0
export function tvWall(x, y, cols, rows, w, h, content, on = []) {
  let s = `<rect x="${x - 30}" y="${y - 30}" width="${cols * (w + 24) + 36}" height="${rows * (h + 24) + 36}" fill="#0e0f22"/>`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c, sx = x + c * (w + 24), sy = y + r * (h + 24), o = on[i] ?? 0;
    s += `<rect x="${sx}" y="${sy}" width="${w}" height="${h}" rx="8" fill="#14183c" stroke="#30345e" stroke-width="6"/>`
      + `<clipPath id="tv${i}"><rect x="${sx}" y="${sy}" width="${w}" height="${h}" rx="8"/></clipPath>`
      + (o > 0 ? `<g clip-path="url(#tv${i})" opacity="${o.toFixed(2)}"><rect x="${sx}" y="${sy}" width="${w}" height="${h}" fill="#3a2a5a"/><g transform="translate(${sx + w / 2} ${sy + h / 2})">${content(i)}</g>
        ${Array.from({ length: Math.floor(h / 8) }, (_, k) => `<rect x="${sx}" y="${sy + k * 8}" width="${w}" height="3" fill="#000" opacity=".18"/>`).join("")}</g>`
        : `<rect x="${sx + 10}" y="${sy + 10}" width="${w * 0.35}" height="${h * 0.12}" fill="#2a3070" opacity=".5"/>`); }
  return s + `<rect x="${x - 30}" y="${y + rows * (h + 24) + 6}" width="${cols * (w + 24) + 36}" height="40" fill="#2f5fb8"/>`;
}
