// "One machine" (electricity part 2 of 4): grids joined into continents, and what that costs.
//   0 Europe at night, lines lighting from PORTUGAL to TURKEY; 400,000,000+
//   1 generator wheels all over the map turning in step; a gold belt links them into one machine
//   2 three countries: one station falls, the neighbours fill in; trouble spreads; power traded back and forth; wind (host right)
//   3 2018: KOSOVO and SERBIA flash red; the whole grid slows a hair: 50 → 49.996
//   4 an oven clock and an alarm clock fall behind: −6 min; 25 countries
//   5 Japan in two colours: 1895 TOKYO buys German 50, 1896 OSAKA buys American 60; a narrow converter bridge between
//   6 2011: the east short, the west with spare power; only a trickle crosses the bridge; the east goes dark block by block
// Calm and plain throughout; no people, no disaster imagery.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./grid.v.js";
import { P, E, mix, house, stars, pop, station, plate, tagV, flag } from "./elec.js";
import { calPage, calFlip } from "./props.js";
import { dial, rotor, RED, sky, bump, plant } from "./balance.js";

const LAND = "#164a62", LANDD = "#0f3a4f";
// ---- Europe, stylised (world coordinates about 260..1660 x 180..930) ----
export const EUROPE = "M300 760L360 690L470 700L520 640L470 590L520 520L640 500L700 430L660 370L720 300L800 330L840 260L900 200L980 180L1040 230L1000 300L1060 340L1120 300L1200 320L1300 300L1400 340L1480 400L1560 470L1600 560L1640 640L1660 720L1600 780L1500 800L1420 760L1380 820L1300 840L1250 790L1200 830L1150 790L1100 840L1060 900L1020 860L1040 790L980 740L930 780L880 740L820 760L760 720L700 760L640 820L560 860L470 880L380 860L320 820Z";
export const CITIES = [[400, 780], [520, 690], [640, 600], [760, 520], [880, 460], [980, 380], [1080, 520], [1180, 600], [1280, 560], [1400, 640], [1540, 720], [900, 640], [1020, 700], [1200, 430], [840, 300]];
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 11], [11, 12], [12, 7], [4, 6], [6, 7], [7, 8], [8, 9], [9, 10], [6, 13], [5, 14], [13, 8]];
export const europe = (lit, tot, o = {}) => { const xs = (i) => CITIES[i][0];
  const lines = LINKS.map(([i, j]) => { const L = clamp((lit * 1700 - Math.min(xs(i), xs(j)) + 300) / 260); return L > 0 ? drawn(`M${CITIES[i][0]} ${CITIES[i][1]}L${CITIES[j][0]} ${CITIES[j][1]}`, L, mix(E.el, P.gold, o.gold || 0), 6, 'opacity=".9"') : ""; }).join("");
  const dots = CITIES.map(([x, y], i) => { const on = clamp((lit * 1700 - x + 300) / 160); return `${on > 0 ? rings(x, y, 26, P.win, 0.3 * on, 1.5) : ""}<circle cx="${x}" cy="${y}" r="11" fill="${mix("#2a5a72", P.win, on)}"/>`; }).join("");
  return two(EUROPE, LAND, LANDD, 0, 10) + (o.red || "") + lines + dots; };
