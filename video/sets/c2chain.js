// Crypto part 2, "chain": eight shots with nothing to read but a few numbers and two labels.
//   0 a clock sweeps ten minutes; slips fly from the four houses into one page, which thickens into a block; ≈ 3,000
//   1 a stamp comes down and seals the page with its fingerprint
//   2 the next page slides in; the first page's fingerprint prints at its top; a gold link snaps between them
//   3 pull back: a row of linked pages runs off into the dark; BLOCK drops on a page, CHAIN on a link
//   4 fly along the chain while a counter rolls to 900,000+, to the first gold page and the empty hooded chair, and back
//     to the newest page with its clock (host right)
//   5 an old page: 30 becomes 3000 in red; its seal turns red, then the link, the next seal, and so on down the chain
//   6 the laptops under the chain cross it out, and the broken part drops away
//   7 an eraser cannot rub a row out; an undo key is crossed out; a counter window with its shutter down, the bell rings
//     and nobody comes; a note 3/5 is pinned on the page (host left)
// Shots 0–4 are one row of pages seen by one camera, 5–6 a second camera on the same row; 4 → 5 and 6 → 7 hand over
// through a cream page.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { V } from "./c2chain.v.js";
import { P, mix, fmt, house, stars, skyline } from "./bank.js";
import { laptop, hoodChair } from "./props.js";
import { page, link, slip, clock, whorlColour, WHO } from "./c2props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const night = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 120, -8000, 3400, 1080, tot), c, 0.15);
const PY = 470, DX = 640, PK = 1.5, G = 1060, GEN = -14;
const px = (i) => 960 + DX * i;
const SEED = (i) => 24 + i;
const ROWS = (i) => [0, 1, 2, 3].map((r) => { const k = ["blue", "pink", "teal", "violet"]; return [k[Math.floor(rnd(i * 9 + r) * 4)], k[Math.floor(rnd(i * 9 + r + 50) * 4)], String(1 + Math.floor(rnd(i * 9 + r + 90) * 60))]; });
const tag = (label, k = 1) => at(0, 0, `<path d="M0 -70v40" stroke="${P.steel}" stroke-width="8"/>${disc(0, -74, 14, P.red, P.redD)}${two(rr(-label.length * 34 - 30, -34, label.length * 68 + 60, 104, 14), P.cream, P.creamD, 0, 8)}${text(0, 50, label, 96, P.ink)}`, k);
const ground = `<rect x="-9000" y="${G}" width="13000" height="2400" fill="#1b2054"/>`;

