// Crypto part 6, "open questions": six shots (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md, s7).
//   0 the gold key of part 3 in its lock; a quantum atom hums beside it and a crack crawls toward the key
//   1 MAR 2026: the bar of "machine needed" shrinks to a twentieth
//   2 new padlocks drop onto the book; a race: atom against lock, neck and neck; part 2's silo appears (host right)
//   3 the silo's prize runs out; the guard booth with an empty pay envelope "?"
//   4 a light bulb over the book; tools fly from it to the town (a genius invention)
//   5 a pie: a quarter a wrench, three quarters casino chips; a shopping cart with the coin gets NO ADVICE (host left)
import { clamp, lerp, ease, easeOut, seg, spring, rnd, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c6s7.v.js";
import { book, rows, house, stars, skyline } from "./bank.js";
import { calPage, padlock } from "./props.js";
import { booth } from "./c2props.js";
import { P, mix, coin, key, silo, atom } from "./c6props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -800, 3000, 1080, tot), c, 0.15);
const G = 900;
const ground = (c, fill = P.ground) => layer(`<rect x="-1200" y="${G}" width="4400" height="800" fill="${fill}"/>`, c);
const town = (c, seed = 31) => layer(skyline(seed, -900, 2900, G - 20, 90, 260, "#221a5c", "#ffb066"), c, 0.45);
const pill = (w, a, x, y, bg = P.gold, ink = P.ink, size = 64) => a > 0 ? at(x, y, `<path d="${rr(-(w.length * size * 0.42 + 50) / 2, -size * 0.85, w.length * size * 0.42 + 50, size * 1.3, 20)}" fill="${bg}"/>${text(0, size * 0.28, w, size, ink)}`, pop(a)) : "";
// a lock box: the key's keyhole plate, 260 wide, centre (0, 0)
const lockPlate = (glow = 0) => `${rings(0, 0, 170, P.gold, 0.1 + 0.2 * glow)}${two(rr(-130, -150, 260, 300, 26), P.steel, P.steelD, 0, 10)}<circle cy="-30" r="34" fill="${P.ink}"/><path d="M-16 -10h32l12 80h-56Z" fill="${P.ink}"/>`;

// ---- 0: the key in its lock; a quantum machine hums; a crack crawls toward the key ----
function s0(a, tot) {
  const c = camAt(a, [[0, 860, 500, 1.55], [1.8, 900, 500, 1.5], [4.85, 980, 500, 1.42]]);
  const hum = seg(a, 2.0, 2.6), crack = seg(a, 3.3, 4.3), flick = crack > 0.6 ? 0.5 + 0.5 * Math.sin(a * 40) : 0;
  const lk = at(620, 520, lockPlate(1 - crack)) + at(500, 470, key({ digits: 8, unroll: 1, c: mix(P.gold, P.red, 0.6 * flick), bg: P.steel }), 0.9, -6);
  const at1 = hum > 0 ? at(1330, 470, `${rings(0, 0, 260, "#b98aff", 0.12 + 0.06 * Math.sin(tot * 6))}${atom(180, tot)}`, pop(a - 2.0)) + at(1330, 720, `${two(rr(-170, -30, 340, 60, 14), "#3a2f7a", "#2b2260", 0, 8)}`, pop(a - 2.0)) : "";
  const cr = crack > 0 ? drawn("M1150 480L1040 440L990 520L900 470L840 540L780 500", crack, "#e0c8ff", 10, 'stroke-linejoin="round"') + drawn("M1150 480L1040 440L990 520L900 470L840 540L780 500", crack, "#fff", 3) : "";
  const g = night(c, tot, 41) + town(c) + ground(c) + layer(lk + at1 + cr, c);
  return { g, out: toScreen(c, 1330, 470), outC: "#2a1d66", outZ: 16 };
}

// ---- 1: MAR 2026; the machine needed shrinks to a twentieth ----
function s1(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.32], [5.43, 960, 570, 1.38]]);
  const shrink = ease(seg(a, 1.5, 4.2)), h = lerp(620, 31, shrink);
  const cal = at(360, 330, calPage("2026", "MAR", 1, 150), 0.9 * pop(a - 0.15), -5);
  const old = `<path d="${rr(980, G - 620, 260, 620, 16)}" fill="none" stroke="${P.steelD}" stroke-width="6" stroke-dasharray="18 14" opacity="${(0.8 * shrink).toFixed(2)}"/>`;
  const bar = `${two(rr(980, G - h, 260, h, 16), "#8a5be0", "#6a40bd", 0, 10)}${at(1110, G - h - 120, atom(80, tot), 1)}`;
  const div = shrink > 0.95 ? pill("÷ 20", a - 4.25, 1520, 520, P.gold, P.ink, 96) : "";
  const g = night(c, tot, 43) + town(c, 37) + ground(c) + layer(cal + old + bar + div, c);
  return { g, in: [1110, 300], inC: "#2a1d66", inZ: 16 };
}

