// Crypto part 6, joke coins: eight wordless shots (shots.md, scene s2).
//   0 the zoo of coins: cages along a night path; the camera walks to the strangest cage; 2013; two laptops press out a laughing coin
//   1 the coin turns over: a dog; MAY 2021; a counter rolls to ≈ $90,000,000,000
//   2 it is still worth billions; a dark tower with a megaphone (the richest man) sends a line out online (host right)
//   3 a spiky line jumps up on one post and drops on the next; a little house sells its coins early
//   4 the little house drives off in a used car; a gold star over it
//   5 a coin vending machine: one press, a fresh coin every moment; a page of code crossed out (host left)
//   6 a podium with a flag-coloured coin; 17 JAN 2025, three days before the inauguration podium
//   7 its line climbs to $74, then NOV 2026 and it falls to ≈ $1.12
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s2.v.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { calPage, laptop, car } from "./props.js";
import { tower } from "./c3props.js";
import { dogCoin, megaphone, podium } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -900, 3200, 1080, tot), c, 0.15);
const G = 900;
const town = (c, seed = 51) => layer(skyline(seed, -900, 3200, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 3200, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="4200" height="700" fill="${P.ground}"/>`, c);
const label = (x, y, t, a, size = 64, fill = P.gold) => (a > 0 ? at(x, y, `${two(rr(-t.length * size * 0.29 - 26, -size * 0.62, t.length * size * 0.58 + 52, size * 1.1, 14), P.ink, "#0d0b33", 0, 6)}${text(0, size * 0.32, t, size, fill)}`, pop(a)) : "");
const cal = (x, y, big, small, a, k = 0.62, size = 130) => (a > 0 ? at(x, y, calPage(big, small, 1, size), k * pop(a), 6) : "");
const fmtN = (v) => Math.round(v).toLocaleString("en");
// a laughing coin: a gold disc with a big open grin
const grinCoin = (r = 70) => `${disc(0, 0, r, P.gold, P.goldD)}<circle cx="${-r * 0.3}" cy="${-r * 0.2}" r="${r * 0.1}" fill="${P.ink}"/><circle cx="${r * 0.3}" cy="${-r * 0.2}" r="${r * 0.1}" fill="${P.ink}"/><path d="M${-r * 0.5} ${r * 0.08}Q0 ${r * 0.75} ${r * 0.5} ${r * 0.08}Z" fill="${P.ink}"/><path d="M${-r * 0.3} ${r * 0.32}Q0 ${r * 0.55} ${r * 0.3} ${r * 0.32}" fill="${P.red}"/>`;
// a zoo cage, 300 wide, base on y = 0, with `inner` standing inside
const cage = (inner = "", o = {}) => `${two(rr(-150, -20, 300, 20, 6), "#44529a", "#2c366f", 0, 6)}<path d="${rr(-140, -300, 280, 280, 10)}" fill="#141038"/>${inner}${Array.from({ length: 8 }, (_, i) => `<path d="M${-122 + i * 35} -300v280" stroke="${o.gold ? P.gold : P.steel}" stroke-width="9"/>`).join("")}${two(rr(-160, -330, 320, 40, 12), o.gold ? P.gold : P.steelD, o.gold ? P.goldD : "#5a6aa8", 0, 6)}`;
// a spiky meme line through pts, drawn up to p
const spikes = (pts, p, col = P.gold, w = 10) => { const n = pts.length - 1, up = clamp(p) * n, k = Math.floor(up), f = up - k;
  const cut = pts.slice(0, k + 1).concat(k < n ? [[lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]] : []);
  return { g: `<path d="${cut.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`, tip: cut[cut.length - 1] }; };

// ---- 0: the zoo of coins; the strangest cage; 2013; two laptops press out a laughing coin ----
const CAGES = [[300, "#8a8fb0"], [720, "#7fa0c0"], [1140, "#a08fc0"], [1650, null]];
function s0(a, tot) {
  const c = camAt(a, [[0, 700, 620, 1.05], [0.6, 760, 620, 1.05], [1.9, 1580, 640, 1.35], [6.42, 1640, 660, 1.5]]);
  let cages = "";
  CAGES.forEach(([x, col], i) => { const last = !col;
    const inner = last ? (a > 5.0 ? at(0, -150 + 6 * Math.sin(tot * 3), rings(0, 0, 110, P.gold, 0.2) + grinCoin(78), pop(a - 5.0) * (1 + 0.04 * Math.sin(tot * 9))) : at(0, -170, text(0, 0, "?", 120, mix(P.cream, P.gold, seg(a, 1.6, 2.0))), 1 + 0.06 * Math.sin(tot * 3)))
      : at(0, -140 + 4 * Math.sin(tot * 2 + i), disc(0, 0, 54, col, mix(col, P.ink, 0.25)) + `<circle r="22" fill="none" stroke="${mix(col, P.ink, 0.35)}" stroke-width="6"/>`);
    cages += at(x, G, cage(inner, { gold: last }) + (last && a > 1.7 ? rings(0, -160, 220, P.gold, 0.12 * seg(a, 1.7, 2.2)) : ""), last ? 1.15 : 0.9); });
  const path = `<path d="M-400 ${G + 60}H2600" stroke="#3a2a7a" stroke-width="40" stroke-dasharray="60 40"/>`;
  // two little laptops lean in and press the coin out between them
  const press = a > 3.9 ? [[-1, P.blue], [1, P.pink]].map(([s, col]) => { const lean = ease(seg(a, 4.0, 4.6)), bump = a > 4.6 && a < 5.0 ? Math.sin((a - 4.6) * 24) * 8 : 0;
    return at(1650 + s * (330 - 70 * lean + bump), G, laptop(col === P.blue ? "#9fe7ff" : "#ffc2dd", `<path d="M-80 -140h${100 + 40 * s}M-80 -100h120" stroke="${col}" stroke-width="16" stroke-linecap="round"/>`), 0.75 * pop(a - 3.9), -s * 8 * lean); }).join("") : "";
  const yr = cal(1250, 330, "2013", "", a - 2.45, 0.65);
  const g = night(c, tot, 13) + town(c) + layer(path + cages + press + yr, c);
  return { g, out: toScreen(c, 1650, G - 172), outC: P.gold, outZ: 18 };
}

// ---- 1: it turns over: a dog. MAY 2021; ≈ $90,000,000,000 ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.18, 960, 540, 1.04]]);
  const flip = seg(a, 0.15, 0.55), sx = Math.cos(Math.PI * flip), face = flip < 0.5 ? grinCoin(170) : dogCoin(170);
  const theCoin = at(720, 520 + 8 * Math.sin(tot * 2.4), rings(0, 0, 250, P.gold, 0.16 + 0.1 * seg(a, 0.5, 0.8)) + `<g transform="scale(${Math.max(0.05, Math.abs(sx)).toFixed(3)} 1)">${face}</g>`);
  const yr = cal(1350, 300, "2021", "MAY", a - 1.0, 0.75);
  const v = 90e9 * easeOut(seg(a, 2.4, 4.7)), cnt = a > 2.3 ? at(1350, 640, `${two(rr(-330, -70, 660, 130, 22), P.ink, "#0d0b33", 0, 8)}${text(0, 34, "≈ $" + fmtN(v), 68, P.gold)}`, pop(a - 2.3)) : "";
  const g = night(c, tot, 17) + layer(`<rect x="-400" y="${G}" width="2800" height="400" fill="${P.ground}"/>` + theCoin + yr + cnt, c);
  return { g, in: [720, 520], inC: P.gold, inZ: 18 };
}

// ---- 2: still worth billions; the richest man's megaphone sends a line out (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 800, 520, 1.3], [4.24, 820, 520, 1.33]]);
  const dog = at(520, 470 + 6 * Math.sin(tot * 2.4), rings(0, 0, 180, P.gold, 0.14 + 0.06 * Math.sin(tot * 3)) + dogCoin(130)) + label(520, 690, "$ BILLIONS", a - 0.2, 46);
  const tw = a > 1.1 ? at(1000, G, tower({ h: 520, lit: 0.25, c: "#2a2350", cD: "#1d1840", seed: 9 }), 0.85 * pop(a - 1.1)) : "";
  const mega = a > 1.4 ? at(890, 350, megaphone(), 1.25 * pop(a - 1.4), 192) : "";
  const fly = seg(a, 2.75, 3.6), b = bez([770, 330], [700, 200], [620, 320], ease(fly));
  const line = a > 2.75 ? drawn("M770 330Q700 200 620 320", ease(fly), P.cream, 8, 'stroke-dasharray="1 0"') + (fly > 0 ? at(b[0], b[1] - 40, `${two(rr(-70, -44, 140, 70, 18), P.cream, P.creamD, 0, 5)}<path d="M-20 26l10 18l12 -18Z" fill="${P.cream}"/>${at(0, -9, dogCoin(22))}`, 0.9 + 0.1 * ease(fly)) : "") : "";
  const g = night(c, tot, 19) + town(c, 63) + layer(dog + tw + mega + line, c);
  return { g, out: toScreen(c, 520, 470), outC: P.gold, outZ: 18 };
}

