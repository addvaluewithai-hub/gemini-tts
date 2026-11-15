// Crypto part 6, s1 "a picture for millions": ten wordless shots (shots.md, scene s1).
//   0 2021: the book's row threads out to a house, a car, and a framed picture: the ledger records owning anything
//   1 the picture on an auction easel, $69,000,000 (March 2021)
//   2 a framed speech bubble (the first tweet), ≈ $3,000,000 (March 2021)
//   3 the same frame a year later: the price rolls down to $280 (April 2022)
//   4 a gallery of pixel apes with $100,000s tags, and a "?"
//   5 buyers on a staircase pass the frame up for more and more; the last holds only a gold thread, the picture floats off
//   6 the row in the book and its thread: what was bought is a line
//   7 the copier: the picture becomes 2, 4, 8 copies, and file 1 (the copy problem of report 1)
//   8 a wall of frames, 2023: 95% of them fade to grey
//   9 the last bright frame puts on a tie and becomes a share certificate; certificates slide into the book
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s1.v.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { calPage, car } from "./props.js";
import { frame, ape, folder6 } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 3000, 1080, tot), c, 0.15);
const G = 900;
const ground = (c, seed = 33) => layer(skyline(seed, -900, 3200, G - 20, 100, 280, "#2a1d66", "#ffb066"), c, 0.45) + layer(`<rect x="-1000" y="${G}" width="4400" height="700" fill="${P.ground}"/>`, c);
const cx = (x) => (FW < FH ? FW / 2 : x);
const money = (v) => "$" + Math.round(v).toLocaleString("en");
// a counter pill: dark rounded box with gold digits
const counter = (str, size = 84, fill = P.gold) => { const w = Math.max(260, str.length * size * 0.5 + 80); return `<path d="${rr(-w / 2, -size * 0.8, w, size * 1.25, 22)}" fill="${P.ink}" opacity=".78"/>${text(0, size * 0.22, str, size, fill)}`; };
// a speech bubble with three lines (the first tweet, no logo)
const bubble = () => `<path d="M-110 -70H110A24 24 0 0 1 134 -46V30A24 24 0 0 1 110 54H-30L-70 92L-60 54H-110A24 24 0 0 1 -134 30V-46A24 24 0 0 1 -110 -70Z" fill="#fff"/>${[0, 1, 2].map((i) => `<path d="M-100 ${-36 + i * 30}h${[190, 160, 110][i]}" stroke="#9fb0ff" stroke-width="12" stroke-linecap="round"/>`).join("")}`;
// an easel, 360 wide, base on y = 0; the picture sits with its centre at (0, -380)
const easel = () => `<path d="M-120 0L-20 -560M120 0L20 -560M0 0V-520" stroke="${P.woodD}" stroke-width="18" stroke-linecap="round"/><path d="${rr(-190, -230, 380, 26, 8)}" fill="${P.wood}"/>`;
// the open public book, 324 x 206 at k = 1, rows of coloured dots; `hot` lights row r
const BOOKROW = [[P.blue, P.pink], [P.teal, P.violet], [P.gold, P.blue], [P.pink, P.teal]];
const ledger = (hot = -1, glow = 0) => `<path d="${rr(-170, -110, 340, 222, 14)}" fill="${P.wood}"/><path d="${rr(-156, -100, 150, 196, 6)}" fill="${P.cream}"/><path d="${rr(6, -100, 150, 196, 6)}" fill="${P.cream}"/>
  ${BOOKROW.map(([a, b], r) => { const y = -64 + r * 44, on = r === hot; return `${on ? `<path d="${rr(-150, y - 18, 300, 36, 8)}" fill="${P.gold}" opacity="${(0.35 + 0.25 * glow).toFixed(2)}"/>` : ""}<circle cx="-128" cy="${y}" r="10" fill="${a}"/><path d="M-110 ${y}h80" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/><circle cx="30" cy="${y}" r="10" fill="${b}"/><path d="M48 ${y}h80" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`; }).join("")}`;