// ---- 2: new locks on the book; the race; the silo appears (host right) ----
function s2(a, tot) {
  const c = camAt(a, [[0, 640, 560, 1.55], [1.5, 660, 540, 1.45], [2.9, 900, 520, 1.3], [4.47, 860, 540, 1.25]]);
  const bk = at(620, 600, book(rows("70", "80")), 1.3);
  const locks = [0.4, 0.8].map((t0, i) => a > t0 ? at(470 + i * 300, 600 - 300 * (1 - easeOut(seg(a, t0, t0 + 0.35))), padlock(1.3, 0), 1) : "").join("");
  // the race track: two lanes, the atom and a new lock, neck and neck
  const run = seg(a, 1.6, 4.47), x = (lane) => lerp(980, 1380, ease(run)) + (lane ? 10 * Math.sin(a * 7) : -10 * Math.sin(a * 7));
  const track = a > 1.5 ? `<path d="${rr(920, 230, 560, 250, 30)}" fill="#2b2260" opacity="${seg(a, 1.5, 1.8).toFixed(2)}"/><path d="M920 355h560" stroke="${P.cream}" stroke-width="5" stroke-dasharray="26 18" opacity=".6"/><path d="M1460 240v230" stroke="${P.cream}" stroke-width="10" stroke-dasharray="20 20"/>` + at(x(0), 295, atom(66, tot)) + at(x(1), 425, padlock(1.0, 0)) : "";
  const sl = a > 3.0 ? at(330, 900, silo(0.9, { lid: 1, id: "s2" }), 0.55 * pop(a - 3.0)) : "";
  const g = night(c, tot, 45) + town(c, 39) + ground(c) + layer(bk + locks + track + sl, c);
  return { g, out: toScreen(c, 330, 700), outC: P.gold, outZ: 18 };
}

// ---- 3: the prize runs out; the guard booth, an empty pay envelope ----
function s3(a, tot) {
  const c = camAt(a, [[0, 820, 600, 1.3], [1.2, 860, 600, 1.3], [2.83, 1020, 600, 1.32]]);
  const fill = lerp(0.35, 0, ease(seg(a, 0.1, 1.2)));
  const sl = at(560, G, silo(fill, { lid: 1, id: "s3" }), 1);
  const bo = a > 1.3 ? at(1180, G, booth({ lamp: 0.3 + 0.2 * Math.sin(tot * 9), cap: 1 }), 1.3 * pop(a - 1.35)) : "";
  const env = a > 1.7 ? at(1450, 520, `${two(rr(-110, -70, 220, 140, 10), P.cream, P.creamD, 0, 6)}<path d="M-110 -70L0 10L110 -70" fill="none" stroke="${P.creamD}" stroke-width="6"/>${text(0, 52, "?", 80, P.red)}`, pop(a - 1.75), -6) : "";
  const g = night(c, tot, 47) + town(c, 51) + ground(c) + layer(sl + bo + env, c);
  return { g, in: [560, 380], inC: P.gold, inZ: 18 };
}

