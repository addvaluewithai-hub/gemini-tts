// "2008": four shots, one per beat of the crisis scene, in the town of the bank set.
//   0 the calendar runs on and stops at 2008; the sky turns to storm and a crack runs down the street
//   1 an old bank tower (its cornerstone says 1850) piles the houses' coins on a tower of house-cards; the cards fall; then the tower falls, in one go
//   2 a domed government building pours a river of gold into a cracked bank ($700,000,000,000); pull back: it is drawn up from the houses' roofs
//   3 the houses are boarded up and go dark; next door the rescued bank rains gold and bonus envelopes ($30,000,000,000)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, play, frame } from "./kit.js";
import { P, mix, fmt, house, bank, coin, stars, skyline, clouds, dusk } from "./bank.js";
import { calPage, calFlip } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const bump = (a, t0, amt = 0.14) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
const storm = (o) => `<rect width="1920" height="1080" fill="url(#bstorm)" opacity="${clamp(o).toFixed(3)}"/>`;
const cracks = (p) => drawn("M-120 -440L-90 -360L-140 -300L-100 -230L-130 -150", p, P.ink, 9, 'stroke-linejoin="round"') + drawn("M200 -440L230 -380L190 -320L220 -250", p - 0.2, P.ink, 9, 'stroke-linejoin="round"') + drawn("M-300 -200L-260 -160L-290 -110", p - 0.35, P.ink, 7);
const fronts = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD]];
// a dollar figure that rolls up to `to` as p goes 0..1
const roll = (to, p) => "$" + fmt(to * easeOut(p));
const boards = (k) => (k <= 0 ? "" : `<g opacity="${clamp(k * 3).toFixed(2)}">${[[-63, -115], [63, -115]].map(([x, y]) => `<path d="M${x - 34} ${y - 30}L${x + 34} ${y + 2}M${x - 34} ${y + 2}L${x + 34} ${y - 30}" stroke="${P.wood}" stroke-width="13" stroke-linecap="round" transform="translate(0 ${(-60 * (1 - ease(k))).toFixed(1)})"/>`).join("")}<path d="M-32 -50L32 -30M-32 -30L32 -50" stroke="${P.wood}" stroke-width="13" stroke-linecap="round"/></g>`);

