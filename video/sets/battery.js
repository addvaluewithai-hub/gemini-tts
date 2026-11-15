// "Inside a battery" (electricity part 4 of 4): how a battery stores, as a ladder. Four shots; nothing to read but
// "Li", + and −.
//   0 a big battery and a "?" («بتخزّن إزاي»); a phone, a car and a battery box side by side («التليفون… العربية… المخزن»),
//     the same little cell lights over each («نفس الفكرة»); the camera pushes into the box and we are inside the cell:
//     the − side and the + side light («ناحيتين») and a wall drops between them («وبينهم حاجز»)
//   1 gold dots marked Li pop up on the + side («ذرّات… الليثيوم»), two of them try the trip through the wall and back
//     («بتتنقل من ناحية للتانية»); a power source plugs in on top («لما بتشحن»), gold pulses run down into the − side and
//     every Li crosses the wall and climbs a ladder on the − side, one rung each («بتزقّ الليثيوم… زي سلم»)
//   2 the source becomes a phone («بتستخدم الموبايل»); the Li climb down and cross back («بيرجع للناحية التانية»); their
//     electrons can't pass the wall (one bumps it: ✗, «مضطرة») and run out of the − end, round the outside wire and
//     through the phone, which lights («تلف من بره… وتشغّل الجهاز»). Host left: the lower left is kept clear.
//   3 a box with a bolt in it gets a ✗ («مش علبة فيها كهربا»); the ladder alone, Li going up and down on it («سلم…
//     طالع نازل»); its rungs crack one by one («بيتآكل شوية»); a phone's full bar gets shorter as calendar pages flip
//     («بعد كام سنة مابقتش تقعد»)
// The cell is the same picture in shots 0-2 (no hand-overs inside it); 2 → 3 through the dark inside the cell.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, through, rr, two, disc, rings, text, drawn, at, cross, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./battery.v.js";
import { P, E, mix, pop, electron, plus, minus, battery as bigBattery } from "./elec.js";
import { car, calPage, calFlip } from "./props.js";
import { battBox, phone, sky, GOLDL } from "./storage.js";

const IN = "#06202e", LEFT = "#0f4a63", RIGHT = "#5a2f45", RED = "#ff4d5a";
const CX = 1060, CY = 640;
const BOLT = "M14 -60L-30 6H0L-14 60L30 -6H0Z";

// a wooden ladder, base on y = 0, centred; n rungs; wear 0..1 cracks rungs one by one; hi 0..1 glows it
export const ladder = (h, n, wear = 0, hi = 0, w = 260) => { const x = w / 2;
  const rails = [-x, x - 24].map((rx) => two(rr(rx, -h, 24, h, 8), mix(P.wood, "#ffcf7a", hi * 0.5), P.woodD, 6, 0)).join("");
  const rungs = Array.from({ length: n }, (_, j) => { const y = -h * (j + 1) / (n + 1), crack = clamp(wear * n * 1.1 - rnd(j * 7 + 3) * n);
    if (crack <= 0) return `<path d="${rr(-x + 14, y - 10, w - 28, 20, 8)}" fill="${mix(P.wood, "#ffcf7a", hi * 0.5)}"/><path d="${rr(-x + 14, y + 4, w - 28, 6, 3)}" fill="${P.woodD}"/>`;
    const sag = 8 * crack, c = mix(P.wood, "#7a4a26", crack);
    return `<g transform="rotate(${sag.toFixed(1)} ${-x + 14} ${y})"><path d="M${-x + 14} ${y - 10}H-6L4 ${y - 2}L-8 ${y + 10}H${-x + 14}Z" fill="${c}"/></g><g transform="rotate(${(-sag).toFixed(1)} ${x - 14} ${y})"><path d="M${x - 14} ${y - 10}H14L2 ${y}L12 ${y + 10}H${x - 14}Z" fill="${c}"/></g>`; }).join("");
  return rails + rungs; };
const LADX = -280, LADB = 235, LADH = 470, NR = 5;
const rungY = (j) => LADB - LADH * (j + 1) / (NR + 1);
export const li = (r = 40) => `${disc(0, 0, r, P.gold, P.goldD, 0.12)}${text(0, r * 0.36, "Li", r * 1.0, P.ink)}`;