// ---- 3: a spiky line jumps up on a post, drops on the next; a little house sells early ----
const SP = [[260, 640], [380, 610], [470, 330], [560, 360], [640, 300], [740, 620], [860, 660], [960, 640]];
function s3(a, tot) {
  const c = camAt(a, [[0, 640, 470, 1.35], [2.3, 660, 470, 1.35], [3.0, 1420, 690, 1.45], [4.18, 1440, 690, 1.47]]);
  const p = a < 1.5 ? lerp(2 / 7, 4 / 7, ease(seg(a, 0.0, 0.5))) : lerp(4 / 7, 1, ease(seg(a, 1.5, 2.1))), sp = spikes(SP, p, a > 1.6 ? mix(P.gold, P.red, seg(a, 1.6, 2.0)) : P.gold);
  const panel = `${two(rr(200, 220, 840, 500, 24), "#2c1f63", "#1b1550", 0, 10)}${sp.g}${at(sp.tip[0], sp.tip[1], coin(26, "B"))}`;
  const bub = (x, y, up, t0) => (a > t0 ? at(x, y, `${two(rr(-80, -50, 160, 84, 20), P.cream, P.creamD, 0, 6)}<path d="M-30 32l14 22l18 -22Z" fill="${P.cream}"/>${at(-30, -8, dogCoin(22))}<path d="${up ? "M30 10V-30m-16 16l16 -16l16 16" : "M30 -30V10m-16 -16l16 16l16 -16"}" stroke="${up ? P.green : P.red}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - t0)) : "");
  // the little house sells: its coins fly out into a sack and it waves them off
  const H = [1500, G], sell = seg(a, 2.5, 3.7);
  let coins = ""; for (let i = 0; i < 6; i++) { const q = seg(a, 2.5 + i * 0.15, 3.0 + i * 0.15); if (q <= 0 || q >= 1) continue; const b = bez([H[0] - 40, H[1] - 220], [H[0] + 60, H[1] - 420], [H[0] + 230, H[1] - 120], ease(q)); coins += at(b[0], b[1], coin(22, "B")); }
  const sack = a > 2.4 ? at(H[0] + 230, H[1], `${two("M-60 0Q-80 -70 -40 -110H40Q80 -70 60 0Z", "#c9a46a", "#a8834a", 0, 8)}<path d="M-34 -110q34 -20 68 0" stroke="#7a5a2a" stroke-width="8" fill="none"/>${text(0, -40, "$", 48, "#7a5a2a")}`, pop(a - 2.4) * (1 + 0.1 * sell)) : "";
  const g = night(c, tot, 21) + town(c, 71) + layer(panel + bub(470, 250, true, 0.05) + bub(760, 250, false, 1.35) + at(H[0], H[1], house(P.teal, P.tealD, { lit: [1, 1, 1] }), 1.0) + coins + sack, c);
  return { g, out: toScreen(c, H[0], H[1] - 80), outC: P.ink, outZ: 16 };
}

// ---- 4: the little house drives off in a used car; a gold star over it ----
function s4(a, tot) {
  const c = camAt(a, [[0, 820, 690, 1.6], [0.3, 820, 690, 1.6], [2.76, 1380, 690, 1.55]]);
  const drive = easeIn(seg(a, 0.3, 2.4)), x = lerp(760, 1500, drive), bump = Math.abs(Math.sin(a * 14)) * 4 * (drive > 0 ? 1 : 0);
  const smoke = drive > 0 ? [0, 1, 2].map((i) => { const u = ((a * 1.6 + i / 3) % 1); return `<circle cx="${(x - 170 - 80 * u).toFixed(1)}" cy="${(G - 40 - 50 * u).toFixed(1)}" r="${(14 + 20 * u).toFixed(1)}" fill="#8a8fb0" opacity="${(0.5 * (1 - u)).toFixed(2)}"/>`; }).join("") : "";
  const used = car("#9a8a6a", "#7a6a4a") + `<path d="M-60 -70l20 10l-14 12" stroke="${P.ink}" stroke-width="5" fill="none"/><circle cx="30" cy="-58" r="10" fill="#7a6a4a"/>`;
  const rider = at(10, -170, house(P.teal, P.tealD, { lit: [1, 1, 1] }), 0.38);
  const star = a > 1.35 ? at(x, G - 330 + 6 * Math.sin(tot * 3), `${rings(0, 0, 60, P.gold, 0.25)}<path d="M0 -50L14 -16L50 -14L22 8L32 44L0 24L-32 44L-22 8L-50 -14L-14 -16Z" fill="${P.gold}" stroke="${P.goldD}" stroke-width="5"/>`, pop(a - 1.35)) : "";
  const road = `<rect x="-400" y="${G}" width="3000" height="400" fill="${P.road}"/><path d="M-400 ${G + 50}H2600" stroke="#5a4a9a" stroke-width="10" stroke-dasharray="70 50"/>`;
  const g = night(c, tot, 23) + town(c, 81) + layer(road + smoke + at(x, G - bump, rider + used, 1.25) + star, c);
  return { g, in: toScreen(c, 760, G - 80), inC: P.ink, inZ: 16 };
}

// ---- 5: a coin vending machine: one press, a fresh coin every moment; no code needed (host left) ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1000, 600, 1.22], [4.41, 1020, 600, 1.25]]);
  const MX = 1180, press = a > 0.8 && a < 1.0 ? 1 : 0;
  const machine = at(MX, G, `${two(rr(-200, -620, 400, 620, 26), P.pink, P.pinkD, 0, 12)}<path d="${rr(-160, -580, 320, 300, 14)}" fill="#141038"/>${[0, 1, 2].map((r) => [0, 1, 2].map((q) => at(-90 + q * 90, -520 + r * 90, coin(28, "B"))).join("")).join("")}
    <path d="${rr(-160, -250, 320, 90, 14)}" fill="${P.ink}"/>${text(0, -190, "NEW COIN", 40, P.gold)}${disc(120, -110, 36 - 6 * press, P.green, P.greenD)}<path d="${rr(-150, -100, 180, 60, 10)}" fill="${P.ink}"/>`);
  let out = ""; const n = Math.floor(clamp((a - 0.8) / 0.25, 0, 7));
  for (let i = 0; i < n; i++) { const t = a - 0.8 - i * 0.25, fall = clamp(t / 0.35), x = MX - 270 - (i % 4) * 66, y = lerp(G - 70, G - 34 - Math.floor(i / 4) * 52, easeIn(fall));
    out += at(lerp(MX - 60, x, ease(fall)), y, coin(30, "B"), 0.6 + 0.4 * spring(t, 10, 18)); }
  const page = a > 2.8 ? at(640, 520, `${two(rr(-120, -150, 240, 300, 12), P.cream, P.creamD, 0, 6)}${text(-80, -90, "{", 54, P.violet, { anchor: "start" })}${[0, 1, 2, 3].map((i) => `<path d="M-60 ${-50 + i * 40}h${[120, 90, 140, 70][i]}" stroke="${[P.pink, P.teal, P.blue, P.violet][i]}" stroke-width="14" stroke-linecap="round"/>`).join("")}`, pop(a - 2.8)) + (a > 3.1 ? cross(640, 520, 80, P.red, a - 3.1) : "") : "";
  const g = night(c, tot, 29) + town(c, 91) + layer(machine + out + page, c);
  return { g, out: toScreen(c, MX, G - 430), outC: "#141038", outZ: 16 };
}

// ---- 6: a podium with a flag-coloured coin; 17 JAN 2025, three days before the inauguration podium ----
function s6(a, tot) {
  const c = camAt(a, [[0, 980, 600, 1.2], [3.5, 1000, 600, 1.23]]);
  const pod = at(620, G, podium(), 1.25 * pop(a - 0.25));
  const date = cal(1080, 330, "2025", "17 JAN", a - 1.75, 0.9);
  const inaug = a > 2.2 ? at(1520, G, `${[-170, -60, 60, 170].map((x) => two(rr(x - 22, -520, 44, 480, 4), "#e8e2d0", "#c9c2ae", 8, 0)).join("")}${two("M-230 -520L0 -640L230 -520Z", "#f4f0e6", "#d9d2c0", 0, 8)}<path d="${rr(-240, -40, 480, 40, 6)}" fill="#c9c2ae"/>${at(0, -40, podium(), 0.75)}`, pop(a - 2.2)) : "";
  const arr = a > 2.4 ? drawn("M1180 470Q1330 400 1440 470", seg(a, 2.4, 2.9), P.gold, 10) + `<path d="M1440 470l-30 -6l14 28Z" fill="${P.gold}" opacity="${seg(a, 2.8, 2.9).toFixed(2)}"/>` + label(1310, 360, "−3 DAYS", a - 2.6, 44) : "";
  const g = night(c, tot, 31) + town(c, 101) + layer(pod + date + inaug + arr, c);
  return { g, in: toScreen(c, 620, G - 130), inC: P.gold, inZ: 16, out: toScreen(c, 620, G - 162), outC: P.gold, outZ: 18 };
}

// ---- 7: its line climbs to $74, then NOV 2026 and it falls to ≈ $1.12 ----
const TP = [[300, 760], [420, 740], [520, 600], [600, 330], [700, 420], [820, 560], [960, 640], [1120, 700], [1300, 735], [1480, 760], [1640, 770]];
function s7(a, tot) {
  const c = camAt(a, [[0, 700, 520, 1.3], [1.2, 760, 520, 1.25], [2.0, 980, 560, 1.12], [3.11, 1000, 560, 1.12]]);
  const p = a < 1.5 ? lerp(0, 3 / 10, ease(seg(a, 0.3, 1.1))) : lerp(3 / 10, 1, ease(seg(a, 1.55, 2.8))), sp = spikes(TP, p, a > 1.6 ? P.red : P.gold, 12);
  const base = `<path d="M260 790H1700" stroke="#3a2f7a" stroke-width="6"/>`;
  const peak = a > 1.0 ? label(600, 250, "$74", a - 1.0, 64) + cal(380, 330, "2025", "JAN", a - 0.6, 0.5, 120) : "";
  const low = a > 2.5 ? label(1640, 680, "≈ $1.12", a - 2.5, 54, P.red) : "";
  const now = cal(1460, 360, "2026", "NOV", a - 1.6, 0.55, 120);
  const g = night(c, tot, 37) + layer(base + sp.g + at(sp.tip[0], sp.tip[1] - 34, at(0, 0, coin(30, "B"))) + peak + now + low, c);
  return { g, in: toScreen(c, 600, 330), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const c6s2Set = makeSet(SHOTS, V, P);
