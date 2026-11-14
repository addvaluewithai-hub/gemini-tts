// "Why is it called cellular?": twelve shots with nothing to read but numbers and symbols.
//   0 a night map seen from above: hexagons draw themselves over the land, a tower pops up in every one
//   1 three coloured channel ribbons hang over the map (the air is limited); each cell takes one colour, the colours
//     repeat so no two touching cells share one; two far cells of the same colour are linked ✓; pull back: a coin
//     pops on every pink cell (the same air sold over and over)
//   2 the city: a carpet of tiny cells between the roofs, a tower every few streets; the camera travels on to the
//     desert, where one huge cell holds one lonely tower (host right)
//   3 one tower: its three panels light and each throws a beam its own way; the blue phone's rings are tiny, a small
//     bulb beside it outshines them; the tower's panels grow into big ears and gather the faint rings (host right)
//   4 the phone far from the tower shouts: its rings grow big and hot; the battery above it drains to red (host left)
//   5 a neat street of houses; a bare tower springs up between them and gets a red ✗
//   6 fronds drop on it: a palm; a second tower gets a round green crown: a tree
//   7 push in on the palm: the white panels poke out of the fronds, the red light blinks; glasses and a moustache
//     land on the trunk (a bad disguise) (host left)
//   8 a dark room: the blue phone lies still on a night table; every few seconds a small "here" ring goes out of the
//     window to the tower, which blinks back; then the tower sends a gold call back and the phone rings
//   9 the map again: three towers around the phone, each draws a circle; the circles meet, a gold pin drops on the
//     phone; a satellite above gets a ✗ (host right)
//  10 a road at night under three coloured cell domes; a car drives through, its link line hops from tower to tower
//  11 at a border the link stretches and snaps; the phone shows ? ? ?; pull back: question marks pop all over the
//     planet (host left)
// Shots 0 and 1 are one map seen by one camera (no hand-over shape between them), as are 5–7 (one street).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, house, stars, skyline, coin } from "./bank.js";
import { car, globe } from "./props.js";
import { WAVE, PULSE, pop, bluePhone, ringing, radio, waveLine, tower, hexPath, hexGrid, GROUP, palmTower, satellite } from "./net.js";

// where a point of a far layer (depth d) lands on screen
const farScreen = (c, x, y, d) => { const k = Math.pow(c.z, d); return [FW / 2 + (x - (FW / 2 + (c.x - FW / 2) * d)) * k, FH / 2 + (y - (FH / 2 + (c.y - FH / 2) * d)) * k]; };
const LAND = "#2a1f63", LANDD = "#221a52";
const night = () => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>`;
// a tower seen on the map: small, standing in its cell
const mapTower = (k, t, lit = 0) => at(0, 40, tower({ t, lit }), 0.26 * k);

// ---- the map (shots 0, 1, 9) ----
// three colours so that no two touching cells share one (axial q - r, mod 3); net.js's own groups repeat on neighbours
const recolour = (cells) => cells.map((h) => ({ ...h, g: (((h.i - (h.j - (h.i - (h.i & 1)) / 2)) % 3) + 3) % 3 }));
const R = 150, GRID = recolour(hexGrid(-300, -200, R, 13, 7)).filter((h) => h.x > -400 && h.x < 2350 && h.y < 1350);
const centreDist = (h) => Math.hypot(h.x - 960, h.y - 540);
const NEAR = GRID.filter((h) => centreDist(h) < R * 1.9).map((h) => h);           // the first cells that take a colour
const nearest = (cells, x, y) => cells.slice().sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y))[0];
const PAIR = (() => { const pink = GRID.filter((h) => h.g === 0), a = nearest(pink, 560, 420); return [a, nearest(pink.filter((h) => Math.hypot(h.x - a.x, h.y - a.y) > R * 2.5), 1380, 420)]; })();
const ground = (seed) => { let d = ""; for (let i = 0; i < 14; i++) { const x = -500 + rnd(seed + i) * 3000, y = -400 + rnd(seed + i + 40) * 1900, w = 200 + rnd(seed + i + 80) * 400; d += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${w.toFixed(0)}" ry="${(w * 0.55).toFixed(0)}" fill="${LANDD}"/>`; }
  return `<rect x="-1400" y="-1200" width="5200" height="3800" fill="${LAND}"/>${d}<path d="M-600 1100Q400 780 900 1000T2600 820" fill="none" stroke="#3a6fd8" stroke-width="46" opacity=".55"/>`; };
