// The recap: one shot that travels over three stops the viewer has already seen, each with its number.
//   1 coins hop, turn into digits and fly into the book (money is an agreement, kept in a book)
//   2 the book in the bank's arch, the sign lit (the book was the bank's)
//   3 the book rises out of the bank, flies to the globe and copies go out to every side of it (bitcoin gave it to everyone)
// The host leans in from the right, so every stop sits left of the lower right corner.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, digitX, number, drawn, at, play, frame } from "./kit.js";
import { P, mix, house, bank, book, rows, LINES, coin, stars } from "./bank.js";
import { globe } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const S1 = [900, 400], BK = 2.2, BX = 2900, G = 900, BKK = 1.0, GL = [4450, 560], GR = 250;
const marker = (n, t0, a) => { const on = a > t0 ? spring(a - t0, 8, 13) : 0; return `${on > 0 ? rings(0, 0, 90 * on, P.gold, 0.25) : ""}${disc(0, 0, 62, mix("#5b3aa6", P.gold, clamp(on)), mix("#472080", P.goldD, clamp(on)))}${text(0, 30, String(n), 84, mix("#8a74c9", "#8a5200", clamp(on)))}`; };

function s0(a, tot) {
  const c = camAt(a, [[0, 940, 570, 0.92], [1.5, 940, 565, 0.97], [4.0, 950, 560, 1.0], [4.65, 3010, 552, 0.91], [6.4, 3010, 552, 0.93], [7.2, 3550, 500, 0.8], [7.95, 4583, 550, 0.75], [9.29, 4583, 560, 0.78]]);
  // stop 1: money becomes digits in the book
  const D = ["1", "0", "0", "5", "0"], slots = [[-62, 3, 0], [-62, 3, 1], [-62, 3, 2], [62, 2, 0], [62, 2, 1]].map(([cx, n, j]) => [S1[0] + BK * digitX(cx, n, j, 52), S1[1] + BK * -20]);
  let money = "";
  D.forEach((d, i) => { const x0 = 560 + i * 170, y0 = G - 30, t0 = 2.0 + i * 0.13, land = 3.15 + i * 0.1, u = a - t0, s = slots[i], size = 52 * BK;
    const glow = (r) => rings(0, 0, r, P.gold, 0.3, 1.5), dig = (sz, fill) => text(0, sz * 0.36, d, sz, fill);
    if (u < 0) { money += at(x0, y0 + 3 * Math.sin(tot * 2.2 + i), coin(46)); return; }
    if (u < 0.3) { const sx = Math.cos(Math.PI * u / 0.3); money += at(x0, y0 - 100 * easeOut(u / 0.3), sx > 0 ? coin(46) : glow(46) + dig(70, "#fff3c2"), [Math.max(0.05, Math.abs(sx)), 1]); return; }
    if (a < land) { const p = Math.pow(seg(a, t0 + 0.3, land), 1.4), b = bez([x0, y0 - 100], [(x0 + s[0]) / 2 + 120, 120], [s[0], s[1] - size * 0.36], p); money += at(b[0], b[1], glow(46) + dig(lerp(70, size, p), "#fff3c2")); return; }
    const v = a - land; money += at(s[0], s[1] - size * 0.36, (v < 0.3 ? rings(0, 0, size * 0.7 * (1 - v / 0.3), P.gold, 0.3) : "") + dig(size, mix("#fff3c2", P.ink, v / 0.18)), 1 + 0.5 * Math.exp(-v * 9) * Math.cos(v * 14)); });
  const stop1 = at(S1[0], S1[1], rings(0, 0, 160, P.gold, 0.08) + book(`<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/><circle cx="128" cy="-40" r="10" fill="${P.pink}"/>${LINES}`), BK) + money + at(S1[0] - 470, 170, marker(1, 1.54, a));
  // stop 2: the book lives in the bank; then (stop 3) it leaves
  const lit = [0, 1, 2, 3].map((j) => { const u = a - 4.9 - j * 0.12; return u > 0 ? 1 + 0.7 * Math.exp(-u * 11) : 0; });
  const leave = ease(seg(a, 7.04, 7.9)), arch = [BX, G - 225 * BKK], hover = [GL[0], GL[1]], bp = bez(arch, [3500, -200], hover, leave), bScale = lerp(BKK, 1.0, leave) * (leave > 0 && leave < 1 ? 1 + 0.15 * Math.sin(Math.PI * leave) : 1);
  const inner = `${a > 4.9 ? rings(0, -225, 160 * (a > 4.9 ? spring(a - 4.9, 7, 11) : 0), P.gold, 0.2 * (1 - leave), 1.3) : ""}${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>`;
  const stop2 = at(BX, G, bank({ inside: "#3b1d74", inner, sign: lit }), BKK) + at(BX - 500, 150, marker(2, 4.36, a));
  // stop 3: the globe, and a copy of the book for every side of it
  const N = 10, spread = a - 8.25;
  let copies = "";
  for (let i = 0; i < N; i++) { const ang = -Math.PI / 2 + i * 2 * Math.PI / N, p = ease(seg(spread, i * 0.04, 0.45 + i * 0.04)), to = [GL[0] + Math.cos(ang) * 340, GL[1] + Math.sin(ang) * 330], b = [lerp(hover[0], to[0], p), lerp(hover[1], to[1], p)];
    if (p <= 0) continue; copies += drawn(`M${hover[0]} ${hover[1]}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`, 1, P.gold, 6, 'stroke-dasharray="4 16" opacity=".7"') + at(b[0], b[1], (p >= 1 ? rings(0, 0, 70, P.gold, 0.2) : "") + book(rows("100", "50")), 0.42 * pop(spread - i * 0.04)); }
  const stop3 = at(GL[0], GL[1], globe(GR, tot * 0.03, { id: "rc" })) + at(GL[0] - 480, 200, marker(3, 6.47, a)) + copies;
  const theBook = at(bp[0], bp[1], (leave > 0.6 ? rings(0, 0, 200, P.gold, 0.18) : "") + book(rows("100", "50")), bScale);
  const ground = `<rect x="-2000" y="${G}" width="9000" height="1200" fill="#141a45"/><rect x="-2000" y="${G}" width="9000" height="12" fill="#2c366f"/>`;
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(71, 240, -3000, 8000, 1200, tot), c, 0.2) + layer(ground + stop1 + stop2 + stop3 + theBook, c);
  return { g };
}

const SHOTS = [s0];
export const recapSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
