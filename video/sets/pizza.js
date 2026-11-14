// "Pizza": the first purchase, four shots. Laszlo is a green house with an antenna; no people.
//   0 May 2010: the green house's window glows; the camera goes in through it to the forum on his screen, where a post
//     pins up: a heap of 10,000 coins for two pizza boxes
//   1 22 May: a delivery scooter skids up to the door and two boxes hop onto the step
//   2 the boxes go in, the heap of coins comes out onto the scooter, which rides off; a gold "1" ribbon over the door
//   3 the open box from above: the slices go one by one, and a heart
// Shots 1 and 2 are one street seen by one camera; the others hand over through a shape (the pizza box, the ribbon).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, play, frame, FW, FH, makeSet } from "./kit.js";
import { V } from "./pizza.v.js";
import { P, mix, coin, stars, skyline } from "./bank.js";
import { calPage, pizzaBox } from "./props.js";
import { heap } from "./intro.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, G) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(53, 70, -400, 2400, 700, tot) + `<circle cx="1560" cy="170" r="56" fill="${P.cream}"/><circle cx="1540" cy="156" r="50" fill="${P.night0}"/>`, c, 0.15)
  + layer(skyline(71, -500, 2500, G - 60, 110, 320, "#2a1f66", "#ffb066"), c, 0.5);
const street = (G) => `<rect x="-800" y="${G}" width="3600" height="600" fill="${P.ground}"/><rect x="-800" y="${G + 60}" width="3600" height="130" fill="${P.road}"/><path d="M-800 ${G + 125}H2800" stroke="#ff8a5c" stroke-width="8" stroke-dasharray="70 60" opacity=".5"/>`;
// Laszlo's house: green, an antenna on the roof, one big lit window (−130..20, −200..−90) and a door on the right
const WIN = [-130, -200, 150, 110];
const greenHouse = (o = {}) => { const ant = o.ant || 0, door = o.door || 0;
  return `<rect x="70" y="-330" width="34" height="80" fill="${P.greenD}"/>${two(rr(-170, -240, 340, 240, 8), P.green, P.greenD, 16, 0)}${two("M-205 -236L0 -360L205 -236Z", "#1f5a4a", P.ink, 0, 9)}
    <path d="M-20 -350V-420M-20 -404L-60 -450M-20 -404L20 -450" stroke="${P.steel}" stroke-width="7" stroke-linecap="round"/><circle cx="-20" cy="-424" r="9" fill="${ant > 0 ? P.red : P.steelD}"/>
    ${ant > 0 ? [0, 1, 2].map((i) => { const q = (ant * 1.2 + i / 3) % 1; return `<circle cx="-20" cy="-424" r="${(20 + 90 * q).toFixed(1)}" fill="none" stroke="${P.gold}" stroke-width="5" opacity="${(0.7 * (1 - q)).toFixed(2)}"/>`; }).join("") : ""}
    <path d="${rr(WIN[0] - 10, WIN[1] - 10, WIN[2] + 20, WIN[3] + 20, 10)}" fill="${P.ink}"/>${o.win || `<path d="${rr(...WIN, 4)}" fill="${P.win}"/>`}
    <path d="M60 0V-150H150V0Z" fill="${P.ink}"/>${door < 1 ? `<path d="M60 0V-150H${60 + 90 * (1 - door)}V0Z" fill="#7a4a2a"/><circle cx="${60 + 76 * (1 - door)}" cy="-74" r="6" fill="${P.gold}"/>` : ""}`; };
// a delivery scooter facing right, no rider; `cargo` sits on the rack
const scooter = (spin = 0, cargo = "") => `<circle cx="-90" cy="-36" r="36" fill="${P.ink}"/><circle cx="-90" cy="-36" r="14" fill="${P.steel}"/><circle cx="96" cy="-36" r="36" fill="${P.ink}"/><circle cx="96" cy="-36" r="14" fill="${P.steel}"/>
  ${[0, 1].map((w) => `<path d="M${-90 + 96 * w * 2 - 96 * w} -36l${(26 * Math.cos(spin)).toFixed(1)} ${(26 * Math.sin(spin)).toFixed(1)}" stroke="${P.steelD}" stroke-width="5"/>`).join("")}
  ${two("M-140 -60Q-140 -110 -80 -110H20L60 -60Z", P.blue, P.blueD, 0, 8)}${two("M60 -60L100 -200H130L100 -60Z", P.blue, P.blueD, 8, 0)}<path d="M96 -206h50" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>${rings(136, -170, 26, "#fff3c2", 0.3)}<circle cx="132" cy="-170" r="12" fill="#fff3c2"/>
  ${two(rr(-90, -136, 110, 26, 10), "#2a1d5c", P.ink, 0, 6)}<path d="M-150 -116h90" stroke="${P.steelD}" stroke-width="10"/><g transform="translate(-105 -120)">${cargo}</g>`;
