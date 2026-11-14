// "Copy": six shots, one per beat of the copy scene. Anything digital copies itself for free; money as a file would be
// spent twice; that is why a checker sat in the middle; the Cypherpunks' dream; DigiCash, which went broke.
//   0 a glowing file splits into two   1 a picture, a song, a film: copy, paste, $0   2 the blue house sends the same $100
//   to the pink and the teal house at once, and still has it   3 two copies, ×2; the bank and its book come down between them:
//   one ✓, one ✗   4 a dark room of old monitors with locks on their screens; a digital coin; the watching camera shuts its
//   eye, the barrier lifts   5 a little company with a "D" coin sign lights up, 1989; 1998, the lights go out, the sign
//   falls, the door is locked, and the wallet on its step opens on a moth
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, play, frame } from "./kit.js";
import { P, mix, house, bank, book, rows, coin, stars, skyline } from "./bank.js";
import { calPage, calFlip, padlock } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const room = (c, tot) => `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(53, 60, -300, 2300, 700, tot), c, 0.15);
// a file: a page with a folded corner, 240 x 300 around (0, 0); `inner` is drawn on it
const fileCard = (inner = "", o = {}) => `${o.glow ? rings(0, 0, 190, o.glowC || "#9fe7ff", o.glow * 0.2) : ""}${two("M-120 -150H70L120 -100V150H-120Z", o.c || P.cream, o.cD || P.creamD, 0, 10)}<path d="M70 -150V-100H120Z" fill="${o.cD || P.creamD}"/>${inner}`;
const picture = `<path d="${rr(-84, -96, 168, 130, 10)}" fill="#7fd0ff"/><circle cx="40" cy="-60" r="18" fill="${P.gold}"/><path d="M-84 34L-30 -30L10 10L40 -14L84 34Z" fill="${P.green}"/><path d="M-80 76h160M-80 106h110" stroke="${P.creamD}" stroke-width="12" stroke-linecap="round"/>`;
const song = `<path d="M-20 50V-70L60 -90V30" stroke="${P.violetD}" stroke-width="14" fill="none" stroke-linejoin="round"/><ellipse cx="-42" cy="52" rx="30" ry="22" fill="${P.violet}"/><ellipse cx="38" cy="32" rx="30" ry="22" fill="${P.violet}"/><path d="M-80 106h110" stroke="${P.creamD}" stroke-width="12" stroke-linecap="round"/>`;
const film = `<circle cx="0" cy="-10" r="70" fill="${P.ink}"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${(Math.cos(i * 1.257) * 40).toFixed(1)}" cy="${(-10 + Math.sin(i * 1.257) * 40).toFixed(1)}" r="16" fill="${P.cream}"/>`).join("")}<circle cx="0" cy="-10" r="10" fill="${P.cream}"/><path d="M-80 106h110" stroke="${P.creamD}" stroke-width="12" stroke-linecap="round"/>`;
const money100 = (fill = "#1f7a48") => `${disc(0, -50, 52, P.gold, P.goldD)}${text(0, -30, "$", 60, "#8a5200")}${number(0, 80, "100", 84, fill)}`;

