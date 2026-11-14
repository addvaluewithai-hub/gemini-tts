// "Charge" of electricity part 1: eleven shots, nothing to read but a year, a name and the signs + and −.
//   0 dusk over Greek columns on a hill; a calendar page drops: 600 BC (about 2,600 years ago)
//   1 a piece of fur rubs a golden amber stone by itself; feathers and straw lift and stick to the stone
//   2 the stone big; ELEKTRON rises out of its glow (Greek for amber)
//   3 ELEKTRON stretches into ELECTRICITY and a bulb lights where the stone was (the word electricity)
//   4 pull back: the lit night town hangs on a thread from the tiny glowing stone (named after a stone)
//   5 calendar pages fly off, 600 BC to 1600, the fur rubbing all the time and a "?" over it. Host right.
//   6 push into the stone until it is rows of atoms (everything is made of atoms)
//   7 one atom: electrons come onto their rings; on "charge" each shows its minus (electrons, negative)
//   8 the heart of the atom glows and shows its plus (the heart is positive)
//   9 a plus ball and a minus ball snap together; two minus balls push apart. Host left.
//  10 fur and stone again: blue dots hop from the fur to the stone; the stone pulls a feather. Host right.
// Shots 2–3 and 7–8 are one camera each (no hand-over between them); every other hand-over goes through the amber or the heart.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, house, stars, skyline, pop, electron, nucleus, minus, plus, bulb } from "./elec.js";
import { calPage, calFlip, pedestal, hills } from "./props.js";

// ---- props of this scene ----
// the amber stone (centre), about 300 wide at k = 1; glow 0..1; `inner` is drawn clipped inside it
const STONE = "M-150 10Q-170 -80 -90 -130Q-10 -170 80 -140Q160 -110 155 -10Q150 80 70 120Q-30 160 -110 110Q-150 70 -150 10Z";
const stone = (glow = 0, inner = "") => `${glow > 0 ? rings(0, 0, 210, E.amber, 0.22 * glow, 1.45) : ""}${two(STONE, E.amber, E.amberD, -14, -12)}<clipPath id="amb"><path d="${STONE}"/></clipPath><g clip-path="url(#amb)">${inner}</g>
  <path d="M-90 -80Q-40 -120 20 -112" fill="none" stroke="#fff3c0" stroke-width="18" stroke-linecap="round" opacity=".7"/><circle cx="60" cy="40" r="12" fill="#ffe08a" opacity=".8"/><circle cx="85" cy="20" r="6" fill="#ffe08a" opacity=".8"/>`;
// a piece of fur (centre), 360 x 200: a soft brown pelt with a tufted edge
const FUR = (() => { let d = "M-180 0"; for (let i = 0; i <= 18; i++) { const a = Math.PI + (i / 18) * Math.PI, r = i % 2 ? 108 : 124; d += `L${(Math.cos(a) * 190 * (r / 120)).toFixed(1)} ${(Math.sin(a) * 100 * (r / 120)).toFixed(1)}`; }
  for (let i = 0; i <= 18; i++) { const a = (i / 18) * Math.PI, r = i % 2 ? 108 : 124; d += `L${(Math.cos(a) * 190 * (r / 120)).toFixed(1)} ${(Math.sin(a) * 100 * (r / 120)).toFixed(1)}`; } return d + "Z"; })();
