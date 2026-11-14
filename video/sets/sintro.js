// Science part 1, intro: five shots, no words on screen.
//   0 the night planet; a bright atom rises over it and the little lit windows on the globe all turn toward it (humans trust it)
//   1 on the curve of the planet: a plane takes off, a pill bottle hops up, a tower climbs to twenty floors, each under the atom
//   2 pull back: question marks pop up over half of the planet (half of them ask why trust it)
//   3 a press conference, 2011: a podium with microphones, camera flashes, a giant stopwatch behind; a dot of light races a
//     neutrino and the neutrino noses ahead (something faster than light)
//   4 a police line-up wall; a spotlight falls on the suspect: a cable plug that is not pushed all the way in
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { globe } from "./props.js";
import { P, mix, dur, pop, nightSky, room, stopwatch, podium, flash, neutrino, photon, plane, pillBottle, tower, cablePlug, thought } from "./sci.js";
import { calPage } from "./props.js";

const atom = (tot, k = 1) => at(0, 0, `${rings(0, 0, 110, P.mint, 0.18)}${[0, 60, 120].map((r) => `<ellipse rx="150" ry="52" fill="none" stroke="${P.mint}" stroke-width="12" transform="rotate(${r + tot * 20})"/>`).join("")}${disc(0, 0, 34, P.gold, P.goldD)}${[0, 1, 2].map((i) => { const a = tot * 2.4 + i * 2.1, r = (i * 60 + tot * 20) * Math.PI / 180; const x = Math.cos(a) * 150, y = Math.sin(a) * 52; return `<circle cx="${(x * Math.cos(r) - y * Math.sin(r)).toFixed(1)}" cy="${(x * Math.sin(r) + y * Math.cos(r)).toFixed(1)}" r="14" fill="${P.chalk}"/>`; }).join("")}`, k);
const GX = 960, GY = 1500, GR = 900;   // the planet: a huge globe whose top is the horizon
const lights = (tot, turn) => Array.from({ length: 16 }, (_, i) => { const a = -Math.PI / 2 + (i - 7.5) * 0.085, x = GX + Math.cos(a) * (GR - 30), y = GY + Math.sin(a) * (GR - 30);
  return at(x, y, `<path d="${rr(-14, -34, 28, 34, 4)}" fill="#0b2c3d"/><path d="${rr(-8, -26, 16, 14, 3)}" fill="${mix("#33506a", P.win, turn)}"/>`, 1, (a + Math.PI / 2) * 57.3); }).join("");

// ---- 0: an atom rises over the planet, every window lights toward it ----
function s0(a, tot, s) {
  const D = dur(s, 0, 4.2), c = camAt(a, [[0, 960, 640, 0.92], [D, 960, 560, 1.02]]);
  const rise = easeOut(seg(a, 0.3, 0.3 + D * 0.4)), ax = 960, ay = lerp(760, 300, rise), turn = seg(a, D * 0.45, D * 0.8);
  const beam = turn > 0 ? `<path d="M${ax} ${ay}L${GX - 640} ${GY - GR + 120}H${GX + 640}Z" fill="${P.mint}" opacity="${(0.08 * turn).toFixed(3)}"/>` : "";
  const g = nightSky(c, tot, 7, false) + layer(beam + at(GX, GY, globe(GR, 0.1, { id: "i0", night: 0.12, sea: "#145f73", land: "#3fd0a6", rim: "#7fe8d6", glow: "#5ef0c8" })) + lights(tot, turn) + at(ax, ay, atom(tot), 1.1 * pop(a - 0.3)), c);
  return { g, out: toScreen(c, ax, ay), outC: P.night0, outZ: 14 };
}

// ---- 1: plane, pills, a twenty-floor tower ----
function s1(a, tot, s) {
  const D = dur(s, 1, 5.2), c = camAt(a, [[0, 960, 560, 1.0], [D, 1000, 520, 1.06]]);
  const t1 = D * 0.12, t2 = D * 0.45, t3 = D * 0.68;
  const pl = seg(a, t1, t1 + 1.6), px = lerp(260, 1300, easeIn(pl) * 0.4 + pl * 0.6), py = lerp(560, 160, easeIn(pl));
  const floors = Math.round(20 * easeOut(seg(a, t3, t3 + 1.3)));
  const ground = at(GX, GY, globe(GR, 0.1, { id: "i1", night: 0.12, sea: "#145f73", land: "#3fd0a6", rim: "#7fe8d6", glow: "#5ef0c8" })) + lights(tot, 1);
  const pills = at(940, GY - GR + 6, pillBottle(), 1.5 * pop(a - t2));
  const tw = floors > 0 ? at(1360, GY - GR + 120, tower(floors, "#2b6a80", "#1f5266"), 0.62) : "";
  const top = floors > 0 ? GY - GR + 120 - (floors * 46 + 30) * 0.62 : 0;
  const ticks = [[px, py - 120, a > t1 + 0.3], [940, GY - GR - 330, a > t2 + 0.3], [1360, top - 80, floors >= 20]].map(([x, y, on], i) => (on ? at(x, y, atom(tot), 0.32 * pop(a - [t1 + 0.3, t2 + 0.3, t3 + 1.3][i])) : "")).join("");
  const g = nightSky(c, tot, 8, false) + layer(ground + pills + tw + (pl > 0 && pl < 1 ? at(px, py, plane(), 0.7, -18 * easeIn(pl)) : "") + ticks, c);
  return { g, in: [960, 300], inC: P.night0, inZ: 14, out: toScreen(c, 960, 500), outC: P.night0 };
}

