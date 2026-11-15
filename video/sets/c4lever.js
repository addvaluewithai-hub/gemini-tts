// Crypto part 4, scene "lever": leverage and liquidation. Eleven wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md), in the world of parts 1 to 3.
// Shots 0–5 are one plank under one camera (time runs on across them, like the planet in idea.js):
//   0 your small stack, $100
//   1 the exchange tower slides $900 of borrowed coins in: the plank carries $1,000
//   2 the line goes up 10%: +$100, your part doubles; a fishhook glints (host right)
//   3 the line goes down 10%: −$100, your part is gone
//   4 a red arm from the tower sweeps the stack off automatically: LIQUIDATED
//   5 the dial turns to 100×; the line moves 1% the wrong way and the plank snaps (host left)
// Then:
//   6 10 OCT 2025: the line runs and suddenly drops
//   7 row after row of little stacks stamped red, 1,500,000+
//   8 a wave washes away $19,000,000,000, while the coin's own line dips less than 15%
//   9 the trading floor: mostly bets on the line, a small corner of real buying and selling (host right)
//  10 the exchange takes a fee when the line goes up and when it goes down; a roulette wheel (host left)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c4lever.v.js";
import { stars, skyline } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, tower, dial } from "./c4props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2800) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1600, x1 = 5000) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="1200" fill="${fill}"/>`;
const far = (c, base = 860, seed = 31) => layer(skyline(seed, -900, 2900, base, 90, 260, "#2a1d66", "#ffb066"), c, 0.45);
const fmtN = (v) => Math.round(v).toLocaleString("en");
const pill = (t, size, fill, bg) => `<path d="${rr(-t.length * size * 0.27 - 22, -size * 0.86, t.length * size * 0.54 + 44, size * 1.12, size * 0.3)}" fill="${bg}"/>${text(0, 0, t, size, fill)}`;
const cal = (big, small, a, k = 0.62, rot = 6) => (a > 0 ? at(0, 0, calPage(big, small, 1, 150), k * pop(a), rot) : "");
const line = (pts, p, col = P.gold, w = 10) => { const n = pts.length - 1, u = clamp(p) * n, k = Math.floor(u), f = u - k, q = pts.slice(0, k + 1).concat(k < n ? [[lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)]] : []);
  return q.length < 2 ? "" : `<path d="${q.map((v, i) => `${i ? "L" : "M"}${v[0].toFixed(1)} ${v[1].toFixed(1)}`).join("")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`; };
// a stack of n flat coins at (0, 0) going up; gold for yours, blue for borrowed
const DY = 10;
const stack = (n, c = P.gold, cD = P.goldD, w = 56, dy = DY) => Array.from({ length: Math.max(0, Math.round(n)) }, (_, i) => `<ellipse cx="0" cy="${-12 - i * dy}" rx="${w}" ry="14" fill="${cD}"/><ellipse cx="0" cy="${-17 - i * dy}" rx="${w}" ry="14" fill="${i % 2 ? c : mix(c, "#ffffff", 0.15)}"/>`).join("");
const MINE = [P.gold, P.goldD], LENT = ["#9fb0ff", "#7f90e0"];