const fur = (t = 0) => `${two(FUR, "#b97a4a", "#8e5a33", 0, 12)}${[-110, -50, 10, 70, 130].map((x, i) => `<path d="M${x} ${-40 + 10 * Math.sin(i)}q14 26 0 52" fill="none" stroke="#8e5a33" stroke-width="10" stroke-linecap="round"/>`).join("")}`;
// a feather (centre), 200 long, lying along x
const feather = () => `<path d="M-100 0Q0 -70 100 0Q0 50 -100 0Z" fill="#f4f7ff"/><path d="M-100 0Q0 -30 100 0" fill="none" stroke="#c9d6e8" stroke-width="7"/><path d="M-130 4L-96 0" stroke="#c9d6e8" stroke-width="7" stroke-linecap="round"/>`;
const straw = () => `<path d="M-90 0L90 -10" stroke="#ffd98a" stroke-width="12" stroke-linecap="round"/><path d="M-40 -3L-70 -26M20 -6L0 -30" stroke="#ffd98a" stroke-width="8" stroke-linecap="round"/>`;
// a temple: columns and a pediment, base on y = 0, 700 wide
const temple = (c = "#ffe9c7", cD = "#e3b987") => `${two(rr(-360, -40, 720, 40, 6), c, cD, 0, 8)}${[-280, -170, -60, 60, 170, 280].map((x) => two(rr(x - 26, -380, 52, 340, 4), c, cD, 12, 0)).join("")}<path d="${rr(-350, -420, 700, 44, 6)}" fill="${c}"/>${two("M-370 -420L0 -540L370 -420Z", c, cD, 0, 10)}`;
// dusk behind the hill (the file's dusk: amber sun on teal)
const sky = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bsky)"/>` + layer(rings(1450, 300, 240 * (1 + 0.02 * Math.sin(tot * 1.3)), "#ffd27a", 0.2, 1.45) + `<circle cx="1450" cy="300" r="160" fill="#ffd98a"/>` + stars(5, 30, -400, 2400, 220, tot), c, 0.15);
const hill = (c, tot) => layer(hills(3, -800, 2800, 760, 70, "#0f4a5c"), c, 0.5) + layer(`<path d="M-900 1500V820Q300 640 960 680Q1700 640 2900 820V1500Z" fill="#0b3a4c"/>`, c, 0.8);
// fur rubbing the stone: dx of the fur at time t (r: how hard, 0 = still)
const rub = (t, r = 1) => r * 110 * Math.sin(t * 9);
// the scene of shots 1, 5 and 10: a stone slab on the hill, the stone on it, the fur over it
function slab(c, tot, o = {}) {
  const SX = o.sx ?? 900, SY = 640, fx = o.fx ?? SX + rub(tot, o.rub ?? 0), fy = o.fy ?? SY - 170;
  const table = at(SX, SY + 150, `${two(rr(-330, 0, 660, 60, 10), "#8fa7b0", "#6c8690", 0, 10)}${two(rr(-260, 60, 90, 220, 6), "#8fa7b0", "#6c8690", 10, 0)}${two(rr(170, 60, 90, 220, 6), "#8fa7b0", "#6c8690", 10, 0)}`);
  return sky(c, tot) + hill(c, tot) + layer(at(1500, 700, temple(), 0.75), c, 0.6) + layer(table + at(SX, SY + 40, stone(o.glow || 0, o.inner || ""), o.k || 1) + (o.extra || "") + at(fx, fy, fur(tot), 1.0, 6 * Math.sin(tot * 9) * (o.rub ?? 0)), c);
}

// ---- 0: 600 BC ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1], [2.48, 1040, 470, 1.12]]);
  const drop = a > 1.15 ? at(470, lerp(-200, 360, easeOut(seg(a, 1.15, 1.5))), calPage("600 BC", "", 1.3, 150), [1, 1 - 0.08 * Math.exp(-(a - 1.5) * 9) * Math.cos((a - 1.5) * 18) * (a > 1.5 ? 1 : 0)], 4 * Math.sin(tot)) : "";
  const g = sky(c, tot) + hill(c, tot) + layer(at(1080, 900, temple(), 1.1), c, 0.85) + layer(drop, c);
  return { g, out: toScreen(c, 1450, 300), outC: E.amber, outZ: 14 };
}
// ---- 1: rubbed amber pulls feathers and straw ----
const BITS = [[-560, 300, 0, 1], [-380, 330, 1, 2], [-200, 315, 0, 3], [240, 320, 1, 4], [420, 300, 0, 5], [560, 330, 1, 6]];   // [dx from the stone, ground y below it, feather?, seed]
function bits(t, t0, SX, SY) { return BITS.map(([dx, dy, f, sd], i) => { const p = easeOut(seg(t, t0 + i * 0.07, t0 + 0.55 + i * 0.07)), tx = SX + (dx > 0 ? 90 : -90) + 20 * Math.sin(sd), ty = SY + 30 + (i % 3 - 1) * 60;
  const [x, y] = bez([SX + dx * 0.55, SY + 100 + (i % 2) * 14], [SX + dx * 0.4, SY - 220], [tx, ty], p); return at(x, y, f ? feather() : straw(), 0.7, lerp(sd * 20, (dx > 0 ? 70 : -70), p)); }).join(""); }
