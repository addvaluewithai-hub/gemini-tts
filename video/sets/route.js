// "The trip of a call": one long night landscape, traced left to right by one camera that never cuts.
//   blue house + blue phone (the caller) | the nearest tower | the cable under the ground | the core of the network
//   | the cable on | the far tower | pink house + pink phone (the one who answers)
//   0 the blue phone sends teal rings; they die out a short way off, against a dashed limit circle ("not far")
//   1 the camera tracks to the nearest tower: a beam of rings reaches it, its panels light; a measure line rolls
//     300 m → 3 km ("the nearest tower only, a few hundred metres or a few km")
//   2 a gold pulse runs down the mast, the ground opens on a trench and the cable draws itself to the core, whose
//     racks start blinking ("down into a cable under the ground, to the core, a building full of computers")
//   3 pull back: a search ring sweeps out of the core, the pink phone pings, a second cable draws itself to the far
//     tower, whose panels light ("the core looks for the other phone and sends the voice to its nearest tower")
//   4 push in on the core: three signs on its roof light one by one, an ID card with the blue phone ✓, a map with a
//     pink pin, a coin counter that ticks. Then the first two flicker and go out, the coin counter never stops.
//     Host right, so all of it sits left of the lower right corner.
//   5 the far tower sends a beam of rings to the pink phone, which rings ("the last few hundred metres: radio again")
//   6 the whole route from far away: a pulse runs end to end while a stopwatch fills a quarter of a turn; the pink
//     phone lights and answers while the blue phone is still sending. Host left (the lower left is only ground).
// Shots 0–5 are one camera that carries on (no hand-over shape needed, as in the counter of the crypto intro);
// shot 6 follows a studio beat and comes in on a cut.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, house, stars, skyline } from "./bank.js";
import { hills, coin } from "./props.js";
import { WAVE, PULSE, pop, bluePhone, pinkPhone, ringing, radio, tower, cable, core, stopwatch } from "./net.js";

const G = 820, BH = 250, BP = [470, G], T1 = 1250, CX = 2300, T2 = 3350, PH = 4190, PP = [3970, G], UG = 1010;
const PK = 0.95;                                  // the phones' scale
const C1 = `M${T1} ${G + 4}V${UG}H${CX - 220}Q${CX - 150} ${UG} ${CX - 150} ${UG - 70}V${G + 4}`;
const C2 = `M${CX + 150} ${G + 4}V${UG - 70}Q${CX + 150} ${UG} ${CX + 220} ${UG}H${T2}V${G + 4}`;
const MAST = (x, p) => [x, lerp(G - 480, G, p)];   // a point running down a tower's mast

// a measure line between two x at height y, with ticks at both ends
const measure = (x0, x1, y, p, label, a) => { const xe = lerp(x0, x1, p); return p <= 0 ? "" : `<path d="M${x0} ${y - 22}V${y + 22}M${x0} ${y}H${xe.toFixed(1)}${p >= 1 ? `M${x1} ${y - 22}V${y + 22}` : ""}" stroke="${P.cream}" stroke-width="7" stroke-linecap="round" fill="none"/>`
  + (label ? at((x0 + x1) / 2, y - 34, text(0, 0, label, 64, P.cream), pop(a)) : ""); };
// the three signs on the core's roof
const sign = (inner, on, dim = 0) => { const o = clamp(on) * (1 - dim); return `<path d="M-6 40V110M6 40V110" stroke="${P.steelD}" stroke-width="8"/>${two(rr(-95, -80, 190, 130, 16), mix("#2c2766", "#3b3483", o), "#1a1446", 0, 8)}
  ${o > 0.02 ? rings(0, -15, 110, P.gold, 0.1 * o) : ""}<g opacity="${(0.25 + 0.75 * o).toFixed(3)}">${inner}</g>`; };
