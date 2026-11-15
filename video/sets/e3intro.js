// "Intro" of electricity part 3 of 4 (why the lights go out).
//   0 the balance from part 2 sits level over the 50 gauge, ticking each second; on «يبوظ» it tips, the needle falls, a "?"
//   1 north-east America and Canada at night, lit; 2003; 50,000,000; the map goes dark; then a tree and a stuck computer
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./e3intro.v.js";
import { P, E, mix, house, pop, station, tagV } from "./elec.js";
import { calPage } from "./props.js";
import { dial } from "./balance.js";
import { RED, sky, tall, neMap, waveLit, OHIO } from "./domino.js";

const fmt = (v) => Math.round(v).toLocaleString("en");
// a little tree (base on y = 0), k scale
export const tree = (k = 1, sway = 0) => at(0, 0, `<path d="${rr(-16, -150, 32, 150, 8)}" fill="#7a4a2a"/><g transform="rotate(${sway.toFixed(2)} 0 -150)">${[[0, -260, 110], [-70, -200, 80], [70, -200, 80], [0, -330, 80]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2f8a5a"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.7}" fill="#3fae72"/>`).join("")}</g>`, k);
// a computer screen frozen: an hourglass (centre)
export const frozen = (t = 0, k = 1) => at(0, 0, `${two(rr(-200, -150, 400, 280, 20), "#123a57", "#0a2a3c", 0, 8)}<path d="${rr(-176, -128, 352, 236, 10)}" fill="#0b3346"/><path d="M-40 160h80l20 40h-120Z" fill="#0a2a3c"/>
  <g transform="rotate(${(Math.floor(t * 2) % 2 ? 0 : 180)} 0 -10)"><path d="M-46 -80H46L0 -10L46 60H-46L0 -10Z" fill="none" stroke="${P.cream}" stroke-width="10" stroke-linejoin="round"/><path d="M-26 -60H26L0 -26Z" fill="${P.gold}"/><path d="M0 0L30 48H-30Z" fill="${P.gold}" opacity=".7"/></g>`, k);

// ---- 0: the balance tips ----
function s0(a, tot, s) {
  const T = tall(), c = camAt(a, [[0, 960, 540, 1.0], [5.3, 960, 540, 1.08], [7.65, 960, 560, 1.15]]);
  const brk = seg(a, 6.74, 7.2), f = 50 + 0.02 * Math.sin(a * 6) * (1 - brk) - 0.95 * ease(brk), tilt = 22 * easeIn(brk) + 1.5 * Math.sin(a * 3) * (1 - brk);
  const DY = T ? 1050 : 760, DX = 960;
  const g0 = at(DX, DY, dial(f, { r: T ? 300 : 230, red: brk }), pop(a - 0.1));
  const rad = tilt * Math.PI / 180, BW = T ? 380 : 470, BY = T ? 480 : 300;
  const L = [DX - BW * Math.cos(rad), BY - BW * Math.sin(rad)], R = [DX + BW * Math.cos(rad), BY + BW * Math.sin(rad)];
  const pan = (p, inner) => `<path d="M${p[0] - 120} ${p[1] + 100}L${p[0]} ${p[1]}L${p[0] + 120} ${p[1] + 100}" fill="none" stroke="${P.steelD}" stroke-width="6"/>${at(p[0], p[1] + 108, inner)}<path d="${rr(p[0] - 150, p[1] + 102, 300, 18, 8)}" fill="${P.steel}"/>`;
  const beam = `<path d="M${DX} ${BY + 20}L${DX - 50} ${BY + 170}H${DX + 50}Z" fill="${P.steelD}"/><path d="M${L[0]} ${L[1]}L${R[0]} ${R[1]}" stroke="${P.gold}" stroke-width="18" stroke-linecap="round"/>${disc(DX, BY, 24, P.gold, P.goldD)}`;
  const bal = a > 1.6 ? at(0, 0, beam + pan(L, at(0, 0, station(tot, { smoke: false }), 0.24)) + pan(R, at(-40, 0, house(E.houseA, E.houseAD, { roof: E.roof }), 0.36) + at(55, 0, house(E.houseB, E.houseBD, { roof: E.roof }), 0.3)), 1, 0, `opacity="${clamp((a - 1.6) * 3).toFixed(2)}"`) : "";
  const tick = a > 4.85 && a < 6.7 ? rings(DX, DY, (T ? 320 : 250) + 40 * ((a - 4.85) % 1), P.gold, 0.25 * (1 - (a - 4.85) % 1), 1.1) : "";
  const q = a > 7.0 ? at(DX + (T ? 260 : 420), BY - 40, text(0, 0, "?", 180, P.gold), pop(a - 7.0)) : "";
  const g = sky(c, tot, 31) + layer(bal + tick + g0 + q, c);
  return { g, out: toScreen(c, DX, DY), outC: P.cream, outZ: 12 };
}
// ---- 1: 2003: fifty million in the dark; a tree and a stuck computer ----
function s1(a, tot, s) {
  const T = tall(), c = camAt(a, [[0, 960, 560, T ? 0.62 : 1.0], [5.6, 960, 560, T ? 0.62 : 0.98], [8.1, 900, 560, T ? 0.62 : 1.0]]);
  const r = lerp(-100, 1900, easeIn(seg(a, 4.6, 5.6))), dim = seg(a, 5.67, 6.3);
  const map = neMap(tot, (i, x, y) => waveLit(x, y, OHIO[0], OHIO[1], r)) + `<rect x="0" y="0" width="1920" height="1080" fill="#020a12" opacity="${(0.55 * dim).toFixed(2)}"/>`;
  const cal = a > 1.46 ? at(T ? 760 : 330, T ? 1180 : 250, calPage("2003", "", 1, 150), pop(a - 1.46) * (1 - seg(a, 5.5, 5.9))) : "";
  const cnt = a > 2.82 ? at(T ? 960 : 1260, T ? 1280 : 240, tagV(fmt(lerp(0, 50000000, ease(seg(a, 2.82, 3.7)))), "", { size: 92 }), pop(a - 2.82) * (1 - seg(a, 5.5, 5.9))) : "";
  const tr = a > 6.22 ? at(T ? 760 : 700, T ? 900 : 760, tree(1.25, 4 * Math.sin(a * 2)), pop(a - 6.22)) : "";
  const pc = a > 6.86 ? at(T ? 1160 : 1240, T ? 790 : 600, frozen(a, 1.1), pop(a - 6.86)) : "";
  const g = sky(c, tot, 32) + layer(map + cal + cnt + tr + pc, c);
  return { g, out: toScreen(c, OHIO[0], OHIO[1]), outC: "#04121e", outZ: 12 };
}

const SHOTS = [s0, s1];
export const e3introSet = makeSet(SHOTS, V, P);