// the row of pages up to `t` (seconds since shot 0 began)
function row(t, c, tot, s) {
  const E = s.ends || [], T1 = E[0] || 6.68, T2 = T1 + (E[1] || 1.7), T3 = T2 + (E[2] || 4.24), T4 = T3 + (E[3] || 4.02);
  const u1 = t - T1, u2 = t - T2, u3 = t - T3, u4 = t - T4;
  let g = "";
  // the houses and their slips (shot 0)
  const HS = [[180, "blue"], [520, "teal"], [1400, "violet"], [1740, "pink"]];
  const arrive = (k) => 1.4 + k * 0.35 + 0.55;
  if (u2 < 1) g += HS.map(([x, who], k) => at(x, G, house(WHO[who][0], WHO[who][1], { lit: [1, 1, 1] }), 0.9 * pop(t - 0.2 - k * 0.1))).join("");
  HS.forEach(([x, who], k) => { const t0 = 1.4 + k * 0.35, p = seg(t, t0, t0 + 0.55); if (p <= 0 || p >= 1) return; const to = [px(0) - 40, PY - 74 * PK + k * 38 * PK], b = bez([x, G - 230], [lerp(x, to[0], 0.5), 120], to, ease(p));
    g += at(b[0], b[1], slip(who, ["pink", "violet", "blue", "teal"][k], String(5 + k * 8)), lerp(1.3, 0.7, p), 10 * Math.sin(p * 6)); });
  // the clock: ten minutes, then away
  const ck = t < T2 ? pop(t - 0.05) * (1 - ease(seg(t, 3.3, 3.7))) : 0;
  if (ck > 0.01) g += at(300, 260, rings(0, 0, 160, P.gold, 0.14) + clock(kf(t, [[0.1, 0], [1.0, 10]]), 130), ck);
  // older pages and links (from shot 3 on)
  const lo = u3 > 0 ? GEN : 0, hi = u2 > 0.2 ? 1 : 0;
  const pageOn = (i) => (i === 0 ? pop(t - 1.1) : i === 1 ? 1 : pop(u3 - 0.25 + i * 0.07));
  for (let i = lo; i <= hi; i++) { const x = px(i); if ((x - c.x) * c.z > 1400 || (x - c.x) * c.z < -1400) continue;
    if (i < hi) { const lp = i === 0 ? seg(u2, 2.8, 3.3) : i < 0 ? seg(u3, 0.3 - i * 0.07, 0.6 - i * 0.07) : 0; g += link(x + 130 * PK, PY, px(i + 1) - 130 * PK, PY, P.gold, lp, 0.75); } }
  for (let i = lo; i <= hi; i++) { const x0 = px(i); if ((x0 - c.x) * c.z > 1500 || (x0 - c.x) * c.z < -1500) continue;
    let x = x0, k = PK * pageOn(i), o = {};
    if (i === GEN) { o = { rows: [["gold", "gold", "50"]], seal: SEED(i), block: 1, paper: "#ffe08a", paperD: P.goldD }; }
    else if (i < 0) o = { rows: ROWS(i), seal: SEED(i), prev: SEED(i - 1), block: 1 };
    else if (i === 0) { const n = HS.filter((_, kk) => t > arrive(kk)).length; o = { rows: ROWS(0).slice(0, n), block: ease(seg(t, 3.85, 4.3)), seal: u1 > 0.42 ? SEED(0) : null, sealP: seg(u1, 0.42, 0.62), prev: u3 > 0 ? SEED(-1) : null }; }
    else { x = lerp(3000, x0, ease(seg(u2, 0.15, 0.95))); o = { rows: ROWS(1).slice(0, u3 > 0 ? 4 : 1), prev: u2 > 1.45 ? SEED(0) : null, prevP: seg(u2, 1.45, 1.75), block: u3 > 0 ? 1 : 0, seal: u3 > 0 ? SEED(1) : null }; }
    if (k <= 0.01) continue;
    g += at(x, PY + (i === 0 && t < T2 ? 0 : 4 * Math.sin(tot * 1.5 + i)), (i === 0 && t > 3.85 && t < 4.6 ? rings(0, 0, 260, P.gold, 0.2 * (1 - seg(t, 4.2, 4.6))) : "") + page(o) + (i === GEN ? text(0, 40, "0", 200, P.goldD) : ""), k); }
  // the print of the first page's fingerprint travelling to the second page
  if (u2 > 1.1 && u2 < 1.8) { const p = seg(u2, 1.1, 1.5); for (let q = 0; q < 6; q++) { const pp = clamp(p - q * 0.05); if (pp <= 0) continue; const b = bez([px(0) + 72 * PK, PY + 118 * PK], [lerp(px(0), px(1), 0.5), PY - 300], [px(1) - 78 * PK, PY - 124 * PK], pp); g += `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="${12 - q * 1.5}" fill="${whorlColour(SEED(0))}" opacity="${(0.9 - q * 0.12) * (1 - seg(u2, 1.5, 1.8))}"/>`; } }
  // ≈ 3,000 on the block
  if (t > 5.85 && u2 < 0.3) g += at(px(0) + 340, PY - 210, `${two(rr(-150, -50, 300, 100, 50), P.gold, P.goldD, 0, 8)}${text(0, 24, "≈ 3,000", 66, P.ink)}`, pop(t - 5.85) * (1 - seg(u2, 0, 0.3)));
  // the stamp (shot 1)
  if (u1 > 0 && u1 < 1.2) { const down = kf(u1, [[0, 0], [0.42, 1], [0.65, 1], [1.0, 0]]), sx = px(0) + 72 * PK, sy = PY + 118 * PK - 60 - 260 * (1 - down);
    g += at(sx, sy, `${two(rr(-60, -50, 120, 50, 10), P.violet, P.violetD, 0, 8)}<path d="${rr(-18, -200, 36, 150, 10)}" fill="${P.wood}"/>${disc(0, -220, 44, P.wood, P.woodD)}`, 1.5 * (1 + 0.06 * (u1 > 0.42 && u1 < 0.55 ? 1 : 0)), 0); }
  // the labels (shot 3)
  if (u3 > 1.05 && u4 < 0.6) g += at(px(0), PY - 300 * PK - 90 + 120 * (1 - easeOut(seg(u3, 1.05, 1.35))), tag("BLOCK", 2.1), 1 - seg(u4, 0.2, 0.6));
  if (u3 > 1.75 && u4 < 0.6) g += at((px(0) + px(1)) / 2, PY + 110 + 120 * (1 - easeOut(seg(u3, 1.75, 2.05))), tag("CHAIN", 1.9), 1 - seg(u4, 0.2, 0.6));
  // the first page: the empty hooded chair beside it, and the newest page's clock (shot 4)
  if (u4 > 0) g += at(px(GEN) - 640, G, hoodChair(), 1.8) + at(px(GEN), PY - 360, rings(0, 0, 200, P.gold, 0.12), 1);
  if (u4 > 4.9) g += at(px(1), PY - 420, clock(kf(u4, [[4.9, 0], [6.0, 10]]), 120), pop(u4 - 4.9));
  return g;
}
// the counter: how many pages, in screen space, top centre
const counter = (u4) => { if (u4 < 1.3) return ""; const v = Math.round(lerp(0, 900000, ease(seg(u4, 1.4, 2.25)))), s_ = fmt(v) + (u4 > 2.25 ? "+" : "");
  return at(FW / 2, 120, `${two(rr(-300, -66, 600, 132, 30), P.ink, "#0c0626", 0, 8)}${text(0, 34, s_, 100, P.gold)}`, pop(u4 - 1.3)); };

