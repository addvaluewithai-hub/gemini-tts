// Crypto part 4, scene "dict": two words from the human dictionary (shot list: explain-crypto-04-world/shots.md).
//   0 HODL: a keyboard types H-O-L-D, 2013; the L and D jump places; the word becomes a banner; a clamp grips the coin
//     while the price line storms past it
//   1 FOMO (host right): a train leaves with the coin on board; little houses hop after it up the hill toward the peak
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4dict.v.js";
import { stars, skyline, house } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 3000, 1080, tot), c, 0.15);
const label = (w, a, x = 960, y = 110) => a > 0 ? at(x, y, `<path d="${rr(-(w.length * 34 + 60) / 2, -64, w.length * 34 + 60, 100, 22)}" fill="${P.gold}"/>${text(0, 14, w, 76, P.ink)}`, pop(a)) : "";
// one key cap with a letter, pressed when `down` > 0
const cap = (ch, down = 0, hot = 0) => `<path d="${rr(-56, -56 + 10 * down, 112, 112, 16)}" fill="${mix("#3a2f7a", P.gold, hot)}"/><path d="${rr(-48, -60 + 10 * down, 96, 96, 12)}" fill="${mix("#5a4aa8", "#ffe28a", hot)}"/>${text(0, 18 + 10 * down, ch, 64, P.cream)}`;

// ---- 0: HODL ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.05], [5.5, 960, 520, 1.1], [6.7, 960, 640, 1.3], [8.28, 970, 660, 1.4]]);
  // the four keys are typed in turn, then L and D swap places in an arc
  const typed = [3.3, 3.55, 3.8, 4.05], letters = ["H", "O", "L", "D"], swap = ease(seg(a, 4.55, 5.2)), banner = seg(a, 5.7, 6.2);
  let keys = "";
  letters.forEach((ch, i) => { if (a < typed[i] - 0.3) return; let x = 600 + i * 240, y = 560;
    if (i === 2) { x = lerp(600 + 480, 600 + 720, swap); y = 560 - 180 * Math.sin(Math.PI * swap); }
    if (i === 3) { x = lerp(600 + 720, 600 + 480, swap); y = 560 + 160 * Math.sin(Math.PI * swap); }
    const down = a > typed[i] && a < typed[i] + 0.12 ? 1 : 0, hot = i >= 2 ? seg(a, 4.5, 4.7) * (1 - seg(a, 5.3, 5.7)) : 0;
    keys += at(x, y - 210 * banner, cap(ch, down, hot), (1.45 - 0.45 * banner) * pop(a - typed[i] + 0.3)); });
  const flag = banner > 0 ? at(960, 350, `<path d="M-460 -80H460L420 0L460 80H-460L-420 0Z" fill="${P.red}"/>`, [ease(banner), 1]) : "";
  const cal = a > 4.6 ? at(1600, 560, calPage("2013", "", 1, 130), 0.6 * pop(a - 4.6), 6) : "";
  // the clamp holds the coin while a jagged line storms past
  const hold = a - 6.8, storm = seg(a, 7.0, 8.2);
  const line = hold > 0 ? `<path d="M300 ${700}L520 520L700 860L880 480L1060 900L1240 560L1420 820L1640 600" fill="none" stroke="${P.red}" stroke-width="10" stroke-linejoin="round" pathLength="1" stroke-dasharray="${storm.toFixed(3)} 1"/>` : "";
  const clampG = hold > 0 ? at(960, 720, `${two(rr(-150, -40, 60, 200, 10), P.steel, P.steelD, 0, 8)}${two(rr(90, -40, 60, 200, 10), P.steel, P.steelD, 0, 8)}<path d="M-120 140H120" stroke="${P.steelD}" stroke-width="30"/>${coin(80, "B")}`, pop(hold), 3 * Math.sin(a * 30) * storm * (1 - storm)) : "";
  const g = night(c, tot, 61) + layer(flag + keys + cal + line + clampG, c) + label("HODL", a < 6.4 ? a - 1.5 : -1);
  return { g, out: toScreen(c, 960, 720), outC: P.gold, outZ: 16 };
}

// a little train: an engine and one open wagon, facing right, base on y = 0
const train = (wheel) => `${two(rr(-420, -160, 260, 130, 14), P.blue, P.blueD, 0, 10)}${two(rr(-120, -220, 300, 190, 18), P.red, P.redD, 0, 10)}<path d="${rr(110, -300, 50, 90, 8)}" fill="${P.ink}"/><path d="${rr(-80, -190, 120, 70, 10)}" fill="#bfe6ff"/>
  ${[-370, -210, -60, 100].map((x) => `<circle cx="${x}" cy="-24" r="30" fill="${P.ink}"/><path d="M${x} -24L${(x + Math.cos(wheel) * 24).toFixed(1)} ${(-24 + Math.sin(wheel) * 24).toFixed(1)}" stroke="${P.steel}" stroke-width="7"/>`).join("")}`;

// ---- 1: FOMO (host right: lower right corner clear) ----
function s1(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.0], [1.4, 900, 560, 1.0], [4.62, 1040, 470, 0.95]]);
  const G = 860, go = easeIn(seg(a, 1.4, 4.4)), tx = lerp(700, 2200, go), ty = G - 330 * go;
  // the hill toward the peak, with a gold flag at the top
  const hill = `<path d="M-400 ${G}H500L2200 ${G - 400}L2600 ${G - 400}V1600H-400Z" fill="#2c1f63"/><path d="M500 ${G}L2200 ${G - 400}" stroke="${P.gold}" stroke-width="8" opacity=".5"/>` + at(2260, G - 400, `<path d="M0 0V-150" stroke="${P.steel}" stroke-width="8"/><path d="M0 -150l90 30l-90 30Z" fill="${P.gold}"/>`);
  const tr = at(tx, ty, `<g transform="scale(-1 1)">${train(-(tot * 8 * go + 1))}</g>` + at(-20, -250, rings(0, 0, 80, P.gold, 0.2) + coin(64, "B")), 1.25, -13 * Math.min(1, go * 4));
  const smoke = a > 1.4 ? [0, 1, 2].map((i) => { const u = ((a * 1.4 + i / 3) % 1); return `<circle cx="${(tx + 140 - 160 * u).toFixed(0)}" cy="${(ty - 280 - 140 * u).toFixed(0)}" r="${(20 + 30 * u).toFixed(0)}" fill="#cfd6ff" opacity="${(0.5 * (1 - u)).toFixed(2)}"/>`; }).join("") : "";
  // little houses hop after it up the slope, from 3.2
  let hs = ""; const cols = [[P.teal, P.tealD], [P.pink, P.pinkD], [P.violet, P.violetD], [P.gold, P.goldD]];
  cols.forEach(([col, colD], i) => { const t0 = 3.0 + i * 0.18; if (a < t0) { hs += at(160 + i * 120, G, house(col, colD, { lit: [1, 1, 1] }), 0.5); return; }
    const u = a - t0, x = 160 + i * 120 + 300 * u, y = (x < 500 ? G : G - (x - 500) * 400 / 1700) - Math.abs(Math.sin(u * 9)) * 60; hs += at(x, y, house(col, colD, { lit: [1, 1, 1] }), 0.5); });
  const g = night(c, tot, 67) + layer(skyline(71, -800, 3000, G - 20, 60, 180, "#1f1652", "#ffb066"), c, 0.45) + layer(hill + smoke + tr + hs, c) + label("FOMO", a - 0.1, 760);
  return { g, in: [960, 540], inC: P.gold, inZ: 16 };
}

const SHOTS = [s0, s1];
export const c4dictSet = makeSet(SHOTS, V, P);
