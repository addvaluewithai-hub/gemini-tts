// Crypto part 3, wallet: four wordless shots (shots.md, scene wallet).
//   0 a wallet opens: no coins, only the gold key; a thread runs from it up to a row of the big book, where the coins are
//   1 the key's digits fold into a slip of twelve bars; the slip goes into a desk drawer that shuts; a little trophy over it wobbles
//   2 a phone wallet: the key on its screen, wifi arcs pulsing out; red hooks drift in along the arcs
//   3 a small steel box with no antenna, frosted; the wifi arcs bounce off it; a snowflake
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3wallet.v.js";
import { P, mix, book, coin, stars, skyline } from "./bank.js";
import { key, seedSlip, hotPhone, coldBox } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
// a leather wallet, 420 x 260 open (lid lifts with `open`), its inside shown when open
const wallet = (open = 0, inner = "") => `${two(rr(-210, -130, 420, 260, 30), "#8a4a2a", "#6a3418", 0, 10)}<path d="${rr(-180, -100, 360, 200, 20)}" fill="#3a1d10"/>${open > 0.3 ? inner : ""}
  <g transform="translate(0 -130) scale(1 ${(1 - 1.9 * ease(open)).toFixed(3)}) translate(0 130)">${two(rr(-210, -130, 420, 260, 30), "#a85a32", "#8a4a2a", 0, 10)}<path d="M-180 -10h360" stroke="#c97a4a" stroke-width="6" stroke-dasharray="14 10"/></g>`;
// a desk with one drawer; `out` 0..1 how far the drawer is pulled out
const desk = (out = 0, inner = "") => `<path d="${rr(-420, -40, 840, 40, 10)}" fill="${P.woodD}"/>${two(rr(-400, -320, 800, 290, 16), P.wood, P.woodD, 0, 10)}<path d="${rr(-440, -340, 880, 40, 12)}" fill="#c4834a"/>
  <path d="${rr(-260, -260, 520, 170, 10)}" fill="#3a1d10"/>${inner}<g transform="translate(0 ${(90 * out).toFixed(1)})">${two(rr(-270, -250 + 140 * 0, 540, 150, 10), "#c4834a", P.wood, 0, 8)}${disc(0, -175, 16, P.gold, P.goldD)}</g>`;

// ---- 0: the wallet holds the key; the money is a line in the book ----
function s0(a, tot) {
  const W = [700, 760], BK = [1220, 330];
  const c = camAt(a, [[0, 700, 700, 1.7], [2.6, 720, 690, 1.6], [3.7, 900, 560, 1.0], [5.32, 900, 560, 1.02]]);
  const open = ease(seg(a, 0.5, 1.1));
  const k = a > 2.6 ? at(-20, 0, rings(70, 0, 110, P.gold, 0.2 * pop(a - 2.6)) + key({ digits: 6 }), 0.7 * pop(a - 2.7)) : "";
  const moth = a > 1.4 && a < 2.7 ? at(60 * Math.sin(a * 3), -40 - 120 * seg(a, 1.4, 2.7), `<ellipse rx="22" ry="12" fill="#c8b8a0"/><path d="M0 0l-26 -18M0 0l26 -18" stroke="#c8b8a0" stroke-width="10" stroke-linecap="round"/>`, 1) : "";
  const wl = at(W[0], W[1], wallet(open, k + moth), 1.25);
  // a thread from the key up to a row of the book, which lights with the coins
  const th = seg(a, 3.6, 4.3), row = a > 4.3;
  const thread = th > 0 ? drawn(`M${W[0] + 60} ${W[1] - 10}Q${W[0] + 260} ${W[1] - 380} ${BK[0] - 280} ${BK[1] - 80}`, th, P.gold, 12) : "";
  const pg = `${row ? `<path d="${rr(-150, -60, 300, 40, 8)}" fill="${P.gold}" opacity=".4"/>` : ""}<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/>${text(-110, -30, "bc1q7c…", 24, P.ink, { anchor: "start" })}${row ? at(90, -40, coin(16, "") + at(30, 0, coin(16, "")), 1) : ""}<path d="M-120 10h240M-120 40h200M-120 70h220" stroke="#dccaa0" stroke-width="7" stroke-linecap="round"/>`;
  const bk = a > 3.3 ? at(BK[0], BK[1], rings(0, 0, 230, P.gold, row ? 0.15 : 0.06) + book(pg), 2.0 * pop(a - 3.3)) : "";
  return { g: night(c, tot, 43) + layer(bk + wl + thread, c), out: toScreen(c, W[0] - 25, W[1]), outC: P.gold, outZ: 18 };
}

