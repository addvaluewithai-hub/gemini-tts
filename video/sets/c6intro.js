// Crypto part 6, intro: two wordless shots (shots.md, scene intro).
//   0 the hype and the law: a carnival tent of coins at night, a gavel and a rule book slam down beside it, and
//     part 5's vending machine (a smart contract) drops a fresh coin in a second
//   1 twenty million coins pour out under a rolling counter; three step forward: a framed picture, the dog coin and a
//     coin on a podium with a flag
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6intro.v.js";
import { P, mix, house, coin, stars, skyline } from "./bank.js";
import { frame, dogCoin, podium } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 3200, 1080, tot), c, 0.15);
const G = 880;
const town = (c, seed = 31) => layer(skyline(seed, -900, 3400, G - 30, 120, 320, P.far), c, 0.4) + layer(skyline(seed + 36, -900, 3400, G, 80, 230, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-1000" y="${G}" width="4600" height="700" fill="${P.ground}"/>`, c);

// a striped carnival tent, 520 wide, base on y = 0, with a flag and a string of bulbs; t blinks the bulbs
const tent = (t = 0) => { let stripes = ""; for (let i = 0; i < 8; i++) { const x0 = -260 + i * 65; stripes += `<path d="M${x0} 0L${x0 + 30} -300L${x0 + 65 + 30} -300L${x0 + 65} 0Z" fill="${i % 2 ? P.cream : P.red}"/>`; }
  const roof = `<path d="M-300 -300L0 -470L300 -300Z" fill="${P.redD}"/>${[-200, -100, 0, 100, 200].map((x, i) => `<path d="M${x - 50} -300q50 50 100 0" fill="${i % 2 ? P.cream : P.red}"/>`).join("")}`;
  const bulbs = Array.from({ length: 13 }, (_, i) => { const x = -300 + i * 50, y = -300 - 170 * (1 - Math.abs(x) / 300) + 10; return `<circle cx="${x}" cy="${y.toFixed(0)}" r="9" fill="${(i + Math.floor(t * 4)) % 3 ? P.gold : "#fff3c2"}"/>`; }).join("");
  return `${stripes}${roof}${bulbs}<path d="M0 -470v-80" stroke="${P.ink}" stroke-width="8"/><path d="M0 -550l70 22l-70 22Z" fill="${P.gold}"/><path d="M-60 0V-150a60 60 0 0 1 120 0V0Z" fill="${P.ink}"/>`; };
// a rule book, closed, standing; 220 x 280, base on y = 0
const ruleBook = () => `${two(rr(-110, -280, 220, 280, 14), "#3c5bb0", "#2c4590", 0, 10)}<path d="${rr(-90, -262, 18, 250, 6)}" fill="#24346f"/>${[0, 1, 2].map((i) => `<path d="M-40 ${-200 + i * 50}h110" stroke="#9fb0ff" stroke-width="12" stroke-linecap="round"/>`).join("")}${disc(20, -60, 26, P.gold, P.goldD)}`;
// a gavel on its block; hit 0..1 brings the head down (pivot at the hand end of the handle)
const gavel = (hit = 0) => `<path d="${rr(-120, -26, 240, 26, 10)}" fill="${P.woodD}"/><g transform="rotate(${(-38 * (1 - ease(hit))).toFixed(1)} 200 -60)"><path d="M200 -60L-10 -60" stroke="${P.wood}" stroke-width="22" stroke-linecap="round"/>${two(rr(-90, -120, 140, 80, 18), P.wood, P.woodD, 0, 8)}<path d="${rr(-100, -110, 20, 60, 6)}" fill="${P.gold}"/><path d="${rr(40, -110, 20, 60, 6)}" fill="${P.gold}"/></g>`;
// part 5's vending machine (a smart contract), 260 wide, base on y = 0; `drop` 0..1 a coin falling to the tray
const vending = (drop = -1, t = 0) => `${two(rr(-130, -440, 260, 440, 18), P.violet, P.violetD, 0, 10)}<path d="${rr(-104, -410, 140, 240, 10)}" fill="#141038"/>${[0, 1, 2].map((r) => [0, 1].map((cc) => at(-70 + cc * 70, -360 + r * 75, coin(24, ""))).join("")).join("")}
  <path d="${rr(56, -400, 52, 120, 8)}" fill="#24346f"/><path d="${rr(70, -380, 24, 10, 4)}" fill="${P.ink}"/>${disc(82, -320, 12, P.green, P.greenD)}<path d="${rr(-104, -130, 210, 70, 10)}" fill="${P.ink}"/>${drop >= 0 ? at(0, lerp(-170, -90, easeOut(drop)), coin(28, "B")) : ""}`;

// ---- 0: the hype and the law ----
function s0(a, tot) {
  const TX = 700, GX = 1260, VX = 1680, c = camAt(a, [[0, 720, 640, 1.5], [1.15, 820, 640, 1.42], [1.9, 1020, 650, 1.42], [3.3, 1100, 650, 1.42], [3.9, 1480, 660, 1.5], [5.25, 1600, 660, 1.62]]);
  // the crowd of little houses round the tent, coins bouncing over it
  let crowd = ""; [[-260, P.blue, P.blueD], [-130, P.pink, P.pinkD], [140, P.teal, P.tealD], [270, P.violet, P.violetD], [-380, P.gold, P.goldD], [390, P.blue, P.blueD]].forEach(([dx, col, colD], i) => {
    crowd += at(TX + dx, G + 4, house(col, colD, { lit: [1, 1, 1] }), 0.42 * pop(a - 0.2 - i * 0.06), Math.sin(tot * 6 + i) * 3); });
  let hype = ""; for (let i = 0; i < 9; i++) { const ph = (tot * 1.3 + i * 0.37) % 1, x = TX - 300 + i * 75, y = G - 400 - 150 * Math.sin(Math.PI * ph); if (a > 0.8 + i * 0.05) hype += at(x, y, coin(26, "B"), pop(a - 0.8 - i * 0.05)); }
  const glow = a > 0.9 ? rings(TX, G - 300, 380, P.gold, 0.1 + 0.05 * Math.sin(tot * 6)) : "";
  // the law: the rule book drops and the gavel strikes
  const bk = a > 1.3 ? at(GX - 140, G - 260 * (1 - easeOut(seg(a, 1.3, 1.6))), ruleBook(), 1) : "";
  const hit = seg(a, 1.45, 1.62), struck = a > 1.62 ? rings(GX + 60, G - 30, 160 * spring(a - 1.62, 6, 10), P.cream, 0.25 * (1 - seg(a, 1.7, 2.3))) : "";
  const gv = a > 1.1 ? at(GX + 90, G, gavel(hit), 1.0 * pop(a - 1.1)) : "";
  // the vending machine drops a coin in a second
  const vm = a > 3.2 ? at(VX, G, vending(a > 4.1 ? seg(a, 4.1, 4.45) : -1, tot), 0.9 * pop(a - 3.2)) : "";
  const fresh = a > 4.45 ? at(VX, G - 70 * 0.9 - 140 * easeOut(seg(a, 4.45, 4.9)), rings(0, 0, 70, P.gold, 0.3) + coin(46, "B"), pop(a - 4.45)) : "";
  const g = night(c, tot, 21) + town(c, 23) + layer(glow + at(TX, G, tent(tot), 1.0 * pop(a - 0.05, 7, 12)) + crowd + hype + bk + gv + struck + vm + fresh, c);
  return { g, out: toScreen(c, VX, G - 63 - 140), outC: P.gold, outZ: 20 };
}

// ---- 1: twenty million coins, and three of them step forward ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [4.7, 960, 540, 1.05]]);
  // the counter rolls to 20,000,000 while coins rain into a heap
  const n = Math.round(20000000 * easeOut(seg(a, 0.3, 1.1))), num = n.toLocaleString("en");
  const counter = at(FW < FH ? FW / 2 : 960, 150, `<path d="${rr(-330, -70, 660, 110, 22)}" fill="${P.ink}" opacity=".7"/>${text(0, 20, num, 90, P.gold)}`, pop(a - 0.1));
  let rain = ""; for (let i = 0; i < 46; i++) { const sp = 0.6 + rnd(i * 3) * 0.6, ph = ((tot * sp + rnd(i * 7)) % 1), x = 120 + rnd(i * 11) * 1680, y = -60 + ph * 980; if (a > 0.2 + rnd(i) * 0.6 && a < 2.4 + rnd(i * 5)) rain += at(x, y, coin(18 + rnd(i * 13) * 10, ""), 1, ph * 360); }
  let heap = ""; const hh = 140 * easeOut(seg(a, 0.3, 1.6)); for (let i = 0; i < 70; i++) { const t = rnd(i * 17), x = 960 + (rnd(i * 23) - 0.5) * 1500 * (1 - t * 0.6), y = G - t * hh; heap += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="26" ry="10" fill="${i % 3 ? P.gold : P.goldD}"/>`; }
  // three of them step forward
  const fr = a > 2.05 ? at(450, 540, rings(0, 0, 280, P.gold, 0.14) + frame(320, 270, { ape: 1 }), pop(a - 2.05)) : "";
  const dog = a > 2.85 ? at(960, 540, rings(0, 0, 250, P.gold, 0.16) + dogCoin(180), pop(a - 2.85), 8 * Math.sin(tot * 3)) : "";
  const pod = a > 3.8 ? at(1470, 820, podium(), 1.5 * pop(a - 3.8)) : "";
  const g = night(c, tot, 27) + town(c, 41) + layer(heap + rain + fr + dog + pod, c) + counter;
  return { g, in: [960, 540], inC: P.gold, inZ: 20 };
}

const SHOTS = [s0, s1];
export const c6introSet = makeSet(SHOTS, V, P);
