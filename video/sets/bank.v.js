// "The bank is a ledger" in portrait (1080 x 1920), for the Shorts. Shot 1 is drawn again for the tall frame, one level
// above the other: the book up top, the bank with its sleeping vault in the middle, the blue and the pink house at the
// bottom. The coin sets off along the street between the houses, stops and goes home; the book changes its two rows and
// the change runs down a thread to each house. The other shots are the landscape ones reframed.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, bez, camAt, layer, toScreen, rr, two, rings, text, number, drawn, at, cross } from "./kit.js";
import { P, cub, house, bank, book, LINES, coin, pill, skyline, dusk } from "./bank.js";

function shot1V(a, tot) {
  const c = camAt(a, [[0, 540, 960, 1], [1.8, 540, 964, 1.02], [2.7, 540, 1010, 1.05], [3.4, 540, 930, 1.06], [5.5, 540, 925, 1.08]]);
  const GB = 1060, G = 1720, BKx = 540, BKy = 400, K = 1.75, HB = [240, G], HP = [840, G], HK = 1.25, AP = G - 292 * HK;
  const A = [HB[0], G - 70], Z = [HP[0], G - 70], MID = [540, 1260], XY = (G - 70 + 1260) / 2, pay = (p) => bez(A, MID, Z, p);
  const tb = [[HB[0], AP], [90, 1100], [110, 520], [BKx - 128 * K, BKy - 40 * K]], tp = [[HP[0], AP], [990, 1100], [970, 520], [BKx + 128 * K, BKy - 40 * K]];
  const pathOf = (t) => `M${t[0][0]} ${t[0][1]}C${t[1][0]} ${t[1][1]} ${t[2][0]} ${t[2][1]} ${t[3][0]} ${t[3][1]}`;
  const hot = seg(a, 1.9, 2.1) * (1 - seg(a, 3.0, 3.3));
  const vault = `<rect x="-600" y="${GB + 26}" width="2300" height="260" fill="${P.soil}"/><rect x="520" y="${GB}" width="40" height="60" fill="${P.steelD}"/><path d="${rr(350, GB + 52, 380, 178, 28)}" fill="#2c1a66" stroke="${P.steelD}" stroke-width="8"/>
    ${hot > 0 ? rings(540, GB + 150, 110 * spring(a - 1.9, 8, 14), P.gold, 0.22 * hot, 1.4) : ""}${[[-90, 0], [-30, 0], [30, 0], [90, 0], [-60, -48], [0, -48], [60, -48]].map(([x, y]) => at(540 + x, GB + 190 + y, coin(29))).join("")}
    ${[0, 1, 2].map((i) => { const u = a - 1.95 - i * 0.12; return u > 0 ? text(656 + i * 28, GB + 110 - i * 32 - 5 * Math.sin(tot * 2 + i), "z", 34 + i * 10, P.cream, { opacity: clamp(u / 0.15) * 0.9 }) : ""; }).join("")}`;
  const bk = at(BKx, GB, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: `${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>` }), 0.62);
  // the payment everyone pictures: a coin setting off from one door to the other. It stops, and goes home
  let trip = "";
  const stopP = 0.3, pc = a < 1.0 ? 0 : a < 1.83 ? stopP * easeOut(seg(a, 1.0, 1.83)) : a < 2.3 ? stopP : stopP * (1 - easeIn(seg(a, 2.3, 2.62))), dead = a >= 1.95;
  for (let j = 0; j < 23; j++) { const p = (j + 1) / 24, u = a - 0.45 - j * 0.028; if (u <= 0) continue; const gone = seg(a, 2.15 + (23 - j) * 0.02, 2.4 + (23 - j) * 0.02); if (gone >= 1) continue; const b = pay(p);
    trip += `<circle cx="${b[0].toFixed(1)}" cy="${(b[1] + gone * gone * 60).toFixed(1)}" r="${(10 * (0.2 + 0.8 * spring(u, 12, 20)) * (1 - gone)).toFixed(2)}" fill="${dead && p > pc ? "#b9a8ff" : P.gold}"/>`; }
  if (a > 0.5 && a < 2.78) { const b = pay(pc), sh = a > 1.83 && a < 2.3 ? 5 * Math.sin(a * 62) * Math.exp(-(a - 1.83) * 4) : 0, k = a < 2.62 ? 0.3 + 0.7 * spring(a - 0.5, 9, 15) : 1 - seg(a, 2.62, 2.78);
    trip += at(b[0] + sh, b[1] - 30 * Math.min(1, pc / 0.05), coin(58, "30"), k); }
  trip += cross(MID[0], XY, 66, P.red, a < 3.0 ? a - 1.95 : 0) + (a >= 3.0 && a < 3.2 ? at(MID[0], XY, `<circle r="66" fill="${P.red}"/>`, 1 - seg(a, 3.0, 3.2)) : "");
  // the book: the blue row goes down, the pink row goes up
  const blue = Math.round(lerp(100, 70, ease(seg(a, 3.5, 4.0)))), pink = Math.round(lerp(50, 80, ease(seg(a, 4.6, 4.95))));
  const rub = a > 3.3 && a < 4.15, wr = a > 4.45 && a < 5.1;
  const eraser = rub ? at(-62 + 36 * Math.sin((a - 3.4) * 21), lerp(-150, -40, easeOut(seg(a, 3.3, 3.45))) - 110 * easeIn(seg(a, 4.02, 4.15)), `${two(rr(-24, -14, 48, 28, 6), "#ff9db0", "#e77a92", 4, 3)}<path d="${rr(-24, -14, 18, 28, 6)}" fill="#6c7bd0"/>`, 1, -16) : "";
  const pencil = wr ? at(lerp(40, 92, seg(a, 4.58, 4.95)), lerp(-150, -22, easeOut(seg(a, 4.45, 4.58))) - 6 * Math.abs(Math.sin(a * 24)) - 120 * easeIn(seg(a, 4.98, 5.1)), `<path d="M-7 -96h14v82l-7 16l-7 -16Z" fill="${P.gold}"/><path d="M-7 -96h14v14h-14Z" fill="#ff9db0"/><path d="M-3 -4l3 6l3 -6Z" fill="${P.ink}"/>`, 1, 24) : "";
  const bumpAt = (t0) => 1 + 0.16 * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 13) * (a > t0 ? 1 : 0);
  const pages = `<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/><circle cx="128" cy="-40" r="10" fill="${P.pink}"/>${at(-62, -38, number(0, 18, blue, 52, a > 3.5 && a < 4.2 ? P.red : P.ink), bumpAt(4.0))}${at(62, -38, number(0, 18, pink, 52, a > 4.6 && a < 5.2 ? P.greenD : P.ink), bumpAt(4.95))}
    ${number(-111, 32, "730", 26, "#a58f5e")}${number(39, 32, "915", 26, "#a58f5e")}${LINES}${eraser}${pencil}`;
  const bead = (t, t0, t1, label, col, colD) => { if (a < t0 || a > t1 + 0.12) return ""; const p = ease(seg(a, t0, t1)), b = cub(t[3], t[2], t[1], t[0], p); return at(b[0], b[1], pill(label, col, colD, 130), (0.3 + 0.7 * spring(a - t0, 10, 16)) * (1 - seg(a, t1, t1 + 0.12)) * 1.15); };
  const litB = [1, 1, a < 4.42 ? 1 : 0], litP = [1, a < 5.32 ? 0 : 1, a < 5.32 ? 0 : 1], glowP = a > 5.32 ? rings(HP[0], G - 220, 240 * spring(a - 5.32, 7, 11), P.win, 0.16, 1.3) : "";
  const dipB = a > 4.42 ? 1 - 0.05 * Math.exp(-(a - 4.42) * 7) * Math.cos((a - 4.42) * 14) : 1, hopP = a > 5.32 ? 1 + 0.07 * Math.exp(-(a - 5.32) * 7) * Math.cos((a - 5.32) * 14) : 1;
  const threads = drawn(pathOf(tb), seg(a, 0.3, 0.85), P.blue, 6) + drawn(pathOf(tp), seg(a, 0.4, 0.95), P.pink, 6);
  const main = `<rect x="-600" y="${GB}" width="2300" height="30" fill="${P.ground}"/>${vault}<rect x="-600" y="${G}" width="2300" height="400" fill="${P.ground}"/>${bk}${glowP}${at(HB[0], G, house(P.blue, P.blueD, { lit: litB }), [HK, HK * dipB])}${at(HP[0], G, house(P.pink, P.pinkD, { lit: litP }), [HK, HK * hopP])}
    ${threads}${trip}${at(BKx, BKy, book(pages), K)}${bead(tb, 3.95, 4.4, "−30", P.red, P.redD)}${bead(tp, 4.9, 5.3, "+30", P.green, P.greenD)}`;
  const g = dusk(c, tot, 540, 1300) + layer(skyline(11, -300, 1400, G - 260, 140, 420, P.far), c, 0.35) + layer(skyline(47, -300, 1500, G - 90, 80, 260, P.mid, "#ffb066"), c, 0.65) + layer(main, c);
  return { g, in: toScreen(c, BKx - 150, BKy + 20), inC: P.cream, out: toScreen(c, HB[0] - 63 * HK, G - 115 * HK), outC: P.win, outZ: 44 };
}
export const V = [{ z: 1.0 }, shot1V, { z: 0.85, bg: ["#4a2b8a", "#3a2070"] }, { z: 0.75 }, { z: 1.2 }];
