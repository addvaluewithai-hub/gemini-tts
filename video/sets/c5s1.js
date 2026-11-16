// Crypto part 5, s1 "the programmable ledger": eight wordless shots (shots.md, scene s1).
//   0 2013: a desk with a laptop and a "19" on the chair; a "?" over the book, whose page holds only coins
//   1 gear icons fill the page beside the coins; 2015; the laptops round the planet light up; a diamond coin "Ethereum"
//   2 the diamond coin climbs a podium to the second step (#2); a program card clips into the book: SMART CONTRACT
//   3 a vending machine in the square; a coin goes into its slot; its light blinks yellow, then green
//   4 a can drops by itself; the empty seller's stool gets a cross; a reaching glow tries the chute and it locks
//   5 the machine's code bars fly into the book and lock; copies fly to laptops; magnifiers read them; a padlock clicks
//   6 three small machines: a coin bag (loan), an umbrella (insurance), dice (a bet); two houses facing away
//   7 the machine stands between the two houses with a shield; a gas pump drips a fuel coin up to the laptops; a fee tag
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s1.v.js";
import { P, mix, house, coin, stars, skyline, pill } from "./bank.js";
import { laptop, calPage, globe, padlock } from "./props.js";
import { book, bookGears, vending, can, codeBars, gasPump, VEND_SLOT } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const G = 900;
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const town = (c, seed = 41) => layer(skyline(seed, -800, 2800, G - 20, 120, 300, P.far), c, 0.4) + layer(skyline(seed + 36, -800, 2800, G, 80, 220, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
const cal = (big, a, x, y, k = 0.6) => (a > 0 ? at(x, y, calPage(big, "", 1, 140), k * pop(a), 5) : "");
// the page of the book with coins only, or coins and gears (g 0..1 how many gear icons)
const gearIcon = (r = 14) => { let d = ""; for (let i = 0; i < 8; i++) { const t0 = i * 0.785, t1 = t0 + 0.35; d += `M0 0L${(Math.cos(t0) * r * 1.3).toFixed(1)} ${(Math.sin(t0) * r * 1.3).toFixed(1)}L${(Math.cos(t1) * r * 1.3).toFixed(1)} ${(Math.sin(t1) * r * 1.3).toFixed(1)}Z`; } return `<path d="${d}" fill="${P.violet}"/><circle r="${r}" fill="${P.violet}"/><circle r="${r * 0.4}" fill="${P.cream}"/>`; };
const pageInner = (g = 0, t = 0) => { let o = ""; for (let r = 0; r < 4; r++) for (let side = -1; side <= 1; side += 2) { const x = side * 80, y = -50 + r * 36;
    o += at(x - 30, y, coin(12, ""), 1); o += `<path d="M${x - 12} ${y}h${side < 0 ? 40 : 50}" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`;
    const k = r * 2 + (side + 1) / 2; if (g * 8 > k) o += at(x + 46, y, gearIcon(10), pop(g * 8 - k), t * 60 + k * 20); }
  return o; };
const desk = (lit = 1) => `${two(rr(-200, -150, 400, 30, 8), P.wood, P.woodD, 0, 8)}<path d="M-180 -120v120M180 -120v120" stroke="${P.woodD}" stroke-width="18"/>${at(40, -150, laptop(lit ? "#9fe7ff" : "#3a4a8a"), 0.7)}<path d="M-150 -150v-120" stroke="${P.steelD}" stroke-width="10"/><path d="M-190 -270h80l-20 -40h-40Z" fill="${P.gold}"/>${lit ? `<path d="M-180 -270L-260 -150H-40L-120 -270Z" fill="#ffd98a" opacity=".12"/>` : ""}`;
const chair = (badge = 0) => `${two(rr(-60, -260, 120, 160, 20), "#4b3d8f", "#36296e", 8, 0)}${two(rr(-70, -110, 140, 30, 10), "#4b3d8f", "#36296e", 0, 6)}<path d="M0 -80v70M-50 -10h100" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>${badge > 0 ? at(0, -190, `${disc(0, 0, 44, P.gold, P.goldD)}${text(0, 18, "19", 50, P.ink)}`, pop(badge)) : ""}`;
const diamond = (r = 90, lab = 0) => `${rings(0, 0, r * 1.1, "#a78bfa", 0.22)}<path d="M0 ${-r}L${r * 0.75} ${-r * 0.2}L0 ${r}L${-r * 0.75} ${-r * 0.2}Z" fill="#a78bfa"/><path d="M0 ${-r}L${r * 0.75} ${-r * 0.2}L0 ${r * 0.05}L${-r * 0.75} ${-r * 0.2}Z" fill="#c4b5fd"/><path d="M0 ${r * 0.05}L${r * 0.75} ${-r * 0.2}L0 ${r}Z" fill="${P.violetD}"/>${lab > 0 ? at(0, r + 52, pill("Ethereum", P.violet, P.violetD, 250), pop(lab)) : ""}`;

// ---- 0: 2013, a young laptop asks why the ledger holds only money ----
function s0(a, tot) {
  const c = camAt(a, [[0, 760, 640, 1.45], [2.6, 860, 620, 1.4], [4.4, 1200, 560, 1.6], [5.6, 1260, 540, 1.75]]);
  const BK = [1300, G - 330];
  const q = a > 2.9 ? at(BK[0], BK[1] - 250 - 20 * Math.sin(tot * 3), text(0, 0, "?", 190, P.gold), pop(a - 2.9)) : "";
  const pg = seg(a, 4.7, 5.1), theBook = at(BK[0], BK[1], (pg > 0 ? rings(0, 0, 220, P.gold, 0.2 * pg) : "") + book(pg > 0 ? pageInner(0) : ""), 1.25);
  const lectern = `${two(rr(BK[0] - 70, G - 220, 140, 220, 8), "#7a55c9", "#5b3aa6", 12, 0)}`;
  const g = night(c, tot, 21) + town(c) + layer(at(560, G, desk(1)) + at(820, G, chair(a - 1.8)) + lectern + theBook + q + cal("2013", a - 0.3, 520, 360), c);
  return { g, out: toScreen(c, BK[0], BK[1]), outC: P.cream, outZ: 18 };
}

// ---- 1: the page gets gears; 2015; the laptops round the planet light; Ethereum rises ----
const GL = [960, 1180], R = 470, RIM = [-1.1, -0.82, -0.55, -0.27, 0, 0.27, 0.55, 0.82, 1.1];
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.6], [1.6, 960, 520, 1.55], [2.7, 960, 600, 0.95], [5.16, 960, 560, 1.0]]);
  const gearsIn = seg(a, 0.3, 1.4);
  const theBook = at(960, 520 - 200 * seg(a, 2.2, 2.9), rings(0, 0, 220, P.gold, 0.15) + book(pageInner(gearsIn, tot)), 1.0 - 0.25 * ease(seg(a, 2.2, 2.9)));
  let ring = "";
  RIM.forEach((th, i) => { const on = seg(a, 3.0 + i * 0.08, 3.3 + i * 0.08), x = GL[0] + (R + 10) * Math.sin(th), y = GL[1] - (R + 10) * Math.cos(th);
    if (a < 2.4) return; ring += at(x, y, (on > 0 ? rings(0, -90, 70, P.gold, 0.25 * on) : "") + laptop(on > 0 ? "#fff3c2" : "#9fe7ff"), 0.33 * pop(a - 2.4 - i * 0.03), th * 180 / Math.PI); });
  const planet = a > 2.2 ? at(GL[0], GL[1], globe(R, tot * 0.01, { night: 0.3 }), pop(a - 2.2, 7, 10)) : "";
  const eth = a > 4.3 ? at(1320, 380 - 40 * ease(seg(a, 4.3, 4.9)), diamond(110, a - 4.5), pop(a - 4.3)) : "";
  const g = night(c, tot, 23) + layer(planet + ring + theBook + cal("2015", a - 1.8, 620, 300, 0.7) + eth, c);
  return { g, in: [960, 540], inC: P.cream, inZ: 18, out: toScreen(c, 1320, 340), outC: "#a78bfa", outZ: 18 };
}