// ---- 0: the years run on, and stop at 2008; a storm comes in, the street cracks ----
function c0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.6, 960, 540, 1.03], [3.46, 960, 555, 1.06]]), G = 990;
  const years = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008"], times = [0.6, 0.95, 1.25, 1.52, 1.76, 1.98, 2.2];
  const n = times.filter((t) => a >= t).length, st = seg(a, 2.6, 3.3);
  const cal = at(960, 300, calPage(years[n], "", 1, 150) + (n > 0 ? calFlip(years[n - 1], "", seg(a, times[n - 1], times[n - 1] + 0.22), 150) : ""), 1.65 * pop(a, 7, 12) * bump(a, 2.55, 0.12));
  let row = ""; for (let i = 0; i < 4; i++) { const x = 230 + i * 487, f = fronts[i % 4], dark = a > 2.9 + i * 0.05 && rnd(i * 7) > 0.4;
    row += at(x, G, house(f[0], f[1], { lit: dark ? [0, 1, 0] : [1, 1, 1] }), [1.5, 1.5], st * (i % 2 ? 2 : -2)); }
  const crackD = `M-40 ${G + 60}L260 ${G + 90}L420 ${G + 50}L640 ${G + 110}L900 ${G + 60}L1120 ${G + 120}L1380 ${G + 70}L1600 ${G + 110}L1960 ${G + 70}`, crack = drawn(crackD, seg(a, 2.7, 3.3), "#ff8a5c", 34, 'stroke-linejoin="round"') + drawn(crackD, seg(a, 2.7, 3.3), "#0a0726", 18, 'stroke-linejoin="round"');
  const bolt = a > 2.85 && a < 3.05 ? `<path d="M1500 0L1440 160L1500 170L1410 360L1530 150L1470 140L1540 0Z" fill="#fff3c2"/><rect width="1920" height="1080" fill="#fff" opacity="${(0.25 * (1 - seg(a, 2.85, 3.05))).toFixed(2)}"/>` : "";
  const main = `<rect x="-600" y="${G}" width="3200" height="500" fill="${mix(P.ground, "#1a0f3a", st)}"/><rect x="-600" y="${G + 50}" width="3200" height="130" fill="${P.road}"/>` + row + crack;
  const g = dusk(c, tot, 1500, 700) + storm(st) + layer(clouds(tot * 3, 120, 4, mix("#ffb199", "#2a1446", st), 0.4 + 0.5 * st), c, 0.2) + layer(skyline(11, -400, 2400, G - 150, 100, 300, mix(P.far, "#2a1446", st)), c, 0.35) + layer(main, c) + bolt + layer(cal, c);
  return { g, out: toScreen(c, 960, 300), outC: P.cream, outZ: 16 };
}
// ---- 1: the bank bets the houses' money on house-cards; the cards fall; then the 158-year-old tower falls in one go ----
const TX = 1450, TG = 900, TK = 0.8;
const tower = (fall) => { const w = 560, top = -1450;
  let wins = ""; for (let r = 0; r < 10; r++) for (let q = 0; q < 4; q++) wins += `<rect x="${-w / 2 + 60 + q * 120}" y="${top + 60 + r * 90}" width="60" height="56" rx="6" fill="${(r + q) % 3 ? P.win : "#3b2a6e"}"/>`;
  return `${two(rr(-w / 2, top, w, -top - 500, 8), "#e9c99a", "#c9a676", 18, 0)}${wins}${two(rr(-w / 2 - 30, top - 40, w + 60, 50, 8), P.stone, P.stoneD, 0, 10)}<path d="M-60 ${top - 40}L0 ${top - 130}L60 ${top - 40}Z" fill="${P.stone}"/>${disc(0, top - 70, 22, P.gold, P.goldD)}
    ${at(0, 0, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: cracks(fall) }), TK)}`; };
