// Science part 1, section 5 "the cable": nine shots, timed to the words.
//   0 the planet; magnifying glasses pop up all over it (scientists everywhere start looking)
//   1 hammers of many colours close in on the stopwatch reading 60 (not to believe it, to break it). Host right.
//   2 calendar SEP 2011 flips to FEB 2012; a magnifier sweeps a rack of instruments and stops on a spark
//   3 a GPS box with its dish, an orange fibre cable to a computer; the camera runs along the cable to the plug: a gap of light
//   4 a clock in the box ticking wrong: its hands jump, it goes red
//   5 the plug is pushed home; the stopwatch's 60 rolls down to 0. Host left.
//   6 a second lab, ICARUS: a pulse of light and a neutrino race side by side and cross the line together: =
//   7 the tower of blocks on c from section 1 stands again, straight; a gold trophy lands on top (Einstein won)
//   8 who found it: a newspaper ✗, a domed government building ✗, the lab ✓; a calendar "< 1 YEAR". Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { globe, calPage, calFlip } from "./props.js";
import { P, G0, mix, dur, pop, paperBg, room, stopwatch, hammer, magnifier, cablePlug, gpsBox, clock, neutrino, photon, lab, trophy } from "./sci.js";
import { monitor } from "./props.js";

const hammerCols = [[P.coral, P.coralD], [P.blue, P.blueD], [P.pink, P.pinkD], [P.mint, P.mintD], [P.gold, P.goldD], ["#b58cff", "#8a5be0"]];