// ---- 2: second-largest; a program card clips into the book: SMART CONTRACT (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 820, 680, 1.6], [1.9, 860, 640, 1.55], [2.7, 560, 600, 1.35], [4.91, 540, 590, 1.38]]);
  const steps = [[1000, 140, P.gold, "1"], [820, 100, "#a78bfa", "2"], [1180, 70, P.steel, "3"]];
  let pod = steps.map(([x, h, col, n]) => `${two(rr(x - 90, G - 120 - h, 180, h + 120, 10), "#4b3d8f", "#36296e", 0, 10)}${text(x, G - 40 - h / 2 + 60, n, 70, col)}`).join("");
  pod += at(1000, G - 300, coin(60, "B"), 1);
  const climb = ease(seg(a, 0.4, 1.7)), ex = lerp(560, 820, climb), ey = lerp(G - 70, G - 300, climb) - 120 * Math.sin(Math.PI * climb);
  const eth = at(ex, ey, diamond(70, 0), 1);
  const two_ = a > 1.6 ? at(820, G - 430, pill("#2", "#a78bfa", P.violetD, 110), pop(a - 1.6)) : "";
  const card = (k) => `${two(rr(-90, -120, 180, 240, 14), P.cream, P.creamD, 0, 8)}${at(-50, -60, gearIcon(26))}${at(-70, 0, codeBars(4, 140, { seed: 3 }), 1)}`;
  const fly = ease(seg(a, 2.2, 3.1)), cp = bez([480, 360], [420, 200], [380, 620], fly);
  const bookL = at(380, 700, book(pageInner(1, tot)), 0.9) + (a > 2.2 ? at(cp[0], cp[1], card(), lerp(1, 0.55, fly)) + (fly >= 1 ? rings(380, 640, 140 * spring(a - 3.1, 7, 10), P.gold, 0.3 * (1 - seg(a, 3.2, 3.8))) : "") : "");
  const lab = a > 3.8 ? at(380, 420, pill("SMART CONTRACT", P.gold, P.goldD, 420), pop(a - 3.8)) : "";
  const g = night(c, tot, 25) + town(c, 61) + layer(pod + eth + two_ + bookL + lab, c);
  return { g, in: toScreen(c, ex, ey), inC: "#a78bfa", inZ: 18, out: toScreen(c, 380, 620), outC: P.cream, outZ: 18 };
}