// a gold thread from (x0, y0) to (x1, y1), drawn up to p
const thread = (x0, y0, x1, y1, p, w = 6) => drawn(`M${x0} ${y0}Q${(x0 + x1) / 2} ${Math.min(y0, y1) - 160} ${x1} ${y1}`, p, P.gold, w, 'opacity=".9"');
const calAt = (x, y, big, small, a, k = 0.6, rot = 6) => (a > 0 ? at(x, y, calPage(big, small, 1, String(big).length > 4 ? 110 : 130), k * pop(a), rot) : "");

// ---- 0: 2021, the book records owning anything ----
function s0(a, tot) {
  const BK = [620, 520], c = camAt(a, [[0, 760, 520, 1.15], [2.2, 820, 520, 1.1], [5.1, 1080, 520, 1.0]]);
  const book = at(BK[0], BK[1], rings(0, 0, 260, P.gold, 0.12) + ledger(1, Math.sin(tot * 4)), 1.6 * pop(a - 0.05, 7, 12));
  const T = [[1240, 640, 2.4, "house"], [1520, 690, 3.25, "car"], [1640, 360, 4.15, "frame"]], row = [BK[0] + 1.6 * 150, BK[1] + 1.6 * (-64 + 44)];
  let th = "", things = "";
  T.forEach(([x, y, t0, kind]) => { th += thread(row[0], row[1], x, y - 40, ease(seg(a, t0 - 0.35, t0 + 0.15)));
    const k = pop(a - t0), g = kind === "house" ? house(P.blue, P.blueD, { lit: [1, 1, 1] }) : kind === "car" ? car() : frame(220, 180, { ape: 1 });
    if (a > t0) things += at(x, kind === "frame" ? y : y + 110, (kind === "frame" ? rings(0, 0, 170, P.gold, 0.18) : "") + g, (kind === "house" ? 0.75 : kind === "car" ? 0.95 : 1.1) * k); });
  const g = night(c, tot, 41) + ground(c) + layer(book + th + things + calAt(300, 210, "2021", "", a - 0.3), c);
  return { g, out: toScreen(c, 1640, 360), outC: P.gold, outZ: 18 };
}

// ---- 1: the picture at auction, $69,000,000 ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 500, 1.0], [3.73, 960, 470, 1.08]]);
  const pic = at(960, 440, rings(0, 0, 300 + 10 * Math.sin(tot * 3), P.gold, 0.14) + frame(340, 280, { ape: 1 }), 1.15);
  const v = 69000000 * easeOut(seg(a, 1.0, 3.0)), cnt = a > 0.9 ? at(cx(960), 120, counter(money(v), 96), pop(a - 0.9)) : "";
  const g = night(c, tot, 43) + ground(c, 51) + layer(at(960, G, easel()) + pic + calAt(1500, 330, "2021", "MAR", a - 0.3, 0.62), c) + cnt;
  return { g, in: toScreen(c, 960, 440), inC: P.gold, inZ: 18, out: toScreen(c, 960, 440), outC: "#9fe7ff", outZ: 18 };
}

// ---- 2: the first tweet, ≈ $3,000,000 (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 500, 1.0], [3.61, 980, 480, 1.06]]), X = 820;
  const pic = at(X, 440, rings(0, 0, 280, P.gold, 0.12) + frame(340, 280, { inner: at(0, -10, bubble(), 1.2) }), 1.1 * pop(a, 8, 14));
  const v = 3000000 * easeOut(seg(a, 1.8, 3.0)), cnt = a > 1.7 ? at(cx(X), 120, counter("≈ " + money(v), 90), pop(a - 1.7)) : "";
  const g = night(c, tot, 47) + ground(c, 53) + layer(at(X, G, easel()) + pic + calAt(1330, 300, "2021", "MAR", a - 0.4, 0.58), c) + cnt;
  return { g, in: toScreen(c, X, 440), inC: "#9fe7ff", inZ: 18, out: toScreen(c, X, 440), outC: "#9fe7ff", outZ: 18 };
}