// ---- 0–5: one plank ----
const PX = 820, PY = 800, TX = 1700;
function plankWorld(t, c, tot, s) {
  const E = s.ends || [], T = [0]; for (let i = 0; i < 6; i++) T.push(T[i] + (E[i] || 3));
  const u = (k) => t - T[k];        // time since shot k began
  // your coins: 1 stack unit = $100 shown as 3 coins; borrowed: 27 coins for $900
  const gain = seg(u(2), 1.4, 2.0), loss = seg(u(3), 1.6, 2.4), up = seg(u(2), 0.5, 1.0), down = seg(u(3), 0.7, 1.2);
  const mineN = 3 + 3 * ease(gain) - 6 * ease(loss);
  const lentIn = seg(u(1), 0.9, 1.6), lentN = 27 * ease(lentIn);
  const sweep = seg(u(4), 0.5, 1.8), swept = u(4) > 0 ? ease(sweep) : 0;
  const snapA = seg(u(5), 3.4, 3.8), snapped = u(5) > 0 && snapA > 0;
  const tilt = (u(2) > 0 ? -0.15 * up : 0) + (u(3) > 0 ? 0.15 * up + 0.2 * down : 0) - (u(4) > 0 ? 0.05 : 0);
  // the price line behind, in a panel high up
  const lp = [[300, 330], [700, 330], [820, 330 - 70 * ease(up)], [1000, 330 - 70 * ease(up)], [1120, 330 - 70 * ease(up) + 140 * ease(down)], [1400, 330 - 70 * ease(up) + 140 * ease(down)]];
  let g = `${two(rr(240, 170, 1220, 300, 22), "#2c1f63", "#1b1550", 0, 10)}${line(lp, seg(t, 0.2, T[3] + 1.4), P.gold, 10)}`;
  if (u(2) > 0.5 && u(3) < 0) g += at(1020, 220, pill("+10%", 46, "#fff", P.green), pop(u(2) - 0.6));
  if (u(3) > 0.7 && u(4) < 0) g += at(1250, 230, pill("−10%", 46, "#fff", P.red), pop(u(3) - 0.8));
  // the plank: a board on a pivot; the stack stands near its right end
  const ang = tilt * 25, board = (side) => `<g transform="rotate(${(ang + (snapped ? side * 28 * easeOut(snapA) : 0)).toFixed(2)} ${side < 0 ? -30 : 30} -10)"><path d="${rr(side < 0 ? -480 : 30, -16, 450, 32, 10)}" fill="${P.wood}"/><path d="${rr(side < 0 ? -480 : 30, 6, 450, 10, 5)}" fill="${P.woodD}"/></g>`;
  const SX = 260, onPlank = (inner) => `<g transform="rotate(${ang.toFixed(2)})">${at(SX, -16, inner)}</g>`;
  const stacks = swept > 0.98 || snapped ? "" : onPlank(`<g transform="translate(${(900 * easeIn(swept)).toFixed(1)} ${(-200 * Math.sin(Math.PI * swept)).toFixed(1)}) rotate(${(30 * swept).toFixed(1)})">${stack(lentN, ...LENT)}${at(0, -DY * lentN, stack(Math.max(0, mineN), ...MINE))}</g>`);
  g += at(PX, PY, `<path d="M-70 140L0 0L70 140Z" fill="${P.steelD}"/>${board(-1)}${board(1)}${stacks}`, 1.25);
  // labels: $100 for yours, $900 for the loan, $1,000 the bet
  const yTop = PY - 16 * 1.25 - DY * 1.25 * (lentN + Math.max(0, mineN)) - 70;
  if (u(0) > 0.1 && u(4) < 0.5) { const val = 100 + 100 * ease(gain) - 200 * ease(loss); g += at(PX + 260 * 1.25 + 170, yTop + 40, pill("$" + fmtN(Math.max(0, val)), 52, P.ink, P.gold), pop(u(0) - 0.1)); }
  if (u(1) > 1.0 && u(4) < 0.5) g += at(PX + 260 * 1.25 - 190, PY - 140, pill("+$900", 48, P.ink, LENT[0]), pop(u(1) - 1.0));
  if (u(1) > 1.9 && u(2) < 1.3) g += at(PX + 260 * 1.25, yTop - 40, pill("$1,000", 56, "#fff", P.violet), pop(u(1) - 1.9));
  if (u(2) > 1.4 && u(3) < 0) g += at(PX + 260 * 1.25 + 170, yTop - 50, pill("+$100", 44, "#fff", P.green), pop(u(2) - 1.4));
  if (u(3) > 1.6 && u(4) < 0) g += at(PX + 260 * 1.25 + 170, yTop - 50, pill("−$100", 44, "#fff", P.red), pop(u(3) - 1.6));
  // the fishhook on "that's the bait"
  if (u(2) > 3.4 && u(3) < 0.3) { const h = seg(u(2), 3.4, 3.9); g += `<path d="M${PX + 520} 0V${(380 * ease(h)).toFixed(0)}" stroke="${P.steel}" stroke-width="5"/>` + at(PX + 520, 380 * ease(h), `<path d="M0 0v50q0 40 -36 40q-30 0 -30 -30" stroke="${P.steel}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-66 60l-10 -20l20 4Z" fill="${P.steel}"/>${rings(0, 60, 26, "#fff", 0.3 * (0.5 + 0.5 * Math.sin(tot * 8)))}`); }
  // the exchange tower that lends, and later sweeps; its red arm
  const tp = u(1) > 0 ? pop(u(1) - 0.2) : 0;
  const away = (u(2) > 0 ? 700 * ease(seg(u(2), 0.0, 0.6)) : 0) * (u(4) > 0 ? 1 - ease(seg(u(4), 0.0, 0.5)) : 1);   // out of the host's corner in shots 2 and 3
  if (tp > 0) g += at(TX + 120 * (1 - ease(seg(u(1), 0.2, 0.9))) + away, PY + 120, tower({ h: 640, name: "", seed: 5 }), 0.62 * tp);
  if (u(1) > 0.5 && u(1) < 1.8) { const p = seg(u(1), 0.6, 1.5); g += at(...bez([TX - 40, PY - 260], [TX - 300, PY - 460], [PX + 325, PY - 120], ease(p)), stack(3, ...LENT, 40), 1); }
  if (u(4) > 0.2 && u(4) < 2.8) { const r = seg(u(4), 0.2, 0.6) * (1 - seg(u(4), 2.2, 2.8)); const ex = lerp(TX - 60, PX + 280, ease(r)) + 600 * ease(sweep) * r;
    g += `<path d="M${TX - 60} ${PY - 300}Q${(TX + ex) / 2} ${PY - 520} ${ex.toFixed(0)} ${PY - 180}" stroke="${P.red}" stroke-width="26" fill="none" stroke-linecap="round"/>` + at(ex, PY - 180, `${disc(0, 0, 34, P.red, P.redD)}<path d="M-30 20l-20 40M30 20l20 40" stroke="${P.redD}" stroke-width="14" stroke-linecap="round"/>`); }
  if (u(4) > 3.3 && u(5) < 0.3) g += at(PX + 260, PY - 330, `<g transform="rotate(-8)">${pill("LIQUIDATED", 72, P.red, "rgba(255,255,255,0.92)")}</g>`, 1 + 0.4 * Math.exp(-(u(4) - 3.3) * 12) * (1 - seg(u(4), 3.3, 3.32)));
  // the dial on "a hundred times", the 1% move and the snap
  if (u(5) > 0) { const d = 1 + 99 * ease(seg(u(5), 0.8, 1.3)); g += at(1400, 500, dial(d, 150), pop(u(5) - 0.2));
    if (u(5) > 2.5) g += at(1180, 540, pill("−1%", 48, "#fff", P.red), pop(u(5) - 2.5));
    if (snapped) g += Array.from({ length: 8 }, (_, i) => { const an = i * 0.8, d2 = 40 + 220 * snapA; return `<path d="M${(PX + Math.cos(an) * d2).toFixed(0)} ${(PY - 20 + Math.sin(an) * d2 * 0.6).toFixed(0)}l${(Math.cos(an) * 24).toFixed(0)} ${(Math.sin(an) * 24).toFixed(0)}" stroke="${P.wood}" stroke-width="10" stroke-linecap="round" opacity="${(1 - snapA).toFixed(2)}"/>`; }).join("");
    if (u(5) > 2.5) { const fs = 0; // the stack is on the plank when it snaps, so it tumbles
      if (snapped) g += at(PX + 360, PY + 100 * easeIn(snapA), stack(30, ...LENT), 1.25 * (1 - snapA)); } }
  return night(c, tot, 47) + far(c, 860) + layer(ground(PY + 170) + g, c);
}
const T_ = (s, k) => { const E = s.ends || []; let t = 0; for (let i = 0; i < k; i++) t += E[i] || 3; return t; };
const CAM = [[0, 1180, 560, 1.15]];
function p0(a, tot, s) { const c = camAt(a, [[0, PX + 380, PY - 150, 1.9], [0.99, PX + 380, PY - 160, 1.75]]); return { g: plankWorld(a, c, tot, s) }; }
function p1(a, tot, s) { const c = camAt(a, [[0, PX + 380, PY - 160, 1.75], [0.9, PX + 500, PY - 230, 1.2], [2.9, 1080, 560, 1.12]]); return { g: plankWorld(T_(s, 1) + a, c, tot, s) }; }
function p2(a, tot, s) { const c = camAt(a, [[0, 1080, 560, 1.12], [4.34, 1060, 550, 1.16]]); return { g: plankWorld(T_(s, 2) + a, c, tot, s) }; }
function p3(a, tot, s) { const c = camAt(a, [[0, 1060, 550, 1.16], [3.85, 1080, 560, 1.16]]); return { g: plankWorld(T_(s, 3) + a, c, tot, s) }; }
function p4(a, tot, s) { const c = camAt(a, [[0, 1080, 560, 1.16], [4.33, 1120, 560, 1.1]]); return { g: plankWorld(T_(s, 4) + a, c, tot, s) }; }
function p5(a, tot, s) { const c = camAt(a, [[0, 1120, 560, 1.1], [4.32, 1240, 560, 1.1]]); return { g: plankWorld(T_(s, 5) + a, c, tot, s), out: toScreen(c, 1400, 500), outC: P.cream, outZ: 18 }; }

