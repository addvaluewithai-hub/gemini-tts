// "Black start" (electricity part 3 of 4): how a dark country comes back.
//   0 a dark country of towns and lines, a "?"; push into one station: it needs its own pumps, fans and computers to
//     start, and they are dark (✗ on each word)
//   1 the same country: a dam lights by itself (a gold star), wakes the station next to it, and the lit island grows
//     town by town
//   2 each piece joins only when its pulse matches the 50 Hz dial; a clock runs hours, calendar pages days; the fall is a
//     fast arrow (s), the rise a slow one (h). Host left: the lower left is kept clear.
// Props shared with the recap are exported (land, dam).
import { clamp, lerp, ease, easeOut, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet, portrait } from "./kit.js";
import { V } from "./blackstart.v.js";
import { P, E, mix, stars, pop, station, gauge } from "./elec.js";
import { calPage, calFlip } from "./props.js";
import { dial, stopwatch, signal, RED } from "./balance.js";

const LAND = "#164a62", LANDD = "#0f3a4f", DARKW = "#12303e";
// the country, stylised, in world coordinates about 200..1720 x 140..940
export const LANDP = "M260 520L330 360L480 260L700 200L960 170L1220 200L1450 260L1620 380L1700 540L1640 720L1480 840L1240 910L960 930L700 900L470 830L310 700Z";
// towns (x, y) and the lines between them; the dam (index 0) is in the hills at the top left
export const TOWNS = [[520, 330], [700, 420], [900, 360], [1100, 300], [1320, 380], [1500, 500], [1400, 680], [1180, 760], [940, 700], [700, 660], [520, 560], [1100, 540], [880, 540], [1300, 560]];
const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 1], [1, 12], [12, 11], [11, 4], [11, 13], [13, 6], [12, 8], [2, 12], [11, 7]];
export const land = (on, o = {}) => { // on(i) 0..1 for each town
  const lines = LINKS.map(([i, j]) => { const L = Math.min(on(i), on(j)); return `<path d="M${TOWNS[i][0]} ${TOWNS[i][1]}L${TOWNS[j][0]} ${TOWNS[j][1]}" stroke="${mix("#21495c", E.el, L)}" stroke-width="7" opacity=".9"/>`; }).join("");
  const dots = TOWNS.map(([x, y], i) => { if (i === 0 && !o.noDam) return ""; const L = on(i); return `${L > 0 ? rings(x, y, 34, P.win, 0.3 * L, 1.5) : ""}${[0, 1, 2].map((k) => `<rect x="${x - 26 + k * 18}" y="${y - 16 - (k % 2) * 10}" width="14" height="${26 + (k % 2) * 10}" rx="3" fill="${mix(DARKW, P.win, L)}"/>`).join("")}`; }).join("");
  return two(LANDP, LAND, LANDD, 0, 12) + `<path d="M380 260Q520 300 560 420Q600 560 760 600" fill="none" stroke="${E.waterD}" stroke-width="14" opacity=".8"/>` + lines + dots; };
