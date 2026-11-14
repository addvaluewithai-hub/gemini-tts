// Crypto part 2, scene "secure": why the book is hard to rob, and what that costs. Seven wordless shots, one per board
// beat (shot list: episodes/techforbadguys/explain-crypto-02-world/shots.md), in the world of part 1.
//   0 a lone red rig against a crowd of rigs: two chains race, the honest one runs away page after page
//   1 a bar with a 50% mark the red side must pass; the price of that, a heap of rigs and money bags, outweighs the loot
//   2 51%: small coins crack under a red chain; the big coin behind its shield, 2009 → 2026, never broken
//   3 two pages at the same moment: the chain forks, the next page lands on one, the other greys and drops; an empty meeting table
//   4 power lines into the warehouse; the network weighs as much as a country; a thin gold slice of the planet's power
//   5 a gas flare that burned into the air feeds a rig ✓; a chimney feeds another ✗; the sign keeps flipping
//   6 a newer rig shoves the old one off the rack; the old ones pile up into a mountain of scrap
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2secure.v.js";
import { stars, skyline, house } from "./bank.js";
import { calPage, globe } from "./props.js";
import { P, mix, coin, page, link, rig, warehouse, balance, pylon, bolt } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2600) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1200, x1 = 6400) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="900" fill="${fill}"/>`;
const RED = { c: P.red, cD: P.redD };
const bag = (k = 1, c = "#d9a560", cD = "#b07d3a") => at(0, 0, `${two("M-56 -8Q-78 70 0 70Q78 70 56 -8Q36 -44 18 -54L28 -74H-28L-18 -54Q-36 -44 -56 -8Z", c, cD, 0, 8)}<path d="M-26 -58h52" stroke="${cD}" stroke-width="8" stroke-linecap="round"/>${text(0, 44, "$", 64, "#7a4a12")}`, k);
const redPage = (o = {}) => page({ paper: "#ffd3d8", paperD: "#e59aa4", sealC: P.red, ...o });

// ---- 0: one forger against the planet: two chains race ----
const H0 = { y: 440, x: 640 }, R0 = { y: 830, x: 640 }, GAP = 240;
function s0(a, tot) {
  const c = camAt(a, [[0, 640, 620, 1.2], [2.2, 700, 620, 1.14], [6.4, 1340, 600, 0.76], [7.09, 1360, 600, 0.76]]);
  // the crowd of rigs (top) and the lone red rig (bottom)
  let crowd = ""; const SL = [[0, 0], [1, 0], [2, 0], [3, 0], [0.5, 1], [1.5, 1], [2.5, 1], [1, 2], [2, 2], [1.5, 3]], MORE = [[-1, 0], [4, 0], [-0.5, 1], [3.5, 1], [0, 2], [3, 2], [0.5, 3], [2.5, 3], [1.5, 4]];
  SL.forEach(([cx, r], i) => { crowd += at(110 + cx * 110, H0.y + 90 - r * 68, rig({ spin: tot * 9 + i, blink: tot + i }), 0.48 * pop(a - 0.2 - i * 0.05)); });
  MORE.forEach(([cx, r], i) => { crowd += at(110 + cx * 110, H0.y + 90 - r * 68, rig({ spin: tot * 9 + i, blink: tot + i }), 0.48 * pop(a - 4.25 - i * 0.06)); });
  crowd = rings(275, H0.y - 20, 270, P.green, 0.08) + crowd;
  const lone = rings(275, R0.y - 50, 160, P.red, 0.14 + 0.05 * Math.sin(tot * 4)) + at(275, R0.y + 40, rig({ spin: tot * 9, c: P.red, cD: P.redD }), 1.0 * pop(a - 0.9));
  // the honest chain: a page every half second from 2.3; the red chain: one every second and a half
  let hon = "", red = ""; const hT = (i) => 2.3 + 0.46 * i, rT = (j) => 2.8 + 1.55 * j;
  for (let i = 0; i < 9; i++) { const u = a - hT(i); if (u < 0) break; const x = H0.x + i * GAP, y = H0.y - 90 * (1 - spring(u, 10, 14));
    if (i > 0) hon += link(x - GAP + 88, H0.y, x - 88, H0.y, P.gold, seg(u, 0.1, 0.3), 0.7);
    hon += at(x, y, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""], ["pink", "teal", ""]], seal: 20 + i, block: 1 }), 0.62); }
  for (let j = 0; j < 3; j++) { const u = a - rT(j); if (u < 0) break; const x = R0.x + j * GAP, y = R0.y - 90 * (1 - spring(u, 10, 14));
    if (j > 0) red += link(x - GAP + 88, R0.y, x - 88, R0.y, P.red, seg(u, 0.1, 0.3), 0.7);
    red += at(x, y, redPage({ rows: [["blue", "pink", ""], [P.red, P.red, ""]], seal: 40 + j }), 0.62); }
  // feeding lines from each side to its chain
  const feed = (x0, y, col, on) => (on ? `<path d="M${x0} ${y}H${H0.x - 90}" stroke="${col}" stroke-width="6" stroke-dasharray="10 14" stroke-dashoffset="${(-tot * 80).toFixed(0)}" opacity=".7"/>` : "");
  // the red head loses: it shakes, a cross over it
  const nR = a < rT(1) ? 1 : a < rT(2) ? 2 : 3, rx = R0.x + (nR - 1) * GAP, lost = a - 6.0;
  const verdict = lost > 0 ? cross(rx + 80, R0.y - 140, 54, P.red, lost) : "";
  const nH = Math.max(1, Math.min(9, Math.floor((a - 2.3) / 0.46) + 1)), hx = H0.x + (nH - 1) * GAP;
  const lead = a > 3.2 ? `<path d="M${rx + 80} ${R0.y - 170}L${hx} ${H0.y + 140}" stroke="${P.cream}" stroke-width="4" stroke-dasharray="6 12" opacity="${(0.35 * seg(a, 3.2, 3.8)).toFixed(2)}"/>` : "";
  const g = night(c, tot, 31) + layer(skyline(5, -800, 3200, 1080, 80, 220, "#1d1450"), c, 0.4) + layer(ground(1000) + feed(470, H0.y, P.green, a > 2.2) + feed(420, R0.y, P.red, a > 2.7) + crowd + lone + lead + hon + red + verdict, c);
  const oi = Math.max(0, Math.min(nH - 1, Math.round((c.x - H0.x) / GAP))); // leave through the page nearest the middle of the frame
  return { g, out: toScreen(c, H0.x + oi * GAP, H0.y), outC: P.cream, outZ: 18 };
}

// ---- 1: past half the network, at a price higher than the loot ----
function s1(a, tot) {
  const c = camAt(a, [[0, 910, 330, 1.3], [2.6, 910, 330, 1.3], [3.5, 880, 560, 0.92], [7.92, 880, 565, 0.94]]);
  const BX = 360, BW = 1100, BY = 200, f = kf(a, [[0, 0.12], [1.4, 0.12], [2.5, 0.53]]), mid = BX + BW / 2, past = a > 2.25;
  const bar = `<path d="${rr(BX - 12, BY - 72, BW + 24, 144, 72)}" fill="${P.ink}"/><path d="${rr(BX, BY - 60, BW, 120, 60)}" fill="${P.greenD}"/>${Array.from({ length: 8 }, (_, i) => at(BX + 120 + i * 125, BY + 34, rig({ spin: tot * 6 + i }), 0.4)).join("")}
    <path d="${rr(BX, BY - 60, Math.max(120, BW * f), 120, 60)}" fill="${P.red}"/>${at(BX + 80, BY + 34, rig({ spin: tot * 9, c: P.redD, cD: "#a8263a" }), 0.4)}
    <path d="M${mid} ${BY - 110}V${BY + 110}" stroke="${past ? P.gold : P.cream}" stroke-width="10" stroke-dasharray="16 10"/>${text(mid, BY - 128, "50%", 84, past ? P.gold : P.cream)}${past ? rings(BX + BW * f, BY, 70 * spring(a - 2.25, 7, 10), P.gold, 0.3 * (1 - seg(a, 2.6, 3.2))) : ""}`;
  // the heap on the left pan, the loot on the right
  const items = [[-80, 0, "r"], [50, 0, "r"], [-14, -62, "r"], [110, -4, "b"], [-120, -60, "b"], [60, -64, "b"], [-60, -122, "r"], [30, -128, "b"]];
  let L = ""; items.forEach(([x, y, kind], i) => { const p = pop(a - 3.0 - i * 0.14); if (p <= 0) return; L += at(x, y - 40 * (1 - p), kind === "r" ? rig({ spin: tot * 8 + i, c: P.red, cD: P.redD }) : bag(1.05), (kind === "r" ? 0.55 : 0.9) * p); });
  const heavy = a > 4.6 ? rings(0, -90, 190 * (1 + 0.05 * Math.sin(tot * 5)), P.red, 0.12 * seg(a, 6.4, 6.8)) : "";
  const R = a > 4.75 ? at(0, -20 - 260 * (1 - easeOut(seg(a, 4.75, 5.05))), bag(0.55, "#e6c38a", "#c49a55")) : "";
  const tilt = a < 5.05 ? 0 : -1 * clamp(spring(a - 5.05, 6, 9) * 1.05, 0, 1.15);
  const up = 700 * (1 - easeOut(seg(a, 2.6, 3.1)));
  const bal = at(820, 1050 + up, balance(tilt, heavy + L, R), 1.35);
  const g = night(c, tot, 17) + layer(ground(1050) + bar + bal, c);
  const lootPos = toScreen(c, 820 + 1.35 * Math.cos(tilt * 0.22) * 340, 1050 + 1.35 * (-520 + Math.sin(tilt * 0.22) * 340 + 90));
  return { g, in: [960, 540], inC: P.cream, inZ: 18, out: lootPos, outC: "#e6c38a", outZ: 18 };
}

// ---- 2: 51%: small coins break, the big one never has ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [3.3, 960, 540, 1.0], [3.9, 1230, 540, 1.08], [5.16, 1240, 540, 1.1]]);
  const big51 = text(0, 70, "51%", 220, P.red), t51 = at(960, 250, rings(0, 0, 210, P.red, 0.12) + big51, pop(a - 0.9) * (1 - 0.35 * seg(a, 2.0, 2.4)));
  // three small coins, a red chain swings down and cracks them
  const hit = 2.45; let small = "";
  [[650, P.teal, P.tealD], [880, "#b9c2e6", P.steelD], [1110, P.violet, P.violetD]].forEach(([x, col, colD], i) => { const t = a - hit - i * 0.12, y = 720;
    if (t < 0) { small += at(x, y, disc(0, 0, 58, col, colD) + `<circle r="40" fill="none" stroke="${colD}" stroke-width="6"/>`, 1.5 * pop(a - 0.3 - i * 0.1)); return; }
    const s = easeOut(clamp(t / 0.5)); [-1, 1].forEach((d) => { small += at(x + d * 40 * s, y + 140 * s * s, `<clipPath id="half${i}${d}"><rect x="${d < 0 ? -70 : 0}" y="-70" width="70" height="140"/></clipPath><g clip-path="url(#half${i}${d})">${disc(0, 0, 58, col, colD)}<path d="M0 -60L-12 -20L10 6L-8 60" fill="none" stroke="${P.ink}" stroke-width="6"/></g>`, 1.5, d * 30 * s); }); });
  const swing = a < hit ? 1 - easeIn(seg(a, 2.1, hit)) : a < 3.2 ? 0.08 * Math.sin((a - hit) * 14) * Math.exp(-(a - hit) * 3) : 0, cx0 = 880;
  let chain = ""; const tipY = lerp(-60, 640, a < hit ? easeIn(seg(a, 2.1, hit)) : 1) - (a > 3.4 ? 0 : 0);
  // later the same chain lunges at the big coin and bounces back
  const lunge = seg(a, 4.0, 4.3), back = seg(a, 4.3, 4.8), tip = a < 3.6 ? [cx0 + swing * 300, tipY] : [lerp(1080, 1350, lunge) - 180 * easeOut(back), lerp(300, 520, lunge) - 140 * easeOut(back)];
  const top = a < 3.6 ? [cx0, -80] : [900, -80];
  if (a > 2.05) for (let i = 0; i < 9; i++) { const p0 = i / 9, p1 = (i + 1) / 9; chain += link(lerp(top[0], tip[0], p0), lerp(top[1], tip[1], p0), lerp(top[0], tip[0], p1), lerp(top[1], tip[1], p1), P.red, 1, 0.7); }
  // the big coin behind a shield; years fly past, it never breaks
  const BC = [1480, 560], shield = `<path d="M0 -270L210 -190V-10Q210 170 0 260Q-210 170 -210 -10V-190Z" fill="${P.green}" opacity=".18" stroke="${P.green}" stroke-width="12"/>`;
  const flash = a > 4.3 ? rings(0, 0, 260 * spring(a - 4.3, 7, 10), P.green, 0.3 * (1 - seg(a, 4.5, 5.0))) : "";
  const bigC = at(BC[0], BC[1], flash + rings(0, 0, 200, P.gold, 0.14) + coin(150, "B") + shield, pop(a - 3.4));
  const yr = 2009 + Math.round(17 * ease(seg(a, 3.75, 4.75))), cal = a > 3.6 ? at(BC[0] + 330, BC[1] - 300, calPage(String(yr), "", 1, 150), 0.62 * pop(a - 3.6), 6) : "";
  const ok = a > 4.6 ? check(BC[0] + 170, BC[1] + 200, 46, P.green, a - 4.6) : "";
  const g = night(c, tot, 23) + layer(ground(900, "#221650") + t51 + small + chain + bigC + cal + ok, c);
  return { g, in: [960, 540], inC: "#e6c38a", inZ: 18, out: toScreen(c, BC[0], BC[1]), outC: P.gold, outZ: 18 };
}

// ---- 3: a tie: the network follows the longer chain; no meeting needed ----
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 500, 1.0], [1.6, 860, 500, 0.98], [3.5, 880, 500, 0.96], [4.4, 880, 760, 0.95], [5.0, 880, 1060, 1.0], [6.09, 880, 1070, 1.03]]);
  const K = 0.72, rowsA = [["blue", "pink", ""], ["teal", "violet", ""]];
  let g = "";
  [120, 420, 720].forEach((x, i) => { if (i) g += link(x - 300 + 100, 500, x - 100, 500, P.gold, 1, 0.75); g += at(x, 500, page({ rows: rowsA, seal: 60 + i, block: 1 }), K); });
  const A = [1060, 290], B = [1060, 710], NA = [1400, 290];
  const pA = pop(a - 0.15), pB = pop(a - 0.35), grey = seg(a, 3.7, 4.0), fall = easeIn(seg(a, 4.0, 4.7));
  g += link(820, 450, A[0] - 100, A[1], P.gold, seg(a, 0.2, 0.5), 0.75) + at(A[0], A[1], page({ rows: rowsA, seal: 71, block: 1 }), K * pA);
  const bx = B[0] + 60 * fall, by = B[1] + 600 * fall;
  if (fall < 1) g += link(820, 550, bx - 100, by, mix(P.gold, "#6a6890", grey), seg(a, 0.4, 0.7) * (1 - seg(a, 3.95, 4.05)), 0.75) + at(bx, by, page({ rows: rowsA, seal: 72, block: 1 - grey, paper: mix(P.cream, "#8d8aa8", grey), paperD: mix(P.creamD, "#6a6890", grey), sealC: grey > 0.5 ? "#6a6890" : undefined }), K * pB, 40 * fall);
  // the next page lands on the top branch: the longer chain
  const u = a - 1.9; if (u > 0) { g += link(A[0] + 100, A[1], NA[0] - 100, NA[1], P.gold, seg(u, 0.4, 0.7), 0.75) + at(NA[0], NA[1] - 120 * (1 - spring(u, 10, 14)), page({ rows: rowsA, seal: 73, block: 1 }), K);
    if (u > 0.8) g += rings(760, 400, 680 * spring(u - 0.8, 6, 8), P.gold, 0.12 * (1 - seg(u, 1.6, 2.2))); }
  // tie marks over both tips at the same instant
  if (a > 0.3 && a < 1.6) g += [A, B].map(([x, y]) => rings(x, y, 170 * spring(a - 0.3, 7, 10), P.cream, 0.25 * (1 - seg(a, 0.9, 1.6)))).join("");
  // the empty meeting table under a spotlight
  const T = [880, 1220], tbl = a > 4.3 ? at(T[0], T[1], `<path d="M-280 -440L280 -440L560 40H-560Z" fill="#ffd98a" opacity="${(0.08 * seg(a, 4.6, 5.0)).toFixed(3)}"/>${[-300, -180, -60, 60, 180, 300].map((x) => two(rr(x - 46, -190, 92, 120, 18), "#4b3d8f", "#36296e", 8, 0)).join("")}
    ${two(rr(-400, -80, 800, 44, 10), P.wood, P.woodD, 0, 10)}<path d="M-360 -36v120M360 -36v120" stroke="${P.woodD}" stroke-width="22"/>${at(200, -96, `<path d="${rr(-40, -26, 80, 40, 10)}" fill="${P.woodD}"/><path d="M0 -6L70 -40" stroke="${P.wood}" stroke-width="12" stroke-linecap="round"/>`)}${at(-180, -88, `<path d="M-30 0h60l-8 -30h-44Z" fill="${P.steel}"/>`)}
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="${(-300 + rnd(i * 5) * 600).toFixed(0)}" cy="${(-300 + ((tot * 20 + i * 70) % 260)).toFixed(0)}" r="4" fill="#ffe9b0" opacity=".5"/>`).join("")}`, 1.3 * pop(a - 4.5, 7, 12)) : "";
  const out = toScreen(c, T[0], T[1] - 180);
  return { g: night(c, tot, 41) + layer(ground(1220, "#1f1650") + g + tbl, c), in: toScreen(c, 720, 500), inC: P.gold, inZ: 18, out, outC: "#36296e", outZ: 20 };
}

