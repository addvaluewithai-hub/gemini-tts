// Crypto part 6, closing the file: six shots on one desk (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md, s9).
// Six numbered folders lie on a desk, one per report; each point of the summary opens one and shows its picture from
// that part, then the folders close into one box stamped CLOSED.
//   0 folder 1: the book leaves the bank and copies over the planet (part 1)
//   1 folders 2–3: the key opens the address box, a key falls through a crack; folder 4: the price mountain and a die
//   2 folder 5: the vending machine (a contract) and the glowing digital dollar (host right)
//   3 folder 6: the carnival and the gravestones fade into noise lines; a calm warning lamp lights
//   4 a lesson book ≠ a coin heap; a house keeps its wallet shut
//   5 the six folders slide into one box CRYPTO FILE; a CLOSED stamp; 6 ✓ (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s9.v.js";
import { book, rows, bank, house, stars, skyline } from "./bank.js";
import { laptop, globe } from "./props.js";
import { mailbox } from "./c3props.js";
import { P, mix, coin, key, priceLine, folder6, grave } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 3000, 1080, tot), c, 0.15);
const D = 840;                                   // the desk top
const FX = [300, 564, 828, 1092, 1356, 1620];    // the six folders
const desk = (c) => layer(`<path d="${rr(-600, D, 3100, 60, 10)}" fill="${P.wood}"/><path d="${rr(-600, D + 60, 3100, 600, 0)}" fill="${P.woodD}"/>`, c);
// the folders on the desk; `open` [k] 0..1 lifts folder k's flap, `lift` [k] raises it a little
const folders = (open = [], lift = [], dim = -1, upto = 6) => FX.slice(0, upto).map((x, i) => at(x, D - 100 - 30 * (lift[i] || 0), folder6(i + 1, open[i] || 0, i === dim ? { c: "#a8783a", cD: "#86602e", f: "#c49a5a" } : {}), 0.78)).join("");
const glowOver = (x, y, r, a) => (a > 0 ? `<path d="M${x - 110} ${D - 150}L${x - r} ${y - r * 0.4}H${x + r}L${x + 110} ${D - 150}Z" fill="#ffd98a" opacity="${(0.1 * a).toFixed(3)}"/>` : "");
const pill = (w, a, x, y, bg = P.gold, ink = P.ink, size = 60) => a > 0 ? at(x, y, `<path d="${rr(-(w.length * size * 0.42 + 50) / 2, -size * 0.85, w.length * size * 0.42 + 50, size * 1.3, 20)}" fill="${bg}"/>${text(0, size * 0.28, w, size, ink)}`, pop(a)) : "";
const numBadge = (n, a, x, y) => a > 0 ? at(x, y, `<circle r="40" fill="${P.gold}"/>${text(0, 20, String(n), 56, P.ink)}`, pop(a)) : "";

// ---- 0: folder 1: the book leaves the bank and copies over the planet ----
function s0(a, tot) {
  const c = camAt(a, [[0, 900, 620, 1.05], [1.2, 760, 560, 1.3], [2.2, 720, 470, 1.45], [4.86, 740, 470, 1.5]]);
  const op = ease(seg(a, 1.2, 1.7));
  const bk = a > 1.3 ? at(560, 520, bank({ night: 1, inside: "#3b1d74" }), 0.55 * pop(a - 1.3)) : "";
  const rise = ease(seg(a, 2.0, 2.6)), bx = lerp(560, 740, rise), by = lerp(410, 230, rise);
  const theBook = a > 1.5 ? at(bx, by, rings(0, 0, 120, P.gold, 0.18 * rise) + book(rows("70", "80")), 0.6) : "";
  const gl = a > 2.4 ? at(1040, 520, globe(190, tot * 0.02, { night: 0.3, id: "s9" }), pop(a - 2.4)) : "";
  let copies = "";
  for (let i = 0; i < 6; i++) { const t0 = 2.8 + i * 0.22, p = ease(seg(a, t0, t0 + 0.5)), th = -1.2 + i * 0.48, tx = 1040 + 200 * Math.sin(th), ty = 520 - 225 * Math.cos(th);
    if (p <= 0) continue; copies += at(lerp(760, tx, p), lerp(230, ty, p), p < 1 ? book(rows("70", "80")) : laptop("#fff3c2", ""), p < 1 ? lerp(0.6, 0.2, p) : 0.24, p >= 1 ? th * 57.3 : 0); }
  const g = night(c, tot, 71) + desk(c) + layer(glowOver(300, 520, 300, op) + folders([op], [op]) + numBadge(1, a - 1.5, 300, 640) + bk + gl + copies + theBook, c);
  return { g };
}

