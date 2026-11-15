// Science part 1, section 3 "a stick and a shadow" (Eratosthenes): eleven shots, timed to the words (sets/beats.cjs).
//   0 a calendar page flips back through the years and stops on 240 BC
//   1 a library of scrolls; a lamp-lit desk with the nameplate "Eratosthenes"
//   2 a well in the south: the sun climbs to the top of the sky at noon, its light goes straight down to the water at the
//     bottom, and the stick by the well loses its shadow
//   3 the same hour in another town: a stick is pushed into the ground and a short shadow appears beside it
//   4 close: the angle between the stick and the sun's ray, 7°; it becomes one slice of a circle cut in fifty
//   5 if the ground were flat: two sticks, parallel rays, two equal shadows
//   6 the ground bends into a curve: one stick has no shadow, the other one has (the Earth is round)
//   7 pull back to the whole planet: the two sticks point to its centre with 7° between them; the arc between the towns
//     lights up, then fifty such arcs go round the planet
//   8 footprints walk the arc, 5,000; × 50; 250,000
//   9 250,000 beside the planet with a tape round it, 40,000 km, and ≈ between them (host right)
//  10 a plane, a satellite and the wifi waves each crossed out; then a stick, a shadow and a brain
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { globe, calPage, calFlip } from "./props.js";
import { P, G0, paperBg, mix, dur, pop, sun, desk, shelf, scroll, footprints, plane, satellite, wifi } from "./sci.js";

const SAND = "#e9c58f", SANDD = "#d4a86a";
const dunes = (G) => `<path d="M-1500 ${G}Q-900 ${G - 90} -300 ${G}T900 ${G}T2100 ${G}T3300 ${G}V${G + 900}H-1500Z" fill="${SAND}"/><path d="M-1500 ${G + 60}Q-700 ${G + 10} 100 ${G + 60}T1700 ${G + 60}T3300 ${G + 60}V${G + 900}H-1500Z" fill="${SANDD}" opacity=".5"/>`;
const stick = (h = 300) => `${two(rr(-12, -h, 24, h, 8), P.wood, P.woodD, 4, 0)}<circle cy="${-h}" r="14" fill="${P.violet}"/>`;
// a shadow on flat ground from the foot of a stick, length L to the right
const shadowOf = (L, w = 18) => (L <= 1 ? "" : `<path d="M0 ${-w / 2}H${L}L${L} ${w / 2}H0Z" fill="${P.ink}" opacity=".35"/>`);
const well = (glow = 0) => `${two(rr(-150, -130, 300, 130, 10), "#c9a57a", "#a8835a", 8, 0)}${[0, 1, 2].map((i) => `<path d="M${-150 + i * 100} -130V0" stroke="#a8835a" stroke-width="5"/>`).join("")}<path d="M-120 -260V-130M120 -260V-130" stroke="${P.woodD}" stroke-width="16"/><path d="M-140 -260H140" stroke="${P.wood}" stroke-width="20" stroke-linecap="round"/>
  <ellipse cy="-130" rx="150" ry="34" fill="#5a3f2a"/><ellipse cy="-128" rx="${(110 * (0.4 + 0.6 * glow)).toFixed(1)}" ry="${(22 * (0.4 + 0.6 * glow)).toFixed(1)}" fill="${mix("#2c4a6a", "#ffe27a", glow)}"/>`;

// ---- 0: back to 240 BC ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [4.9, 960, 540, 1.08]]);
  const years = ["2026", "1900", "1500", "1000", "500", "1", "100 BC", "240 BC"], T = [0.4, 0.75, 1.1, 1.45, 1.8, 2.15, 2.6, 3.6];
  let pg = ""; for (let i = 0; i < years.length; i++) { const nxt = i + 1 < years.length ? T[i + 1] : 99, p = seg(a, nxt - 0.25, nxt);
    if (a >= T[i] - 0.4 && p < 1) pg = (i + 1 < years.length ? calFlip(years[i], "", p, 150) : at(0, 0, calPage(years[i], "", 1, 150), pop(a - 3.5, 7, 12))) + pg; }
  const g = paperBg(c, tot) + layer(at(960, 560, pg, 2.3), c);
  return { g, out: [960, 560], outC: P.cream };
}