// a point along a polyline, u 0..1 by length
const along = (pts, u) => { const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let s = clamp(u) * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { const p = L[i] ? clamp(s / L[i]) : 1; return [lerp(pts[i][0], pts[i + 1][0], p), lerp(pts[i][1], pts[i + 1][1], p)]; } s -= L[i]; } return pts[pts.length - 1]; };
// the trip of Li number i: from the floor of the + side, through the wall, to the foot of the ladder and up to rung i
const liPath = (i) => [[110 + i * 92, 200], [60, 200], [-60, 200], [LADX, 200], [LADX, rungY(i) - 34]];
const liAt = (i, u) => along(liPath(i), u);
// stagger: q 0..1 for the whole group → each dot's progress
const each = (q, i, n = 5) => clamp((q * (1 + 0.12 * (n - 1)) - i * 0.12) / 1);

// the cut-open cell (centre), 1120 x 580: o.reveal colours the sides, o.wall drops the wall, o.wear, o.hi (ladder glow)
const cell = (o = {}) => { const rv = o.reveal ?? 1, wl = o.wall ?? 1;
  const term = `${at(-280, -306, `${two(rr(-60, -26, 120, 52, 14), P.steel, P.steelD, 0, 6)}${minus(36, P.ink)}`)}${at(280, -306, `${two(rr(-60, -26, 120, 52, 14), P.gold, P.goldD, 0, 6)}${plus(36, P.ink)}`)}`;
  const sides = `<path d="${rr(-510, -240, 480, 480, 30)}" fill="${mix(IN, LEFT, rv)}"/><path d="${rr(30, -240, 480, 480, 30)}" fill="${mix(IN, RIGHT, o.reveal2 ?? rv)}"/>`
    + (o.ringL ? rings(-270, 0, 200, E.el, 0.25 * o.ringL, 1.3) : "") + (o.ringR ? rings(270, 0, 200, E.plus, 0.25 * o.ringR, 1.3) : "")
    + at(-270, -170, minus(70, mix(IN, "#5fa8c8", rv)), 1, 0, `opacity=".8"`) + at(270, -170, plus(70, mix(IN, "#c97a9a", o.reveal2 ?? rv)), 1, 0, `opacity=".8"`);
  const wall = wl > 0 ? at(0, -540 * (1 - wl), `${two(rr(-24, -250, 48, 500, 12), P.cream, P.creamD, 6, 0)}${Array.from({ length: 9 }, (_, k) => `<circle cx="${k % 2 ? 6 : -6}" cy="${-200 + k * 50}" r="7" fill="#c9b88f"/>`).join("")}`) : "";
  return `${term}${two(rr(-560, -290, 1120, 580, 56), "#2b5a74", "#1c4157", 14, 0)}<path d="${rr(-530, -260, 1060, 520, 40)}" fill="${IN}"/>${sides}${o.ladder === false ? "" : at(LADX, LADB, ladder(LADH, NR, o.wear || 0, o.hi || 0), 1, 0, `opacity="${(o.ladderOp ?? 1).toFixed(2)}"`)}${wall}`; };
// the outside wire from the − end round to the + end, over the top
const WIRE = [[-280, -330], [-280, -470], [280, -470], [280, -330]];
const wireD = `M-280 -330V-470H280V-330`;
const outside = (glow = 0) => `<path d="${wireD}" fill="none" stroke="${E.cuD}" stroke-width="22" stroke-linejoin="round"/><path d="${wireD}" fill="none" stroke="${mix(E.cu, E.cuL, glow)}" stroke-width="12" stroke-linejoin="round"/>`;
const source = () => `${disc(0, 0, 80, P.ink, "#020c16", 0.06)}${rings(0, 0, 80, P.gold, 0.2, 1.4)}<path d="${BOLT}" fill="${P.gold}"/>`;
const miniCell = () => `${two(rr(-70, -40, 140, 80, 16), "#2b5a74", "#1c4157", 4, 0)}<path d="${rr(-60, -30, 56, 60, 10)}" fill="${LEFT}"/><path d="${rr(4, -30, 56, 60, 10)}" fill="${RIGHT}"/><path d="${rr(-6, -34, 12, 68, 4)}" fill="${P.cream}"/>`;
const camCell = (t, keys) => camAt(t, keys);

