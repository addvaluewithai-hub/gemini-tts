// Science part 1, section 1 "the announcement": seven shots, no words to read (names on the labs and numbers only).
//   0 a cut through the ground: a lab with a dome (CERN) on the left, a mountain with a lab under it on the right; a neutrino
//     leaves the first, runs through the rock and arrives in the second
//   1 pull back: a measuring line 730 km between them; a stopwatch over each end, the first starts, the second stops
//   2 2011: a race on a straight track, a pulse of light and a neutrino; the neutrino crosses the line first, "60 ns" pops up
//   3 a road sign with a big c (the speed of light); the neutrino zooms past it and the sign cracks (impossible)
//   4 a tower of blocks built on one block marked c, floors climbing with the years 1905 → 2011; the neutrino hits the
//     bottom block and the whole tower wobbles
//   5 a desk with a drawer on the left, a podium on the right: a sheet of results hovers between them, nearly goes in the
//     drawer, then flies to the podium (they chose to announce)
//   6 the press conference: the stopwatch reads 60, flashes; sheets fly out from the podium to magnifying glasses all over the
//     planet (find our mistake). Host right.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { globe, calPage } from "./props.js";
import { P, G0, paperBg, mix, dur, pop, nightSky, room, stopwatch, podium, flash, neutrino, photon, lab, mountain, drawerDesk, magnifier } from "./sci.js";

const G = 560;                        // ground line of the cross-section
const earthCut = (tot) => `<rect x="-2000" y="${G}" width="7000" height="900" fill="${P.soil}"/><rect x="-2000" y="${G}" width="7000" height="40" fill="${P.green}"/>`
  + Array.from({ length: 40 }, (_, i) => `<circle cx="${-1800 + i * 170 + (i % 3) * 30}" cy="${G + 120 + ((i * 97) % 300)}" r="${10 + (i % 4) * 6}" fill="${P.ground}"/>`).join("");
const TUN = G + 230, AX = 300, BX = 2500;   // the neutrinos' path through the rock, from A to B
const sheet = (k = 1) => at(0, 0, `${two(rr(-70, -90, 140, 180, 8), P.cream, P.creamD, 6, 6)}${[0, 1, 2, 3].map((i) => `<path d="M-46 ${-56 + i * 30}h${60 + (i % 2) * 30}" stroke="#a58f5e" stroke-width="8" stroke-linecap="round"/>`).join("")}${text(0, 78, "60", 44, P.red)}`, k);
const gsLab = () => at(0, 0, mountain(1100, 520) + `<path d="${rr(-80, 160, 160, 120, 10)}" fill="${P.ink}"/>` + `<path d="${rr(-150, 230, 300, 90, 10)}" fill="${P.blueD}"/>${[-100, -40, 20, 80].map((x) => `<path d="${rr(x, 250, 40, 40, 6)}" fill="${P.win}"/>`).join("")}`);

// ---- 0: CERN → under the ground → the lab under the mountain ----
function s0(a, tot, s) {
  const D = dur(s, 0, 7.8), run = seg(a, D * 0.42, D * 0.9), nx = lerp(AX, BX, ease(run));
  const c = camAt(a, [[0, 600, 300, 0.9], [D * 0.4, 700, 360, 0.9], [D * 0.92, BX - 300, 380, 0.9], [D, BX - 260, 380, 0.92]]);
  const path = `<path d="M${AX} ${TUN}H${BX}" stroke="${P.mint}" stroke-width="6" stroke-dasharray="20 22" opacity="${(0.5 * seg(a, D * 0.35, D * 0.45)).toFixed(2)}"/>`;
  const arrive = run >= 1 ? rings(BX, TUN, 90 * spring(a - D * 0.9, 7, 11), P.mint, 0.3) : "";
  const g = paperBg(c, tot, 21, false) + layer(earthCut(tot) + at(AX, G, lab({ tag: "CERN" }), 0.95) + at(BX + 60, G, gsLab()) + path + `<path d="${rr(AX - 40, G, 80, TUN - G, 6)}" fill="${P.road}"/>` + (run > 0 && run < 1 ? at(nx, TUN, neutrino(20, 160)) : "") + arrive, c);
  return { g, out: toScreen(c, BX, TUN), outC: P.mint, outZ: 12 };
}

