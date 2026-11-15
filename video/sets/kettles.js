// "A power station counted in kettles" (electricity part 2): five shots, no people.
//   0 a night kitchen counter, a far station with a "?" over it; on «الغلاية» the kettle lands on the counter and steams
//   1 the kettle big: 2,000 W, then 2,000 J every second with a stopwatch
//   2 a power station, 1,000 MW (1 MW = 1,000,000 W); a field of kettles fills behind it and the count rolls to 500,000
//   3 THREE GORGES, the dam, 22,500 MW; the field grows as the camera pulls back and the count rolls to 11,000,000
//   4 the night town: in every window a kettle, an air conditioner and a screen; on «الزرار» they all switch on at once and
//     the station on the left strains (host right: the lower right corner stays clear)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, FW, FH, makeSet } from "./kit.js";
import { fmt } from "./bank.js";
import { P, E, mix, stars, skyline, kettle, station, tagV, plate, flag } from "./elec.js";
import { dam, kettleMark, kettleField, acUnit, screenProp } from "./elec2.js";
import { V } from "./kettles.v.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const sky = (c, tot, seed = 5) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1500, 3400, 800, tot), c, 0.12);
const roll = (a, t0, t1, to) => Math.round(lerp(0, to, easeOut(seg(a, t0, t1))));
// a stopwatch (centre), r; turn 0..1 of the hand
const stopwatch = (r, turn) => `${disc(0, 0, r, "#ece8ff", "#c6c0e6", 0.08)}<circle r="${r * 0.82}" fill="#fff"/><path d="${rr(-r * 0.14, -r * 1.3, r * 0.28, r * 0.24, 6)}" fill="#c6c0e6"/><path d="M0 0L${(r * 0.7 * Math.sin(turn * 2 * Math.PI)).toFixed(1)} ${(-r * 0.7 * Math.cos(turn * 2 * Math.PI)).toFixed(1)}" stroke="${P.red}" stroke-width="${r * 0.08}" stroke-linecap="round"/><circle r="${r * 0.08}" fill="${P.ink}"/>`;
// the kitchen counter (wall tiles and a worktop), worktop top at y = G
const kitchen = (G) => `<rect x="-1200" y="-800" width="4400" height="${G + 800}" fill="#0e3247"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${-1200 + i * 150} -800V${G}" stroke="#0b2a3c" stroke-width="4"/>`).join("")}${Array.from({ length: 12 }, (_, j) => `<path d="M-1200 ${-800 + j * 150}H3200" stroke="#0b2a3c" stroke-width="4"/>`).join("")}
  <rect x="-1200" y="${G}" width="4400" height="40" fill="${P.wood}"/><rect x="-1200" y="${G + 40}" width="4400" height="700" fill="${P.woodD}"/>`;

// ---- 0: count it in kettles ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [3.4, 960, 520, 1.05], [4.6, 1080, 640, 1.35], [5.26, 1090, 650, 1.42]]), G = 820;
  const win = `<path d="${rr(240, 120, 720, 460, 20)}" fill="#04121e"/>` + `<g clip-path="url(#kwin)"><clipPath id="kwin"><path d="${rr(240, 120, 720, 460, 20)}"/></clipPath>${skyline(4, 240, 960, 560, 60, 160, E.far, E.farLit)}${at(600, 560, station(tot, { lit: 1 }), 0.38)}</g><path d="${rr(240, 120, 720, 460, 20)}" fill="none" stroke="#c6c0e6" stroke-width="16"/><path d="M600 120V580M240 350H960" stroke="#c6c0e6" stroke-width="10"/>`;
  const q = a > 1.29 ? at(600, 220, `${rings(0, -20, 70, P.gold, 0.25)}${text(0, 30, "?", 140, P.gold)}`, pop(a - 1.29) * (1 - ease(seg(a, 4.2, 4.6)))) : "";
  const land = a > 4.54 ? spring(a - 4.54, 9, 14) : 0, ky = a > 4.2 ? lerp(-400, G, easeIn(seg(a, 4.2, 4.54))) : -900;
  const k = a > 4.2 ? at(1180, ky, kettle(tot, a > 4.54 ? 1 : 0), [1.15 + 0.15 * (1 - land) * (a > 4.54 ? 1 : 0), 1.15 - 0.12 * (1 - land) * (a > 4.54 ? 1 : 0)]) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#0e3247"/>` + layer(kitchen(G) + win + q + k, c);
  return { g, out: toScreen(c, 1180, G - 170), outC: "#ece8ff", outZ: 14 };
}
// ---- 1: 2,000 W, 2,000 J every second ----
function s1(a, tot) {
  const c = camAt(a, [[0, 1060, 560, 1.0], [4.93, 1020, 560, 1.06]]), G = 860;
  const k = at(760, G, kettle(tot, 1), 2.1);
  const w = a > 2.41 ? at(1380, 330, tagV(fmt(roll(a, 2.41, 2.9, 2000)), "W", { size: 110 }), pop(a - 2.41) * (1 - ease(seg(a, 3.2, 3.45))) * (a < 3.45 ? 1 : 0)) : "";
  const j = a > 3.25 ? at(1380, 330, tagV("2,000 J", "", { size: 100 }), pop(a - 3.25)) + at(1380, 560, stopwatch(110, (a - 3.25) % 1), pop(a - 3.5)) + (a > 3.6 ? at(1380, 720, text(0, 0, "/ 1 s", 80, E.el), pop(a - 4.23)) : "") : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#0e3247"/>` + layer(kitchen(G) + k + w + j, c);
  return { g, in: toScreen(c, 760, G - 300), inC: "#ece8ff", inZ: 14, out: toScreen(c, 760, G - 300), outC: P.ink, outZ: 14 };
}
// a hill landscape at night with the ground at G
const land = (G) => `<path d="M-3000 ${G}Q-1500 ${G - 80} 0 ${G}T3000 ${G}T6000 ${G}V${G + 3000}H-3000Z" fill="${P.ground}"/>`;
// ---- 2: one station = half a million kettles ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [2.0, 960, 520, 1.02], [5.8, 960, 560, 0.86], [9.05, 960, 600, 0.62]]), G = 760;
  const st = at(960, G, station(tot, { lit: 1 }), 1.1) + (a > 2.04 ? rings(960, G - 200, 360, P.gold, 0.12 * seg(a, 2.04, 2.4)) : "");
  const mw = a > 2.04 ? at(960, 140, tagV("1,000", "MW", { size: 100 }), pop(a - 2.04)) : "";
  const unit = a > 3.81 ? at(960, 270, text(0, 0, "1 MW = 1,000,000 W", 56, E.el), pop(a - 3.81)) : "";
  // the field fills from the station outwards, under the street lights
  const f = ease(seg(a, 6.02, 7.6)), FWd = lerp(0, 2600, f);
  const field = f > 0 ? kettleField("kf2", 960 - FWd / 2, G + 20, FWd, lerp(0, 520, f), 46) : "";
  const cnt = a > 6.02 ? at(960, G + 330, `${two(rr(-330, -90, 660, 130, 60), P.ink, "#020c16", 0, 6)}${at(-230, -25, kettleMark(), 1.3)}${number(60, 12, fmt(roll(a, 6.02, 7.7, 500000)), 92, P.gold)}`, pop(a - 6.02)) : "";
  const g = sky(c, tot, 9) + layer(skyline(21, -1500, 3400, G - 40, 80, 220, E.far, E.farLit), c, 0.4) + layer(land(G) + field + st + mw + unit + cnt, c);
  return { g, in: toScreen(c, 960, G - 150), inC: P.ink, inZ: 14, out: toScreen(c, 960, G - 150), outC: "#0f3a55", outZ: 12 };
}
// ---- 3: Three Gorges = eleven million kettles ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [3.0, 960, 500, 0.95], [6.8, 960, 560, 0.62], [9.23, 960, 640, 0.36]]), G = 760;
  const d = at(960, G, dam(tot, 1100, 520, 1));
  const nm = a > 3.38 ? at(960, 120, plate("THREE GORGES", 64) + at(330, 0, flag("cn", 110)), pop(a - 3.38)) : "";
  const mw = a > 4.6 ? at(960, 260, tagV(fmt(roll(a, 4.6, 6.36, 22500)), "MW", { size: 96 }), pop(a - 4.6)) : "";
  const f = ease(seg(a, 6.89, 8.4)), W = lerp(0, 5600, f), H = lerp(0, 1500, f);
  const field = f > 0 ? kettleField("kf3", 960 - W / 2, G + 30, W, H, 46) : "";
  const cnt = a > 6.89 ? at(960, G + 520, `${two(rr(-560, -150, 1120, 220, 100), P.ink, "#020c16", 0, 10)}${at(-410, -40, kettleMark(), 2.2)}${number(90, 20, fmt(roll(a, 6.89, 8.3, 11000000)), 150, P.gold)}`, pop(a - 6.89)) : "";
  const g = sky(c, tot, 13) + layer(land(G) + field + d + nm + mw + cnt, c);
  return { g, in: toScreen(c, 960, G - 260), inC: "#0f3a55", inZ: 12, out: toScreen(c, 960, G - 260), outC: P.ink, outZ: 16 };
}
// ---- 4: millions of everything, all at the same moment (host right) ----
const ROWS = 3, COLS = 4, WX0 = 520, WY0 = 220, WW = 220, WH = 190;
function s4(a, tot) {
  const c = camAt(a, [[0, 900, 520, 1.0], [6.4, 880, 520, 1.03], [7.39, 870, 520, 1.06]]), G = 900;
  const on = a > 6.9 ? ease(seg(a, 6.9, 7.05)) : 0, shake = a > 6.9 ? 8 * Math.exp(-(a - 6.9) * 5) * Math.sin((a - 6.9) * 60) : 0;
  const block = `${two(rr(WX0 - 50, WY0 - 60, COLS * WW + 80, ROWS * WH + 130 + (G - (WY0 + ROWS * WH + 70)), 14), "#0f3a55", "#0a2b40", 12, 0)}`;
  let wins = "";
  for (let r = 0; r < ROWS; r++) for (let k = 0; k < COLS; k++) { const x = WX0 + k * WW, y = WY0 + r * WH, i = r * COLS + k;
    wins += `<path d="${rr(x, y, WW - 40, WH - 50, 10)}" fill="${mix("#04121e", "#ffcf6b", on * 0.85)}"/>`;
    const kk = a > 1.36 + i * 0.03 ? at(x + 45, y + 110, kettleMark(), 0.9 * pop(a - 1.36 - i * 0.03)) : "";
    const ac = a > 2.72 + i * 0.03 ? at(x + 120, y + 40, acUnit(on, tot), 0.42 * pop(a - 2.72 - i * 0.03)) : "";
    const sc = a > 3.82 + i * 0.03 ? at(x + 128, y + 106, screenProp(on), 0.32 * pop(a - 3.82 - i * 0.03)) : "";
    wins += kk + ac + sc; }
  const st = at(220, G, station(tot, { lit: 1 }), 0.62) + (on > 0 ? rings(220, G - 150, 230 + 40 * Math.sin(a * 30), P.red, 0.25 * on, 1.3) : "");
  const wire = `<path d="M330 ${G - 160}Q420 ${G - 300} ${WX0 - 50} ${WY0 + 40}" fill="none" stroke="#04192a" stroke-width="8"/>` + (on > 0 ? drawn(`M330 ${G - 160}Q420 ${G - 300} ${WX0 - 50} ${WY0 + 40}`, 1, P.gold, 8) : "");
  const g = sky(c, tot, 17) + layer(skyline(41, -1500, 3400, G - 40, 80, 200, E.far, E.farLit), c, 0.4) + layer(`<rect x="-1200" y="${G}" width="4400" height="600" fill="${P.ground}"/>` + `<g transform="translate(${shake.toFixed(1)} 0)">${st}</g>` + wire + block + wins, c);
  return { g, in: toScreen(c, 520 + 2 * WW, 520), inC: P.ink, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4];
export { s0, s1, s2, s3, s4, kitchen, land };
export const kettlesSet = makeSet(SHOTS, V, P);
