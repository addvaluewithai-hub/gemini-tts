// Crypto part 6, scene "s6": what didn't work. Four shots (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md):
//   0 ✗ 1: a bakery counter; the coin is offered and pushed back, bread goes for a banknote. ✗ 2: houses with no bank card
//   1 most houses still have no card; a phone lights up and gives each one a little screen account: it was the phone
//   2 ✗ 3: part 1's bank, the middleman they ran from, comes back three times
//   3 three doors: an exchange tower, a fund, a digital-dollar company; ✗ 4: around the book rises a casino with a roulette
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s6.v.js";
import { P, mix, coin, note, house, bank, book, rows, stars, skyline, pill } from "./bank.js";
import { tower, fund } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 53) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -900, 3000, 1080, tot), c, 0.15);
const G = 880;
const ground = () => `<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>`;
const sky = (c, tot, seed) => night(c, tot, seed) + layer(skyline(seed + 7, -900, 3000, G - 30, 100, 240, "#221a5c", "#ffb066"), c, 0.45);
const usd = (r = 44) => disc(0, 0, r, P.green, P.greenD) + text(0, r * 0.36, "$", r * 1.0, "#0f5a35");
const loaf = `${two("M-90 10Q-100 -60 0 -64Q100 -60 90 10Z", "#f0a65a", "#c9773a", 0, 9)}${[-40, 0, 40].map((x) => `<path d="M${x - 14} -40l24 22" stroke="#ffd29a" stroke-width="8" stroke-linecap="round"/>`).join("")}`;
// a bank card, 120 x 76; o.none draws only a dashed outline with a ?
const card = (o = {}) => o.none ? `<path d="${rr(-60, -38, 120, 76, 10)}" fill="none" stroke="${P.steel}" stroke-width="5" stroke-dasharray="10 8"/>${text(0, 16, "?", 44, P.steel)}`
  : `${two(rr(-60, -38, 120, 76, 10), P.blue, P.blueD, 0, 5)}<path d="${rr(-44, -16, 26, 20, 4)}" fill="${P.gold}"/>`;
const ROW = [280, 560, 840, 1120, 1400, 1680], COLS = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD], [P.gold, P.goldD], [P.red, P.redD]];

