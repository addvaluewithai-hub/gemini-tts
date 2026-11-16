// Crypto part 3, scene "bank": the exchanges are the bank coming back. Seventeen wordless shots, one per board beat
// (shot list: episodes/techforbadguys/explain-crypto-03-world/shots.md), in the world of parts 1 and 2.
//   0 the houses' coins hop into a glass exchange tower and stay there
//   1 inside, the coins sit in the company's vault; the door shuts
//   2 each house gets back a receipt: a line in the company's own book
//   3 three towers, three old troubles: a crowbar, a FOR SALE board, ice
//   4 Mt. Gox: trading cards on a stall turn into coins; a pie of all trading goes 70% gold
//   5 2014: the vault empties through a hole, −850,000
//   6 houses wait at a window while the calendar slides to OCT 2027
//   7 a snail still crawling to 2027 while a bank has long reached the flag (host right)
//   8 2022: the FTX tower, its value rolls to $32,000,000,000, its name lights a stadium
//   9 a pipe from the customers' vault leaks up to the owner's penthouse; the hole: −$8,000,000,000
//  10 a gavel; 25 calendar pages
//  11 customers get their small coin back, while a ghost coin beside it has grown many times (host left)
//  12 DEC 2018: a Canadian exchange tower (maple flag) goes dark
//  13 its one key on a chain falls into the dark; every vault door stays locked
//  14 the locked vault is cut open: empty, cobwebs; a mask falls off the tower (host right)
//  15 Bybit drains $1,500,000,000 (2025); Binance drains a far bigger stream, $6,300,000,000 in 20 min (OCT 2026)
//  16 an empty chair at a far laptop across the sea; a magnifier points at it; the tower pays its customers back (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c3bank.v.js";
import { stars, skyline, house, book } from "./bank.js";
import { calPage } from "./props.js";
import { P, mix, coin, tower, receipt, gavel, key } from "./c3props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7, x1 = 2600) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, x1, 1080, tot), c, 0.15);
const ground = (y, fill = "#24164f", x0 = -1200, x1 = 6400) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="900" fill="${fill}"/>`;
const far = (c, base = 860, seed = 31) => layer(skyline(seed, -800, 2800, base, 90, 260, "#2a1d66", "#ffb066"), c, 0.45);
const fmtN = (v) => Math.round(v).toLocaleString("en");
const roll = (to, p, pre = "", post = "") => pre + fmtN(to * ease(p)) + post;
const cal = (big, small, a, k = 0.62, rot = 6) => (a > 0 ? at(0, 0, calPage(big, small, 1, 150), k * pop(a), rot) : "");
const HC = [[P.blue, P.blueD], [P.pink, P.pinkD], [P.teal, P.tealD], [P.violet, P.violetD]];
// a vault door, 320 across; open 0..1 swings it aside; inner drawn behind it
const vault = (open = 0, inner = "", o = {}) => `<circle r="170" fill="#141038"/>${inner}<g transform="translate(${(-150 * ease(open)).toFixed(1)} 0) scale(${(1 - 0.75 * ease(open)).toFixed(3)} 1)">${disc(0, 0, 160, o.c || P.steel, o.cD || P.steelD)}<circle r="110" fill="none" stroke="${P.steelD}" stroke-width="14"/>${[0, 1, 2, 3, 4, 5].map((i) => { const an = i * 1.047 + (o.spin || 0); return `<path d="M0 0L${(Math.cos(an) * 80).toFixed(1)} ${(Math.sin(an) * 80).toFixed(1)}" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>`; }).join("")}${disc(0, 0, 30, P.gold, P.goldD)}</g>`;
const heap = (n, r = 26, seed = 3) => Array.from({ length: n }, (_, i) => { const row = Math.floor(Math.sqrt(i * 2)), x = (rnd(seed + i) - 0.5) * (140 - row * 16) * 1.6, y = -row * r * 0.9; return at(x, y, coin(r, "B")); }).join("");
const label = (t, size, fill, o = {}) => `${o.pill ? `<path d="${rr(-t.length * size * 0.27 - 24, -size * 0.86, t.length * size * 0.54 + 48, size * 1.1, size * 0.3)}" fill="${o.pill}"/>` : ""}${text(0, 0, t, size, fill)}`;

// ---- 0: everyone's coins go into the tower and stay ----
const T0 = [1340, 900];
function s0(a, tot) {
  const G = 900, c = camAt(a, [[0, 820, 600, 1.12], [3.58, 1000, 580, 1.2]]);
  let hs = "", coins = "";
  [[180, 0], [430, 1], [680, 2], [920, 3]].forEach(([x, k], i) => { hs += at(x, G, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }), 0.95);
    for (let j = 0; j < 2; j++) { const t0 = 0.9 + i * 0.25 + j * 0.45, p = seg(a, t0, t0 + 0.7); if (p <= 0) { coins += at(x + 60, G - 260 + 6 * Math.sin(tot * 3 + i + j), coin(26, "B")); continue; } if (p >= 1) continue;
      const b = bez([x + 60, G - 260], [(x + T0[0]) / 2, G - 560 - 60 * j], [T0[0], G - 140], ease(p)); coins += at(b[0], b[1], coin(26, "B"), 1 - 0.3 * p); } });
  const glow = seg(a, 1.5, 3.2);
  const tw = at(T0[0], G, (glow > 0 ? rings(0, -100, 120 + 40 * glow, P.gold, 0.22 * glow) : "") + tower({ h: 700, seed: 3 }), 1);
  const g = night(c, tot, 5) + far(c) + layer(ground(G) + hs + tw + coins, c);
  return { g, out: toScreen(c, T0[0], G - 80), outC: P.win, outZ: 22 };
}

// ---- 1: the vault inside is the company's ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.1], [1.75, 960, 540, 1.16]]), shut = seg(a, 0.9, 1.3);
  const wall = `<rect x="-400" y="-200" width="2800" height="1500" fill="#2a2266"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${-200 + i * 220}" y="-200" width="10" height="1500" fill="#241d5a"/>`).join("")}`;
  const inside = at(0, 60, heap(14, 30, 5));
  const v = at(960, 580, vault(1 - shut, inside, { spin: shut * 1.5 }), 2.3);
  const plate = at(960, 110, `<path d="${rr(-200, -50, 400, 80, 14)}" fill="${P.ink}"/>${text(0, 14, "EXCHANGE", 52, P.gold)}`, pop(a - 0.2));
  return { g: night(c, tot, 9) + layer(wall + v + plate, c), in: [960, 540], inC: P.win, inZ: 18 };
}