function s1(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.15], [4.42, 900, 540, 1.3]]), r = seg(a, 0.8, 1.0) * (1 - seg(a, 2.6, 2.8));
  const glow = seg(a, 2.6, 3.3);
  return { g: slab(c, tot, { rub: r, fy: lerp(330, 470, seg(a, 0.6, 0.9)) - 150 * seg(a, 2.6, 3.0), glow, extra: bits(a, 3.25, 900, 680) }), in: toScreen(c, 900, 680), inC: E.amber, out: toScreen(c, 900, 680), outC: E.amber, outZ: 14 };
}
// ---- 2–3: ELEKTRON → ELECTRICITY, the stone gives way to a bulb ----
const T3 = (s) => (s.ends || [])[2] || 2.03;
function word(t, s) {
  const u = t - T3(s), morph = ease(seg(u, 1.0, 1.4)), rise = easeOut(seg(t, 1.25, 1.65));
  const w1 = t > 1.25 && morph < 1 ? at(960, lerp(470, 330, rise), text(0, 0, "ELEKTRON", 190, P.gold), [lerp(1, 1.5, morph) * pop(t - 1.25), pop(t - 1.25)], 0, `opacity="${(1 - morph).toFixed(3)}"`) : "";
  const w2 = morph > 0 ? at(960, 330, text(0, 0, "ELECTRICITY", 170, "#fff3c0"), [lerp(0.6, 1, morph), 1], 0, `opacity="${morph.toFixed(3)}"`) : "";
  const sk = 1 - ease(seg(u, 0.9, 1.3)), bk = u > 1.0 ? pop(u - 1.0) : 0, on = u > 1.17 ? clamp(spring(u - 1.17, 7, 14)) : 0;
  return { g: (sk > 0.01 ? at(960, 720, stone(0.6 + 0.4 * Math.sin(t * 3) * 0.3 + 0.4 * seg(t, 1.0, 1.4)), 1.5 * sk) : "") + (bk > 0 ? at(960, 990, bulb(on), 1.55 * bk) : "") + w1 + w2, on };
}
function s2(a, tot, s) { const c = camAt(a, [[0, 960, 600, 1.15], [2.03, 960, 560, 1.0]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 70, -200, 2100, 1100, tot), c, 0.2) + layer(word(a, s).g, c), in: toScreen(c, 960, 720), inC: E.amber }; }
function s3(a, tot, s) { const c = camAt(a, [[0, 960, 560, 1.0], [1.93, 960, 545, 0.97]]), T = T3(s);
  return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 70, -200, 2100, 1100, tot), c, 0.2) + layer(word(T + a, s).g, c), out: toScreen(c, 960, 750), outC: "#fff3b0", outZ: 12 }; }