function s0(a, tot, s) { const c = camAt(a, [[0, 960, 540, 0.95], [2.9, 960, 520, 0.98], [4.3, px(0) + 100, 480, 1.12], [6.68, px(0) + 120, 480, 1.14]]);
  return { g: night(c, tot, 41) + layer(skyline(57, -2000, 3000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + row(a, c, tot, s), c) }; }
function s1(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, px(0) + 120, 480, 1.14], [1.7, px(0) + 120, 520, 1.22]]);
  return { g: night(c, tot, 41) + layer(skyline(57, -2000, 3000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + row((E[0] || 6.68) + a, c, tot, s), c) }; }
function s2(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, px(0) + 120, 520, 1.22], [0.9, 1280, 520, 0.95], [4.24, 1290, 520, 0.97]]);
  return { g: night(c, tot, 41) + layer(skyline(57, -2000, 3000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + row((E[0] || 6.68) + (E[1] || 1.7) + a, c, tot, s), c) }; }
function s3(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, 1290, 520, 0.97], [0.9, 300, 560, 0.45], [4.02, 220, 560, 0.44]]);
  return { g: night(c, tot, 41) + layer(skyline(57, -10500, 3600, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + row((E[0] || 6.68) + (E[1] || 1.7) + (E[2] || 4.24) + a, c, tot, s), c) }; }
function s4(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, 220, 560, 0.44], [0.5, 0, 560, 0.5], [2.9, px(GEN) - 260, 600, 0.6], [3.95, px(GEN) - 220, 600, 0.62], [5.0, px(1) - 300, 520, 0.6], [6.02, px(1) - 340, 520, 0.6]]);
  const t = (E[0] || 6.68) + (E[1] || 1.7) + (E[2] || 4.24) + (E[3] || 4.02) + a;
  return { g: night(c, tot, 41) + layer(skyline(57, -10500, 3600, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + row(t, c, tot, s), c) + counter(a), out: toScreen(c, px(1), PY), outC: P.cream, outZ: 22 }; }