// ---- 3: a year later, the best offer is $280 ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 500, 1.06], [2.2, 960, 500, 1.06], [4.05, 940, 520, 1.16]]), X = 900;
  const pic = at(X, 440, frame(340, 280, { inner: at(0, -10, bubble(), 1.2), grey: 0.35 * seg(a, 2.6, 3.6) }), 1.1);
  const roll = easeOut(seg(a, 2.3, 3.6)), v = Math.exp(lerp(Math.log(3000000), Math.log(280), roll));
  const cnt = at(cx(X), 120, counter(money(v), 90, roll > 0.95 ? P.red : P.gold), 1);
  const plink = a > 3.6 ? at(X + 330, G - 40 - 220 * Math.abs(Math.sin((a - 3.6) * 9)) * Math.exp(-(a - 3.6) * 3), coin(30, "$"), 1) : "";
  const g = night(c, tot, 49) + ground(c, 57) + layer(at(X, G, easel()) + pic + plink + calAt(1440, 300, "2022", "APR", a - 0.3, 0.6), c) + cnt;
  return { g, in: toScreen(c, X, 440), inC: "#9fe7ff", inZ: 18, out: toScreen(c, X, 440), outC: P.gold, outZ: 18 };
}

// ---- 4: a gallery of apes at $100,000s, and why? ----
const GAL = [[360, "#7a4a2a", "#9fe7ff"], [660, "#4a3a2a", "#ffc4e0"], [960, "#8a5a3a", "#c8f7c5"], [1260, "#5a3a2a", "#ffe08a"], [1560, "#6a4a3a", "#d8c8ff"]];
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 470, 1.22], [3.0, 960, 450, 1.3]]);
  let wall = `<path d="${rr(150, 230, 1620, 520, 20)}" fill="#2a1d66"/>`;
  GAL.forEach(([x, fur, bg], i) => { const t0 = 1.15 + i * 0.16;
    wall += at(x, 430, frame(200, 170, { ape: 1, fur, bg }), pop(a - i * 0.08));
    if (a > t0) wall += at(x, 610, `<path d="${rr(-110, -32, 220, 64, 14)}" fill="${P.cream}"/><circle cx="-90" cy="0" r="8" fill="${P.ink}"/>${text(10, 16, "$100,000s", 38, P.ink)}`, pop(a - t0), -4 + i * 2); });
  const q = a > 2.5 ? at(960, 210, text(0, 50, "?", 200, P.red), pop(a - 2.5)) : "";
  const g = night(c, tot, 53) + ground(c, 59) + layer(wall + q, c);
  return { g, in: toScreen(c, 960, 430), inC: P.gold, inZ: 18, out: toScreen(c, 960, 430), outC: "#c8f7c5", outZ: 18 };
}

// ---- 5: someone will pay more; the last buyer holds only a thread (host left) ----
const STEPS = [[1400, 820, P.blue, P.blueD], [1120, 700, P.pink, P.pinkD], [840, 580, P.teal, P.tealD], [560, 460, P.violet, P.violetD]];
function s5(a, tot) {
  const c = camAt(a, [[0, 1180, 560, 1.25], [2.4, 1000, 470, 1.3], [4.21, 880, 360, 1.2]]);
  let stairs = "", houses = "";
  STEPS.forEach(([x, y, col, colD], i) => { stairs += `<path d="${rr(x - 1860, y, 2000, 40, 6)}" fill="#3a2a7a"/>`;
    houses += at(x, y, house(col, colD, { lit: [1, 1, 1] }), 0.8 * pop(a - i * 0.08));
    if (i > 0 && a > 0.9 + i * 0.4) houses += at(x - 30, y - 260, `<path d="${rr(-56, -26, 112, 52, 14)}" fill="${P.green}"/>${text(0, 14, "$".repeat(i), 36, "#fff")}`, pop(a - 0.9 - i * 0.4)); });
  // the frame hops up the stairs, house to house; then lifts off and floats away
  const hop = Math.min(3, Math.floor(seg(a, 0.6, 2.3) * 3.999)), f = (seg(a, 0.6, 2.3) * 4) % 1, k0 = STEPS[hop], k1 = STEPS[Math.min(3, hop + 1)];
  let fx, fy;
  if (a < 2.3) { fx = lerp(k0[0], k1[0], ease(f)); fy = lerp(k0[1], k1[1], ease(f)) - 260 - 120 * Math.sin(Math.PI * f); }
  else { const up = ease(seg(a, 2.7, 3.9)); fx = STEPS[3][0] - 80 * up; fy = STEPS[3][1] - 260 - 520 * up; }
  const fr = at(fx, fy, frame(170, 140, { ape: 1 }), 1.1, 6 * Math.sin(tot * 3));
  const th = a > 2.6 ? `<path d="M${STEPS[3][0] + 10} ${STEPS[3][1] - 140}Q${STEPS[3][0] - 70} ${(fy + STEPS[3][1]) / 2 - 80} ${fx.toFixed(1)} ${(fy + 70).toFixed(1)}" stroke="${P.gold}" stroke-width="6" fill="none"/>` : "";
  const g = night(c, tot, 59) + layer(skyline(61, -900, 3200, G - 20, 100, 280, "#2a1d66", "#ffb066"), c, 0.45) + layer(`<rect x="-1000" y="${G}" width="4400" height="700" fill="${P.ground}"/>` + stairs + houses + th + fr, c);
  return { g, in: toScreen(c, STEPS[0][0], STEPS[0][1] - 260), inC: "#c8f7c5", inZ: 18 };
}