// ---- 2: the houses hold receipts: a line in the company's book ----
function s2(a, tot) {
  const G = 920, c = camAt(a, [[0, 960, 560, 1.0], [0.9, 960, 560, 1.0], [1.4, 1300, 420, 1.35], [2.12, 1300, 420, 1.38]]);
  const tw = at(1300, G, tower({ h: 760, seed: 3 }) + at(0, -420, vault(0, "", {}), 0.5), 1);
  let hs = "", rc = "";
  [[200, 0], [460, 1], [720, 2]].forEach(([x, k], i) => { hs += at(x, G, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }), 0.8);
    const p = seg(a, 0.3 + i * 0.12, 0.85 + i * 0.12), b = bez([1300, G - 420], [(x + 1300) / 2, G - 760], [x + 90, G - 330], ease(p));
    if (p > 0) rc += at(b[0], b[1] + (p >= 1 ? 4 * Math.sin(tot * 3 + i) : 0), receipt({ amount: "1 B" }), 0.55, p >= 1 ? -6 : -40 * (1 - p)); });
  // the company's book, a row lighting per house
  const bk = a > 1.0 ? at(1300, 300, book(`${[0, 1, 2].map((r) => `<path d="${rr(-130, -70 + r * 50, 260, 38, 8)}" fill="${seg(a, 1.15 + r * 0.15, 1.35 + r * 0.15) > 0 ? mix(P.cream, P.gold, 0.5) : P.cream}"/><circle cx="-105" cy="${-51 + r * 50}" r="11" fill="${HC[r][0]}"/>${text(60, -38 + r * 50, "1 B", 30, P.ink)}`).join("")}`), 1.15 * pop(a - 1.0)) : "";
  return { g: night(c, tot, 13) + far(c) + layer(ground(G) + hs + tw + rc + bk, c) };
}