const idCard = (ok) => `${two(rr(-70, -62, 140, 92, 10), P.cream, P.creamD, 0, 6)}${at(-34, 18, bluePhone({ on: 1 }), 0.28)}<path d="M-4 -36h56M-4 -16h56M-4 4h40" stroke="#b9a986" stroke-width="9" stroke-linecap="round"/>${ok > 0 ? check(50, 20, 24, P.green, ok) : ""}`;
const mapPin = (drop) => `${two(rr(-72, -66, 144, 100, 8), "#7fd0ff", P.blue, 0, 6)}<path d="M-72 -30Q-20 -50 10 -20T72 -26M-30 -66V34M30 -66V34" stroke="#bfe6ff" stroke-width="6" fill="none"/>
  ${drop > 0 ? at(10, lerp(-120, -10, easeOut(seg(drop, 0, 0.3))), `<path d="M0 0L-22 -34A26 26 0 1 1 22 -34Z" fill="${P.pink}"/><circle cx="0" cy="-44" r="10" fill="#fff"/>`) : ""}`;
const meter = (v) => `${at(-48, -15, coin(30))}${number(28, 6, String(Math.floor(v) % 1000).padStart(3, "0"), 56, P.gold)}`;

// the whole landscape; st: what is going on in it
function world(c, tot, st) {
  const sky = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 140, -2000, 7000, 760, tot) + `<circle cx="3400" cy="150" r="56" fill="${P.cream}"/><circle cx="3380" cy="136" r="50" fill="${P.night0}"/>`, c, 0.12)
    + layer(hills(7, -2500, 8000, 760, 70, "#2a1f66"), c, 0.35) + layer(skyline(23, -2000, 7600, 800, 60, 200, "#271b62", "#ffb066"), c, 0.6);
  const open = st.trench || 0;
  const ground = `<rect x="-3000" y="${G}" width="11000" height="1400" fill="${P.ground}"/><rect x="-3000" y="${G}" width="11000" height="14" fill="#3c2a7a"/>`
    + (open > 0 ? `<path d="${rr(T1 - 70, G + 30, CX - T1 + 70, 560, 30)}" fill="${P.soil}" stroke="#4a3590" stroke-width="8" opacity="${open.toFixed(3)}"/>` : "")
    + ((st.trench2 || 0) > 0 ? `<path d="${rr(CX, G + 30, T2 - CX + 70, 560, 30)}" fill="${P.soil}" stroke="#4a3590" stroke-width="8" opacity="${st.trench2.toFixed(3)}"/>` : "")
    + [...Array(40)].map((_, i) => `<circle cx="${-1000 + i * 190}" cy="${G + 90 + (i % 3) * 140}" r="${6 + (i % 4) * 3}" fill="#341d6a"/>`).join("");
  const cables = cable(C1, st.c1 || 0, st.p1 ?? -1, { len: 0.14, w: 30 }) + cable(C2, st.c2 || 0, st.p2 ?? -1, { len: 0.14, w: 30 });
  const mastPulse = (x, p) => (p > 0 && p < 1 ? (([px, py]) => rings(px, py, 30, PULSE, 0.45) + `<circle cx="${px}" cy="${py.toFixed(1)}" r="16" fill="${PULSE}"/>`)(MAST(x, p)) : "");
  const towers = at(T1, G, tower({ t: tot, lit: st.t1 || 0 })) + at(T2, G, tower({ t: tot + 1, lit: st.t2 || 0 })) + mastPulse(T1, st.m1 ?? -1) + mastPulse(T2, st.m2 ?? -1);
  const coreB = at(CX, G, core(tot * (st.busy || 0.15), { glow: "#7ff7c9" }))
    + (st.search > 0 && st.search < 1 ? `<circle cx="${CX}" cy="${G - 170}" r="${(200 + 2400 * st.search).toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="10" opacity="${(0.7 * (1 - st.search)).toFixed(3)}"/>` : "");
  const signs = st.signs ? [[CX - 240, idCard(st.ok || 0), st.s1, st.dim1], [CX, mapPin(st.pin || 0), st.s2, st.dim2], [CX + 240, meter(st.coins || 0), st.s3, 0]].map(([x, inner, on, dim]) => at(x, G - 470, sign(inner, on, dim), pop(on))).join("") : "";
  const houses = at(BH, G, house(P.blue, P.blueD), 1.0) + at(PH, G, house(P.pink, P.pinkD), 1.0);
  const bp = at(BP[0], BP[1], bluePhone({ on: 1 }), PK), pp = at(PP[0], PP[1], st.ring > 0 ? ringing(pinkPhone({ on: st.pinkOn ?? 1 }), tot, st.ring) : pinkPhone({ on: st.pinkOn ?? 0.35 }), PK);
  const ping = st.ping > 0 ? rings(PP[0], PP[1] - 120, 120 * pop(st.ping), P.gold, 0.35 * (1 - seg(st.ping, 0.4, 1.2))) : "";
  const waves = st.waves || "";
  return sky + layer(ground + cables + houses + towers + coreB + signs + bp + pp + ping + waves + (st.extra || ""), c);
}
const BPT = [BP[0], BP[1] - 200];    // where the blue phone's rings leave from (its upper half)
const T1P = [T1, G - 480], T2P = [T2, G - 480], PPT = [PP[0], PP[1] - 200];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const beam = (from, to, t, k = 1, c = WAVE) => { const an = ang(from, to); return radio(from[0], from[1], t, dist(from, to) - 30, { arc: [an - 22, an + 22], n: 4, speed: 1.1, k, c, w: 12 }); };