// ---- 0: anything digital is copied ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.17, 960, 530, 1.08]]), sp = a < 1.3 ? 0 : spring(a - 1.3, 8, 13), d = 300 * sp, hum = 6 * Math.sin(tot * 2.2);
  const desk = `<rect x="-400" y="860" width="2800" height="400" fill="${P.wood}"/><rect x="-400" y="880" width="2800" height="400" fill="${P.woodD}"/><ellipse cx="960" cy="868" rx="${380 + d}" ry="16" fill="#1d0f45" opacity=".5"/>`;
  const flash = a > 1.3 && a < 1.6 ? rings(960, 500, 240 * (1 + (a - 1.3) * 3), "#ffffff", 0.3 * (1 - (a - 1.3) / 0.3)) : "";
  const card = (dx, k) => at(960 + dx, 500 + hum, fileCard(picture, { glow: 1 }), 1.9 * k);
  const g = room(c, tot) + layer(desk + flash + (sp > 0 ? card(-d, 1) + card(d, 1) : card(0, 1)), c);
  return { g, out: toScreen(c, 960 + d, 500), outC: P.cream, outZ: 16 };
}
// ---- 1: a picture, a song, a film; copy, paste; free ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.12], [1.7, 960, 520, 1.0], [3.65, 960, 520, 0.96]]), X = [440, 960, 1480], src = [picture, song, film], t0 = [0, 0.57, 1.19];
  const n1 = a < 1.76 ? 0 : spring(a - 1.76, 8, 13), n2 = a < 2.23 ? 0 : spring(a - 2.23, 8, 13);
  let cards = "";
  X.forEach((x, i) => { const k = 1.6 * pop(a - t0[i] + (i === 0 ? 0.3 : 0)); if (k <= 0) return;
    // the copies: one beside it on "copy", then two more under them on "paste"
    const spots = [[0, 0], [190 * n1, 0], [0, 250 * n2], [190 * n1, 250 * n2]].map(([dx, dy]) => [x - 95 * n1 + dx, 510 - 125 * n2 + dy]);
    [3, 2, 1, 0].forEach((j) => { if ((j === 1 && n1 <= 0) || (j >= 2 && n2 <= 0)) return; const s = j === 0 ? k : 1.6 * (j === 1 ? n1 : n2), kk = lerp(1.6, 0.86, Math.max(n1 * 0.55, n2));
      cards += at(spots[j][0], spots[j][1] + 5 * Math.sin(tot * 2 + i + j), fileCard(src[i]), j === 0 ? k * kk / 1.6 : Math.min(s, kk)); }); });
  const tg = a - 2.8, price = tg > 0 ? at(960, 900, `${two("M-180 -80h270l90 80l-90 80h-270Z", P.gold, P.goldD, 0, 10)}<circle cx="130" cy="0" r="18" fill="${P.ink}"/>${text(-40, 46, "$0", 130, "#8a5200")}`, pop(tg, 8, 13), -6 + 6 * spring(tg, 8, 13)) : "";
  const g = room(c, tot) + layer(cards + price, c);
  return { g, in: toScreen(c, 440, 510), inC: P.cream, inZ: 16, out: toScreen(c, 960, 900), outC: P.gold, outZ: 18 };
}
// ---- 2: money as a file: the blue house sends the same $100 to the pink house and to the teal house, at once ----
function s2(a, tot) {
  const c = camAt(a, [[0, 640, 620, 1.3], [1.8, 760, 610, 1.18], [2.7, 950, 600, 1.1], [4.64, 950, 600, 1.12]]), G = 1000, B = [340, G], K = [1150, G], T = [1580, G], HK = 1.6;
  const top = (x) => [x, G - 292 * HK - 180], launch = 2.64, arrive = 3.55;
  const fly = (to, j) => { const p = ease(seg(a, launch + j * 0.02, arrive)), b = bez(top(B[0]), [(B[0] + to[0]) / 2, -60], top(to[0]), p); return { b, p }; };
  let cards = "", trail = "";
  const glow = a > 2.07 ? 1 : 0, own = at(top(B[0])[0], top(B[0])[1] + 6 * Math.sin(tot * 2), fileCard(money100(), { glow }), 1.4 * pop(a + 0.3));
  if (a > 2.35) [K, T].forEach((h, j) => { const { b, p } = fly(h, j);
    for (let q = 1; q <= 6; q++) { const pp = Math.max(0, p - q * 0.035); if (pp <= 0 || p >= 1) continue; const bb = bez(top(B[0]), [(B[0] + h[0]) / 2, -60], top(h[0]), pp); trail += `<circle cx="${bb[0].toFixed(1)}" cy="${bb[1].toFixed(1)}" r="${(10 - q).toFixed(1)}" fill="${P.gold}" opacity="${(0.7 - q * 0.1).toFixed(2)}"/>`; }
    const split = a < launch ? spring(a - 2.35, 8, 13) : 1;
    cards += at(b[0] + (a < launch ? (j ? 60 : 30) * split : 0), b[1] + (a < launch ? -20 * split : 0), fileCard(money100(), { glow: 1 }), 1.4 * (p < 1 ? 1 : 1 + 0.15 * Math.exp(-(a - arrive) * 8) * Math.cos((a - arrive) * 14))); });
  const lit = (t0) => (a > t0 ? [1, 1, 1] : [0, 0, 1]), hop = (t0) => (a > t0 ? 1 + 0.06 * Math.exp(-(a - t0) * 7) * Math.cos((a - t0) * 14) : 1);
  const glowH = (x) => (a > arrive ? rings(x, G - 200, 260 * spring(a - arrive, 7, 11), P.win, 0.14, 1.3) : "");
  // the same instant, said with one tick: a clock over the middle whose hand stops on the same mark as both arrive
  const clk = a > 3.7 ? at(745, 420, `<circle r="70" fill="${P.cream}"/><circle r="70" fill="none" stroke="${P.creamD}" stroke-width="10"/><path d="M0 0L0 -50" stroke="${P.ink}" stroke-width="10" stroke-linecap="round" transform="rotate(${(60 * spring(a - 3.7, 10, 18)).toFixed(1)})"/><circle r="9" fill="${P.ink}"/>`, pop(a - 3.7)) : "";
  const main = `<rect x="-600" y="${G}" width="3200" height="500" fill="${P.ground}"/>` + glowH(K[0]) + glowH(T[0]) + at(B[0], G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), HK) + at(K[0], G, house(P.pink, P.pinkD, { lit: lit(arrive) }), [HK, HK * hop(arrive)]) + at(T[0], G, house(P.teal, P.tealD, { lit: lit(arrive) }), [HK, HK * hop(arrive)]) + trail + own + cards + clk;
  const g = room(c, tot) + layer(skyline(71, -500, 2500, G - 40, 120, 320, "#221a5c", "#ffb066"), c, 0.5) + layer(main, c);
  return { g, in: toScreen(c, top(B[0])[0], top(B[0])[1]), inC: P.gold, inZ: 16, out: toScreen(c, top(K[0])[0], top(K[0])[1]), outC: P.cream, outZ: 16 };
}
// ---- 3: two copies of one $100: ×2. Someone in the middle, with the book, says which one is real ----
function s3(a, tot) {
  const c = camAt(a, [[0, 840, 540, 1.0], [5.38, 840, 550, 1.04]]), L = [420, 330], R = [1260, 330], bad = seg(a, 0.3, 0.7), BX = 840, G = 1040, drop = a < 2.6 ? -1400 : lerp(-900, 0, easeIn(seg(a, 2.6, 2.95))), landed = a > 2.95 ? spring(a - 2.95, 8, 13) : 0;
  const red = (j) => (j === 0 && a > 4.09 ? 0 : bad), fill = (j) => mix(P.cream, "#ffd6da", red(j)), cD = (j) => mix(P.creamD, "#f0a3ab", red(j));
  const shake = (j) => (a > 0.3 && a < 1.3 ? 6 * Math.sin(a * 40 + j) * (1 - seg(a, 0.9, 1.3)) : 0);
  const gone = seg(a, 4.7, 5.2);
  const cards = [L, R].map((p, j) => at(p[0] + shake(j), p[1] + 6 * Math.sin(tot * 2 + j) + (j === 1 ? 400 * easeIn(gone) : 0), fileCard(money100(red(j) > 0.5 ? P.redD : "#1f7a48"), { c: fill(j), cD: cD(j), glow: red(j), glowC: P.red }), 1.4, j === 1 ? 30 * gone : 0)).join("");
  const x2 = a > 1.04 ? at(840, 330, `${disc(0, 0, 78, P.red, P.redD)}${text(0, 30, "×2", 80, "#fff")}`, 1.6 * pop(a - 1.04) * (1 - seg(a, 2.5, 2.7))) : "";
  // the bank comes down between them; its book rises; a ✓ for one copy, a ✗ for the other
  const bk = at(BX, G + drop, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1] }), [0.7 * (1 + 0.06 * (1 - landed) * (a > 2.95 ? 1 : 0)), 0.7 * (1 - 0.06 * (1 - landed) * (a > 2.95 ? 1 : 0))]);
  const br = seg(a, 3.3, 3.75), bookY = lerp(G - 120, 640, ease(br)), theBook = br > 0 ? at(BX, bookY, (br >= 1 ? rings(0, 0, 200, P.gold, 0.14) : "") + book(rows("100", null)), 1.25 * (0.6 + 0.4 * ease(br))) : "";
  const lines = br >= 1 ? drawn(`M${BX - 120} 580Q${(BX + L[0]) / 2} 470 ${L[0]} ${L[1] + 220}`, seg(a, 3.8, 4.1), P.green, 6, 'stroke-dasharray="4 16"') + drawn(`M${BX + 120} 580Q${(BX + R[0]) / 2} 470 ${R[0]} ${R[1] + 220}`, seg(a, 4.3, 4.6), P.red, 6) : "";
  const marks = check(L[0] + 170, L[1] - 200, 60, P.green, a - 4.09) + (gone < 1 ? cross(R[0] + 170, R[1] - 200 + 400 * easeIn(gone), 60, P.red, a - 4.56) : "");
  const g = room(c, tot) + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="${P.ground}"/>` + bk + lines + theBook + cards + x2 + marks, c);
  return { g, in: toScreen(c, R[0], R[1]), inC: P.cream, inZ: 16, out: toScreen(c, BX, G - 150 * 0.7), outC: P.ink, outZ: 20 };
}
// ---- 4: the 1990s: a room of old monitors with locks on their screens; a digital coin no one watches and no one stops ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 640, 1.55], [0.8, 960, 620, 1.4], [2.9, 960, 580, 1.28], [4.4, 1120, 440, 1.38], [5.3, 1130, 440, 1.4], [5.8, 960, 580, 1.28], [6.77, 960, 580, 1.3]]), G = 980, CO = [960, 480];
  const crt = (x, y, k, i) => { const on = a > 0.3 + i * 0.12, lk = a - 0.6 - i * 0.12, scr = on ? "#0f3b2a" : P.ink;
    let code = ""; if (on) for (let r = 0; r < 5; r++) { const w = 40 + rnd(i * 31 + r + Math.floor(tot * 3 + i)) * 120; code += `<rect x="-130" y="${-210 + r * 26}" width="${w.toFixed(0)}" height="12" rx="6" fill="#3ddc97" opacity=".55"/>`; }
    return at(x, y, `${two(rr(-190, -300, 380, 300, 30), "#c9c2a8", "#a8a088", 0, 12)}<path d="${rr(-160, -270, 320, 220, 26)}" fill="${scr}"/>${code}${on ? rings(0, -160, 150, "#3ddc97", 0.08) : ""}
      ${lk > 0 ? at(70, -110, padlock(0.55, 0, P.green, P.greenD), pop(lk)) : ""}${two(rr(-140, 0, 280, 40, 8), "#c9c2a8", "#a8a088", 0, 8)}<path d="${rr(-120, 6, 240, 10, 4)}" fill="#8a8470"/>`, k); };
  const desk = `<rect x="-500" y="${G - 120}" width="3000" height="40" fill="${P.wood}"/><rect x="-500" y="${G - 80}" width="3000" height="400" fill="${P.woodD}"/>`;
  const mons = crt(260, G - 160, 1.0, 0) + crt(660, G - 140, 0.85, 1) + crt(1260, G - 140, 0.85, 2) + crt(1660, G - 160, 1.0, 3);
  // the coin is made of what the screens send it
  const made = a > 3.0 ? spring(a - 3.0, 7, 11) : 0, feeds = a > 2.6 && a < 3.6 ? [[260, G - 360], [660, G - 330], [1260, G - 330], [1660, G - 360]].map((p, i) => { const u = seg(a, 2.6 + i * 0.05, 3.1 + i * 0.05); return [0, 1, 2].map((q) => { const v = clamp(u - q * 0.15), b = bez(p, [(p[0] + CO[0]) / 2, 200], CO, v); return v > 0 && v < 1 ? `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="10" fill="#3ddc97"/>` : ""; }).join(""); }).join("") : "";
  const roll = ease(seg(a, 6.2, 6.77)) * 160, theCoin = made > 0 ? at(CO[0] + roll, CO[1] + 8 * Math.sin(tot * 2), `${rings(0, 0, 210, P.gold, 0.2)}${coin(150)}<path d="M-50 -30h30v-30M50 30h-30v30M-50 30h20M50 -30h-20" stroke="${P.goldD}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-20" cy="-60" r="9" fill="${P.goldD}"/><circle cx="20" cy="60" r="9" fill="${P.goldD}"/>`, made, roll * 0.9) : "";
  // a watching camera on the wall turns to it; its eye shuts
  const turn = kf(a, [[3.6, -30], [4.3, 22], [4.9, 22]]), shut = ease(seg(a, 4.9, 5.25)), cam = at(1420, 250, `<path d="M0 -40V-160" stroke="${P.steelD}" stroke-width="16"/><g transform="rotate(${turn})">${two(rr(-150, -50, 220, 100, 18), P.steel, P.steelD, 0, 10)}<circle cx="-150" cy="0" r="44" fill="${P.ink}"/><circle cx="-150" cy="0" r="${(26 * (1 - shut)).toFixed(1)}" fill="${P.red}"/>${shut > 0 ? `<path d="M-194 0a44 44 0 0 1 88 0Z" fill="${P.steelD}" transform="translate(-150 0) scale(1 ${shut.toFixed(3)}) translate(150 0)"/><path d="M-194 0a44 44 0 0 0 88 0Z" fill="${P.steelD}" transform="translate(-150 0) scale(1 ${shut.toFixed(3)}) translate(150 0)"/>` : ""}</g>`, 1.5);
  // and the barrier in front of it lifts by itself
  const up = a < 5.83 ? 0 : spring(a - 5.83, 7, 11), bar = at(620, 760, `<rect x="-20" y="0" width="40" height="${G - 880 + 120}" fill="${P.ink}"/><g transform="rotate(${(-78 * up).toFixed(1)})"><path d="${rr(0, -18, 700, 36, 18)}" fill="#fff"/>${[0, 1, 2, 3].map((i) => `<path d="${rr(60 + i * 160, -18, 80, 36, 0)}" fill="${P.red}"/>`).join("")}</g><circle r="34" fill="${P.steel}"/>`);
  const cal = a > 0.19 ? at(470, 300, calPage("1990s", "", 0.8, 150), pop(a - 0.19)) : "";
  const g = `<rect width="1920" height="1080" fill="#170c3b"/>` + layer(`<rect x="-500" y="-300" width="3000" height="1500" fill="#22135a"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${-400 + i * 480} -300V1000" stroke="#1b0f4a" stroke-width="30"/>`).join("")}`, c, 0.5) + layer(cal + cam + desk + mons + feeds + theCoin + bar, c);
  return { g, in: toScreen(c, 660, G - 300), inC: P.ink, inZ: 18, out: toScreen(c, CO[0] + roll, CO[1]), outC: P.gold, outZ: 18 };
}
// ---- 5: a little digital-money company lights up; in 1998 it shuts, and its wallet is empty ----
function s5(a, tot) {
  const c = camAt(a, [[0, 820, 170, 2.6], [0.8, 860, 500, 1.0], [5.0, 860, 520, 1.04], [5.7, 1110, 870, 2.3], [7.28, 1120, 880, 2.45]]), G = 980, TX = 820, TK = 1.15;
  const on = (i) => (a > 2.24 + i * 0.06 && a < 3.74 + i * 0.03 ? 1 : 0), dim = seg(a, 3.74, 4.0), fall = easeIn(seg(a, 4.31, 4.85)), signA = 1 - dim;
  let win = ""; for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) { const i = r * 3 + q; win += `<rect x="${-120 + q * 90}" y="${-560 + r * 90}" width="60" height="60" rx="8" fill="${on(i) ? P.win : P.ink}"/>`; }
  const sign = at(fall > 0 ? -210 * fall : 0, -700 + 640 * fall * fall, `${rings(0, 0, 130, P.gold, 0.25 * signA * (a > 2.24 ? 1 : 0.3))}${disc(0, 0, 90, mix(P.gold, "#8a86a8", dim), mix(P.goldD, "#6b6790", dim))}${text(0, 34, "D", 100, mix("#8a5200", "#4a4670", dim))}`, 1, -90 * fall);
  const lock = a > 3.95 ? at(0, -120, padlock(1.0), pop(a - 3.95)) : "";
  const tower = at(TX, G, `${two(rr(-170, -620, 340, 620, 10), P.violet, P.violetD, 16, 0)}${two(rr(-190, -650, 380, 40, 8), P.violetD, P.ink, 0, 8)}<rect x="-6" y="-700" width="12" height="60" fill="${P.ink}"/>${win}<path d="M-60 0V-180H60V0Z" fill="${P.ink}"/>${a > 3.9 ? `<path d="M-60 0V-180H60V0Z" fill="#5d678f"/>` : ""}${lock}`, TK) + (fall < 1 ? at(TX, G, sign, TK) : at(TX - 210 * TK, G - 60 * TK, `${disc(0, 0, 90, "#8a86a8", "#6b6790")}${text(0, 34, "D", 100, "#4a4670")}`, TK, -90));
  const cal = a > 0.75 ? at(1340, 260, (a < 4.03 ? calPage("1989", "", 1, 150) : calPage("1998", "", 1, 150)) + (a > 4.03 && a < 4.4 ? calFlip("1989", "", seg(a, 4.03, 4.35), 150) : ""), 1.05 * pop(a - 0.75)) : "";
  // the wallet on the step: shut; it opens on nothing, a moth flies out
  const o2 = a < 5.6 ? 0 : spring(a - 5.6, 8, 13), mu = a - 6.25, lining = "#6a3f20";
  const half = (inner) => `${two(rr(0, -60, 110, 120, 14), P.wood, P.woodD, 0, 6)}<path d="${rr(6, -52, 98, 104, 10)}" fill="${lining}"/>${inner}`;
  const moth = mu > 0 ? at(20 + 50 * Math.sin(mu * 3.1), -70 - 80 * mu + 10 * Math.sin(mu * 9), `<ellipse rx="5" ry="10" fill="#8a7a66"/><path d="M0 -3L-20 ${-14 + 10 * Math.sin(a * 40)}L-16 9ZM0 -3L20 ${-14 + 10 * Math.sin(a * 40)}L16 9Z" fill="#e3d2b2"/>`, clamp(mu / 0.2)) : "";
  const web = `<g opacity=".85">${[[70, 14], [60, 50], [30, 66]].map((e, i) => drawn(`M14 -40L${14 + e[0]} ${-40 + e[1]}`, (a - 5.7 - i * 0.08) * 3, "#cfc6ff", 2.5)).join("")}</g>`;
  const wallet = at(1120, G - 6, `<ellipse cx="0" cy="62" rx="${(120 + 60 * o2).toFixed(1)}" ry="8" fill="#1d0f45" opacity=".6"/><g transform="translate(0 0) scale(-1 1)">${half("")}</g>${o2 > 0 ? `<g transform="scale(${Math.max(0.02, o2).toFixed(4)} 1)">${half(`<path d="${rr(12, -40, 86, 80, 8)}" fill="${P.night0}"/>${web}`)}</g>` : `<g transform="scale(-1 1)">${two(rr(0, -60, 110, 120, 14), "#b87644", P.wood, 0, 6)}${disc(94, 0, 9, P.gold, P.goldD)}</g>`}${moth}`, 1, 0);
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(59, 70, -300, 2300, 800, tot), c, 0.15) + layer(skyline(83, -500, 2500, G - 20, 100, 300, "#221a5c", "#ffb066"), c, 0.5)
    + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="#141a45"/><rect x="-500" y="${G}" width="3000" height="10" fill="#2c366f"/>` + tower + cal + wallet, c);
  return { g, in: toScreen(c, TX, G - 700 * TK), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const copySet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