// ---- 1: 730 km, timed with a stopwatch at each end ----
function s1(a, tot, s) {
  const D = dur(s, 1, 4.6), c = camAt(a, [[0, 1400, 300, 0.62], [D, 1400, 320, 0.6]]);
  const line = ease(seg(a, 0.2, 1.4)), km = Math.round(730 * line);
  const t0 = D * 0.55, run = seg(a, t0, t0 + 1.4), nx = lerp(AX, BX, ease(run));
  const w1 = at(AX, -60, stopwatch(130, run > 0 ? (a - t0) * 0.7 : 0), pop(a - D * 0.45)), w2 = at(BX, -60, stopwatch(130, run > 0 ? Math.min(a - t0, 1.4) * 0.7 : 0, "", run >= 1 ? { face: "#e8fff6" } : {}), pop(a - D * 0.5));
  const meas = `<path d="M${AX} ${TUN + 180}H${lerp(AX, BX, line)}" stroke="${P.gold}" stroke-width="12"/><path d="M${AX} ${TUN + 140}V${TUN + 220}" stroke="${P.gold}" stroke-width="12"/>${line >= 1 ? `<path d="M${BX} ${TUN + 140}V${TUN + 220}" stroke="${P.gold}" stroke-width="12"/>` : ""}
    ${line > 0 ? `<path d="${rr(1400 - 230, TUN + 220, 460, 120, 20)}" fill="${P.ink}"/>${text(1400, TUN + 310, `${km} km`, 96, P.gold)}` : ""}`;
  const g = paperBg(c, tot, 21, false) + layer(earthCut(tot) + at(AX, G, lab({ tag: "CERN" }), 0.95) + at(BX + 60, G, gsLab()) + meas + (run > 0 && run < 1 ? at(nx, TUN, neutrino(20, 160)) : "") + w1 + w2, c);
  return { g, in: toScreen(c, BX, TUN), inC: P.mint, inZ: 12, out: toScreen(c, BX, -60), outC: P.cream };
}