// ---- 6: what was bought is a line in the book ----
function s6(a, tot) {
  const BK = [760, 560], c = camAt(a, [[0, 820, 560, 1.15], [3.38, 900, 540, 1.22]]);
  const book = at(BK[0], BK[1], ledger(2, seg(a, 0.4, 1.0) * (0.7 + 0.3 * Math.sin(tot * 5))), 2.0);
  const row = [BK[0] + 2.0 * 150, BK[1] + 2.0 * (-64 + 88)], F = [1520, 380];
  const th = thread(row[0], row[1], F[0] - 120, F[1] + 60, ease(seg(a, 0.5, 1.9)), 8);
  const glow = a > 2.3 ? rings(F[0], F[1], 190 * (1 + 0.08 * Math.sin(tot * 8)), "#9fe7ff", 0.25 * seg(a, 2.3, 2.6)) : "";
  const g = night(c, tot, 61) + ground(c, 63) + layer(book + th + glow + at(F[0], F[1], frame(220, 180, { ape: 1 }), 1.05), c);
  return { g, out: toScreen(c, F[0], F[1]), outC: "#9fe7ff", outZ: 18 };
}

// ---- 7: anyone copies it: 2, 4, 8 copies, and file 1 ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 500, 1.05], [2.99, 960, 520, 1.0]]);
  const n = a < 0.25 ? 1 : a < 0.5 ? 2 : a < 0.8 ? 4 : 8, cols = n === 1 ? 1 : n === 2 ? 2 : 4, rows_ = n === 8 ? 2 : 1, k = n === 1 ? 1.3 : n === 2 ? 1.1 : n === 4 ? 0.85 : 0.75;
  let cp = "";
  for (let i = 0; i < n; i++) { const cx = 960 + (i % cols - (cols - 1) / 2) * 380 * k, cy = 470 + (Math.floor(i / cols) - (rows_ - 1) / 2) * 330 * k;
    cp += at(cx, cy, frame(220, 180, { ape: 1 }), k * (i === 0 ? 1 : pop(a - [0, 0.25, 0.5, 0.5, 0.8, 0.8, 0.8, 0.8][i]))); }
  const f1 = a > 1.0 ? at(240, 190, folder6(1, 0), 0.62 * pop(a - 1.0), -6) : "";
  const g = night(c, tot, 67) + ground(c, 69) + layer(cp + f1, c);
  return { g, in: toScreen(c, 960, 470), inC: "#9fe7ff", inZ: 18, out: toScreen(c, 960, 470), outC: "#2a1d66", outZ: 18 };
}

