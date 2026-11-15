// Crypto part 6, the human dictionary: two shots (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md, s8).
//   0 ALTCOIN: the gold bitcoin on one side, a swarm of every other coin on the other
//   1 the swarm's counter 20,000,000; AIRDROP: free coins parachute onto a fishhook line that drags a house along
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s8.v.js";
import { house, stars, skyline } from "./bank.js";
import { P, mix, coin, dogCoin } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 3000, 1080, tot), c, 0.15);
const G = 900;
const ground = (c) => layer(`<rect x="-1200" y="${G}" width="4400" height="800" fill="${P.ground}"/>`, c);
const label = (w, a, x, y = 120) => a > 0 ? at(x ?? FW / 2, y, `<path d="${rr(-(w.length * 34 + 60) / 2, -64, w.length * 34 + 60, 100, 22)}" fill="${P.gold}"/>${text(0, 14, w, 76, P.ink)}`, pop(a)) : "";
// a small odd coin of the swarm: its own colour and mark
const COLS = [[P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD], [P.blue, P.blueD], [P.green, P.greenD], [P.red, P.redD], ["#9fb0ff", "#7f90e0"]];
const odd = (i, r = 34) => { const [c, cD] = COLS[i % COLS.length], m = i % 4;
  return `${disc(0, 0, r, c, cD)}${m === 0 ? `<path d="M${-r * 0.4} ${r * 0.3}L0 ${-r * 0.45}L${r * 0.4} ${r * 0.3}Z" fill="#fff"/>` : m === 1 ? `<circle r="${r * 0.35}" fill="none" stroke="#fff" stroke-width="${r * 0.14}"/>` : m === 2 ? `<path d="M${-r * 0.4} 0h${r * 0.8}M0 ${-r * 0.4}v${r * 0.8}" stroke="#fff" stroke-width="${r * 0.16}"/>` : `<rect x="${-r * 0.3}" y="${-r * 0.3}" width="${r * 0.6}" height="${r * 0.6}" fill="#fff" transform="rotate(45)"/>`}`; };
const SW = Array.from({ length: 46 }, (_, i) => [1050 + rnd(i * 7 + 3) * 760, 230 + rnd(i * 7 + 4) * 560, rnd(i * 7 + 5)]);
const swarm = (a, t0, tot) => SW.map(([x, y, r], i) => { const age = a - t0 - r * 0.9; if (age <= 0) return ""; return at(x + 8 * Math.sin(tot * 2 + i), y + 8 * Math.cos(tot * 1.7 + i), i === 7 ? dogCoin(34) : odd(i, 30 + 10 * rnd(i)), pop(age)); }).join("");

// ---- 0: ALTCOIN ----
function s0(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.25], [2.0, 900, 540, 1.25], [3.99, 1080, 540, 1.1]]);
  const btc = at(560, 520, rings(0, 0, 200, P.gold, 0.16) + coin(150, "B"), pop(a - 0.2));
  const line = a > 2.3 ? `<path d="M840 220V820" stroke="${P.cream}" stroke-width="6" stroke-dasharray="20 16" opacity="${seg(a, 2.3, 2.6).toFixed(2)}"/>` : "";
  const g = night(c, tot, 61) + layer(skyline(71, -800, 3000, G - 20, 60, 180, "#1f1652", "#ffb066"), c, 0.45) + ground(c) + layer(btc + line + swarm(a, 2.4, tot), c) + label("ALTCOIN", a - 1.85);
  return { g, out: toScreen(c, 1430, 520), outC: "#2a1d66", outZ: 14 };
}

// ---- 1: 20,000,000 of them; AIRDROP: free coins on a fishhook ----
function s1(a, tot) {
  const c = camAt(a, [[0, 1180, 520, 1.15], [1.9, 1150, 520, 1.1], [3.0, 1100, 600, 1.25], [5.25, 1220, 600, 1.25]]);
  const n = Math.round(20000000 * ease(seg(a, 0.6, 1.4))), cnt = a > 0.5 ? at(1430, 300, `<path d="${rr(-260, -60, 520, 100, 24)}" fill="${P.ink}" opacity=".85"/>${text(0, 22, n.toLocaleString("en"), 70, P.gold)}`, pop(a - 0.5)) : "";
  const fade = 1 - seg(a, 1.8, 2.4), sw = fade > 0 ? `<g opacity="${fade.toFixed(2)}">${swarm(10, 0, tot)}</g>` : "";
  // AIRDROP: free coins parachute down onto a fishhook hanging from a line; the house goes for them and is reeled in
  const reel = ease(seg(a, 4.0, 4.9)), hx = lerp(1180, 1560, reel), hy = lerp(560, 470, reel);
  let chutes = "";
  [[860, 2.55], [1020, 2.75], [1340, 2.95], [1500, 3.15]].forEach(([x, t0], i) => { if (a < t0) return; const p = easeOut(seg(a, t0, t0 + 0.8)), tx = hx + (i - 1.5) * 34, ty = hy + 90 + (i % 2) * 26;
    const px = lerp(x, tx, p), py = lerp(-140, ty, p), chute = p < 0.98 ? `<path d="M-80 -120Q0 -210 80 -120Z" fill="${[P.pink, P.teal, P.violet, P.blue][i]}"/><path d="M-80 -120L-22 -36M80 -120L22 -36" stroke="${P.cream}" stroke-width="5"/>` : "";
    chutes += at(px + (p < 1 ? 20 * Math.sin(a * 3 + i) * (1 - p) : 0), py, chute + odd(i, 38)); });
  const hook = a > 2.4 ? `<path d="M${hx} ${hy}L${hx + 520} -200" stroke="${P.cream}" stroke-width="5"/>${at(hx, hy, `<path d="M0 0V80a40 40 0 0 1 -80 0" fill="none" stroke="${P.steel}" stroke-width="13" stroke-linecap="round"/><path d="M-80 80l-14 -24" stroke="${P.steel}" stroke-width="13" stroke-linecap="round"/>`)}` : "";
  const walk = ease(seg(a, 3.6, 4.0)), hsx = lerp(560, 900, walk) + 380 * reel;
  const hs = at(hsx, G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), 1.0, reel > 0 && reel < 1 ? 6 * Math.sin(a * 30) : 0) + (reel > 0 ? `<path d="M${hsx + 60} ${G - 200}L${hx - 40} ${hy + 120}" stroke="${P.cream}" stroke-width="4" stroke-dasharray="10 8"/>` : "");
  const g = night(c, tot, 67) + layer(skyline(73, -800, 3000, G - 20, 60, 180, "#1f1652", "#ffb066"), c, 0.45) + ground(c) + layer(sw + cnt + hs + hook + chutes, c) + label("AIRDROP", a - 2.15);
  return { g, in: [1430, 520], inC: "#2a1d66", inZ: 14 };
}

const SHOTS = [s0, s1];
export const c6s8Set = makeSet(SHOTS, V, P);