// ---- 6: 10 OCT 2025, the sudden drop ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [1.8, 980, 520, 1.02], [2.6, 1140, 600, 1.15], [2.94, 1160, 610, 1.17]]);
  const drop = seg(a, 1.85, 2.45), pts = [[220, 420], [600, 400], [900, 430], [1200, 410], [1260, 410 + 360 * ease(drop)], [1520, 410 + 380 * ease(drop)]];
  const panel = `${two(rr(160, 200, 1440, 640, 26), "#2c1f63", "#1b1550", 0, 12)}${line(pts, seg(a, 0.2, 2.6), P.gold, 12)}`;
  const flash = a > 1.9 && a < 2.6 ? `<rect x="160" y="200" width="1440" height="640" rx="26" fill="${P.red}" opacity="${(0.25 * (1 - seg(a, 1.9, 2.6))).toFixed(2)}"/>` : "";
  const g = night(c, tot, 53) + layer(ground(900) + panel + flash + at(1420, 330, cal("10", "OCT 2025", a - 0.1, 0.62, 6)), c);
  return { g, in: [960, 540], inC: P.cream, inZ: 18 };
}

// ---- 7: row after row stamped red, 1,500,000+ ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.3], [2.94, 960, 580, 1.12]]);
  let g = "";
  for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { const x = 420 + i * 180, y = 540 + r * 120, t0 = 0.4 + (r * 7 + i) * 0.06, hit = a > t0;
    g += at(x, y, stack(5 + ((r + i) % 3), hit ? "#c84a58" : P.gold, hit ? "#a33441" : P.goldD, 50) + (hit ? at(0, -60, `<g transform="rotate(-12)">${pill("✗", 40, "#fff", P.red)}</g>`, pop(a - t0) * 0.8) : ""), 0.9); }
  const n = 1500000 * ease(seg(a, 0.5, 2.3));
  g += at(960, 330, pill(fmtN(n) + (a > 2.3 ? "+" : ""), 92, "#fff", P.red), pop(a - 0.4));
  return { g: night(c, tot, 59) + layer(ground(1040) + g, c) };
}