// ---- 5–6: one changed number breaks every page after it; the network crosses it out ----
const T0 = -4;
function tamper(t, c, tot, s, u6) {
  let g = "";
  const redAt = (i) => (i === T0 ? 2.85 : 2.85 + (i - T0) * 0.95 - 0.0), linkRed = (i) => redAt(i) + 0.45;
  const fall = u6 > 2.0 ? easeIn(seg(u6, 2.0, 2.71)) : 0;
  for (let i = -7; i <= 1; i++) { if (i >= 1) continue; const lr = seg(t, linkRed(i), linkRed(i) + 0.3), broken = i >= T0 && i < 0;
    const col = i >= T0 && i < 0 ? mix(P.gold, P.red, lr) : P.gold, dy = broken ? 900 * fall : i === T0 - 1 ? 0 : 0;
    if (i === T0 - 1 && fall > 0) continue;
    g += at(0, (i >= T0 && i < 0) ? dy : 0, link(px(i) + 130 * PK, PY, px(i + 1) - 130 * PK, PY, col, 1, 0.75) + (lr > 0.5 && i >= T0 && i < 0 ? drawn(`M${(px(i) + px(i + 1)) / 2 - 20} ${PY - 50}l30 30l-24 20l30 40`, seg(lr, 0.5, 1), "#fff", 7) : "")); }
  for (let i = -7; i <= 1; i++) { const red = i >= T0 && i < 0 ? seg(t, redAt(i), redAt(i) + 0.25) : 0, rows = ROWS(i).slice(), dy = i >= T0 && i < 0 ? 900 * fall : 0;
    if (i === T0) { const w = seg(t, 1.3, 1.9); rows[0] = [rows[0][0], rows[0][1], w < 0.5 ? "30" : "3000", w < 0.5 ? P.ink : P.red]; }
    const sh = red > 0 && red < 1 ? 6 * Math.sin(t * 60) : 0;
    g += at(px(i) + sh, PY + dy + 4 * Math.sin(tot * 1.5 + i), (red > 0 ? rings(72, 118, 70, P.red, 0.3 * red) : "") + page({ rows, seal: SEED(i), sealC: red > 0.5 ? P.red : undefined, prev: SEED(i - 1), prevC: i > T0 && i <= 0 ? undefined : undefined, block: 1 }) + (i === T0 && t > 1.3 ? rings(70, -62, 80, P.red, 0.25 * (1 - seg(t, 1.9, 2.6))) : ""), PK, (i >= T0 && i < 0 ? fall * (i % 2 ? 20 : -16) : 0)); }
  // the laptops: each crosses it out
  if (u6 > 0) { const LX = [-1800, -1200, -600, 0, 600]; LX.forEach((x, k) => { const t0 = 0.85 + k * 0.22;
    g += at(x, G, rings(0, -110, 130, u6 > t0 ? P.red : "#9fe7ff", 0.18) + laptop(u6 > t0 ? "#ffd6d9" : "#9fe7ff", `<path d="M-90 -150h120M-90 -110h160M-90 -70h90" stroke="${u6 > t0 ? P.red : "#3fa9ff"}" stroke-width="16" stroke-linecap="round"/>`), 1.15 * pop(u6 + 0.3 - k * 0.05)) + (u6 > t0 ? cross(x, G - 420, 70, P.red, u6 - t0) : ""); }); }
  return g;
}
function s5(a, tot, s) { const c = camAt(a, [[0, px(T0) + 100, 470, 1.3], [1.0, px(T0) + 110, 400, 1.6], [2.4, px(T0) + 150, 430, 1.45], [3.6, -640, 520, 0.8], [5.77, -620, 530, 0.78]]);
  return { g: night(c, tot, 43) + layer(skyline(71, -4000, 3000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + tamper(a, c, tot, s, -1), c), in: toScreen(c, px(T0), PY), inC: P.cream, inZ: 22 }; }
function s6(a, tot, s) { const E = s.ends || [], c = camAt(a, [[0, -620, 530, 0.78], [0.8, -640, 640, 0.66], [2.71, -620, 650, 0.66]]);
  return { g: night(c, tot, 43) + layer(skyline(71, -4000, 3000, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + tamper((E[5] || 5.77) + a, c, tot, s, a), c), out: toScreen(c, px(-5), PY), outC: P.cream, outZ: 22 }; }

// ---- 7: what is written stays written ----
function s7(a, tot) {
  const BX = 980, BY = 540, K = 2.0;
  const c = camAt(a, [[0, 1080, 540, 1.0], [2.3, 1090, 540, 1.02], [3.3, 1140, 545, 1.0], [5.96, 1150, 545, 1.02]]);
  const rows = [["blue", "pink", "30"], ["teal", "violet", "5"], ["pink", "teal", "12"], ["violet", "blue", "8"]];
  const pg = at(BX, BY, rings(0, 0, 330, P.cream, 0.06) + page({ rows, seal: 24, prev: 23, block: 1 }), K);
  // the eraser: in at 0.6, rubs 0.9–2.2 over the first row's amount, leaves crumbs; the row shines on
  const ex = a < 0.6 ? 1700 : a < 0.9 ? lerp(1700, BX + 70 * K, ease(seg(a, 0.6, 0.9))) : a < 2.2 ? BX + 70 * K + 70 * Math.sin((a - 0.9) * 18) : lerp(BX + 70 * K, 1760, ease(seg(a, 2.2, 2.6)));
  const ey = BY - 74 * K - 30;
  const eraser = a > 0.4 && a < 2.7 ? at(ex, ey, `${two(rr(-60, -110, 120, 110, 16), "#ff8fb8", P.pinkD, 0, 8)}${two(rr(-60, -210, 120, 110, 10), P.blue, P.blueD, 0, 8)}`, 1.5, -14) : "";
  const crumbs = a > 1.0 ? Array.from({ length: 10 }, (_, i) => { const t0 = 1.0 + i * 0.12, q = a - t0; if (q < 0 || q > 1.6) return ""; return `<circle cx="${(BX + 70 * K - 50 + rnd(i) * 100).toFixed(1)}" cy="${(ey + 20 + 300 * q * q).toFixed(1)}" r="9" fill="#ff8fb8" opacity="${(1 - q / 1.6).toFixed(2)}"/>`; }).join("") : "";
  const shine = a > 2.1 && a < 2.8 ? `<path d="${rr(BX - 140 * K, BY - 94 * K, 280 * K, 40 * K, 12)}" fill="${P.gold}" opacity="${(0.35 * (1 - seg(a, 2.3, 2.8))).toFixed(2)}"/>` : "";
  // the undo key, pressed and crossed out
  const press_ = a > 2.25 && a < 2.45 ? 12 : 0;
  const undo = at(1620, 260, `<path d="${rr(-90, -76, 180, 170, 22)}" fill="#141038"/>${two(rr(-80, -80 + press_, 160, 150, 20), "#eef0ff", "#c3c8e6", 0, 10)}<path d="M28 ${-6 + press_}A44 44 0 1 0 -26 ${36 + press_}" fill="none" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/><path d="M-50 ${18 + press_}L-24 ${44 + press_}L-6 ${14 + press_}" fill="none" stroke="${P.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`, 1.4 * pop(a - 2.0)) + (a > 2.45 ? cross(1745, 150, 56, P.red, a - 2.45) : "");
  // the counter window: shutter down, a bell that rings, nobody comes
  const ring_ = a > 3.35 && a < 4.1 ? Math.sin((a - 3.35) * 40) * 18 * (1 - seg(a, 3.35, 4.1)) : 0;
  const win = at(1620, 920, `${two(rr(-200, -330, 400, 330, 14), "#5a6aa8", "#44529a", 0, 10)}<path d="${rr(-150, -290, 300, 200, 8)}" fill="${P.steel}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M-150 ${-290 + 22 * (i + 1)}h300" stroke="${P.steelD}" stroke-width="5"/>`).join("")}<path d="${rr(-230, -90, 460, 40, 8)}" fill="${P.wood}"/>
    <g transform="translate(70 -90) rotate(${ring_.toFixed(1)} 0 -50)"><path d="M-46 0Q-46 -60 0 -62Q46 -60 46 0Z" fill="${P.gold}"/><circle cy="-66" r="9" fill="${P.goldD}"/></g>${a > 3.35 && a < 4.2 ? [1, 2].map((k) => `<path d="M${70 + 60 * k} -150q20 30 0 60M${70 - 60 * k} -150q-20 30 0 60" stroke="${P.gold}" stroke-width="7" fill="none" opacity="${(1 - seg(a, 3.6, 4.2)).toFixed(2)}"/>`).join("") : ""}`, 1.25 * pop(a - 3.0));
  // a note 3/5 pinned to the page
  const note = a > 4.45 ? at(BX + 120 * K, BY - 150 * K, `${two(rr(-90, -60, 180, 140, 8), "#ffe66d", "#e8c84a", 0, 6)}${text(0, 46, "3/5", 76, P.ink)}${disc(0, -54, 14, P.red, P.redD)}`, pop(a - 4.45), 8) : "";
  const g = night(c, tot, 47) + layer(skyline(23, -600, 2600, G - 30, 120, 300, "#221a5c", "#ffb066"), c, 0.45) + layer(ground + pg + shine + crumbs + eraser + undo + win + note, c);
  return { g, in: toScreen(c, BX, BY), inC: P.cream, inZ: 18 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const c2chainSet = makeSet(SHOTS, V, P);
