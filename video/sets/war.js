// "War of the currents" (electricity part 1): eleven shots, no people. Edison, Tesla and Westinghouse are name plates on
// their things (the brick station, a suitcase, a gate); every year is a calendar page.
//   0 New York at night, 1882: the brick station with the EDISON plate lights up
//   1 DC, 110 V on the station; the street lamps around it light one by one, a counter to 400
//   2 the wire runs out from the station; after 1.5 km the lamps fade and the wire glows hot; a station on every block
//   3 a steamship comes in; a suitcase with the TESLA plate comes down; 1884
//   4 the suitcase goes into Edison's station; a few months; a clash; the door slams and the suitcase walks out
//   5 blueprints of a motor and a generator with the AC wave; the WESTINGHOUSE gate takes them, coins come back
//   6 a transformer lifts the voltage, the line travels over pylons and hills, a second box brings it down into a house
//   7 1888: posters "AC" with a skull pasted on a wall, press cameras flash (sombre, nothing hurt on screen)
//   8 1890: a dim room, an empty wooden chair under one bulb; a crate stamped W slips in through the back door; AC is stuck on it
//   9 1893: the white city of the Chicago fair lights all at once, AC
//  10 1896: Niagara falls, a line to BUFFALO, more than 30 km; Edison's 1.5 km beside it is tiny
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, cross, FW, FH, makeSet } from "./kit.js";
import { fmt, coin } from "./bank.js";
import { calPage, calFlip, hills } from "./props.js";
import { P, E, mix, house, stars, skyline, pop, bulb, station, pylon, pylonTips, span, spanAt, plate, tagV, plugHead } from "./elec.js";

const bump = (a, t0, amt = 0.12) => (a > t0 ? 1 + amt * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 14) : 1);
const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 2800, 700, tot) + `<circle cx="1600" cy="150" r="54" fill="${P.cream}"/><circle cx="1580" cy="136" r="48" fill="${P.night0}"/>`, c, 0.12);
// a street lamp: a post with a bulb on top, base on y = 0
const lampPost = (on, h = 300) => `${two(rr(-9, -h, 18, h, 4), "#164a66", "#0f3a55", 5, 0)}<path d="M-40 0h80" stroke="#0f3a55" stroke-width="14" stroke-linecap="round"/>` + at(0, -h + 8, bulb(on), 0.42);
// the year: a calendar page that springs in at t0, with a page flipping off when `prev` is given
const year = (a, t0, y, k = 1, prev) => (a < t0 ? "" : at(0, 0, calPage(y, "", 1, 150) + (prev ? calFlip(prev, "", seg(a, t0, t0 + 0.3), 150) : ""), k * pop(a - t0, 7, 12)));
// a suitcase (centre of its body), 260 wide, with a name plate
const suitcase = (name = "TESLA", tilt = 0) => at(0, 0, `<path d="M-50 -90v-30a16 16 0 0 1 16 -16h68a16 16 0 0 1 16 16v30" fill="none" stroke="#5a3418" stroke-width="16"/>${two(rr(-130, -96, 260, 180, 22), "#b06a34", "#8a4e22", 0, 10)}
  <path d="M-130 -20h260" stroke="#8a4e22" stroke-width="8"/>${[-84, 84].map((x) => `<path d="${rr(x - 10, -96, 20, 180, 6)}" fill="#6e3d1a"/>`).join("")}${at(0, 30, plate(name, 34, { c: P.cream, cD: P.creamD, fill: P.ink }))}`, 1, tilt);
