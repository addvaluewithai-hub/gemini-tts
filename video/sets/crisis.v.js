// "2008" in portrait (1080 x 1920), for the Shorts. Shots 0 and 3 are the landscape shots reframed; 1 and 2 are drawn
// again for the tall frame, one thing above the other:
//   1 the houses up on the hill; below them the card table and the 1850 tower. Their coins drop down onto the cards,
//     the cards fall, then the tower tips over and the camera follows it down.
//   2 the domed building up top pours gold down a pipe into the cracked bank below it; the camera pulls back and
//     down to the town at the bottom, whose roofs feed the dome through pipes of their own.
import { lerp, ease, easeIn, seg, spring, rnd, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH } from "./kit.js";
import { P, house, bank, coin, clouds, skyline } from "./bank.js";
import { pop, cracks, fronts, roll, tower, plaque } from "./crisis.js";

// ---- 1 ----
function c1V(a, tot) {
  const GA = 820, GB = 1640, TX = 790, TS = 0.76, TK = 0.8;
  const c = camAt(a, [[0, 540, 1060, 1.0], [3.6, 540, 1080, 1.02], [6.1, 560, 1120, 1.02], [7.6, 620, 1160, 1.04], [8.2, 760, 1300, 0.95], [9.4, 800, 1340, 0.92]]);
  const HS = [[180, P.blue, P.blueD], [540, P.pink, P.pinkD], [900, P.teal, P.tealD]], TB = [270, GB - 150];
  const cards = [[-150, 0], [0, 0], [150, 0], [-75, -1], [75, -1], [0, -2]], down = seg(a, 3.55, 4.3);
  const cardsG = cards.map(([x, l], i) => { const t0 = 0.3 + i * 0.16, k = pop(a - t0), fx = x * 0.8 + down * (x === 0 ? 30 : x) * 1.6 * (1 + l * 0.3), fy = (down > 0 ? 300 * down * down * (1 + i * 0.1) : 0), r = down * (i % 2 ? 80 : -70) + (a > 3.0 && a < 3.55 ? 4 * Math.sin(a * 40) : 0);
    return k > 0 ? at(TB[0] + fx, TB[1] - 60 + fy, `<g transform="translate(0 ${l * 300})">${house(HS[i % 3][1], HS[i % 3][2])}</g>`, [0.42 * k, 0.42 * k], r) : ""; }).join("");
  // the houses' coins drop from the hill onto the top of the card tower
  let coins = ""; for (let i = 0; i < 9; i++) { const h = HS[i % 3], t0 = 1.42 + i * 0.14, p = seg(a, t0, t0 + 0.5), top = [TB[0] - 28 + (i % 3) * 28, TB[1] - 60 - 2 * 126 - 130 - Math.floor(i / 3) * 26];
    if (a < t0) continue; let pos = bez([h[0], GA - 280], [(h[0] + top[0]) / 2, Math.min(GA, top[1]) - 160], top, ease(p));
    if (down > 0) pos = [pos[0] + (i - 4) * 50 * down, pos[1] + 600 * down * down];
    coins += at(pos[0], pos[1], coin(24), 1, down * 300); }
  const table = `<path d="${rr(TB[0] - 190, GB - 160, 380, 30, 10)}" fill="#1f8a5a"/><path d="${rr(TB[0] - 190, GB - 134, 380, 10, 5)}" fill="#156b44"/><rect x="${TB[0] - 160}" y="${GB - 130}" width="18" height="130" fill="${P.woodD}"/><rect x="${TB[0] + 142}" y="${GB - 130}" width="18" height="130" fill="${P.woodD}"/>`;
  const fall = easeIn(seg(a, 8.12, 8.9)), crackP = seg(a, 7.7, 8.15) * 1.4, shake = a > 7.7 && a < 8.15 ? 5 * Math.sin(a * 60) : 0, foot = TX + 360 * TS;
  const theTower = `<g transform="translate(${foot + shake} ${GB}) rotate(${(fall * 88).toFixed(2)}) translate(${-foot} ${-GB})">${at(TX, GB, tower(crackP), TS)}</g>`;
  const dust = a > 8.6 ? Array.from({ length: 7 }, (_, i) => { const u = a - 8.6 - i * 0.03; return u > 0 ? `<circle cx="${TX - 150 + i * 160}" cy="${GB - 40 - 80 * (i % 2)}" r="${(130 + 70 * rnd(i)) * spring(u, 5, 8)}" fill="${P.stone}" opacity=".92"/>` : ""; }).join("") : "";
  const hs = HS.map(([x, col, colD], i) => at(x, GA, house(col, colD, { lit: [1, a > 1.42 + i * 0.14 + 0.5 ? 0 : 1, 1] }), 0.9)).join("");
  const hill = `<path d="M-600 ${GA}H1700V${GA + 60}H-600Z" fill="${P.ground}"/><path d="M-600 ${GA}H1700V${GA + 12}H-600Z" fill="#3a2a7a"/>`;
  const main = `<rect x="-1200" y="${GB}" width="3600" height="900" fill="${P.ground}"/>` + hill + hs + theTower + at(TX - 380 * TK * TS + 30, GB, plaque(seg(a, 6.14, 6.5) * (1 - seg(a, 7.6, 8.0))), 0.85) + table + cardsG + coins + dust;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bstorm)"/>` + layer(clouds(tot * 3, 200, 4, "#2a1446", 0.8) + skyline(13, -600, 1800, GB - 120, 120, 520, "#3a1850"), c, 0.3) + layer(main, c);
  return { g, in: toScreen(c, TX - 380 * TK * TS + 30, GB - 45), inC: P.cream, inZ: 16, out: toScreen(c, TX + 300, GB - 200), outC: P.stone, outZ: 14 };
}
// ---- 2 ----
function c2V(a, tot) {
  const c = camAt(a, [[0, 540, 900, 1.0], [3.9, 540, 900, 1.02], [5.0, 540, 1250, 0.78], [7.02, 540, 1250, 0.8]]), GD = 640, GK = 1260, HG = 2050, DX = 330, BX = 740;
  const dome = at(DX, GD, `${two(rr(-330, -300, 660, 300, 8), "#f1d3a2", P.stoneD, 16, 0)}${[-260, -170, -80, 10, 100, 190, 280].map((x) => two(rr(x - 18, -290, 36, 280, 4), P.stone, P.stoneD, 10, 0)).join("")}<path d="${rr(-360, -340, 720, 50, 8)}" fill="${P.stone}"/><path d="${rr(-200, -400, 400, 64, 8)}" fill="${P.stoneD}"/>
    ${two("M-200 -400A200 200 0 0 1 200 -400Z", "#fff4dc", "#e3b987", 14, 0)}<path d="M0 -600V-680" stroke="${P.ink}" stroke-width="10"/>${disc(0, -610, 26, P.gold, P.goldD)}<path d="${rr(-380, -14, 760, 14, 4)}" fill="${P.stoneD}"/>`, 0.62);
  // the pipe: out of the dome's side, over and down into the top of the bank
  const A = [DX + 210, GD - 200], B = [DX + 620, GD - 260], C2 = [BX + 120, GK - 640], D = [BX, GK - 470];
  const pipe = `M${A[0]} ${A[1]}C${B[0]} ${B[1]} ${C2[0]} ${C2[1]} ${D[0]} ${D[1]}`, pipeP = seg(a, 0.85, 1.3), pt = (p) => { const u = 1 - p; return [u * u * u * A[0] + 3 * u * u * p * B[0] + 3 * u * p * p * C2[0] + p * p * p * D[0], u * u * u * A[1] + 3 * u * u * p * B[1] + 3 * u * p * p * C2[1] + p * p * p * D[1]]; };
  let flow = ""; if (a > 1.3) for (let i = 0; i < 12; i++) { const p = ((a - 1.3) * 0.9 + i / 12) % 1; const q = pt(p); flow += at(q[0], q[1], coin(20), 1, p * 400); }
  const fall = a > 1.3 ? Array.from({ length: 6 }, (_, i) => { const u = ((a - 1.3) * 1.4 + i / 6) % 1; return at(BX + 10 * Math.sin(i * 2), GK - 470 + u * 200, coin(18)); }).join("") : "";
  const mend = 1.4 * (1 - seg(a, 3.4, 3.8)), saved = a > 3.7 ? rings(BX, GK - 240, 260 * spring(a - 3.7, 6, 10), P.gold, 0.14 * (1 - seg(a, 4.2, 4.8))) : "";
  const fig = a > 1.4 ? at(540, 150, `${two(rr(-470, -70, 940, 120, 60), P.ink, "#0a0726", 0, 6)}${text(0, 30, roll(700000000000, seg(a, 1.5, 2.64)), 84, P.gold)}`, pop(a - 1.4) * (1 - ease(seg(a, 4.2, 4.6)))) : "";
  // the town at the bottom pays: a pipe from every roof up the side to the dome; the coins go up, the windows go dark
  const hx = [140, 400, 660, 920];
  const town = hx.map((x, i) => { const f = fronts[i % 4], dark = a > 5.25 + i * 0.15; return at(x, HG, house(f[0], f[1], { lit: dark ? [0, 0, 0] : [1, 1, 1] }), 0.95); }).join("");
  const route = (x, i) => [[x, HG - 280], [x, HG - 520], [60 + i * 30, GK + 200], [DX - 120 + i * 50, GD]];
  const pipes = hx.map((x, i) => { const [p0, p1, p2, p3] = route(x, i); return `<path d="M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}" fill="none" stroke="${P.steelD}" stroke-width="20"/>`; }).join("");
  let up = ""; if (a > 4.7) hx.forEach((x, i) => { const [p0, p1, p2, p3] = route(x, i); for (let j = 0; j < 2; j++) { const p = ((a - 4.7) * 0.8 + j / 2 + i * 0.13) % 1, u = 1 - p;
    up += at(u * u * u * p0[0] + 3 * u * u * p * p1[0] + 3 * u * p * p * p2[0] + p * p * p * p3[0], u * u * u * p0[1] + 3 * u * u * p * p1[1] + 3 * u * p * p * p2[1] + p * p * p * p3[1], coin(22)); } });
  const ground = `<path d="M-1200 ${GD}H2400V${GD + 20}H-1200Z" fill="#3a2a7a"/><rect x="-1200" y="${GD + 20}" width="3600" height="${HG - GD - 20}" fill="#2a1556"/><path d="M-1200 ${GK}H2400V${GK + 16}H-1200Z" fill="#3a2a7a"/><rect x="-1200" y="${HG}" width="3600" height="800" fill="${P.ground}"/>`;
  const main = ground + pipes + up + town + dome + at(BX, GK, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: cracks(mend) }), 0.6) + saved + drawn(pipe, pipeP, P.steel, 36) + flow + fall + fig;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bstorm)"/>` + layer(clouds(tot * 2, 160, 3, "#2a1446", 0.7), c, 0.25) + layer(main, c);
  return { g, in: toScreen(c, DX, GD - 300), inC: P.stone, inZ: 14, out: toScreen(c, 660, HG - 110), outC: P.win, outZ: 26 };
}
export const V = [{ z: 1.1 }, c1V, c2V, { z: 0.9 }];
