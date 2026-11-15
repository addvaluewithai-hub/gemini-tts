// Science part 1, section 8 "why trust it": six shots, timed to the words.
//   0 a lab whose searchlight turns on its own walls and finds the loose plug (built to look for its own mistakes)
//   1 the same bench copied four times (anyone can repeat it); a small card knocks over a big one and gets a gold medal,
//     while a padlock is crossed out (a prize, not a punishment)
//   2 the planet ringed by labs under pennants of different colours; little sparks between them (they do not like each
//     other); a trophy in the middle; then every lab's screen shows the same ✓ (the same result)
//   3 a thread meant to tie every lab together for a conspiracy; it snaps between them. Host right.
//   4 the ladder with the gold card on top; a phone, a plane and a bridge come to rest on it (it works)
//   5 days flip past on a calendar, everything stays standing, a big ✓ (the bet wins). Host left.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { globe, padlock, calPage, calFlip } from "./props.js";
import { P, G0, mix, pop, paperBg, room, lab, cablePlug, bench, card, medal, trophy, pennant, ladder, phone, plane, bridge } from "./sci.js";

const TEAMS = [[P.coral, P.coralD], [P.blue, P.blueD], [P.mint, P.mintD], [P.gold, P.goldD], [P.pink, P.pinkD], ["#9a7ad0", "#7a5ab0"]];