// ---- 3: hack, bankruptcy, freeze ----
function s3(a, tot) {
  const G = 900, c = camAt(a, [[0, 960, 520, 0.92], [3.47, 960, 520, 0.95]]);
  const X = [440, 960, 1480], T = [1.46, 2.14, 2.82];
  let g = ground(G);
  X.forEach((x, i) => { const u = a - T[i], lit = i === 1 && u > 0 ? 1 - seg(u, 0.1, 0.5) : 1, shake = i === 0 && u > 0 && u < 0.5 ? 6 * Math.sin(u * 60) : 0;
    g += at(x + shake, G, tower({ h: 620, seed: i * 5 + 1, lit, crack: i === 0 ? seg(u, 0.05, 0.4) : 0 }), 0.85 * pop(a - 0.1 - i * 0.12));
    if (u <= 0) return;
    if (i === 0) { const sw = ease(seg(u, 0, 0.25)); g += at(x + 120, G - 420, `<g transform="rotate(${(-60 + 60 * sw).toFixed(1)})"><path d="M0 0L170 -170" stroke="${P.red}" stroke-width="26" stroke-linecap="round"/><path d="M170 -170q40 -10 30 30" fill="none" stroke="${P.red}" stroke-width="26" stroke-linecap="round"/></g>`, pop(u)) + rings(x + 60, G - 420, 90 * seg(u, 0.15, 0.5), P.red, 0.3 * (1 - seg(u, 0.4, 0.9))); }
    if (i === 1) g += at(x, G - 300, `<rect x="-8" y="0" width="16" height="300" fill="${P.woodD}"/>${two(rr(-150, -70, 300, 130, 12), P.cream, P.creamD, 0, 8)}${text(0, -12, "FOR", 50, P.red)}${text(0, 46, "SALE", 56, P.red)}`, pop(u), -6);
    if (i === 2) { const f = seg(u, 0, 0.4); g += at(x, G - 290, `<path d="${rr(-200, -330, 400, 640, 40)}" fill="#cfefff" opacity="${(0.55 * f).toFixed(2)}" stroke="#e8f6ff" stroke-width="10"/><path d="M-150 -280L-60 -280L-170 40Z" fill="#fff" opacity="${(0.4 * f).toFixed(2)}"/>`, 0.6 + 0.4 * spring(u, 9, 14)) + at(x + 170, G - 650, `<path d="M0 -40V40M-35 -20L35 20M-35 20L35 -20" stroke="#e8f6ff" stroke-width="10" stroke-linecap="round"/>`, pop(u - 0.2), tot * 40); } });
  return { g: night(c, tot, 17) + far(c) + layer(g, c), in: [960, 540], inC: P.ink, inZ: 14 };
}

// ---- 4: Mt. Gox: from game cards to 70% of all trading ----
function s4(a, tot) {
  const G = 900, c = camAt(a, [[0, 600, 560, 1.35], [3.8, 640, 580, 1.4], [4.6, 1000, 540, 1.0], [6.68, 1020, 540, 1.02]]);
  // the booth with its sign
  const booth = at(560, G, `<rect x="-300" y="-430" width="20" height="430" fill="${P.woodD}"/><rect x="280" y="-430" width="20" height="430" fill="${P.woodD}"/>${two(rr(-320, -160, 640, 160, 10), P.wood, P.woodD, 0, 10)}
    ${two(rr(-260, -560, 520, 120, 16), P.ink, "#100a2a", 0, 8)}${text(0, -474, "Mt. Gox", 84, P.gold)}`, 1);
  // cards fan out on the counter, then flip into coins
  let cards = "";
  for (let i = 0; i < 5; i++) { const t0 = 2.3 + i * 0.12, p = pop(a - t0), flip = seg(a, 3.6 + i * 0.1, 3.95 + i * 0.1), sx = Math.abs(Math.cos(Math.PI * flip)), x = 320 + i * 120, y = G - 280 - 8 * Math.sin(i);
    const face = flip < 0.5 ? `<path d="${rr(-50, -70, 100, 140, 10)}" fill="#fff6e6"/><path d="${rr(-40, -60, 80, 70, 6)}" fill="${[P.pink, P.teal, P.violet, P.blue, P.red][i]}"/><circle cx="0" cy="-26" r="18" fill="${P.cream}"/><path d="M-30 30h60M-30 46h40" stroke="#c9b48a" stroke-width="7" stroke-linecap="round"/>` : coin(52, "B");
    cards += at(x, y, face, [Math.max(0.05, sx) * p * 1.5, p * 1.5], (i - 2) * 8 * (1 - flip)); }
  // the pie of all trading: 70% goes gold
  const pie = seg(a, 4.4, 5.8), PX = 1450, PY = 520, R = 230, ang = 0.7 * 2 * Math.PI * ease(pie), ex = Math.sin(ang) * R, ey = -Math.cos(ang) * R;
  const slice = pie > 0 ? `<path d="M0 0L0 ${-R}A${R} ${R} 0 ${ang > Math.PI ? 1 : 0} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}Z" fill="${P.gold}"/>` : "";
  const pieG = a > 4.1 ? at(PX, PY, `${disc(0, 0, R, "#4b3d8f", "#36296e")}${slice}<circle r="${R}" fill="none" stroke="${P.ink}" stroke-width="8"/>${pie > 0.6 ? at(70, 40, label("70%", 110, P.ink), pop(a - 5.4)) : ""}`, pop(a - 4.1)) : "";
  return { g: night(c, tot, 21) + far(c) + layer(ground(G) + booth + cards + pieG, c) };
}

