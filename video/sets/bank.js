// "The bank is a ledger": five shots with no words to read. Each one is built so that the picture alone says the line.
//   0 money all over town turns into digits; the digits fly to one place, a book, and the book is inside a bank
//   1 one house pays another: the coin never makes the trip. A number is rubbed out in one row and written in the other
//   2 pay comes in as a number, rent goes out as a number, month after month, and the wallet stays empty
//   3 every bank has its own book; night after night they compare them row by row, until one row does not match
//   4 the vault opens on a book, not gold; the book rises over the town and every house hangs from it
// Each shot ends on a shape the next one starts from (a page, a window, the dark of an empty wallet, a doorway).
// The host is not in these sets: he leans in from the side of the frame, so the lower corner on his side is kept clear.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, through, begin, rr, circ, two, disc, rings, text, digitX, number, drawn, at, check, cross, FW, FH } from "./kit.js";

const P = { sky0: "#2a1466", sky1: "#8a3391", sky2: "#ff8a5c", night0: "#0d0b33", night1: "#34206f", far: "#5a2a8c", mid: "#472080", ground: "#2a1556", road: "#1f0f47", soil: "#170c3b",
  violet: "#8a5be0", violetD: "#6a40bd", blue: "#3fa9ff", blueD: "#2a80d2", pink: "#ff5fa2", pinkD: "#d6407f", teal: "#22c7b8", tealD: "#15988f", gold: "#ffd04a", goldD: "#f09a1a",
  cream: "#fff4dc", creamD: "#ead7ad", ink: "#1a0f3a", red: "#ff4d5a", redD: "#d93544", green: "#3ddc97", greenD: "#1fa86c", stone: "#ffe9c7", stoneD: "#e3b987", win: "#ffb066", steel: "#aab4d4", steelD: "#8792bb", wood: "#a86a3a", woodD: "#84502a" };
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, p) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, "0")).join(""); };
const fmt = (v) => Math.round(v).toLocaleString("en");
const cub = (p0, p1, p2, p3, t) => { const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; };

// ---- props, drawn around (0, 0) with the base on y = 0 ----
const house = (c, cD, o = {}) => { const lit = o.lit || [1, 1, 1], w = (x, y, on) => `<rect x="${x}" y="${y}" width="50" height="50" rx="8" fill="${on ? P.win : P.ink}"/>`;
  return `<rect x="52" y="-272" width="34" height="90" fill="${cD}"/>${two(rr(-110, -172, 220, 172, 6), c, cD, 16, 0)}${two("M-142 -168L0 -292L142 -168Z", o.roof || "#3a1c71", P.ink, 0, 9)}
    <path d="M-24 0V-66A24 24 0 0 1 24 -66V0Z" fill="${P.ink}"/>${w(-88, -140, lit[0])}${w(38, -140, lit[1])}<circle cx="0" cy="-214" r="17" fill="${lit[2] ? P.win : P.ink}"/>`; };
const eyes = (lx, ly, lid, bg) => [-56, 56].map((x) => `<ellipse cx="${x}" cy="-560" rx="36" ry="26" fill="#fff"/><circle cx="${x + lx * 15}" cy="${-560 + ly * 8}" r="14" fill="${P.ink}"/><rect x="${x - 40}" y="-590" width="80" height="${(56 * lid).toFixed(1)}" fill="${bg}"/>
    <path d="M${x - 40} ${-590 + 56 * lid - (x < 0 ? 14 : -6) * lid}L${x + 40} ${-590 + 56 * lid + (x < 0 ? 6 : -14) * lid}" stroke="${P.ink}" stroke-width="9" stroke-linecap="round"/>`).join("");
// a bank front, 800 wide and 652 high. o.inner is drawn inside the arch, o.sign is how lit each letter is, o.eyes turns the pediment into a face
const bank = (o = {}) => { const n = o.night, wall = n ? "#39447f" : "#f1d3a2", col = n ? "#5a69b3" : P.stone, colD = n ? "#44529a" : P.stoneD, ped = n ? "#6474c0" : P.cream, step = n ? "#2c366f" : P.stoneD, sign = o.sign || [0, 0, 0, 0];
  return `<path d="${rr(-400, -20, 800, 20)}" fill="${step}"/><path d="${rr(-372, -40, 744, 20)}" fill="${col}"/><path d="${rr(-340, -440, 680, 400)}" fill="${wall}"/>
    <path d="M-170 -40V-260A170 170 0 0 1 170 -260V-40Z" fill="${o.inside || P.ink}"/>${o.inner || ""}
    ${[-300, -226, 226, 300].map((x) => two(rr(x - 23, -440, 46, 400, 4), col, colD, 13, 0) + `<path d="${rr(x - 31, -454, 62, 18, 4)}" fill="${col}"/><path d="${rr(x - 31, -58, 62, 18, 4)}" fill="${col}"/>`).join("")}
    <path d="${rr(-362, -504, 724, 64, 4)}" fill="${o.band || col}"/>
    ${o.sign ? `<path d="${rr(-128, -500, 256, 56, 10)}" fill="${P.ink}"/>` + [..."BANK"].map((ch, i) => { const x = -84 + i * 56, l = sign[i]; return (l > 1.02 ? rings(x, -472, 30 * (l - 1), P.gold, 0.5) : "") + text(x, -453, ch, 48, l > 0 ? mix(P.gold, "#ffffff", clamp(l - 1)) : "#4a3a80"); }).join("") : ""}
    ${two("M-394 -504L0 -654L394 -504Z", ped, colD, 0, 11)}${o.eyes ? eyes(o.eyes.lx, o.eyes.ly, o.eyes.lid, ped) : disc(0, -562, 36, P.gold, P.goldD) + text(0, -543, "$", 50, "#8a5200")}`; };
// an open book, 300 wide; `inner` is drawn on its pages
const book = (inner = "", o = {}) => `<path d="${rr(-162, -100, 324, 206, 12)}" fill="${o.cover || P.wood}"/><path d="${rr(-162, 90, 324, 16, 8)}" fill="${o.coverD || P.woodD}"/>
  <path d="M-150 -90Q-75 -106 0 -90V94Q-75 78 -150 94Z" fill="${P.cream}"/><path d="M150 -90Q75 -106 0 -90V94Q75 78 150 94Z" fill="#fffaec"/>
  <path d="M-150 82Q-75 66 0 82V94Q-75 78 -150 94ZM150 82Q75 66 0 82V94Q75 78 150 94Z" fill="${P.creamD}"/><path d="M0 -90V92" stroke="${P.creamD}" stroke-width="4"/>${inner}`;