// ---- 4: the bill: electricity like a whole country, about half a percent of the planet's ----
function s4(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.0], [2.3, 840, 600, 1.02], [3.0, 2900, 480, 0.98], [5.95, 2920, 480, 1.0], [6.6, 4800, 560, 1.08], [8.6, 4810, 560, 1.12]]);
  const G = 1000, WH = [1150, G];
  // pylons and the cable into the warehouse, sparks running along it
  const cable = `M300 ${G - 470}Q560 ${G - 300} ${WH[0] - 330} ${G - 330}`, cable2 = `M${WH[0] + 450} ${G - 200}Q2000 ${G - 560} 2500 ${G - 480}`;
  let sparks = ""; if (a > 0.8) for (let i = 0; i < 4; i++) { const p = ((a - 0.8) * 0.9 + i / 4) % 1, b = bez([300, G - 470], [560, G - 300], [WH[0] - 330, G - 330], p); sparks += at(b[0], b[1], bolt(P.gold, 0.35)); }
  const A = at(300, G, pylon(), 1.0) + `<path d="${cable}" fill="none" stroke="${P.steel}" stroke-width="7"/><path d="${cable2}" fill="none" stroke="${P.steel}" stroke-width="7" opacity=".6"/>` + at(WH[0], WH[1], warehouse(900, { heat: seg(a, 1.0, 1.6), t: tot, spin: tot * 5 })) + sparks;
  // the balance: the network on the left, a country on the right, level
  const BX = 2900, inL = seg(a, 2.9, 3.2), inR = a - 3.4;
  const L = inL > 0 ? at(0, -260 * (1 - easeOut(inL)), at(0, 0, warehouse(560, { t: tot, spin: tot * 5 }), 0.45) + at(0, -190, bolt(P.gold, 0.7))) : "";
  const island = `<ellipse cx="0" cy="-10" rx="150" ry="34" fill="#1d6fb8"/>${two("M-120 -10Q-110 -70 -40 -76Q30 -96 90 -60Q132 -40 120 -10Z", P.green, P.greenD, 0, 8)}${[[-70, -52], [-10, -70], [50, -60], [-40, -40], [30, -38]].map(([x, y], i) => at(x, y, house([P.blue, P.pink, P.teal, P.violet, P.gold][i], [P.blueD, P.pinkD, P.tealD, P.violetD, P.goldD][i], { lit: [1, 1, 1] }), 0.18)).join("")}${rings(0, -60, 120, P.win, 0.08)}`;
  const R = inR > 0 ? at(0, -260 * (1 - easeOut(seg(inR, 0, 0.3))), island) : "";
  const tilt = a < 3.2 ? 0 : a < 3.7 ? -0.9 * spring(a - 3.2, 8, 12) : -0.9 * (1 - spring(a - 3.7, 5, 9)) * 1;
  const tag = a > 5.35 ? at(0, -470, `<path d="M0 -20v40" stroke="${P.steel}" stroke-width="4"/>${two(rr(-110, 20, 220, 56, 12), P.cream, P.creamD, 0, 5)}${text(0, 62, "Cambridge", 34, P.ink)}`, pop(a - 5.35), 4 * Math.sin(tot * 2)) : "";
  const B = at(BX, G, balance(clamp(tilt, -1.1, 1.1), L, R) + tag, 1.35);
  // the planet and its ring of power, a thin gold slice
  const GX = 4700, GY = 560, RR = 360, sl = seg(a, 6.3, 7.2), ang = 3 * Math.PI / 180 * sl, a0 = -Math.PI / 2;
  const ring = `<circle cx="${GX}" cy="${GY}" r="${RR}" fill="none" stroke="#3c4a96" stroke-width="54"/><circle cx="${GX}" cy="${GY}" r="${RR}" fill="none" stroke="#5a6ac0" stroke-width="54" stroke-dasharray="6 40" opacity=".5"/>`;
  const slice = sl > 0 ? `<path d="M${GX + Math.cos(a0) * RR} ${GY + Math.sin(a0) * RR}A${RR} ${RR} 0 0 1 ${(GX + Math.cos(a0 + ang) * RR).toFixed(1)} ${(GY + Math.sin(a0 + ang) * RR).toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="62"/>` + rings(GX + 6, GY - RR, 50 + 8 * Math.sin(tot * 5), P.gold, 0.3) : "";
  const lab = a > 7.0 ? at(GX + 470, GY - 300, `<path d="M-150 0L-420 -60" stroke="${P.gold}" stroke-width="6"/>${two(rr(-150, -50, 300, 100, 50), P.gold, P.goldD, 0, 6)}${text(0, 26, "≈ 0.5%", 70, P.ink)}`, pop(a - 7.0)) : "";
  const C = at(GX, GY, globe(250, tot * 0.01, { night: 0.3 })) + ring + slice + lab;
  const poles = Array.from({ length: 6 }, (_, i) => `<path d="M${1700 + i * 520} ${G}V${G - 380}" stroke="#3a2a7a" stroke-width="16"/>`).join("") + `<path d="M1600 ${G - 370}${Array.from({ length: 6 }, (_, i) => `Q${1960 + i * 520} ${G - 300} ${2220 + i * 520} ${G - 370}`).join("")}" fill="none" stroke="#5a4a9a" stroke-width="5"/>`;
  const g = night(c, tot, 53, 6000) + layer(skyline(9, -800, 6000, G - 20, 90, 260, "#1f1652", "#ffb066"), c, 0.45) + layer(ground(G) + poles + A + B + C, c);
  return { g, in: [960, 540], inC: "#36296e", inZ: 20 };
}

