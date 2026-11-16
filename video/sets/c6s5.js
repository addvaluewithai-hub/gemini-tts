// Crypto part 6, scene "s5": what worked. Four shots (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md):
//   0 a judge's bench with three report cards (part 4's); a green ✓ banner lights over them: what worked
//   1 ✓ 1: part 1's book under its glass dome with part 2's chain of pages; calendar 2009 → 2026, 17 YEARS;
//     an eraser tries an old row and nothing comes off
//   2 ✓ 2: a copier tries to copy a coin; only a flat grey picture comes out, the coin stays one; card 3 slides in
//   3 ✓ 3: the digital dollar crosses a border to a house whose bank has a cracked front
import { clamp, lerp, ease, easeOut, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s5.v.js";
import { P, mix, coin, house, bank, book, rows, stars, skyline, pill } from "./bank.js";
import { calPage } from "./props.js";
import { page, link } from "./c2props.js";
import { reportCard } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 47) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -900, 3000, 1080, tot), c, 0.15);
const G = 880;
const ground = (fill = P.ground) => `<rect x="-900" y="${G}" width="3800" height="600" fill="${fill}"/>`;
const usd = (r = 44) => disc(0, 0, r, P.green, P.greenD) + text(0, r * 0.36, "$", r * 1.0, "#0f5a35");

// ---- 0: the bench, three cards, a ✓ banner ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 0.95], [2.6, 960, 540, 1.0], [3.62, 960, 520, 1.08]]);
  const bench = `${two(rr(-760, -200, 1520, 200, 14), P.wood, P.woodD, 0, 12)}<path d="${rr(-800, -230, 1600, 40, 10)}" fill="${P.woodD}"/>`;
  const lit = seg(a, 2.75, 3.1);
  const cards = [-440, 0, 440].map((x, i) => at(960 + x, G - 420, reportCard(String(i + 1), { c: [P.blue, P.violet, P.teal][i], mark: a > 2.85 + i * 0.12 ? "✓" : "", inner: at(0, -10, coin(62, "B")) }), 1.05 * pop(a - 0.3 - i * 0.15))).join("");
  const banner = lit > 0 ? at(960, G - 720, `<path d="M-330 -60H330L300 0L330 60H-330L-300 0Z" fill="${P.green}"/>${check(0, 0, 44, P.greenD, 1)}`, [ease(lit), 1]) : "";
  const g = ground() + at(960, G, bench) + cards + (lit > 0 ? rings(960, G - 420, 700, P.green, 0.08 * lit) : "") + banner;
  return { g: night(c, tot) + layer(skyline(83, -900, 3000, G - 30, 100, 260, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, 520, G - 420), outC: P.cream, outZ: 16 };
}