const LINES = `<path d="M-84 24h50M-135 48h100M-135 68h70M66 24h50M15 48h100M15 68h70" stroke="#dccaa0" stroke-width="7" stroke-linecap="round" fill="none"/>`;
// the two rows the story follows: a blue house's number on the left page, a pink house's on the right
const rows = (blue, pink, o = {}) => `<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/><circle cx="128" cy="-40" r="10" fill="${P.pink}"/>${blue === null ? "" : number(-62, -20, blue, 52, o.blueFill || P.ink)}${pink === null ? "" : number(62, -20, pink, 52, o.pinkFill || P.ink)}${LINES}`;
const coin = (r, label = "") => `${disc(0, 0, r, P.gold, P.goldD)}<circle r="${r * 0.72}" fill="none" stroke="${P.goldD}" stroke-width="${r * 0.1}"/>${label ? text(0, r * 0.36, label, r * 1.0, "#8a5200") : ""}`;
const note = () => `${two(rr(-36, -21, 72, 42, 7), "#6fe3a1", "#3fbf7a", 5, 4)}<circle r="11" fill="none" stroke="#2b9a5e" stroke-width="5"/>`;
const pill = (label, c, cD, w = 150) => `${two(rr(-w / 2, -31, w, 62, 31), c, cD, 6, 5)}${text(0, 16, label, 44, "#fff")}`;
const stars = (seed, n, x0, x1, y1, tot, skip) => Array.from({ length: n }, (_, i) => { const x = lerp(x0, x1, rnd(seed + i * 3)), y = rnd(seed + i * 3 + 1) * y1, big = rnd(seed + i * 3 + 2) > 0.8;
  return skip && skip(x, y) ? "" : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big ? (3.4 * (1 + 0.16 * Math.sin(tot * 1.9 + i))).toFixed(2) : 1.8}" fill="${big ? P.cream : "#b9a8ff"}"/>`; }).join("");
const skyline = (seed, x0, x1, base, hmin, hmax, fill, lit) => { let out = "", x = x0, i = 0; while (x < x1) { const w = 110 + rnd(seed + i * 5) * 120, h = hmin + rnd(seed + i * 5 + 1) * (hmax - hmin);
  out += `<rect x="${x.toFixed(0)}" y="${(base - h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 400).toFixed(0)}" fill="${fill}"/>`;
  if (lit) for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) if (rnd(seed + i * 31 + r * 7 + q) > 0.55 && 26 + r * 44 < h - 30) out += `<rect x="${(x + 22 + q * 40).toFixed(0)}" y="${(base - h + 26 + r * 44).toFixed(0)}" width="18" height="22" rx="3" fill="${lit}"/>`;
  x += w + 14 + rnd(seed + i * 5 + 2) * 60; i++; } return out; };
const clouds = (tot, y, n, fill, o) => Array.from({ length: n }, (_, i) => `<g transform="translate(${(((tot * (9 + i * 4) + i * 760) % 3400) - 500).toFixed(1)} ${y + i * 64})" opacity="${o}"><path d="${rr(-150, -26, 300, 52, 26)}" fill="${fill}"/><path d="${rr(-60, -58, 190, 52, 26)}" fill="${fill}"/></g>`).join("");
const dusk = (c, tot, sunX, sunY) => `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>${layer(rings(sunX, sunY, 250 * (1 + 0.02 * Math.sin(tot * 1.3)), "#ffd27a", 0.2, 1.45) + `<circle cx="${sunX}" cy="${sunY}" r="170" fill="#ffd98a"/>` + clouds(tot, 170, 4, "#ffb199", 0.55), c, 0.14)}`;

// ---- shot 0: money becomes numbers, the numbers live in a book, the book is in a bank ----
function shot0(a, tot) {
  const BX = 3100, G = 820, BY = G - 225;
  const c = camAt(a, [[0, 960, 540, 1], [1.5, 1540, 540, 1], [2.6, 2660, 536, 1.1], [3.25, BX, BY - 2, 2.7], [3.95, BX, BY, 2.85], [4.75, BX, 476, 0.98], [5.7, BX, 474, 1.03]]);
  const slot = (cx, n, j, y, size, fill) => ({ x: digitX(BX + cx, n, j, size * (size > 40 ? 1 : 1.08)), y: BY + y, size, fill });
  const S = [slot(-62, 3, 0, -20, 52, P.ink), slot(-111, 3, 0, 32, 24, "#a58f5e"), slot(62, 2, 0, -20, 52, P.ink), slot(-62, 3, 1, -20, 52, P.ink), slot(39, 3, 0, 32, 24, "#a58f5e"), slot(-111, 3, 1, 32, 24, "#a58f5e"),
    slot(62, 2, 1, -20, 52, P.ink), slot(-62, 3, 2, -20, 52, P.ink), slot(39, 3, 1, 32, 24, "#a58f5e"), slot(-111, 3, 2, 32, 24, "#a58f5e"), slot(39, 3, 2, 32, 24, "#a58f5e")], D = ["1", "7", "5", "0", "9", "3", "0", "0", "1", "0", "5"];
  // the street: thirteen fronts, then the bank, then a few more
  let street = `<rect x="-900" y="${G}" width="5800" height="700" fill="${P.ground}"/><rect x="-900" y="${G + 70}" width="5800" height="150" fill="${P.road}"/><path d="M-900 ${G + 145}H4900" stroke="#ff8a5c" stroke-width="9" stroke-dasharray="70 60" opacity=".55"/>`;
  const fronts = [[P.blue, P.blueD], [P.violet, P.violetD], [P.pink, P.pinkD], [P.teal, P.tealD]];
  for (let i = 0; i < 17; i++) { const x = (i < 12 ? 150 + i * 205 : 3700 + (i - 12) * 215), f = fronts[i % 4], kind = i % 3;
    if (kind === 1) { const h = 300 + rnd(i * 7) * 130; street += two(rr(x - 80, G - h, 160, h, 6), f[0], f[1], 14, 0) + [0, 1, 2, 3, 4].map((r) => [0, 1].map((q) => (60 + r * 62 < h - 40 ? `<rect x="${x - 52 + q * 62}" y="${G - h + 30 + r * 62}" width="42" height="42" rx="7" fill="${rnd(i * 31 + r * 5 + q) > 0.35 ? P.win : P.ink}"/>` : "")).join("")).join("") + `<path d="M-22 0V-56A22 22 0 0 1 22 -56V0Z" transform="translate(${x} ${G})" fill="${P.ink}"/>`; }
    else if (kind === 2) street += at(x, G, `${two(rr(-95, -150, 190, 150, 6), f[0], f[1], 14, 0)}<path d="${rr(-78, -100, 156, 62, 6)}" fill="${P.win}"/><path d="M-108 -150H108L96 -112H-96Z" fill="${P.cream}"/>${[-72, -24, 24, 72].map((q) => `<path d="M${q - 12} -150h24l-3 38h-18Z" fill="${P.red}"/>`).join("")}<path d="${rr(-88, -44, 176, 14, 4)}" fill="${P.wood}"/>`);
    else street += at(x, G, house(f[0], f[1], { lit: [1, rnd(i) > 0.4, 1] }), 0.86); }
  const inner = `${rings(0, -225, 150 * (1 + 0.03 * Math.sin(tot * 2)), P.gold, 0.2, 1.3)}${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>${at(0, -225, book(rows(null, null)))}`;
  const lit = [0, 1, 2, 3].map((j) => { const u = a - 4.25 - j * 0.15; return u > 0 ? 1 + 0.7 * Math.exp(-u * 11) : 0; });
  street += at(BX, G, bank({ inside: "#3b1d74", inner, sign: lit }));
  // each piece of money hops, turns edge-on, and comes round as a digit; the digit flies to its place on the page
  let money = "";
  D.forEach((d, i) => { const x0 = 235 + i * 205, y0 = i % 2 ? G - 205 - rnd(i * 13) * 60 : G - 26, s = S[i], launch = 0.2 + i * 0.13, land = 3.08 + i * 0.07, u = a - launch;
    const glow = (r, k = 1) => rings(0, 0, r * k, P.gold, 0.32, 1.5), dig = (size, fill) => text(0, size * 0.36, d, size, fill), cash = i % 3 === 1 ? at(0, 0, note(), 1.35) : coin(34);
    if (u < 0) { money += at(x0, y0 + 2 * Math.sin(tot * 2.2 + i), cash); return; }
    if (u < 0.34) { const up = 86 * easeOut(u / 0.3), sx = Math.cos(Math.PI * clamp(u / 0.3)), sq = u < 0.06 ? 1 - 0.18 * (u / 0.06) : 1;
      money += at(x0, y0 - up + (1 - sq) * 20, sx > 0 ? cash : glow(34) + dig(54, "#fff3c2"), [Math.max(0.04, Math.abs(sx)), sq]); return; }
    if (a < land) { const p = Math.pow(seg(a, launch + 0.34, land), 1.55), ctrl = [(x0 + s.x) / 2 + 160, 190 + 150 * rnd(i * 17)], size = lerp(54, s.size, p * p);
      for (let q = 2; q >= 1; q--) { const pp = Math.max(0, p - q * 0.016), b = bez([x0, y0 - 86], ctrl, [s.x, s.y - s.size * 0.36], pp); money += `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="${(9 - q * 2.5) * size / 54}" fill="${P.gold}" opacity="${0.6 - q * 0.18}"/>`; }
      const b = bez([x0, y0 - 86], ctrl, [s.x, s.y - s.size * 0.36], p); money += at(b[0], b[1] + 5 * Math.sin(tot * 9 + i), glow(34 * size / 54) + dig(size, "#fff3c2")); return; }
    const v = a - land, k = 1 + 0.7 * Math.exp(-v * 9) * Math.cos(v * 14);
    money += at(s.x, s.y - s.size * 0.36, (v < 0.3 ? rings(0, 0, s.size * 0.7 * (1 - v / 0.3), P.gold, 0.3) : "") + dig(s.size, mix("#fff3c2", s.fill, v / 0.18)), k); });
  const lamps = Array.from({ length: 5 }, (_, i) => at(260 + i * 520, G + 200, `<rect x="-7" y="-470" width="14" height="470" fill="${P.ink}"/><path d="M0 -470q0 -40 60 -40" fill="none" stroke="${P.ink}" stroke-width="12" stroke-linecap="round"/>${rings(64, -500, 30, "#ffd98a", 0.28)}<circle cx="64" cy="-500" r="15" fill="#fff3c2"/>`)).join("");
  const g = dusk(c, tot, 1280, 610) + layer(skyline(11, -400, 3300, 700, 120, 330, P.far), c, 0.35) + layer(skyline(29, -400, 4000, 780, 90, 260, P.mid, "#ffb066"), c, 0.65) + layer(street + money, c) + layer(lamps, c, 1.3);
  return { g, out: toScreen(c, BX - 75, BY), outC: P.cream };
}

