// Crypto part 5, s2 "code is law": six wordless shots (shots.md, scene s2).
//   0 a code case: its bars run one by one under a playhead, and the red (wrong) bar runs just the same
//   1 2016: a vault-sized contract machine with a cracked bar; a pipe opens and coins drain into a sack: $60,000,000
//   2 close on the machine: nothing broken, a tick; a magnifier reads the cracked bar (host right)
//   3 laptops round the book look at each other: "?"
//   4 the book's pages riffle backwards; part 2's chain forks into a Y, with a little table fork
//   5 both branches keep growing pages side by side; a stone tablet CODE = LAW rises between them (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c5s2.v.js";
import { P, mix, coin, stars, skyline, pill } from "./bank.js";
import { laptop, calPage } from "./props.js";
import { book, bookGears, vending, codeBars } from "./c5props.js";
import { page, link } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const G = 900;
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 1080, tot), c, 0.15);
const town = (c, seed = 41) => layer(skyline(seed, -800, 2800, G - 20, 120, 300, P.far), c, 0.4) + layer(skyline(seed + 36, -800, 2800, G, 80, 220, P.mid, "#ffb066"), c, 0.7) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>`, c);
const cal = (big, a, x, y, k = 0.6) => (a > 0 ? at(x, y, calPage(big, "", 1, 140), k * pop(a), 5) : "");
const fmt = (v) => Math.round(v).toLocaleString("en");
const mag = (k = 1) => at(0, 0, `<circle r="46" fill="#cfe9ff" opacity=".35" stroke="${P.steel}" stroke-width="12"/><path d="M34 34l56 56" stroke="${P.steelD}" stroke-width="18" stroke-linecap="round"/>`, k);

// ---- 0: the code runs exactly as written, even the wrong line ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.2], [2.6, 960, 580, 1.25], [3.89, 960, 600, 1.35]]);
  const run = a < 2.3 ? seg(a, 0.6, 2.25) * (4 / 6) : lerp(4 / 6, 5.2 / 6, seg(a, 2.9, 3.5));
  const bad = a > 2.9 && a < 3.89 ? rings(960, 380 + 4 * 52.7, 260, P.red, 0.18 * Math.min(1, (a - 2.9) * 4)) : "";
  const panel = `<path d="${rr(560, 300, 800, 520, 26)}" fill="#0e1240"/><path d="${rr(540, 280, 840, 560, 30)}" fill="none" stroke="#cfe9ff" stroke-width="10" opacity=".25"/>${at(640, 380, codeBars(6, 420, { seed: 11, bad: 4, run }), 1.55)}`;
  const head = at(620, 380 + Math.min(5, Math.floor(run * 6)) * 52.7, `<path d="M-40 -20L0 0L-40 20Z" fill="${P.gold}"/>`, 1);
  const g = night(c, tot, 41) + layer(bad + panel + head, c);
  return { g, out: toScreen(c, 960, 560), outC: "#0e1240", outZ: 18 };
}

// ---- 1: 2016, a contract with a flaw is drained: $60,000,000 ----
const BIG = [760, G];
function drainScene(t, c, tot) {
  const crack = seg(t, 2.2, 2.6), flow = seg(t, 2.9, 5.1);
  const machine = at(BIG[0], BIG[1], vending({ light: t > 2.4 ? "no" : "ok", c: "#5b3aa6", cD: "#45297f", bad: 2 }), 1.55);
  const crackL = crack > 0 ? drawn(`M${BIG[0] + 108 * 1.55 - 20} ${BIG[1] - 210 * 1.55}l14 10l-10 12l16 8`, crack, P.ink, 5) : "";
  const pipe = flow > 0 ? `<path d="M${BIG[0] + 120} ${BIG[1] - 160}C${BIG[0] + 360} ${BIG[1] - 160} ${BIG[0] + 420} ${BIG[1] - 60} ${BIG[0] + 600} ${BIG[1] - 60}" fill="none" stroke="${P.steel}" stroke-width="34" pathLength="1" stroke-dasharray="${Math.min(1, flow * 4).toFixed(3)} 1"/>` : "";
  let coins = ""; if (flow > 0.15) for (let i = 0; i < 7; i++) { const u = ((t * 1.6 + i / 7) % 1); coins += at(lerp(BIG[0] + 140, BIG[0] + 600, u), BIG[1] - 160 + 100 * Math.sin(u * Math.PI / 2), coin(18, ""), 1); }
  const sackK = 0.6 + 0.6 * flow, sack = flow > 0 ? at(BIG[0] + 720, BIG[1], `${two("M-110 0Q-140 -150 -60 -200L-40 -230H40L60 -200Q140 -150 110 0Z", P.ink, "#120a2e", 0, 8)}<path d="M-50 -230q50 -30 100 0" stroke="${P.gold}" stroke-width="10" fill="none"/>`, sackK) : "";
  const counter = t > 2.9 ? at(BIG[0] + 640, 300, `<path d="${rr(-360, -70, 720, 130, 24)}" fill="${P.ink}"/>${text(0, 26, "$" + fmt(60000000 * ease(flow)), 86, P.red)}`, pop(t - 2.9)) : "";
  return night(c, tot, 43) + town(c, 121) + layer(machine + crackL + pipe + coins + sack + counter + cal("2016", t - 0.2, 300, 300, 0.7), c);
}
function s1(a, tot) { const c = camAt(a, [[0, 760, 520, 1.1], [2.4, 800, 520, 1.15], [3.2, 1080, 520, 0.98], [5.51, 1100, 510, 1.0]]);
  return { g: drainScene(a, c, tot), in: [960, 540], inC: "#0e1240", inZ: 18 }; }

// ---- 2: nothing was broken; he just read the contract better (host right) ----
function s2(a, tot, s) { const T = ((s.ends || [])[1] || 5.51) + a;
  const c = camAt(a, [[0, 760, 400, 1.6], [1.1, 860, 420, 1.85], [2.42, 880, 420, 1.95]]);
  const ok = check(BIG[0] - 60, BIG[1] - 620, 44, P.green, a - 0.3);
  const read = seg(a, 1.3, 2.0), mx = lerp(BIG[0] + 330, BIG[0] + 170, ease(read)), my = BIG[1] - 380;
  const g = drainScene(T, c, tot) + layer(ok + (a > 1.2 ? at(mx, my, mag(1.1), pop(a - 1.2)) : ""), c);
  return { g, out: toScreen(c, BIG[0] + 168, BIG[1] - 330), outC: P.red, outZ: 20 };
}

// ---- 3: what did the humans do? ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.15], [1.12, 960, 520, 1.2]]);
  const BK = [960, 440];
  const L = [[520, 760, 0.35], [780, 840, 0.15], [1140, 840, -0.15], [1400, 760, -0.35]];
  const laps = L.map(([x, y, r], i) => at(x, y, laptop("#9fe7ff"), 0.6, r * 20 * Math.sin(a * 6 + i))).join("");
  const q = a > 0.45 ? at(960, 180, text(0, 0, "?", 200, P.gold), pop(a - 0.45)) : "";
  const g = night(c, tot, 45) + town(c, 131) + layer(at(BK[0], BK[1], bookGears({ spin: tot * 2 }), 1.2) + laps + q, c);
  return { g, in: [960, 540], inC: P.red, inZ: 20, out: toScreen(c, BK[0], BK[1]), outC: P.cream, outZ: 18 };
}

// ---- 4–5: the ledger rolled back; the chain forks into two, both still running; CODE = LAW ----
const pageAt = (x, y, k, seed) => at(x, y, page({ rows: [["blue", "pink", ""], ["teal", "violet", ""]], seal: seed, prev: seed - 1, block: 1 }), k);
function forkScene(t, c, tot, T5) {
  const u = t - T5;   // seconds into shot 5
  const riffle = t < 1.0 ? seg(t, 0.0, 0.9) : 1;
  let g = "";
  // the trunk: three pages linked; then a split at x 1000 into an upper and a lower branch
  const Y = 540, X0 = 300, DX = 230, K = 0.55;
  for (let i = 0; i < 3; i++) { g += pageAt(X0 + i * DX, Y, K, 3 + i); if (i) g += link(X0 + (i - 1) * DX + 72, Y, X0 + i * DX - 72, Y, P.gold, 1, 0.5); }
  const sp = ease(seg(t, 1.1, 1.6)), grow = (from) => Math.floor(clamp((u - from) / 0.6, 0, 2.4));
  const nTop = t > 1.2 ? 1 + grow(0.5) : 0, nBot = t > 1.2 ? 1 + grow(0.8) : 0;
  [[-1, nTop, P.gold], [1, nBot, P.pink]].forEach(([side, n, col]) => { for (let j = 0; j < n; j++) { const x = X0 + 2 * DX + (j + 1) * DX, y = Y + side * 190 * sp;
      const px = j ? X0 + 2 * DX + j * DX : X0 + 2 * DX, py = j ? y : Y;
      g += link(px + 72, py, x - 72, y, col, 1, 0.5) + pageAt(x, y, K * (j === 0 ? pop(t - 1.35) : j === n - 1 ? pop(u - 0.5 - (j - 1) * 0.6 - (side > 0 ? 0.3 : 0)) : 1), 6 + j + (side > 0 ? 10 : 0)); } });
  // the rewind: pages riffle with a backwards arrow over the trunk
  const rw = t < 1.1 ? at(X0 + DX, Y - 230, `<path d="M60 0A60 60 0 1 0 0 60" fill="none" stroke="${P.cream}" stroke-width="16" stroke-linecap="round"/><path d="M60 -26L60 22L22 0Z" fill="${P.cream}"/>`, pop(t), -360 * riffle) : "";
  const fork = t > 1.8 ? at(X0 + 2 * DX + 120, Y - 310, `<path d="M0 60V-10M-22 -10V-60M0 -10V-60M22 -10V-60M-22 -10H22" stroke="${P.steel}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M0 60v70" stroke="${P.steel}" stroke-width="14" stroke-linecap="round"/>`, pop(t - 1.8) * (u > 0 ? 1 - seg(u, 0, 0.4) : 1)) : "";
  const tab = u > 3.1 ? at(1740, Y + 60 + 240 * (1 - easeOut(seg(u, 3.1, 3.6))), `${two(rr(-150, -200, 300, 380, 30), "#8d93b8", "#6e7499", 0, 12)}${text(0, -70, "CODE", 76, P.ink)}${text(0, 10, "=", 76, P.ink)}${text(0, 90, "LAW", 76, P.ink)}`, 0.85) : "";
  return night(c, tot, 47) + layer(g + rw + fork + tab, c);
}
function s4(a, tot, s) { const T5 = (s.ends || [])[4] || 3.01;
  const c = camAt(a, [[0, 600, 540, 1.5], [1.0, 640, 540, 1.45], [3.01, 820, 540, 1.3]]);
  return { g: forkScene(a, c, tot, T5), in: [960, 540], inC: P.cream, inZ: 18 }; }
function s5(a, tot, s) { const T5 = (s.ends || [])[4] || 3.01;
  const c = camAt(a, [[0, 820, 540, 1.3], [2.6, 1050, 540, 1.05], [4.02, 1130, 540, 1.05]]);
  return { g: forkScene(T5 + a, c, tot, T5) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c5s2Set = makeSet(SHOTS, V, P);
