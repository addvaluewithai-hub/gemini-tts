// "Two words from the humans' dictionary" (network part 1): two shots.
//   0 an old dictionary opens and CELL rises out of it; the camera travels on to a honeycomb of hexagons where one cell
//     lights up with its tower in the middle and its rings filling exactly that cell (the area one tower covers)
//   1 SIM rises; the SIM card drops in, then slips down between two sofa cushions where a bunch of house keys already
//     lies lost (they lose it more than their keys). Host right: everything sits left of x = 1500.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { P, mix, pop, tower, radio, sim, hexPath, hexGrid, GROUP, WAVE } from "./net.js";
import { book, stars } from "./bank.js";

const word = (w, size, fill, t, t0, step = 0.06) => { const n = w.length, cw = size * 0.52; return [...w].map((ch, i) => { const u = t - t0 - i * step; return u > 0 ? at((i - (n - 1) / 2) * cw, 0, text(0, size * 0.36, ch, size, fill), [1, pop(u)], 0) : ""; }).join(""); };
const dictBook = (a, t0) => { const op = ease(seg(a, t0, t0 + 0.45));
  return op < 0.5 ? `<g transform="scale(${(1 - 2 * op).toFixed(3)} 1)">${two(rr(-260, -170, 520, 340, 24), P.violet, P.violetD, 0, 14)}<path d="${rr(-200, -110, 400, 220, 16)}" fill="none" stroke="${P.gold}" stroke-width="10"/>${disc(0, 0, 50, P.gold, P.goldD)}</g>`
    : `<g transform="scale(1 ${(0.6 + 0.4 * (op * 2 - 1)).toFixed(3)})">${book(`<path d="M-120 -40h90M-120 -10h90M-120 20h70M30 -40h90M30 -10h90M30 20h70" stroke="#dccaa0" stroke-width="9" stroke-linecap="round"/>`, { cover: P.violet, coverD: P.violetD })}</g>`; };

function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.6, 960, 520, 1.0], [3.3, 3700, 560, 1.2], [6.26, 3700, 560, 1.35]]);
  const land = a < 0.1 ? -1400 : lerp(-500, 0, easeIn(seg(a, 0.1, 0.4))), thud = a > 0.4 ? 1 - 0.08 * Math.exp(-(a - 0.4) * 9) * Math.cos((a - 0.4) * 16) : 1;
  const bk = at(960, 640 + land, dictBook(a, 1.2), [1.7 * thud, 1.7 / thud]);
  const rise = easeOut(seg(a, 1.8, 2.2)), cell = at(960, lerp(620, 260, rise), (rise > 0 ? rings(0, -10, 300, P.gold, 0.12 * rise, 1.2) : "") + word("CELL", 220, P.gold, a, 1.8, 0.06));
  // the honeycomb, one cell of it lit with its tower
  const R = 190, cells = hexGrid(3700 - 4 * R * 1.5, 560 - 3 * R * Math.sqrt(3), R, 9, 7); let hc = "";
  const on = a > 3.4 ? spring(a - 3.4, 7, 12) : 0, CX = 3700, CY = 560;
  cells.forEach((h) => { const me = Math.abs(h.x - CX) < 5 && Math.abs(h.y - CY) < 5;
    hc += `<path d="${hexPath(h.x, h.y, R - 6)}" fill="${me ? mix("#2c2766", GROUP[1][0], clamp(on)) : "#241d5e"}" stroke="#3a3290" stroke-width="8"/>`; });
  // the tower is at the cell's centre, its rings stop at the cell's edge
  const tw = at(CX, CY + 150, tower({ t: tot, lit: on }), 0.5 * pop(a - 3.5));
  const clip = `<clipPath id="ndcell"><path d="${hexPath(CX, CY, R - 6)}"/></clipPath>`;
  const rad = a > 3.8 ? `<g clip-path="url(#ndcell)">${radio(CX, CY - 90, tot, 260, { c: "#fff", w: 8, n: 3, speed: 0.8 })}</g>` : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 80, -200, 4200, 700, tot), c, 0.2) + layer(clip + hc + rad + tw + bk + cell, c);
  return { g, out: toScreen(c, CX, CY), outC: GROUP[1][0], outZ: 12 };
}

function s1(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [1.8, 880, 560, 1.0], [2.4, 820, 620, 1.12], [4.69, 810, 630, 1.15]]);
  const rise = easeOut(seg(a, 0.15, 0.5)), wd = at(760, lerp(560, 330, rise), word("SIM", 220, P.cream, a, 0.15, 0.07));
  // the card drops in on "the SIM", then falls into the sofa on "they lose it"
  const fall = ease(seg(a, 2.3, 2.9)), drop = a < 0.75 ? -900 : lerp(-300, 0, easeIn(seg(a, 0.75, 1.0)));
  const cardY = lerp(660 + drop, 830, fall), cardR = lerp(0, 35, fall), cardK = lerp(1.6, 0.7, fall);
  const card = at(760, cardY, (a > 1.1 && fall < 0.1 ? rings(0, 0, 200, P.gold, 0.16) : "") + sim(), cardK, cardR);
  // the sofa, in front of the card when it has fallen in
  const sofa = (front) => front ? `${two(rr(380, 860, 760, 140, 40), "#d6407f", "#b02f68", 0, 10)}${two(rr(330, 800, 100, 260, 40), "#ff5fa2", "#d6407f", 10, 0)}${two(rr(1090, 800, 100, 260, 40), "#ff5fa2", "#d6407f", 10, 0)}<path d="${rr(380, 990, 760, 60, 20)}" fill="#8a2452"/>`
    : `${two(rr(380, 620, 760, 260, 50), "#ff5fa2", "#d6407f", 0, 12)}<path d="M760 640V880" stroke="#d6407f" stroke-width="10"/>`;
  const keys = a > 2.2 ? at(560, 838, `<circle cx="0" cy="0" r="26" fill="none" stroke="${P.gold}" stroke-width="10"/><path d="M20 10L80 40M60 30L70 14M74 36L84 22" stroke="${P.gold}" stroke-width="10" stroke-linecap="round"/>`, 1.4 * pop(a - 3.8), -25) : "";
  const reveal = a > 3.75 ? `<path d="M${lerp(1000, 960, 0)} 920" />` : "";
  const sofaOn = a > 1.9 ? seg(a, 1.9, 2.2) : 0;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(43, 70, -200, 2200, 700, tot), c, 0.2)
    + layer(`<rect x="-500" y="1040" width="3000" height="400" fill="#141a45"/>` + (sofaOn > 0 ? at(0, 300 * (1 - easeOut(sofaOn)), sofa(false)) : "") + card + (a > 3.75 ? keys : "") + (sofaOn > 0 ? at(0, 300 * (1 - easeOut(sofaOn)), sofa(true)) : "") + reveal + wd, c);
  return { g, in: toScreen(c, 760, 540), inC: GROUP[1][0], inZ: 12 };
}

const SHOTS = [s0, s1];
export const ndictSet = makeSet(SHOTS, [], P);