// ---- 1: the library and his desk ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 620, 0.9], [3.1, 990, 720, 1.2]]), G = 900;
  const cols = [180, 1740].map((x) => two(rr(x - 50, 120, 100, G - 120, 6), P.cream, P.creamD, 14, 0)).join("");
  const sh = [480, 1440].map((x, i) => at(x, G, shelf(30 + i * 7, 4, 460))).join("");
  const scrolls = [[800, G], [860, G], [1100, G], [1150, G]].map(([x, y], i) => at(x, y, scroll(i % 2 ? P.cream : "#f3dfb6", P.creamD), 1.1)).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="${P.wall}"/>` + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="${P.floor}"/>` + cols + sh + scrolls + at(980, G, desk({ plate: "Eratosthenes", tot, flame: 1 }), 1.7 * pop(a - 0.5, 7, 12)), c);
  return { g, in: [960, 560], inC: P.cream };
}

// ---- 2: the well at noon: the sun reaches the bottom, no shadow ----
function s2(a, tot) {
  const G = 860, c = camAt(a, [[0, 960, 520, 0.9], [3.6, 960, 480, 0.95], [6.0, 900, 640, 1.25], [7.8, 900, 640, 1.3]]);
  const noon = ease(seg(a, 2.6, 4.2)), sx = lerp(1600, 900, noon), sy = lerp(520, 80, noon);
  const reach = seg(a, 4.6, 5.4), glow = reach;
  const ray = noon > 0.9 ? `<path d="M${900 - 70} ${sy + 120}L${900 - 90} ${G - 130}H${900 + 90}L${900 + 70} ${sy + 120}Z" fill="#ffe27a" opacity="${(0.35 * seg(a, 4.2, 4.8)).toFixed(3)}"/>` : "";
  const SX = 1260, shL = lerp(260, 0, noon) * (1 - seg(a, 6.5, 7.0)) + (a < 6.5 ? 0 : 0);
  const g = paperBg(c, tot) + layer(at(sx, sy, sun(90, tot)) + dunes(G) + ray + at(900, G, well(glow)) + at(SX, G, shadowOf(lerp(260, 0, Math.max(noon, seg(a, 6.5, 7.0)))) + stick(260)) + (a > 7.0 ? at(SX + 120, G - 340, check(0, 0, 50, P.green, a - 7.0)) : ""), c);
  return { g, out: toScreen(c, 900, G - 130), outC: "#ffe27a" };
}

// ---- 3: the same hour, another town: a stick and a short shadow ----
function s3(a, tot) {
  const G = 860, c = camAt(a, [[0, 960, 520, 0.95], [5.5, 1000, 600, 1.15]]);
  const push = easeOut(seg(a, 2.9, 3.4)), sh = 120 * ease(seg(a, 4.5, 5.1));
  const town = [[300, 220], [520, 300], [1500, 260], [1700, 200]].map(([x, h], i) => `${two(rr(x - 90, G - h, 180, h, 6), "#f3dfb6", "#e3c79a", 10, 0)}<path d="${rr(x - 30, G - h + 40, 60, 60, 6)}" fill="${P.blueD}" opacity=".6"/>`).join("");
  const g = paperBg(c, tot) + layer(at(1300, 150, sun(80, tot)) + dunes(G) + town + at(960, lerp(G - 260, G, push), stick(300)) + at(960, G, shadowOf(sh, 22)), c);
  return { g, in: [960, 200], inC: "#ffe27a", out: toScreen(c, 960, G - 150), outC: P.cream };
}