// ---- 5: 2014: the vault empties, −850,000 ----
function s5(a, tot) {
  const c = camAt(a, [[0, 1080, 520, 1.25], [3.51, 1080, 520, 1.32]]), drain = seg(a, 1.25, 3.2);
  const n = Math.round(16 * (1 - drain));
  const v = at(820, 560, vault(0.75, at(0, 60, heap(n, 34, 7)) + (drain > 0 ? `<path d="M-40 150L40 150L20 172L-20 172Z" fill="${P.ink}"/>` : "")), 1.5);
  let falling = ""; for (let i = 0; i < 14; i++) { const u = (a - 1.3 - i * 0.12); if (u < 0 || u > 1.4) continue; const y = 820 + u * u * 500, x = 820 + (rnd(i) - 0.5) * 120 + 60 * u * (rnd(i + 9) - 0.5); falling += at(x, y, coin(22, "B"), 1, u * 200); }
  const cnt = a > 1.8 ? at(1470, 520, label("−" + fmtN(850000 * ease(seg(a, 1.9, 3.0))), 110, P.red), pop(a - 1.8)) : "";
  return { g: night(c, tot, 25) + layer(`<rect x="-400" y="-200" width="2800" height="1500" fill="#241d5a"/>` + v + falling + at(1470, 260, cal("2014", "", a - 0.2, 0.8, 4)) + cnt, c), in: [960, 540], inC: P.ink, inZ: 14 };
}

// ---- 6: still waiting at the window: OCT 2027 ----
function s6(a, tot) {
  const G = 900, c = camAt(a, [[0, 1080, 560, 1.3], [4.86, 1140, 560, 1.34]]);
  const win = at(1420, G, `${two(rr(-260, -520, 520, 520, 14), "#5a6aa8", "#44529a", 0, 10)}<path d="${rr(-180, -420, 360, 200, 10)}" fill="#141038"/><path d="M-180 -320h360" stroke="${P.steelD}" stroke-width="8"/>${two(rr(-200, -220, 400, 30, 6), P.wood, P.woodD, 0, 6)}${text(0, -460, "Mt. Gox", 52, P.gold)}`, 1);
  let q = ""; for (let i = 0; i < 5; i++) { const x = 1060 - i * 200, k = i % 4, bob = 3 * Math.sin(tot * 2 + i); q += at(x, G + bob, house(HC[k][0], HC[k][1], { lit: [1, 0, 1] }), 0.75); }
  // the calendar slides along the years and stops on OCT 2027
  const p = seg(a, 2.3, 3.5), yr = 2014 + Math.round(13 * ease(p)), small = p >= 1 ? "OCT" : "";
  const cl = at(1420, 260, calPage(String(yr), small, 1, 150), 0.8 * pop(a - 0.4), 5 + 6 * Math.sin(p * Math.PI));
  return { g: night(c, tot, 29) + far(c) + layer(ground(G) + q + win + cl, c) };
}

// ---- 7: thirteen years; even banks are faster (host right) ----
function s7(a, tot) {
  const G = 820, c = camAt(a, [[0, 860, 600, 1.4], [2.7, 900, 600, 1.45]]);
  const track = `<path d="M300 ${G + 40}H1500" stroke="#3a2a7a" stroke-width="24" stroke-linecap="round"/>`;
  const flag = at(1400, G + 30, `<rect x="-6" y="-300" width="12" height="300" fill="${P.steel}"/><path d="M6 -300h150v90h-150Z" fill="${P.cream}"/>${text(80, -236, "2027", 46, P.ink)}`, 1);
  const bk = a > 1.2 ? at(1250, G + 30, `${two(rr(-150, -200, 300, 200, 8), "#f1d3a2", "#e3b987", 0, 8)}<path d="M-170 -200L0 -290L170 -200Z" fill="${P.cream}"/>${text(0, -120, "BANK", 50, P.ink)}`, 0.8 * pop(a - 1.2)) + (a > 1.6 ? check(1250, G - 300, 40, P.green, a - 1.6) : "") : "";
  const sx = 420 + 22 * a, snail = at(sx, G + 30, `<path d="M-90 0Q-100 -20 -70 -24H60Q90 -20 80 0Z" fill="#a8d47a"/>${disc(-10, -70, 60, "#e8a23c", "#c47f22")}<path d="M-10 -70m-36 0a36 36 0 1 0 36 -36a22 22 0 1 0 22 22" fill="none" stroke="#a8641a" stroke-width="8"/><path d="M60 -20l14 -60M74 -20l22 -54" stroke="#a8d47a" stroke-width="8" stroke-linecap="round"/>`, 1.2);
  const yrs = at(560, 430, label("13", 160, P.gold) + text(0, 70, "YEARS", 48, P.cream), pop(a - 0.1));
  return { g: night(c, tot, 33) + layer(ground(G + 40) + track + flag + bk + snail + yrs, c) };
}