// a dam (base on y = 0), 220 wide; lit 0..1
export const dam = (lit = 0, t = 0) => `${two("M-110 0L-80 -150H80L110 0Z", "#9fb6c8", "#7890a5", 0, 8)}<path d="M-60 -150H60L50 -170H-50Z" fill="#7890a5"/>${[-40, 0, 40].map((x) => `<path d="${rr(x - 10, -120, 20, 120, 6)}" fill="${mix("#2a5a72", E.water, lit)}" opacity="${(0.5 + 0.5 * lit).toFixed(2)}"/>`).join("")}<path d="M-180 -150H-80" stroke="${E.water}" stroke-width="18"/>${lit > 0 ? rings(0, -90, 120 * lit, P.gold, 0.25 * lit, 1.5) : ""}<circle cx="0" cy="-185" r="12" fill="${mix("#2a3f4a", P.win, lit)}"/>`;
const star = (r, c = P.gold) => `<path d="${Array.from({ length: 10 }, (_, i) => { const q = i / 10 * 2 * Math.PI - Math.PI / 2, R = i % 2 ? r * 0.45 : r; return `${i ? "L" : "M"}${(R * Math.cos(q)).toFixed(1)} ${(R * Math.sin(q)).toFixed(1)}`; }).join("")}Z" fill="${c}"/>`;
// the three things a station needs to start (centre each, about 120 across); on 0..1
const pump = (on, t) => `${two(rr(-60, -40, 120, 80, 16), "#5b7f8f", "#45687a", 0, 6)}<g transform="rotate(${(t * 200 * on).toFixed(1)})">${[0, 1, 2, 3].map((i) => `<path d="M0 0L30 -8L30 8Z" fill="${mix("#2a3f4a", E.water, on)}" transform="rotate(${i * 90})"/>`).join("")}</g><path d="M60 0H100" stroke="${E.waterD}" stroke-width="16"/>`;
const fan = (on, t) => `${disc(0, 0, 64, "#5b7f8f", "#45687a")}<g transform="rotate(${(t * 400 * on).toFixed(1)})">${[0, 1, 2].map((i) => `<path d="M0 0Q30 -50 6 -56Q-12 -40 0 0Z" fill="${mix("#2a3f4a", "#cfe6f0", on)}" transform="rotate(${i * 120})"/>`).join("")}</g><circle r="10" fill="${P.ink}"/>`;
const pc = (on) => `${two(rr(-70, -60, 140, 96, 10), "#2b5a74", "#1c4157", 0, 6)}<path d="${rr(-58, -50, 116, 76, 6)}" fill="${mix("#04121e", "#0b3346", on)}"/>${on > 0 ? `<path d="M-46 0L-20 -18L6 -6L40 -30" fill="none" stroke="${E.el}" stroke-width="6"/>` : ""}<path d="M-20 36h40l8 18h-56Z" fill="${P.steelD}"/>`;
const night = (c, tot, seed = 5) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -1200, 3200, 1200, tot), c, 0.15);
const DAM = TOWNS[0], ST = [960, 520];

// ---- 0: the country is dark; a station needs power to start ----
function s0(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, 960, 540, 0.66], [3.6, 960, 540, 0.68], [4.6, ST[0], ST[1] + 20, 2.6], [8.61, ST[0], ST[1] + 20, 2.7]] : [[0, 960, 540, 1.0], [3.6, 960, 540, 1.04], [4.6, ST[0], ST[1] - 20, 3.0], [8.61, ST[0], ST[1] - 20, 3.12]]);
  const q = a > 2.0 ? at(960, 120, `${rings(0, -60, 110, P.gold, 0.25)}${text(0, 30, "?", 220, P.gold)}`, pop(a - 2.14) * (1 - seg(a, 3.7, 4.2))) : "";
  const st = at(ST[0], ST[1] + 60, station(tot, { lit: 0, smoke: false }), 0.3);
  const needs = [[6.28, -150, 0, pump], [7.0, 0, -130, fan], [7.64, 150, 0, pc]].map(([t0, dx, dy, f]) => a > t0 - 0.05 ? at(ST[0] + dx, ST[1] + dy, `${f(0, tot)}${at(44, -44, cross(0, 0, 22, RED, a - t0 - 0.15))}`, 0.42 * pop(a - t0)) : "").join("");
  const g = night(c, tot, 13) + layer(land(() => 0) + at(DAM[0], DAM[1] + 40, dam(0), 0.42) + st + needs + q, c);
  return { g, out: toScreen(c, ST[0], ST[1] + 30), outC: "#04121e", outZ: 10 };
}

// ---- 1: a dam starts alone and the island grows ----
function s1(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, 760, 520, 1.1], [5.0, 760, 500, 1.1], [7.2, 960, 540, 0.66], [8.96, 960, 540, 0.68]] : [[0, 820, 440, 1.6], [5.0, 760, 460, 1.55], [7.1, 960, 540, 1.0], [8.96, 960, 540, 1.03]]);
  const self = seg(a, 3.07, 3.5);
  const d0 = Math.hypot(TOWNS[1][0] - DAM[0], TOWNS[1][1] - DAM[1]);
  const R = a < 5.63 ? 0 : a < 7.06 ? d0 + 10 : lerp(d0 + 10, 1300, ease(seg(a, 7.06, 8.6)));
  const on = (i) => i === 0 ? self : clamp((R - Math.hypot(TOWNS[i][0] - DAM[0], TOWNS[i][1] - DAM[1])) / 80);
  const wake = signal(DAM[0], DAM[1], TOWNS[1][0], TOWNS[1][1], seg(a, 5.0, 5.63));
  const hi = a > 1.8 && a < 3.2 ? rings(DAM[0], DAM[1] - 20, 80 + 10 * Math.sin(a * 8), P.gold, 0.3, 1.4) : "";
  const st = a > 3.0 ? at(DAM[0] + 90, DAM[1] - 110, star(36 * spring(a - 3.07, 7, 12))) : "";
  const g = night(c, tot, 13) + layer(land(on) + at(DAM[0], DAM[1] + 40, dam(self, tot), 0.42) + hi + st + wake, c);
  return { g, in: toScreen(c, ST[0], ST[1]), inC: "#04121e" };
}

