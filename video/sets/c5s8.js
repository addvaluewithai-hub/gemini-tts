// Crypto part 5, scene "s8": two words from the human dictionary (shot list:
// episodes/techforbadguys/explain-crypto-05-world/shots.md, rows 60–61):
//   0 SMART CONTRACT: the vending machine stands on the book and runs by itself: a coin drops in, the light checks,
//     the can falls; nobody behind the counter
//   1 the same machine runs its red bar too and still pays out (even if wrong). STABLECOIN: the green $1 coin zips across
//     between laptops like any crypto coin, then the blue freeze button frosts it like a bank
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s8.v.js";
import { stars, skyline } from "./bank.js";
import { P, mix, coin, vending, can, bookGears, dollarCoin, freezeBtn, laptop } from "./c5props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(97, 90, -800, 2800, 1080, tot), c, 0.15);
// the gold dictionary label at the top of the frame (screen space)
const label = (w, a, x = 960, y = 120) => (a > 0 ? at(x, y, `<path d="${rr(-(w.length * 30 + 70) / 2, -60, w.length * 30 + 70, 100, 22)}" fill="${P.gold}"/>${text(0, 18, w, 72, P.ink)}`, pop(a)) : "");
const G = 900;

// the machine on the book: t seconds of its own clock; bad: also run the red bar
function machine(t, tot, o = {}) {
  const coinP = seg(t, o.t0, o.t0 + 0.5), light = t < o.t0 + 0.5 ? "off" : t < o.t0 + 1.0 ? "wait" : "ok", drop = seg(t, o.t0 + 1.1, o.t0 + 1.6);
  const run = t > o.t0 + 0.5 ? clamp((t - o.t0 - 0.5) / 1.2) : undefined;
  let g = at(960, G, bookGears({ spin: tot * 1.5, grow: 1 }), 1.6);
  g += at(960, G - 150, vending({ light, item: can(o.red ? P.red : P.teal), drop, run, bad: o.bad }), 0.85);
  // the coin goes into the slot by itself; no hand, no seller
  g += coinP > 0 && coinP < 1 ? at(lerp(1240, 960 + 85, ease(coinP)), lerp(G - 640, G - 150 - 330 * 0.85, ease(coinP)), coin(28, "B")) : t < o.t0 ? at(1240, G - 640 + 6 * Math.sin(tot * 3), coin(28, "B"), pop(t + 0.3)) : "";
  g += t > o.t0 + 1.0 ? at(1260, G - 560, (o.bad ? cross : check)(0, 0, 44, o.bad ? P.red : P.green, t - o.t0 - 1.0)) : "";
  return g;
}

function s0(a, tot) {
  const c = camAt(a, [[0, 960, 600, 0.95], [2.4, 990, 560, 1.05], [5.46, 1000, 555, 1.08]]);
  const g = night(c, tot) + layer(`<rect x="-1000" y="${G + 120}" width="4000" height="600" fill="#2a1556"/>` + machine(a, tot, { t0: 2.7 }), c) + label("SMART CONTRACT", a - 1.6);
  return { g };
}

function s1(a, tot) {
  // 0–1.4 the machine again with its red bar: it pays out anyway; then STABLECOIN on the planet of laptops
  const toCoin = ease(seg(a, 1.2, 1.8));
  const c = camAt(a, [[0, 1000, 555, 1.08], [1.2, 1000, 555, 1.08], [1.8, 960, 560, 1.0], [6.26, 965, 560, 1.03]]);
  let g = "";
  if (a < 1.8) g += `<g opacity="${(1 - toCoin).toFixed(2)}">${machine(a + 0.3, tot, { t0: -1.5, bad: 2, red: true })}</g>`;
  // the laptops in a row, and the green coin zipping from one to the next like any crypto coin
  if (a > 1.4) { const k = pop(a - 1.4), LX = [300, 640, 980, 1320];
    LX.forEach((x, i) => { g += at(x, 780, laptop("#9fe7ff"), 0.95 * pop(a - 1.5 - i * 0.08)); });
    const zip = seg(a, 2.9, 3.9), seg4 = zip * 3, j = Math.min(2, Math.floor(seg4)), f = ease(seg4 - j), frost = ease(seg(a, 4.75, 5.5));
    let cx = lerp(LX[j], LX[j + 1], f), cy = 470 - 150 * Math.sin(Math.PI * f);
    if (a < 2.9) { cx = LX[0]; cy = 470; } if (a > 5.0) { cx = lerp(LX[3], 1500, ease(seg(a, 5.0, 5.4))); cy = lerp(470, 560, ease(seg(a, 5.0, 5.4))); }
    const trail = zip > 0 && zip < 1 ? [1, 2, 3].map((q) => `<circle cx="${(cx - q * 34).toFixed(1)}" cy="${(cy + q * 4).toFixed(1)}" r="${(44 - q * 10).toFixed(1)}" fill="${P.green}" opacity="${(0.5 - q * 0.13).toFixed(2)}"/>`).join("") : "";
    g += trail + at(cx, cy, dollarCoin(100, { frost }), k);
    // the freeze button rises beside it and is pressed; the frost spreads
    if (a > 4.4) g += at(1680, 880, freezeBtn(seg(a, 4.7, 4.9)), 1.3 * pop(a - 4.4)) + (a > 4.75 ? rings(1600, 640, 180 * spring(a - 4.75, 8, 12), "#9fe7ff", 0.25 * (1 - seg(a, 5.2, 5.8))) : "");
  }
  g = night(c, tot) + layer(`<rect x="-1000" y="${G + 120}" width="4000" height="600" fill="#2a1556"/>` + g, c) + label("STABLECOIN", a - 1.5);
  return { g };
}

const SHOTS = [s0, s1];
export const c5s8Set = makeSet(SHOTS, V, P);