const cal = (big, small, k) => calPage(big, small, k, 150);

// ---- 0: a post on a forum: ten thousand coins for two pizzas ----
function s0(a, tot) {
  const G = 900, HX = 960, K = 2.0, wx = HX + (WIN[0] + WIN[2] / 2) * K, wy = G + (WIN[1] + WIN[3] / 2) * K;
  const c = camAt(a, [[0, 960, 540, 1.0], [2.05, 940, 560, 1.12], [2.85, wx, wy - 4, 4.3], [5.88, wx, wy - 4, 4.55]]);
  // the screen behind the window, in window units: a forum, one post pinned up
  const card = a - 2.62, give = a - 3.37, want = a - 5.2, arrow = seg(a, 4.75, 5.0), [x0, y0, w, h] = WIN;
  const screen = `<clipPath id="lzwin"><path d="${rr(x0, y0, w, h, 4)}"/></clipPath><g clip-path="url(#lzwin)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#e9eefc"/><rect x="${x0}" y="${y0}" width="${w}" height="12" fill="${P.violet}"/>
    ${[0, 1, 2].map((i) => `<path d="${rr(x0 + 8, y0 + 18 + i * 30 - 30 * ease(seg(card, 0, 0.35)), w - 16, 24, 3)}" fill="#d3dbf3"/><path d="M${x0 + 16} ${y0 + 28 + i * 30 - 30 * ease(seg(card, 0, 0.35))}h${40 + i * 14}" stroke="#aab4d4" stroke-width="3" stroke-linecap="round"/>`).join("")}
    ${card > 0 ? at(x0 + w / 2, y0 + 70 + 50 * (1 - easeOut(seg(card, 0, 0.35))), `<path d="${rr(-66, -34, 132, 72, 5)}" fill="#fff"/><path d="${rr(-66, -34, 132, 72, 5)}" fill="none" stroke="${P.violet}" stroke-width="2"/>${disc(-56, -26, 4, P.red, P.redD)}
      ${give > 0 ? at(-32, 0, at(0, 4, heap(36, tot * 3), 0.13) + number(0, 26, "10,000", 12, P.goldD), pop(give)) : ""}
      ${arrow > 0 ? drawn("M-8 -2H12M6 -8L12 -2L6 4", arrow, P.violet, 3, 'stroke-linejoin="round"') : ""}
      ${want > 0 ? [0, 1].map((i) => at(36, 10 - i * 10, pizzaBox(0), 0.22 * pop(want - i * 0.14))).join("") : ""}`) : ""}</g>`;
  const hs = at(HX, G, greenHouse({ ant: a > 1.29 ? (a - 1.29) * 0.9 : 0, win: screen + `<path d="${rr(x0, y0, w, h, 4)}" fill="${P.win}" opacity="${(0.55 * (1 - seg(a, 1.6, 2.4))).toFixed(2)}"/>` }), K);
  const calendar = at(330, 250, cal("2010", "MAY", 0.95), pop(a - 0.28));
  const g = night(c, tot, G) + layer(street(G) + hs + calendar, c);
  return { g, out: toScreen(c, HX + (x0 + w / 2 + 36) * K, G + (y0 + 70 + 6) * K), outC: "#f4ead6", outZ: 18 };
}