// ---- shot 1: nothing travels; one number is rubbed out and another is written ----
function shot1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [1.8, 960, 544, 1.02], [2.7, 960, 596, 1.06], [3.4, 960, 502, 1.07], [5.5, 960, 496, 1.1]]);
  const G = 850, BKx = 960, BKy = 250, K = 2.15, HB = [300, G], HP = [1620, G], HK = 1.6, AP = G - 292 * HK;
  const A = [HB[0], G - 70], Z = [HP[0], G - 70], MID = [960, 400], XY = (G - 70 + 400) / 2, pay = (p) => bez(A, MID, Z, p);
  const tb = [[300, AP], [300, 210], [520, 150], [BKx - 128 * K, BKy - 40 * K]], tp = [[1620, AP], [1620, 210], [1400, 150], [BKx + 128 * K, BKy - 40 * K]];
  const pathOf = (t) => `M${t[0][0]} ${t[0][1]}C${t[1][0]} ${t[1][1]} ${t[2][0]} ${t[2][1]} ${t[3][0]} ${t[3][1]}`;
  // under the bank: the coins themselves, asleep
  const hot = seg(a, 1.9, 2.1) * (1 - seg(a, 3.0, 3.3));
  const vault = `<rect x="-900" y="${G + 26}" width="3800" height="400" fill="${P.soil}"/><rect x="940" y="${G}" width="40" height="60" fill="${P.steelD}"/><path d="${rr(770, G + 52, 380, 178, 28)}" fill="#2c1a66" stroke="${P.steelD}" stroke-width="8"/>
    ${hot > 0 ? rings(960, G + 150, 110 * spring(a - 1.9, 8, 14), P.gold, 0.22 * hot, 1.4) : ""}${[[-90, 0], [-30, 0], [30, 0], [90, 0], [-60, -48], [0, -48], [60, -48]].map(([x, y]) => at(960 + x, G + 190 + y, coin(29))).join("")}
    ${[0, 1, 2].map((i) => { const u = a - 1.95 - i * 0.12; return u > 0 ? text(1076 + i * 28, G + 110 - i * 32 - 5 * Math.sin(tot * 2 + i), "z", 34 + i * 10, P.cream, { opacity: clamp(u / 0.15) * 0.9 }) : ""; }).join("")}`;
  const bk = at(BKx, G, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1], inner: `${two(rr(-34, -130, 68, 90, 6), "#7a55c9", "#5b3aa6", 10, 0)}<path d="${rr(-70, -46, 140, 12, 5)}" fill="#5b3aa6"/>` }), 0.56);
  // the payment everyone pictures: a coin setting off from one door to the other. It stops, and goes home
  let trip = "";
  const stopP = 0.3, pc = a < 1.0 ? 0 : a < 1.83 ? stopP * easeOut(seg(a, 1.0, 1.83)) : a < 2.3 ? stopP : stopP * (1 - easeIn(seg(a, 2.3, 2.62))), dead = a >= 1.95;
  for (let j = 0; j < 23; j++) { const p = (j + 1) / 24, u = a - 0.45 - j * 0.028; if (u <= 0) continue; const gone = seg(a, 2.15 + (23 - j) * 0.02, 2.4 + (23 - j) * 0.02); if (gone >= 1) continue; const b = pay(p);
    trip += `<circle cx="${b[0].toFixed(1)}" cy="${(b[1] + gone * gone * 60).toFixed(1)}" r="${(10 * (0.2 + 0.8 * spring(u, 12, 20)) * (1 - gone)).toFixed(2)}" fill="${dead && p > pc ? "#b9a8ff" : P.gold}"/>`; }
  if (a > 0.5 && a < 2.78) { const b = pay(pc), sh = a > 1.83 && a < 2.3 ? 5 * Math.sin(a * 62) * Math.exp(-(a - 1.83) * 4) : 0, k = a < 2.62 ? 0.3 + 0.7 * spring(a - 0.5, 9, 15) : 1 - seg(a, 2.62, 2.78);
    trip += at(b[0] + sh, b[1] - 30 * Math.min(1, pc / 0.05), coin(58, "30"), k); }
  trip += cross(MID[0], XY, 66, P.red, a < 3.0 ? a - 1.95 : 0) + (a >= 3.0 && a < 3.2 ? at(MID[0], XY, `<circle r="66" fill="${P.red}"/>`, 1 - seg(a, 3.0, 3.2)) : "");
  // the book: the blue row goes down, the pink row goes up
  const blue = Math.round(lerp(100, 70, ease(seg(a, 3.5, 4.0)))), pink = Math.round(lerp(50, 80, ease(seg(a, 4.6, 4.95))));
  const rub = a > 3.3 && a < 4.15, wr = a > 4.45 && a < 5.1;
  const eraser = rub ? at(-62 + 36 * Math.sin((a - 3.4) * 21), lerp(-150, -40, easeOut(seg(a, 3.3, 3.45))) - 110 * easeIn(seg(a, 4.02, 4.15)), `${two(rr(-24, -14, 48, 28, 6), "#ff9db0", "#e77a92", 4, 3)}<path d="${rr(-24, -14, 18, 28, 6)}" fill="#6c7bd0"/>`, 1, -16) : "";
  const pencil = wr ? at(lerp(40, 92, seg(a, 4.58, 4.95)), lerp(-150, -22, easeOut(seg(a, 4.45, 4.58))) - 6 * Math.abs(Math.sin(a * 24)) - 120 * easeIn(seg(a, 4.98, 5.1)), `<path d="M-7 -96h14v82l-7 16l-7 -16Z" fill="${P.gold}"/><path d="M-7 -96h14v14h-14Z" fill="#ff9db0"/><path d="M-3 -4l3 6l3 -6Z" fill="${P.ink}"/>`, 1, 24) : "";
  const bump = (t0) => 1 + 0.16 * Math.exp(-(a - t0) * 8) * Math.cos((a - t0) * 13) * (a > t0 ? 1 : 0);
  const pages = `<circle cx="-128" cy="-40" r="10" fill="${P.blue}"/><circle cx="128" cy="-40" r="10" fill="${P.pink}"/>${at(-62, -38, number(0, 18, blue, 52, a > 3.5 && a < 4.2 ? P.red : P.ink), bump(4.0))}${at(62, -38, number(0, 18, pink, 52, a > 4.6 && a < 5.2 ? P.greenD : P.ink), bump(4.95))}
    ${number(-111, 32, "730", 26, "#a58f5e")}${number(39, 32, "915", 26, "#a58f5e")}${LINES}${eraser}${pencil}`;
  // the change runs down each thread to its house
  const bead = (t, t0, t1, label, col, colD) => { if (a < t0 || a > t1 + 0.12) return ""; const p = ease(seg(a, t0, t1)), b = cub(t[3], t[2], t[1], t[0], p); return at(b[0], b[1], pill(label, col, colD, 130), (0.3 + 0.7 * spring(a - t0, 10, 16)) * (1 - seg(a, t1, t1 + 0.12)) * 1.15); };
  const litB = [1, 1, a < 4.42 ? 1 : 0], litP = [1, a < 5.32 ? 0 : 1, a < 5.32 ? 0 : 1], glowP = a > 5.32 ? rings(HP[0], G - 220, 270 * spring(a - 5.32, 7, 11), P.win, 0.16, 1.3) : "";
  const dipB = a > 4.42 ? 1 - 0.05 * Math.exp(-(a - 4.42) * 7) * Math.cos((a - 4.42) * 14) : 1, hopP = a > 5.32 ? 1 + 0.07 * Math.exp(-(a - 5.32) * 7) * Math.cos((a - 5.32) * 14) : 1;
  const threads = drawn(pathOf(tb), seg(a, 0.3, 0.85), P.blue, 6) + drawn(pathOf(tp), seg(a, 0.4, 0.95), P.pink, 6);
  const main = `<rect x="-900" y="${G}" width="3800" height="30" fill="${P.ground}"/>${vault}${bk}${glowP}${at(HB[0], G, house(P.blue, P.blueD, { lit: litB }), [HK, HK * dipB])}${at(HP[0], G, house(P.pink, P.pinkD, { lit: litP }), [HK, HK * hopP])}
    ${threads}${trip}${at(BKx, BKy, book(pages), K)}${bead(tb, 3.95, 4.4, "−30", P.red, P.redD)}${bead(tp, 4.9, 5.3, "+30", P.green, P.greenD)}`;
  const g = dusk(c, tot, 960, 650) + layer(skyline(11, -300, 2400, 700, 100, 300, P.far), c, 0.35) + layer(skyline(47, -300, 2500, 790, 60, 210, P.mid, "#ffb066"), c, 0.65) + layer(main, c);
  return { g, in: toScreen(c, BKx - 150, BKy + 20), inC: P.cream, out: toScreen(c, HB[0] - 63 * HK, G - 115 * HK), outC: P.win, outZ: 44 };
}