// ---- 4: a light bulb over the book; tools fly from it to the town ----
const wrench = (k = 1) => at(0, 0, `<path d="M-60 40L30 -50" stroke="${P.steel}" stroke-width="22" stroke-linecap="round"/><path d="M30 -50a34 34 0 1 1 30 30l-10 -18l-14 -6Z" fill="${P.steel}"/>`, k);
const gear = (k = 1) => at(0, 0, `${Array.from({ length: 8 }, (_, i) => `<rect x="-10" y="-48" width="20" height="22" fill="${P.gold}" transform="rotate(${i * 45})"/>`).join("")}<circle r="36" fill="${P.gold}"/><circle r="14" fill="${P.ink}"/>`, k);
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 440, 1.55], [1.9, 960, 440, 1.45], [5.25, 960, 560, 1.0]]);
  const bk = at(960, 520, book(rows("70", "80")), 1.2);
  const on = seg(a, 1.0, 1.3), bulb = a > 0.9 ? at(960, 230, `${on > 0 ? rings(0, 0, 150, P.gold, 0.25 * on) : ""}${two("M-60 -10Q-80 -100 0 -110Q80 -100 60 -10Q40 20 36 50H-36Q-40 20 -60 -10Z", mix("#cfc9e6", "#fff3a8", on), mix("#a8a2c4", P.gold, on), 0, 6)}${two(rr(-34, 50, 68, 36, 8), P.steel, P.steelD, 0, 6)}`, pop(a - 0.9)) : "";
  const HS = [[200, P.blue, P.blueD], [520, P.teal, P.tealD], [1400, P.pink, P.pinkD], [1720, P.violet, P.violetD]];
  let hs = "", tools = "";
  HS.forEach(([x, col, colD], i) => { const t0 = 2.5 + i * 0.4, p = ease(seg(a, t0, t0 + 0.7)), lit = a > t0 + 0.7 ? 1 : 0;
    hs += at(x, G, house(col, colD, { lit: [lit, lit, lit] }), 0.9);
    if (p > 0 && p < 1) { const bx = lerp(960, x, p), by = lerp(260, G - 330, p) - 180 * Math.sin(Math.PI * p); tools += at(bx, by, i % 2 ? gear(0.7) : wrench(0.7), 1, p * 360); }
    if (p >= 1) hs += at(x + 80, G - 260, i % 2 ? gear(0.5) : wrench(0.5), 1); });
  const g = night(c, tot, 49) + town(c, 53) + ground(c) + layer(hs + bk + bulb + tools, c);
  return { g, out: toScreen(c, 960, 520), outC: P.wood, outZ: 16 };
}

// ---- 5: a quarter solving, three quarters betting; no advice (host left) ----
const chip = (c) => `<circle r="26" fill="${c}"/><circle r="26" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="8 8"/><circle r="12" fill="#fff" opacity=".6"/>`;
function s5(a, tot) {
  const c = camAt(a, [[0, 1080, 520, 1.28], [5.43, 1110, 520, 1.32]]);
  const CX = 900, CY = 440, R = 250, p = ease(seg(a, 0.0, 3.0));
  const arc = (a0, a1, col) => { const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0), x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1); return `<path d="M${CX} ${CY}L${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${col}"/>`; };
  const q = -Math.PI / 2, s1e = q + Math.PI / 2 * clamp(p * 1.6), s2e = q + Math.PI / 2 + Math.PI * 1.5 * seg(p, 0.3, 1);
  let pie = `<circle cx="${CX}" cy="${CY}" r="${R + 12}" fill="#1b1550"/>` + (p > 0 ? arc(q, s1e, P.green) : "") + (p > 0.3 ? arc(q + Math.PI / 2, s2e, P.red) : "");
  if (a > 1.4) pie += at(CX + 110, CY - 110, `<path d="M-40 26L18 -32" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M18 -32a22 22 0 1 1 20 20l-6 -12l-10 -4Z" fill="#fff"/>`, pop(a - 1.4));
  if (a > 2.4) [[-120, 60], [-60, 150], [40, 140], [-150, -40]].forEach(([dx, dy], i) => { pie += at(CX + dx, CY + dy, chip(["#ffd04a", "#3fa9ff", "#22c7b8", "#fff4dc"][i]), pop(a - 2.4 - i * 0.1)); });
  const roll = easeOut(seg(a, 3.4, 4.0)), cx = lerp(2100, 1530, roll);
  const cart = a > 3.3 ? at(cx, 760, `<path d="M-130 -130H120L100 -20H-110Z" fill="none" stroke="${P.steel}" stroke-width="14" stroke-linejoin="round"/><path d="M-170 -170L-130 -130" stroke="${P.steel}" stroke-width="14" stroke-linecap="round"/>${at(0, -100, coin(60, "B"))}<circle cx="-80" cy="20" r="20" fill="${P.ink}"/><circle cx="70" cy="20" r="20" fill="${P.ink}"/>`) : "";
  const stamp = a > 4.0 ? at(1530, 630, `${cross(0, 0, 70, P.red, a - 4.0)}`) + pill("NO ADVICE", a - 4.3, 1530, 470, P.cream, P.red, 60) : "";
  const g = night(c, tot, 55) + town(c, 57) + ground(c) + layer(pie + cart + stamp, c);
  return { g, in: [CX, CY], inC: P.wood, inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const c6s7Set = makeSet(SHOTS, V, P);