// ---- 1: ✓ 1: the book, the chain, 17 years; an eraser fails ----
function s1(a, tot) {
  const c = camAt(a, [[0, 760, 480, 1.25], [2.6, 820, 470, 1.15], [4.4, 980, 500, 1.2], [6.31, 1000, 500, 1.25]]);
  const BK = [700, 470], dome = `<path d="M${BK[0] - 300} ${G - 40}V${BK[1] - 40}A300 300 0 0 1 ${BK[0] + 300} ${BK[1] - 40}V${G - 40}" fill="#cfe9ff" opacity=".1" stroke="#cfe9ff" stroke-width="8"/>`;
  const stand = `${two(rr(BK[0] - 60, BK[1] + 140, 120, G - BK[1] - 180, 8), "#7a55c9", "#5b3aa6", 12, 0)}<path d="${rr(BK[0] - 180, G - 50, 360, 50, 10)}" fill="#5b3aa6"/>`;
  const glow = rings(BK[0], BK[1], 240, P.gold, 0.14 + 0.05 * Math.sin(tot * 2));
  const bk = at(BK[0], BK[1], book(rows("70", "80")), 1.4);
  // part 2's chain of pages running off to the right
  let chain = ""; for (let i = 0; i < 5; i++) { const x = 1150 + i * 260, p = seg(a, 0.9 + i * 0.15, 1.3 + i * 0.15); if (p <= 0) continue;
    chain += (i ? link(x - 260 + 85, 500, x - 85, 500, P.gold, p, 0.7) : link(BK[0] + 240, 500, x - 85, 500, P.gold, p, 0.7)) + at(x, 500, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""]], seal: i + 3, prev: i ? i + 2 : null, block: 1 }), 0.55 * pop(p)); }
  // calendar 2009 → 2026, then 17 YEARS
  const yr = 2009 + Math.round(17 * ease(seg(a, 2.0, 3.6))), cal = a > 1.8 ? at(1300, 200, calPage(String(yr), "", 1, 150), 0.7 * pop(a - 1.8), -4) : "";
  const yrs = a > 3.4 ? at(1600, 210, pill("17 YEARS", P.gold, P.goldD, 290), 1.5 * pop(a - 3.4)) : "";
  // an eraser rubs the first page's top row; crumbs fall, the row stays and shines
  const rub = a > 4.5 && a < 5.9 ? Math.sin((a - 4.5) * 18) * 40 : 0, er = a > 4.4 ? at(1150 + rub, 420, `<g transform="rotate(-20)">${two(rr(-60, -32, 120, 64, 10), P.pink, P.pinkD, 0, 8)}<path d="${rr(10, -32, 50, 64, 8)}" fill="#9fb0ff"/></g>`, pop(a - 4.4)) : "";
  const crumbs = a > 4.6 ? [0, 1, 2, 3, 4].map((i) => { const u = ((a - 4.6) * 1.4 + i * 0.21) % 1; return `<circle cx="${1100 + i * 25}" cy="${470 + u * 300}" r="5" fill="${P.pinkD}" opacity="${(1 - u).toFixed(2)}"/>`; }).join("") : "";
  const ok = a > 5.6 ? rings(1150, 460, 70, P.gold, 0.3 * (1 - seg(a, 5.9, 6.3))) + check(1260, 380, 34, P.green, a - 5.6) : "";
  const g = ground() + glow + stand + bk + dome + chain + er + crumbs + ok + cal + yrs;
  return { g: night(c, tot) + layer(g, c), in: toScreen(c, BK[0], BK[1]), inC: P.cream, inZ: 16 };
}