// ---- 1: folders 2 and 3: the key; folder 4: the price, a bet ----
const die = (k = 1, rot = 0) => at(0, 0, `${two(rr(-50, -50, 100, 100, 18), P.cream, P.creamD, 0, 8)}${[[-24, -24], [24, 24], [0, 0], [-24, 24], [24, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${P.ink}"/>`).join("")}`, k, rot);
function s1(a, tot) {
  const c = camAt(a, [[0, 600, 540, 1.45], [1.5, 640, 540, 1.45], [2.0, 760, 540, 1.45], [3.2, 780, 540, 1.45], [3.8, 1060, 500, 1.45], [5.9, 1080, 500, 1.5]]);
  const o2 = ease(seg(a, 0.3, 0.7)), o3 = ease(seg(a, 1.7, 2.1)), o4 = ease(seg(a, 3.4, 3.8));
  // folder 2: the key goes into the address box and opens it
  const kin = ease(seg(a, 0.6, 1.3)), mb = at(564, 560, mailbox({ open: seg(a, 1.3, 1.6), colour: P.blue }), 0.8 * pop(a - 0.5)) + (a > 0.6 && a < 1.6 ? at(lerp(330, 500, kin), 330, key({ digits: 5 }), 0.55) : "");
  // folder 3: a key falls through a crack
  const fall = easeIn(seg(a, 2.2, 2.9)), crk = a > 1.9 ? `<path d="M760 ${D - 210}l40 -30l30 40l40 -40l40 30" fill="none" stroke="${P.ink}" stroke-width="10" stroke-linejoin="round"/>` : "";
  const k3 = a > 1.8 ? at(828, lerp(440, 640, fall), key({ digits: 5 }), 0.5 * (1 - fall * 0.8), 90 * fall) : "";
  // folder 4: the price mountain with a die on top
  const pl = a > 3.5 ? priceLine(seg(a, 3.5, 4.6), { w: 420, h: 340 }) : null;
  const mtn = pl ? at(890, 600, pl.g) : "";
  const dieG = a > 4.7 ? at(890 + (pl ? pl.tip.x : 0), 600 + (pl ? pl.tip.y : 0) - 60 - 120 * (1 - easeOut(seg(a, 4.7, 5.1))), die(0.8, 360 * easeOut(seg(a, 4.7, 5.2)))) : "";
  const g = night(c, tot, 73) + desk(c) + layer(glowOver(564, 520, 200, o2) + glowOver(828, 520, 200, o3) + glowOver(1092, 520, 220, o4) + folders([1, o2, o3, o4], [0, o2, o3, o4], 0) + numBadge(2, a - 0.4, 564, 640) + numBadge(3, a - 1.8, 828, 640) + numBadge(4, a - 3.5, 1092, 640) + mb + crk + k3 + mtn + dieG, c);
  return { g, out: toScreen(c, 1356, D - 100), outC: "#e8a23c", outZ: 16 };
}

// ---- 2: folder 5: the vending machine and the digital dollar (host right) ----
const vend = (light = 0, drop = 0) => `${two(rr(-150, -520, 300, 520, 22), P.red, P.redD, 0, 10)}<path d="${rr(-120, -490, 160, 300, 10)}" fill="#1b1550"/>${[0, 1, 2].map((r) => [0, 1].map((k) => `<circle cx="${-80 + k * 80}" cy="${-430 + r * 90}" r="26" fill="${[P.gold, P.teal, P.pink][r]}"/>`).join("")).join("")}
  <path d="${rr(60, -470, 60, 120, 10)}" fill="${P.steelD}"/><path d="${rr(78, -440, 24, 40, 6)}" fill="${P.ink}"/><circle cx="90" cy="-320" r="18" fill="${mix("#3a2a7a", P.green, light)}"/><path d="${rr(-120, -150, 240, 90, 10)}" fill="${P.ink}"/>${drop > 0 ? at(0, -150 + 60 * easeOut(drop), coin(40, "B")) : ""}`;
