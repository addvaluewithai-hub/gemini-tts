// "Who won" (electricity part 1): seven shots, no people.
//   0 night planet: from the station over pylons to a socket, an AC wave runs all the way
//   1 behind the socket, a shelf of devices: phone, laptop, bulb, solar panel, electric car; each shows a straight DC line inside
//   2 the charger cube, big: a wave goes in, a straight line comes out
//   3 the teal house cut open: twenty little cubes in its rooms, each flying a tiny white flag (a truce); 20 (host right)
//   4 China at night: a line is drawn across the country, west to east; DC; 2019
//   5 the same line, pulled back: 3,300 km
//   6 a pylon, 1,100,000 V; an AC line sheds sparks along the way, the DC line beside it hardly any
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { fmt } from "./bank.js";
import { calPage, hills, laptop, car } from "./props.js";
import { P, E, mix, house, stars, skyline, pop, bulb, station, pylon, pylonTips, socket, charger, plate, tagV, flag, battery } from "./elec.js";

const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 2900, 760, tot), c, 0.12);
const sine = (x0, x1, y, amp, n, phase = 0) => { let d = ""; for (let i = 0; i <= 80; i++) { const x = lerp(x0, x1, i / 80); d += (i ? "L" : "M") + x.toFixed(1) + " " + (y + amp * Math.sin(phase + (i / 80) * n * 2 * Math.PI)).toFixed(1); } return d; };
// the DC mark: a small pill with a straight arrow (centre)
const dcMark = (w = 150) => `${two(rr(-w / 2, -34, w, 68, 34), P.ink, "#020c16", 0, 6)}<path d="M${-w / 2 + 22} 0H${w / 2 - 34}" stroke="${E.el}" stroke-width="10" stroke-linecap="round"/><path d="M${w / 2 - 40} -16L${w / 2 - 18} 0L${w / 2 - 40} 16Z" fill="${E.el}"/>`;
const acMark = (w = 150, ph = 0) => `${two(rr(-w / 2, -34, w, 68, 34), P.ink, "#020c16", 0, 6)}${drawn(sine(-w / 2 + 20, w / 2 - 20, 0, 16, 2, ph), 1, P.gold, 9)}`;
// devices (base on y = 0)
const phone = (inner = "") => `${two(rr(-90, -380, 180, 380, 26), "#ece8ff", "#c6c0e6", 10, 0)}<path d="${rr(-74, -350, 148, 310, 14)}" fill="#0b4152"/>${inner}<circle cx="0" cy="-20" r="10" fill="#c6c0e6"/>`;
const solar = () => `<path d="M-20 0L0 -150L20 0Z" fill="${P.steelD}"/><g transform="translate(0 -150) skewX(-14)">${two(rr(-200, -150, 400, 170, 10), "#1f4fa0", "#163a7a", 0, 8)}${[0, 1, 2, 3, 4].map((i) => `<path d="M${-200 + i * 80} -150V20" stroke="#5f97ee" stroke-width="4"/>`).join("")}<path d="M-200 -65H200" stroke="#5f97ee" stroke-width="4"/></g>`;
// a straight DC flow inside a device (dots running one way along a line from x0 to x1 at y)
const dcFlow = (x0, x1, y, t, p = 1) => { if (p <= 0) return ""; let d = `<path d="M${x0} ${y}H${lerp(x0, x1, p)}" stroke="${E.el}" stroke-width="8" stroke-linecap="round" opacity=".5"/>`; for (let i = 0; i < 5; i++) { const q = ((t * 0.8 + i / 5) % 1); if (q < p) d += `<circle cx="${lerp(x0, x1, q)}" cy="${y}" r="9" fill="${E.el}"/>`; } return d; };

