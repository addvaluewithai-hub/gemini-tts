// Crypto part 5, scene "s9": the summary, three stops under one camera travelling left to right (shot list:
// episodes/techforbadguys/explain-crypto-05-world/shots.md, rows 62–65):
//   0 stop 1: the book with gears runs its code; a green bar and a red bar both run and both pay out (right or wrong)
//   1 stop 2: the staking vault with its plug crossed out (no electricity); the richest house stands guard
//   2 stop 3: the plain green $1 coin on its pedestal (the most boring), the freeze button beside it (host right)
//   3 the middleman's tower rises behind the coin; the scene dims under a small NOT ADVICE sign
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s9.v.js";
import { house, stars, skyline } from "./bank.js";
import { P, mix, coin, bookGears, codeBars, stakeVault, dollarCoin, freezeBtn, tower } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const badge = (n, a) => (a <= 0 ? "" : at(0, 0, rings(0, 0, 70, P.gold, 0.2) + disc(0, 0, 62, P.gold, P.goldD) + text(0, 30, n, 86, P.ink), pop(a)));
const G = 900, X1 = 700, X2 = 2500, X3 = 4300;

// t: seconds since shot 0 began; T1..T3 when shots 1..3 began
function world(t, tot, s) {
  const E = s.ends || [], T1 = E[0] || 6.32, T2 = T1 + (E[1] || 3.55), T3 = T2 + (E[2] || 3.6), u1 = t - T1, u2 = t - T2, u3 = t - T3;
  let g = `<rect x="-1200" y="${G}" width="7000" height="600" fill="#2a1556"/>`;
  // stop 1: the book runs its code; a green bar and a red bar both execute and both pay out
  g += at(X1 - 120, G, bookGears({ spin: tot * 1.6 }), 1.7);
  const run = seg(t, 2.0, 5.5);
  g += at(X1 + 360, G - 420, `${two(rr(-40, -40, 330, 300, 20), "#2c1f63", "#1b1550", 0, 8)}${at(10, 0, codeBars(6, 260, { seed: 4, bad: 4, run, drawn: seg(t, 1.6, 2.2) }), 1)}`);
  // two chutes: green bar → a coin to the right house ✓, red bar → a coin to the wrong house, and it still runs ✓
  const o1 = seg(t, 3.6, 4.4), o2 = seg(t, 4.8, 5.6);
  if (o1 > 0) g += at(lerp(X1 + 520, X1 + 760, ease(o1)), lerp(G - 300, G - 120, easeIn(o1)), coin(40, "B")) + (o1 >= 1 ? at(X1 + 780, G - 330, check(0, 0, 40, P.green, t - 4.4)) : "");
  if (o2 > 0) g += at(lerp(X1 + 520, X1 + 1000, ease(o2)), lerp(G - 220, G - 120, easeIn(o2)), coin(40, "B")) + (o2 >= 1 ? at(X1 + 1040, G - 330, check(0, 0, 40, P.red, t - 5.6)) : "");
  g += at(X1 + 780, G, house(P.teal, P.tealD), 0.8) + at(X1 + 1040, G, house("#4b3d6a", "#3a2f55", { lit: [0, 0, 0] }), 0.8);
  g += at(X1 - 220, 300, badge("1", t - 1.35));
  // stop 2: the staking vault, no power cord; the richest house stands guard beside it, the others smaller
  g += at(X2, G, stakeVault({ coins: 1, t: tot }), 1.3);
  const plug = `<path d="M0 0q60 -10 100 -60" stroke="${P.ink}" stroke-width="12" fill="none"/>${two(rr(90, -100, 60, 50, 10), P.steel, P.steelD, 0, 6)}<path d="M150 -90h24M150 -60h24" stroke="${P.steelD}" stroke-width="8"/>`;
  g += u1 > 0.6 ? at(X2 - 360, G - 80, plug, pop(u1 - 0.6)) + (u1 > 1.0 ? at(X2 - 220, G - 200, cross(0, 0, 44, P.red, u1 - 1.0)) : "") : "";
  const guard = u1 > 1.8 ? ease(seg(u1, 1.8, 2.4)) : 0;
  g += at(X2 + 420, G, house(P.gold, P.goldD, { lit: [1, 1, 1] }), 1.15 * (0.4 + 0.6 * guard)) + (guard > 0 ? at(X2 + 420, G - 420, `<path d="M0 -60L52 -40V0Q52 40 0 64Q-52 40 -52 0V-40Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width="6"/>${coin(22, "$")}`, pop(u1 - 2.2)) : "");
  g += [[X2 + 700, P.blue, P.blueD], [X2 + 860, P.pink, P.pinkD]].map(([x, c, cD]) => at(x, G, house(c, cD), 0.45)).join("");
  g += at(X2 - 500, 230, badge("2", u1 + 0.05));
  // stop 3: the plain $1 coin on a pedestal, the freeze button beside it; then the middleman's tower rises behind
  const rise = ease(seg(u3, 0.0, 0.7));
  g += rise > 0 ? at(X3 + 40, G + 600 * (1 - rise), tower({ h: 620, name: "CO." }), 0.95) : "";
  g += at(X3, G, `${two(rr(-150, -60, 300, 60, 10), P.violet, P.violetD, 0, 10)}${two(rr(-110, -150, 220, 96, 10), "#7a55c9", P.violet, 0, 8)}`) + at(X3, G - 290, dollarCoin(110, { backed: seg(u2, 0.6, 1.2) }), pop(u2 - 0.5));
  g += u2 > 2.3 ? at(X3 - 320, G, freezeBtn(0), 1.1 * pop(u2 - 2.3)) : "";
  g += at(X3 - 420, 230, badge("3", u2 + 0.05));
  return g;
}
const night = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(101, 120, -1200, 5800, 1080, tot), c, 0.15);
const sky = (c) => layer(skyline(59, -1400, 6000, G - 100, 80, 240, "#221a5c", "#ffb066"), c, 0.45);
function s0(a, tot, s) { const c = camAt(a, [[0, X1 + 260, 600, 1.15], [6.32, X1 + 360, 600, 1.18]]); return { g: night(c, tot) + sky(c) + layer(world(a, tot, s), c) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 6.32, c = camAt(a, [[0, X1 + 300, 560, 1.03], [0.6, X2 + 160, 560, 1.0], [3.55, X2 + 180, 560, 1.02]]); return { g: night(c, tot) + sky(c) + layer(world(T1 + a, tot, s), c) }; }
function s2(a, tot, s) { const E = s.ends || [], T2 = (E[0] || 6.32) + (E[1] || 3.55), c = camAt(a, [[0, X2 + 180, 560, 1.02], [0.6, X3 - 60, 560, 1.12], [3.6, X3 - 50, 560, 1.14]]); return { g: night(c, tot) + sky(c) + layer(world(T2 + a, tot, s), c) }; }
function s3(a, tot, s) {
  const E = s.ends || [], T3 = (E[0] || 6.32) + (E[1] || 3.55) + (E[2] || 3.6), c = camAt(a, [[0, X3 - 50, 560, 1.14], [0.8, X3, 520, 0.98], [3.79, X3 + 10, 520, 0.95]]);
  const dim = ease(seg(a, 1.1, 1.8));
  const sign = a > 1.2 ? at(FW / 2, FH - 90, `${two(rr(-190, -48, 380, 96, 20), P.cream, P.creamD, 0, 6)}${text(0, 20, "NOT ADVICE", 52, P.red)}`, pop(a - 1.2)) : "";
  return { g: night(c, tot) + sky(c) + layer(world(T3 + a, tot, s), c) + `<rect width="${FW}" height="${FH}" fill="#0d0b33" opacity="${(0.45 * dim).toFixed(2)}"/>` + sign };
}

const SHOTS = [s0, s1, s2, s3];
export const c5s9Set = makeSet(SHOTS, V, P);