const dollar = (glow = 0) => `${rings(0, 0, 130, P.green, 0.15 + 0.2 * glow)}${disc(0, 0, 100, "#6fe3a1", "#3fbf7a")}<circle r="78" fill="none" stroke="#2b9a5e" stroke-width="8"/>${text(0, 36, "$", 104, "#1f7a4a")}`;
function s2(a, tot) {
  const c = camAt(a, [[0, 1140, 520, 1.4], [4.45, 1110, 500, 1.48]]);
  const o5 = ease(seg(a, 0.2, 0.6));
  const vm = at(1010, 700, vend(seg(a, 0.8, 1.0), seg(a, 1.0, 1.6)), 0.85 * pop(a - 0.4));
  const coinIn = a > 0.5 && a < 0.95 ? at(lerp(840, 1086, seg(a, 0.5, 0.9)), 315, coin(28, "B")) : "";
  const dl = a > 2.0 ? at(1340, 330, dollar(seg(a, 2.6, 3.4) * (0.8 + 0.2 * Math.sin(tot * 4))), pop(a - 2.0)) : "";
  const g = night(c, tot, 75) + desk(c) + layer(glowOver(1356, 520, 260, o5) + folders([1, 1, 1, 1, o5], [0, 0, 0, 0, o5], -1, 5) + numBadge(5, a - 0.3, 1356, 640) + vm + coinIn + dl, c);
  return { g, in: [1356, D - 100], inC: "#e8a23c", inZ: 16 };
}

// ---- 3: folder 6: the carnival and the graves fade into noise; a calm warning lamp ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1500, 520, 1.42], [2.2, 1460, 520, 1.42], [3.3, 1380, 500, 1.45]]);
  const o6 = ease(seg(a, 0.1, 0.4)), noise = ease(seg(a, 0.7, 1.9));
  const tent = `<path d="M-160 0L0 -240L160 0Z" fill="${P.pink}"/><path d="M-80 0L0 -240L80 0Z" fill="${P.cream}"/><path d="M0 -240v-40" stroke="${P.ink}" stroke-width="6"/><path d="M0 -280l40 14l-40 14Z" fill="${P.gold}"/>`;
  const scene = `<g opacity="${(1 - noise).toFixed(2)}">${at(1440, 560, tent, 0.9)}${at(1690, 560, grave(0.7, 2))}${at(1790, 560, grave(0.6, 5))}${[0, 1, 2].map((i) => `<circle cx="${1400 + i * 60}" cy="${300 + 20 * Math.sin(tot * 3 + i)}" r="10" fill="${[P.gold, P.teal, P.pink][i]}"/>`).join("")}</g>`;
  const lines = noise > 0 ? Array.from({ length: 6 }, (_, i) => `<path d="M1330 ${330 + i * 40}q40 -20 80 0t80 0t80 0t80 0t80 0" fill="none" stroke="${P.steel}" stroke-width="7" stroke-linecap="round" opacity="${(0.7 * noise).toFixed(2)}" transform="translate(${(10 * Math.sin(tot * 5 + i)).toFixed(1)} 0)"/>`).join("") : "";
  const lamp = a > 2.4 ? at(1140, 360, `${rings(0, 0, 90, "#ffb066", 0.22 * seg(a, 2.4, 2.8))}${two("M-50 30Q-60 -60 0 -70Q60 -60 50 30Z", mix("#6a5a8a", "#ffb066", seg(a, 2.4, 2.8)), mix("#4a3d6e", "#e8903a", seg(a, 2.4, 2.8)), 0, 6)}${two(rr(-60, 30, 120, 30, 8), P.steel, P.steelD, 0, 6)}`, pop(a - 2.4)) : "";
  const g = night(c, tot, 77) + desk(c) + layer(glowOver(1620, 520, 280, o6) + folders([1, 1, 1, 1, 1, o6], [0, 0, 0, 0, 0, o6]) + numBadge(6, a - 0.2, 1620, 640) + scene + lines + lamp, c);
  return { g, out: toScreen(c, 1140, 360), outC: "#ffb066", outZ: 16 };
}