// cameras, carried from shot to shot
const K0 = [[0, 560, 600, 1.35], [2.77, 640, 590, 1.18]];
const K1 = [[0, 640, 590, 1.18], [0.9, 850, 560, 0.88], [2.9, 860, 560, 0.86]];
const K2 = [[0, 860, 560, 0.86], [1.2, 1250, 660, 0.82], [3.4, 1800, 700, 0.8], [5.71, 2100, 690, 0.82]];
const K3 = [[0, 2100, 690, 0.82], [1.4, 3150, 640, 0.6], [4.16, 3160, 640, 0.59]];
const K4 = [[0, 3160, 640, 0.59], [0.75, 2367, 520, 1.5], [6.67, 2380, 515, 1.56]];
const K5 = [[0, 2380, 515, 1.56], [0.7, 3690, 580, 0.98], [2.38, 3700, 580, 1.0], [10.62, 3710, 580, 1.02]];

function s0(a, tot) {
  const c = camAt(a, K0), lim = a > 1.7 ? pop(a - 1.7) : 0;
  const waves = radio(BPT[0], BPT[1], tot, 360, { n: 4, speed: 1.0, w: 12 })
    + (lim > 0 ? `<circle cx="${BPT[0]}" cy="${BPT[1]}" r="${(400 * lim).toFixed(1)}" fill="none" stroke="${P.cream}" stroke-width="8" stroke-dasharray="26 22" opacity=".75"/>` : "");
  return { g: world(c, tot, { waves }) };
}
function s1(a, tot) {
  const c = camAt(a, K1), hit = a > 0.79 ? spring(a - 0.79, 7, 12) : 0, k = ease(seg(a, 0.2, 0.75));
  const waves = radio(BPT[0], BPT[1], tot, 360, { n: 4, speed: 1.0, w: 12, k: 1 - k }) + beam(BPT, T1P, tot, k);
  const lab = a < 1.58 ? "" : a < 2.36 ? "300 m" : "3 km", la = a < 2.36 ? a - 1.58 : a - 2.36;
  const extra = measure(BP[0], T1, G + 90, ease(seg(a, 1.5, 1.9)), lab, la);
  return { g: world(c, tot, { waves, t1: clamp(hit), extra }) };
}
function s2(a, tot) {
  const c = camAt(a, K2), beamK = 1 - ease(seg(a, 0.2, 0.8));
  const st = { waves: beam(BPT, T1P, tot, beamK), t1: 1, m1: seg(a, 0.45, 1.3), trench: ease(seg(a, 1.2, 1.9)), c1: ease(seg(a, 1.6, 3.4)), p1: kf(a, [[1.3, -0.1], [3.6, 1.05]], (p) => p), busy: a > 4.3 ? 1 : 0.15 };
  const glow = a > 4.3 ? rings(CX, G - 170, 420 * pop(a - 4.3), "#7ff7c9", 0.12) : "";
  st.extra = glow;
  return { g: world(c, tot, st) };
}
function s3(a, tot) {
  const c = camAt(a, K3);
  const st = { t1: 1, trench: 1, c1: 1, busy: 1, search: seg(a, 0.7, 1.9), ping: a > 1.7 ? a - 1.7 : 0, trench2: ease(seg(a, 2.0, 2.5)), c2: ease(seg(a, 2.24, 3.3)), p2: kf(a, [[2.24, -0.1], [3.4, 1.05]], (p) => p), m2: kf(a, [[3.35, 1], [3.75, 0]], (p) => p), t2: a > 3.63 ? clamp(spring(a - 3.63, 7, 12)) : 0 };
  st.m2 = a > 3.3 && a < 3.9 ? 1 - seg(a, 3.3, 3.8) : -1;
  return { g: world(c, tot, st) };
}
function s4(a, tot) {
  const c = camAt(a, K4), t1 = a - 1.78, t2 = a - 2.76, t3 = a - 3.92;
  const fl = (t0, seed) => (a < t0 ? 0 : a < t0 + 0.9 ? (rnd(seed + Math.floor(a * 14)) > 0.5 ? 0.8 : 0.1) : 0.82);
  const st = { t1: 1, t2: 1, trench: 1, trench2: 1, c1: 1, c2: 1, busy: 1, signs: true, s1: t1 > 0 ? 1 : 0, s2: t2 > 0 ? 1 : 0, s3: t3 > 0 ? 1 : 0, ok: t1 > 0.3 ? t1 - 0.3 : 0, pin: t2 > 0 ? t2 : 0,
    coins: t3 > 0 ? 7 + t3 * 9 : 0, dim1: fl(5.06, 3), dim2: fl(5.2, 9) };
  const keep = t3 > 0 ? rings(CX + 240, G - 485, (130 + 14 * Math.sin(tot * 5)) * (a > 5.5 ? 1.25 : 1), P.gold, a > 5.5 ? 0.2 : 0.1) : "";
  st.extra = keep + (a > 5.9 ? at(CX - 240, G - 485, cross(0, 0, 30, P.red, a - 5.9), 1) + at(CX, G - 485, cross(0, 0, 30, P.red, a - 6.0), 1) : "");
  return { g: world(c, tot, st) };
}
function s5(a, tot) {
  const c = camAt(a, K5), k = ease(seg(a, 0.4, 1.0)), r = a > 1.6 ? ease(seg(a, 1.6, 1.9)) : 0;
  const st = { t1: 1, t2: 1, trench: 1, trench2: 1, c1: 1, c2: 1, busy: 1, waves: beam(T2P, PPT, tot, k), ring: r, pinkOn: 0.35 + 0.65 * r };
  return { g: world(c, tot, st) };
}
// 6: the whole route from far away, timed against a stopwatch
function s6(a, tot) {
  const c = camAt(a, [[0, 2220, 960, 0.45], [4.99, 2230, 955, 0.46]]);
  const run = seg(a, 0.35, 1.6), legs = [0.12, 0.42, 0.45, 0.88, 0.91];       // radio, cable, core, cable, radio
  const p1 = kf(run, [[legs[0], -0.1], [legs[1], 1.05]], (p) => p), p2 = kf(run, [[legs[2], -0.1], [legs[3], 1.05]], (p) => p);
  const shoot = (from, to, u) => (u > 0 && u < 1 ? (([x, y]) => rings(x, y, 60, WAVE, 0.4) + `<circle cx="${x}" cy="${y}" r="34" fill="${WAVE}"/>`)([lerp(from[0], to[0], u), lerp(from[1], to[1], u)]) : "");
  const hear = a > 2.93 ? pop(a - 2.93) : 0;
  const st = { t1: 1, t2: 1, trench: 1, trench2: 1, c1: 1, c2: 1, busy: 1, p1, p2, ring: 0, pinkOn: run >= 1 ? 1 : 0.35,
    waves: radio(BPT[0], BPT[1], tot, 300, { n: 3, speed: 1.4, w: 14 }) + shoot(BPT, T1P, seg(run, 0, legs[0])) + shoot(T2P, PPT, seg(run, legs[4], 1))
      + (hear > 0 ? at(PP[0], PP[1] - 290, [-1, 1].map((s) => `<path d="M${s * 60} -40q${s * 30} 40 0 80M${s * 100} -70q${s * 50} 70 0 140" fill="none" stroke="${P.pink}" stroke-width="16" stroke-linecap="round"/>`).join(""), hear) : "") };
  const sw = at(1000, 165, stopwatch(105, 0.25 * ease(seg(a, 0.35, 1.6))), pop(a - 0.1)) + (a > 1.6 ? at(1000, 165, rings(0, 0, 140, P.gold, 0.18 * (1 - seg(a, 1.6, 2.4))), 1) : "");
  return { g: world(c, tot, st) + sw };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const routeSet = makeSet(SHOTS, [], P);