// ---- 5: wasted gas and smoking coal: both feed rigs, and the argument goes on ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1180, 660, 1.12], [5.36, 1200, 650, 1.16]]);
  const G = 960, FX = 680, RX1 = 1000, CX = 1420, RX2 = 1700;
  const bend = ease(seg(a, 0.9, 1.6)), fl = 1 - 0.75 * bend, flick = 1 + 0.12 * Math.sin(tot * 23) + 0.08 * Math.sin(tot * 37);
  const flame = at(FX, G - 520, `<path d="M0 0Q-60 -60 -20 -150Q0 -110 10 -190Q70 -110 40 -40Q60 -60 50 -20Q40 6 0 0Z" fill="#ff8a3a"/><path d="M0 0Q-26 -40 -6 -96Q10 -60 24 -36Q30 -10 0 0Z" fill="${P.gold}"/>`, [fl, fl * flick]);
  const flare = `<path d="${rr(FX - 22, G - 520, 44, 520, 6)}" fill="${P.steel}"/><path d="${rr(FX - 34, G - 530, 68, 26, 8)}" fill="${P.steelD}"/>` + flame + (bend > 0 ? drawn(`M${FX + 22} ${G - 420}H${FX + 140}Q${FX + 200} ${G - 420} ${FX + 200} ${G - 360}V${G - 140}Q${FX + 200} ${G - 90} ${RX1 - 143} ${G - 90}`, bend, P.steelD, 26) : "");
  const r1 = at(RX1, G, rig({ spin: tot * 10 * bend, on: bend > 0.9 ? 1 : 0 }), 1.3);
  const ok = a > 1.75 ? check(RX1, G - 270, 56, P.green, a - 1.75) : "";
  // the chimney and its smoke
  const smoke = Array.from({ length: 6 }, (_, i) => { const u = ((tot * 0.35 + i / 6) % 1); return `<circle cx="${(CX + 30 * Math.sin(u * 5 + i) + 60 * u).toFixed(1)}" cy="${(G - 560 - 380 * u).toFixed(1)}" r="${(40 + 70 * u).toFixed(1)}" fill="#6e6a86" opacity="${(0.55 * (1 - u)).toFixed(2)}"/>`; }).join("");
  const chim = smoke + `<path d="M${CX - 70} ${G}L${CX - 50} ${G - 560}H${CX + 50}L${CX + 70} ${G}Z" fill="#9a4a3a"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${CX - 66 + i * 2} ${G - 80 - i * 90}h${132 - i * 4}" stroke="#7a3a2e" stroke-width="6"/>`).join("")}<path d="${rr(CX - 64, G - 580, 128, 30, 6)}" fill="#7a3a2e"/>`;
  const p2 = ease(seg(a, 2.3, 2.7)), pipe2 = p2 > 0 ? drawn(`M${CX + 60} ${G - 90}H${RX2 - 143}`, p2, P.steelD, 26) : "";
  const r2 = at(RX2, G, rig({ spin: tot * 10 * p2, on: p2 > 0.9 ? 1 : 0 }), 1.3), no = a > 2.75 ? cross(RX2, G - 270, 56, P.red, a - 2.75) : "";
  // the sign between them, turning over and over
  const sp = a > 3.0 ? (a - 3.0) * 4.2 : 0, face = Math.cos(sp * Math.PI), showOk = face >= 0;
  const sign = a > 2.9 ? at(1230, 340, `<path d="M0 0V420" stroke="${P.steelD}" stroke-width="14"/><g transform="scale(${Math.max(0.05, Math.abs(face)).toFixed(3)} 1)">${showOk ? check(0, 0, 90, P.green, 1) : cross(0, 0, 90, P.red, 1)}</g>`, pop(a - 2.9)) : "";
  const g = night(c, tot, 61) + layer(skyline(29, -800, 2800, G - 20, 80, 240, "#1f1652"), c, 0.45) + layer(ground(G) + flare + r1 + ok + chim + pipe2 + r2 + no + sign, c);
  return { g };
}

// ---- 6: newer rigs win; the old ones pile into a mountain of scrap ----
function s6(a, tot) {
  const c = camAt(a, [[0, 780, 760, 1.35], [2.6, 860, 760, 1.25], [4.0, 1230, 700, 0.86], [5.29, 1250, 690, 0.84]]);
  const SY = 760, old = { c: "#6d6888", cD: "#55506e" };
  const shelf = `<path d="${rr(380, SY, 820, 30, 8)}" fill="${P.wood}"/><path d="M420 ${SY + 30}V1000M1160 ${SY + 30}V1000" stroke="${P.woodD}" stroke-width="26"/>`;
  // a shiny new rig slides in from the left and shoves the line along; the end one falls off
  const nx = lerp(-200, 520, easeOut(seg(a, 0.4, 1.3)));
  const shiny = at(nx, SY, rings(0, -70, 130, P.gold, 0.18) + rig({ spin: tot * 12, c: "#7a6cd6", cD: "#5a4cb8" }) + `<path d="${rr(-110, -130, 220, 10, 5)}" fill="${P.gold}"/>`, 0.8);
  let olds = ""; [0, 1, 2].forEach((i) => { let x = Math.max(520, nx + 200) + i * 200, y = SY, rot = 0;
    if (i === 2) { const f = seg(a, 1.5, 2.5); x += 160 * f; y += 260 * f * f; rot = 80 * f; }
    if (i === 2 && a > 2.5) return; olds += at(x, y, rig({ on: i === 2 && a > 1.5 ? 0 : 1, spin: tot * 4, ...old }), 0.8, rot); });
  // the heap: rows of dead rigs, growing into a mountain
  const HX = 1300, HG = 1000; let heap = "", n = 0; const grow = seg(a, 2.8, 4.9);
  for (let r = 0; r < 8; r++) for (let i = 0; i < 9 - r; i++) { const k = n++, t0 = 2.8 + k / 45 * 2.0; if (a < t0) continue; const land = easeOut(seg(a, t0, t0 + 0.3));
    const x = HX + (i - (8 - r) / 2) * 128 + (rnd(k) - 0.5) * 30, y = HG - r * 72 - 900 * (1 - land), rot = (rnd(k + 9) - 0.5) * 40;
    heap += at(x, y, rig({ on: 0, c: mix("#6d6888", "#4a4560", rnd(k + 3)), cD: "#3a3550", spin: k }), 0.6, rot); }
  const dust = grow > 0 && grow < 1 ? rings(HX, HG - 260, 340 + 240 * grow, "#8d8aa8", 0.06) : "";
  const g = night(c, tot, 71) + layer(skyline(37, -800, 2800, HG - 20, 80, 240, "#1f1652"), c, 0.45) + layer(ground(HG) + dust + heap + shelf + olds + shiny, c);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
// in a Short (cfg.vertical) the portrait versions of c2secure.v.js (see makeSet in kit.js)
export const c2secureSet = makeSet(SHOTS, V, P);