// ---- 4: 7°, one fiftieth of a circle ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [3.96, 960, 540, 1.04]]);
  const SX = 620, TOP = 200, BASE = 900, ang = 7 * Math.PI / 180, arc = seg(a, 0.8, 1.5), L = 640;
  const rayEnd = [SX + Math.sin(ang) * L, TOP - Math.cos(ang) * L];
  const left = `<path d="M${SX} ${BASE}V${TOP}" stroke="${P.wood}" stroke-width="22" stroke-linecap="round"/><path d="M${SX} ${TOP}L${(SX + Math.sin(ang) * 760).toFixed(1)} ${(TOP + Math.cos(ang) * 700 - 20).toFixed(1)}" stroke="${P.goldD}" stroke-width="8" stroke-dasharray="20 14" opacity="${seg(a, 0.2, 0.6).toFixed(2)}"/>
    ${arc > 0 ? drawn(`M${SX} ${TOP + 260}A260 260 0 0 0 ${(SX + Math.sin(ang) * 260).toFixed(1)} ${(TOP + Math.cos(ang) * 260).toFixed(1)}`, arc, P.violet, 14) : ""}${a > 1.4 ? at(SX + 120, TOP + 330, text(0, 0, "7°", 110, P.violet), pop(a - 1.4)) : ""}`;
  const pieP = a - 2.4, R = 230, CX = 1340, CY = 560;
  const pie = pieP > 0 ? at(CX, CY, `<circle r="${R}" fill="${P.cream}" stroke="${P.ink}" stroke-width="6"/>${Array.from({ length: 50 }, (_, i) => { const t = i * Math.PI * 2 / 50 - Math.PI / 2; return `<path d="M0 0L${(Math.cos(t) * R).toFixed(1)} ${(Math.sin(t) * R).toFixed(1)}" stroke="${P.creamD}" stroke-width="2"/>`; }).join("")}
    <path d="M0 0L0 ${-R}A${R} ${R} 0 0 1 ${(Math.sin(Math.PI * 2 / 50) * R).toFixed(1)} ${(-Math.cos(Math.PI * 2 / 50) * R).toFixed(1)}Z" fill="${P.violet}"/>${text(0, R + 90, "1 / 50", 70, P.ink)}`, pop(pieP, 7, 12)) : "";
  const g = paperBg(c, tot) + layer(left + pie, c);
  return { g, in: [960, 540], inC: P.cream };
}