// ---- 0: people everywhere start looking ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.1], [4.86, 960, 540, 0.95]]);
  const spots = [[-0.5, -0.4], [0.3, -0.6], [0.6, 0.1], [-0.2, 0.3], [0.1, -0.1], [-0.7, 0.2], [0.45, 0.55], [-0.35, 0.65]];
  const mg = spots.map(([x, y], i) => { const t0 = 2.5 + i * 0.22; return a > t0 ? at(960 + x * 330, 540 + y * 330, magnifier(48, "", "c0" + i), pop(a - t0), -20 + 40 * Math.sin(tot * 2 + i)) : ""; }).join("");
  return { g: paperBg(c, tot) + layer(at(960, 540, globe(360, 0.08 + tot * 0.01, { id: "cb0", ...G0 })) + mg, c) };
}
// ---- 1: to break it (host right) ----
function s1(a, tot) {
  const c = camAt(a, [[0, 800, 540, 1.0], [3.93, 800, 540, 1.06]]), CX = 760, CY = 520, t0 = 1.0;
  const hs = hammerCols.map((hc, i) => { const p = seg(a, t0 + i * 0.1, t0 + i * 0.1 + 0.35), back = seg(a, t0 + 0.7, t0 + 1.1), ang = -Math.PI / 2 + i * Math.PI / 3 + 0.3, d = lerp(520, 250, easeIn(p)) + 150 * ease(back);
    return a > t0 - 0.3 + i * 0.1 ? at(CX + Math.cos(ang) * d, CY + Math.sin(ang) * d, hammer(...hc), 0.85, ang * 57.3 + 180) : ""; }).join("");
  const hit = a > t0 + 0.35 && a < t0 + 0.9 ? rings(CX, CY, 150 + 150 * seg(a, t0 + 0.35, t0 + 0.9), "#fff", 0.3) : "";
  return { g: paperBg(c, tot) + layer(at(CX, CY, stopwatch(170, 0.17, "60", { bigFill: P.coral }), 1 + 0.03 * Math.sin(tot * 20) * (a > t0 + 0.35 && a < t0 + 0.8 ? 1 : 0)) + hs + hit, c), out: toScreen(c, CX, CY), outC: P.cream };
}
// ---- 2: five months on, the team finds it ----
const rack = () => `${two(rr(-420, -560, 840, 560, 10), "#5a6585", "#454e6b", 0, 10)}${[0, 1, 2, 3].map((r) => `<path d="${rr(-390, -530 + r * 132, 780, 110, 8)}" fill="#2f3650"/>${[0, 1, 2, 3, 4, 5].map((q) => `<circle cx="${-340 + q * 60}" cy="${-475 + r * 132}" r="10" fill="${(r + q) % 3 ? P.green : P.gold}"/>`).join("")}<path d="M60 ${-490 + r * 132}h240" stroke="${P.steel}" stroke-width="8"/>`).join("")}`;
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [3.21, 1000, 560, 1.1]]);
  const cal = a < 1.1 ? calFlip("2011", "SEP", seg(a, 0.75, 1.1), 150) : at(0, 0, calPage("2012", "FEB", 1, 150), pop(a - 1.1));
  const sx = kf(a, [[0, 700], [1.4, 1300], [2.0, 860], [2.4, 1060]]), sy = kf(a, [[0, 380], [1.4, 520], [2.0, 420], [2.4, 600]]);
  const spark = a > 2.4 ? rings(1060, 600, 40 + 30 * Math.sin(tot * 20), P.gold, 0.4) : "";
  return { g: paperBg(c, tot) + layer(at(1060, 900, rack()) + spark + at(sx + 70, sy + 70, magnifier(110, "", "c2"), 1, 0) + at(300, 300, cal, 0.85), c), out: toScreen(c, 1060, 600), outC: P.gold };
}
// ---- 3: a fibre cable from the GPS to the computer; the plug is not all the way in ----
function s3(a, tot) {
  const G = 860, c = camAt(a, [[0, 960, 560, 0.9], [2.6, 1020, 600, 0.95], [3.7, 1330, 620, 3.2], [4.65, 1330, 620, 3.4]]);
  const gps = at(330, G, gpsBox(Math.sin(tot * 6) > 0 ? 1 : 0), 1.3);
  const pc = at(1600, G, monitor("#cfe9ff", `<path d="M-160 -330h200M-160 -290h260M-160 -250h140" stroke="${P.blueD}" stroke-width="12" stroke-linecap="round"/>`), 0.9);
  const plug = at(1300, 620, cablePlug(0.55, tot), 0.5);
  const lead = `<path d="M440 ${G - 100}Q700 ${G - 100} 760 640Q800 620 950 620" stroke="#ff9f43" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M1410 620Q1500 620 1500 700V${G - 120}" stroke="${P.steelD}" stroke-width="12" fill="none"/>`;
  const glow = a > 3.7 ? rings(1300 - 60 * 0.5 * 0.55 + 4, 620, 18 + 6 * Math.sin(tot * 12), "#fff3b0", 0.6) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="${P.floor}"/>` + lead + gps + pc + plug + glow, c), in: [960, 560], inC: P.gold };
}
// ---- 4: and a clock running wrong ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [1.93, 960, 540, 1.08]]), bad = seg(a, 0.6, 1.0);
  const h = 3 + a * 0.4 + bad * Math.sin(tot * 9) * 2, m = (a * 15 + bad * 37 * Math.sin(tot * 5)) % 60;
  return { g: paperBg(c, tot) + layer(at(960, 540, clock(220, h, m, mix(P.blue, P.red, bad), mix(P.blueD, P.redD, bad)), 1 + 0.03 * bad * Math.sin(tot * 30)) + (a > 1.2 ? cross(1230, 330, 56, P.red, a - 1.2) : ""), c) };
}
// ---- 5: plug it in, the 60 rolls to 0 (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1100, 540, 1.0], [5.24, 1120, 540, 1.04]]), push = ease(seg(a, 1.6, 2.1)), roll = seg(a, 2.6, 3.6), v = Math.round(60 * (1 - ease(roll)));
  return { g: paperBg(c, tot) + layer(at(1000, 760, cablePlug(0.55 * (1 - push), tot), 0.8) + at(1300, 330, stopwatch(170, 0.17 * (1 - roll), String(v), { bigFill: v ? P.coral : P.green }), 1) + (roll >= 1 ? check(1520, 200, 50, P.green, a - 3.6) : ""), c) };
}
// ---- 6: ICARUS: exactly the speed of light ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 420, 0.8], [3.0, 960, 420, 0.8], [5.0, 1000, 600, 1.0], [8.99, 1060, 600, 1.06]]), Y = 640;
  const labs = at(560, 340, lab({ tag: "OPERA" }), 0.6) + at(1360, 340, lab({ tag: "ICARUS" }), 0.6 * pop(a - 3.2)) + `<rect x="-500" y="340" width="3000" height="40" fill="${P.green}"/>`;
  const r = seg(a, 5.2, 6.9), x = lerp(240, 1560, ease(r));
  const track = `<path d="${rr(160, Y - 140, 1640, 280, 40)}" fill="#c9a57a"/><path d="M1560 ${Y - 150}V${Y + 150}" stroke="${P.ink}" stroke-width="12"/>`;
  const eq = a > 6.9 ? at(1700, Y, `<path d="M-50 -18H50M-50 18H50" stroke="${P.green}" stroke-width="16" stroke-linecap="round"/>`, pop(a - 6.9)) : "";
  const notF = a > 7.6 ? at(760, Y + 260, `<path d="M-90 0H60l-24 -20v40l24 -20" stroke="${P.ink}" stroke-width="10" fill="${P.ink}"/>` + cross(110, 0, 34, P.red, a - 7.6), 1) : "", notS = a > 8.2 ? at(1160, Y + 260, `<path d="M90 0H-60l24 -20v40l-24 -20" stroke="${P.ink}" stroke-width="10" fill="${P.ink}"/>` + cross(-110, 0, 34, P.red, a - 8.2), 1) : "";
  return { g: paperBg(c, tot) + layer(labs + track + at(x, Y - 60, photon(220), 1.2) + at(x, Y + 60, neutrino(22, 170), 1.2) + eq + notF + notS, c), out: toScreen(c, 1700, Y), outC: P.green };
}
// ---- 7: back to the speed of light; Einstein won ----
const blockCols = [[P.violet, P.violetD], [P.blue, P.blueD], [P.coral, P.coralD], [P.gold, P.goldD], [P.mint, P.mintD], [P.pink, P.pinkD]];
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 520, 0.74], [4.92, 960, 500, 0.76]]), BASE = 1000, n = 10;
  let blocks = ""; for (let i = 0; i < n; i++) { const [cc, cD] = blockCols[i % 6], p = seg(a, 0.3 + i * 0.12, 0.6 + i * 0.12), w = 360 - (i % 3) * 40 + (i % 2) * 30, y = BASE - 120 - (i + 1) * 80;
    if (p > 0) blocks += at(960, lerp(y - 300, y, easeOut(p)), `<path d="${rr(-w / 2, 0, w, 76, 8)}" fill="${cD}"/><path d="${rr(-w / 2, 0, w - 10, 70, 8)}" fill="${cc}"/>`); }
  const top = BASE - 120 - n * 80;
  const glow = a > 2.9 ? rings(960, BASE - 60, 200 * spring(a - 2.9, 6, 10), P.gold, 0.25) : "";
  const tr = a > 4.0 ? at(960, lerp(top - 300, top, easeOut(seg(a, 4.0, 4.3))), trophy(), 1.3) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${BASE}" width="3000" height="400" fill="${P.floor}"/>` + glow + two(rr(760, BASE - 120, 400, 120, 12), P.gold, P.goldD, 0, 10) + text(960, BASE - 22, "c", 110, "#8a5200") + blocks + tr, c), in: toScreen(c, 960, BASE - 60), inC: P.green };
}
// ---- 8: not a journalist, not a government: science itself, within a year (host right) ----
const paper = () => `${two(rr(-110, -150, 220, 150, 8), "#fffaf0", P.creamD, 6, 6)}<path d="M-90 -126h180" stroke="${P.ink}" stroke-width="16"/>${[0, 1, 2].map((i) => `<path d="M-90 ${-90 + i * 26}h${80 + (i % 2) * 40}" stroke="${P.steelD}" stroke-width="8"/>`).join("")}<path d="${rr(40, -100, 50, 60, 4)}" fill="${P.steel}"/>`;
const dome = () => `${two(rr(-160, -170, 320, 170, 6), "#f3dfb6", "#e3c79a", 10, 0)}${[-110, -40, 40, 110].map((x) => `<path d="${rr(x - 14, -160, 28, 150, 4)}" fill="#e3c79a"/>`).join("")}${two("M-120 -170A120 120 0 0 1 120 -170Z", P.steel, P.steelD, 0, 8)}<path d="M0 -290V-330" stroke="${P.steelD}" stroke-width="8"/><path d="M0 -330l40 10l-40 12Z" fill="${P.red}"/>`;
function s8(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [5.18, 800, 560, 1.03]]), Y = 640;
  const items = [[300, at(0, 0, paper(), 1.5), 1.8, false], [760, at(0, 0, dome(), 1.4), 2.6, false], [1260, at(0, 0, lab({}), 0.85), 3.2, true]];
  const row = items.map(([x, g, t, ok]) => (a > t - 0.4 ? at(x, Y, g, pop(a - t + 0.4)) + (a > t ? (ok ? check(x, Y - 560, 60, P.green, a - t) : cross(x, Y - 420, 60, P.red, a - t)) : "") : "")).join("");
  const cal = a > 4.3 ? at(1260, 860, `<path d="${rr(-170, -50, 340, 100, 20)}" fill="${P.ink}"/>${text(0, 30, "< 1 YEAR", 64, P.gold)}`, pop(a - 4.3)) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${Y}" width="3000" height="500" fill="${P.floor}"/>` + row + cal, c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8];
export const cableSet = makeSet(SHOTS, [], P);