const plaque = (glow) => `${glow > 0 ? rings(0, -45, 120, P.gold, 0.3 * glow) : ""}${two(rr(-110, -90, 220, 90, 8), P.stone, P.stoneD, 0, 10)}${text(0, -22, "1850", 64, mix("#8a6a3a", "#8a5200", glow))}`;
function c1(a, tot) {
  const c = camAt(a, [[0, 760, 580, 1.4], [3.6, 790, 590, 1.45], [4.4, 820, 590, 1.4], [5.2, TX, 420, 0.95], [6.0, TX, -60, 0.95], [6.6, TX - 380 * TK + 40, TG - 80, 1.9], [7.4, TX - 380 * TK + 40, TG - 80, 2.0], [8.0, TX + 150, 300, 0.78], [9.4, TX + 200, 340, 0.8]]);
  const HS = [[110, P.blue, P.blueD], [340, P.pink, P.pinkD], [570, P.teal, P.tealD]], TB = [920, TG - 150];
  // the house-cards: a pyramid of little houses on a green table
  const cards = [[-150, 0], [0, 0], [150, 0], [-75, -1], [75, -1], [0, -2]], down = seg(a, 3.55, 4.3);
  const cardsG = cards.map(([x, l], i) => { const t0 = 0.3 + i * 0.16, k = pop(a - t0), fx = x + down * (x === 0 ? 30 : x) * 2.2 * (1 + l * 0.3), fy = (down > 0 ? 300 * down * down * (1 + i * 0.1) : 0), r = down * (i % 2 ? 80 : -70) + (a > 3.0 && a < 3.55 ? 4 * Math.sin(a * 40) : 0);
    return k > 0 ? at(TB[0] + fx, TB[1] - 60 + fy - l * 0, `<g transform="translate(0 ${l * 300})">${house(HS[i % 3][1], HS[i % 3][2])}</g>`, [0.5 * k, 0.5 * k], r) : ""; }).join("");
  // the houses' coins hop from their roofs onto the top of the card tower
  let coins = ""; for (let i = 0; i < 9; i++) { const h = HS[i % 3], t0 = 1.42 + i * 0.14, p = seg(a, t0, t0 + 0.5), top = [TB[0] - 34 + (i % 3) * 34, TB[1] - 60 - 2 * 150 - 160 - Math.floor(i / 3) * 30];
    if (a < t0) continue; let pos = bez([h[0], TG - 250], [(h[0] + top[0]) / 2, 120], top, ease(p));
    if (down > 0) pos = [pos[0] + (i - 4) * 60 * down, pos[1] + 600 * down * down];
    coins += at(pos[0], pos[1], coin(26), 1, down * 300); }
  const table = `<path d="${rr(TB[0] - 220, TG - 160, 440, 30, 10)}" fill="#1f8a5a"/><path d="${rr(TB[0] - 220, TG - 134, 440, 10, 5)}" fill="#156b44"/><rect x="${TB[0] - 190}" y="${TG - 130}" width="18" height="130" fill="${P.woodD}"/><rect x="${TB[0] + 172}" y="${TG - 130}" width="18" height="130" fill="${P.woodD}"/>`;
  // the fall: the whole tower tips over its right foot, in one go, and a cloud of dust goes up
  const fall = easeIn(seg(a, 8.12, 8.9)), crackP = seg(a, 7.7, 8.15) * 1.4, shake = a > 7.7 && a < 8.15 ? 5 * Math.sin(a * 60) : 0;
  const theTower = `<g transform="translate(${TX + 360 + shake} ${TG}) rotate(${(fall * 88).toFixed(2)}) translate(${-TX - 360} ${-TG})">${at(TX, TG, tower(crackP))}</g>`;
  const dust = a > 8.6 ? Array.from({ length: 9 }, (_, i) => { const u = a - 8.6 - i * 0.03; return u > 0 ? `<circle cx="${TX - 200 + i * 220}" cy="${TG - 40 - 80 * (i % 2)}" r="${(160 + 80 * rnd(i)) * spring(u, 5, 8)}" fill="${P.stone}" opacity=".92"/>` : ""; }).join("") : "";
  const hs = HS.map(([x, col, colD], i) => at(x, TG, house(col, colD, { lit: [1, a > 1.42 + i * 0.14 + 0.5 ? 0 : 1, 1] }), 0.8)).join("");
  const main = `<rect x="-1200" y="${TG}" width="4800" height="900" fill="${P.ground}"/>` + hs + theTower + at(TX - 380 * TK + 40, TG, plaque(seg(a, 6.14, 6.5) * (1 - seg(a, 7.6, 8.0))), 1) + table + cardsG + coins + dust;
  const g = `<rect width="1920" height="1080" fill="url(#bstorm)"/>` + layer(clouds(tot * 3, 100, 4, "#2a1446", 0.8) + skyline(13, -1200, 3600, TG - 120, 100, 380, "#3a1850"), c, 0.3) + layer(main, c);
  return { g, in: toScreen(c, TX - 380 * TK + 40, TG - 45), inC: P.cream, inZ: 16, out: toScreen(c, TX + 400, TG - 200), outC: P.stone, outZ: 14 };
}
// ---- 2: the government pours gold into the cracked bank; it is drawn up out of the houses ----
function c2(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.08], [3.9, 980, 560, 1.1], [5.0, 960, 1180, 0.84], [7.02, 960, 1190, 0.87]]), G = 860, HG = 1560, DX = 470, BX = 1450;
  const dome = at(DX, G, `${two(rr(-330, -300, 660, 300, 8), "#f1d3a2", P.stoneD, 16, 0)}${[-260, -170, -80, 10, 100, 190, 280].map((x) => two(rr(x - 18, -290, 36, 280, 4), P.stone, P.stoneD, 10, 0)).join("")}<path d="${rr(-360, -340, 720, 50, 8)}" fill="${P.stone}"/><path d="${rr(-200, -400, 400, 64, 8)}" fill="${P.stoneD}"/>
    ${two("M-200 -400A200 200 0 0 1 200 -400Z", "#fff4dc", "#e3b987", 14, 0)}<path d="M0 -600V-680" stroke="${P.ink}" stroke-width="10"/>${disc(0, -610, 26, P.gold, P.goldD)}<path d="${rr(-380, -14, 760, 14, 4)}" fill="${P.stoneD}"/>`);
  const pipe = `M${DX + 200} ${G - 380}C${DX + 600} ${G - 760} ${BX - 300} ${G - 760} ${BX} ${G - 600}`, pipeP = seg(a, 0.85, 1.3), pt = (p) => { const u = 1 - p, A = [DX + 200, G - 380], B = [DX + 600, G - 760], C2 = [BX - 300, G - 760], D = [BX, G - 600]; return [u * u * u * A[0] + 3 * u * u * p * B[0] + 3 * u * p * p * C2[0] + p * p * p * D[0], u * u * u * A[1] + 3 * u * u * p * B[1] + 3 * u * p * p * C2[1] + p * p * p * D[1]]; };
  let flow = ""; if (a > 1.3) for (let i = 0; i < 12; i++) { const p = ((a - 1.3) * 0.9 + i / 12) % 1; const q = pt(p); flow += at(q[0], q[1], coin(20), 1, p * 400); }
  const fall = a > 1.3 ? Array.from({ length: 6 }, (_, i) => { const u = ((a - 1.3) * 1.4 + i / 6) % 1; return at(BX + 10 * Math.sin(i * 2), G - 600 + u * 260, coin(18)); }).join("") : "";
  const mend = 1.4 * (1 - seg(a, 3.4, 3.8)), saved = a > 3.7 ? rings(BX, G - 300, 300 * spring(a - 3.7, 6, 10), P.gold, 0.14 * (1 - seg(a, 4.2, 4.8))) : "";
  const fig = a > 1.4 ? at(980, 150, `${two(rr(-420, -70, 840, 120, 60), P.ink, "#0a0726", 0, 6)}${text(0, 30, roll(700000000000, seg(a, 1.5, 2.64)), 84, P.gold)}`, pop(a - 1.4)) : "";
  // under the hill: the town that pays. Pipes from every roof up to the dome; the coins go up them, the windows go dark
  const hx = [200, 580, 960, 1340, 1720];
  const town = hx.map((x, i) => { const f = fronts[i % 4], dark = a > 5.25 + i * 0.15; return at(x, HG, house(f[0], f[1], { lit: dark ? [0, 0, 0] : [1, 1, 1] }), 1.45); }).join("");
  const pipes = hx.map((x, i) => `<path d="M${x} ${HG - 420}C${x} ${HG - 600} ${DX + (i - 2) * 70} ${G + 300} ${DX + (i - 2) * 50} ${G}" fill="none" stroke="${P.steelD}" stroke-width="22"/>`).join("");
  let up = ""; if (a > 4.7) hx.forEach((x, i) => { for (let j = 0; j < 2; j++) { const p = ((a - 4.7) * 0.8 + j / 2 + i * 0.13) % 1, u = 1 - p, A = [x, HG - 420], B = [x, HG - 600], C2 = [DX + (i - 2) * 70, G + 300], D = [DX + (i - 2) * 50, G];
    const q = [u * u * u * A[0] + 3 * u * u * p * B[0] + 3 * u * p * p * C2[0] + p * p * p * D[0], u * u * u * A[1] + 3 * u * u * p * B[1] + 3 * u * p * p * C2[1] + p * p * p * D[1]]; up += at(q[0], q[1], coin(24)); } });
  const hill = `<path d="M-1200 ${G}H2600V${HG}H-1200Z" fill="#2a1556"/><path d="M-1200 ${G}H2600V${G + 20}H-1200Z" fill="#3a2a7a"/><rect x="-1200" y="${HG}" width="4800" height="800" fill="${P.ground}"/>`;
  const main = hill + pipes + up + town + dome + at(BX, G, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: cracks(mend) }), 0.75) + saved + drawn(pipe, pipeP, P.steel, 40) + flow + fall + fig;
  const g = `<rect width="1920" height="1080" fill="url(#bstorm)"/>` + layer(clouds(tot * 2, 90, 3, "#2a1446", 0.7), c, 0.25) + layer(main, c);
  return { g, in: toScreen(c, DX, G - 470), inC: P.stone, inZ: 14, out: toScreen(c, 960 - 63 * 1.45, HG - 115 * 1.45), outC: P.win, outZ: 26 };
}
// ---- 3: the houses get boarded up and go dark; the rescued bank rains gold and bonus envelopes ----
function c3(a, tot) {
  const c = camAt(a, [[0, 740, 640, 1.18], [2.3, 740, 640, 1.2], [3.1, 2600, 560, 1.05], [6.73, 2620, 560, 1.08]]), G = 900, BX = 2480;
  const hs = [[300, 0], [720, 1], [1140, 2]].map(([x, i]) => { const b = seg(a, 0.38 + i * 0.35, 0.7 + i * 0.35), f = fronts[i], off = a > 0.6 + i * 0.35;
    return at(x, G, house(f[0], f[1], { lit: off ? [0, 0, 0] : [1, 1, 1] }) + boards(b), [1.35, 1.35 * bump(a, 0.6 + i * 0.35, 0.04)]); }).join("");
  const rain = a > 3.25 ? Array.from({ length: 40 }, (_, i) => { const u = (a - 3.25) * (0.5 + rnd(i) * 0.4) + rnd(i + 50) * 0.3, y = -120 + ((u * 900) % 1300), x = BX - 700 + rnd(i * 3) * 1400 + 40 * Math.sin(tot * 2 + i);
    if (u * 900 < 0) return ""; return i % 3 === 0 ? at(x, y, `${two(rr(-38, -26, 76, 52, 6), P.gold, P.goldD, 0, 5)}<path d="M-38 -26L0 4L38 -26" fill="none" stroke="${P.goldD}" stroke-width="5"/>`, 1, 30 * Math.sin(tot * 3 + i)) : `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="16" height="26" rx="3" fill="${[P.gold, P.pink, P.teal, P.cream][i % 4]}" transform="rotate(${(tot * 200 + i * 40) % 360} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join("") : "";
  const fig = a > 4.1 ? at(BX, 140, `${two(rr(-400, -70, 800, 120, 60), P.ink, "#0a0726", 0, 6)}${text(0, 30, roll(30000000000, seg(a, 4.29, 6.27)), 84, P.gold)}`, pop(a - 4.1)) : "";
  const glowB = a > 3.0 ? rings(BX, G - 330, 420, P.gold, 0.16 * seg(a, 3.0, 3.4), 1.3) : "";
  const main = `<rect x="-600" y="${G}" width="4400" height="500" fill="${P.ground}"/><rect x="-600" y="${G + 50}" width="4400" height="130" fill="${P.road}"/>` + hs + glowB + at(BX, G, bank({ inside: "#3b1d74", sign: [1.6, 1.6, 1.6, 1.6], inner: rings(0, -150, 120, P.gold, 0.4) }), 0.95) + rain + fig;
  const g = `<rect width="1920" height="1080" fill="url(#bstorm)"/>` + layer(clouds(tot * 2, 100, 4, "#2a1446", 0.7) + skyline(17, -600, 3800, G - 140, 100, 300, "#3a1850", "#7a3a40"), c, 0.35) + layer(main, c);
  return { g, in: toScreen(c, 720 - 63 * 1.35, G - 115 * 1.35), inC: P.win, inZ: 26 };
}

const SHOTS = [c0, c1, c2, c3];
export const crisisSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