// ---- 0: one idea in everything; inside: two sides and a wall ----
function s0(a, tot) {
  const v = portrait(), T = 6.73;
  if (a < T) {
    const c = camAt(a, v ? [[0, 960, 960, 0.95], [6.3, 960, 960, 0.97], [T, 960, 1420, 1.25]] : [[0, 960, 600, 1.0], [6.3, 960, 640, 1.08], [T, 1460, 760, 1.3]]);
    const away = ease(seg(a, 1.9, 2.3));
    const big = away < 1 ? at(960, v ? 1200 : 900, bigBattery({}), (v ? 1.5 : 1.3) * pop(a + 1) * (1 - away)) : "";
    const q = a > 0.6 && away < 1 ? at(v ? 1260 : 1300, v ? 600 : 300, `${rings(0, -60, 120, P.gold, 0.2, 1.4)}${text(0, 40, "?", 260, P.gold)}`, pop(a - 1.21) * (1 - away)) : "";
    const POS = v ? [[960, 520], [960, 980], [960, 1420]] : [[460, 740], [960, 780], [1460, 800]];
    const items = [[(o) => phone({ on: 1, charge: 0.8 }), 2.25, v ? 0.9 : 0.95], [() => car(E.houseB, E.houseBD) + at(0, -70, `<path d="${rr(-34, -24, 68, 48, 8)}" fill="${P.ink}"/><path d="${rr(-26, -16, 40, 32, 5)}" fill="${P.green}"/>`), 3.19, v ? 1.9 : 1.9], [() => battBox(0.8), 4.51, v ? 1.05 : 1.15]];
    const things = items.map(([f, t0, k], i) => a > t0 - 0.05 ? at(POS[i][0], POS[i][1] + (i === 0 ? 0 : 120), f(), k * pop(a - t0)) : "").join("");
    const same = a > 5.1 ? POS.map(([x, y], i) => at(x, y - (v ? 250 : 300), `${rings(0, 0, 90, P.gold, 0.25 * (1 - seg(a, 5.8, 6.4)), 1.4)}${miniCell()}`, pop(a - 5.14 - i * 0.15))).join("")
      + [0, 1].map((i) => a > 5.5 + i * 0.4 ? at((POS[i][0] + POS[i + 1][0]) / 2, (POS[i][1] + POS[i + 1][1]) / 2 - (v ? 250 : 300), `<path d="M-34 -14H34M-34 14H34" stroke="${P.gold}" stroke-width="14" stroke-linecap="round"/>`, pop(a - 5.5 - i * 0.4)) : "").join("") : "";
    const g = sky(c, tot, 71) + layer(`<rect x="-1400" y="${v ? 1560 : 940}" width="4800" height="1600" fill="${P.ground}"/>` + big + q + things + same, c);
    return { g: through(g, ...toScreen(c, POS[2][0], POS[2][1] - 30), easeIn(seg(a, T - 0.4, T)), IN, 18) };
  }
  const u = a - T;
  const c = camCell(u, v ? [[0, CX, CY, 0.92], [2.78, CX, CY - 40, 0.88]] : [[0, CX, CY - 60, 1.05], [2.78, CX, CY - 100, 0.95]]);
  const rv = ease(seg(a, 7.6, 7.95)), rv2 = ease(seg(a, 7.95, 8.3));
  const g = sky(c, tot, 71) + layer(at(CX, CY, cell({ reveal: rv, reveal2: rv2, wall: spring(a - 8.5, 8, 14), ringL: rv * (1 - seg(a, 8.0, 8.5)), ringR: rv2 * (1 - seg(a, 8.4, 8.9)) })), c);
  return { g: through(g, 960, 540, 1 - easeOut(seg(u, 0, 0.45)), IN, 18) };
}