// ---- 0: a method that hunts its own mistakes ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 0.95], [3.2, 960, 600, 1.0], [4.58, 1120, 700, 1.7]]), G = 900;
  const sw = kf(a, [[0, -30], [1.5, 20], [2.6, -10], [3.3, 8]]), LX = 760, LY = 460;
  const beam = `<path d="M${LX} ${LY}L${LX + 900} ${LY + 200 + sw * 12}L${LX + 900} ${LY + 420 + sw * 12}Z" fill="#fff3b0" opacity=".35"/>`;
  const light = at(LX, LY, `${two(rr(-60, -50, 140, 100, 16), P.steel, P.steelD, 0, 8)}<path d="M80 -50V50" stroke="#fff3b0" stroke-width="14"/>`, 1, sw * 0.8 + 18);
  const found = a > 3.3 ? rings(1120, 700, 50 + 20 * Math.sin(tot * 10), P.gold, 0.4) : "";
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="${P.floor}"/>` + `<path d="${rr(500, 300, 1100, 600, 14)}" fill="${P.wall}" stroke="${P.violetD}" stroke-width="14"/>` + at(1120, 700, cablePlug(0.5, tot), 0.4) + beam + `<path d="M${LX} ${LY}V${G}" stroke="${P.steelD}" stroke-width="16"/>` + light + found, c) };
}
// ---- 1: anyone can repeat it; proving the greats wrong earns a prize ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [4.62, 960, 560, 1.04]]), G = 560;
  const benches = [0, 1, 2, 3].map((i) => (a > 0.2 + i * 0.18 ? at(300 + i * 440, G, bench({ liquid: TEAMS[i][0] }), 0.7 * pop(a - 0.2 - i * 0.18)) : "")).join("");
  const push = seg(a, 2.3, 2.8), fallR = ease(seg(a, 2.7, 3.2)) * 80;
  const big = at(1100, 980, `<g transform="rotate(${fallR.toFixed(1)} 90 0)">${at(0, -170, card("?"), 1.4)}</g>`), small = at(lerp(760, 900, ease(push)), 980, at(0, -90, card("✓", 0.5), 0.7));
  const md = a > 3.3 ? at(lerp(760, 900, 1), lerp(560, 780, easeOut(seg(a, 3.3, 3.6))), medal(56), 1) : "";
  const lock = a > 3.9 ? at(1550, 820, padlock(0.9) + cross(60, -60, 40, P.red, a - 3.9), pop(a - 3.9)) : "";
  return { g: paperBg(c, tot) + layer(benches + `<rect x="-500" y="980" width="3000" height="300" fill="${P.floor}"/>` + big + small + md + lock, c) };
}
// ---- 2: many teams, rivals, the same result ----
const station = (i, on, eq, tot) => { const [cc, cD] = TEAMS[i]; return `${pennant(cc, cD, tot * 3 + i)}${at(80, 0, `${two(rr(-60, -110, 120, 110, 10), "#f3dfb6", "#e3c79a", 6, 0)}<path d="${rr(-44, -94, 88, 56, 6)}" fill="${eq ? "#dff5e6" : "#cfe9ff"}"/>${eq ? `<path d="M-24 -66l14 14l28 -28" stroke="${P.green}" stroke-width="10" fill="none" stroke-linecap="round"/>` : ""}`)}`; };
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.9], [8.46, 960, 540, 0.96]]), R = 300;
  const st = TEAMS.map((_, i) => { const t = -Math.PI / 2 + i * Math.PI / 3, x = 960 + Math.cos(t) * (R + 30), y = 540 + Math.sin(t) * (R + 30), t0 = 1.3 + i * 0.25;
    return a > t0 ? at(x, y, station(i, true, a > 7.0 + i * 0.12, tot), pop(a - t0), (t + Math.PI / 2) * 57.3) : ""; }).join("");
  const sparks = a > 3.4 && a < 5.6 ? TEAMS.map((_, i) => { const t = -Math.PI / 2 + (i + 0.5) * Math.PI / 3, x = 960 + Math.cos(t) * (R + 120), y = 540 + Math.sin(t) * (R + 120); return at(x, y, `<path d="M-14 -30L10 -4L-6 0L14 30" stroke="${P.red}" stroke-width="8" fill="none" stroke-linejoin="round"/>`, 0.8 + 0.3 * Math.sin(tot * 14 + i)); }).join("") : "";
  const tr = a > 4.8 ? at(960, 600, trophy(), 0.9 * pop(a - 4.8)) : "";
  return { g: paperBg(c, tot) + layer(at(960, 540, globe(R, 0.06 + tot * 0.005, { id: "tr2", ...G0 })) + tr + st + sparks, c), out: [960, 540], outC: P.blue };
}
// ---- 3: a conspiracy needs everyone to agree (host right) ----
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [4.27, 800, 540, 1.04]]), CX = 760, CY = 520, R = 300;
  const pts = TEAMS.map((_, i) => { const t = -Math.PI / 2 + i * Math.PI / 3; return [CX + Math.cos(t) * R, CY + Math.sin(t) * R]; });
  const tie = seg(a, 0.6, 2.2), snap = a > 3.4;
  const thread = pts.map((p, i) => { const q = pts[(i + 1) % 6], br = snap && i % 2 === 0, d = br ? 30 * ease(seg(a, 3.4, 3.8)) : 0, mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    if (tie * 6 < i) return ""; return br ? `<path d="M${p[0]} ${p[1]}L${mx - d} ${my + d}" stroke="${P.red}" stroke-width="8"/><path d="M${q[0]} ${q[1]}L${mx + d} ${my + 2 * d}" stroke="${P.red}" stroke-width="8"/>` : `<path d="M${p[0]} ${p[1]}L${q[0]} ${q[1]}" stroke="${P.ink}" stroke-width="8" opacity=".6"/>`; }).join("");
  const nodes = pts.map((p, i) => at(p[0], p[1] + 60, station(i, true, false, tot), 0.9)).join("");
  return { g: paperBg(c, tot) + layer(thread + nodes + (a > 3.8 ? cross(CX, CY, 60, P.red, a - 3.8) : ""), c), in: [960, 540], inC: P.blue };
}
// ---- 4–5: it works; the bet wins ----
const LX = 960, LB = 960, GAP = 150;
function scene45(a, tot, k) {
  const ph = a > 2.5 || k ? at(LX - 330, LB - 2 * GAP - 40, phone(), pop(k ? 9 : a - 2.5)) : "";
  const pl = a > 3.6 || k ? at(LX + 330, LB - 3 * GAP - 60, plane(), 0.7 * pop(k ? 9 : a - 3.6)) : "";
  const br = a > 4.8 || k ? at(LX, LB - 4 * GAP - 70 - 220, bridge(), 0.55 * pop(k ? 9 : a - 4.8)) : "";
  return `<rect x="-500" y="${LB}" width="3000" height="400" fill="${P.floor}"/>` + at(LX, LB, ladder(5, GAP), 1.2) + at(LX, LB - 5 * GAP * 1.2 - 60, card("✓", 1), 0.6) + ph + pl + br;
}
function s4(a, tot) { const c = camAt(a, [[0, 960, 520, 0.9], [6.06, 960, 480, 0.84]]); return { g: paperBg(c, tot) + layer(scene45(a, tot, false), c) }; }
function s5(a, tot) {
  const c = camAt(a, [[0, 1040, 480, 0.84], [5.33, 1060, 480, 0.86]]), days = Math.floor(seg(a, 2.2, 3.9) * 6);
  const cal = at(1650, 300, (days < 6 ? calFlip(String(10 + days), "", (a * 3.5) % 1, 150) : calPage("16", "", 1, 150)), 0.8);
  return { g: paperBg(c, tot) + layer(scene45(9, tot, true) + cal + (a > 4.5 ? check(1650, 620, 80, P.green, a - 4.5) : ""), c) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const trustSet = makeSet(SHOTS, [], P);