// ---- 4: the whole lit world hangs from a stone ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 170, 4.5], [0.5, 960, 240, 2.6], [1.7, 960, 520, 1.12], [2.84, 960, 520, 1.16]]), sway = 3 * Math.sin(tot * 1.4);
  const island = `${two("M-560 0Q-520 -30 -400 -34H400Q520 -30 560 0Q480 160 0 230Q-480 160 -560 0Z", "#0f4a5c", "#0a3446", 0, 14)}`
    + `<clipPath id="isl"><rect x="-600" y="-600" width="1200" height="570"/></clipPath><g clip-path="url(#isl)">${skyline(17, -520, 520, -30, 70, 240, E.far, E.farLit)}</g>` + at(-260, -30, house(E.houseA, E.houseAD, { roof: E.roof }), 0.8) + at(240, -30, house(E.houseB, E.houseBD, { roof: E.roof }), 0.8)
    + [-420, 0, 420].map((x) => `<circle cx="${x}" cy="-250" r="10" fill="#fff3c0"/>`).join("") + rings(0, -100, 420, "#ffd98a", 0.08, 1.2);
  const hang = `<g transform="rotate(${sway.toFixed(2)} 960 170)"><path d="M960 205V520" stroke="#ffe7a0" stroke-width="5"/><path d="M960 520L560 590M960 520L1360 590" stroke="#ffe7a0" stroke-width="4"/>${at(960, 640, island, 1.25)}</g>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(29, 90, -300, 2200, 1100, tot), c, 0.2) + layer(hang + at(960, 170, stone(1), 0.22), c);
  return { g, in: toScreen(c, 960, 170), inC: "#fff3b0", out: toScreen(c, 960, 170), outC: E.amber, outZ: 30 };
}
// ---- 5: two thousand years of rubbing and staring ----
const YEARS = ["600 BC", "300 BC", "1", "500", "1000", "1300", "1600"];
function s5(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.1], [3.93, 780, 560, 1.16]]), n = YEARS.length - 1, f = clamp(a / 3.2) * n, k = Math.min(n, Math.floor(f)), p = f - k;
  const cal = at(380, 340, (k < n ? calPage(YEARS[k + 1], "", 1, 150) : "") + (k < n ? at(0, 0, calFlip(YEARS[k], "", p, 150)) : calPage(YEARS[n], "", 1, 150)), 1.05);
  const q = a > 1.75 ? at(760, 260, `${rings(0, -60, 110, P.gold, 0.18, 1.4)}${text(0, 30, "?", 230, P.gold)}`, pop(a - 1.75), 6 * Math.sin(tot * 2)) : "";
  const g = slab(c, tot, { sx: 760, rub: 1, fy: 470 }) + layer(cal + q, c);
  return { g, in: toScreen(c, 760, 680), inC: E.amber, out: toScreen(c, 760, 680), outC: E.amber, outZ: 14 };
}
// ---- 6: inside the stone, atoms ----
const lattice = (sp = 18, r = 5, t = 0) => { let o = ""; for (let i = -9; i <= 9; i++) for (let j = -7; j <= 7; j++) { const x = i * sp + (j % 2 ? sp / 2 : 0), y = j * sp * 0.88;
  o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${E.plus}"/><circle cx="${(x + r * 1.6 * Math.cos(t * 3 + i + j)).toFixed(1)}" cy="${(y + r * 1.6 * Math.sin(t * 3 + i + j)).toFixed(1)}" r="${r * 0.42}" fill="${E.el}"/>`; } return o; };
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.3], [0.6, 960, 560, 2.0], [2.0, 960, 560, 9.5], [2.6, 960, 560, 10.5]]), show = seg(a, 0.7, 1.6);
  const inner = `<rect x="-200" y="-200" width="400" height="400" fill="${mix(E.amber, "#5a2a12", show)}"/><g opacity="${show.toFixed(3)}">${lattice(18, 5, tot)}</g>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 70, -200, 2100, 1100, tot), c, 0.2) + layer(at(960, 560, stone(1 - show, inner), 1.6), c);
  return { g, in: toScreen(c, 960, 560), inC: E.amber, out: toScreen(c, 960, 560), outC: E.plus, outZ: 16 };
}
// ---- 7–8: one atom: electrons and their minus, then the heart and its plus ----
const T8 = (s) => (s.ends || [])[7] || 5.89;
function theAtom(t, tot, s) {
  const R = 420, u = t - T8(s), heart = u > 0.85 ? spring(u - 0.85, 8, 14) : 0;
  const orb = [0, 1, 2].map((i) => `<ellipse rx="${R}" ry="${R * 0.38}" fill="none" stroke="${E.el}" stroke-width="7" opacity="${(0.35 * seg(t, 0.2, 0.8)).toFixed(2)}" transform="rotate(${i * 60 - 30})"/>`).join("");
  const els = [0, 1, 2].map((i) => { const a0 = tot * (1.3 + i * 0.12) + i * 2.1, rot = (i * 60 - 30) * Math.PI / 180, ex = R * Math.cos(a0), ey = R * 0.38 * Math.sin(a0), x = ex * Math.cos(rot) - ey * Math.sin(rot), y = ex * Math.sin(rot) + ey * Math.cos(rot);
    const in_ = pop(t - 1.17 - i * 0.25), sg = t > 4.41 + i * 0.12 ? spring(t - 4.41 - i * 0.12, 9, 16) : 0, flash = t > 5.39 && t < 6.2 ? 0.5 + 0.5 * Math.sin((t - 5.39) * 12) : 0;
    return in_ <= 0 ? "" : at(x, y, (sg > 0 ? rings(0, 0, 64 + 40 * (1 - clamp(sg)), E.el, 0.4 * clamp(sg), 1.5) : "") + disc(0, 0, 52, E.el, E.elD) + (sg > 0 ? at(0, 0, minus(52), Math.max(0.01, sg)) : "") + (flash > 0 ? rings(0, 0, 70, "#ffffff", 0.3 * flash, 1.3) : ""), in_); }).join("");
  const core = (heart > 0 ? rings(0, 0, 190 * heart, E.plus, 0.25, 1.5) : "") + disc(0, 0, 125, E.plus, E.plusD) + (heart > 0 ? at(0, 0, plus(112), Math.max(0.01, heart)) : "");
  return at(960, 540, orb + core + els);
}
function s7(a, tot, s) { const c = camAt(a, [[0, 960, 540, 1.2], [1.5, 960, 540, 1.0], [5.89, 960, 540, 1.0]]);
  return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(31, 90, -200, 2100, 1100, tot), c, 0.2) + layer(theAtom(a, tot, s), c), in: toScreen(c, 960, 540), inC: E.plus }; }
function s8(a, tot, s) { const c = camAt(a, [[0, 960, 540, 1.0], [1.71, 960, 540, 1.22]]);
  return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(31, 90, -200, 2100, 1100, tot), c, 0.2) + layer(theAtom(T8(s) + a, tot, s), c), out: toScreen(c, 960, 540), outC: E.plus, outZ: 14 }; }

// ---- 9: opposites pull, likes push ----
function s9(a, tot) {
  const c = camAt(a, [[0, 1000, 520, 1.05], [6.59, 1040, 520, 1.0]]);
  const snap = a > 1.28 ? easeIn(seg(a, 1.28, 1.55)) : 0, hit = a > 1.55 ? Math.exp(-(a - 1.55) * 6) : 0, wob = a > 1.55 ? 1 + 0.12 * Math.exp(-(a - 1.55) * 7) * Math.cos((a - 1.55) * 20) : 1;
  const ax = lerp(560, 880, snap), bx = lerp(1440, 1120, snap), yT = 300;
  const top = (a > 0.94 ? at(ax, yT, nucleus(120, { glow: 1 }), pop(a - 0.94) * [1, wob][snap >= 1 ? 1 : 0]) : "") + (a > 0.94 ? at(bx, yT, electron(120, { glow: 1 }), pop(a - 1.04)) : "") + (hit > 0.02 ? rings(1000, yT, 160 + 120 * (1 - hit), "#ffffff", 0.3 * hit, 1.2) : "");
  const pull = a > 0.94 && snap < 1 ? [-1, 1].map((d) => `<path d="M${1000 + d * 120} ${yT}h${-d * 60}" stroke="${P.cream}" stroke-width="14" stroke-linecap="round" opacity=".7"/><path d="M${1000 + d * 50} ${yT}l${d * 30} -28v56Z" fill="${P.cream}" opacity=".7"/>`).join("") : "";
  const push = a > 2.86 ? easeOut(seg(a, 2.86, 3.4)) : 0, b1 = lerp(880, 540, push), b2 = lerp(1120, 1460, push), yB = 790, shake = a > 2.07 && push === 0 ? 4 * Math.sin(tot * 40) : 0;
  const bot = (a > 2.07 ? at(b1 + shake, yB, electron(120, { glow: 1 }), pop(a - 2.07)) + at(b2 - shake, yB, electron(120, { glow: 1 }), pop(a - 2.17)) : "") + (push > 0 && push < 1 ? rings(1000, yB, 80 + 200 * push, "#9ff2ff", 0.3 * (1 - push), 1.2) : "");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(37, 90, -200, 2200, 1100, tot), c, 0.2) + layer(top + pull + bot, c);
  return { g, in: toScreen(c, 560, yT), inC: E.plus };
}
// ---- 10: electrons go from the fur to the stone; the stone pulls a feather ----
function s10(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.12], [5.78, 920, 560, 1.22]]), SX = 820, SY = 680, FX = 1180, FY = 470;
  const r = 1 - seg(a, 1.1, 1.3);
  const fx = FX + rub(tot, r) * 0.6 - 260 * r;
  let dots = ""; for (let i = 0; i < 7; i++) { const t0 = 1.9 + i * 0.13, p = easeOut(seg(a, t0, t0 + 0.4)), sx = fx - 90 + (i % 4) * 55, sy = FY - 20 + Math.floor(i / 4) * 45, tx = SX - 75 + (i % 4) * 48, ty = SY - 30 + Math.floor(i / 4) * 52;
    if (a < 1.34) continue; const [x, y] = bez([sx, sy], [(sx + tx) / 2, Math.min(sy, ty) - 200], [tx, ty], p); dots += at(x, y, electron(26), pop(a - 1.34 - i * 0.04)); }
  const extra = a > 3.62 ? rings(SX, SY + 40, 200 + 30 * Math.sin((a - 3.62) * 8), E.el, 0.25 * seg(a, 3.62, 3.9), 1.3) : "";
  const fp = easeOut(seg(a, 4.35, 4.95)), [qx, qy] = bez([SX - 520, SY + 180], [SX - 380, SY - 160], [SX - 150, SY - 20], fp);
  const fl = at(qx, qy, feather(), 0.8, lerp(-10, 40, fp)) + at(lerp(SX + 480, SX + 150, easeOut(seg(a, 4.5, 5.1))), lerp(SY + 200, SY + 60, easeOut(seg(a, 4.5, 5.1))), straw(), 0.8, -20);
  return { g: slab(c, tot, { sx: SX, fx, fy: FY, rub: 0, glow: seg(a, 3.62, 3.9) * 0.6, extra: extra + fl + dots }) };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
export const amberSet = makeSet(SHOTS, [], P);
