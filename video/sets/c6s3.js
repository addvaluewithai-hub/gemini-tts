// Crypto part 6, the game: six wordless shots (shots.md, scene s3).
//   0 two signs, RUG PULL and PUMP & DUMP; houses stand on a red rug around a coin heap; the owner sacks the coins and yanks the rug
//   1 the pump: early houses pump a coin up like a balloon, with noise; a late house walks in
//   2 the early houses run off with sacks; the balloon pops (host right)
//   3 the late house alone with the burst balloon; pull back over a field of coins: 20,000,000 made by the end of 2025
//   4 gravestones rise under more than half of them, 11,600,000; a yoghurt pot outlasts a coin
//   5 a lantern searches the graves for the next one (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s3.v.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { calPage } from "./props.js";
import { rug, pump, balloon, grave, yoghurt } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 3600, 1080, tot), c, 0.15);
const G = 900;
const town = (c, seed = 51) => layer(skyline(seed, -900, 3600, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 3600, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="4600" height="900" fill="${P.ground}"/>`, c);
const label = (x, y, t, a, size = 64, fill = P.gold) => (a > 0 ? at(x, y, `${two(rr(-t.length * size * 0.29 - 26, -size * 0.62, t.length * size * 0.58 + 52, size * 1.1, 14), P.ink, "#0d0b33", 0, 6)}${text(0, size * 0.32, t, size, fill)}`, pop(a)) : "");
const cal = (x, y, big, small, a, k = 0.62, size = 130) => (a > 0 ? at(x, y, calPage(big, small, 1, size), k * pop(a), 6) : "");
const fmtN = (v) => Math.round(v).toLocaleString("en");
const sack = (k = 1) => at(0, 0, `${two("M-60 0Q-80 -70 -40 -110H40Q80 -70 60 0Z", "#c9a46a", "#a8834a", 0, 8)}<path d="M-34 -110q34 -20 68 0" stroke="#7a5a2a" stroke-width="8" fill="none"/>${text(0, -40, "$", 48, "#7a5a2a")}`, k);
const sign = (t, c, a, dim = 0) => (a > 0 ? `<rect x="-8" y="-60" width="16" height="200" fill="${P.woodD}"/>${two(rr(-t.length * 20 - 30, -150, t.length * 40 + 60, 100, 14), mix(c, "#3a3570", dim), mix(c, "#2c2458", dim), 0, 8)}${text(0, -82, t, 52, mix("#fff", "#8a85a8", dim))}` : "");
const HC = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD], [P.gold, P.goldD]];

// ---- 0: the rug pull ----
function s0(a, tot) {
  const c = camAt(a, [[0, 900, 640, 1.3], [0.9, 880, 700, 1.5], [3.95, 880, 710, 1.55]]);
  const signs = at(470, 560, sign("RUG PULL", P.red, a - 0.4), 0.85 * pop(a - 0.4)) + at(1290, 560, sign("PUMP & DUMP", P.violet, a - 0.55, 1), 0.75 * pop(a - 0.55));
  const pull = seg(a, 2.6, 3.3), R = at(880, G - 10, rug(820, pull));
  let hs = ""; [[560, 0], [700, 1], [1060, 2], [1200, 3]].forEach(([x, k], i) => { const fall = pull > 0.3 ? ease(seg(a, 2.75 + i * 0.05, 3.3 + i * 0.05)) : 0, spin = fall * (i % 2 ? 70 : -70), dy = 60 * Math.sin(Math.PI * fall);
    hs += at(x + (i < 2 ? -40 : 40) * fall, G - 20 - dy + 40 * fall, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }), 0.6, spin); });
  // the coin heap in the middle: the owner (a dark masked house) sacks it and slips away
  const take = seg(a, 1.85, 2.6), gone = seg(a, 3.0, 3.6);
  let heap = ""; for (let i = 0; i < 10; i++) { if (i / 10 < take) continue; heap += at(880 - 60 + (i % 4) * 40 + (Math.floor(i / 4) % 2) * 20, G - 40 - Math.floor(i / 4) * 34, coin(24, "B")); }
  const owner = a > 1.5 ? at(lerp(1000, 1500, ease(gone)), G - 20, `<g opacity="${(1 - gone).toFixed(2)}">${house("#2a2350", "#1d1840", { lit: [0, 0, 1] })}<path d="M-110 -150q55 -30 110 0q55 -30 110 0v34h-220Z" fill="${P.ink}"/><ellipse cx="-50" cy="-130" rx="22" ry="12" fill="${P.win}"/><ellipse cx="50" cy="-130" rx="22" ry="12" fill="${P.win}"/>${at(150, 0, sack(0.4 + 0.6 * take))}</g>`, 0.62 * pop(a - 1.5)) : "";
  const g = night(c, tot, 41) + town(c, 61) + layer(signs + R + heap + hs + owner, c);
  return { g, out: toScreen(c, 1290, 450), outC: P.violet, outZ: 16 };
}

// ---- 1-2: the pump and the dump ----
const BX = 820;
function pumpScene(t, c, tot, s) {
  const E = s.ends || [], T2 = E[1] || 3.66, u = t - T2;   // u: time since shot 2 began
  const blow = ease(seg(t, 0.4, 2.3)), popP = u > 0.75 ? seg(u, 0.75, 1.2) : 0;
  const pumps = [0, 1].map((i) => at(BX - 260 + i * 520, G, pump(Math.abs(Math.sin(t * 5 + i))) , 0.8)).join("");
  // the early houses: they pump, then run left with sacks
  const run = u > 0.1 ? ease(seg(u, 0.1, 1.0)) : 0;
  let early = ""; [[-420, 0], [-120, 2], [380, 4]].forEach(([dx, k], i) => { const x = BX + dx - 900 * run, hop = run > 0 ? Math.abs(Math.sin(u * 14 + i)) * 20 : 0;
    early += at(x, G - 10 - hop, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }) + (run > 0 ? at(140, 0, sack(0.55)) : ""), 0.75); });
  // the noise: rings off the balloon while it is pumped
  const noise = t > 1.1 && u < 0.6 ? [0, 1, 2].map((i) => { const q = ((t * 1.2 + i / 3) % 1); return `<circle cx="${BX}" cy="${G - 520}" r="${(160 + 220 * q).toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="6" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const bal = at(BX, G - 120, balloon(0.2 + 0.9 * blow, popP));
  // the late house walks in from the right at "you get in"
  const walk = ease(seg(t, 2.7, 3.6)), lx = lerp(1600, 1160, walk);
  const late = t > 2.6 ? at(lx, G - 10 - (walk < 1 ? Math.abs(Math.sin(t * 12)) * 14 : 0), house(P.red, P.redD, { lit: [1, 1, 1] }), 0.8) : "";
  return { g: night(c, tot, 43) + town(c, 71) + layer(noise + pumps + early + bal + late, c), lx };
}
function s1(a, tot, s) { const c = camAt(a, [[0, 820, 600, 1.35], [3.66, 900, 610, 1.35]]); return { g: pumpScene(a, c, tot, s).g, in: toScreen(c, BX, 380), inC: P.violet, inZ: 16 }; }
function s2(a, tot, s) { const T2 = (s.ends || [])[1] || 3.66, c = camAt(a, [[0, 900, 610, 1.35], [2.93, 940, 640, 1.4]]); const r = pumpScene(T2 + a, c, tot, s);
  return { g: r.g, out: toScreen(c, r.lx, G - 100), outC: P.redD, outZ: 16 }; }

// ---- 3: the late house alone; pull back over the field: 20,000,000 coins by the end of 2025 ----
const FIELD = Array.from({ length: 96 }, (_, i) => [(i % 16) * 150 - 160 + (Math.floor(i / 16) % 2) * 75, G + 140 + Math.floor(i / 16) * 110, rnd(i * 7 + 3)]);
function field(a, tot, dead = 0, k0 = 0.8) { let g = ""; FIELD.forEach(([x, y, r], i) => { const d = r < 0.58 && dead > r / 0.58 * 0.9;
    g += at(x, y, d ? grave(0.55, i) : coin(26, "B"), (d ? 1 : 0.8) * pop(a - k0 - r * 1.6)); }); return g; }
function s3(a, tot) {
  const c = camAt(a, [[0, 1180, 700, 1.5], [0.8, 1180, 700, 1.5], [2.6, 1000, 900, 0.62], [5.32, 1000, 900, 0.6]]);
  const lone = at(1180, G - 10, house(P.red, P.redD, { lit: [1, 0, 1] }) + at(150, -110, balloon(0.3, 0.6)), 0.6);
  const v = 20e6 * easeOut(seg(a, 0.9, 3.8)), cnt = a > 0.8 ? at(FW / 2, 120, `${two(rr(-300, -70, 600, 130, 22), P.ink, "#0d0b33", 0, 8)}${text(0, 34, fmtN(v), 76, P.gold)}`, pop(a - 0.8)) : "";
  const yr = a > 2.4 ? at(FW - 360, FW > FH ? 190 : 300, calPage("2025", "END", 1, 120), 0.55 * pop(a - 2.4), 6) : "";
  const g = night(c, tot, 47) + town(c, 81) + layer(lone + field(a, tot, 0, 1.0), c) + cnt + yr;
  return { g };
}

// ---- 4: graves under more than half: 11,600,000; a yoghurt pot outlasts a coin ----
function s4(a, tot) {
  const c = camAt(a, [[0, 1000, 900, 0.6], [1.0, 1000, 900, 0.62], [1.6, 1500, 1110, 1.6], [3.8, 1520, 1110, 1.62]]);
  const dead = ease(seg(a, 0.0, 0.8));
  const cnt = a > 0.3 ? at(FW / 2, 120, `${two(rr(-330, -70, 660, 130, 22), P.ink, "#0d0b33", 0, 8)}${text(0, 34, "11,600,000", 76, "#c9c4e0")}${at(-260, -6, grave(0.35, 3))}`, pop(a - 0.3)) : "";
  // a yoghurt pot beside a grave: two little bars of "how long it lasts"; the yoghurt's is longer
  const yx = 1380, yy = G + 300, bars = a > 1.8 ? `<path d="${rr(yx - 120, yy + 40, 240 * ease(seg(a, 1.9, 2.6)), 26, 10)}" fill="${P.green}"/><path d="${rr(yx + 200, yy + 40, 140 * ease(seg(a, 2.2, 2.9)), 26, 10)}" fill="${P.red}"/>` : "";
  const yog = a > 1.3 ? at(yx, yy, yoghurt(), 1.2 * pop(a - 1.3)) + at(yx + 270, yy, grave(1.1, 9), pop(a - 1.5)) + bars + (a > 3.0 ? check(yx, yy - 230, 34, P.green, a - 3.0) : "") : "";
  const g = night(c, tot, 47) + town(c, 81) + layer(field(a + 9, tot, dead, 0) + yog, c) + (a < 1.7 ? `<g opacity="${(1 - seg(a, 1.3, 1.7)).toFixed(2)}">${cnt}</g>` : "");
  return { g, out: toScreen(c, yx, yy - 80), outC: "#f4f0e6", outZ: 14 };
}

// ---- 5: a lantern searches the graves for the next one (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1200, 1060, 1.4], [1.5, 1230, 1060, 1.42]]);
  const sw = Math.sin(a * 2.4), lx = 1200 + 260 * sw, ly = G + 60;
  const beam = `<path d="M${lx} ${ly}L${lx - 260 + sw * 120} ${G + 420}L${lx + 260 + sw * 120} ${G + 420}Z" fill="#ffd98a" opacity=".16"/>`;
  const lamp = at(lx, ly, `<path d="M0 -60v-60" stroke="${P.steelD}" stroke-width="6"/>${two(rr(-34, -60, 68, 90, 12), P.gold, P.goldD, 0, 6)}${rings(0, -14, 40, P.gold, 0.3)}`, pop(a - 0.1));
  const q = a > 0.4 ? at(1560, G + 40 + 8 * Math.sin(tot * 3), text(0, 0, "?", 150, P.cream), pop(a - 0.4)) : "";
  const g = night(c, tot, 47) + town(c, 81) + layer(field(9, tot, 1, 0) + beam + lamp + q, c);
  return { g, in: [960, 540], inC: "#f4f0e6", inZ: 14 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c6s3Set = makeSet(SHOTS, V, P);