// ---- 1: Li on the + side; charging pushes them up the ladder on the − side ----
function s1(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, CX, CY - 100, 0.88], [1.0, CX, CY - 100, 0.9], [1.5, CX + 250, CY + 160, 1.4], [2.4, CX + 250, CY + 160, 1.4], [3.1, CX, CY - 100, 0.88], [8.28, CX, CY - 100, 0.9]]
    : [[0, CX, CY - 100, 0.95], [1.0, CX, CY - 100, 0.97], [1.5, CX + 260, CY + 140, 1.55], [2.4, CX + 260, CY + 140, 1.55], [3.2, CX, CY - 110, 0.95], [8.28, CX - 40, CY - 110, 0.98]]);
  const q = ease(seg(a, 4.8, 6.7));
  const demo = Math.sin(Math.PI * seg(a, 2.5, 3.7)) * 0.42;
  const hi = a > 6.8 ? 0.8 * Math.sin(Math.PI * seg(a, 6.8, 8.0)) : 0;
  const dots = [0, 1, 2, 3, 4].map((i) => { let u = each(q, i); if (i < 2 && a < 4.0) u = demo * (i ? 0.85 : 1);
    const [x, y] = liAt(i, u), bob = u >= 1 ? 4 * Math.sin(tot * 4 + i) : 0, big = a > 1.0 && a < 2.6 && i === 2 ? 1 + 0.25 * ease(seg(a, 1.1, 1.5)) * (1 - seg(a, 2.2, 2.6)) : 1;
    return at(x, y + bob, li(), pop(a - 0.05 - i * 0.1) * big); }).join("");
  const plugIn = a > 3.85 ? at(0, -470, source(), 0.9 * pop(a - 3.91)) : "";
  const pulses = a > 4.6 && a < 6.8 ? [0, 1, 2].map((k) => { const p = ((tot * 0.8 + k / 3) % 1); const [x, y] = along([[0, -470], [-280, -470], [-280, -280], [-280, -150]], p); return rings(x, y, 22, P.gold, 0.7, 1.5); }).join("") : "";
  const chev = a > 4.7 && a < 6.8 ? [0, 1].map((k) => { const s = ((tot * 1.2 + k / 2) % 1); return at(lerp(470, 120, s), 40, `<path d="M30 -40L-20 0L30 40" fill="none" stroke="${P.gold}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`, 1, 0, `opacity="${(Math.sin(Math.PI * s) * 0.8).toFixed(2)}"`); }).join("") : "";
  const g = sky(c, tot, 71) + layer(at(CX, CY, `<g opacity="${seg(a, 3.85, 4.15).toFixed(2)}">${outside(a > 4.6 && a < 6.8 ? 0.6 : 0)}</g>` + cell({ hi }) + chev + dots + plugIn + pulses), c);
  return { g };
}

// ---- 2: in use: Li climb back; their electrons go round the outside and light the phone (host left) ----
function s2(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, CX, CY - 100, 0.9], [7.51, CX, CY - 110, 0.92]] : [[0, CX + 230, CY - 110, 0.98], [7.51, CX + 240, CY - 120, 1.0]]);
  const q = 1 - ease(seg(a, 1.38, 2.9));
  const shine = ease(seg(a, 6.1, 6.4));
  const swap = ease(seg(a, 0.0, 0.5));
  const top = (swap < 1 ? at(0, -470, source(), 0.9 * (1 - swap)) : "") + (a > 0.3 ? at(0, -470, phone({ on: shine, charge: shine > 0 ? 0.9 : null, inner: shine > 0 ? rings(0, 0, 80, "#9fe7ff", 0.25 * shine, 1.4) : "" }), 0.55 * pop(a - 0.32)) : "");
  // the Li: from the rungs back to the + side (reverse order so the top one leaves last)
  const LI = [0, 1, 2, 3, 4].map((i) => liAt(i, 1 - each(1 - q, 4 - i)));
  const dots = LI.map(([x, y]) => at(x, y, li())).join("");
  // their electrons: with them on the − side, stopped by the wall, then out and round
  const pile = (i) => [-82, 170 - i * 58];
  const bump = a > 3.7 && a < 4.4 ? 46 * Math.sin(Math.PI * seg(a, 3.7, 4.15)) : 0;
  const LOOP = (i) => [pile(i), [-280, -200], ...WIRE, [280, -200], [130 + i * 92, 150]];
  const els = LI.map(([x, y], i) => { const ex0 = x + 34, ey0 = y - 30, block = clamp((ex0 + 82) / 60);
    let e = [lerp(Math.min(ex0, -82), pile(i)[0], block), lerp(ey0, pile(i)[1], block)];
    if (i === 0) e = [e[0] + bump, e[1]];
    const t0 = 4.53 + i * 0.18, u = seg(a, t0, t0 + 3.0);
    if (u > 0) e = along(LOOP(i), ease(u));
    return at(e[0], e[1], electron(24, { glow: u > 0 && u < 1 ? 1 : 0 })); }).join("");
  const no = a > 4.1 ? at(0, 110, cross(0, 0, 44, RED, a - 4.16), 1, 0, `opacity="${(1 - seg(a, 5.0, 5.4)).toFixed(2)}"`) : "";
  const g = sky(c, tot, 71) + layer(at(CX, CY, outside(a > 4.6 ? 0.5 : 0) + cell({}) + dots + els + no + top), c);
  return { g, out: toScreen(c, CX + 270, CY), outC: IN, outZ: 16 };
}