// ---- 2: every piece in step; the fall is fast, the rise slow (host left) ----
function s2(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, 960, 900, 1.0], [7.52, 960, 900, 1.02]] : [[0, 980, 520, 1.0], [7.52, 980, 520, 1.02]]);
  const DX = v ? 960 : 1150, DY = v ? 420 : 400;
  const big = at(DX, DY, dial(50 + 0.03 * Math.sin(tot * 3), { r: v ? 230 : 220 }));
  // three pieces with their own small dial; each needle sweeps, locks on 50, and the piece slides into the island
  const T = [0.34, 1.36, 2.0];
  const pieces = T.map((t0, i) => { const lock = seg(a, t0 + 0.4, t0 + 0.7), join = ease(seg(a, t0 + 0.7, t0 + 1.3));
    const f = lock < 1 ? 50 + 0.7 * Math.sin(a * 6 + i) * (1 - lock) : 50;
    const x0 = v ? 300 + i * 240 : 480 + i * 30, y0 = v ? 900 : 230 + i * 180, x1 = v ? 760 + i * 140 : DX - 120 + i * 120, y1 = v ? 760 : DY + 330;
    const x = lerp(x0, x1, join), y = lerp(y0, y1, join), k = lerp(1, 0.6, join);
    return at(x, y, `${two(rr(-100, -60, 200, 120, 18), "#164a62", "#0f3a4f", 0, 6)}${[0, 1, 2].map((j) => `<rect x="${-70 + j * 26}" y="-30" width="18" height="40" rx="3" fill="${mix(DARKW, P.win, join)}"/>`).join("")}${at(56, -2, dial(f, { r: 40, lit: lock }), 1)}${lock >= 1 ? rings(56, -2, 50, P.green, 0.3 * (1 - join), 1.3) : ""}`, k); }).join("");
  // hours on a clock, days on calendar pages
  const CX = v ? 760 : 1540, CY = v ? 1180 : 760;
  const clock = a > 3.3 ? at(CX, CY, `${stopwatch(seg(a, 3.36, 5.4) * 6, 70)}${at(120, 0, text(0, 30, "h", 80, P.gold))}`, pop(a - 3.36)) : "";
  const days = a > 4.4 ? at(CX + 300, CY - 10, [0, 1, 2].map((k) => k === 0 ? calPage("3", "", 0.5, 150) : calFlip(String(k === 2 ? 1 : 2), "", seg(a, 4.6 + (2 - k) * 0.3, 4.9 + (2 - k) * 0.3), 150)).join(""), 0.5 * pop(a - 4.5)) : "";
  // the fall and the rise
  const AX = v ? 760 : 780, AY = v ? 1520 : 800;
  const fall = a > 5.4 ? at(AX, AY, `${drawn("M0 -150L0 120", seg(a, 5.44, 5.6), RED, 26)}<path d="M-50 70L0 140L50 70Z" fill="${RED}" opacity="${seg(a, 5.55, 5.65).toFixed(2)}"/>${at(90, 10, text(0, 30, "s", 90, RED), seg(a, 5.6, 5.8))}`) : "";
  const rise = a > 6.25 ? at(AX + 300, AY, `${drawn("M0 140L0 -130", seg(a, 6.3, 7.4), P.gold, 26)}<path d="M-50 -80L0 -150L50 -80Z" fill="${P.gold}" opacity="${seg(a, 7.2, 7.4).toFixed(2)}"/>${at(90, 10, text(0, 30, "h", 90, P.gold), seg(a, 6.5, 6.8))}`) : "";
  const g = night(c, tot, 29) + layer(big + pieces + clock + days + fall + rise, c);
  return { g, in: toScreen(c, DX, DY), inC: "#04121e" };
}

const SHOTS = [s0, s1, s2];
export const blackstartSet = makeSet(SHOTS, V, P);