// ---- shot 2: pay in, rent out, month after month; the wallet never sees any of it ----
function shot2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [2.8, 960, 546, 1.03], [3.5, 1355, 786, 1.54], [4.4, 1365, 790, 1.6]]);
  const night = a < 1.5 ? 0 : kf(a, [[1.5, 0], [2.1, 1], [2.42, 1], [2.55, 0], [2.7, 1], [2.85, 0], [3.0, 1], [3.15, 0], [3.3, 1]]), sky = mix(P.win, P.night0, night);
  const F = [[0.4, "1"], [1.75, "5"], [2.45, "1"], [2.6, "5"], [2.75, "1"], [2.9, "5"], [3.05, "1"], [3.2, "5"]]; let fi = -1; F.forEach((f, i) => { if (a >= f[0]) fi = i; });
  const day = fi < 0 ? "30" : F[fi][1], prevDay = fi < 1 ? "30" : F[fi - 1][1], flip = fi < 0 ? 1 : seg(a, F[fi][0], F[fi][0] + 0.13);
  // what is outside: the place the pay comes from, and the place the rent goes to
  const CH = [420, 246], KEY = [796, 318], PH = [1090, 650], swing = a > 2.31 ? 10 * Math.exp(-(a - 2.31) * 3) * Math.sin((a - 2.31) * 11) : 0;
  const outside = `<clipPath id="bkwin"><path d="${rr(110, 90, 361, 370, 6)}"/><path d="${rr(489, 90, 361, 370, 6)}"/></clipPath><path d="${rr(90, 70, 780, 410, 14)}" fill="${P.ink}"/><g clip-path="url(#bkwin)"><rect x="90" y="70" width="800" height="420" fill="${sky}"/>
    <g opacity="${night.toFixed(2)}">${stars(71, 18, 120, 840, 250, tot, (x, y) => y < 90 || Math.abs(x - 480) < 20)}<circle cx="770" cy="156" r="34" fill="${P.cream}"/><circle cx="756" cy="145" r="31" fill="${sky}"/></g>
    <g fill="${mix("#7a4a52", "#191346", night)}"><path d="M140 470V350l72 -50v50l72 -50v50l72 -50v50h62V470Z"/><rect x="402" y="${CH[1]}" width="36" height="150"/><rect x="590" y="196" width="150" height="280"/><rect x="740" y="296" width="60" height="8"/></g>
    ${[0, 1, 2].map((i) => { const p = ((tot * 0.5 + i / 3) % 1); return `<circle cx="${CH[0] + p * 50}" cy="${CH[1] - 12 - p * 80}" r="${12 + p * 18}" fill="${P.cream}" opacity="${(0.55 * (1 - p)).toFixed(2)}"/>`; }).join("")}
    ${[168, 240, 312].map((x) => `<rect x="${x}" y="404" width="40" height="34" rx="5" fill="${P.win}" opacity="${(0.25 + 0.7 * night).toFixed(2)}"/>`).join("")}
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${610 + (i % 2) * 62}" y="${218 + Math.floor(i / 2) * 70}" width="44" height="46" rx="6" fill="${P.win}" opacity="${i % 3 ? 0.95 : 0.3}"/>`).join("")}
    ${at(KEY[0], KEY[1] - 16, `${disc(0, 50, 36, P.gold, P.goldD)}<rect x="-4" y="0" width="8" height="18" fill="${P.ink}"/><g fill="none" stroke="#8a5200" stroke-width="7" stroke-linecap="round"><circle cx="-10" cy="44" r="9"/><path d="M-1 49l18 13M11 58l6 -7"/></g>`, 1, swing)}</g><path d="M480 80V470" stroke="${P.ink}" stroke-width="18"/>`;
  const cal = `<path d="${rr(1330, 90, 240, 300, 16)}" fill="${P.creamD}"/><path d="${rr(1330, 90, 240, 292, 16)}" fill="${P.cream}"/>${text(1450, 350, day, 180, P.ink)}
    ${flip < 1 ? `<g transform="translate(0 156) scale(1 ${(1 - flip).toFixed(3)}) translate(0 -156)"><path d="${rr(1330, 156, 240, 226, 0)}" fill="${mix(P.cream, P.creamD, flip)}"/>${text(1450, 350, prevDay, 180, P.ink)}</g>` : ""}
    <path d="M1330 106a16 16 0 0 1 16 -16h208a16 16 0 0 1 16 16v50h-240Z" fill="${P.red}"/><circle cx="1390" cy="122" r="10" fill="${P.ink}"/><circle cx="1510" cy="122" r="10" fill="${P.ink}"/>`;
  // the phone: the only place the money ever shows up
  let bal = a < 0.96 ? 0 : a < 1.85 ? lerp(0, 3000, ease(seg(a, 0.96, 1.3))) : lerp(3000, 1800, ease(seg(a, 1.85, 2.25)));
  F.slice(2).forEach((f, i) => { if (a >= f[0] + 0.1) bal += (i % 2 ? -1200 : 3000) * ease(seg(a, f[0] + 0.1, f[0] + 0.22)); });
  const blink = (odd) => { let k = 1; F.slice(2).forEach((f, i) => { if (i % 2 === odd && a > f[0] + 0.1) k += 0.12 * Math.exp(-(a - f[0] - 0.1) * 14); }); return k; };
  const hit = (t0) => (a > t0 ? 0.045 * Math.exp(-(a - t0) * 9) * Math.cos((a - t0) * 16) : 0);
  const phone = at(PH[0], PH[1], `<path d="${rr(-140, -260, 280, 520, 36)}" fill="${P.ink}"/><path d="${rr(-122, -230, 244, 446, 18)}" fill="#fffaf0"/><rect x="-34" y="-246" width="68" height="10" rx="5" fill="#3b2a6e"/>
    ${text(0, -110, fmt(bal), 84, P.ink)}<path d="M-96 -78h192" stroke="#e6dcc6" stroke-width="5" stroke-linecap="round"/>
    ${a > 0.96 ? at(0, -8, `<path d="${rr(-100, -36, 200, 72, 16)}" fill="#d6f7e4"/>${text(0, 17, "+3,000", 46, P.greenD)}`, (0.3 + 0.7 * spring(a - 0.96, 10, 16)) * blink(0)) : ""}
    ${a > 2.2 ? at(0, 84, `<path d="${rr(-100, -36, 200, 72, 16)}" fill="#ffe1e4"/>${text(0, 17, "−1,200", 46, P.redD)}`, (0.3 + 0.7 * spring(a - 2.2, 10, 16)) * blink(1)) : ""}`, 1.08 * (1 + hit(0.96) + hit(1.85)), 5);
  let tokens = "";
  const fly = (from, ctrl, to, t0, t1, inner, k = 1) => { if (a < t0 || a > t1 + 0.1) return; const p = ease(seg(a, t0, t1)), b = bez(from, ctrl, to, p); tokens += at(b[0], b[1], inner, k * (0.3 + 0.7 * spring(a - t0, 10, 16)) * (1 - seg(a, t1, t1 + 0.1))); };
  const IN = [CH, [760, 40], [PH[0], PH[1] - 150]], OUTP = [[PH[0], PH[1] - 80], [1000, 250], [KEY[0], KEY[1] + 34]];
  fly(...IN, 0.46, 0.96, pill("+3,000", P.green, P.greenD), 1.3);
  fly(...OUTP, 1.8, 2.31, pill("−1,200", P.red, P.redD), 1.3);
  F.slice(2).forEach((f, i) => (i % 2 ? fly(...OUTP, f[0], f[0] + 0.2, `<circle r="26" fill="${P.red}"/>${text(0, 17, "−", 50, "#fff")}`) : fly(...IN, f[0], f[0] + 0.2, `<circle r="26" fill="${P.green}"/>${text(0, 18, "+", 50, "#fff")}`)));
  // the wallet: shut all this time; it opens on nothing
  const o1 = ease(seg(a, 3.0, 3.14)), o2 = a < 3.14 ? 0 : spring(a - 3.14, 8, 13), wb = (a - 3.45) / 0.7, lining = "#6a3f20";
  const half = (inner) => `${two(rr(0, -125, 210, 250, 26), P.wood, P.woodD, 0, 9)}<path d="M0 -125h8v250h-8Z" fill="${P.woodD}"/><path d="${rr(10, -111, 186, 222, 16)}" fill="${lining}"/><path d="${rr(18, -102, 170, 34, 12)}" fill="${P.night0}"/>${inner}`;
  const web = `<g transform="translate(28 -50)" opacity=".9">${[[150, 26], [130, 92], [78, 132], [16, 132]].map((e, i) => drawn(`M0 0L${e[0]} ${e[1]}`, (wb - i * 0.1) * 2.2, "#cfc6ff", 3.5)).join("")}${[44, 88, 132].map((r, i) => drawn(`M${r} ${r * 0.17}Q${r * 0.66} ${r * 0.62} ${r * 0.12} ${r}`, (wb - 0.3 - i * 0.14) * 2.2, "#cfc6ff", 3.5)).join("")}</g>`;
  const mu = a - 3.5, moth = mu > 0 ? at(-30 + 80 * Math.sin(mu * 3.1), -110 - 90 * mu + 16 * Math.sin(mu * 9), `<ellipse rx="7" ry="15" fill="#8a7a66"/><path d="M0 -4L-30 ${-20 + 16 * Math.sin(a * 40)}L-25 14ZM0 -4L30 ${-20 + 16 * Math.sin(a * 40)}L25 14Z" fill="#e3d2b2"/>`, clamp(mu / 0.2)) : "";
  const wallet = at(1475, 799, `<ellipse cx="${-105 + 105 * o2}" cy="130" rx="${(120 + 100 * o2).toFixed(1)}" ry="10" fill="#1d0f45" opacity=".6"/>
    <g transform="scale(-1 1)">${half(`<path d="${rr(26, -46, 156, 60, 10)}" fill="${P.wood}"/><path d="${rr(26, 30, 156, 60, 10)}" fill="${P.wood}"/><path d="M26 -30h156M26 46h156" stroke="${P.woodD}" stroke-width="5"/>`)}</g>
    ${o2 > 0 ? `<g transform="scale(${Math.max(0.02, o2).toFixed(4)} 1)">${half(`<path d="${rr(24, -52, 164, 150, 12)}" fill="${P.night0}"/>${web}`)}</g>` : ""}
    ${o1 < 1 ? `<g transform="scale(${(-(1 - o1)).toFixed(4)} 1)">${two(rr(0, -125, 210, 250, 26), "#b87644", P.wood, 0, 9)}<path d="M18 -107h174v214h-174Z" fill="none" stroke="${P.gold}" stroke-width="4" stroke-dasharray="12 10" opacity=".75"/>${disc(176, 0, 16, P.gold, P.goldD)}</g>` : ""}${moth}`);
  const lamp = `<path d="M1090 -200V96" stroke="${P.ink}" stroke-width="8"/><path d="M1030 150a60 60 0 0 1 120 0Z" fill="${P.ink}"/><path d="M1044 150L${1044 - 330} 930H${1136 + 330}L1136 150Z" fill="#ffd98a" opacity="${(0.05 + 0.09 * night).toFixed(3)}"/><ellipse cx="1090" cy="152" rx="46" ry="9" fill="#ffe7a8"/>`;
  const room = `<rect x="-400" y="-300" width="2800" height="1700" fill="#4a2b8a"/><rect x="-400" y="780" width="2800" height="640" fill="#3f2479"/><rect x="-400" y="772" width="2800" height="12" fill="#5c39a6"/>
    ${outside}${cal}${lamp}<path d="${rr(640, 930, 1070, 36, 10)}" fill="${P.wood}"/><path d="${rr(640, 954, 1070, 12, 6)}" fill="${P.woodD}"/><rect x="720" y="966" width="30" height="300" fill="${P.woodD}"/><rect x="1610" y="966" width="30" height="300" fill="${P.woodD}"/>${phone}${wallet}${tokens}`;
  return { g: layer(room, c), in: toScreen(c, 236, 170), inC: P.win, inZ: 30, out: toScreen(c, 1475 + 106, 799 + 22), outC: P.night0, outZ: 24 };
}

// ---- shot 3: a book in every bank, and every night they check each other's ----
function shot3(a, tot) {
  const G = 880, xs = [560, 990, 1420], cols = [[P.teal, P.tealD], [P.gold, P.goldD], [P.pink, P.pinkD]], cmpX = xs, cmpY = 218, rowY = [-44, 6, 56], KB = 0.5, KC = 1.3, MOON = 1790, bad = a >= 3.75;
  const cyc = (a - 2.0) / 0.6, f = cyc - Math.floor(cyc), lapse = a >= 2.0 && a < 3.8, dayL = lapse ? Math.exp(-Math.pow((f - 0.17) / 0.09, 2)) : 0;
  const moonX = !lapse ? MOON : f < 0.12 ? lerp(MOON, 2100, easeIn(f / 0.12)) : f < 0.3 ? -300 : lerp(-180, MOON, easeOut((f - 0.3) / 0.7)), sunX = lapse && f > 0.04 && f < 0.32 ? lerp(-180, 2100, (f - 0.04) / 0.28) : -500, arc = (x) => 140 + 110 * Math.pow((x - 960) / 960, 2);
  const sky = `<rect width="1920" height="1080" fill="url(#bnight)"/><g opacity="${(1 - dayL).toFixed(2)}">${stars(5, 60, 0, 1920, 520, tot, (x, y) => Math.hypot(x - 300, y - 200) < 80)}</g><rect width="1920" height="1080" fill="#ff9d6c" opacity="${(dayL * 0.8).toFixed(2)}"/>
    ${at(sunX, arc(sunX), rings(0, 0, 90, "#ffe08a", 0.3) + `<circle r="62" fill="#ffe08a"/>`)}${at(moonX, arc(moonX), rings(0, 0, 84, P.cream, 0.12) + `<circle r="56" fill="${P.cream}"/><circle cx="-20" cy="-14" r="50" fill="${mix(P.night0, P.night1, 0.25)}"/>`)}`;
  const scanX = (m) => lerp(340, 1640, ease(seg(a, 2.22 + m * 0.6, 2.55 + m * 0.6)));
  let banks = "";
  xs.forEach((x, i) => { const up = spring(a - 0.22 - i * 0.12, 7, 11), m = Math.min(2, Math.max(0, Math.floor(cyc))), lookX = bad ? Math.sign(Math.sin(a * 7 + i * 2.1)) : lapse ? clamp((scanX(m) - x) / 400, -1, 1) : a > 0.95 + i * 0.15 ? 0 : (1 - i), lean = (i - 1) * 2.6 * ease(seg(a, 3.8, 4.1));
    banks += at(x, G + (1 - up) * 430, bank({ night: 1, band: cols[i][0], eyes: { lx: lookX, ly: lapse || bad ? -0.2 : -1, lid: bad ? 0.5 * ease(seg(a, 3.78, 3.95)) + 0.06 * Math.sin(a * 9 + i) : 0.12 }, inside: P.ink }), [KB, KB * (i === 1 && bad ? 1 - 0.03 * ease(seg(a, 3.8, 4.1)) : 1)], lean); });
  // the books: out of each bank, up to the table in the sky to be compared, and snatched back when a row does not match
  let books = "", marks = "";
  const vals = [["70", "80", "20"], ["70", "80", "20"], ["70", "80", "90"]], dots = [P.blue, P.pink, P.violet];
  xs.forEach((x, i) => { const t0 = 0.95 + i * 0.15; if (a < t0) return; const pop = spring(a - t0, 8, 13), go = ease(seg(a, 1.7 + i * 0.05, 2.1 + i * 0.05)), back = a < 4.3 ? 0 : spring(a - 4.3 - i * 0.05, 7, 11);
    const rest = [x, 466], cmp = [cmpX[i], cmpY], home = [x, G - 470 * KB], px = lerp(lerp(rest[0], cmp[0], go), home[0], back), py = lerp(lerp(lerp(G - 200, rest[1], pop), cmp[1], go), home[1], back), k = lerp(lerp(0.66 * Math.min(1.2, 0.2 + 0.8 * pop), KC, go), 0.6, back);
    if (go > 0 && back < 1) books += `<path d="M${x} ${G - 652 * KB}L${px.toFixed(1)} ${(py + 100 * k).toFixed(1)}" stroke="${cols[i][0]}" stroke-width="5" stroke-dasharray="3 14" stroke-linecap="round" opacity="${(go * (1 - back)).toFixed(2)}"/>`;
    const shake = bad && i === 2 && a < 4.3 ? 4 * Math.sin(a * 55) * Math.exp(-(a - 3.75) * 5) : 0;
    books += at(px, py, book(rowY.map((ry, r) => { const lit = lapse || bad ? seg(scanX(r), cmp[0] - 150 * KC, cmp[0] + 150 * KC) * (a >= 2.22 + r * 0.6 ? 1 : 0) * (1 - back) : 0, wrong = bad && r === 2;
      return (lit > 0 ? `<path d="${rr(-146, ry - 39, 292 * lit, 48, 8)}" fill="${wrong ? P.red : P.gold}" opacity="${wrong ? 0.3 : 0.28}"/>` : "") + `<circle cx="-106" cy="${ry - 16}" r="12" fill="${dots[r]}"/><path d="M-80 ${ry - 16}h46" stroke="#dccaa0" stroke-width="8" stroke-linecap="round"/>` + at(75 + (wrong && i === 2 ? shake : 0), ry, number(0, 0, vals[i][r], 46, wrong && i === 2 ? P.red : P.ink)); }).join(""), { cover: cols[i][0], coverD: cols[i][1] }), k, bad && back > 0 ? (i - 1) * 4 * back : 0); });
  [0, 1, 2].forEach((m) => { const t0 = 2.22 + m * 0.6, t1 = t0 + 0.33, gone = 1 - seg(a, 4.3, 4.45); if (a < t0 || gone <= 0) return; const y = cmpY + (rowY[m] - 16) * KC;
    if (a < t1) marks += at(scanX(m), y, rings(0, 0, 38, P.gold, 0.3) + `<path d="${rr(-7, -40, 14, 80, 7)}" fill="#fff3c2"/>`);
    else marks += at(1694, y, (m < 2 ? check(0, 0, 38, P.green, a - t1) : cross(0, 0, 42, P.red, a - t1)), gone); });
  const g = sky + `<rect y="${G}" width="1920" height="300" fill="#141a45"/>` + banks + `<rect y="${G}" width="1920" height="300" fill="#141a45"/><rect y="${G}" width="1920" height="10" fill="#2c366f"/>` + books + marks;
  return { g, in: [300, 200], inC: mix(P.night0, P.night1, 0.2), inZ: 12, out: [990, G - 150 * KB], outC: P.ink, outZ: 18 };
}

// ---- shot 4: not a vault full of money: a book. And the town hangs from the book ----
function shot4(a, tot) {
  const VX = 880, VY = 962, K = 60 / 380, q = ease(seg(a, 3.7, 4.55)), z = Math.exp(lerp(Math.log(kf(a, [[0, 6.3], [2.2, 6.5], [3.4, 7.4]])), 0, q)) * (1 + 0.02 * seg(a, 4.55, 5.9));
  const sx = lerp(960, VX, q), sy = lerp(540, VY, q), c = { x: VX - (sx - 960) / z, y: VY - (sy - 540) / z, z }, G = 880;
  const bq = ease(seg(a, 3.7, 4.5)), pulse = a > 2.87 ? 1 + 0.16 * Math.exp(-(a - 2.87) * 6) * Math.cos((a - 2.87) * 11) : 1;
  // the vault, drawn 380 in radius and set small under the bank
  const wheel = kf(a, [[0.45, 0], [0.8, -28], [0.95, -28], [1.5, 430]]), open = kf(a, [[1.45, 0], [2.0, 1.05], [2.15, 1]]), dsx = 1 - 0.93 * open, lit = a > 2.25 ? spring(a - 2.25, 8, 13) : 0;
  const vault = `<circle r="414" fill="#5d678f"/><circle r="352" fill="#0e0828"/><path d="M-300 -120h600M-330 10h660" stroke="#1d1447" stroke-width="16"/>
    <g opacity=".7">${[[150, 40], [120, 110], [40, 150]].map((e) => `<path d="M-250 -250L${-250 + e[0]} ${-250 + e[1]}" stroke="#cfc6ff" stroke-width="4"/>`).join("")}<path d="M-190 -234Q-196 -190 -232 -180M-150 -220Q-160 -150 -220 -140" fill="none" stroke="#cfc6ff" stroke-width="4"/></g>
    ${[[-200, 196], [-146, 196], [-173, 152]].map(([x, y]) => at(x, y, coin(30))).join("")}${a > 2.1 ? text(-110, 130, "z", 44, P.cream, { opacity: 0.8 }) + text(-80, 96, "z", 58, P.cream, { opacity: 0.8 }) : ""}
    ${lit > 0 ? rings(0, 50, 200 * lit, P.gold, 0.2, 1.3) + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M0 70L${(Math.cos(i * 0.785 + tot * 0.25) * 330).toFixed(1)} ${(70 + Math.sin(i * 0.785 + tot * 0.25) * 330).toFixed(1)}" stroke="${P.gold}" stroke-width="10" opacity="${(0.16 * lit).toFixed(2)}"/>`).join("") : ""}
    ${two(rr(-64, 156, 128, 150, 8), "#3b2a7a", "#2a1d5c", 14, 0)}<path d="${rr(-92, 146, 184, 18, 8)}" fill="#4a3791"/>${bq <= 0 ? at(0, 50, book(rows("70", "80")), 0.95 * pulse) : ""}
    <g transform="translate(-380 0) scale(${dsx.toFixed(4)} 1) translate(380 0)">${disc(0, 0, 380, mix(P.steel, "#5d678f", open * 0.6), mix(P.steelD, "#4a5278", open * 0.6), 0.05)}<circle r="300" fill="none" stroke="${P.steelD}" stroke-width="14"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((d) => `<circle cx="${(Math.cos(d * Math.PI / 180) * 340).toFixed(1)}" cy="${(Math.sin(d * Math.PI / 180) * 340).toFixed(1)}" r="16" fill="#6c779f"/>`).join("")}
      <g transform="rotate(${wheel.toFixed(1)})">${[0, 60, 120].map((d) => `<rect x="-200" y="-15" width="400" height="30" rx="15" fill="#5d678f" transform="rotate(${d})"/>`).join("")}${[0, 60, 120, 180, 240, 300].map((d) => `<circle cx="${(Math.cos(d * Math.PI / 180) * 200).toFixed(1)}" cy="${(Math.sin(d * Math.PI / 180) * 200).toFixed(1)}" r="26" fill="#44507a"/>`).join("")}<circle r="112" fill="#6c779f"/><circle r="54" fill="${P.ink}"/></g></g>`;
  // the town above
  const far = (col) => mix(col, P.night1, 0.4), H = [[40, 0.62, far(P.teal), far(P.tealD), 1], [345, 0.66, far(P.violet), far(P.violetD), 1], [650, 0.6, far(P.blue), far(P.blueD), 1], [1110, 0.6, far(P.pink), far(P.pinkD), 1], [1440, 0.66, far(P.teal), far(P.tealD), 1], [1770, 0.62, far(P.violet), far(P.violetD), 1],
    [185, 1.08, P.blue, P.blueD, 0], [505, 1.0, P.pink, P.pinkD, 0], [1270, 1.0, P.violet, P.violetD, 0], [1600, 1.08, P.teal, P.tealD, 0]];
  const tilt = (t) => kf(t, [[4.72, 0], [4.98, -11], [5.2, -11], [5.46, 10], [5.64, 10], [5.95, 0]]), bk = Math.exp(lerp(Math.log(0.95 * K), Math.log(1.2), bq));
  const bpos = [VX, lerp(VY + 50 * K, 250, bq) + (bq >= 1 ? 6 * Math.sin(tot * 1.6) : 0)], anchor = (dx, t) => { const r = tilt(t) * Math.PI / 180, lx = dx * 1.3, ly = 100 * 1.3; return [bpos[0] + lx * Math.cos(r) - ly * Math.sin(r), bpos[1] + lx * Math.sin(r) + ly * Math.cos(r)]; };
  let town = "", strings = "";
  const hang = (x, k, i, dx, apexH, inner, lift0, base = G) => { const t0 = 4.12 + i * 0.035, lag = a - 0.07 - i * 0.014, held = spring(a - t0 - 0.3, 8, 13), an = anchor(dx, a), an0 = anchor(dx, 0), anL = anchor(dx, lag);
    const ox = (anL[0] - an0[0]) * 1.6, oy = -lift0 * held + (anL[1] - an0[1]) * 1.5, rot = -tilt(lag - 0.06) * 0.55, ax = x + ox, ay = base + oy - apexH * k;
    town += `<ellipse cx="${x}" cy="${base + 6}" rx="${(110 * k * (1 - 0.25 * held)).toFixed(1)}" ry="${(9 * Math.min(1, k)).toFixed(1)}" fill="#0a0726" opacity=".7"/>` + `<g transform="translate(${ax.toFixed(2)} ${ay.toFixed(2)}) rotate(${rot.toFixed(2)}) translate(0 ${(apexH * k).toFixed(2)}) scale(${k})">${inner}</g>`;
    strings += drawn(`M${an[0].toFixed(1)} ${an[1].toFixed(1)}L${ax.toFixed(1)} ${ay.toFixed(1)}`, seg(a, t0, t0 + 0.3), P.gold, 5) + (a > t0 + 0.3 ? `<circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="9" fill="${P.gold}"/>` : ""); };
  const one = (h, i) => hang(h[0], h[1], i, lerp(-140, 140, h[0] / 1920), 292, house(h[2], h[3], { lit: [1, i % 2, 1] }), h[4] ? 22 : 34, h[4] ? G - 46 : G);
  H.forEach((h, i) => { if (h[4]) one(h, i); });
  hang(VX, 0.55, 5, 0, 654, bank({ night: 1, sign: [1, 1, 1, 1], inside: P.ink }), 16);
  H.forEach((h, i) => { if (!h[4]) one(h, i); });
  const soil = `<rect x="-600" y="${G - 50}" width="3200" height="52" fill="#1b2054"/><rect x="-600" y="${G}" width="3200" height="14" fill="#2c366f"/><rect x="-600" y="${G + 12}" width="3200" height="700" fill="${P.soil}"/>${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${(rnd(i * 9 + 3) * 1920).toFixed(0)}" cy="${(G + 50 + rnd(i * 9 + 4) * 160).toFixed(0)}" rx="${(14 + rnd(i * 9 + 5) * 20).toFixed(0)}" ry="9" fill="#21144d"/>`).join("")}<rect x="${VX - 14}" y="${G}" width="28" height="30" fill="#5d678f"/>`;
  const theBook = bq <= 0 ? "" : at(bpos[0], bpos[1], (bq > 0.5 ? rings(0, 0, 200, P.gold, 0.16 * seg(bq, 0.5, 1), 1.3) : "") + book(rows("70", "80")), bk * pulse, tilt(a));
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(9, 70, -200, 2200, 620, tot) + at(1500, 190, rings(0, 0, 84, P.cream, 0.12) + `<circle r="56" fill="${P.cream}"/><circle cx="-20" cy="-14" r="50" fill="${mix(P.night0, P.night1, 0.2)}"/>`), c, 0.12)
    + layer(skyline(83, -300, 2300, G - 10, 120, 300, "#221a5c", "#ffb066"), c, 0.6) + layer(soil + town + at(VX, VY, vault, K) + strings + theBook, c);
  return { g, in: [960, 540], inC: P.ink, inZ: 20 };
}