// ---- 0: nobody buys bread with it; the billion with no bank account ----
function s0(a, tot) {
  const c = camAt(a, [[0, 700, 640, 1.55], [2.7, 720, 640, 1.55], [3.3, 980, 600, 1.0], [5.23, 980, 600, 1.03]]);
  const SX = 760, offer = ease(seg(a, 1.6, 1.95)), back = ease(seg(a, 2.0, 2.3)), cash = ease(seg(a, 2.3, 2.7));
  const stall = `${two(rr(-300, -200, 600, 200, 10), P.wood, P.woodD, 0, 10)}<path d="M-330 -480L-300 -540H300L330 -480Z" fill="${P.redD}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-330 + i * 110} -480h110v40a55 30 0 0 1 -110 0Z" fill="${i % 2 ? P.cream : P.red}"/>`).join("")}<rect x="-290" y="-480" width="16" height="280" fill="${P.woodD}"/><rect x="274" y="-480" width="16" height="280" fill="${P.woodD}"/>`;
  const coinX = SX - 420 + 300 * offer - 300 * back, coinG = a > 0.3 && a < 2.4 + 0.2 ? at(coinX, G - 300, coin(48, "B"), pop(a - 0.3)) : "";
  const noteG = a > 2.2 ? at(lerp(SX - 420, SX - 40, cash), G - 300, note(), 2.2 * pop(a - 2.2)) : "";
  const breadG = at(SX + 140 - 500 * ease(seg(a, 2.55, 3.0)), G - 250, loaf, 1.3);
  const no = a > 2.05 && a < 3.2 ? cross(SX - 40, G - 420, 40, P.red, a - 2.05) : "";
  const shop = at(SX, G, stall) + breadG + coinG + noteG + no;
  // the billion with no bank account: a row of houses, each with an empty card outline
  const rowG = a > 3.2 ? ROW.map((x, i) => at(x, G, house(COLS[i][0], COLS[i][1], { lit: [1, 1, 1] }), 1.0 * pop(a - 3.25 - i * 0.07)) + at(x, G - 400, card({ none: true }), 1.3 * pop(a - 3.5 - i * 0.07))).join("") : "";
  const fade = 1 - seg(a, 2.9, 3.3);
  return { g: sky(c, tot, 53) + layer(ground() + `<g opacity="${fade.toFixed(2)}">${shop}</g>` + rowG, c) };
}
// ---- 1: still no account; the phone gives each house a little screen account ----
function s1(a, tot) {
  const c = camAt(a, [[0, 980, 600, 1.03], [3.4, 980, 560, 1.06]]);
  const ph = ease(seg(a, 1.4, 1.9));
  const phone = at(960, 230, `${rings(0, 0, 150, "#9fe7ff", 0.2 * ph)}${two(rr(-60, -110, 120, 220, 20), "#2c1f63", P.ink, 0, 8)}<path d="${rr(-50, -96, 100, 186, 10)}" fill="#9fe7ff"/>`, 1.1 * pop(a - 1.4));
  const houses = ROW.map((x, i) => { const got = seg(a, 1.9 + i * 0.12, 2.2 + i * 0.12);
    return at(x, G, house(COLS[i][0], COLS[i][1], { lit: [1, 1, 1] }), 1.0) + (got > 0 ? `<path d="M960 300Q${(960 + x) / 2} ${170} ${x} ${G - 400}" fill="none" stroke="#9fe7ff" stroke-width="4" stroke-dasharray="8 10" opacity="${(0.7 * got).toFixed(2)}"/>` : "")
      + at(x, G - 400, got > 0.5 ? `${two(rr(-28, -48, 56, 96, 10), "#2c1f63", P.ink, 0, 4)}<path d="${rr(-22, -40, 44, 76, 6)}" fill="#9fe7ff"/>${text(0, 8, "$", 30, P.ink)}` : card({ none: true }), got > 0.5 ? 1.3 * pop(got - 0.5) : 1.3); }).join("");
  return { g: sky(c, tot, 53) + layer(ground() + houses + phone, c), out: toScreen(c, 960, 230), outC: "#9fe7ff", outZ: 16 };
}
// ---- 2 (host right): the middleman comes back three times ----
function s2(a, tot) {
  const c = camAt(a, [[0, 780, 640, 1.2], [3.85, 800, 640, 1.25]]);
  const run = at(230, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 0.8);
  const banks = [[520, 1.3], [800, 2.1], [1080, 2.9]].map(([x, t0], i) => { const p = a - t0;
    return p > -0.1 ? at(x, G, bank({ sign: [1, 1, 1, 1] }), 0.5 * pop(p, 7, 12)) + (p > 0.3 ? at(x, G - 390, pill(String(i + 1), P.red, P.redD, 80), pop(p - 0.3)) : "") : ""; }).join("");
  const sweat = a > 1.6 ? [0, 1].map((i) => { const u = ((a - 1.6) * 1.3 + i * 0.5) % 1; return `<path d="M${290 + i * 30} ${G - 220 + u * 60}q-8 14 0 22q8 -8 0 -22Z" fill="#9fe7ff" opacity="${(1 - u).toFixed(2)}"/>`; }).join("") : "";
  return { g: sky(c, tot, 61) + layer(ground() + run + sweat + banks, c), in: [960, 540], inC: "#9fe7ff", inZ: 16 };
}
// ---- 3: three doors: exchange, fund, digital-dollar company; ✗ 4: a casino rises around the book ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.95], [2.2, 960, 520, 0.98], [3.0, 960, 560, 1.0], [5.69, 960, 560, 1.06]]);
  const casino = ease(seg(a, 2.9, 4.2)), fadeDoors = 1 - seg(a, 2.6, 3.1);
  const doors = `<g opacity="${fadeDoors.toFixed(2)}">${at(420, G, tower({ name: "EXCHANGE", h: 560 }), 0.95 * pop(a - 0.1))}${at(960, G, fund({ fill: 1 }), 0.95 * pop(a - 0.6))}${at(1500, G, `${two(rr(-200, -420, 400, 420, 12), P.green, P.greenD, 0, 10)}<path d="${rr(-60, -170, 120, 170, 10)}" fill="${P.ink}"/>${at(0, -300, usd(70))}`, 0.95 * pop(a - 1.2))}</g>`;
  // the casino: the book in the middle on a pedestal, a ring of bulbs, a spinning roulette, lit signs
  const BK = [960, 560], spin = tot * 3;
  const bulbs = casino > 0 ? Array.from({ length: 28 }, (_, i) => { const an = i / 28 * 6.283, on = (Math.floor(tot * 6) + i) % 3 === 0;
    return `<circle cx="${(BK[0] + Math.cos(an) * 560 * casino).toFixed(1)}" cy="${(BK[1] + Math.sin(an) * 330 * casino).toFixed(1)}" r="14" fill="${on ? P.gold : "#7a5a2a"}"/>`; }).join("") : "";
  const wheel = casino > 0 ? at(BK[0] + 640, BK[1] + 200, `${disc(0, 0, 120, P.wood, P.woodD)}<g transform="rotate(${(spin * 57).toFixed(1)})">${Array.from({ length: 12 }, (_, i) => `<path d="M0 0L${(Math.cos(i * 0.5236) * 100).toFixed(1)} ${(Math.sin(i * 0.5236) * 100).toFixed(1)}A100 100 0 0 1 ${(Math.cos((i + 1) * 0.5236) * 100).toFixed(1)} ${(Math.sin((i + 1) * 0.5236) * 100).toFixed(1)}Z" fill="${i % 2 ? P.red : P.ink}"/>`).join("")}</g><circle r="22" fill="${P.gold}"/>`, casino) : "";
  const chips = casino > 0.6 ? [0, 1, 2, 3].map((i) => at(BK[0] - 680 + i * 26, BK[1] + 230 - i * 14, `<ellipse rx="40" ry="14" fill="${[P.red, P.blue, P.green, P.gold][i]}"/><ellipse rx="40" ry="14" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="8 8"/>`, 1)).join("") : "";
  const sign = casino > 0.4 ? at(BK[0], BK[1] - 400, `${two(rr(-260, -60, 520, 120, 20), P.pink, P.pinkD, 0, 8)}${[0, 1, 2, 3, 4].map((i) => `<circle cx="${-160 + i * 80}" cy="0" r="22" fill="${(Math.floor(tot * 4) + i) % 2 ? P.gold : "#fff3c2"}"/>`).join("")}`, pop(casino - 0.4)) : "";
  const x4 = a > 4.6 ? cross(BK[0] + 360, BK[1] - 250, 50, P.red, a - 4.6) : "";
  const theBook = casino > 0 ? at(BK[0], BK[1], rings(0, 0, 200, P.gold, 0.18) + book(rows("70", "80")), 1.7 * casino) : "";
  return { g: sky(c, tot, 67) + layer(ground() + doors + bulbs + theBook + wheel + chips + sign + x4, c) };
}

const SHOTS = [s0, s1, s2, s3];
export const c6s6Set = makeSet(SHOTS, V, P);