// ---- 8: FTX: $32 billion and its name on a stadium ----
function s8(a, tot) {
  const G = 900, c = camAt(a, [[0, 800, 420, 1.0], [3.7, 820, 440, 1.0], [4.5, 960, 560, 0.9], [5.04, 980, 560, 0.9]]);
  const tw = at(620, G, tower({ h: 820, name: "FTX", seed: 11, c: "#2a8fb0", cD: "#1f6f8a" }), pop(a - 0.1) * 0.9 + 0.1);
  const val = a > 2.0 ? at(1180, 330, label(roll(32e9, seg(a, 2.1, 3.5), "$"), 84, P.gold, { pill: P.ink }), pop(a - 2.0)) : "";
  // the stadium lights up with the name
  const on = seg(a, 4.0, 4.6);
  const stad = at(1360, G, `<path d="M-420 0V-170Q0 -330 420 -170V0Z" fill="#3b3180"/><path d="M-380 -150Q0 -290 380 -150" fill="none" stroke="#5a4ab0" stroke-width="18"/>${[-300, -100, 100, 300].map((x) => `<rect x="${x - 6}" y="-380" width="12" height="220" fill="${P.steel}"/><circle cx="${x}" cy="-385" r="${16 + 6 * on}" fill="${on > 0 ? "#fff6c8" : "#3a2a7a"}"/>`).join("")}
    <path d="${rr(-150, -260, 300, 70, 10)}" fill="${P.ink}"/>${text(0, -205, "FTX", 60, mix("#3a2a7a", P.gold, on))}${on > 0 ? rings(0, -225, 160, P.gold, 0.18 * on) : ""}`, 1.35);
  return { g: night(c, tot, 37) + far(c) + layer(ground(G) + stad + tw + at(1720, 170, cal("2022", "", a - 0.2, 0.7, 6)) + val, c) };
}

// ---- 9: the customers' vault leaks into the penthouse: −$8 billion ----
function s9(a, tot) {
  const c = camAt(a, [[0, 1040, 580, 1.3], [3.18, 1040, 570, 1.34]]), leak = seg(a, 0.3, 1.6);
  const vaultBox = at(640, 800, `${two(rr(-260, -200, 520, 260, 16), "#5a6aa8", "#44529a", 0, 10)}${[0, 1, 2, 3].map((k) => `<circle cx="${-180 + k * 120}" cy="-140" r="22" fill="${HC[k][0]}"/>`).join("")}${at(0, 0, heap(Math.round(12 * (1 - 0.7 * leak)), 24, 11))}`, 1);
  const pipe = `<path d="M820 700H1060V300H1250" fill="none" stroke="${P.steelD}" stroke-width="44"/><path d="M820 700H1060V300H1250" fill="none" stroke="${P.steel}" stroke-width="28"/>`;
  let flow = ""; for (let i = 0; i < 8; i++) { const u = ((a * 0.9 + i / 8) % 1); if (a < 0.4) break; const L = 240 + 400 + 190, d = u * L; const p = d < 240 ? [820 + d, 700] : d < 640 ? [1060, 700 - (d - 240)] : [1060 + (d - 640), 300]; flow += at(p[0], p[1], coin(16, ""), 1); }
  const pent = at(1450, 360, `${two(rr(-200, -160, 400, 200, 16), "#ff9ad0", P.pinkD, 0, 10)}<path d="M-230 -160H230L190 -220H-190Z" fill="${P.gold}"/>${[-120, 0, 120].map((x, i) => `<circle cx="${x}" cy="-60" r="${14 + 4 * Math.sin(tot * 6 + i)}" fill="${[P.gold, P.cream, P.teal][i]}"/>`).join("")}${at(0, 0, heap(Math.round(10 * leak), 20, 13))}`, 1);
  const hole = a > 1.6 ? at(700, 470, label("−" + roll(8e9, seg(a, 1.7, 2.7), "$"), 84, P.red, { pill: P.ink }), pop(a - 1.6)) : "";
  return { g: night(c, tot, 41) + layer(`<rect x="-400" y="${960}" width="2800" height="400" fill="#24164f"/>` + vaultBox + pipe + flow + pent + hole, c) };
}

// ---- 10: twenty-five years ----
function s10(a, tot) {
  const c = camAt(a, [[0, 1000, 560, 1.45], [1.17, 1000, 560, 1.5]]), hit = seg(a, 0.05, 0.25);
  const gv = at(760, 720, gavel(hit), 1.9) + (a > 0.25 ? rings(700, 690, 160 * seg(a, 0.25, 0.6), P.cream, 0.3 * (1 - seg(a, 0.5, 0.9))) : "");
  let pages = ""; for (let i = 0; i < 4; i++) { const u = a - 0.45 - i * 0.14; if (u < 0) continue; pages += at(1300 + 260 * u, 300 - 300 * u, calPage("", "", 1, 150), 0.5 * (1 - seg(u, 0.4, 0.6)), 20 * u); }
  const cl = at(1300, 520, calPage("25", "YEARS", 1, 150), 1.1 * pop(a - 0.3), 4);
  return { g: night(c, tot, 45) + layer(`<rect x="-400" y="820" width="2800" height="500" fill="#24164f"/>` + gv + cl + pages, c) };
}

// ---- 11: repaid at the crash price; the coin grew without them (host left) ----
function s11(a, tot) {
  const G = 880, c = camAt(a, [[0, 1120, 580, 1.25], [4.91, 1160, 580, 1.3]]);
  const hs = [[780, 0], [1040, 1]].map(([x, k]) => at(x, G, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }), 0.95)).join("");
  const got = seg(a, 0.6, 1.3), b = bez([1450, 260], [1150, 140], [910, G - 330], ease(got));
  const small = got > 0 ? at(b[0], b[1], coin(40, "B")) : "";
  const grow = seg(a, 3.0, 4.4), gr = 40 + 200 * ease(grow);
  const ghost = a > 2.9 ? at(1440, G - gr - 10, `<g opacity=".55">${coin(gr, "B")}</g>${rings(0, 0, gr * 1.1, P.gold, 0.16 * grow)}`, 1) + (grow > 0.6 ? at(1440, G - 2 * gr - 70, label("×5", 80, P.gold), pop(a - 4.1)) : "") : "";
  const cl = a > 1.9 ? at(640, 300, calPage("2022", "", 1, 150), 0.55 * pop(a - 1.9), -5) : "";
  return { g: night(c, tot, 49) + far(c) + layer(ground(G) + hs + small + ghost + cl, c) };
}

// ---- 12: a Canadian exchange, DEC 2018: its founder dies, the tower goes dark ----
const maple = `<path d="M0 -40L8 -18L22 -26L18 -4L34 -10L24 8L30 14L8 16L10 34L0 30L-10 34L-8 16L-30 14L-24 8L-34 -10L-18 -4L-22 -26L-8 -18Z" fill="${P.red}"/>`;
const T12 = [1000, 900];
const canTower = (lit) => tower({ h: 700, seed: 19, lit, c: "#7a3a5a", cD: "#5c2a44" }) + at(0, -880, `<rect x="-6" y="-60" width="12" height="160" fill="${P.steel}"/><path d="M6 -60h150v90h-150Z" fill="#fff"/><rect x="6" y="-60" width="34" height="90" fill="${P.red}"/><rect x="122" y="-60" width="34" height="90" fill="${P.red}"/>${at(81, -15, maple, 0.8)}`);
function s12(a, tot) {
  const c = camAt(a, [[0, 1140, 400, 0.98], [2.85, 1140, 410, 1.02]]), dark = seg(a, 1.25, 1.75);
  const g = night(c, tot, 53) + far(c) + layer(ground(T12[1]) + at(T12[0], T12[1], canTower(1 - dark)) + at(1500, 330, cal("2018", "DEC", a - 1.6, 0.72, 5)), c);
  return { g, out: toScreen(c, T12[0], T12[1] - 400), outC: P.ink, outZ: 14 };
}

// ---- 13: the only key falls into the dark; every vault stays locked ----
function s13(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [1.52, 960, 560, 1.0]]), fall = easeIn(seg(a, 0.25, 1.1));
  let vs = ""; [520, 960, 1400].forEach((x, i) => { vs += at(x, 720, vault(0, "", { spin: 0 }) + at(0, -10, `<path d="M-22 -14v-14a22 22 0 0 1 44 0v14" fill="none" stroke="${P.gold}" stroke-width="9"/><path d="${rr(-30, -14, 60, 46, 8)}" fill="${P.gold}"/>`, 1.3), 1.15 * pop(a - i * 0.08)); });
  const ky = at(960 - 60, 200 + 700 * fall, key({ digits: 6 }), 1.1 * (1 - 0.4 * fall), 30 + 300 * fall);
  const ch = a < 0.25 ? drawn(`M960 0V170`, 1, P.steel, 6) : "";
  const shade = `<rect width="${FW}" height="${FH}" fill="${P.ink}" opacity="${(0.25 + 0.3 * fall).toFixed(2)}"/>`;
  return { g: night(c, tot, 57) + layer(`<rect x="-400" y="980" width="2800" height="400" fill="#1b1550"/>` + vs + ch + ky, c) + shade, in: [960, 540], inC: P.ink, inZ: 14 };
}

// ---- 14: cut open: it was already empty; the mask falls (host right) ----
function s14(a, tot) {
  const c = camAt(a, [[0, 800, 520, 1.0], [3.0, 820, 520, 1.0], [3.6, 1100, 500, 0.9], [5.32, 1120, 500, 0.92]]), cut = seg(a, 0.6, 2.0), open = seg(a, 2.0, 2.5);
  const sparks = cut > 0 && cut < 1 ? Array.from({ length: 6 }, (_, i) => { const u = ((a * 3 + i / 6) % 1), an = Math.PI * (0.2 + 0.6 * rnd(i)); const px = 160 * Math.cos(Math.PI * 2 * cut) , py = 160 * Math.sin(Math.PI * 2 * cut); return `<circle cx="${(px + Math.cos(an) * 80 * u).toFixed(1)}" cy="${(py - Math.sin(an) * 80 * u).toFixed(1)}" r="${(7 * (1 - u)).toFixed(1)}" fill="${P.gold}"/>`; }).join("") : "";
  const web = open > 0 ? `<g opacity="${open.toFixed(2)}">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 0L${(Math.cos(i * 1.047) * 150).toFixed(0)} ${(Math.sin(i * 1.047) * 150).toFixed(0)}" stroke="#cfd6ee" stroke-width="3"/>`).join("")}${[50, 95, 140].map((r) => `<circle r="${r}" fill="none" stroke="#cfd6ee" stroke-width="3" stroke-dasharray="14 10"/>`).join("")}</g>` : "";
  const v = at(760, 540, vault(open, web + `<circle r="168" fill="none" stroke="${P.gold}" stroke-width="10" stroke-dasharray="${(1055 * cut).toFixed(0)} 2000"/>`) + sparks, 1.5);
  // the tower with a smiling mask that falls off
  const mf = seg(a, 3.4, 4.3), mask = `<path d="M-130 -14Q-120 -50 -60 -40Q0 -30 0 -10Q0 -30 60 -40Q120 -50 130 -14Q120 34 60 30Q16 26 0 6Q-16 26 -60 30Q-120 34 -130 -14Z" fill="${P.cream}"/><path d="M-40 50Q0 80 40 50" fill="none" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>${[-63, 63].map((ex) => `<ellipse cx="${ex}" cy="-6" rx="24" ry="16" fill="${P.ink}"/>`).join("")}`;
  const tw = a > 2.8 ? at(1500, 940, canTower(0.2) + at(0, -560 + 600 * easeIn(mf), mask, 1, 40 * mf), 0.8) : "";
  return { g: night(c, tot, 61) + layer(`<rect x="-400" y="940" width="2800" height="400" fill="#24164f"/>` + v + tw, c) };
}

// ---- 15: Bybit, then Binance: the thefts keep growing ----
const drainTo = (x0, y0, x1, y1, a, t0, t1, n, k = 1) => { let s = ""; for (let i = 0; i < n; i++) { const u = (a - t0) * 1.6 - i / n; if (a < t0 || a > t1 + 0.6 || u < 0 || u > 1) continue; const b = bez([x0, y0], [(x0 + x1) / 2, Math.min(y0, y1) - 220], [x1, y1], u); s += at(b[0], b[1], coin(26 * k, ""), 1); } return s; };
function s15(a, tot) {
  const G = 920, c = camAt(a, [[0, 760, 560, 1.12], [3.4, 780, 560, 1.12], [4.4, 1950, 470, 0.98], [11.1, 2000, 480, 0.96]]);
  const by = at(500, G, tower({ h: 640, name: "Bybit", seed: 23, c: "#3a3a5a", cD: "#2a2a44", nameC: "#ffb33a" }), 0.9);
  const bySack = at(1050, G - 40, `${two("M-80 -10Q-110 100 0 100Q110 100 80 -10Q50 -60 26 -76L40 -104H-40L-26 -76Q-50 -60 -80 -10Z", "#7a5aa8", "#5a3e88", 0, 8)}`, pop(a - 0.9) * 1.1);
  const by$ = a > 1.6 && a < 4.4 ? at(1000, 360, label(roll(1.5e9, seg(a, 1.7, 2.8), "$"), 66, P.red, { pill: P.ink }), pop(a - 1.6)) : "";
  const bn = at(1900, G, tower({ h: 900, name: "Binance", seed: 29, c: "#2a2a2a", cD: "#1a1a1a", nameC: "#f3ba2f" }), 1);
  const bnSack = at(2420, G - 60, `${two("M-120 -10Q-160 150 0 150Q160 150 120 -10Q80 -90 40 -112L60 -150H-60L-40 -112Q-80 -90 -120 -10Z", "#7a5aa8", "#5a3e88", 0, 10)}`, pop(a - 7.4) * 1.3);
  const bn$ = a > 8.2 ? at(1480, 560, label(roll(6.3e9, seg(a, 8.3, 9.8), "$"), 72, P.red, { pill: P.ink }), pop(a - 8.2)) : "";
  const timer = a > 9.0 ? at(2380, 260, `${disc(0, 0, 70, P.cream, P.creamD)}<path d="M0 0L0 -54" stroke="${P.ink}" stroke-width="8" stroke-linecap="round" transform="rotate(${((a - 9) * 400).toFixed(0)})"/>${text(0, 120, "20 MIN", 46, P.cream)}`, 1.5 * pop(a - 9.0)) : "";
  const g = night(c, tot, 65, 3400) + layer(skyline(71, -800, 3400, 900, 90, 260, "#2a1d66", "#ffb066"), c, 0.45) + layer(ground(G) + by + bySack + drainTo(560, G - 400, 1050, G - 120, a, 1.0, 3.0, 10) + bn + bnSack + drainTo(1960, G - 500, 2420, G - 160, a, 7.4, 10.6, 22, 1.2)
    + at(820, 360, cal("2025", "", a - 2.7, 0.62, 5)) + at(1500, 380, cal("2026", "OCT", a - 4.2, 0.7, -5)) + by$ + bn$ + timer, c);
  return { g, out: toScreen(c, 1900, G - 500), outC: P.ink, outZ: 14 };
}

// ---- 16: the thief never left his chair; investigators point; the tower pays back (host right) ----
function s16(a, tot) {
  const G = 900, c = camAt(a, [[0, 560, 600, 1.3], [3.6, 600, 600, 1.3], [4.4, 1300, 600, 1.05], [5.87, 1320, 600, 1.08]]);
  const sea = `<rect x="-400" y="${G - 40}" width="2800" height="400" fill="#1d3a7a"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-300 + i * 260 + 30 * Math.sin(tot + i)} ${G}q30 -14 60 0t60 0" fill="none" stroke="#3f6fc0" stroke-width="6"/>`).join("")}`;
  const isl = at(320, G - 30, `<path d="M-220 0Q-160 -110 0 -120Q160 -110 220 0Z" fill="#2c2458"/>${two(rr(-60, -210, 120, 90, 14), "#4b3d8f", "#36296e", 0, 8)}<path d="M-40 -120v40M40 -120v40" stroke="${P.ink}" stroke-width="10"/>${rings(110, -150, 60, "#9fe7ff", 0.3)}<path d="M80 -120h70l-10 -50h-50Z" fill="${P.ink}"/><path d="${rr(84, -168, 52, 34, 4)}" fill="#9fe7ff"/>`, 1.6);
  const mg = a > 1.4 ? at(lerp(900, 560, ease(seg(a, 1.5, 3.2))), 380, `<circle r="70" fill="#cfe9ff" opacity=".25" stroke="${P.steel}" stroke-width="16"/><path d="M50 50L120 120" stroke="${P.steelD}" stroke-width="22" stroke-linecap="round"/>${at(-70, -86, `<path d="M0 -24L7 -7H25L11 4L16 22L0 11L-16 22L-11 4L-25 -7H-7Z" fill="#ffffff"/>`, 1)}`, pop(a - 1.4)) + (a > 3.0 ? drawn(`M520 440Q450 560 360 720`, seg(a, 3.0, 3.5), P.red, 6, 'stroke-dasharray="10 12"') : "") : "";
  const tw = at(1500, G - 40, tower({ h: 700, name: "Binance", seed: 29, c: "#2a2a2a", cD: "#1a1a1a", nameC: "#f3ba2f" }), 0.9);
  let back = ""; [[1180, 0], [1820, 1], [1960, 2]].forEach(([x, k], i) => { back += at(x, G - 40, house(HC[k][0], HC[k][1], { lit: [1, 1, 1] }), 0.75); });
  back += drainTo(1500, G - 400, 1180, G - 200, a, 4.1, 5.9, 8) + drainTo(1500, G - 400, 1820, G - 200, a, 4.25, 5.9, 8);
  const land = `<rect x="1000" y="${G - 40}" width="1400" height="400" fill="#24164f"/>`;
  return { g: night(c, tot, 69) + layer(sea + isl + land + tw + back + mg, c), in: [960, 540], inC: P.ink, inZ: 14 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16];
export const c3bankSet = makeSet(SHOTS, V, P);