// ---- 8: 2023, 95% are worth nothing (host right) ----
function s8(a, tot) {
  const c = camAt(a, [[0, 900, 500, 1.0], [4.74, 880, 480, 1.05]]);
  let wall = `<path d="${rr(240, 170, 1260, 660, 18)}" fill="#2a1d66"/>`;
  const KEEP = 13;
  for (let i = 0; i < 20; i++) { const x = 340 + (i % 5) * 265, y = 260 + Math.floor(i / 5) * 160, gr = i === KEEP ? 0 : seg(a, 2.6 + (rnd(i * 7) * 1.6), 3.0 + rnd(i * 7) * 1.6);
    wall += at(x, y, (i === KEEP && a > 3.6 ? rings(0, 0, 110, P.gold, 0.25) : "") + frame(130, 100, { ape: 1, grey: gr, bg: ["#9fe7ff", "#ffc4e0", "#c8f7c5", "#ffe08a"][i % 4] }), 0.9 * pop(a - i * 0.02)); }
  const pct = a > 2.5 ? at(cx(900), 110, counter(Math.round(95 * easeOut(seg(a, 2.5, 3.1))) + "%", 92, P.red), pop(a - 2.5)) : "";
  const g = night(c, tot, 71) + ground(c, 73) + layer(wall + calAt(1590, 260, "2023", "", a - 0.8, 0.55), c) + pct;
  return { g, out: toScreen(c, 340 + (KEEP % 5) * 265, 260 + Math.floor(KEEP / 5) * 160), outC: P.gold, outZ: 20 };
}

// ---- 9: the idea comes back in a suit: shares and bonds in the book ----
const cert = (tie = 1) => `${two(rr(-150, -100, 300, 200, 10), P.cream, P.creamD, 0, 8)}<path d="${rr(-134, -84, 268, 168, 6)}" fill="none" stroke="${P.goldD}" stroke-width="6"/>${text(0, -30, "SHARE", 40, P.ink)}<path d="M-80 10h160M-80 36h120" stroke="#c9b48a" stroke-width="8" stroke-linecap="round"/>${disc(96, 60, 22, P.red, P.redD)}
  ${tie > 0 ? at(-112, -100, `<path d="M-18 0h36l-10 18l20 90l-28 30l-28 -30l20 -90Z" fill="${P.blue}"/><path d="M-18 0h36l-10 18h-16Z" fill="${P.blueD}"/>`, [1, tie]) : ""}`;
function s9(a, tot) {
  const BK = [1240, 560], c = camAt(a, [[0, 820, 520, 1.15], [2.2, 860, 520, 1.1], [4.48, 1040, 540, 1.0]]);
  const turn = ease(seg(a, 1.5, 2.1)), X = 600, Y = 470;
  const one = turn < 0.5 ? at(X, Y, rings(0, 0, 200, P.gold, 0.2) + frame(240, 200, { ape: 1 }), lerp(1.3, 0.2, turn * 2)) : at(X, Y, rings(0, 0, 200, P.gold, 0.2) + cert(seg(a, 1.9, 2.2)), lerp(0.2, 1.4, (turn - 0.5) * 2));
  const book = a > 2.2 ? at(BK[0], BK[1], ledger(-1), 1.7 * pop(a - 2.2)) : "";
  let slide = ""; for (let i = 0; i < 3; i++) { const t0 = 2.5 + i * 0.45, p = ease(seg(a, t0, t0 + 0.5)); if (p <= 0) continue;
    const ty = BK[1] + 1.7 * (-64 + i * 44), tx = BK[0] + 1.7 * 80;
    slide += at(lerp(X + 40, tx, p), lerp(Y + 120 + i * 30, ty, p), (i === 1 ? `<path d="${rr(-140, -50, 280, 100, 10)}" fill="#bfe6ff"/>${text(0, 14, "BOND", 40, P.ink)}` : cert(0)), lerp(0.55, 0.22, p)); }
  const g = night(c, tot, 79) + ground(c, 81) + layer(one + book + slide, c);
  return { g, in: toScreen(c, X, Y), inC: P.gold, inZ: 20 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9];
export const c6s1Set = makeSet(SHOTS, V, P);