// ---- 8: a wave washes away $19,000,000,000; the coin itself dips under 15% ----
function s8(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.0], [1.6, 900, 560, 1.0], [2.3, 1180, 520, 1.1], [4.38, 1200, 520, 1.12]]);
  const wv = seg(a, 0.0, 1.3), wx = lerp(-400, 1500, ease(wv));
  let g = "";
  for (let i = 0; i < 8; i++) { const x = 160 + i * 150, gone = wx > x; g += at(x + (gone ? 600 * ease(seg(wx - x, 0, 900)) : 0), 820 + (gone ? -60 * Math.sin(seg(wx - x, 0, 900) * Math.PI) : 0), stack(3 + (i % 3), P.gold, P.goldD, 40), 0.9, gone ? 30 * seg(wx - x, 0, 900) : 0); }
  const wave = `<path d="M${wx - 900} 1100L${wx - 900} 760Q${wx - 300} 620 ${wx - 60} 700Q${wx + 60} 560 ${wx - 40} 520Q${wx + 160} 560 ${wx + 120} 760L${wx + 140} 1100Z" fill="${P.red}" opacity=".85"/>`;
  g += a < 1.6 ? wave : "";
  g += at(700, 330, pill("$" + fmtN(19e9 * ease(seg(a, 0.2, 1.3))), 86, "#fff", P.red), pop(a - 0.2));
  // the coin's own line: a small dip, < 15%
  if (a > 1.8) { const p = seg(a, 1.9, 3.4); g += `<g opacity="${seg(a, 1.8, 2.1).toFixed(2)}">${two(rr(1180, 380, 560, 380, 22), "#2c1f63", "#1b1550", 0, 10)}${at(1250, 450, coin(36, "B"))}${line([[1230, 560], [1420, 560], [1500, 640], [1700, 630]], p, P.gold, 10)}</g>` + (a > 3.3 ? at(1600, 710, pill("< 15%", 50, "#fff", P.violet), pop(a - 3.3)) : ""); }
  return { g: night(c, tot, 61) + layer(ground(900) + g, c), out: toScreen(c, 1460, 560), outC: "#1b1550", outZ: 18 };
}