// ---- 2 (host right): ✓ 2: the copier tries to copy the coin; only a flat picture comes out ----
function s2(a, tot) {
  const c = camAt(a, [[0, 840, 520, 1.2], [3.97, 860, 520, 1.25]]);
  const CX = 760;
  const copier = `${two(rr(-260, -300, 520, 300, 20), "#5a6aa8", "#44529a", 0, 12)}<path d="${rr(-240, -340, 480, 50, 12)}" fill="${P.steel}"/>${two(rr(-260, -360, 520, 30, 10), "#cdd5ee", P.steel, 0, 6)}<path d="${rr(140, -250, 80, 30, 8)}" fill="${P.ink}"/><circle cx="-180" cy="-235" r="16" fill="${a > 0.8 && a < 2.4 ? P.green : "#3a2a7a"}"/>${rings(0, -340, 200, "#9fe7ff", a > 0.9 && a < 1.6 ? 0.25 : 0)}`;
  const flash = a > 0.9 && a < 1.6 ? `<path d="${rr(CX - 240, G - 345, 480, 10, 4)}" fill="#ffffff" opacity="${(1 - seg(a, 0.9, 1.6)).toFixed(2)}"/>` : "";
  const realCoin = at(CX, G - 420 - 18 * Math.sin(Math.min(a, 1) * Math.PI), rings(0, 0, 100, P.gold, 0.2) + coin(78, "B"), pop(a - 0.1));
  // the copy: a flat grey sheet slides out of the tray to the right
  const out = ease(seg(a, 1.5, 2.3)), copy = out > 0 ? at(CX + 300 + 160 * out, G - 120, `${two(rr(-110, -80, 220, 160, 8), "#e8e8ee", "#c8c8d4", 0, 6)}${at(0, 0, `<circle r="56" fill="#b8b8c4"/><circle r="40" fill="none" stroke="#9a9aa8" stroke-width="7"/>${text(0, 22, "B", 60, "#9a9aa8")}`)}`, 1, -6 * out) : "";
  const nope = a > 2.4 ? cross(CX + 480, G - 240, 36, P.red, a - 2.4) : "", one = a > 2.55 ? check(CX + 120, G - 520, 38, P.green, a - 2.55) + at(CX - 140, G - 520, pill("× 1", P.gold, P.goldD, 140), pop(a - 2.6)) : "";
  const card3 = a > 3.35 ? at(1340 - 260 * (1 - easeOut(seg(a, 3.35, 3.85))), 300, reportCard("3", { c: P.teal }), 0.7) : "";
  const g = ground() + at(CX, G, copier) + flash + realCoin + copy + nope + one + card3;
  return { g: night(c, tot) + layer(skyline(59, -900, 3000, G - 30, 100, 240, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c), out: toScreen(c, 1340, 300), outC: P.cream, outZ: 16 };
}

// ---- 3: ✓ 3: the digital dollar crosses a border to a house whose bank has a cracked front ----
function s3(a, tot) {
  const c = camAt(a, [[0, 600, 640, 1.4], [1.2, 820, 600, 1.2], [2.6, 1320, 620, 1.3], [3.71, 1380, 620, 1.38]]);
  const BX = 1320, p = ease(seg(a, 0.4, 2.6)), b = [lerp(380, 1560, p), G - 260 - 260 * Math.sin(Math.PI * p)];
  const border = `<path d="M960 ${G - 520}V${G}" stroke="${P.red}" stroke-width="8" stroke-dasharray="26 18"/>${[0, 1, 2].map((i) => `<path d="${rr(940, G - 120 - i * 150, 40, 20, 6)}" fill="${P.steel}"/>`).join("")}`;
  const sender = at(380, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.1);
  const crack = seg(a, 0.2, 1.0), bk = at(BX, G, bank({ night: true, sign: [1, 1, 1, 1] }), 0.6) + (crack > 0 ? drawn(`M${BX - 140} ${G - 380}L${BX - 60} ${G - 280}L${BX - 110} ${G - 200}L${BX - 20} ${G - 120}`, crack, P.ink, 10) + drawn(`M${BX + 120} ${G - 360}L${BX + 70} ${G - 260}L${BX + 140} ${G - 170}`, crack, P.ink, 9) : "");
  const dim = a > 1.0 ? `<path d="${rr(BX - 240, G - 400, 480, 400, 4)}" fill="${P.ink}" opacity="${(0.35 * seg(a, 1.0, 1.6)).toFixed(2)}"/>` : "";
  const receiver = at(1660, G, house(P.pink, P.pinkD, { lit: [1, a > 2.7 ? 1 : 0, a > 2.7 ? 1 : 0] }), 0.9);
  const trail = p > 0 && p < 1 ? [1, 2, 3].map((q) => { const pp = Math.max(0, p - q * 0.025); return `<circle cx="${lerp(380, 1560, pp).toFixed(1)}" cy="${(G - 260 - 260 * Math.sin(Math.PI * pp)).toFixed(1)}" r="${14 - q * 3}" fill="${P.green}" opacity="${0.6 - q * 0.15}"/>`; }).join("") : "";
  const dollar = p < 1 ? at(b[0], b[1], usd(46), pop(a - 0.3)) : "", landed = a > 2.6 ? at(1560, G - 280, rings(0, 0, 90, P.green, 0.3 * (1 - seg(a, 2.8, 3.4))) + usd(40), 1) + check(1700, G - 360, 32, P.green, a - 2.8) : "";
  const g = ground() + border + sender + bk + dim + receiver + trail + dollar + landed;
  return { g: night(c, tot) + layer(skyline(71, -900, 3000, G - 30, 100, 240, "#221a5c", "#ffb066"), c, 0.45) + layer(g, c), in: [960, 540], inC: P.cream, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3];
export const c6s5Set = makeSet(SHOTS, V, P);