// ---- 1–2: the scooter at the door, and the trade on the doorstep ----
const SG = 900, HX = 1260, HK = 1.7, DOOR = [HX + 105 * HK, SG];
function delivery(t, c, tot, s) {
  const T1 = (s.ends || [])[1] || 2.15, u = t - T1;
  const arrive = kf(t, [[0, -500], [0.85, 700], [1.0, 680]], easeOut), leave = easeIn(seg(u, 1.35, 2.1)), sx = arrive - 1900 * leave, bob = t < 0.95 ? 3 * Math.sin(t * 40) : 0, tilt = t > 0.82 && t < 1.1 ? -6 * Math.sin(Math.PI * seg(t, 0.82, 1.1)) : leave > 0 ? 4 : 0;
  // two boxes: on the rack, onto the step, into the house
  const step = [DOOR[0] - 120, SG], hopP = seg(t, 1.13, 1.5), inP = ease(seg(u, 0.3, 0.75));
  const rack = [sx - 131, SG - 150 + bob];
  let boxes = "";
  if (hopP <= 0) boxes = ""; else if (inP < 1) { const b = hopP < 1 ? bez(rack, [(rack[0] + step[0]) / 2, SG - 380], step, ease(hopP)) : [lerp(step[0], DOOR[0], inP), SG]; boxes = at(b[0], b[1], pizzaBox(0) + at(4, -48, pizzaBox(0)), 1.25 * (1 - 0.3 * inP)); }
  const cargoBoxes = hopP <= 0 ? at(0, 0, pizzaBox(0) + at(4, -48, pizzaBox(0)), 1.0) : "";
  // the coins come out of the door and onto the rack
  const outP = seg(u, 0.65, 1.15), coinsOn = outP >= 1;
  const coins = outP > 0 && !coinsOn ? at(...bez([DOOR[0], SG - 30], [(DOOR[0] + rack[0]) / 2, SG - 360], [rack[0], rack[1]], ease(outP)), heap(36, tot * 3), 0.52) : "";
  const sc = at(sx, SG, scooter(t * (t < 0.95 || leave > 0 ? 18 : 0), cargoBoxes + (coinsOn ? at(0, 0, heap(36, tot * 3), 0.42) : "")), 1.25, tilt);
  const dust = t > 0.8 && t < 1.4 ? [0, 1, 2].map((i) => `<circle cx="${(sx - 120 - i * 40 - 60 * (t - 0.8)).toFixed(1)}" cy="${SG - 20 - i * 6}" r="${(18 + 20 * (t - 0.8)) * (1 - i * 0.2)}" fill="#7a68b0" opacity="${(0.5 * (1 - seg(t, 0.8, 1.4))).toFixed(2)}"/>`).join("") : "";
  const door = ease(seg(u, 0.08, 0.3)) * (1 - ease(seg(u, 1.2, 1.45))), light = door > 0 ? `<path d="M${DOOR[0] - 75} ${SG}L${DOOR[0] - 180} ${SG + 120}H${DOOR[0] + 120}L${DOOR[0] + 75} ${SG}Z" fill="${P.win}" opacity="${(0.25 * door).toFixed(2)}"/>` : "";
  const hs = at(HX, SG, greenHouse({ door, win: `<path d="${rr(...WIN, 4)}" fill="#cfe0ff"/>` }), HK) + (door > 0 ? `<path d="${rr(HX + 60 * HK, SG - 150 * HK, 90 * HK, 150 * HK, 0)}" fill="${P.win}" opacity="${(0.55 * door).toFixed(2)}"/>` : "");
  const ribbon = u > 1.6 ? at(HX + 105 * HK, SG - 470, rings(0, 0, 110 * spring(u - 1.6, 7, 11), P.gold, 0.2) + `<path d="M-40 30L-60 140L-20 120L0 150L10 40ZM40 30L60 140L20 120L0 150L-10 40Z" fill="${P.red}"/>` + disc(0, 0, 80, P.gold, P.goldD) + `<circle r="60" fill="none" stroke="${P.goldD}" stroke-width="8"/>` + text(0, 34, "1", 96, "#8a5200"), pop(u - 1.6, 8, 13)) : "";
  const calendar = at(520, 440, cal("22", "MAY", 0.95), pop(t - 0.19) * (1 - ease(seg(u, 0.4, 0.8))));
  return { g: night(c, tot, SG) + layer(street(SG) + hs + light + dust + sc + boxes + coins + ribbon + calendar, c), box: toScreen(c, rack[0], rack[1] - 30) };
}
function s1(a, tot, s) { const c = camAt(a, [[0, 960, 640, 1.3], [2.15, 1040, 640, 1.34]]), d = delivery(a, c, tot, s); return { g: d.g, in: d.box, inC: "#f4ead6", inZ: 18 }; }
function s2(a, tot, s) { const T1 = (s.ends || [])[1] || 2.15, c = camAt(a, [[0, 1040, 640, 1.34], [1.4, 1120, 600, 1.3], [2.68, 1180, 540, 1.24]]), d = delivery(T1 + a, c, tot, s);
  return { g: d.g, out: toScreen(c, HX + 105 * HK, SG - 470), outC: P.gold, outZ: 16 }; }

