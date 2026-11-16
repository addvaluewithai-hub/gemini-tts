// Crypto part 3, intro: two wordless shots (shots.md, scene intro).
//   0 the night town; a gold key glows over the blue house (owning), then drops into a crack in the street and is gone (losing)
//   1 the public book under its glass dome; copies fly to laptops all round it; a ring of gold links closes round it (no one can forge it)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3intro.v.js";
import { P, mix, house, book, rows, stars, skyline } from "./bank.js";
import { laptop } from "./props.js";
import { link } from "./c2props.js";
import { key } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);

// ---- 0: owned, then lost ----
function s0(a, tot) {
  const G = 860, HX = 820;
  const c = camAt(a, [[0, 880, 560, 1.35], [2.4, 860, 560, 1.6], [3.1, 880, 680, 1.7], [4.4, 900, 790, 2.1], [15, 900, 790, 2.15]]);
  const town = `<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/><rect x="-900" y="${G + 40}" width="3800" height="90" fill="${P.road}"/>`
    + [[260, P.teal, P.tealD], [1380, P.pink, P.pinkD], [1800, P.violet, P.violetD]].map(([x, col, colD]) => at(x, G, house(col, colD, { lit: [1, 0, 1] }), 1.05)).join("")
    + at(HX, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.35);
  // the key: rises glowing over the blue house ("own"), hangs, then falls into a crack in the road ("lose")
  const rise = ease(seg(a, 0.9, 1.6)), fall = easeIn(seg(a, 3.15, 3.75)), CR = [HX + 120, G + 85];
  const crack = a > 2.75 ? drawn(`M${CR[0] - 260} ${CR[1] - 10}L${CR[0] - 140} ${CR[1] + 12}L${CR[0] - 40} ${CR[1] - 6}L${CR[0] + 60} ${CR[1] + 14}L${CR[0] + 240} ${CR[1]}`, seg(a, 2.75, 3.05), "#0a0620", 22) + (a > 3.05 ? `<ellipse cx="${CR[0]}" cy="${CR[1] + 3}" rx="${(70 * ease(seg(a, 3.0, 3.2))).toFixed(1)}" ry="14" fill="#0a0620"/>` : "") : "";
  let k = "";
  if (a > 0.85 && fall < 1) { const hx = HX - 40, hy = G - 410 + 10 * Math.sin(tot * 2.4);
    const x = lerp(hx - 60, CR[0] - 40, fall), y = lerp(hy, CR[1] + 40, fall), sc = 1.5 * (0.25 + 0.75 * pop(a - 0.9)) * (1 - 0.65 * fall);
    const glow = rings(70, 0, 170 * (1 + 0.06 * Math.sin(tot * 4)), P.gold, 0.22 * (1 - fall) * rise);
    k = `<g opacity="${(1 - seg(fall, 0.85, 1)).toFixed(2)}">${at(x, y, glow + key({ digits: 8 }), sc, 90 * fall)}</g>`; }
  // the road over the crack's mouth hides the key as it goes in
  const lip = a > 3.05 ? `<path d="M${CR[0] - 90} ${CR[1] + 3}h180v60h-180Z" fill="${P.road}"/>` : "";
  const g = night(c, tot, 13) + layer(skyline(21, -800, 2800, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(57, -800, 2800, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(town + crack + k + lip, c);
  return { g };
}

// ---- 1: the book is public, everyone has a copy, no one can forge it ----
function s1(a, tot) {
  const BX = 960, BY = 470, G = 940;
  const c = camAt(a, [[0, BX, BY + 20, 1.35], [1.7, BX, BY + 30, 1.25], [3.0, BX, BY + 120, 0.92], [5.07, BX, BY + 120, 0.95]]);
  const lit = ease(seg(a, 1.3, 1.9));
  const rays = lit > 0 ? [-2.5, -1.9, -1.2, -0.6, 0.6, 1.2, 1.9, 2.5].map((an, i) => `<path d="M${BX} ${BY}L${(BX + Math.cos(an - 1.571) * 1500 - 70).toFixed(0)} ${(BY + Math.sin(an - 1.571) * 1500).toFixed(0)}L${(BX + Math.cos(an - 1.571) * 1500 + 70).toFixed(0)} ${(BY + Math.sin(an - 1.571) * 1500).toFixed(0)}Z" fill="#ffd98a" opacity="${(0.07 * lit * (1 + 0.2 * Math.sin(tot * 2 + i))).toFixed(3)}"/>`).join("") : "";
  const dome = `<path d="M${BX - 300} ${BY + 210}V${BY - 40}A300 300 0 0 1 ${BX + 300} ${BY - 40}V${BY + 210}" fill="#cfe9ff" opacity=".1" stroke="#cfe9ff" stroke-width="8"/><path d="M${BX - 230} ${BY - 180}Q${BX - 180} ${BY - 270} ${BX - 90} ${BY - 300}" stroke="#fff" stroke-width="10" fill="none" opacity=".3" stroke-linecap="round"/>`;
  const stand = `${two(rr(BX - 60, BY + 150, 120, G - BY - 190, 8), "#7a55c9", "#5b3aa6", 12, 0)}<path d="${rr(BX - 180, G - 50, 360, 50, 10)}" fill="#5b3aa6"/>`;
  const big = at(BX, BY, rings(0, 0, 240, P.gold, 0.14 + 0.05 * Math.sin(tot * 2), 1.3) + book(rows("70", "80")), 1.45);
  // copies fly out to laptops on a ring around the dome
  const N = 8, RR = 640; let laps = "", flying = "";
  for (let i = 0; i < N; i++) { const u = (i + 0.5) / N, x = lerp(170, 1750, u), y = G - 20 + 70 * Math.sin(Math.PI * u) - (i % 2) * 40, t0 = 2.2 + i * 0.07;
    const land = seg(a, t0, t0 + 0.55), got = land >= 1;
    laps += at(x, y, laptop(got ? "#fff3c2" : "#5a6aa8", got ? at(0, -110, book(rows("70", "80")), 0.7) : ""), 0.62 * pop(a - 1.9 - i * 0.05));
    if (land > 0 && land < 1) { const b = bez([BX, BY], [lerp(BX, x, 0.5), Math.min(BY, y) - 260], [x, y - 70], ease(land)); flying += at(b[0], b[1], book(rows("70", "80")), lerp(0.9, 0.45, land)); } }
  // the ring of gold links closes round the book
  const close = seg(a, 3.55, 4.6), L = 14; let ring = "";
  for (let i = 0; i < L; i++) { const p = seg(close, i / L, (i + 1) / L); if (p <= 0) continue; const a0 = -1.571 + i / L * 6.283, a1 = a0 + 6.283 / L, r = 360;
    ring += link(BX + Math.cos(a0) * r, BY + Math.sin(a0) * r * 0.82, BX + Math.cos(a1) * r, BY + Math.sin(a1) * r * 0.82, P.gold, ease(p), 0.8); }
  const seal = close >= 1 ? rings(BX, BY, 420 * spring(a - 4.6, 7, 10), P.gold, 0.25 * (1 - seg(a, 4.7, 5.07))) : "";
  const ground = `<rect x="-800" y="${G}" width="3600" height="600" fill="#1b2054"/><ellipse cx="${BX}" cy="${G + 20}" rx="620" ry="60" fill="#2c366f"/>`;
  const g = night(c, tot, 19) + layer(skyline(83, -600, 2600, G - 40, 140, 320, "#221a5c", "#ffb066"), c, 0.5) + layer(rays + ground + laps + stand + big + dome + ring + seal + flying, c);
  return { g };
}

const SHOTS = [s0, s1];
export const c3introSet = makeSet(SHOTS, V, P);