// ---- 0: the grid is AC from the station to the socket ----
function v0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 0.94], [4.89, 1000, 560, 1.0]]), G = 860;
  const planet = `<path d="M-900 ${G}Q960 ${G - 140} 2900 ${G}V${G + 900}H-900Z" fill="${P.ground}"/>`;
  const PX = [640, 980, 1320], tipY = G - 470 + 30;
  const line = `M330 ${G - 300}` + PX.map((x) => `L${x} ${tipY}`).join("") + `L1520 ${G - 420}`;
  const run = seg(a, 0.98, 2.7), ph = -tot * 9;
  const wave = run > 0 ? drawn(line, run, E.el, 6) + drawn(sine(330, lerp(330, 1500, run), G - 560, 26, 9, ph), 1, P.gold, 8) : "";
  const sk = at(1580, G - 420, socket(), 1.25 * bump(a, 4.3, 0.1)) + (a > 4.3 ? rings(1580, G - 420, 170, P.gold, 0.25 * seg(a, 4.3, 4.6), 1.4) : "");
  const st = at(260, G, station(tot, { lit: 1 }), 0.8 * bump(a, 3.54, 0.08)) + (a > 3.54 ? rings(260, G - 150, 220, P.gold, 0.2 * seg(a, 3.54, 3.9), 1.4) : "");
  const g = sky(c, tot, 31) + layer(skyline(11, -900, 2900, G - 60, 100, 240, E.far, E.farLit), c, 0.35) + layer(planet + st + PX.map((x) => at(x, G - 40, pylon(450))).join("") + `<path d="${line}" stroke="#04192a" stroke-width="6" fill="none"/>` + wave + at(1700, G, `<path d="${rr(-260, -640, 520, 640, 0)}" fill="${E.houseA}"/><path d="${rr(-260, -660, 520, 30, 0)}" fill="${E.houseAD}"/>`) + sk, c)
    + at(960, 160, acMark(220, ph), pop(a - 2.37));
  return { g, out: toScreen(c, 1580, G - 420), outC: P.cream, outZ: 16 };
}
// ---- 1: inside every device: DC ----
const SH = 820, DEV = [[420, 4.64], [1000, 5.69], [1560, 6.69], [2140, 7.98], [2760, 8.96]];
function v1(a, tot) {
  const c = camAt(a, [[0, 420, 520, 1.55], [4.3, 430, 520, 1.5], [5.6, 900, 560, 1.0], [6.6, 1300, 560, 0.95], [7.9, 1650, 560, 0.85], [8.9, 1600, 680, 0.66], [10, 1600, 680, 0.64]]);
  const inside = seg(a, 2.69, 3.98), batt = a > 1.98 ? at(0, -70, battery(), 0.36 * pop(a - 1.98)) : "";
  const shelf = `<rect x="-600" y="${SH}" width="4200" height="40" fill="${P.wood}"/><rect x="-600" y="${SH + 40}" width="4200" height="600" fill="#0a2b3c"/>`;
  const items = [
    phone(dcFlow(-56, 56, -290, tot, inside) + batt),
    laptop("#9fe7ff", dcFlow(-90, 90, -110, tot, 1)),
    bulb(1),
    solar(),
    car(E.houseB, E.houseBD),
  ];
  const ks = [1.3, 1.6, 1.0, 1.1, 2.2];
  const devs = DEV.map(([x, t0], i) => { const p = i === 0 ? pop(a - 0.92) * bump(a, t0, 0.1) : pop(a - t0); return p > 0 ? at(x, SH, items[i], ks[i] * p) + (i > 0 || a > 4.64 ? at(x, SH - (i === 4 ? 400 : i === 0 ? 590 : 480), dcMark(), pop(a - (i === 0 ? 4.64 : t0) - 0.15)) : "") : ""; }).join("");
  const big = a > 3.3 && a < 4.64 ? at(420, SH - 590, dcMark(), pop(a - 3.3)) : "";
  const g = sky(c, tot, 37) + layer(`<path d="${rr(-600, 0, 4200, SH, 0)}" fill="#0b3149"/>` + Array.from({ length: 22 }, (_, i) => `<rect x="${-600 + i * 200}" y="0" width="8" height="${SH}" fill="#0d3a55"/>`).join(""), c, 0.8) + layer(shelf + devs + big, c);
  return { g, in: toScreen(c, 420, SH - 200), inC: P.cream };
}
// ---- 2: the charger cube turns the wave into a straight line ----
function v2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [4.91, 960, 560, 1.05]]), CX = 960, CY = 520, K = 1.9;
  const wall = `<rect x="-600" y="-300" width="3200" height="1700" fill="#0b3149"/>${at(CX, CY - 260, socket(), 1.6)}`;
  // the wave comes down from the socket into the cube (left side), the line goes out down the cable
  const inP = seg(a, 0.83, 2.92), outP = seg(a, 3.3, 4.2);
  let wd = ""; for (let i = 0; i <= 40; i++) { const y = lerp(CY - 560, CY - 220, i / 40); wd += (i ? "L" : "M") + (CX - 330 + 40 * Math.sin(-tot * 9 + i * 0.6)).toFixed(1) + " " + y.toFixed(1); }
  const wave = inP > 0 ? drawn(wd, inP, P.gold, 12) + (inP > 0.9 ? `<path d="M${CX - 330} ${CY - 220}Q${CX - 330} ${CY} ${CX - 200} ${CY}" fill="none" stroke="${P.gold}" stroke-width="12" opacity=".6"/>` : "") : "";
  const line = outP > 0 ? dcFlow(CX + 200, CX + 200 + 520 * outP, CY + 360, tot * 1.5, 1) : "";
  const cube = at(CX, CY, charger(), K * bump(a, 0.2, 0.06)) + (a > 2.62 ? rings(CX, CY, 260, E.el, 0.2 * (0.6 + 0.4 * Math.sin(tot * 8)), 1.3) : "");
  const cable = `<path d="M${CX} ${CY + 330}V${CY + 360}H${CX + 760}" stroke="#ece8ff" stroke-width="40" fill="none" stroke-linecap="round"/>`;
  const g = layer(wall + cable + wave + line + cube, c) + at(CX - 520, 260, acMark(200, -tot * 9), pop(a - 2.92)) + at(CX + 560, CY + 240, dcMark(200), pop(a - 4.16));
  return { g, in: [960, 540], inC: "#ece8ff" };
}
// ---- 3: twenty small truces in one house (host right: everything left of x 1500 and above y 900) ----
const ROOMS = [[-380, -560, 360, 260], [20, -560, 360, 260], [-380, -280, 360, 260], [20, -280, 360, 260]];
const cubeFlag = (p) => at(0, 0, `${two(rr(-18, -18, 36, 36, 6), "#ece8ff", "#c6c0e6", 3, 3)}<path d="M0 -18V-60" stroke="${P.cream}" stroke-width="4"/><path d="M0 -60h26l-6 9l6 9h-26Z" fill="#ffffff"/>`, pop(p));
function v3(a, tot) {
  const c = camAt(a, [[0, 800, 560, 1.0], [3.71, 800, 560, 1.05]]), HX = 760, G = 1000, K = 0.92;
  const shell = `${two("M-470 -820L0 -1040L470 -820Z", E.roof, P.ink, 0, 10)}${two(rr(-430, -830, 860, 830, 10), E.houseA, E.houseAD, 18, 0)}`;
  const rooms = ROOMS.map(([x, y, w, h], i) => `<path d="${rr(x, y, w, h, 10)}" fill="${["#0b4152", "#123a57", "#0e3a50", "#0b4152"][i]}"/><path d="${rr(x, y + h - 20, w, 20, 4)}" fill="${P.woodD}"/>`).join("");
  let cubes = ""; for (let i = 0; i < 20; i++) { const r = ROOMS[i % 4], q = Math.floor(i / 4), x = r[0] + 40 + (q % 5) * 66 + (i % 2) * 10, y = r[1] + r[3] - 40 - (q % 2) * 0; cubes += at(x, y, cubeFlag(a - 1.09 - i * 0.06)); }
  const cnt = Math.min(20, Math.max(0, Math.floor((a - 1.09) / 0.06) + 1));
  const g = sky(c, tot, 41) + layer(`<rect x="-600" y="${G}" width="3200" height="500" fill="${P.ground}"/>` + at(HX, G, shell + rooms + cubes, K), c) + (a > 1.09 ? at(1500, 300, `${rings(0, -30, 110, P.gold, 0.18)}${number(0, 10, String(cnt), 150, P.gold)}`, pop(a - 1.09)) : "");
  return { g };
}
// ---- 4–5: China at night, the longest line ----
const CG = 840, LX0 = 160, LX1 = 3200;
function china(t, c, tot) {
  const draw = seg(t, 3.77, 5.4), T5 = 5.58, u = t - T5;
  const land = hills(101, -900, 4400, CG - 160, 260, "#0d3550") + hills(111, -900, 4400, CG - 40, 140, E.hill) + `<rect x="-900" y="${CG}" width="5400" height="900" fill="${P.ground}"/>`;
  const lineD = `M${LX0} ${CG - 120}` + Array.from({ length: 9 }, (_, i) => `L${lerp(LX0, LX1, (i + 1) / 9)} ${CG - 120 - 30 * Math.sin(i * 1.3)}`).join("");
  const towers = Array.from({ length: 10 }, (_, i) => { const x = lerp(LX0, LX1, i / 9), p = clamp(draw * 9 - i + 1); return p > 0 ? at(x, CG - 120 + 30 * Math.sin((i - 1) * 1.3) * (i ? 1 : 0) + 170, pylon(260), [p, p]) : ""; }).join("");
  const glow = draw > 0 ? drawn(lineD, draw, E.el, 10) + drawn(lineD, draw, "#ffffff", 3) : "";
  const ends = at(LX0, CG - 120, disc(0, 0, 26, P.gold, P.goldD), pop(t - 3.77)) + at(LX1, CG - 120, disc(0, 0, 26, P.gold, P.goldD), pop(t - 5.3));
  const km = Math.round(lerp(0, 3300, ease(seg(u, 0.68, 1.74))));
  const dist = u > 0.6 ? at((LX0 + LX1) / 2, CG + 200, tagV(fmt(km), "km", { size: 190 }), pop(u - 0.6)) : "";
  return layer(land + glow + towers + ends + dist, c);
}
function v4(a, tot) {
  const c = camAt(a, [[0, 700, 640, 1.0], [3.6, 800, 660, 1.0], [5.58, 1900, 660, 0.82]]);
  const g = sky(c, tot, 43) + china(a, c, tot) + at(1550, 200, flag("cn", 220), pop(a - 3.39)) + at(960, 210, dcMark(240), 1.5 * pop(a - 2.34)) + (a > 4.52 ? at(320, 240, calPage("2019", "", 1, 150), pop(a - 4.52)) : "");
  return { g, in: [960, 540], inC: P.night1 };
}
function v5(a, tot) {
  const c = camAt(a, [[0, 1900, 660, 0.82], [2.18, 1680, 640, 0.52]]);
  return { g: sky(c, tot, 43) + china(5.58 + a, c, tot) + at(1550, 200, flag("cn", 220)) + at(320, 240, calPage("2019", "", 1, 150)), out: [960, 540], outC: P.night1 };
}
// ---- 6: 1,100,000 V; long way: the AC line sheds sparks, the DC line hardly any ----
function v6(a, tot) {
  const c = camAt(a, [[0, 700, 560, 1.0], [1.9, 700, 560, 1.04], [2.9, 1500, 560, 0.86], [6.76, 1560, 560, 0.84]]), G = 960;
  const v = Math.round(lerp(0, 1100000, ease(seg(a, 0.64, 1.62))));
  const PX = 520, tip = pylonTips(900)[2];
  const lines = (y, kind, n) => { const d = kind === "ac" ? sine(1000, 2600, y, 22, 6, -tot * 8) : `M1000 ${y}H2600`; const p = seg(a, 2.2, 3.4);
    let sp = ""; for (let i = 0; i < n; i++) { const x = 1050 + rnd(i * 13 + (kind === "ac" ? 1 : 7)) * 1500, q = ((tot * 0.9 + rnd(i * 5 + 3)) % 1); if (a > 3.4) sp += `<circle cx="${x.toFixed(0)}" cy="${(y + 30 + q * 280).toFixed(0)}" r="${(10 * (1 - q) + 3).toFixed(1)}" fill="${kind === "ac" ? P.gold : E.el}" opacity="${(0.9 * (1 - q)).toFixed(2)}"/>`; }
    return drawn(d, p, kind === "ac" ? P.gold : E.el, 12) + sp; };
  const ac = lines(380, "ac", 16), dc = lines(720, "dc", 3);
  const marks = at(860, 380, acMark(170, -tot * 8), 1.5 * pop(a - 2.45)) + at(860, 720, dcMark(170), 1.5 * pop(a - 5.25)) + check(2460, 610, 64, P.green, a - 6.3);
  const g = sky(c, tot, 47) + layer(hills(121, -900, 4000, G - 80, 160, E.hill) + `<rect x="-900" y="${G}" width="5000" height="600" fill="${P.ground}"/>` + at(PX, G, pylon(900)) + ac + dc + marks, c)
    + at(lerp(1150, 1150, 0), 170, tagV(fmt(v), "V", { size: 120 }), [1, pop(a - 0.64)] );
  return { g, in: [960, 540], inC: P.night1 };
}

const SHOTS = [v0, v1, v2, v3, v4, v5, v6];
export const wonSet = makeSet(SHOTS, [], P);