const GROUND = ground(3);

function map(a, tot, o) {
  let lines = "", fills = "", towers = "";
  GRID.forEach((h, i) => { const d = centreDist(h) / 1600, dr = o.draw(h, d), fl = o.fill ? o.fill(h, d, i) : 0, tw = o.tower(h, d);
    if (fl > 0) fills += `<path d="${hexPath(h.x, h.y, R - 6)}" fill="${GROUP[h.g][0]}" opacity="${(0.62 * fl).toFixed(3)}"/>`;
    if (dr > 0) lines += drawn(hexPath(h.x, h.y, R), dr, "#9fe7ff", 6, 'stroke-linejoin="round" opacity=".75"');
    if (tw > 0) towers += at(h.x, h.y, mapTower(pop(tw), tot + i, o.lit ? o.lit(h) : 0)); });
  return GROUND + fills + lines + towers;
}
// ---- 0: the land is cut into cells, a tower in each ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.18], [2.6, 960, 545, 1.05], [4.55, 960, 540, 1.0]]);
  const g = night() + layer(map(a, tot, { draw: (h, d) => seg(a, 1.3 + d * 1.1, 1.85 + d * 1.1), tower: (h, d) => a - (3.06 + d * 1.2) }), c);
  return { g };
}
// ---- 1: each cell takes a group of channels; cells that do not touch reuse it ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [6.2, 960, 540, 0.98], [8.0, 960, 560, 0.66], [8.76, 960, 560, 0.64]]);
  const fill = (h, d) => (NEAR.includes(h) ? ease(seg(a, 2.22 + d * 0.8, 2.6 + d * 0.8)) : ease(seg(a, 3.59 + d * 2.0, 3.95 + d * 2.0)));
  // the three ribbons of air, hung over the map; they fall into the cells as the cells take them
  const take = ease(seg(a, 2.1, 2.9)), ribbons = [0, 1, 2].map((i) => { const on = pop(a - 0.79 - i * 0.18), y = 150 + i * 70;
    return on > 0 ? `<g opacity="${(1 - take).toFixed(3)}" transform="translate(960 ${(y + 300 * take).toFixed(1)}) scale(${(on * (1 - 0.5 * take)).toFixed(3)}) translate(-960 ${-y})">${waveLine(560, 1360, y, 120, 18, tot, GROUP[i][0], 16)}</g>` : ""; }).join("");
  const box = a > 0.6 ? `<path d="${rr(520, 100, 880, 240, 30)}" fill="${P.ink}" opacity="${(0.55 * pop(a - 0.6) * (1 - take)).toFixed(3)}"/>` : "";
  // the two far cells of one colour, linked: the same air, used again
  const [A, B] = PAIR, lk = ease(seg(a, 4.8, 5.6)), mid = [(A.x + B.x) / 2, Math.min(A.y, B.y) - 330];
  const link = lk > 0 ? drawn(`M${A.x} ${A.y}Q${mid[0]} ${mid[1]} ${B.x} ${B.y}`, lk, P.cream, 10, 'stroke-dasharray="0.02 0.02"') + [A, B].map((h) => rings(h.x, h.y, 120 * lk, P.pink, 0.25)).join("") + (a > 5.6 ? check(mid[0], mid[1] + 160, 60, P.green, a - 5.6) : "") : "";
  // pull back: a coin on every pink cell, one after another
  let coins = ""; GRID.forEach((h, i) => { if (h.g !== 0) return; const u = a - 6.6 - (centreDist(h) / 1600) * 1.4; if (u > 0) coins += at(h.x, h.y - 70, rings(0, 0, 50, P.gold, 0.25) + coin(42, "$"), pop(u) * 1.3); });
  const g = night() + layer(map(a, tot, { draw: () => 1, tower: () => 9, fill }) + link + coins, c) + box + ribbons;
  return { g, out: toScreen(c, A.x, A.y), outC: GROUP[0][0], outZ: 18 };
}
// ---- 2: small cells in the city, one huge cell in the desert (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [2.8, 960, 540, 1.02], [3.7, 3150, 560, 0.86], [5.46, 3150, 560, 0.8]]);
  // the city: roofs in a grid, small hexagons over it, a tiny tower every few streets
  let city = `<rect x="-200" y="-300" width="2300" height="1700" fill="#2c2266"/>`;
  for (let i = 0; i < 16; i++) for (let j = 0; j < 10; j++) { const x = -80 + i * 128, y = -150 + j * 128, w = 70 + rnd(i * 17 + j) * 30; city += `<path d="${rr(x, y, w, w * (0.7 + rnd(i + j * 9) * 0.3), 6)}" fill="${rnd(i * 5 + j * 3) > 0.5 ? "#4a3a8f" : "#3d2f80"}"/>${rnd(i * 7 + j) > 0.75 ? `<rect x="${x + 14}" y="${y + 14}" width="16" height="16" rx="3" fill="${P.win}"/>` : ""}`; }
  const r = 105; recolour(hexGrid(-150, -230, r, 15, 9)).forEach((h, i) => { const d = Math.hypot(h.x - 900, h.y - 540) / 1400, on = seg(a, 0.2 + d * 0.9, 0.6 + d * 0.9);
    if (on > 0 && h.x < 2060) city += `<path d="${hexPath(h.x, h.y, r - 3)}" fill="${GROUP[h.g][0]}" opacity="${(0.5 * on).toFixed(3)}"/>` + drawn(hexPath(h.x, h.y, r), on, "#c9f4ff", 6, 'opacity=".9"');
    const tw = h.x < 2060 ? a - 1.21 - d * 0.9 : -1; if (tw > 0) city += at(h.x, h.y + 10, mapTower(pop(tw) * 0.85, tot + i)); });
  // the desert: sand, dunes, one hexagon as wide as the screen and one tower in it
  const DX = 3150, DY = 540, DR = 520, dOn = seg(a, 3.25, 3.9);
  let desert = `<rect x="2100" y="-300" width="2600" height="1700" fill="#c98a4a"/>`;
  for (let i = 0; i < 9; i++) desert += `<path d="M${2100 + i * 300} ${-100 + (i % 3) * 420}q150 -60 300 0" stroke="#a86a32" stroke-width="14" fill="none"/>`;
  desert += `<path d="${hexPath(DX, DY, DR - 8)}" fill="${GROUP[2][0]}" opacity="${(0.35 * dOn).toFixed(3)}"/>` + drawn(hexPath(DX, DY, DR), dOn, "#fff4dc", 10, 'stroke-linejoin="round"') + (a > 3.59 ? at(DX, DY, rings(0, -80, 160, P.gold, 0.12) + mapTower(pop(a - 3.59) * 2.4, tot)) : "");
  desert += `<path d="M2100 -300h40v1700h-40Z" fill="#a86a32"/>`;
  const g = night() + layer(city + desert, c);
  return { g, in: toScreen(c, 900, 540), inC: GROUP[0][0], inZ: 14, out: toScreen(c, DX, DY + 40 - 0.26 * 2.4 * 606), outC: P.red, outZ: 22 };
}
// ---- 3: three panels, three ways; the phone is weaker than a little bulb; the tower has big ears (host right) ----
const G3 = 900;
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 520, 1.08], [2.2, 900, 540, 1.0], [5.3, 900, 540, 1.0], [6.54, 820, 520, 1.06]]), TX = 560;
  const lit = ease(seg(a, 0.87, 1.3)), ears = 1 + 0.9 * ease(seg(a, 5.44, 6.0));
  // three beams, one per panel: left, right and toward us
  const beam = (i, t0) => { const on = ease(seg(a, t0, t0 + 0.4)); if (on <= 0) return ""; const top = G3 - 480;
    if (i === 2) return radio(TX, top, tot, 260 * on, { n: 3, speed: 0.8, c: WAVE, w: 9 });
    const s = i === 0 ? -1 : 1, len = 520 * on; return `<path d="M${TX + s * 40} ${top}L${TX + s * (40 + len)} ${top - 150}L${TX + s * (40 + len)} ${top + 150}Z" fill="${WAVE}" opacity=".16"/>` + radio(TX + s * 40, top, tot, len, { n: 3, speed: 0.9, arc: s < 0 ? [165, 195] : [-15, 15], w: 8 }); };
  const beams = beam(0, 1.25) + beam(1, 1.44) + beam(2, 1.67);
  // the phone and its tiny rings; a little bulb outshines them
  const PX = 1080, ph = pop(a - 2.33), bulbOn = pop(a - 4.14), BX = 1330;
  const phone = ph > 0 ? at(PX, G3 - 40, bluePhone({ on: 0.8 }), 1.0 * ph) + radio(PX, G3 - 180, tot, 80, { n: 2, speed: 1.2, w: 4, op: 0.6 }) : "";
  const bulb = bulbOn > 0 ? at(BX, G3 - 40, `${rings(0, -120, 110 * (1 + 0.04 * Math.sin(tot * 7)), "#ffe9a0", 0.28, 1.5)}<circle cy="-120" r="56" fill="#fff3b0"/><path d="${rr(-26, -70, 52, 50, 8)}" fill="${P.steel}"/><path d="M-20 -58h40M-20 -44h40" stroke="${P.steelD}" stroke-width="6"/>`, 1.1 * bulbOn) : "";
  // the tower gathers the faint rings: they flow in to its big panels
  let gather = ""; if (a > 5.6) for (let i = 0; i < 4; i++) { const q = ((a - 5.6) * 1.1 + i / 4) % 1, p = bez([PX, G3 - 180], [860, G3 - 700], [TX + 60, G3 - 480], q); gather += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${(16 - 8 * q).toFixed(1)}" fill="${P.pink}" opacity="${(0.9 * (1 - q * 0.5)).toFixed(2)}"/>`; }
  const hill = `<path d="M-600 ${G3}Q400 ${G3 - 80} 1200 ${G3}T2600 ${G3}V1700H-600Z" fill="#1d2a5e"/><rect x="-600" y="${G3}" width="3200" height="800" fill="#1d2a5e"/>`;
  const g = night() + layer(stars(31, 70, -300, 2300, 600, tot), c, 0.15) + layer(skyline(8, -400, 2400, G3 - 20, 80, 220, "#251a5c", "#ffb066"), c, 0.5)
    + layer(hill + beams + at(TX, G3, tower({ t: tot, lit, k: ears }), 1.05) + gather + bulb + phone, c);
  return { g, in: toScreen(c, TX, G3 - 606 * 1.05), inC: P.red, inZ: 22, out: toScreen(c, PX, G3 - 160), outC: P.blue, outZ: 18 };
}
// ---- 4: far from the tower the phone shouts, and the battery dies (host left) ----
const battery = (lvl) => { const col = lvl > 0.5 ? P.green : lvl > 0.2 ? P.gold : P.red; return `${two(rr(-60, -130, 120, 230, 20), "#f1f4ff", "#c4cbe6", 0, 8)}<path d="${rr(-24, -150, 48, 24, 8)}" fill="#c4cbe6"/><path d="${rr(-44, -112 + 194 * (1 - lvl), 88, Math.max(4, 194 * lvl), 10)}" fill="${col}"/>`; };
function s4(a, tot) {
  const c = camAt(a, [[0, 1060, 520, 1.0], [5.72, 1080, 520, 1.04]]), G = 880, TX = 620, PX = 1420;
  const shout = ease(seg(a, 1.06, 2.4)), r = lerp(150, 760, shout), w = lerp(5, 18, shout), col = mix(WAVE, P.gold, shout);
  const shake = shout * 6 * Math.sin(tot * 40);
  const lvl = lerp(1, 0.06, ease(seg(a, 3.3, 5.3)));
  const phone = at(PX + shake, G - 120, bluePhone({ on: 1 }), 0.95) + radio(PX, G - 250, tot, r, { n: 3, speed: lerp(0.6, 1.4, shout), w, c: col, arc: [150, 260] });
  const batt = a > 3.12 ? at(PX + 190, 330, (lvl < 0.2 ? rings(0, -20, 160, P.red, 0.18 * (0.5 + 0.5 * Math.sin(tot * 9))) : "") + battery(lvl), pop(a - 3.12)) : "";
  const land = `<path d="M-600 ${G}Q500 ${G - 40} 900 ${G}Q1300 ${G + 20} 1500 ${G - 160}Q1700 ${G - 220} 2600 ${G - 140}V1700H-600Z" fill="#1d2a5e"/>`;
  const g = night() + layer(stars(44, 70, -300, 2300, 600, tot) + `<circle cx="1700" cy="170" r="70" fill="#ffd98a"/>`, c, 0.15) + layer(skyline(21, -400, 900, G - 10, 60, 160, "#251a5c", "#ffb066"), c, 0.5)
    + layer(land + at(TX, G, tower({ t: tot, lit: 0.3 }), 0.72) + phone + batt, c);
  return { g, in: toScreen(c, PX, G - 250), inC: P.blue, inZ: 18, out: farScreen(c, 1700, 170, 0.15), outC: "#ffd98a", outZ: 24 };
}
// ---- 5–7: a neat street; a tower that does not belong; its disguise ----
const G5 = 880, T1 = 860, T2 = 1420;
const glasses = (on) => at(0, 0, `<circle cx="-34" cy="0" r="26" fill="#9fe7ff" opacity=".35" stroke="${P.ink}" stroke-width="9"/><circle cx="34" cy="0" r="26" fill="#9fe7ff" opacity=".35" stroke="${P.ink}" stroke-width="9"/><path d="M-8 0h16" stroke="${P.ink}" stroke-width="8"/><path d="M-50 54Q-26 34 0 48Q26 34 50 54Q26 66 0 58Q-26 66 -50 54Z" fill="${P.ink}"/>`, on);
function street(t, c, tot, s) {
  const ends = s.ends || [], T6 = ends[5] || 1.98, T7 = T6 + (ends[6] || 1.76), u6 = t - T6, u7 = t - T7;
  const up = t > 0.85 ? spring(t - 0.85, 8, 14) : 0, palm = ease(seg(u6, 0.1, 0.55)), tree = ease(seg(u6, 1.0, 1.4)), ears = ease(seg(u7, 0.2, 0.6)), mask = u7 > 0.34 ? pop(u7 - 0.34) : 0;
  const houses = [[220, P.blue, P.blueD], [520, P.teal, P.tealD], [1140, P.pink, P.pinkD], [1720, P.violet, P.violetD], [2000, P.gold, P.goldD]].map(([x, c1, c2]) => at(x, G5, house(c1, c2, { lit: [1, 1, 1] }), 0.95)).join("");
  // tower 1: bare, then a palm; tower 2 comes up behind and becomes a tree
  const t1 = palm < 1 ? at(T1, G5 + 600 * (1 - up), tower({ t: tot }), 0.9 * (1 - 0.15 * palm)) : "";
  const palmT = palm > 0 ? at(T1, G5 - 80 * (1 - palm) * 0, palmTower({ ears: ears, sway: Math.sin(tot * 1.5) }), 0.95 * (palm > 0 ? (0.6 + 0.4 * spring(u6 - 0.1, 8, 14)) : 0)) : "";
  const fronds = palm > 0 && palm < 1 ? at(T1, -200 + (G5 - 560 + 200) * palm, `<path d="M0 0Q-160 -40 -240 60M0 0Q160 -40 240 60M0 0Q-60 -120 -160 -100M0 0Q60 -120 160 -100" stroke="#3ddc97" stroke-width="40" stroke-linecap="round" fill="none"/>`) : "";
  const t2up = u6 > 0.75 ? spring(u6 - 0.75, 8, 14) : 0;
  const t2 = t2up > 0 ? at(T2, G5 + 500 * (1 - t2up), tower({ t: tot + 1 }), 0.7) + (tree > 0 ? at(T2, G5 - 300, `<rect x="-26" y="10" width="52" height="300" fill="#8a5a32"/>${disc(0, -60, 210 * pop(u6 - 1.0), "#3ddc97", "#1fa86c")}${disc(-120, 30, 120 * pop(u6 - 1.05), "#3ddc97", "#1fa86c")}${disc(120, 30, 130 * pop(u6 - 1.1), "#3ddc97", "#1fa86c")}${ears > 0 ? at(150, -230 + 20 * (1 - ears), `<path d="${rr(-12, -40, 24, 80, 6)}" fill="#e8ecff"/>`, 1, 20) : ""}`, 0.75) : "") : "";
  const bad = t > 1.21 && palm < 0.5 ? cross(T1 + 150, G5 - 520, 60, P.red, t - 1.21) : "";
  const disguise = mask > 0 ? at(T1, G5 - 300, glasses(mask)) : "";
  const road = `<rect x="-600" y="${G5}" width="3200" height="400" fill="${P.ground}"/><rect x="-600" y="${G5 + 70}" width="3200" height="110" fill="${P.road}"/><path d="M-600 ${G5 + 125}H2600" stroke="#ff8a5c" stroke-width="8" stroke-dasharray="70 60" opacity=".5"/>`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>` + layer(`<circle cx="1500" cy="250" r="150" fill="#ffd98a"/>`, c, 0.14) + layer(skyline(5, -400, 2400, G5 - 40, 120, 300, "#5a2a8c", "#ffb066"), c, 0.5)
    + layer(road + houses + t1 + t2 + palmT + fronds + bad + disguise, c);
}
function s5(a, tot, s) { const c = camAt(a, [[0, 1000, 540, 0.98], [1.98, 1000, 520, 1.0]]); return { g: street(a, c, tot, s), in: farScreen(c, 1500, 250, 0.14), inC: "#ffd98a", inZ: 14 }; }
function s6(a, tot, s) { const T6 = (s.ends || [])[5] || 1.98, c = camAt(a, [[0, 1000, 520, 1.0], [1.76, 1040, 500, 1.04]]); return { g: street(T6 + a, c, tot, s) }; }
function s7(a, tot, s) { const T7 = ((s.ends || [])[5] || 1.98) + ((s.ends || [])[6] || 1.76), c = camAt(a, [[0, 1040, 500, 1.04], [0.8, 980, 470, 1.32], [2.54, 975, 465, 1.38]]);
  return { g: street(T7 + a, c, tot, s), out: farScreen(c, 1500, 250, 0.14), outC: "#ffd98a", outZ: 16 }; }
// ---- 8: the silent phone whispers "here" to the tower ----
function s8(a, tot) {
  const c = camAt(a, [[0, 980, 560, 1.12], [2.0, 960, 540, 1.0], [8.04, 940, 530, 1.04]]), TX = 1420, TY = 620, PX = 560, PY = 760;
  const win = `<path d="${rr(1000, 140, 820, 620, 20)}" fill="#0d0b33"/>` + layer(stars(9, 40, 1000, 1820, 600, tot), c, 0.15) + `<g>${at(TX, 760, tower({ t: tot, lit: 0 }), 0.9)}</g>`
    + `<path d="${rr(1000, 140, 820, 620, 20)}" fill="none" stroke="#6e4322" stroke-width="40"/><path d="M1410 140V760M1000 450H1820" stroke="#6e4322" stroke-width="22"/>`;
  const room = `<rect x="-400" y="-200" width="2800" height="1400" fill="#3a2a7a"/>` + win + `<rect x="-400" y="${PY + 40}" width="2800" height="600" fill="#2a1e5e"/>`
    + `<path d="${rr(300, PY, 520, 40, 10)}" fill="${P.wood}"/><path d="${rr(330, PY + 40, 40, 260, 6)}" fill="${P.woodD}"/><path d="${rr(750, PY + 40, 40, 260, 6)}" fill="${P.woodD}"/>`
    + at(780, PY, `<path d="M-40 0V-90Q-40 -130 0 -130Q40 -130 40 -90V0Z" fill="#ffd27a"/><path d="M-70 -150L-40 -260H40L70 -150Z" fill="#ff8a5c"/>`, 0.8);
  // the phone lies still, screen dark; then the call comes and it lights up and rings
  const call = seg(a, 6.6, 7.3), lit = a > 7.3 ? 1 : 0;
  const ph = at(PX, PY - 2, lit ? ringing(bluePhone({ on: 1 }), tot, 1) : bluePhone({ on: 0.04 }), [1.35, 1.35], -90);
  // "here": a small teal pulse to the tower, which blinks back
  const sends = [3.43, 5.31, 6.0].filter((t0) => a > t0).map((t0) => { const q = seg(a, t0, t0 + 0.7), p = bez([PX, PY - 60], [1000, 300], [TX, 760 - 450], q);
    return (q < 1 ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="18" fill="${WAVE}"/>` + rings(PX, PY - 60, 40 + 80 * seg(a, t0, t0 + 0.3), WAVE, 0.3 * (1 - seg(a, t0, t0 + 0.3))) : "")
      + (a > t0 + 0.7 && a < t0 + 1.2 ? rings(TX, 760 - 450, 70, WAVE, 0.35 * (1 - seg(a, t0 + 0.7, t0 + 1.2))) : ""); }).join("");
  const back = call > 0 && call < 1 ? (() => { const p = bez([TX, 310], [1000, 280], [PX, PY - 60], call); return rings(p[0], p[1], 30, PULSE, 0.4) + `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="22" fill="${PULSE}"/>`; })() : "";
  const g = layer(room + ph + sends + back, c);
  return { g, in: toScreen(c, 780, PY - 0.8 * 205), inC: "#ffd27a", inZ: 16, out: toScreen(c, PX, PY - 60), outC: P.blue, outZ: 20 };
}
// ---- 9: three towers find the phone ----
function s9(a, tot) {
  const c = camAt(a, [[0, 960, 580, 0.98], [3.4, 1000, 560, 0.92], [5.13, 1000, 560, 0.92]]), PH = [760, 600];
  const TW = [[360, 330], [1200, 380], [700, 1000]];
  const circles = TW.map(([x, y], i) => { const R0 = Math.hypot(PH[0] - x, PH[1] - y), on = ease(seg(a, 0.27 + i * 0.4, 1.4 + i * 0.4));
    return `<circle cx="${x}" cy="${y}" r="${(R0 * on).toFixed(1)}" fill="${GROUP[i][0]}" opacity=".12"/><circle cx="${x}" cy="${y}" r="${(R0 * on).toFixed(1)}" fill="none" stroke="${GROUP[i][0]}" stroke-width="10" stroke-dasharray="26 18"/>` + at(x, y, mapTower(1.6, tot + i, on)); }).join("");
  const pin = a > 2.4 ? at(PH[0], PH[1] - 20 * (1 - easeOut(seg(a, 2.4, 2.8))), `${rings(0, -70, 70, P.gold, 0.3)}<path d="M0 0C-40 -60 -64 -90 -64 -124A64 64 0 0 1 64 -124C64 -90 40 -60 0 0Z" fill="${P.red}"/><circle cy="-124" r="26" fill="#fff"/>`, pop(a - 2.4) * 1.3) : "";
  const dot = at(PH[0], PH[1], `${disc(0, 0, 26, P.blue, P.blueD)}`);
  const sat = a > 3.82 ? at(1250, 120, satellite(), 0.55 * pop(a - 3.82)) + (a > 4.35 ? cross(1380, 120, 50, P.red, a - 4.35) : "") : "";
  const g0 = night() + layer(GROUND + GRID.map((h) => drawn(hexPath(h.x, h.y, R), 1, "#9fe7ff", 5, 'opacity=".25"')).join("") + circles + dot + pin + sat, c);
  return { g: g0, in: toScreen(c, PH[0], PH[1]), inC: P.blue, inZ: 20 };
}
// ---- 10, 11: a car on the road under three cells; the call hops from tower to tower; then it drops ----
const G10 = 860, TOW = [500, 1700, 2900, 4100], DOME = 760;
function road(t, c, tot, o) {
  const domes = TOW.map((x, i) => `<path d="M${x - DOME} ${G10}A${DOME} ${DOME * 0.9} 0 0 1 ${x + DOME} ${G10}Z" fill="${GROUP[i % 3][0]}" opacity="${(0.16 + (o.cur === i ? 0.1 : 0)).toFixed(2)}"/><path d="M${x - DOME} ${G10}A${DOME} ${DOME * 0.9} 0 0 1 ${x + DOME} ${G10}" fill="none" stroke="${GROUP[i % 3][0]}" stroke-width="8" stroke-dasharray="22 16" opacity=".8"/>`).join("");
  const towers = TOW.map((x, i) => at(x, G10, tower({ t: tot + i, lit: o.cur === i ? 1 : 0 }), 0.85)).join("");
  const ground = `<rect x="-1000" y="${G10}" width="7000" height="500" fill="${P.ground}"/><rect x="-1000" y="${G10 + 40}" width="7000" height="120" fill="${P.road}"/><path d="M-1000 ${G10 + 100}H6000" stroke="#ff8a5c" stroke-width="8" stroke-dasharray="70 60" opacity=".5"/>`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(12, 90, -800, 5600, 600, tot), c, 0.15) + layer(skyline(17, -900, 5600, G10 - 10, 60, 200, "#251a5c", "#ffb066"), c, 0.5) + layer(ground + domes + towers + o.extra, c);
}
function s10(a, tot) {
  const cx = kf(a, [[0, 300], [6.12, 2600]], (p) => p), c = camAt(a, [[0, 900, 520, 0.9], [6.12, 2400, 520, 0.9]]);
  const cur = cx < 1100 ? 0 : cx < 2300 ? 1 : 2, tx = TOW[cur], last = cur > 0 ? Math.abs(cx - (TOW[cur - 1] + TOW[cur]) / 2) : 9999;
  const flash = last < 120 ? rings(tx, G10 - 410, 120 * (1 - last / 120), P.gold, 0.4) : "";
  const linkCol = mix(WAVE, P.gold, last < 120 ? 1 - last / 120 : 0);
  const link = `<path d="M${cx} ${G10 - 130}Q${(cx + tx) / 2} ${G10 - 560} ${tx} ${G10 - 410}" fill="none" stroke="${linkCol}" stroke-width="12" stroke-dasharray="30 18" stroke-dashoffset="${(-tot * 120).toFixed(0)}"/>`;
  const theCar = at(cx, G10 + 100 + 4 * Math.sin(tot * 20), car(P.blue, P.blueD), 1.5);
  return { g: road(a, c, tot, { cur, extra: link + flash + theCar }) };
}
function s11(a, tot) {
  const CX = 2300, c = camAt(a, [[0, 2400, 520, 0.9], [1.0, 2250, 500, 1.0], [3.9, 2250, 500, 1.0]]);
  const snap = a > 0.71, stretch = ease(seg(a, 0, 0.71));
  const link = !snap ? `<path d="M${CX} ${G10 - 130}Q${CX - 300 - 200 * stretch} ${G10 - 600} ${TOW[1]} ${G10 - 410}" fill="none" stroke="${mix(WAVE, P.red, stretch)}" stroke-width="${12 - 6 * stretch}" stroke-dasharray="30 18"/>`
    : [0, 1].map((k) => { const fl = easeIn(seg(a, 0.71, 1.4)); return k === 0 ? `<path d="M${TOW[1]} ${G10 - 410}q200 -40 ${300 - 200 * fl} ${120 + 300 * fl}" fill="none" stroke="${P.red}" stroke-width="8" opacity="${(1 - fl).toFixed(2)}"/>` : `<path d="M${CX} ${G10 - 130}q-120 -200 ${-300 + 100 * fl} ${-260 + 300 * fl}" fill="none" stroke="${P.red}" stroke-width="8" opacity="${(1 - fl).toFixed(2)}"/>`; }).join("");
  const theCar = at(CX, G10 + 100, car(P.blue, P.blueD), 1.5);
  // the phone, big over the car: ? ? ?
  const q = (t0, x, y, k) => (a > t0 ? at(x, y, text(0, 34, "?", 110, P.gold), pop(a - t0) * k) : "");
  const ph = a > 1.0 ? at(CX + 120, 560, bluePhone({ on: 1, screen: "#3a2f80", inner: q(1.29, -20, -150, 0.8) + q(1.79, 22, -110, 0.6) + q(2.27, -10, -60, 0.55) }), 1.7 * pop(a - 1.0)) : "";
  const g1 = road(a, c, tot, { cur: -1, extra: link + theCar + ph });
  // pull back to the planet: question marks everywhere
  const pb = ease(seg(a, 3.5, 4.0));
  if (pb <= 0) return { g: g1 };
  let qs = ""; for (let i = 0; i < 26; i++) { const an = rnd(i * 3) * Math.PI * 2, rr_ = Math.sqrt(rnd(i * 3 + 1)) * 330, u = a - 3.8 - rnd(i * 3 + 2) * 1.6; if (u > 0) qs += at(1150 + Math.cos(an) * rr_, 520 + Math.sin(an) * rr_, `${disc(0, 0, 34, P.cream, P.creamD)}${text(0, 18, "?", 50, P.ink)}`, pop(u)); }
  const planet = night() + stars(70, 110, 0, 1920, 1080, tot) + rings(1150, 520, 380, "#3fa9ff", 0.12) + at(1150, 520, globe(360, tot * 0.03, { id: "c11" })) + qs;
  return { g: through(g1, FW / 2, FH / 2, pb, "#0d0b33", 1) + (pb > 0.6 ? `<g opacity="${seg(pb, 0.6, 1).toFixed(3)}">${planet}</g>` : "") };
}
import { through } from "./kit.js";

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
// in a Short (cfg.vertical) a portrait version can be given per shot (see makeSet in kit.js); none yet
export const cellsSet = makeSet(SHOTS, [], P);