// ---- 3–4: the vending machine: coin in, condition checked, the can drops by itself, nobody can back out ----
const VM = [960, G];
function vendScene(t, c, tot, T4) {
  const u = t - T4;   // seconds into shot 4
  const machine = at(VM[0], VM[1], vending({ light: u > -99 && t > 3.65 ? "ok" : t > 2.8 ? (Math.floor((t - 2.8) * 6) % 2 ? "wait" : "off") : "off", item: can(P.red), drop: seg(u, 0.0, 0.6), locked: u > 2.85 }), 1.25 * pop(t - 1.0));
  const cf = seg(t, 1.9, 2.25), cp = bez([VM[0] + 420, VM[1] - 700], [VM[0] + 300, VM[1] - 760], [VM[0] + VEND_SLOT[0] * 1.25, VM[1] + VEND_SLOT[1] * 1.25], ease(cf));
  const theCoin = t > 1.85 && cf < 1 ? at(cp[0], cp[1], coin(28, "B"), 1) : "";
  const stool = at(1380, G, `${two(rr(-60, -150, 120, 26, 10), P.wood, P.woodD, 0, 6)}<path d="M-40 -124L-60 0M40 -124L60 0" stroke="${P.woodD}" stroke-width="12"/>`) + (u > 1.0 ? cross(1380, G - 230, 34, P.red, u - 1.0) : "");
  const grab = u > 2.2 && u < 3.3 ? `<path d="M${VM[0] - 520} ${VM[1] - 120}Q${VM[0] - 300} ${VM[1] - 260} ${lerp(VM[0] - 300, VM[0] - 80, ease(seg(u, 2.2, 2.7)))} ${VM[1] - 150}" stroke="#ffd98a" stroke-width="26" stroke-linecap="round" fill="none" opacity="${(0.55 * (1 - seg(u, 2.95, 3.3))).toFixed(2)}"/>` : "";
  const lockFlash = u > 2.85 ? rings(VM[0] - 10, VM[1] - 180, 120 * spring(u - 2.85, 7, 10), P.red, 0.25 * (1 - seg(u, 3.0, 3.4))) : "";
  return night(c, tot, 27) + town(c, 83) + layer(stool + machine + theCoin + grab + lockFlash, c);
}
function s3(a, tot, s) { const T4 = (s.ends || [])[3] || 4.73;
  const c = camAt(a, [[0, 960, 560, 1.0], [1.6, 960, 560, 1.05], [3.0, 1000, 500, 1.35], [4.73, 1000, 500, 1.38]]);
  return { g: vendScene(a, c, tot, T4), in: [960, 540], inC: P.cream, inZ: 16 }; }