// ---- Japan, stylised: four islands along an arc; east half `east` colour, west half `west` colour ----
const JPATH = [[300, 840], [430, 760], [560, 720], [700, 690], [840, 640], [960, 590], [1080, 520], [1180, 440], [1260, 360], [1320, 280]];
export const japan = (o = {}) => { const west = o.west || LAND, east = o.east || LAND, w = 110;
  const seg2 = (pts, col) => `<path d="M${pts.map((p) => p.join(" ")).join("L")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const kyushu = `<ellipse cx="300" cy="860" rx="90" ry="110" fill="${west}"/>`, shikoku = `<ellipse cx="560" cy="820" rx="110" ry="50" fill="${west}"/>`;
  const hokkaido = `<path d="M1300 210Q1420 120 1520 190Q1560 280 1460 320Q1360 330 1300 280Z" fill="${east}"/>`;
  return kyushu + shikoku + seg2(JPATH.slice(1, 6), west) + seg2(JPATH.slice(5), east) + hokkaido + (o.seam ? `<path d="M935 520L985 660" stroke="${P.gold}" stroke-width="${12 * o.seam}" stroke-linecap="round" opacity="${o.seam.toFixed(2)}"/>` : ""); };
const tile = (w, h, col = LAND) => two(rr(-w / 2, -h / 2, w, h, 40), col, LANDD, 0, 10);
// a wind turbine, base on y = 0
const turbine = (h, spin) => `<path d="M-8 0L-4 ${-h}H4L8 0Z" fill="#cfe6f0"/><g transform="translate(0 ${-h}) rotate(${(spin * 180 / Math.PI).toFixed(1)})">${[0, 1, 2].map((i) => `<path d="M0 0L${h * 0.06} ${-h * 0.55}L0 ${-h * 0.6}L${-h * 0.03} ${-h * 0.1}Z" fill="#e8f6ff" transform="rotate(${i * 120})"/>`).join("")}</g><circle cx="0" cy="${-h}" r="${h * 0.05}" fill="#cfe6f0"/>`;
// a dot travelling along a straight path
const flowDots = (x0, y0, x1, y1, t, p = 1, col = P.gold, n = 5, sp = 0.9) => p <= 0 ? "" : Array.from({ length: n }, (_, i) => { const q = ((t * sp + i / n) % 1); return `<circle cx="${lerp(x0, x1, q).toFixed(1)}" cy="${lerp(y0, y1, q).toFixed(1)}" r="14" fill="${col}" opacity="${(p * Math.sin(Math.PI * q)).toFixed(2)}"/>`; }).join("");

// ---- 0: one grid from Portugal to Turkey ----
export function g0(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 980, 520, 1.25], [2.0, 960, 540, 1.0], [6.65, 960, 560, 0.96]]);
  const lit = ease(seg(a, 2.93, 4.4)), map = at(0, 0, europe(lit, tot), 1);
  const pt = a > 3.5 ? at(400, 930, plate("PORTUGAL", 50), pop(a - 3.61)) : "", tk = a > 4.0 ? at(1560, 870, plate("TURKEY", 50), pop(a - 4.1)) : "";
  const cnt = a > 5.1 ? at(960, 120, tagV("400,000,000+", "", { size: 96 }), pop(a - 5.26)) : "";
  const g = sky(c, tot, 81) + layer(map + pt + tk + cnt, c);
  return { g, out: toScreen(c, 980, 500), outC: LAND };
}
// ---- 1: thousands of machines, one machine ----
const WH = [[520, 640], [760, 520], [1000, 420], [1240, 520], [1460, 640], [880, 740], [1120, 720], [640, 820], [1320, 820]];
export function g1(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 600, 1.2], [3.6, 960, 600, 1.15], [5.66, 960, 580, 0.9]]), spin = tot * 2 * Math.PI * 0.8, flash = a > 3.17 ? Math.exp(-(a - 3.17) * 4) : 0;
  const map = at(0, 0, europe(1, tot), 1, 0, 'opacity=".55"');
  const wheels = WH.map(([x, y], i) => at(x, y, rotor(78, spin) + (flash > 0 ? rings(0, 0, 90, "#fff3b0", 0.5 * flash, 1.3) : ""), pop(a - 0.27 - i * 0.07))).join("");
  const belt = seg(a, 4.07, 5.0), ring = belt > 0 ? drawn(`M${WH.map((p) => p.join(" ")).join("L")}Z`, belt, P.gold, 14, 'stroke-linejoin="round"') + rings(980, 640, 620, P.gold, 0.12 * belt, 1.1) : "";
  const g = sky(c, tot, 83) + layer(map + ring + wheels, c);
  return { g, in: toScreen(c, 980, 500), inC: LAND, out: toScreen(c, 1000, 420), outC: "#7f93b8" };
}
// ---- 2: neighbours (host right) ----
const TX = [330, 810, 1290], TY = 450;
export function g2(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 960, 520, 1.0], [11.37, 960, 520, 1.02]]), tx = o.tx || TX, ty = o.ty || [TY, TY, TY], v = !!o.vert;
  const ends = (i, j) => (v ? [tx[i], ty[i] + 175, tx[j], ty[j] - 175] : [tx[i] + 200, ty[i], tx[j] - 200, ty[j]]);
  const [a0, a1, a2, a3] = ends(0, 1), [b0, b1, b2, b3] = ends(1, 2), off = (k) => (v ? [k, 0] : [0, k]);
  const fall = seg(a, 1.29, 1.6) * (1 - seg(a, 2.6, 3.0)), help = seg(a, 2.31, 3.0) * (1 - seg(a, 4.6, 5.2));
  const tiles = tx.map((x, i) => at(x, ty[i], tile(400, 340, i === 1 ? mix(LAND, "#3a2a3a", fall) : LAND) + at(0, 120, plant(tot + i, i === 1 ? 1 - fall : 1), 0.36) + (i === 1 && fall > 0 ? cross(0, -60, 50, RED, a - 1.4) : ""), pop(a - 0.1 - i * 0.12))).join("");
  const wires = `<path d="M${a0} ${a1}L${a2} ${a3}M${b0} ${b1}L${b2} ${b3}" stroke="${E.grid}" stroke-width="10"/>`;
  const fill = flowDots(a0, a1, a2, a3, tot, help) + flowDots(b2, b3, b0, b1, tot, help);
  const pr = seg(a, 3.88, 4.9), trouble = pr > 0 && pr < 1 ? rings(tx[1], ty[1], 200 + 700 * pr, RED, 0.25 * (1 - pr), 1.05) : "";
  const tr = seg(a, 5.36, 5.6) * (1 - seg(a, 7.4, 7.7)), [p, q] = off(-30), [p2, q2] = off(30);
  const trade = tr > 0 ? flowDots(a0 + p, a1 + q, a2 + p, a3 + q, tot, tr, P.gold, 4) + flowDots(a2 + p2, a3 + q2, a0 + p2, a1 + q2, tot, tr, E.el, 4) + flowDots(b0 + p, b1 + q, b2 + p, b3 + q, tot, tr, E.el, 4) + flowDots(b2 + p2, b3 + q2, b0 + p2, b1 + q2, tot, tr, P.gold, 4) : "";
  const wind = a > 7.6 ? [-110, 0, 110].map((dx, i) => at(tx[0] + dx, ty[0] - 40, turbine(150, tot * 4 + i), pop(a - 7.75 - i * 0.1))).join("") : "";
  const sellR = seg(a, 9.3, 9.6) * (1 - seg(a, 10.0, 10.2)), buyL = seg(a, 10.65, 10.9);
  const sell = flowDots(a0, a1, a2, a3, tot, sellR, P.gold, 6, 1.4) + flowDots(a2, a3, a0, a1, tot, buyL, P.gold, 6, 1.4);
  const cal = a > 10.0 ? at(v ? tx[0] - 330 : tx[0], v ? ty[0] - 60 : ty[0] - 300, calPage("+1", "", 0.6, 150), pop(a - 10.13)) : "";
  const g = sky(c, tot, 85) + layer(wires + tiles + fill + trouble + trade + wind + sell + cal, c);
  return { g, in: toScreen(c, tx[1], ty[1]), inC: LAND };
}
// ---- 3: 2018, Kosovo and Serbia; 50 → 49.996 ----
export function g3(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 1160, 700, 2.0], [3.6, 1160, 700, 1.9], [5.0, 960, 560, 1.0], [9.03, 960, 560, 1.0]]);
  const red = seg(a, 1.96, 2.3), redPatch = `<path d="M1120 700L1180 670L1230 720L1200 770L1140 760Z" fill="${mix(LAND, RED, red * (0.6 + 0.4 * Math.sin(tot * 6)))}"/><path d="M1180 760L1230 740L1260 790L1210 820Z" fill="${mix(LAND, RED, red * (0.6 + 0.4 * Math.cos(tot * 6)))}"/>`;
  const map = at(0, 0, europe(1, tot, { red: redPatch }), 1);
  const kv = at(1040, 680, plate("SERBIA", 26), pop(a - 1.55)) + at(1300, 840, plate("KOSOVO", 26), pop(a - 0.3));
  const cal = at(1180, 560, calPage("2018", "", 0.3, 150), pop(a - 0.23) * (1 - seg(a, 4.6, 5.0)));
  const f = 50 - 0.004 * ease(seg(a, 4.62, 5.6)), sh = a > 4.3 ? at(1460, 300, dial(f - 0.12 * ease(seg(a, 4.62, 5.6))), 0.62 * pop(a - 4.36)) : "";
  const val = a > 5.9 ? at(1460, 640, tagV(lerp(50, 49.996, ease(seg(a, 6.15, 8.6))).toFixed(3), "Hz", { size: 84, fill: seg(a, 6.15, 8.6) > 0.95 ? RED : P.gold }), pop(a - 5.9)) : "";
  const g = sky(c, tot, 87) + layer(map + kv + cal + sh + val, c);
  return { g, out: toScreen(c, 1460, 300), outC: P.cream };
}
// ---- 4: the clocks fall behind: −6 min, 25 countries ----
export function g4(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 900, 540, 1.1], [5.87, 920, 540, 1.0]]), back = ease(seg(a, 3.24, 4.0)), m = Math.round(lerp(0, 6, back));
  const disp = `07:${String(m === 0 ? 0 : 60 - m).padStart(2, "0")}`.replace("07:00", "07:00");
  const shown = m === 0 ? "07:00" : "06:" + String(60 - m).padStart(2, "0");
  const oven = at(o.ox ?? 560, o.oy ?? 600, `${two(rr(-260, -230, 520, 460, 24), "#ece8ff", "#c6c0e6", 10, 8)}<path d="${rr(-200, -60, 400, 240, 18)}" fill="#1c2b3a"/><path d="${rr(-170, -30, 340, 180, 12)}" fill="${mix("#3a2a1a", "#ff8a3c", 0.4)}" opacity=".7"/>
    <path d="${rr(-200, -200, 400, 110, 14)}" fill="#04121e"/>${number(0, -118, shown, 80, m > 0 ? RED : E.el)}`, pop(a - 0.05) * bump(a, 3.24, 0.06));
  const alarm = at(o.ax ?? 1220, o.ay ?? 560, `<circle cx="-110" cy="-150" r="40" fill="${P.gold}"/><circle cx="110" cy="-150" r="40" fill="${P.gold}"/>${disc(0, 0, 190, P.cream, P.creamD, 0.06)}${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<path d="M0 -168V-148" stroke="${P.ink}" stroke-width="10" transform="rotate(${i * 30})"/>`).join("")}
    <path d="M0 0L0 -90" stroke="${P.ink}" stroke-width="16" stroke-linecap="round" transform="rotate(${(-0.5 * (360 / 12) * back * 0.2).toFixed(1)})"/><path d="M0 0L0 -140" stroke="${P.ink}" stroke-width="10" stroke-linecap="round" transform="rotate(${(-36 * back).toFixed(1)})"/><circle r="16" fill="${P.ink}"/>`, 0.95 * pop(a - 0.72));
  const tag = a > 3.6 ? at(o.tgx ?? 900, o.tgy ?? 170, tagV("−6", "min", { size: 110, fill: RED }), pop(a - 3.73)) : "";
  const n25 = a > 4.6 ? at(o.nx ?? 1500, o.ny ?? 230, at(-330, -80, europe(1, tot), 0.22) + text(80, 40, "25", 130, P.gold), pop(a - 4.72)) : "";
  const g = sky(c, tot, 89) + layer(`<rect x="-800" y="830" width="3600" height="600" fill="#0a2536"/>` + oven + alarm + tag + n25, c);
  return { g, in: toScreen(c, 1220, 560), inC: P.cream };
}
// ---- 5: Japan, two frequencies since the 1890s ----
export function g5(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 920, 560, 1.0], [11.38, 920, 540, 1.02]]);
  const eastOn = seg(a, 4.25, 4.7), westOn = seg(a, 7.09, 7.5), seam = seg(a, 8.94, 9.3);
  const map = japan({ east: mix(LAND, "#b8862a", eastOn), west: mix(LAND, "#2a8fb0", westOn), seam });
  const cal = at(240, 220, (a < 4.75 ? calPage("1895", "", 0.8, 150) : "") + (a >= 4.75 ? calPage("1896", "", 0.8, 150) : "") + (a >= 4.75 && a < 5.2 ? calFlip("1895", "", (a - 4.75) / 0.45, 150) : ""), pop(a - 0.97));
  const tokyo = a > 2.4 ? at(1260, 520, plate("TOKYO", 50), pop(a - 2.59)) + at(1500, 420, rotor(80, tot * 3) + at(0, -130, flag("de", 110)), pop(a - 3.16)) : "";
  const t50 = a > 4.1 ? at(1520, 640, tagV("50", "Hz", { size: 80 }), pop(a - 4.25)) : "";
  const osaka = a > 5.6 ? at(640, 820, plate("OSAKA", 50), pop(a - 5.73)) + at(420, 560, rotor(80, tot * 3.6) + at(0, -130, flag("us", 110)), pop(a - 6.34)) : "";
  const t60 = a > 6.9 ? at(560, 960, tagV("60", "Hz", { size: 80, fill: E.el }), pop(a - 7.09)) : "";
  const bridge = a > 9.4 ? at(960, 590, `${two(rr(-40, -34, 80, 68, 10), P.steel, P.steelD, 0, 6)}<path d="M-20 0h40" stroke="${P.ink}" stroke-width="8"/>`, pop(a - 9.57)) + flowDots(880, 620, 1040, 560, tot, seg(a, 10.2, 10.6), "#fff3b0", 3, 0.6) : "";
  const g = sky(c, tot, 91) + layer(`<rect x="-900" y="-600" width="3800" height="2400" fill="#071f30" opacity=".6"/>` + map + cal + tokyo + t50 + osaka + t60 + bridge, c);
  return { g, out: toScreen(c, 960, 590), outC: "#071f30" };
}
// ---- 6: 2011, the east short; only a trickle crosses ----
export function g6(a, tot, s, o = {}) {
  const c = camAt(a, [[0, 1000, 520, 1.2], [8.48, 980, 520, 1.12]]);
  const map = japan({ east: "#b8862a", west: "#2a8fb0", seam: 1 });
  const cal = at(520, 200, calPage("2011", "", 0.7, 150), pop(a - 0.1));
  // the east's blocks of lights: from «الشرق» some go dark, and from «بالدور» they take turns
  const B = Array.from({ length: 10 }, (_, i) => [1030 + (i % 5) * 70 + (i > 4 ? 40 : 0), 470 - (i % 5) * 50 + (i > 4 ? 90 : 0)]);
  const short = seg(a, 2.25, 2.7), rot = a > 6.77 ? Math.floor((a - 6.77) / 0.45) : -1;
  const blocks = B.map(([x, y], i) => { const dark = a < 6.77 ? short * (i % 3 === 0 ? 1 : 0) : ((i + rot) % 3 === 0 ? 1 : 0.15 * short); return `<path d="${rr(x - 24, y - 24, 48, 48, 8)}" fill="${mix(P.win, "#0a1a26", dark)}"/>`; }).join("");
  const plus = a > 3.3 ? at(560, 560, `<path d="M-50 0h100M0 -50v100" stroke="#fff3b0" stroke-width="24" stroke-linecap="round"/>` + rings(0, 0, 90, "#9feaff", 0.3, 1.4), pop(a - 3.38)) : "";
  const need = a > 2.2 ? at(1300, 300, `<path d="M-50 0h100" stroke="${RED}" stroke-width="24" stroke-linecap="round"/>`, pop(a - 2.25)) : "";
  const bridge = at(960, 590, `${two(rr(-40, -34, 80, 68, 10), P.steel, P.steelD, 0, 6)}<path d="M-20 0h40" stroke="${P.ink}" stroke-width="8"/>`, 1);
  const trickle = flowDots(720, 690, 1180, 480, tot, seg(a, 4.42, 4.9), "#fff3b0", 2, 0.35) + (a > 4.42 ? rings(960, 590, 70, "#fff3b0", 0.2 * seg(a, 6.0, 6.3), 1.3) : "");
  const tk = a > 7.8 ? at(1260, 640, plate("TOKYO", 46), pop(a - 8.05)) : "";
  const g = sky(c, tot, 93) + layer(`<rect x="-900" y="-600" width="3800" height="2400" fill="#071f30" opacity=".6"/>` + map + blocks + cal + plus + need + bridge + trickle + tk, c);
  return { g, in: toScreen(c, 960, 590), inC: "#071f30" };
}

const SHOTS = [g0, g1, g2, g3, g4, g5, g6];
export const gridSet = makeSet(SHOTS, V, P);
export { LAND, LANDD, turbine, flowDots, tile };