const SHOTS = [shot0, shot1, shot2, shot3, shot4], RAN = [5.49, 5.51, 4.31, 5.25], OUT = 0.2, IN = 0.45;
// spec.ends: how long each shot ran before the next one took over, when the voice timing differs from the defaults
export function bankSet(s, step, age, total) {
  begin(); const k = Math.min(step, SHOTS.length - 1), ran = s.ends || RAN; let g;
  if (k > 0 && age < OUT) { const prev = SHOTS[k - 1](ran[k - 1] + age, total); g = through(prev.g, prev.out[0], prev.out[1], age / OUT, prev.outC, prev.outZ || 16); }
  else { const cur = SHOTS[k](age, total); g = k > 0 && age < OUT + IN ? through(cur.g, cur.in[0], cur.in[1], 1 - easeOut((age - OUT) / IN), cur.inC, cur.inZ || 16) : cur.g; }
  return `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0"><defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky0}"/><stop offset=".55" stop-color="${P.sky1}"/><stop offset="1" stop-color="${P.sky2}"/></linearGradient>
    <linearGradient id="bnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.night0}"/><stop offset="1" stop-color="${P.night1}"/></linearGradient><clipPath id="bclip"><rect width="1920" height="1080"/></clipPath></defs><g clip-path="url(#bclip)">${g}</g></svg>`;
}

// the world the other sets of the episode are built in: the same palette, town, bank, book, houses and money
export { P, mix, fmt, cub, house, eyes, bank, book, LINES, rows, coin, note, pill, stars, skyline, clouds, dusk };