// ---- 9: mostly bets on the line, a small corner of real trade (host right) ----
function s9(a, tot) {
  const c = camAt(a, [[0, 840, 540, 1.12], [3.82, 840, 540, 1.16]]);
  let g = `${two(rr(170, 220, 1300, 640, 26), "#2c1f63", "#1b1550", 0, 12)}`;
  // the real corner: a coin swapped for a note, lit on "real buying and selling"
  const real = pop(a - 1.2);
  g += at(330, 360, `<path d="${rr(-110, -90, 220, 180, 16)}" fill="#3a2a7a" stroke="${P.green}" stroke-width="${a > 1.3 ? 6 : 0}"/>${at(-40, 0, coin(36, "B"))}<path d="M0 -10h20m-8 -8l8 8l-8 8" stroke="#fff" stroke-width="5" fill="none"/>${at(55, 0, `${two(rr(-30, -18, 60, 36, 6), "#6fe3a1", "#3fbf7a", 3, 2)}`)}`, real);
  // the bets: up and down arrows with a × badge filling the rest of the floor
  for (let i = 0; i < 30; i++) { const x = 520 + (i % 10) * 92, y = 330 + Math.floor(i / 10) * 170, t0 = 2.5 + i * 0.03, upA = (i * 7) % 3 !== 0;
    if (a < t0) continue; g += at(x, y, `<path d="M0 ${upA ? 40 : -40}V${upA ? -10 : 10}" stroke="${upA ? P.green : P.red}" stroke-width="16" stroke-linecap="round"/><path d="M-24 ${upA ? -2 : 2}L0 ${upA ? -40 : 40}L24 ${upA ? -2 : 2}Z" fill="${upA ? P.green : P.red}"/>${at(30, upA ? 30 : -30, `<circle r="18" fill="${P.violet}"/>${text(0, 8, "×", 26, "#fff")}`)}`, pop(a - t0) * (1 + 0.04 * Math.sin(tot * 6 + i))); }
  return { g: night(c, tot, 67) + layer(ground(900) + g, c), in: [960, 540], inC: "#1b1550", inZ: 18 };
}

// ---- 10: the house always wins (host left) ----
function s10(a, tot) {
  const c = camAt(a, [[0, 1060, 520, 1.0], [4.6, 1060, 520, 1.0], [5.5, 1180, 540, 1.08], [7.23, 1200, 540, 1.1]]);
  const up = seg(a, 2.2, 2.9), down = seg(a, 3.6, 4.3);
  const pts = [[560, 420], [760, 420], [880, 420 - 140 * ease(up)], [1000, 420 - 140 * ease(up)], [1120, 420 - 140 * ease(up) + 260 * ease(down)], [1240, 420 - 140 * ease(up) + 260 * ease(down)]];
  let g = `${two(rr(500, 220, 800, 420, 22), "#2c1f63", "#1b1550", 0, 10)}${line(pts, seg(a, 0.3, 4.4), P.gold, 12)}`;
  const glow = seg(a, 5.9, 6.4);
  g += at(1520, 940, (glow > 0 ? rings(0, -360, 300, P.gold, 0.2 * glow) : "") + tower({ h: 620, name: "", seed: 9 }), 0.85 * pop(a - 1.2));
  const fee = (t0, from) => { if (a < t0) return ""; const p = seg(a, t0, t0 + 0.7); return p >= 1 ? "" : at(...bez(from, [1300, 160], [1520, 400], ease(p)), coin(30, "$"), 1); };
  g += fee(2.6, [940, 280]) + fee(4.1, [1180, 540]);
  if (a > 2.9) g += at(1520 - 200, 330, pill("+", 50, "#fff", P.green), pop(a - 3.3));
  if (a > 4.4) g += at(1520 - 120, 330, pill("+", 50, "#fff", P.green), pop(a - 4.8));
  // the roulette wheel on "like the casino"
  if (a > 4.7) { const sp = (a - 4.7) * 6; g += at(980, 790, `${disc(0, 0, 150, "#5a2a1a", "#3a1a0a")}${Array.from({ length: 16 }, (_, i) => { const a0 = sp + i * 0.3927, a1 = a0 + 0.3927; return `<path d="M0 0L${(Math.cos(a0) * 130).toFixed(1)} ${(Math.sin(a0) * 130).toFixed(1)}A130 130 0 0 1 ${(Math.cos(a1) * 130).toFixed(1)} ${(Math.sin(a1) * 130).toFixed(1)}Z" fill="${i % 2 ? P.red : P.ink}"/>`; }).join("")}<circle r="40" fill="${P.gold}"/><circle cx="${(Math.cos(-sp * 1.4) * 110).toFixed(1)}" cy="${(Math.sin(-sp * 1.4) * 110).toFixed(1)}" r="12" fill="#fff"/>`, pop(a - 4.7)); }
  return { g: night(c, tot, 71) + far(c, 900) + layer(ground(940) + g, c) };
}

const SHOTS = [p0, p1, p2, p3, p4, p5, s6, s7, s8, s9, s10];
export const c4leverSet = makeSet(SHOTS, V, P);