// a steamship, base (waterline) on y = 0, 900 long
const ship = (t) => `${[0, 1, 2].map((i) => { const q = ((t * 0.4 + i / 3) % 1); return `<circle cx="${80 + q * 140}" cy="${-420 - q * 220}" r="${30 + q * 50}" fill="#3d6a7a" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("")}
  ${two(rr(40, -420, 80, 170, 8), P.red, P.redD, 10, 0)}<path d="${rr(40, -420, 80, 26, 6)}" fill="${P.ink}"/>${two(rr(-260, -270, 520, 110, 10), P.cream, P.creamD, 0, 8)}${[-200, -120, -40, 40, 120, 200].map((x) => `<circle cx="${x}" cy="-215" r="16" fill="${P.win}"/>`).join("")}
  ${two("M-450 -170H450L380 0H-380Z", "#123a57", "#0a2a40", 0, 10)}<path d="M-450 -170H450L440 -140H-440Z" fill="${P.red}"/>`;
// a blueprint sheet (centre), 520 x 340; open 0..1 unrolls it downward; inner drawn on it
const blueprint = (open, inner) => { const h = 340 * ease(open), id = "bp" + Math.round(open * 100);
  return `<clipPath id="${id}"><rect x="-260" y="-170" width="520" height="${h.toFixed(1)}"/></clipPath><g clip-path="url(#${id})">${two(rr(-260, -170, 520, 340, 10), "#2f6fd6", "#245ab0", 0, 8)}
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${-260 + i * 65} -170V170" stroke="#5f97ee" stroke-width="2" opacity=".6"/>`).join("")}${Array.from({ length: 6 }, (_, i) => `<path d="M-260 ${-170 + i * 68}H260" stroke="#5f97ee" stroke-width="2" opacity=".6"/>`).join("")}${inner}</g>
    <path d="${rr(-272, -186 + h, 544, 32, 16)}" fill="#5f97ee"/>`; };
// a motor / generator drawn in white lines (centre), r = 90
const machine = (spin, p = 1) => drawn(circ(0, 0, 90), p, "#fff", 8) + drawn(circ(0, 0, 40), p, "#fff", 6) + (p > 0.6 ? [0, 1, 2, 3, 4, 5].map((i) => { const q = spin + i * Math.PI / 3; return `<path d="M${40 * Math.cos(q)} ${40 * Math.sin(q)}L${84 * Math.cos(q)} ${84 * Math.sin(q)}" stroke="#fff" stroke-width="6"/>`; }).join("") : "");
const sine = (x0, x1, y, amp, n, phase = 0) => { let d = ""; for (let i = 0; i <= 60; i++) { const x = lerp(x0, x1, i / 60); d += (i ? "L" : "M") + x.toFixed(1) + " " + (y + amp * Math.sin(phase + (i / 60) * n * 2 * Math.PI)).toFixed(1); } return d; };
// a gate with a name across its arch (base on y = 0), 640 wide; open 0..1
const gate = (name, open = 0) => `${two(rr(-320, -520, 80, 520, 8), P.stone, P.stoneD, 10, 0)}${two(rr(240, -520, 80, 520, 8), P.stone, P.stoneD, 10, 0)}${two(rr(-340, -600, 680, 90, 14), P.stone, P.stoneD, 0, 10)}${at(0, -555, plate(name, 46))}
  ${[-1, 1].map((s) => `<g transform="translate(${s * 240} 0) scale(${(s * (1 - 0.85 * ease(open))).toFixed(3)} 1)">${Array.from({ length: 6 }, (_, i) => `<rect x="${-240 + i * 40}" y="-500" width="12" height="500" fill="#164a66"/>`).join("")}<path d="M-240 -440H0M-240 -120H0" stroke="#164a66" stroke-width="14"/></g>`).join("")}`;
// a transformer (base on y = 0), 220 wide: a grey-green box with fins and a coil mark; glow 0..1
const transformer = (glow = 0) => `${glow > 0 ? rings(0, -170, 170, E.el, 0.25 * glow, 1.4) : ""}${two(rr(-110, -300, 220, 300, 14), "#5f8a7a", "#476b5e", 10, 0)}${[-80, -40, 0, 40, 80].map((x) => `<rect x="${x - 7}" y="-280" width="14" height="250" rx="6" fill="#476b5e"/>`).join("")}
  ${[-50, 50].map((x) => `<path d="${rr(x - 14, -350, 28, 56, 8)}" fill="${P.cream}"/>`).join("")}${disc(0, -150, 58, P.cream, P.creamD)}${drawn("M-34 -170Q-20 -196 -6 -170Q8 -144 22 -170M-34 -130Q-20 -156 -6 -130Q8 -104 22 -130", 1, P.ink, 7)}`;
// a skull (centre), r = 60
const skull = (r = 60, c = P.cream) => `<path d="M${-r} 0A${r} ${r} 0 1 1 ${r} 0Q${r} ${r * 0.5} ${r * 0.55} ${r * 0.62}V${r * 0.95}H${-r * 0.55}V${r * 0.62}Q${-r} ${r * 0.5} ${-r} 0Z" fill="${c}"/><circle cx="${-r * 0.38}" cy="${r * 0.05}" r="${r * 0.24}" fill="${P.ink}"/><circle cx="${r * 0.38}" cy="${r * 0.05}" r="${r * 0.24}" fill="${P.ink}"/><path d="M0 ${r * 0.32}l${-r * 0.12} ${r * 0.2}h${r * 0.24}Z" fill="${P.ink}"/>${[-0.3, 0, 0.3].map((x) => `<path d="M${x * r} ${r * 0.66}v${r * 0.26}" stroke="${P.ink}" stroke-width="${r * 0.08}"/>`).join("")}`;
// a poster (centre), 300 x 420: AC over a skull
const poster = () => `${two(rr(-150, -210, 300, 420, 6), "#efe2bf", "#cdbd94", 8, 6)}<path d="${rr(-130, -190, 260, 110, 4)}" fill="${P.red}"/>${text(0, -102, "AC", 104, P.cream)}${at(0, 60, skull(80, "#123a57"))}`;
// a press camera on a tripod (base on y = 0); flash 0..1
const pressCam = (flash = 0) => `<path d="M0 -250L-90 0M0 -250L90 0M0 -250V0" stroke="#164a66" stroke-width="12" stroke-linecap="round"/>${two(rr(-80, -360, 160, 120, 10), "#123a57", "#0a2a40", 0, 8)}<path d="M80 -340l70 -20v100l-70 -20Z" fill="#0a2a40"/>${disc(150, -310, 26, "#164a66", "#123a57")}
  <path d="M-60 -360V-440" stroke="${P.steel}" stroke-width="10"/><path d="M-120 -440h120l-20 30h-80Z" fill="${P.steel}"/>${flash > 0 ? rings(-60, -440, 150 * (0.5 + flash), "#ffffff", 0.5 * flash, 1.7) : ""}`;
// an empty wooden chair, seen a little from the side (base on y = 0)
const chair = () => `${two(rr(-150, -680, 44, 680, 8), P.wood, P.woodD, 8, 0)}${two(rr(110, -260, 40, 260, 8), P.wood, P.woodD, 8, 0)}${two(rr(-118, -300, 40, 300, 8), P.woodD, "#6e4322", 6, 0)}
  ${two(rr(-160, -300, 330, 48, 10), P.wood, P.woodD, 0, 10)}${two(rr(-150, -660, 70, 360, 10), P.wood, P.woodD, 8, 0)}${two(rr(-150, -470, 300, 30, 10), P.woodD, "#6e4322", 0, 6)}<path d="M-150 -120H150" stroke="${P.woodD}" stroke-width="22" stroke-linecap="round"/>`;
// a crate stamped W (base on y = 0), 240 across
const crate = (stamp = "W") => `${two(rr(-120, -220, 240, 220, 8), "#c08a4e", "#9a6a36", 10, 6)}<path d="M-120 -220L120 0M120 -220L-120 0" stroke="#9a6a36" stroke-width="16"/><path d="${rr(-120, -220, 240, 220, 8)}" fill="none" stroke="#7a4e22" stroke-width="12"/>${disc(0, -110, 58, "#efe2bf", "#cdbd94")}${text(0, -84, stamp, 76, P.ink)}`;
// a stencilled label that slaps on (centre)
const label = (t, a) => (a <= 0 ? "" : at(0, 0, `${two(rr(-90, -50, 180, 100, 10), P.red, P.redD, 0, 6)}${text(0, 30, t, 80, P.cream)}`, 1.6 - 0.6 * spring(a, 10, 16), -6));

// ---- 0: New York at night, 1882; the EDISON station lights ----
const NYG = 900;
const nyBack = (c, tot, lit) => sky(c, tot) + layer(skyline(21, -900, 2900, NYG - 160, 220, 520, E.far, lit > 0.5 ? "#ffb066" : null), c, 0.3) + layer(skyline(33, -700, 2700, NYG - 40, 120, 300, "#0d3550", null), c, 0.6);
function w0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 0.95], [2.2, 960, 545, 1.0], [4.2, 960, 530, 1.07], [5.33, 960, 528, 1.09]]), lit = seg(a, 2.9, 3.5);
  const st = at(960, NYG, station(tot, { lit, smoke: lit > 0 }) + at(0, -245, plate("EDISON", 40)), 1.45 * bump(a, 2.9, 0.06));
  const glow = lit > 0 ? rings(960, NYG - 230, 560 * lit, P.gold, 0.14 * lit, 1.5) : "";
  const g = nyBack(c, tot, lit) + layer(`<rect x="-900" y="${NYG}" width="3800" height="600" fill="${P.ground}"/><rect x="-900" y="${NYG + 50}" width="3800" height="110" fill="${P.road}"/>` + glow + st + at(1520, 420, plate("NEW YORK", 50), pop(a - 4.65)), c) + at(330, 250, year(a, 0.3, "1882", 1.05));
  return { g, out: toScreen(c, 960, NYG - 120), outC: P.win, outZ: 14 };
}
// ---- 1: DC, 110 V; the lamps light around it, a counter to 400 ----
function w1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [4.2, 960, 540, 0.94]]), N = 12, n = kf(a, [[1.95, 0], [3.8, N]], (p) => p);
  let lamps = ""; for (let i = 0; i < N; i++) { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2), x = 960 + side * (420 + k * 230), on = clamp(n - i); lamps += at(x, NYG - 10, lampPost(on > 0 ? 0.35 + 0.65 * ease(on) : 0)); }
  const cnt = Math.round(lerp(0, 400, ease(seg(a, 1.95, 3.81))));
  const tags = at(700, 380, tagV("DC", "", { size: 70, fill: P.cream }), pop(a - 0.3)) + at(1220, 380, tagV("110", "V", { size: 70 }), pop(a - 0.95));
  const counter = a > 1.9 ? at(960, 160, `${rings(-150, -24, 50, P.gold, 0.25)}${at(-150, 18, bulb(1), 0.28)}${number(40, 10, fmt(cnt), 92, P.gold)}`, pop(a - 1.9)) : "";
  const g = nyBack(c, tot, 1) + layer(`<rect x="-900" y="${NYG}" width="3800" height="600" fill="${P.ground}"/><rect x="-900" y="${NYG + 50}" width="3800" height="110" fill="${P.road}"/>` + at(960, NYG, station(tot, { lit: 1 }) + at(0, -245, plate("EDISON", 40))) + lamps, c) + tags + counter;
  return { g, in: [960, 700], inC: P.win };
}
// ---- 2: the wire runs out; after 1.5 km the lamps fade, the wire glows hot; a station on every block ----
function w2(a, tot) {
  const c = camAt(a, [[0, 1150, 600, 0.9], [2.4, 1500, 600, 0.9], [4.3, 1700, 600, 0.88], [6.6, 1750, 600, 0.84], [8.4, 2000, 560, 0.42], [11.9, 2000, 560, 0.41]]), G = 900;
  const MK = 1700, X1 = 3100, run = seg(a, 1.3, 2.4), fade = seg(a, 2.3, 3.9), hot = seg(a, 5.75, 6.4);
  let poles = "", lamps = ""; const PX = [600, 1000, 1400, 1800, 2200, 2600, 3000];
  PX.forEach((x, i) => { poles += at(x, G, `${two(rr(-12, -440, 24, 440, 5), P.wood, P.woodD, 5, 0)}`); const reach = clamp(run * 8 - i); const far = x > MK ? lerp(1, 0.08, fade) * (1 - 0.6 * seg(x, MK, X1)) : 1; lamps += at(x + 200, G, lampPost(reach > 0 ? far * ease(reach) : 0, 260)); });
  const wireD = `M450 ${G - 430}` + PX.map((x) => `L${x} ${G - 430}`).join("");
  const heat = mix("#16113a", "#ff6a3a", hot * (0.6 + 0.4 * Math.sin(tot * 9)));
  const wireG = `<path d="${wireD}" stroke="#16113a" stroke-width="10" fill="none"/>` + (run > 0 ? drawn(`M450 ${G - 430}L${MK} ${G - 430}`, run * 2, P.gold, 12) + drawn(`M${MK} ${G - 430}L${X1} ${G - 430}`, (run * 2 - 1) * (1 - fade * 0.7), mix(P.gold, "#7a6ad0", fade), 8) : "") + (hot > 0 ? `<path d="M${MK} ${G - 430}L${X1} ${G - 430}" stroke="${heat}" stroke-width="16" fill="none"/>` : "");
  // the 1.5 km marker
  const mk = a > 3.3 ? at(MK, G - 520, `<path d="M0 0V460" stroke="${P.cream}" stroke-width="8" stroke-dasharray="20 16"/>` + at(0, -60, tagV("1.5", "km", { size: 80, fill: P.cream })), [1, pop(a - 3.3)]) : "";
  // more stations pop up, one per block
  let more = ""; [[-800, 0], [-1600, 0.25], [3800, 0.15], [4600, 0.4], [-2400, 0.5], [5400, 0.6]].forEach(([x, d], i) => { const p = pop(a - 6.9 - d); if (p > 0) more += at(x, G, station(tot + i, { lit: 1 }), [p, p]); });
  const ground = `<rect x="-3500" y="${G}" width="10000" height="900" fill="${P.ground}"/><rect x="-3500" y="${G + 50}" width="10000" height="110" fill="${P.road}"/>`;
  const g = sky(c, tot, 9) + layer(skyline(41, -3000, 6500, G - 120, 160, 420, E.far, null), c, 0.4) + layer(ground + at(80, G, station(tot, { lit: 1 }) + at(0, -245, plate("EDISON", 40))) + more + poles + wireG + lamps + mk, c);
  return { g, in: toScreen(c, 80, G - 120), inC: P.win };
}
// ---- 3: a steamship comes in, the suitcase with TESLA comes down; 1884 ----
function w3(a, tot) {
  const c = camAt(a, [[0, 900, 600, 1.0], [1.8, 1000, 620, 1.1], [5, 1300, 640, 1.3]]), W = 820;
  const sx = lerp(-300, 760, easeOut(seg(a, 0, 1.9))), bob = 8 * Math.sin(tot * 1.6);
  const dock = `${two(rr(1150, W - 60, 900, 60, 6), P.wood, P.woodD, 0, 8)}${[1200, 1400, 1600, 1800].map((x) => `<rect x="${x}" y="${W}" width="26" height="300" fill="${P.woodD}"/>`).join("")}${at(1640, W - 60, `<path d="M0 0V-160" stroke="${P.steel}" stroke-width="12"/><circle cy="-172" r="20" fill="${P.gold}"/>`)}`;
  const water = `<rect x="-800" y="${W}" width="3600" height="600" fill="#1d3f8a"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-600 + i * 360 + ((tot * 30) % 360)} ${W + 50 + (i % 3) * 60}h140" stroke="#5f97ee" stroke-width="8" stroke-linecap="round" opacity=".5"/>`).join("")}`;
  const down = seg(a, 1.8, 2.6), cx = lerp(sx + 120, 1450, ease(down)), cy = lerp(W - 300 + bob, W - 160, ease(down)) - Math.sin(Math.PI * down) * 120;
  const g = sky(c, tot, 11) + layer(skyline(51, -800, 2800, W - 30, 120, 330, E.far, "#ffb066"), c, 0.4) + layer(water + dock + at(sx, W + bob, ship(tot)) + (a > 1.8 ? at(cx, cy, suitcase("TESLA", lerp(-8, 0, down)), pop(a - 1.8)) : ""), c) + at(330, 250, year(a, 3.24, "1884", 1.05));
  return { g, out: toScreen(c, 1450, W - 160), outC: "#b06a34", outZ: 14 };
}
// ---- 4: into Edison's station; a few months; a clash; the door slams and the suitcase walks out ----
function w4(a, tot) {
  const c = camAt(a, [[0, 960, 660, 1.25], [2.75, 1000, 670, 1.3]]), G = 920;
  const inX = lerp(1500, 960, ease(seg(a, 0.0, 0.45))), out = seg(a, 1.85, 2.6), sx = a < 1.85 ? inX : lerp(960, 1520, ease(out)), vis = a < 0.5 || a > 1.85;
  const months = a > 0.9 && a < 1.6 ? at(1400, 260, calPage(["MAR", "APR", "MAY"][Math.min(2, Math.floor((a - 0.9) / 0.22))], "", 0.8, 110), pop(a - 0.9)) : "";
  const clash = a > 1.49 && a < 2.2 ? rings(960, G - 200, 160, P.red, 0.4 * (1 - seg(a, 1.9, 2.2)), 1.5) + cross(960, G - 330, 70, P.red, a - 1.49) : "";
  const slam = a > 2.18 ? 1 - Math.exp(-(a - 2.18) * 10) : 0, door = `<path d="M890 ${G - 40}V${G - 190}A70 70 0 0 1 1030 ${G - 190}V${G - 40}Z" fill="${P.ink}"/><path d="M890 ${G - 40}V${G - 190}A70 70 0 0 1 1030 ${G - 190}V${G - 40}Z" fill="${P.woodD}" opacity="${a > 0.5 && a < 1.85 ? 1 : slam}"/>`;
  const st = at(960, G, station(tot, { lit: 1 }) + at(0, -245, plate("EDISON", 40)), [1.25, 1.25]);
  const g = sky(c, tot, 13) + layer(skyline(21, -900, 2900, G - 160, 220, 520, E.far, "#ffb066"), c, 0.3) + layer(`<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>` + st + door + (vis ? at(sx, G - 70 - Math.abs(Math.sin(a * 12)) * 14, suitcase("TESLA"), 0.7) : "") + clash, c) + months;
  return { g, in: [960, 600], inC: "#b06a34", out: toScreen(c, sx, G - 70), outC: "#2f6fd6", outZ: 16 };
}
// ---- 5: blueprints of a motor and a generator with the AC wave; the WESTINGHOUSE gate takes them, coins come back ----
function w5(a, tot) {
  const c = camAt(a, [[0, 820, 500, 1.0], [3.2, 820, 500, 0.96], [4.6, 1080, 560, 0.82], [6.46, 1100, 560, 0.8]]), G = 940;
  const slide = ease(seg(a, 5.15, 5.9)), bx = lerp(620, 1300, slide), coins = seg(a, 5.5, 6.3);
  const bp = blueprint(seg(a, 0.3, 0.9), at(-120, -10, machine(tot * 2, seg(a, 0.98, 1.5))) + at(120, -10, machine(-tot * 2, seg(a, 1.51, 2.0))) + (a > 2.34 ? drawn(sine(-200, 200, 120, 26, 2, tot * 3), seg(a, 2.34, 2.9), P.gold, 9) : ""));
  const gt = at(1500, G, gate("WESTINGHOUSE", seg(a, 4.6, 5.3)), [1.0 * pop(a - 3.45), 1.0 * pop(a - 3.45)]);
  let cs = ""; if (coins > 0) for (let i = 0; i < 6; i++) { const q = clamp(coins * 1.6 - i * 0.12); if (q > 0) cs += at(lerp(1450, 760 + (i % 3) * 70, ease(q)), G - 40 - Math.floor(i / 3) * 60 - Math.sin(Math.PI * q) * 160, coin(32)); }
  const g = sky(c, tot, 17) + layer(`<rect x="-900" y="${G}" width="3800" height="600" fill="${P.ground}"/>`, c) + layer(gt + at(bx, 470, bp, [lerp(1.5, 0.45, slide), lerp(1.5, 0.45, slide)]) + cs, c);
  return { g, in: [820, 470], inC: "#2f6fd6" };
}
// ---- 6: step up, travel far over pylons, step down into a house (host right: the house stays left of x 1400) ----
function w6(a, tot) {
  const c = camAt(a, [[0, 760, 560, 0.9], [2.8, 760, 560, 0.95], [6.3, 900, 560, 0.95], [7.9, 3500, 560, 0.95], [9.4, 3700, 640, 1.2], [10.9, 3710, 640, 1.24]]), G = 900;
  const up = seg(a, 3.08, 4.0), down = seg(a, 7.99, 8.9), home = seg(a, 9.15, 9.6);
  const TX1 = 620, TX2 = 3420, PXs = [1150, 1700, 2250, 2800];
  const tips = PXs.map((x) => [x, G + pylonTips(560)[2][1] + 30]);
  let line = `M${TX1 + 50} ${G - 350}`; tips.forEach(([x, y]) => (line += `L${x} ${y}`)); line += `L${TX2 - 50} ${G - 350}`;
  const travel = seg(a, 6.39, 7.9), pulse = travel > 0 && travel < 1 ? (() => { const k = travel * (tips.length + 1), i = Math.min(tips.length, Math.floor(k)), pts = [[TX1 + 50, G - 350], ...tips, [TX2 - 50, G - 350]], p0 = pts[i], p1 = pts[i + 1] || p0, f = k - i; return rings(lerp(p0[0], p1[0], f), lerp(p0[1], p1[1], f), 40, E.el, 0.6, 1.6); })() : "";
  const hv = at(TX1, G - 560, tagV(up > 0.5 ? "1,000s" : "100s", "V", { size: 64, fill: up > 0.5 ? P.gold : P.cream }), [1, pop(a - 3.68) * bump(a, 3.68)]);
  const lowTag = a > 8.44 ? at(TX2, G - 560, tagV("110 – 240", "V", { size: 56, fill: P.cream }), pop(a - 8.44)) : "";
  const arrow = (x, d, p) => (p <= 0 ? "" : at(x, G - 430, `<path d="M0 ${d * -60}L44 ${d * 10}H16V${d * 60}H-16V${d * 10}H-44Z" fill="${d > 0 ? P.gold : E.el}"/>`, pop(p)));
  const wireLit = drawn(line, seg(a, 4.2, 7.9), mix("#16113a", E.el, 0.7), 7);
  const ground = hills(61, -600, 4600, G - 20, 140, E.hill) + `<rect x="-600" y="${G}" width="5400" height="600" fill="${P.ground}"/>`;
  const g = sky(c, tot, 19) + layer(hills(71, -900, 5200, G - 120, 220, E.far), c, 0.45) + layer(ground + at(220, G, station(tot, { lit: 1 }), 0.7) + `<path d="M420 ${G - 120}H${TX1 - 100}" stroke="#16113a" stroke-width="7"/>` + PXs.map((x) => at(x, G, pylon(560))).join("") + `<path d="${line}" stroke="#16113a" stroke-width="6" fill="none"/>` + wireLit + pulse
    + at(TX1, G, transformer(up), 1.1 * pop(a - 2.85)) + arrow(TX1 + 170, 1, a - 3.08) + hv + at(TX2, G, transformer(down), 1.1) + arrow(TX2 - 170, -1, a - 7.99) + lowTag
    + `<path d="M${TX2 + 60} ${G - 120}H${TX2 + 360}" stroke="#16113a" stroke-width="7"/>` + at(TX2 + 520, G, house(E.houseA, E.houseAD, { roof: E.roof, lit: [home > 0, home > 0, home > 0] }), 1.2 * bump(a, 9.38, 0.08)) + (home > 0 ? rings(TX2 + 520, G - 160, 260, P.gold, 0.18 * home, 1.4) : ""), c);
  return { g, in: toScreen(c, 220, G - 120), inC: P.win, out: toScreen(c, TX2 + 520, G - 140), outC: P.win, outZ: 14 };
}
// ---- 7: 1888, the fear campaign: posters on a wall, press cameras flash ----
function w7(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [5.5, 960, 540, 1.06], [7.2, 960, 600, 0.9], [8.92, 960, 610, 0.88]]), G = 960;
  const wall = `<rect x="-600" y="-200" width="3200" height="${G + 200}" fill="#0e3a50"/>${Array.from({ length: 14 }, (_, r) => Array.from({ length: 16 }, (_, q) => `<rect x="${-600 + q * 220 + (r % 2) * 110}" y="${-200 + r * 80}" width="210" height="72" rx="4" fill="#13465e"/>`).join("")).join("")}<rect x="-600" y="${G}" width="3200" height="400" fill="${P.ground}"/>`;
  const posts = [[960, 470, 3.44, 0], [580, 430, 4.15, -5], [1340, 450, 4.8, 4], [1700, 470, 5.13, 3]].map(([x, y, t0, r]) => (a < t0 ? "" : at(x, y, poster(), lerp(1.4, 1, spring(a - t0, 10, 16)) * 0.95, r))).join("");
  const flashes = [7.38, 7.94, 8.25], fl = (t0) => (a > t0 ? Math.exp(-(a - t0) * 7) : 0), f = Math.max(...flashes.map(fl));
  const cams = a > 6.9 ? [[420, 7.38], [1500, 7.94], [960, 8.25]].map(([x, t0], i) => at(x, G + 240, pressCam(fl(t0)), [0.9 * pop(a - 6.9 - i * 0.1), 0.9 * pop(a - 6.9 - i * 0.1)])).join("") : "";
  const g = layer(wall + posts + cams, c) + at(300, 230, year(a, 1.37, "1888", 0.95)) + (f > 0 ? `<rect width="${FW}" height="${FH}" fill="#fff" opacity="${(0.35 * f).toFixed(3)}"/>` : "");
  return { g, out: toScreen(c, 960, 470), outC: "#efe2bf", outZ: 12 };
}
// ---- 8: 1890: an empty wooden chair under one bulb; a crate stamped W slips in at the back door; AC is stuck on it ----
function w8(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.05], [3.3, 800, 620, 1.18], [4.6, 820, 620, 1.18], [6.0, 1300, 640, 1.15], [9.0, 1300, 640, 1.15], [10.2, 1000, 620, 1.0], [19, 1000, 620, 0.98]]), G = 960;
  const dim = 0.55 + 0.05 * Math.sin(tot * 1.1), cone = `<path d="M720 120L470 ${G}H970Z" fill="#ffd98a" opacity="${(0.1 * dim).toFixed(3)}"/>`;
  const room = `<rect x="-600" y="-300" width="3200" height="${G + 300}" fill="#0a2b3c"/><rect x="-600" y="${G}" width="3200" height="400" fill="#061e2c"/><path d="M-600 ${G}H2600" stroke="#12405a" stroke-width="10"/>`;
  const doorOpen = seg(a, 6.2, 6.9) * (1 - seg(a, 8.8, 9.4)), DX = 1560;
  const door = `<path d="${rr(DX - 130, G - 520, 260, 520, 6)}" fill="#ffcf8a" opacity="${(0.7 * doorOpen).toFixed(2)}"/><path d="${rr(DX - 130, G - 520, 260, 520, 6)}" fill="none" stroke="#041624" stroke-width="18"/><g transform="translate(${DX - 130} 0) scale(${(1 - 0.85 * doorOpen).toFixed(3)} 1) translate(${-(DX - 130)} 0)"><path d="${rr(DX - 130, G - 520, 260, 520, 6)}" fill="#0e3a50"/><circle cx="${DX + 90}" cy="${G - 260}" r="14" fill="${P.gold}"/></g>`;
  const crx = lerp(DX + 380, 1180, easeOut(seg(a, 7.11, 8.2)));
  const cr = a > 6.9 ? at(crx, G, crate("W"), 0.9) : "";
  const lab = at(1180, G - 300, label("AC", a - 10.4));
  const cal = at(300, 230, year(a, 0.34, "1890", 0.95 * (1 - ease(seg(a, 4.4, 4.9)))));
  const ny = at(300, 440, plate("NEW YORK", 40), pop(a - 2.08) * (1 - seg(a, 4.4, 4.8)));
  const g = layer(room + cone + at(720, G, chair(), 0.95) + at(720, 0, `<path d="M0 -300V110" stroke="${P.ink}" stroke-width="8"/>` + at(0, 110, bulb(dim), [0.5, -0.5])) + door + cr + lab, c) + cal + ny;
  return { g, in: [960, 540], inC: "#061e2c", out: toScreen(c, 720, 170), outC: P.win, outZ: 14 };
}
// ---- 9: 1893, the white city of the Chicago fair lights all at once ----
const whiteCity = (lit, tot) => { const wall = mix("#1c4a66", "#fff4dc", lit), shade = mix("#123a57", "#e8d6b0", lit), dot = (x, y) => (lit > 0 ? `<circle cx="${x}" cy="${y}" r="7" fill="#ffe9a8" opacity="${lit.toFixed(2)}"/>` : "");
  const hall = (x, w, h, dome) => { let d = ""; for (let i = 0; i <= w; i += 46) d += dot(x - w / 2 + i, -h - 6); for (let i = 0; i < 8; i++) d += `<rect x="${x - w / 2 + 30 + i * (w - 60) / 7 - 9}" y="${-h + 40}" width="18" height="${h - 60}" fill="${shade}"/>`;
    return `${two(rr(x - w / 2, -h, w, h, 4), wall, shade, 10, 0)}${d}${dome ? two(`M${x - dome} ${-h}A${dome} ${dome} 0 0 1 ${x + dome} ${-h}Z`, wall, shade, 10, 0) + dot(x, -h - dome - 6) : `<path d="M${x - w / 2 - 20} ${-h}L${x} ${-h - 70}L${x + w / 2 + 20} ${-h}Z" fill="${shade}"/>`}`; };
  const wheel = at(1640, -40, `<circle r="300" fill="none" stroke="${mix("#1c4a66", "#ffe9a8", lit)}" stroke-width="12"/>${Array.from({ length: 12 }, (_, i) => { const q = i * Math.PI / 6 + tot * 0.15; return `<path d="M0 0L${300 * Math.cos(q)} ${300 * Math.sin(q)}" stroke="${mix("#1c4a66", "#ffe9a8", lit)}" stroke-width="5"/>` + dot(300 * Math.cos(q), 300 * Math.sin(q)); }).join("")}<path d="M-120 340L0 0L120 340" stroke="${mix("#1c4a66", "#ffe9a8", lit)}" stroke-width="16" fill="none"/>`);
  return wheel + hall(320, 460, 300, 0) + hall(960, 620, 360, 150) + hall(1500, 420, 260, 0) + `<rect x="200" y="30" width="1520" height="90" fill="${mix("#0d3550", "#3f8ae0", lit)}"/>`; };
function w9(a, tot) {
  const c = camAt(a, [[0, 960, 520, 0.84], [4.0, 960, 540, 0.9], [6.38, 960, 550, 0.93]]), G = 860, lit = seg(a, 4.01, 4.4);
  const burst = lit > 0 && lit < 1 ? rings(960, G - 300, 300 + 900 * lit, "#fff3c2", 0.25 * (1 - lit), 1.1) : "";
  const g = sky(c, tot, 23) + (lit > 0 ? `<rect width="${FW}" height="${FH}" fill="#1f6d8c" opacity="${(0.35 * lit).toFixed(2)}"/>` : "") + layer(`<rect x="-900" y="${G}" width="3800" height="600" fill="${mix(P.ground, "#0f3a55", lit)}"/>` + at(0, G, whiteCity(lit, tot)) + burst + at(960, 200, plate("CHICAGO", 80), pop(a - 4.5)), c)
    + at(300, 230, year(a, 2.01, "1893", 0.95)) + at(1480, 150, plate("WESTINGHOUSE", 52), pop(a - 3.79)) + at(1480, 300, tagV("AC", "", { size: 96 }), pop(a - 5.6));
  return { g, in: [960, 540], inC: P.win, out: [960, 600], outC: "#fff4dc", outZ: 12 };
}
// ---- 10: 1896, Niagara to Buffalo, more than 30 km; Edison's 1.5 km beside it is tiny ----
function w10(a, tot) {
  const c = camAt(a, [[0, 600, 560, 0.95], [2.9, 700, 560, 0.9], [4.0, 1850, 560, 0.5], [5.75, 1900, 560, 0.48]]), G = 880;
  const falls = `${two(`M-600 ${G - 420}H260L300 ${G + 300}H-600Z`, "#164a66", "#0f3a55", 0, 10)}<path d="M260 ${G - 420}h260v${720}h-220Z" fill="#7fc4ff"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${290 + i * 26} ${G - 420}V${G + 300}" stroke="#d8f0ff" stroke-width="6" stroke-dasharray="40 50" stroke-dashoffset="${(-tot * 400 - i * 30) % 90}"/>`).join("")}
    ${[0, 1, 2, 3, 4].map((i) => { const q = ((tot * 0.5 + i / 5) % 1); return `<circle cx="${380 + 140 * Math.sin(i * 2.1)}" cy="${G + 260 - q * 200}" r="${50 + q * 60}" fill="#fff" opacity="${(0.3 * (1 - q)).toFixed(2)}"/>`; }).join("")}`;
  const PX = [900, 1500, 2100, 2700], X1 = 3300, line = `M560 ${G - 480}` + PX.map((x) => `L${x} ${G - 540}`).join("") + `L${X1} ${G - 300}`;
  const city = skyline(81, X1 - 150, X1 + 700, G, 140, 420, "#0f3a55", seg(a, 3.59, 3.7) > 0 ? "#ffb066" : null);
  const dist = Math.round(lerp(0, 30, ease(seg(a, 4.4, 5.3))));
  const span1 = a > 4.3 ? at(0, 0, `<path d="M560 ${G + 120}H${X1}" stroke="${P.gold}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${clamp(seg(a, 4.3, 5.2)).toFixed(3)} 1" pathLength="1"/>` + at((560 + X1) / 2, G + 240, tagV((dist >= 30 ? "30+" : dist), "km", { size: 170 }))) : "";
  const edison = a > 5.0 ? at(560, G + 380, `<path d="M0 -60H137" stroke="${P.cream}" stroke-width="14" stroke-linecap="round"/>` + at(160, 60, tagV("1.5", "km", { size: 100, fill: P.cream })), pop(a - 5.0)) : "";
  const g = sky(c, tot, 29) + layer(hills(91, -800, 4400, G - 80, 160, E.far), c, 0.5) + layer(`<rect x="-900" y="${G}" width="5400" height="900" fill="${P.ground}"/>` + falls + PX.map((x) => at(x, G, pylon(520))).join("") + drawn(line, seg(a, 2.98, 3.7), E.el, 7) + city + at(820, G - 700, plate("NIAGARA", 80), pop(a - 2.6)) + at(X1 + 120, G - 640, plate("BUFFALO", 110), pop(a - 3.59)) + span1 + edison, c) + at(330, 230, year(a, 0.38, "1896", 0.95));
  return { g, in: [960, 540], inC: "#fff4dc" };
}

const SHOTS = [w0, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10];
export const warSet = makeSet(SHOTS, [], P);