// ---- 3: not a box of electricity: a ladder, and it wears ----
const crate = () => `${two(rr(-200, -200, 400, 400, 24), "#a86a3a", "#84502a", 0, 12)}<path d="M-200 -200L200 200M-200 -60H200M-200 60H200" stroke="#84502a" stroke-width="16"/>${disc(0, 0, 110, P.ink, "#020c16", 0.06)}${rings(0, 0, 110, P.gold, 0.2, 1.4)}<path d="${BOLT}" fill="${P.gold}" transform="scale(1.4)"/>`;
function s3(a, tot) {
  const v = portrait();
  const LX = v ? 760 : 1000, LB = v ? 1500 : 960, H = v ? 900 : 760, NN = 7;
  const PX = v ? 1240 : 1620, PY = v ? 1520 : 560;
  const c = camAt(a, v ? [[0, 960, 760, 1.0], [1.9, 960, 760, 1.0], [2.6, 960, 1000, 0.95], [7.4, 960, 1040, 0.95], [8.2, 980, 1100, 0.9], [11.17, 980, 1100, 0.92]]
    : [[0, 700, 560, 1.1], [1.9, 760, 560, 1.05], [2.6, 1000, 540, 1.0], [7.4, 1000, 540, 1.04], [8.2, 1260, 540, 0.95], [11.17, 1260, 540, 0.97]]);
  const gone = ease(seg(a, 1.9, 2.5));
  const box = gone < 1 ? at(lerp(v ? 960 : 700, v ? -300 : -300, gone), v ? 760 : 600, crate() + cross(150, -150, 64, RED, a - 1.3), 1.2 * pop(a + 1)) : "";
  const wear = ease(seg(a, 5.1, 7.4));
  const lad = a > 1.95 ? at(LX, LB, ladder(H, NN, wear, 0, 380), pop(a - 2.0)) : "";
  // Li going up and down the rungs
  const ry = (j) => -H * (j + 1) / (NN + 1);
  const ups = a > 3.3 ? [0, 1, 2].map((k) => { const s = (tot * 0.35 + k / 3) % 1, tri = 1 - Math.abs(2 * s - 1), j = Math.round(tri * (NN - 1)), y = lerp(ry(0), ry(NN - 1), tri);
    return at(LX - 80 + k * 80, LB + y - 40, li(40), pop(a - 3.36 - k * 0.15)); }).join("") : "";
  const dust = wear > 0 && wear < 1 ? [0, 1, 2, 3].map((k) => { const s = (tot * 0.9 + k / 4) % 1; return `<circle cx="${LX - 100 + rnd(k) * 200}" cy="${LB + ry(Math.floor(rnd(k + 5) * NN)) + s * 200}" r="${6 - 4 * s}" fill="#c99a6a" opacity="${(1 - s).toFixed(2)}"/>`; }).join("") : "";
  // a phone whose full bar gets shorter as the years flip
  const yrs = seg(a, 8.5, 10.6), full = lerp(1, 0.55, ease(yrs));
  const ph = a > 7.7 ? at(PX, PY, phone({ on: 1, charge: full }), (v ? 1.3 : 1.15) * pop(a - 7.78)) : "";
  const pages = a > 7.9 ? at(PX + (v ? 0 : 0), PY + (v ? -400 : -330), [0, 1, 2].map((k) => k === 0 ? calPage("", "", 0.5, 120) : calFlip("", "", seg(a, 8.6 + (2 - k) * 0.7, 9.0 + (2 - k) * 0.7), 120)).join(""), (v ? 1.0 : 1.0) * pop(a - 8.0)) : "";
  const g = sky(c, tot, 79) + layer(`<rect x="-1400" y="${LB}" width="4800" height="1600" fill="${P.ground}"/>` + box + lad + dust + ups + ph + pages, c);
  return { g, in: toScreen(c, v ? 960 : 700, v ? 760 : 600), inC: IN };
}

const SHOTS = [s0, s1, s2, s3];
export const batterySet = makeSet(SHOTS, V, P);