// ---- 3: the pizza was good ----
function s3(a, tot) {
  const c = camAt(a, [[0, 1080, 540, 1.0], [3.43, 1080, 520, 1.06]]), PX = 1100, PY = 600, R = 250;
  const box = `<path d="${rr(PX - 330, PY - 600, 660, 300, 16)}" fill="#e3d6b8"/><circle cx="${PX}" cy="${PY - 450}" r="40" fill="${P.red}" opacity=".85"/>${two(rr(PX - 330, PY - 310, 660, 640, 16), "#f4ead6", "#d9c9a6", 0, 10)}<path d="${rr(PX - 300, PY - 280, 600, 580, 10)}" fill="#e9dcbc"/>`;
  let pie = "";
  for (let i = 0; i < 8; i++) { const a0 = -Math.PI / 2 + i * Math.PI / 4, a1 = a0 + Math.PI / 4, t0 = 0.45 + i * 0.25, u = a - t0, gone = seg(u, 0, 0.22); if (gone >= 1) continue;
    const mid = (a0 + a1) / 2, lift = 120 * easeIn(gone), dx = Math.cos(mid) * (14 + lift), dy = Math.sin(mid) * (14 + lift) - lift * 0.6;
    const wedge = `M0 0L${(Math.cos(a0) * R).toFixed(1)} ${(Math.sin(a0) * R).toFixed(1)}A${R} ${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(1)} ${(Math.sin(a1) * R).toFixed(1)}Z`;
    const pep = [0.45, 0.75].map((f, j) => `<circle cx="${(Math.cos(mid + (j ? 0.12 : -0.12)) * R * f).toFixed(1)}" cy="${(Math.sin(mid + (j ? 0.12 : -0.12)) * R * f).toFixed(1)}" r="22" fill="${P.red}"/>`).join("");
    pie += at(PX + dx * (gone > 0 ? 1 : 0.1), PY + dy * (gone > 0 ? 1 : 0.1), `<path d="${wedge}" fill="#e8a23c"/><g transform="scale(.88)"><path d="${wedge}" fill="${P.gold}"/></g>${pep}`, 1 - 0.8 * gone); }
  const crumbs = a > 1.0 ? [[-60, 40], [80, -30], [20, 120], [-120, -90], [140, 90]].map(([x, y], i) => a > 0.7 + i * 0.4 ? `<circle cx="${PX + x}" cy="${PY + y}" r="${7 + (i % 3) * 3}" fill="#c47f22"/>` : "").join("") : "";
  const steam = [0, 1, 2].map((i) => { const q = ((tot * 0.5 + i / 3) % 1); return `<path d="M${PX - 120 + i * 120 + 16 * Math.sin(tot * 2 + i)} ${PY - 40 - 260 * q}q-24 -30 0 -60q24 -30 0 -60" stroke="${P.cream}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(0.4 * (1 - q) * (1 - seg(a, 1.8, 2.5))).toFixed(2)}"/>`; }).join("");
  const h = a - 2.6, heart = h > 0 ? at(1560, 250, rings(0, 10, 120 * spring(h, 7, 11), P.pink, 0.2) + two("M0 70C-40 40 -110 0 -110 -50C-110 -100 -40 -110 0 -60C40 -110 110 -100 110 -50C110 0 40 40 0 70Z", P.pink, P.pinkD, 0, 10), pop(h, 8, 13) * (1 + 0.05 * Math.sin(tot * 7))) : "";
  const table = `<rect x="-400" y="-300" width="2800" height="1700" fill="${P.wood}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M-400 ${-200 + i * 180}H2400" stroke="${P.woodD}" stroke-width="10" opacity=".6"/>`).join("")}`;
  const g = layer(table, c, 0.9) + layer(`<ellipse cx="${PX}" cy="${PY + 360}" rx="380" ry="30" fill="#5a3418" opacity=".5"/>` + box + pie + crumbs + steam + heart, c);
  return { g, in: toScreen(c, PX, PY), inC: P.gold, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3];
// in a Short (cfg.vertical) the portrait versions of pizza.v.js (see makeSet in kit.js)
export const pizzaSet = makeSet(SHOTS, V, P);