function s4(a, tot, s) { const T4 = (s.ends || [])[3] || 4.73;
  const c = camAt(a, [[0, 1000, 500, 1.38], [0.7, 1050, 560, 1.2], [3.44, 1050, 600, 1.15]]);
  return { g: vendScene(T4 + a, c, tot, T4), out: toScreen(c, VM[0] + 108 * 1.25, VM[1] - 240 * 1.25), outC: P.ink, outZ: 20 }; }

// ---- 5: the contract is written on the ledger; copies everywhere; everyone reads it; nobody can change it (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1250, 470, 1.45], [2.0, 1150, 440, 1.4], [3.6, 1060, 520, 1.12], [7.92, 1060, 520, 1.15]]);
  const BK = [1100, 300], fly = ease(seg(a, 0.4, 1.9));
  const bars = at(lerp(1400, BK[0] + 30, fly), lerp(560, BK[1] - 20, fly), codeBars(4, 150, { seed: 7 }), lerp(1.3, 0.55, fly));
  const machine = at(1450, G, vending({ light: "ok" }), 0.9);
  const lockA = a - 6.0, lk = lockA > 0 ? at(BK[0] + 150, BK[1] - 70, padlock(0.8, 1 - ease(seg(lockA, 0.2, 0.7))), pop(lockA)) + (lockA > 0.7 ? rings(BK[0], BK[1], 220 * spring(lockA - 0.7, 7, 10), P.gold, 0.3 * (1 - seg(lockA, 0.9, 1.4))) : "") : "";
  const theBook = at(BK[0], BK[1], rings(0, 0, 220, P.gold, 0.12) + bookGears({ grow: 1, spin: tot * 2 }), 0.9) + bars + lk;
  const LT = [[560, 640], [790, 760], [1060, 800], [1330, 760], [1560, 640]].map(([x, y]) => [x, y + 40]);
  let laps = "";
  LT.forEach(([x, y], i) => { const t0 = 2.4 + i * 0.25, p = seg(a, t0, t0 + 0.6), b = bez([BK[0], BK[1] + 40], [(x + BK[0]) / 2, BK[1] - 120], [x, y - 70], ease(p));
    if (p > 0 && p < 1) laps += at(b[0], b[1], codeBars(3, 80, { seed: 7 }), 0.7);
    const got = p >= 1, read = seg(a, 4.5 + i * 0.15, 4.8 + i * 0.15);
    laps += at(x, y, laptop(got ? "#fff3c2" : "#9fe7ff", got ? at(-60, -130, codeBars(3, 120, { seed: 7, run: read }), 0.8) : ""), 0.75) + (read > 0 ? at(x + 70, y - 150, `<circle r="34" fill="#cfe9ff" opacity=".35" stroke="${P.steel}" stroke-width="10"/><path d="M24 24l40 40" stroke="${P.steelD}" stroke-width="14" stroke-linecap="round"/>`, pop(read * 0.6), 0) : ""); });
  const g = night(c, tot, 31) + town(c, 91) + layer(machine + laps + theBook, c);
  return { g, in: toScreen(c, 1450, G - 300), inC: P.ink, inZ: 20, out: toScreen(c, BK[0], BK[1]), outC: P.cream, outZ: 18 };
}

