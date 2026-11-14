// "Copy" in portrait (1080 x 1920), for the Shorts. Shots 0, 3 and 4 are the landscape shots reframed; 1, 2 and 5 are
// drawn again for the tall frame:
//   1 the picture, the song and the film one above the other, each copying itself into four; the $0 tag below them
//   2 the blue house up top sends the same $100 down to the pink and the teal house at once; the clock between them
//   5 the "D" company tower in the middle of the frame, 1989 / 1998 above it; at the end the camera drops to the wallet
//     on its step, which opens on a moth
import { clamp, lerp, ease, easeIn, seg, spring, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH } from "./kit.js";
import { P, mix, house, stars, skyline } from "./bank.js";
import { calPage, calFlip, padlock } from "./props.js";
import { pop, room, fileCard, picture, song, film, money100 } from "./copy.js";

// ---- 1 ----
function s1V(a, tot) {
  const c = camAt(a, [[0, 540, 960, 1.08], [1.7, 540, 960, 1.0], [3.65, 540, 960, 0.97]]), Y = [400, 930, 1460], src = [picture, song, film], t0 = [0, 0.57, 1.19];
  const n1 = a < 1.76 ? 0 : spring(a - 1.76, 8, 13), n2 = a < 2.23 ? 0 : spring(a - 2.23, 8, 13);
  let cards = "";
  Y.forEach((y, i) => { const k = 1.5 * pop(a - t0[i] + (i === 0 ? 0.3 : 0)); if (k <= 0) return;
    // copies: one beside it on "copy", two more beside those on "paste": a row of four
    const first = [-125 * n1, 125 * n1], fin = [-375, -125, 125, 375], from = [first[0], first[1], first[0], first[1]];
    const spots = [0, 1, 2, 3].map((j) => [540 + lerp(from[j], fin[j], n2), y]);
    [3, 2, 1, 0].forEach((j) => { if ((j === 1 && n1 <= 0) || (j >= 2 && n2 <= 0)) return; const s = j === 0 ? k : 1.5 * (j === 1 ? n1 : n2), kk = lerp(1.5, 0.95, Math.max(n1 * 0.6, n2));
      cards += at(spots[j][0], spots[j][1] + 5 * Math.sin(tot * 2 + i + j), fileCard(src[i]), j === 0 ? k * kk / 1.5 : Math.min(s, kk)); }); });
  const tg = a - 2.8, price = tg > 0 ? at(560, 1790, `${two("M-180 -80h270l90 80l-90 80h-270Z", P.gold, P.goldD, 0, 10)}<circle cx="130" cy="0" r="18" fill="${P.ink}"/>${text(-40, 46, "$0", 130, "#8a5200")}`, pop(tg, 8, 13), -6 + 6 * spring(tg, 8, 13)) : "";
  const g = room(c, tot) + layer(stars(61, 60, -300, 1400, 2000, tot), c, 0.15) + layer(cards + price, c);
  return { g, in: toScreen(c, 540, 400), inC: P.cream, inZ: 16, out: toScreen(c, 560, 1790), outC: P.gold, outZ: 18 };
}
// ---- 2 ----
function s2V(a, tot) {
  const c = camAt(a, [[0, 540, 980, 1.02], [4.64, 540, 990, 0.98]]), GA = 820, GB = 1700, B = [540, GA], K = [270, GB], T = [810, GB], HK = 1.25;
  const top = (h) => [h[0], h[1] - 292 * HK - 130], launch = 2.64, arrive = 3.55;
  const ctl = (to) => [(B[0] + to[0]) / 2 + (to[0] < 540 ? -260 : 260), (top(B)[1] + top(to)[1]) / 2];
  const fly = (to, j) => { const p = ease(seg(a, launch + j * 0.02, arrive)), b = bez(top(B), ctl(to), top(to), p); return { b, p }; };
  let cards = "", trail = "";
  const glow = a > 2.07 ? 1 : 0, own = at(top(B)[0], top(B)[1] + 6 * Math.sin(tot * 2), fileCard(money100(), { glow }), 1.3 * pop(a + 0.3));
  if (a > 2.35) [K, T].forEach((h, j) => { const { b, p } = fly(h, j);
    for (let q = 1; q <= 6; q++) { const pp = Math.max(0, p - q * 0.035); if (pp <= 0 || p >= 1) continue; const bb = bez(top(B), ctl(h), top(h), pp); trail += `<circle cx="${bb[0].toFixed(1)}" cy="${bb[1].toFixed(1)}" r="${(10 - q).toFixed(1)}" fill="${P.gold}" opacity="${(0.7 - q * 0.1).toFixed(2)}"/>`; }
    const split = a < launch ? spring(a - 2.35, 8, 13) : 1;
    cards += at(b[0] + (a < launch ? (j ? 40 : -40) * split : 0), b[1] + (a < launch ? -20 * split : 0), fileCard(money100(), { glow: 1 }), 1.3 * (p < 1 ? 1 : 1 + 0.15 * Math.exp(-(a - arrive) * 8) * Math.cos((a - arrive) * 14))); });
  const lit = (t0) => (a > t0 ? [1, 1, 1] : [0, 0, 1]), hop = (t0) => (a > t0 ? 1 + 0.06 * Math.exp(-(a - t0) * 7) * Math.cos((a - t0) * 14) : 1);
  const glowH = (x) => (a > arrive ? rings(x, GB - 200, 240 * spring(a - arrive, 7, 11), P.win, 0.14, 1.3) : "");
  const clk = a > 3.7 ? at(540, 1150, `<circle r="70" fill="${P.cream}"/><circle r="70" fill="none" stroke="${P.creamD}" stroke-width="10"/><path d="M0 0L0 -50" stroke="${P.ink}" stroke-width="10" stroke-linecap="round" transform="rotate(${(60 * spring(a - 3.7, 10, 18)).toFixed(1)})"/><circle r="9" fill="${P.ink}"/>`, pop(a - 3.7)) : "";
  const main = `<rect x="-600" y="${GA}" width="2300" height="60" fill="${P.ground}"/><rect x="-600" y="${GA}" width="2300" height="10" fill="#3a2a7a"/><rect x="-600" y="${GB}" width="2300" height="500" fill="${P.ground}"/>`
    + glowH(K[0]) + glowH(T[0]) + at(B[0], GA, house(P.blue, P.blueD, { lit: [1, 1, 1] }), HK) + at(K[0], GB, house(P.pink, P.pinkD, { lit: lit(arrive) }), [HK, HK * hop(arrive)]) + at(T[0], GB, house(P.teal, P.tealD, { lit: lit(arrive) }), [HK, HK * hop(arrive)]) + trail + own + cards + clk;
  const g = room(c, tot) + layer(stars(63, 60, -300, 1400, 1200, tot) + skyline(71, -500, 1600, GB - 40, 140, 420, "#221a5c", "#ffb066"), c, 0.5) + layer(main, c);
  return { g, in: toScreen(c, top(B)[0], top(B)[1]), inC: P.gold, inZ: 16, out: toScreen(c, top(K)[0], top(K)[1]), outC: P.cream, outZ: 16 };
}
// ---- 5 ----
function s5V(a, tot) {
  const G = 1520, TX = 540, TK = 1.15, WX = 830;
  const c = camAt(a, [[0, 540, 1000, 1.0], [5.0, 540, 1010, 1.0], [5.7, WX, G - 90, 2.3], [7.28, WX + 10, G - 80, 2.45]]);
  const on = (i) => (a > 2.24 + i * 0.06 && a < 3.74 + i * 0.03 ? 1 : 0), dim = seg(a, 3.74, 4.0), fall = easeIn(seg(a, 4.31, 4.85)), signA = 1 - dim;
  let win = ""; for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) { const i = r * 3 + q; win += `<rect x="${-120 + q * 90}" y="${-560 + r * 90}" width="60" height="60" rx="8" fill="${on(i) ? P.win : P.ink}"/>`; }
  const sign = at(fall > 0 ? -210 * fall : 0, -700 + 640 * fall * fall, `${rings(0, 0, 130, P.gold, 0.25 * signA * (a > 2.24 ? 1 : 0.3))}${disc(0, 0, 90, mix(P.gold, "#8a86a8", dim), mix(P.goldD, "#6b6790", dim))}${text(0, 34, "D", 100, mix("#8a5200", "#4a4670", dim))}`, 1, -90 * fall);
  const lock = a > 3.95 ? at(0, -120, padlock(1.0), pop(a - 3.95)) : "";
  const tower = at(TX, G, `${two(rr(-170, -620, 340, 620, 10), P.violet, P.violetD, 16, 0)}${two(rr(-190, -650, 380, 40, 8), P.violetD, P.ink, 0, 8)}<rect x="-6" y="-700" width="12" height="60" fill="${P.ink}"/>${win}<path d="M-60 0V-180H60V0Z" fill="${P.ink}"/>${a > 3.9 ? `<path d="M-60 0V-180H60V0Z" fill="#5d678f"/>` : ""}${lock}`, TK) + (fall < 1 ? at(TX, G, sign, TK) : at(TX - 210 * TK, G - 60 * TK, `${disc(0, 0, 90, "#8a86a8", "#6b6790")}${text(0, 34, "D", 100, "#4a4670")}`, TK, -90));
  const cal = a > 0.75 ? at(540, 330, (a < 4.03 ? calPage("1989", "", 1, 150) : calPage("1998", "", 1, 150)) + (a > 4.03 && a < 4.4 ? calFlip("1989", "", seg(a, 4.03, 4.35), 150) : ""), 1.1 * pop(a - 0.75)) : "";
  const o2 = a < 5.6 ? 0 : spring(a - 5.6, 8, 13), mu = a - 6.25, lining = "#6a3f20";
  const half = (inner) => `${two(rr(0, -60, 110, 120, 14), P.wood, P.woodD, 0, 6)}<path d="${rr(6, -52, 98, 104, 10)}" fill="${lining}"/>${inner}`;
  const moth = mu > 0 ? at(20 + 50 * Math.sin(mu * 3.1), -70 - 80 * mu + 10 * Math.sin(mu * 9), `<ellipse rx="5" ry="10" fill="#8a7a66"/><path d="M0 -3L-20 ${-14 + 10 * Math.sin(a * 40)}L-16 9ZM0 -3L20 ${-14 + 10 * Math.sin(a * 40)}L16 9Z" fill="#e3d2b2"/>`, clamp(mu / 0.2)) : "";
  const web = `<g opacity=".85">${[[70, 14], [60, 50], [30, 66]].map((e, i) => drawn(`M14 -40L${14 + e[0]} ${-40 + e[1]}`, (a - 5.7 - i * 0.08) * 3, "#cfc6ff", 2.5)).join("")}</g>`;
  const wallet = at(WX, G - 6, `<ellipse cx="0" cy="62" rx="${(120 + 60 * o2).toFixed(1)}" ry="8" fill="#1d0f45" opacity=".6"/><g transform="scale(-1 1)">${half("")}</g>${o2 > 0 ? `<g transform="scale(${Math.max(0.02, o2).toFixed(4)} 1)">${half(`<path d="${rr(12, -40, 86, 80, 8)}" fill="${P.night0}"/>${web}`)}</g>` : `<g transform="scale(-1 1)">${two(rr(0, -60, 110, 120, 14), "#b87644", P.wood, 0, 6)}${disc(94, 0, 9, P.gold, P.goldD)}</g>`}${moth}`);
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(59, 90, -300, 1400, 1300, tot), c, 0.15) + layer(skyline(83, -500, 1600, G - 20, 140, 520, "#221a5c", "#ffb066"), c, 0.5)
    + layer(`<rect x="-500" y="${G}" width="2100" height="600" fill="#141a45"/><rect x="-500" y="${G}" width="2100" height="10" fill="#2c366f"/>` + tower + cal + wallet, c);
  return { g, in: toScreen(c, TX, G - 700 * TK), inC: P.gold, inZ: 18 };
}
export const V = [{ z: 0.8 }, s1V, s2V, { z: 0.95 }, { z: 0.85 }, s5V];