// ---- 2: the race: the neutrino comes in early ----
const track = (y0) => `<path d="${rr(120, y0 - 160, 1680, 320, 40)}" fill="${P.road}"/><path d="M140 ${y0}H1780" stroke="${P.chalk}" stroke-width="4" stroke-dasharray="30 30" opacity=".35"/><path d="M1540 ${y0 - 170}V${y0 + 170}" stroke="${P.chalk}" stroke-width="12"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${1552}" y="${y0 - 160 + i * 40}" width="20" height="20" fill="${i % 2 ? P.chalk : P.ink}"/><rect x="${1572}" y="${y0 - 140 + i * 40}" width="20" height="20" fill="${i % 2 ? P.chalk : P.ink}"/>`).join("")}`;
function s2(a, tot, s) {
  const D = dur(s, 2, 7.0), Y = 600, c = camAt(a, [[0, 960, 560, 0.95], [D * 0.75, 1200, 580, 1.15], [D, 1260, 580, 1.2]]);
  const r = seg(a, D * 0.3, D * 0.72), lx = lerp(220, 1540, ease(r)), nx = Math.min(1640, lx + 110 * seg(r, 0.55, 1));
  const tag = a - D * 0.74;
  const g = paperBg(c, tot, 22, false) + layer(track(Y) + at(lx, Y - 70, photon(220), 1.2) + at(nx, Y + 70, neutrino(22, 170), 1.2)
    + (tag > 0 ? at(1640, Y - 260, `<path d="${rr(-170, -70, 340, 130, 26)}" fill="${P.coral}"/>${text(0, 36, "60 ns", 90, "#fff")}`, pop(tag)) : "")
    , c) + at(250, 200, calPage("2011", "", 0.8), pop(a - 0.2));
  return { g, in: [960, 300], inC: P.cream, out: toScreen(c, 1640, Y + 70), outC: P.mint };
}

// ---- 3: past the speed limit; the sign cracks ----
const cSign = (crack = 0) => `<path d="M-14 0V-420" stroke="${P.steel}" stroke-width="28"/>${disc(0, -560, 170, "#fff", "#dfe6f0", 0.05)}<circle cx="0" cy="-560" r="150" fill="none" stroke="${P.red}" stroke-width="36"/>${text(0, -490, "c", 210, P.ink)}
  ${crack > 0 ? drawn("M-60 -700L-20 -610L-70 -560L10 -500L-30 -420", crack, P.ink, 10, 'stroke-linejoin="round"') + drawn("M80 -680L40 -600L90 -540", crack, P.ink, 8, 'stroke-linejoin="round"') : ""}`;
function s3(a, tot, s) {
  const D = dur(s, 3, 3.6), c = camAt(a, [[0, 820, 540, 1.0], [D, 780, 540, 1.08]]);
  const z = seg(a, 0.25, 0.85), nx = lerp(-200, 2200, easeIn(z)), crack = seg(a, 1.0, 1.4), shake = crack > 0 && crack < 1 ? 8 * Math.sin(tot * 60) : 0;
  const g = paperBg(c, tot, 23, false) + layer(`<rect x="-1000" y="900" width="4000" height="600" fill="${P.road}"/><path d="M-1000 960H3000" stroke="${P.chalk}" stroke-width="8" stroke-dasharray="80 60" opacity=".4"/>` + at(700 + shake, 900, cSign(crack)) + (z > 0 && z < 1 ? at(nx, 820, neutrino(24, 380), 1.3) : "") + (a > D * 0.55 ? cross(1060, 300, 70, P.red, a - D * 0.55) : ""), c);
  return { g, in: [960, 700], inC: P.mint, out: toScreen(c, 700, 340), outC: P.red };
}

// ---- 4: a hundred years of physics standing on c ----
const blockCols = [[P.violet, P.violetD], [P.blue, P.blueD], [P.coral, P.coralD], [P.gold, P.goldD], [P.mint, P.mintD], [P.pink, P.pinkD]];
function s4(a, tot, s) {
  const D = dur(s, 4, 6.0), BASE = 960, c = camAt(a, [[0, 960, 700, 1.1], [D * 0.6, 960, 420, 0.62], [D, 960, 430, 0.6]]);
  const grow = easeOut(seg(a, 0.6, D * 0.6)), n = Math.floor(12 * grow + 0.001), year = Math.round(lerp(1905, 2011, grow));
  const hit = a - D * 0.72, wob = hit > 0 ? 3 * Math.exp(-2.5 * hit) * Math.sin(hit * 14) : 0;
  let blocks = "";
  for (let i = 0; i < n; i++) { const [cc, cD] = blockCols[i % 6], w = 360 - (i % 3) * 40 + (i % 2) * 30, y = BASE - 120 - (i + 1) * 92; blocks += `<path d="${rr(960 - w / 2 + Math.sin(i * 2.3) * 30, y, w, 88, 8)}" fill="${cD}"/><path d="${rr(960 - w / 2 + Math.sin(i * 2.3) * 30, y, w - 10, 80, 8)}" fill="${cc}"/>`; }
  const tower = `<g transform="rotate(${wob.toFixed(2)} 960 ${BASE})">${two(rr(760, BASE - 120, 400, 120, 12), P.gold, P.goldD, 0, 10)}${text(960, BASE - 22, "c", 110, "#8a5200")}${blocks}</g>`;
  const yr = `<path d="${rr(1300, 120, 300, 120, 20)}" fill="${P.ink}"/>${number(1450, 212, String(year), 96, P.chalk)}`;
  const nz = hit > -0.6 && hit < 0 ? at(lerp(-200, 760, ease((hit + 0.6) / 0.6)), BASE - 60, neutrino(22, 200), 1.2) : "";
  const g = paperBg(c, tot, 24, false) + layer(`<rect x="-2000" y="${BASE}" width="6000" height="900" fill="${P.ground}"/>` + tower + nz + (hit > 0 ? rings(760, BASE - 60, 120 * spring(hit, 7, 11), P.mint, 0.3) : ""), c) + yr;
  return { g, in: [960, 600], inC: P.red };
}

// ---- 5: hide it in the drawer, or announce it ----
function s5(a, tot, s) {
  const D = dur(s, 5, 5.8), c = camAt(a, [[0, 700, 560, 1.05], [D * 0.45, 760, 560, 1.05], [D, 1180, 540, 1.05]]);
  const open = kf(a, [[0, 0], [0.4, 1], [D * 0.42, 1], [D * 0.5, 0]]);
  // the sheet: hovers, dips toward the drawer, then rises and flies to the podium
  const p1 = seg(a, 0.4, D * 0.3), p2 = seg(a, D * 0.5, D * 0.8);
  const pos = p2 > 0 ? bez([560, 560], [1100, 100], [1500, 520], ease(p2)) : [560, lerp(420, 640, Math.sin(Math.PI * p1) * 0.9)];
  const g = layer(room(900) + `<path d="${rr(1200, 140, 600, 380, 12)}" fill="${P.ground}"/>` + at(560, 900, drawerDesk(open)) + at(1500, 900, podium({ c: P.violet, cD: P.violetD })) + (p2 >= 1 ? "" : at(pos[0], pos[1], sheet(), 0.9, 10 * Math.sin(tot * 3))) + (p2 >= 1 ? at(1500, 560, sheet(), 0.6 * pop(a - D * 0.8)) : ""), c);
  return { g, out: toScreen(c, 1500, 560), outC: P.cream };
}

// ---- 6: here are our numbers, find the mistake ----
function s6(a, tot, s) {
  const D = dur(s, 6, 7.0), G2 = 900, c = camAt(a, [[0, 900, 520, 1.05], [D * 0.45, 900, 520, 1.0], [D * 0.62, 760, 520, 0.85], [D, 740, 520, 0.84]]);
  const fl = [0.4, 0.9, 1.5, 2.2, 2.8].map((t, i) => at([420, 1240, 560, 1180, 360][i], [640, 600, 760, 720, 520][i], flash(seg(a, t, t + 0.35)))).join("");
  const GLX = 360, GLY = 300;
  const out = Array.from({ length: 6 }, (_, i) => { const t0 = D * 0.55 + i * 0.18, p = seg(a, t0, t0 + 0.9); if (p <= 0) return ""; const ang = -2.4 + i * 0.55, tgt = [GLX + Math.cos(ang) * 290, GLY + Math.sin(ang) * 290];
    return p < 1 ? at(...bez([900, 640], [700, 120], tgt, ease(p)), sheet(), 0.4) : at(tgt[0], tgt[1], magnifier(46, "", "mg6" + i), 0.9 * pop(a - t0 - 0.9)); }).join("");
  const gl = at(GLX, GLY, globe(230, 0.1 + tot * 0.01, { id: "a6", ...G0 }), pop(a - D * 0.5));
  const g = layer(room(G2) + `<path d="M500 ${G2}L900 140L1300 ${G2}Z" fill="${P.mint}" opacity=".05"/>` + at(900, 330, stopwatch(170, 0.17, "60", { bigFill: P.coral })) + at(900, G2 + 10, podium({ c: P.violet, cD: P.violetD }), 0.85) + gl + out + fl, c);
  return { g, in: toScreen(c, 900, 600), inC: P.cream };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const announceSet = makeSet(SHOTS, [], P);