// ---- 1: twelve words on paper, in a drawer ----
function s1(a, tot) {
  const D = [960, 980];
  const c = camAt(a, [[0, 960, 420, 1.5], [2.3, 960, 430, 1.4], [3.6, 960, 700, 1.0], [5.3, 960, 680, 1.05], [8.56, 960, 690, 1.1]]);
  // the key: its digits peel off and land on a slip as twelve bars
  const fold = seg(a, 0.5, 1.9), slipP = ease(seg(a, 1.3, 2.0));
  const k = fold < 1 ? at(700, 420, key({ digits: 12 }), 1.3 * (1 - 0.4 * fold)) : "";
  const bits = fold > 0 && fold < 1 ? Array.from({ length: 12 }, (_, i) => { const p = clamp(fold * 1.6 - i * 0.05), b = bez([780 + i * 34, 420], [960, 260], [870 + (i % 3) * 100, 380 + Math.floor(i / 3) * 42], ease(p)); return p > 0 && p < 1 ? `<path d="M${(b[0] - 20).toFixed(0)} ${b[1].toFixed(0)}h40" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>` : ""; }).join("") : "";
  // the slip goes down into the drawer (3.8 – 4.6), which shuts (4.6 – 4.9)
  const into = ease(seg(a, 3.8, 4.6)), shut = ease(seg(a, 4.6, 4.95)), out = a < 4.6 ? ease(seg(a, 3.3, 3.8)) : 1 - shut;
  const sl = slipP > 0 && into < 1 ? at(960, lerp(440, D[1] - 160, into), seedSlip(), lerp(1.4 * slipP, 0.7, into)) : "";
  const dk = at(D[0], D[1], desk(out, ""), 1.0);
  // the "finest tech" trophy pops over the drawer and wobbles
  const tro = a > 5.4 ? at(D[0] + 330, D[1] - 420 + 6 * Math.sin(tot * 5), `${two("M-50 -90H50Q50 -20 0 -10Q-50 -20 -50 -90Z", P.gold, P.goldD, 0, 8)}<path d="M-50 -80q-34 0 -30 30q4 20 30 20M50 -80q34 0 30 30q-4 20 -30 20" fill="none" stroke="${P.goldD}" stroke-width="10"/><path d="${rr(-14, -12, 28, 40, 4)}" fill="${P.goldD}"/><path d="${rr(-46, 26, 92, 22, 6)}" fill="${P.woodD}"/>`, 1.3 * pop(a - 5.4), 10 * Math.sin((a - 5.4) * 9) * Math.exp(-(a - 5.4) * 1.2)) : "";
  const ok = a > 6.5 ? at(D[0] - 330, D[1] - 440, check(0, 0, 44, P.green, a - 6.5), 1, 15 * Math.sin(tot * 6)) : "";
  const floor = `<rect x="-900" y="${D[1]}" width="3800" height="600" fill="#24164f"/>`;
  return { g: night(c, tot, 47) + layer(floor + dk + sl + k + bits + tro + ok, c), in: toScreen(c, 700, 420), inC: P.gold, inZ: 18, out: toScreen(c, D[0], D[1] - 175), outC: "#c4834a", outZ: 16 };
}

// ---- 2: the hot wallet ----
function s2(a, tot) {
  const PH = [880, 600];
  const c = camAt(a, [[0, 900, 470, 0.86], [2.97, 920, 460, 0.84]]);
  const ph = at(PH[0], PH[1], hotPhone({ wifi: a > 0.2 ? (a * 0.9) % 1 : 0, glow: "#fff3c2", inner: at(-40, -10, key({ digits: 4 }), 0.55) }), 2.0);
  const easy = a > 1.4 ? check(PH[0] - 330, PH[1] - 260, 54, P.green, a - 1.4) : "";
  let hooks = ""; for (let i = 0; i < 4; i++) { const t0 = 1.9 + i * 0.12; if (a < t0) continue; const p = ease(seg(a, t0, t0 + 0.9)), an = -0.9 + i * 0.6, r = lerp(620, 380, p);
    hooks += at(PH[0] + Math.sin(an) * r * 1.3, PH[1] - 420 - Math.cos(an) * r * 0.8, `<path d="M0 -40v40q0 26 -24 26q-20 0 -22 -20" fill="none" stroke="${P.red}" stroke-width="12" stroke-linecap="round"/><path d="M-46 6l-10 -16l18 4" fill="${P.red}"/>`, 1.8, an * 30); }
  return { g: night(c, tot, 53) + layer(ph + easy + hooks, c), in: [960, 540], inC: "#c4834a", inZ: 16, out: toScreen(c, PH[0], PH[1]), outC: "#fff3c2", outZ: 18 };
}

// ---- 3: the cold wallet ----
function s3(a, tot) {
  const B = [960, 600];
  const c = camAt(a, [[0, 960, 560, 1.35], [4.14, 960, 560, 1.45]]);
  const box = at(B[0], B[1], rings(0, 0, 230, "#9fe7ff", 0.12) + coldBox({ frost: ease(seg(a, 0.3, 1.2)) }), 1.8 * pop(a - 0.05));
  // wifi arcs come from the left and bounce off, turning grey
  let arcs = ""; for (let i = 0; i < 3; i++) { const t = a - 1.1 - i * 0.25; if (t < 0 || t > 1.4) continue; const x = t < 0.6 ? lerp(200, B[0] - 260, t / 0.6) : lerp(B[0] - 260, 300, (t - 0.6) / 0.8), back = t > 0.6;
    arcs += `<path d="M${x} ${B[1] - 120}A140 140 0 0 1 ${x} ${B[1] + 120}" transform="${back ? `scale(-1 1) translate(${-2 * x} 0)` : ""}" fill="none" stroke="${back ? "#6a6f88" : "#9fe7ff"}" stroke-width="14" stroke-linecap="round" opacity="${(1 - t / 1.4).toFixed(2)}"/>`; }
  const flake = a > 2.5 ? at(B[0] + 300, B[1] - 240, [0, 60, 120].map((r) => `<path d="M-60 0h120M-42 -16l-18 16l18 16M42 -16l18 16l-18 16" stroke="#e8f6ff" stroke-width="12" stroke-linecap="round" transform="rotate(${r})" fill="none"/>`).join(""), 1.1 * pop(a - 2.5), 20 * Math.sin(tot)) : "";
  return { g: night(c, tot, 59) + layer(arcs + box + flake, c), in: toScreen(c, B[0], B[1]), inC: "#fff3c2", inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3];
export const c3walletSet = makeSet(SHOTS, V, P);