// ---- 2: half the planet asks ----
function s2(a, tot, s) {
  const D = dur(s, 2, 6.5), c = camAt(a, [[0, 960, 560, 1.0], [D * 0.3, 960, 540, 0.62], [D, 900, 540, 0.6]]);
  const qs = [[-0.95, 0.1], [-0.7, -0.55], [-0.5, 0.45], [-0.25, -0.2], [-0.8, 0.7], [-0.15, 0.75], [-0.55, -0.85]];
  const marks = qs.map(([x, y], i) => { const t0 = D * 0.32 + i * 0.32; return a > t0 ? at(960 + x * 520, 540 + y * 420 - 110, thought("?"), 0.75 * pop(a - t0) * (1 + 0.04 * Math.sin(tot * 3 + i))) : ""; }).join("");
  const half = `<path d="M960 ${540 - 560}A560 560 0 0 0 960 ${540 + 560}Z" fill="${P.coral}" opacity="${(0.18 * seg(a, D * 0.3, D * 0.5)).toFixed(3)}"/>`;
  const g = nightSky(c, tot, 9, false) + layer(at(960, 540, globe(560, 0.1 + tot * 0.01, { id: "i2", night: 0.1, sea: "#145f73", land: "#3fd0a6", rim: "#7fe8d6", glow: "#5ef0c8" })) + half + marks, c);
  return { g, in: [960, 300], inC: P.night0 };
}

// ---- 3: the press conference, 2011: faster than light ----
function s3(a, tot, s) {
  const D = dur(s, 3, 7.4), G = 860, c = camAt(a, [[0, 960, 520, 1.25], [D * 0.55, 960, 500, 1.0], [D, 960, 470, 0.96]]);
  const fl = [0.7, 1.4, 2.1, 2.6, D * 0.75, D * 0.85].map((t, i) => at([420, 1500, 640, 1320, 520, 1420][i], [620, 560, 700, 640, 520, 700][i], flash(seg(a, t, t + 0.35)))).join("");
  const sw = at(960, 290, stopwatch(190, (a * 0.6) % 1, ""), pop(a - 0.2, 7, 11));
  // the race on a strip under the watch: light and a neutrino; the neutrino ends a nose ahead
  const r = seg(a, D * 0.5, D * 0.85), lx = lerp(560, 1340, ease(r)), nx = lx + 60 * seg(r, 0.6, 1);
  const race = r > 0 ? `<path d="${rr(520, 600, 880, 70, 35)}" fill="#0b2c3d" opacity=".8"/><path d="M1380 590V680" stroke="${P.chalk}" stroke-width="8" stroke-dasharray="14 10"/>` + at(lx, 618, photon(140), 0.9) + at(nx, 652, neutrino(16, 110), 1) : "";
  const cal = at(1640, 280, calPage("2011", "", 0.8), pop(a - 0.5));
  const g = nightSky(c, tot, 10, false) + layer(room(G, "#0f3b50", "#082433") + `<path d="M300 ${G}L960 120L1620 ${G}Z" fill="${P.mint}" opacity=".05"/>` + sw + cal + at(960, G + 10, podium({ c: P.violet, cD: P.violetD }), 0.85) + race + fl, c);
  return { g, in: toScreen(c, 960, 290), inC: P.cream, out: toScreen(c, 960, 290), outC: P.ink };
}

// ---- 4: the suspect ----
function s4(a, tot, s) {
  const D = dur(s, 4, 4.2), c = camAt(a, [[0, 1040, 540, 0.95], [D, 1060, 560, 1.12]]);
  const wall = `<rect x="-200" y="-200" width="2400" height="1500" fill="#0e3346"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M-200 ${200 + i * 90}H2400" stroke="${P.chalk}" stroke-width="${i % 2 ? 3 : 6}" opacity=".25"/>`).join("");
  const spot = ease(seg(a, D * 0.35, D * 0.55)), gap = 0.6 + 0.08 * Math.sin(tot * 6);
  const cone = spot > 0 ? `<path d="M1000 -100L700 860H1460L1160 -100Z" fill="#fff6c8" opacity="${(0.18 * spot).toFixed(3)}"/><ellipse cx="1080" cy="860" rx="380" ry="40" fill="#fff6c8" opacity="${(0.22 * spot).toFixed(3)}"/>` : "";
  const sparks = a > D * 0.55 ? [0, 1, 2, 3].map((i) => { const q = (tot * 3 + i / 4) % 1; return `<circle cx="${1100 + 30 * Math.cos(i * 1.7)}" cy="${560 - 70 * q}" r="${7 * (1 - q)}" fill="${P.gold}"/>`; }).join("") : "";
  const plug = at(1040, 560, cablePlug(gap, tot), 1.15);
  const g = layer(wall, c, 0.8) + `<rect width="${FW}" height="${FH}" fill="${P.ink}" opacity="${(0.45 * spot).toFixed(3)}"/>` + layer(cone + plug + sparks, c);
  return { g, in: [960, 540], inC: P.ink };
}

const SHOTS = [s0, s1, s2, s3, s4];
export const sintroSet = makeSet(SHOTS, [], P);