// ---- 6: loans, insurance, bets; two strangers ----
const bag = () => `${two("M-40 -10Q-50 50 0 54Q50 50 40 -10Q30 -40 0 -40Q-30 -40 -40 -10Z", P.wood, P.woodD, 0, 6)}<path d="M-16 -40l16 -16l16 16" fill="none" stroke="${P.woodD}" stroke-width="8"/>${text(0, 30, "$", 44, P.gold)}`;
const umbrella = () => `<path d="M-60 0A60 50 0 0 1 60 0Z" fill="${P.teal}"/><path d="M0 0v56q0 14 -14 14" stroke="${P.ink}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
const dice = () => [[-26, 0, 12], [26, 8, -10]].map(([x, y, r]) => at(x, y, `<path d="${rr(-24, -24, 48, 48, 10)}" fill="#fff"/>${[[-10, -10], [10, 10], [0, 0]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="5" fill="${P.ink}"/>`).join("")}`, 1, r)).join("");
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.3], [3.6, 960, 560, 1.32], [4.3, 960, 620, 1.05], [5.47, 960, 620, 1.06]]);
  const items = [[560, bag, 1.6, P.gold], [960, umbrella, 2.4, P.teal], [1360, dice, 3.4, P.pink]];
  let ms = items.map(([x, fn, t0, col], i) => at(x, G - 120, vending({ light: a > t0 + 0.3 ? "ok" : "off", item: fn(), drop: 0, c: ["#3c5bb0", "#2f6f8a", "#7a3b8a"][i], cD: ["#2c4590", "#235a72", "#5e2d6b"][i] }), 0.95 * pop(a - 0.2 - i * 0.15)) + (a > t0 ? rings(x, G - 120 - 340, 150 * spring(a - t0, 7, 10), col, 0.25 * (1 - seg(a, t0 + 0.3, t0 + 0.8))) : "")).join("");
  const hs = a > 3.9 ? at(280, G + 40, house(P.blue, P.blueD, { lit: [1, 0, 1] }), [-1.1 * pop(a - 3.9), 1.1 * pop(a - 3.9)]) + at(1640, G + 40, house(P.pink, P.pinkD, { lit: [0, 1, 1] }), 1.1 * pop(a - 4.0)) : "";
  const q = a > 4.6 ? at(960, G - 640, text(0, 0, "?", 120, P.cream), pop(a - 4.6)) : "";
  const g = night(c, tot, 33) + town(c, 103) + layer(ms + hs + q, c);
  return { g, in: toScreen(c, 960, G - 400), inC: P.cream, inZ: 18, out: toScreen(c, 960, G - 400), outC: "#2f6f8a", outZ: 16 };
}

// ---- 7: the guarantor is a program; every step costs gas, paid to the ones who run the network ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.15], [1.8, 1060, 600, 1.3], [3.6, 1060, 470, 1.15], [6.96, 1080, 460, 1.18]]);
  const shield = at(960, G - 720, `<path d="M0 -70L60 -46V0Q60 46 0 74Q-60 46 -60 0V-46Z" fill="${P.green}"/><path d="M-26 2L-6 22L30 -16" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>`, pop(a - 0.2));
  const machine = at(960, G, vending({ light: "ok" }), 1.15);
  const hs = at(420, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.0) + at(1500, G, house(P.pink, P.pinkD, { lit: [1, 1, 1] }), 1.0) + `<path d="M520 ${G - 120}H800M1120 ${G - 120}H1400" stroke="${P.gold}" stroke-width="6" stroke-dasharray="14 12" opacity=".7"/>`;
  const pump = a > 2.1 ? at(1220, G, gasPump(seg(a, 2.5, 3.3)), pop(a - 2.1)) : "";
  const LT = [[760, 140], [1060, 110], [1360, 140]];
  const fly = seg(a, 3.9, 5.0), fc = bez([1320, G - 40], [1400, 420], [960, 250], ease(fly));
  const fuel = a > 3.9 && fly < 1 ? at(fc[0], fc[1], coin(34, ""), 1) : "";
  const laps = LT.map(([x, y], i) => at(x, y, laptop(fly >= 1 ? "#fff3c2" : "#9fe7ff"), 0.55 * pop(a - 3.4 - i * 0.1))).join("");
  const fee = a > 5.5 ? at(1250, 420, `${two("M-70 -40h110l40 40l-40 40h-110Z", P.cream, P.creamD, 0, 6)}<circle cx="60" r="9" fill="${P.ink}"/>${text(-10, 18, "FEE", 48, P.ink)}`, pop(a - 5.5) * (1 + 0.06 * Math.sin((a - 5.5) * 14) * (1 - seg(a, 5.5, 6.5)))) : "";
  const g = night(c, tot, 35) + town(c, 113) + layer(hs + machine + shield + pump + fuel + laps + fee, c);
  return { g, in: toScreen(c, 960, G - 300), inC: "#2f6f8a", inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const c5s1Set = makeSet(SHOTS, V, P);