// ---- 5–6: flat ground, equal shadows; then the ground curves ----
const RAY = (x0, y0) => `<path d="M${x0} ${y0}l${-60} ${-420}" stroke="#ffd27a" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
function ground(bend, a, tot) {
  // two sticks 900 apart on a line that bends into a dome of radius Rb (bend 0 = flat); the sun's rays stay parallel
  const CX = 960, BY = 780, half = 450, Rb = lerp(60000, 900, bend), tilt = lerp(0.45, -half / 900, bend);
  const pt = (s) => { const th = s / Rb; return [CX + Rb * Math.sin(th), BY + Rb * (1 - Math.cos(th)), th]; };
  let d = ""; for (let s = -1300; s <= 1300; s += 50) { const [x, y] = pt(s); d += (s === -1300 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1); }
  const land = `${d}L${pt(1300)[0]} 1600L${pt(-1300)[0]} 1600Z`;
  const one = (s) => { const [x, y, th] = pt(s), L = Math.abs(Math.tan(th - tilt)) * 260;
    return at(x, y, `<g transform="rotate(${(th * 57.3).toFixed(2)})">${shadowOf(Math.min(L, 320), 24)}${stick(260)}</g>`); };
  const rays = Array.from({ length: 6 }, (_, i) => { const x0 = 160 + i * 330, y0 = -100; return `<path d="M${x0} ${y0}l${(Math.sin(-tilt) * -1100).toFixed(1)} ${(Math.cos(tilt) * 1100).toFixed(1)}" stroke="#ffd27a" stroke-width="12" stroke-linecap="round" opacity=".55"/>`; }).join("");
  return `<path d="${land}" fill="${SAND}"/>${rays}${one(-half)}${one(half)}`;
}
const sign = (neq, k) => at(0, 0, `<path d="M-70 -24H70M-70 24H70" stroke="${neq ? P.violet : P.ink}" stroke-width="18" stroke-linecap="round"/>${neq ? `<path d="M40 -70L-40 70" stroke="${P.violet}" stroke-width="18" stroke-linecap="round"/>` : ""}`, k);
function s5(a, tot) { const c = camAt(a, [[0, 960, 520, 1.0], [2.99, 960, 520, 1.03]]); const eq = a > 1.6;
  return { g: paperBg(c, tot) + layer(at(1700, 120, sun(70, tot)) + ground(0, a, tot) + (eq ? at(960, 960, sign(false, 1), pop(a - 1.6)) : ""), c), in: [960, 540], inC: P.cream }; }
function s6(a, tot) { const c = camAt(a, [[0, 960, 520, 1.03], [2.36, 960, 560, 0.92]]), b = ease(seg(a, 0.1, 1.3));
  return { g: paperBg(c, tot) + layer(at(1700, 120, sun(70, tot)) + ground(b, a, tot) + (a > 1.5 ? at(960, 1000, sign(true, 1), pop(a - 1.5)) : ""), c), out: [960, 760], outC: SAND }; }

// ---- 7: the whole planet; 7° at the centre; fifty arcs ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 300, 2.6], [1.6, 960, 300, 2.4], [2.6, 960, 540, 1.0], [4.9, 960, 540, 0.96]]), CX = 960, CY = 560, R = 360, d7 = 7 * Math.PI / 180, a0 = -Math.PI / 2;
  const P1 = [CX + Math.cos(a0) * R, CY + Math.sin(a0) * R], P2 = [CX + Math.cos(a0 + d7) * R, CY + Math.sin(a0 + d7) * R];
  const sticks = [[a0, P1], [a0 + d7, P2]].map(([t, p]) => at(p[0], p[1], stick(70), 1, (t + Math.PI / 2) * 57.3)).join("");
  const lines = seg(a, 0.3, 1.0), arcOn = seg(a, 2.0, 2.4), ring = seg(a, 3.0, 4.5);
  const toC = lines > 0 ? drawn(`M${P1[0]} ${P1[1]}L${CX} ${CY}`, lines, P.violet, 6, 'stroke-dasharray="1"') + drawn(`M${P2[0]} ${P2[1]}L${CX} ${CY}`, lines, P.violet, 6) : "";
  const arcs = Array.from({ length: Math.floor(50 * ring) }, (_, i) => { const t = a0 + i * d7 * 1.0285; return `<path d="M${(CX + Math.cos(t) * (R + 14)).toFixed(1)} ${(CY + Math.sin(t) * (R + 14)).toFixed(1)}A${R + 14} ${R + 14} 0 0 1 ${(CX + Math.cos(t + d7 * 0.9) * (R + 14)).toFixed(1)} ${(CY + Math.sin(t + d7 * 0.9) * (R + 14)).toFixed(1)}" stroke="${i % 2 ? P.gold : P.violet}" stroke-width="18" fill="none"/>`; }).join("");
  const first = arcOn > 0 ? `<path d="M${P1[0]} ${P1[1] - 14}A${R + 14} ${R + 14} 0 0 1 ${(CX + Math.cos(a0 + d7) * (R + 14)).toFixed(1)} ${(CY + Math.sin(a0 + d7) * (R + 14)).toFixed(1)}" stroke="${P.violet}" stroke-width="${18 + 10 * (1 - arcOn)}" fill="none"/>` : "";
  const g = paperBg(c, tot) + layer(at(CX, CY, globe(R, 0.05, { id: "sh7", ...G0 })) + arcs + first + toC + sticks + (lines >= 1 ? at(CX + 26, CY - 120, text(0, 0, "7°", 44, P.violet), pop(a - 1.0)) : ""), c);
  return { g, in: [960, 760], inC: SAND, out: toScreen(c, P1[0], P1[1]), outC: P.violet };
}

// ---- 8: 5,000 × 50 = 250,000 ----
function s8(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.06, 960, 540, 1.04]]);
  const steps = 12 * seg(a, 0.2, 1.6), n = Math.round(5000 * ease(seg(a, 0.4, 2.0))).toLocaleString("en");
  const arc = `<path d="M260 760Q960 560 1660 760" stroke="${P.violet}" stroke-width="18" fill="none"/>`;
  const fp = Array.from({ length: Math.floor(steps) }, (_, i) => { const t = (i + 0.5) / 12, x = lerp(300, 1620, t), y = (1 - t) * (1 - t) * 760 + 2 * (1 - t) * t * 560 + t * t * 760 - 40; return `<ellipse cx="${x.toFixed(1)}" cy="${(y + (i % 2 ? 14 : -14)).toFixed(1)}" rx="22" ry="12" fill="${P.ink}" opacity=".6"/>`; }).join("");
  const big = a > 3.6 ? at(960, 300, text(0, 0, "250,000", 190, P.violet), pop(a - 3.7, 7, 12)) : a > 2.6 ? at(960, 300, text(0, 0, `${n}  × 50`, 130, P.ink), pop(a - 2.6)) : at(960, 300, text(0, 0, n, 150, P.ink), pop(a - 0.4));
  const g = paperBg(c, tot) + layer(arc + fp + big, c);
  return { g, in: toScreen(c, 960, 700), inC: P.violet };
}

// ---- 9: about 40,000 km (host right) ----
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [7.3, 900, 540, 1.04]]);
  const ruler = at(480, 330, `${two(rr(-260, -40, 520, 80, 8), P.gold, P.goldD, 0, 6)}${Array.from({ length: 13 }, (_, i) => `<path d="M${-240 + i * 40} -40v${i % 2 ? 26 : 44}" stroke="#8a5200" stroke-width="5"/>`).join("")}`, 1, 4 * Math.sin(tot * 5) * (1 - seg(a, 3.2, 3.6)));
  const wob = a > 1.5 && a < 3.4 ? `<path d="M${770 + 30 * Math.sin(tot * 8)} 230v140" stroke="${P.violet}" stroke-width="10" stroke-dasharray="12 10"/>` : "";
  const num = at(480, 600, text(0, 0, "250,000", 160, P.violet));
  const gl = at(1080, 560, globe(250, 0.05 + tot * 0.01, { id: "sh9", ...G0 }) + `<ellipse rx="266" ry="48" fill="none" stroke="${P.gold}" stroke-width="14"/>`, pop(a - 4.4));
  const km = a > 5.7 ? at(1080, 920, text(0, 0, "40,000 km", 100, P.ink), pop(a - 5.7)) : "";
  const approx = a > 4.9 ? at(800, 560, text(0, 30, "≈", 170, P.goldD), pop(a - 4.9)) : "";
  const g = paperBg(c, tot) + layer(ruler + wob + num + gl + km + approx, c);
  return { g, out: toScreen(c, 1080, 560), outC: P.blue };
}

// ---- 10: no plane, no satellite, no internet: a stick, a shadow, a brain ----
const brain = () => `${two("M-110 20Q-150 -60 -80 -100Q-40 -150 20 -120Q90 -150 120 -80Q170 -30 120 40Q100 90 30 80Q-40 110 -90 70Q-130 60 -110 20Z", P.pink, P.pinkD, 0, 8)}<path d="M0 -120Q-20 -40 10 70M-80 -60q40 10 50 50M60 -80q-30 30 -10 70M-70 30q30 -10 60 10" stroke="${P.pinkD}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
function s10(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [4.45, 960, 540, 1.03]]);
  const top = [[400, plane(), 0.2, 0.9], [960, satellite(), 1.0, 0.9], [1520, wifi(P.blue), 1.9, 0.9]].map(([x, g, t, k]) => (a > t ? at(x, 330, at(0, 0, g, k) + cross(110, -80, 46, P.red, a - t - 0.3), pop(a - t)) : "")).join("");
  const bot = [[560, stick(220) + "", 2.6], [960, `<path d="M-100 -12H160V12H-100Z" fill="${P.ink}" opacity=".4"/>` + at(-100, 0, stick(220)), 3.25], [1400, brain(), 3.7]].map(([x, g, t]) => (a > t ? at(x, 860 - (x === 1400 ? 120 : 0), g, pop(a - t)) : "")).join("");
  const g = paperBg(c, tot) + layer(top + `<path d="M200 600H1720" stroke="${P.grid}" stroke-width="6"/>` + bot, c);
  return { g, in: [960, 540], inC: P.blue };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
export const shadowSet = makeSet(SHOTS, [], P);