// ---- 4: an explanation is not advice: a lesson book ≠ a coin heap; a house keeps its wallet shut ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 480, 1.3], [1.7, 960, 480, 1.32], [3.33, 1000, 560, 1.25]]);
  const lesson = at(560, 400, book(`<path d="M-120 -60h90M-120 -30h80M-120 0h90M30 -60h90M30 -30h70M30 0h90" stroke="#bda97c" stroke-width="10" stroke-linecap="round"/>`), 1.25 * pop(a - 0.1));
  let heap = ""; for (let i = 0; i < 14; i++) heap += `<ellipse cx="${1300 + (i % 5) * 46 - (Math.floor(i / 5) * 23)}" cy="${470 - Math.floor(i / 5) * 26}" rx="34" ry="13" fill="${i % 2 ? P.goldD : P.gold}"/>`;
  const hp = a > 0.3 ? `<g opacity="${seg(a, 0.3, 0.6).toFixed(2)}" transform="translate(1390 450) scale(1.4) translate(-1390 -450)">${heap}${at(1370, 340, coin(46, "B"))}</g>` : "";
  const ne = a > 0.7 ? at(960, 400, `<path d="M-90 -30h180M-90 30h180" stroke="${P.red}" stroke-width="26" stroke-linecap="round"/>${drawn("M60 -90L-60 90", seg(a, 0.9, 1.3), P.red, 26)}`, pop(a - 0.7)) : "";
  const shut = ease(seg(a, 2.0, 2.6));
  const wallet = a > 1.9 ? at(1110, 820, `${two(rr(-90, -60, 180, 120, 18), P.woodD, "#6a3e1f", 0, 8)}<g transform="translate(0 -60) scale(1 ${(1 - 0.8 * (1 - shut)).toFixed(3)}) translate(0 60)">${two(rr(-90, -60, 180, 60, 18), P.wood, P.woodD, 0, 6)}</g>${shut > 0.95 ? `<circle cx="0" cy="-4" r="12" fill="${P.gold}"/>` : ""}`, pop(a - 1.9) * 1.3) : "";
  const hs = at(860, 900, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.0);
  const g = night(c, tot, 79) + layer(skyline(81, -800, 3000, 880, 60, 180, "#1f1652", "#ffb066"), c, 0.45) + layer(`<rect x="-1200" y="900" width="4400" height="800" fill="${P.ground}"/>`, c) + layer(lesson + hp + ne + hs + wallet, c);
  return { g, in: [1140, 360], inC: "#ffb066", inZ: 16 };
}

// ---- 5: the file is closed: the folders go into one box; CLOSED; 6 ✓ (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1080, 560, 0.95], [1.0, 1170, 600, 1.15], [3.4, 1180, 600, 1.22]]);
  const BX = 1180, gather = ease(seg(a, 0.0, 0.9));
  let fs = ""; FX.forEach((x, i) => { const p = clamp(gather * 1.2 - i * 0.04); fs += at(lerp(x + 260, BX, ease(p)), lerp(D - 100, D - 200 - i * 8, ease(p)), folder6(i + 1, 0), lerp(0.78, 1.0, p)); });
  const lid = ease(seg(a, 0.75, 1.05)), K = 1.45;
  const box = at(BX, D, `${two(rr(-260, -330, 520, 330, 16), "#7a5a3a", "#5e4430", 0, 12)}${text(0, -238, "CRYPTO FILE", 64, P.cream)}${text(0, -180, "1 – 6", 44, "#e6c38a")}`, K);
  const lidG = at(BX, D, `<g transform="translate(0 ${(-260 * (1 - lid)).toFixed(1)})">${two(rr(-280, -360, 560, 50, 14), "#8a6a48", "#6a4e34", 0, 8)}</g>`, K);
  const stamp = a > 1.0 ? at(BX, D - 105, `<g transform="rotate(-8)"><path d="${rr(-210, -62, 420, 124, 14)}" fill="none" stroke="${P.red}" stroke-width="13"/>${text(0, 30, "CLOSED", 90, P.red)}</g>`, 1 + 0.6 * Math.exp(-(a - 1.0) * 10) * (a < 1.25 ? 1 : 0)) : "";
  const ticks = a > 2.3 ? Array.from({ length: 6 }, (_, i) => check(BX - 300 + i * 120, D - 600, 40, P.green, a - 2.3 - i * 0.08)).join("") : "";
  const dim = seg(a, 2.9, 3.4);
  const g = night(c, tot, 83) + desk(c) + layer((gather < 1 ? fs : "") + box + (gather >= 0.85 ? "" : "") + lidG + stamp + ticks, c) + (dim > 0 ? `<rect width="${FW}" height="${FH}" fill="#0d0b33" opacity="${(0.25 * dim).toFixed(2)}"/>` : "");
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c6s9Set = makeSet(SHOTS, V, P);
