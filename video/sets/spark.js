// "Spark": static electricity and lightning, electricity part 1, fourteen shots with nothing to read but numbers, units, years and a name.
//   0 a glass jar full of charges that bounce about and find no way out
//   1 a pair of slippers shuffles over a carpet by itself; charges climb into them
//   2 an empty glove reaches for the door knob: the charge jumps, a spark
//   3 the spark, big, in the dark: 1,000s V
//   4 behind it only three little charges: the glove jerks once and that is all
//   5 the spark grows into a bolt over the night town
//   6 a cloud fills with charges and the charge jumps to the ground
//   7 the bolt: 300,000,000 V
//   8 the tag flips: 30,000 A
//   9 the planet at night, flashes popping all over it, a stopwatch at one second
//  10 the sun and the bolt, each with a thermometer: the bolt's climbs five times higher
//  11 rings of air burst out of the bolt: the thunder
//  12 1752: a kite with a key on its string in the storm, FRANKLIN
//  13 1753: a dim study, an iron rod through the window, the candle on the desk goes out (sombre and still)
// Shots 1–2, 3–4 and 6–8 are one place seen by one camera that carries on (no hand-over shape between them).
// Palette: the electricity file's own (elec.js): teal and navy night, amber windows, cyan bolts.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { P, E, house, stars, skyline, electron, cloud, bolt, boltPath, spark, nightTown, plate } from "./elec.js";
import { calPage, globe } from "./props.js";
import { V } from "./spark.v.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const fmt = (v) => Math.round(v).toLocaleString("en");
const ends = (s, k) => ((s && s.ends) || [])[k];
const T = (s, k, d) => ends(s, k) || d;
// colours of this set, all in the file's teal-navy night
const C = { wall: "#0e3a50", wallD: "#0a2c3e", floor: "#5a3524", floorD: "#432618", rug: "#c2413a", rugD: "#9a2f2a", rugB: "#ffcf6b", door: "#a86a3a", doorD: "#84502a",
  brass: "#ffc94a", brassD: "#d9962a", glass: "#bff3ff", stormT: "#071a28", stormB: "#1d4d5e", cloud: "#2d5566", cloudD: "#1f4250", sun: "#ffd98a", hand: "#e9f3f7", handD: "#b9cfd8" };

// ---- props of this set ----
// a slipper seen from the side, toe to the right, base on y = 0
const slipper = (c = "#2fa7c9", cD = "#1f7f9c") => `${two("M-90 0Q-100 -40 -60 -46H40Q100 -46 104 -14Q106 0 90 0Z", c, cD, 0, 8)}<path d="M-10 -44Q30 -74 80 -40" fill="none" stroke="${cD}" stroke-width="16" stroke-linecap="round"/><path d="${rr(-96, -8, 200, 10, 5)}" fill="#f2e6cf"/>`;
// an empty glove, fingers pointing right (index finger tip at (130, -10)), centre of the palm at (0, 0)
const glove = (c = C.hand, cD = C.handD) => `${two("M-110 -40Q-120 0 -110 40H-40Q-10 70 40 54Q70 44 66 26L40 22Q60 12 70 0H130Q146 -10 130 -20H50Q70 -30 74 -46Q60 -62 20 -56Q-20 -64 -40 -40Z", c, cD, 0, 9)}
  <path d="M-110 -40H-150V40H-110Z" fill="${cD}"/><path d="M-150 -40H-162V40H-150Z" fill="#2fa7c9"/>`;
// a door with a brass knob; the knob's centre is at (kx, ky) relative to the door's bottom-left corner (door 300 wide, 680 tall)
const door = () => `${two(rr(0, -680, 300, 680, 6), C.door, C.doorD, 10, 0)}<path d="${rr(40, -620, 220, 240, 8)}${rr(40, -330, 220, 260, 8)}" fill="none" stroke="${C.doorD}" stroke-width="10"/>
  <path d="${rr(-24, -704, 348, 24, 6)}" fill="${C.doorD}"/>`;
const knob = (r = 34) => `<path d="M0 -12h${r * 1.1}v24h${-r * 1.1}Z" fill="${C.brassD}"/>${disc(-r * 0.2, 0, r, C.brass, C.brassD)}<circle cx="${-r * 0.5}" cy="${-r * 0.35}" r="${r * 0.22}" fill="#fff3c2"/>`;
// a glass jar with a lid (base on y = 0), w wide, h tall
const glassJar = (w, h, inner = "") => `<path d="${rr(-w / 2, -h, w, h, w * 0.18)}" fill="${C.glass}" opacity=".12"/>${inner}<path d="${rr(-w / 2, -h, w, h, w * 0.18)}" fill="none" stroke="${C.glass}" stroke-width="12" opacity=".55"/>
  <path d="M${-w * 0.36} ${-h * 0.8}V${-h * 0.25}" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".22"/>${two(rr(-w * 0.42, -h - 46, w * 0.84, 56, 14), P.wood, P.woodD, 0, 8)}`;
// a thermometer (base bulb centre at (0, 0)), h tall; level 0..1 of the tube
const thermo = (h, level, c = P.red) => `${two(rr(-30, -h, 60, h, 30), "#e9f3f7", "#b9cfd8", 6, 0)}<path d="${rr(-14, -h + 22, 28, h - 22, 14)}" fill="#c6d6de"/>${level > 0 ? `<path d="${rr(-14, -(h - 22) * clamp(level) - 10, 28, (h - 22) * clamp(level) + 10, 14)}" fill="${c}"/>` : ""}${disc(0, 0, 50, c, P.redD)}
  ${[1, 2, 3, 4, 5, 6].map((i) => `<path d="M34 ${-i * (h - 40) / 6}h20" stroke="#e9f3f7" stroke-width="6" opacity=".7"/>`).join("")}`;
// a stopwatch (centre), r = 110; turn 0..1 of the hand
const stopwatch = (turn = 0) => { const a = turn * Math.PI * 2;
  return `<path d="${rr(-26, -160, 52, 40, 8)}" fill="${P.steelD}"/><path d="${rr(-40, -176, 80, 24, 10)}" fill="${P.steel}"/>${disc(0, 0, 130, P.steel, P.steelD, 0.08)}<circle r="108" fill="${P.cream}"/>
    ${Array.from({ length: 12 }, (_, i) => { const q = i / 12 * Math.PI * 2; return `<path d="M${88 * Math.sin(q)} ${-88 * Math.cos(q)}L${100 * Math.sin(q)} ${-100 * Math.cos(q)}" stroke="${P.ink}" stroke-width="${i % 3 ? 5 : 9}"/>`; }).join("")}
    ${turn > 0 ? `<path d="M0 0L0 -96A96 96 0 ${turn > 0.5 ? 1 : 0} 1 ${(96 * Math.sin(a)).toFixed(1)} ${(-96 * Math.cos(a)).toFixed(1)}Z" fill="${E.el}" opacity=".35"/>` : ""}
    <path d="M0 0L${(86 * Math.sin(a)).toFixed(1)} ${(-86 * Math.cos(a)).toFixed(1)}" stroke="${P.red}" stroke-width="10" stroke-linecap="round"/><circle r="13" fill="${P.ink}"/>`; };
// a crackling spark from a to b, zigzagging across the line between them (a fresh shape for every seed)
const zig = (a, b, seed, w = 24, o = 1) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, n = 8; let d = `M${a[0]} ${a[1]}`;
  for (let i = 1; i < n; i++) { const p = i / n, off = (rnd(seed * 31 + i) - 0.5) * 110; d += `L${(a[0] + dx * p + nx * off).toFixed(1)} ${(a[1] + dy * p + ny * off).toFixed(1)}`; } d += `L${b[0]} ${b[1]}`;
  return `<path d="${d}" fill="none" stroke="${E.el}" stroke-width="${w * 2}" stroke-linejoin="round" stroke-linecap="round" opacity="${0.45 * o}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w * 0.7}" stroke-linejoin="round" stroke-linecap="round" opacity="${o}"/>`; };
// a value tag with a fixed width (so it does not jump while the number rolls), centre
const vtag = (str, w, size = 110, fill = P.gold) => `${two(rr(-w / 2, -size * 0.8, w, size * 1.55, size * 0.4), P.ink, "#020c14", 0, 10)}${text(0, size * 0.37, str, size, fill)}`;
// a kite (centre), with its tail
const kite = (t) => `<path d="M0 120${[1, 2, 3, 4].map((i) => `Q${(i % 2 ? 30 : -30) + 8 * Math.sin(t * 4 + i)} ${120 + i * 50 - 25} 0 ${120 + i * 50}`).join("")}" fill="none" stroke="${P.cream}" stroke-width="5"/>
  ${[1, 2, 3, 4].map((i) => `<path d="M-14 ${120 + i * 50}l14 -10l14 10l-14 10Z" fill="${i % 2 ? P.red : P.gold}"/>`).join("")}
  ${two("M0 -140L100 0L0 120L-100 0Z", P.red, P.redD, 10, 0)}<path d="M0 -140V120M-100 0H100" stroke="${P.cream}" stroke-width="6" opacity=".6"/>`;
// an old key hanging from its ring at (0, 0)
const key = () => `<circle cx="0" cy="22" r="24" fill="none" stroke="${C.brass}" stroke-width="12"/><path d="M0 46V170M0 140h30M0 164h22" stroke="${C.brass}" stroke-width="14" stroke-linecap="round"/>`;
// a candle on its holder, base on y = 0; flame 0..1 (0 = out), t flickers it
const candle = (t, flame = 1) => `${two(rr(-40, -20, 80, 20, 8), C.brass, C.brassD, 0, 6)}${two(rr(-22, -170, 44, 152, 8), "#f6ecd8", "#d9c9a6", 6, 0)}<path d="M0 -170v-16" stroke="${P.ink}" stroke-width="5"/>
  ${flame > 0 ? `${rings(0, -214, 90 * flame, "#ffd98a", 0.16 * flame, 1.6)}<g transform="translate(0 -186) scale(${(flame * (1 + 0.06 * Math.sin(t * 13))).toFixed(3)} ${(flame * (1 + 0.1 * Math.sin(t * 9))).toFixed(3)})"><path d="M0 0Q-22 -24 0 -66Q22 -24 0 0Z" fill="#ffb84a"/><path d="M0 -4Q-10 -20 0 -40Q10 -20 0 -4Z" fill="#fff3c2"/></g>` : ""}`;
// rain over a region, falling with time
const rain = (t, x0, x1, y0, y1, n = 70, o = 0.35) => Array.from({ length: n }, (_, i) => { const x = lerp(x0, x1, rnd(i * 5 + 3)), q = ((t * 1.6 + rnd(i * 5 + 4)) % 1), y = lerp(y0, y1, q);
  return `<path d="M${(x - 10 * q).toFixed(1)} ${y.toFixed(1)}l-14 46" stroke="#bfe8f5" stroke-width="4" stroke-linecap="round" opacity="${o}"/>`; }).join("");
// a storm sky in the file's palette (the kit's own storm gradient is the crypto one)
const stormSky = (k = 1) => `<rect width="${FW}" height="${FH}" fill="${C.stormT}"/><rect y="${FH * 0.45}" width="${FW}" height="${FH * 0.55}" fill="${C.stormB}" opacity="${(0.55 * k).toFixed(2)}"/><rect y="${FH * 0.72}" width="${FW}" height="${FH * 0.28}" fill="${C.stormB}" opacity="${(0.5 * k).toFixed(2)}"/>`;
const hills = (G, fill = E.hill) => `<path d="M-800 ${G}Q-300 ${G - 140} 200 ${G - 40}Q700 ${G - 170} 1200 ${G - 50}Q1700 ${G - 160} 2700 ${G - 30}V${G + 900}H-800Z" fill="${fill}"/>`;
const flashAll = (p, c = "#e8fbff") => (p > 0 ? `<rect width="${FW}" height="${FH}" fill="${c}" opacity="${clamp(p).toFixed(3)}"/>` : "");

// ---- 0: charge piled up in a jar, no way out ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1], [2.6, 960, 560, 1.06], [4.24, 960, 540, 1.14]]), G = 940, JX = 960, W = 760, H = 700, top = G - H;
  // the charges: each moves about in the jar; from "ومش لاقية طريق" (2.74) they press against the glass, hit it and bounce
  const press = ease(seg(a, 2.7, 3.3)) * (1 - 0.5 * ease(seg(a, 3.7, 4.2)));
  let dots = "", hits = "";
  for (let i = 0; i < 16; i++) { const ph = rnd(i * 7) * 6.28, wx = 1.3 + rnd(i * 7 + 1) * 1.6, wy = 1.1 + rnd(i * 7 + 2) * 1.7, n = pop(a - 0.1 - i * 0.05);
    let x = JX + Math.sin(tot * wx + ph) * (W * 0.34), y = top + H / 2 + Math.cos(tot * wy + ph * 1.3) * (H * 0.32);
    // pushed outward toward the walls
    const dx = x - JX, dy = y - (top + H / 2), d = Math.hypot(dx, dy) || 1; x += (dx / d) * press * 70; y += (dy / d) * press * 60;
    dots += at(x, y, electron(30), n);
    if (press > 0.4 && i % 3 === 0) { const q = ((tot * 1.7 + i * 0.37) % 1); hits += rings(JX + (dx / d) * W * 0.47, top + H / 2 + (dy / d) * H * 0.45, 26 + 30 * q, E.spark, 0.35 * (1 - q), 1.3); }
  }
  // a little arrow of light that tries the lid and turns back, on "طريق تمشي فيه"
  const tryLid = seg(a, 3.35, 3.9), ty = top + 60 - 120 * Math.sin(Math.PI * tryLid);
  const arrow = tryLid > 0 && tryLid < 1 ? at(JX, ty, electron(30, { glow: 1 })) : "";
  const room = `<rect x="-600" y="-400" width="3200" height="${G + 400}" fill="${C.wall}"/><rect x="-600" y="${G}" width="3200" height="600" fill="${C.wallD}"/>${two(rr(260, G - 10, 1400, 40, 10), P.wood, P.woodD, 0, 10)}`;
  const g = `<rect width="${FW}" height="${FH}" fill="${C.wall}"/>` + layer(stars(4, 30, -200, 2200, 300, tot), c, 0.1) + layer(room + at(JX, G - 10, glassJar(W, H, `<g transform="translate(${-JX} ${-(G - 10)})">${dots + arrow + hits}</g>`)) + rings(JX, top + H / 2, 380, E.el, 0.06 + 0.06 * press, 1.2), c);
  return { g, out: toScreen(c, JX, top + H / 2), outC: "#0b2e3f", outZ: 12 };
}

// ---- 1–2: the room with the carpet and the door ----
const RG = 860, KX = 1560, KY = 540;
function room(t, c, tot, s) {
  const T1 = T(s, 1, 2.7), u = t - T1;
  // the slippers shuffle left to right; each takes its step in turn
  const walk = (k) => { const p = clamp(t / 2.5); let x = lerp(260, 900, p) + (k ? 40 : -40); const step = Math.sin(t * 7 + k * Math.PI); x += 18 * step; return x; };
  const lift = (k) => Math.max(0, Math.sin(t * 7 + k * Math.PI)) * 18 * (t < 2.6 ? 1 : 0);
  const arrive = ease(seg(u, 0.0, 0.7)), sx = lerp(0, 330, arrive);
  const sl = [0, 1].map((k) => at(walk(k) + sx, RG - (t < T1 + 0.7 ? lift(k) : 0), slipper(k ? "#2fa7c9" : "#2793b3"), 1.5)).join("");
  // charge comes up out of the carpet into the slippers
  const charged = clamp(seg(t, 0.75, 2.2)), n = Math.floor(10 * charged), mid = (walk(0) + walk(1)) / 2 + sx;
  const glowS = t > 2.1 ? rings(mid, RG - 40, 150 * spring(t - 2.1, 6, 10), E.el, 0.2 * (1 - seg(u, 1.0, 1.4)), 1.4) : "";
  // the glove: comes in above the slippers (the hand of someone who is not drawn), reaches the knob in shot 2
  const gIn = pop(t - 1.6), reach = ease(seg(u, 0.05, 1.0)), jerk = u > 1.96 ? spring(u - 1.96, 8, 18) : 0;
  const gx = lerp(mid + 60, KX - 140, reach) - 120 * jerk + 6 * Math.sin(tot * 2), gy = lerp(RG - 380, KY + 10, reach) + 6 * Math.cos(tot * 2.3);
  const sparkOn = u > 1.05 && u < 2.3, burst = u > 1.96 ? 1 - seg(u, 1.96, 2.45) : 0;
  // the charges ride with the slippers, then move up into the glove, then jump
  let dots = "";
  for (let i = 0; i < n; i++) { const jump = seg(u, 1.05 + i * 0.03, 1.45 + i * 0.03); if (jump >= 1) continue;
    const up = seg(u, 0.1 + i * 0.03, 0.8 + i * 0.03), sx0 = mid - 100 + (i % 5) * 50, sy0 = RG - 90 - Math.floor(i / 5) * 46 + 6 * Math.sin(tot * 5 + i);
    let x = lerp(sx0, gx - 40 + (i % 4) * 34, ease(up)), y = lerp(sy0, gy - 20 + Math.floor(i / 4) * 30, ease(up)); x = lerp(x, KX, ease(jump)); y = lerp(y, KY, ease(jump));
    dots += at(x, y, electron(19), pop(t - 0.75 - i * 0.12) * (1 - jump)); }
  const sparkG = sparkOn ? spark([gx + 130 * 1.2, gy - 12], [KX - 34, KY], seg(u, 1.05, 1.25), Math.floor(tot * 14)) + (burst > 0 ? rings(KX - 70, KY, 130 + 260 * (1 - burst), E.spark, 0.4 * burst, 1.4) : "") : "";
  const rug = `<path d="M100 ${RG + 6}L240 ${RG - 70}H1340L1480 ${RG + 6}Z" fill="${C.rugD}"/><path d="M120 ${RG}L250 ${RG - 66}H1330L1460 ${RG}Z" fill="${C.rug}"/><path d="M220 ${RG - 8}L300 ${RG - 52}H1280L1360 ${RG - 8}Z" fill="none" stroke="${C.rugB}" stroke-width="8" stroke-dasharray="26 16"/>`;
  const wall = `<rect x="-800" y="-600" width="3600" height="${RG - 60 + 600}" fill="${C.wall}"/><rect x="-800" y="${RG - 74}" width="3600" height="20" fill="${C.wallD}"/><rect x="-800" y="${RG - 60}" width="3600" height="700" fill="${C.floor}"/><rect x="-800" y="${RG + 120}" width="3600" height="600" fill="${C.floorD}"/>
    ${two(rr(200, 160, 360, 320, 14), "#1b5a74", "#13465c", 0, 10)}<path d="${rr(222, 182, 316, 276, 8)}" fill="${P.night0}"/><circle cx="460" cy="250" r="34" fill="${P.cream}"/><circle cx="446" cy="240" r="30" fill="${P.night0}"/><path d="M380 182V458M222 320H538" stroke="#1b5a74" stroke-width="14"/>
    ${at(1000, 470, lampShade(tot))}`;
  const doorG = at(KX - 60, RG - 60, door()) + at(KX, KY, knob(34));
  return `<rect width="${FW}" height="${FH}" fill="${C.wall}"/>` + layer(wall + doorG + rug + glowS + sl + dots + (gIn > 0 ? at(gx, gy, glove(), 1.2 * gIn, -6 * jerk) : "") + sparkG, c) + flashAll(0.5 * (u > 1.96 ? 1 - seg(u, 1.96, 2.2) : 0));
}
const lampShade = (tot) => `<path d="M0 -470V-160" stroke="${P.ink}" stroke-width="6"/>${two("M-90 -100L-50 -170H50L90 -100Z", "#ffcf6b", "#e0a540", 0, 8)}${rings(0, -60, 110, "#ffd98a", 0.1, 1.5)}`;
function s1(a, tot, s) { const c = camAt(a, [[0, 700, 640, 1.3], [2.7, 860, 620, 1.36]]); return { g: room(a, c, tot, s), in: toScreen(c, 600, RG - 50), inC: "#0b2e3f", inZ: 12 }; }
function s2(a, tot, s) { const T1 = T(s, 1, 2.7), c = camAt(a, [[0, 860, 560, 1.06], [1.0, 1200, 540, 1.3], [2.51, 1300, 540, 1.42]]); return { g: room(T1 + a, c, tot, s), out: toScreen(c, KX - 90, KY), outC: E.spark, outZ: 14 }; }

// ---- 3–4: the spark, big, in the dark; and the little charge behind it ----
function close(t, tot, s) {
  const T3 = T(s, 3, 2.25), u = t - T3;
  const c = camAt(t, [[0, 960, 540, 1.1], [T3, 960, 540, 1.0], [T3 + 0.8, 900, 560, 0.86], [T3 + 2.6, 900, 560, 0.84]]);
  const jerk = u > 1.52 ? spring(u - 1.52, 8, 20) : 0, gx = 520 - 160 * jerk, gy = 560;
  const on = u < 1.55, sd = Math.floor(tot * 16), crackle = on ? zig([gx + 300, gy - 20], [1290, 560], sd, 30) + zig([gx + 300, gy - 20], [1290, 560], sd + 50, 12, 0.7) : "";
  const big = on ? rings((gx + 300 + 1330) / 2, 550, 200 * (1 + 0.08 * Math.sin(tot * 30)), E.spark, 0.22, 1.5) : "";
  // the number: thousands of volts, rolled up on "آلاف الفولتات"; it shrinks away on "قليلة"
  const roll = seg(t, 1.1, 1.6), v = Math.round(lerp(0, 1000, ease(roll))), lab = t < 1.6 ? `${fmt(v)} V` : "1,000s V";
  const tagK = pop(t - 1.1) * (1 - 0.35 * ease(seg(u, 0.84, 1.2)));
  const tag = t > 1.1 ? at(FW / 2, lerp(220, 190, ease(seg(u, 0.84, 1.2))) + (FH > FW ? 330 : 0), vtag(lab, 640, 110), tagK, 0, `opacity="${(1 - 0.5 * ease(seg(u, 0.84, 1.2))).toFixed(2)}"`) : "";
  // behind the spark: only three little charges, on "الشحنة اللي وراها قليلة جداً"
  const three = [0, 1, 2].map((i) => { const ap = pop(u - 0.3 - i * 0.12), x = gx - 20 + i * 58, y = gy + 4 + 6 * Math.sin(tot * 6 + i), jump = seg(u, 1.48 + i * 0.04, 1.62 + i * 0.04);
    return jump >= 1 ? "" : at(lerp(x, 1330, ease(jump)), lerp(y, 560, ease(jump)), electron(26, { glow: seg(u, 0.84, 1.2) }), ap); }).join("");
  const bracket = u > 0.84 ? at(gx + 38, gy + 4, `<path d="${rr(-110, -60, 220, 120, 60)}" fill="none" stroke="${P.gold}" stroke-width="8" stroke-dasharray="18 12"/>`, pop(u - 0.84)) : "";
  const shake = u > 1.52 && u < 1.9 ? `<g transform="translate(${(10 * Math.sin(tot * 70) * (1 - seg(u, 1.52, 1.9))).toFixed(1)} 0)">` : "<g>";
  const smoke = u > 1.9 ? [0, 1].map((i) => { const q = seg(u, 1.9 + i * 0.2, 2.6 + i * 0.2); return `<circle cx="${1300 + 40 * q}" cy="${520 - 160 * q}" r="${16 + 30 * q}" fill="#9bb7c4" opacity="${(0.35 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const scene = `<rect x="-600" y="-400" width="3200" height="2000" fill="#06202d"/>${at(1300, 560, at(0, 0, `<path d="${rr(40, -600, 500, 1400, 0)}" fill="${C.door}"/>`) + knob(110))}`;
  return { c, g: `<rect width="${FW}" height="${FH}" fill="#06202d"/>` + layer(scene + big + shake + at(gx, gy, glove(), 2.2) + three + bracket + "</g>" + crackle + smoke, c) + tag };
}
function s3(a, tot, s) { const r = close(a, tot, s); return { g: r.g, in: toScreen(r.c, 1060, 540), inC: E.spark, inZ: 14 }; }
function s4(a, tot, s) { const r = close(T(s, 3, 2.25) + a, tot, s); return { g: r.g }; }

// ---- 5: the spark grows into a bolt over the night town ----
function s5(a, tot) {
  const BX5 = 1180, c = camAt(a, [[0, BX5, 380, 4.2], [0.9, 1100, 430, 1.9], [1.3, 960, 540, 1.0], [1.93, 960, 545, 0.98]]), G = 880;
  const town = nightTown(tot, c, layer, { lit: 1 });
  const grow = ease(seg(a, 0.25, 1.15)), hit = seg(a, 1.15, 1.32), fl = a > 1.32 ? 1 - seg(a, 1.32, 1.9) : 0;
  // the little spark stretches from a short zigzag at (960, 380) into a bolt from the sky to the ground
  const y0 = lerp(350, -120, grow), y1 = lerp(410, G - 10, Math.max(grow, hit));
  const b = bolt(BX5, y0, BX5, y1, 7, 1, 0.6 + 0.4 * (fl > 0 ? 1 : grow), lerp(10, 40, grow));
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(6, 70, -300, 2300, 600, tot), c, 0.15) + layer(town.far, c, 0.5) + layer(town.near, c)
    + `<rect width="${FW}" height="${FH}" fill="#02101a" opacity="${(0.35 * (1 - fl)).toFixed(2)}"/>` + layer(rings(BX5, y1 - 20, 160, E.spark, 0.25 * fl, 1.6) + b, c) + flashAll(0.55 * fl);
  return { g, out: toScreen(c, BX5, 120), outC: C.stormT, outZ: 10 };
}

// ---- 6–8: the storm over the hills; a cloud charges and the charge jumps to the ground ----
const CX = 760, CY = 300, GX = 860, GG = 900;
function storm(t, tot, s) {
  const T7 = T(s, 6, 2.17), T8 = T7 + T(s, 7, 3.07), u7 = t - T7, u8 = t - T8;
  const c = camAt(t, [[0, 960, 470, 0.86], [T7, 960, 480, 0.9], [T7 + 1.5, 930, 500, 0.96], [T8 + 1.88, 930, 500, 0.98]]);
  const charge = ease(seg(t, 0.1, 0.9)), hit = seg(t, 1.24, 1.52), fl = t > 1.52 ? Math.max(0.15 + 0.15 * Math.sin(tot * 22), 1 - seg(t, 1.52, 2.2)) : 0;
  const b = hit > 0 ? bolt(CX + 40, CY + 100, GX, GG - 6, 11, hit, 0.7 + 0.3 * fl, 38) : "";
  const groundHit = t > 1.52 ? rings(GX, GG - 10, 130 + 30 * Math.sin(tot * 20), E.spark, 0.3 * (0.4 + 0.6 * fl), 1.6) : "";
  // the cloud loses part of its charge down the bolt
  const ch = charge * (1 - 0.5 * ease(seg(t, 1.24, 1.7)));
  const runners = hit > 0 && t < 2.1 ? [0, 1, 2, 3].map((i) => { const q = clamp(((t - 1.24) * 2.4 + i * 0.25) % 1); const d = boltPath(CX + 40, CY + 60, GX, GG - 6, 11); return at(lerp(CX + 40, GX, q) + (rnd(i + 3) - 0.5) * 40, lerp(CY + 60, GG, q), electron(18)); }).join("") : "";
  // the tag: 300,000,000 V rolled up on "تلتمية مليون فولت", then flipped to 30,000 A on "تلاتين ألف أمبير"
  const vv = lerp(0, 300000000, ease(seg(u7, 1.5, 2.5))), flip = seg(u8, 0.35, 0.65), aa = lerp(0, 30000, ease(seg(u8, 0.5, 1.25)));
  const lab = flip < 0.5 ? `${fmt(vv)} V` : `${fmt(aa)} A`, tagK = pop(u7 - 0.2);
  const tag = u7 > 0.2 ? at(FH > FW ? FW / 2 : 1390, FH > FW ? 330 : 470, vtag(lab, 760, 96, flip < 0.5 ? P.gold : E.el), [Math.max(0.04, Math.abs(Math.cos(Math.PI * flip))) * tagK, tagK]) : "";
  const g = stormSky(1) + layer(rain(tot, -200, 2200, -200, 1100, 60, 0.18), c, 0.4) + layer(hills(GG + 40, "#0d3445") + skyline(21, -400, 2400, GG - 30, 60, 170, "#082636", "#ffcf6b"), c, 0.6)
    + layer(`<rect x="-800" y="${GG}" width="3600" height="600" fill="${E.hill}"/>` + groundHit + b + at(CX, CY, cloud(tot, ch, { c: C.cloud, cD: C.cloudD }), 1.45) + runners, c) + flashAll(0.4 * (t > 1.52 ? 1 - seg(t, 1.52, 1.9) : 0)) + tag;
  return { g, c };
}
function s6(a, tot, s) { const r = storm(a, tot, s); return { g: r.g, in: toScreen(r.c, CX, CY), inC: C.stormT, inZ: 10 }; }
function s7(a, tot, s) { return { g: storm(T(s, 6, 2.17) + a, tot, s).g }; }
function s8(a, tot, s) { const r = storm(T(s, 6, 2.17) + T(s, 7, 3.07) + a, tot, s); return { g: r.g, out: toScreen(r.c, (CX + GX) / 2 + 20, 600), outC: "#e8fbff", outZ: 14 }; }

// ---- 9: the planet at night, flashes everywhere, a stopwatch at one second ----
function s9(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [3.23, 900, 540, 1.08]]), GX9 = 760, GY9 = 560, R = 360;
  // flashes: a few at first, then many on "عشرات المرات"
  let fl = "";
  for (let i = 0; i < 70; i++) { const t0 = i < 8 ? 0.15 + i * 0.16 : 1.28 + (i - 8) * 0.03, q = (a - t0) / 0.32; if (q < 0 || q > 1) continue;
    const ang = rnd(i * 13) * 6.28, rr0 = Math.sqrt(rnd(i * 13 + 1)) * R * 0.86, x = GX9 + Math.cos(ang) * rr0, y = GY9 + Math.sin(ang) * rr0, k = 1 - q;
    fl += rings(x, y, 60 * (0.5 + q), E.spark, 0.55 * k, 1.5) + disc(x, y, 16 * k, "#fff", E.spark) + bolt(x - 10, y - 46, x + 10, y + 30, i, 1, 1, 9 * k + 3); }
  const turn = clamp((a - 2.0) / 1.0), sw = at(FH > FW ? FW / 2 : 1500, FH > FW ? 330 : 360, stopwatch(turn), pop(a - 0.4) * 1.35);
  const oneS = a > 2.4 ? at(FH > FW ? FW / 2 : 1500, FH > FW ? 1520 : 700, vtag("1 s", 260, 90, P.gold), pop(a - 2.4)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(9, 110, -300, 2300, 1080, tot), c, 0.2) + layer(at(GX9, GY9, globe(R, tot * 0.03, { night: 0.55, land: "#1fa86c", sea: "#0f4d78", glow: E.el })) + fl, c) + sw + oneS;
  return { g, in: toScreen(c, GX9, GY9), inC: "#e8fbff", inZ: 14, out: toScreen(c, GX9, GY9), outC: "#fff3c2", outZ: 12 };
}

// ---- 10: the sun and the bolt, each with a thermometer (host right: the right lower corner stays empty) ----
function s10(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [3.86, 880, 540, 1.04]]), SX = 470, SY = 420, BX = 1080, G = 900, TH = 640;
  const sun = rings(SX, SY, 260 * (1 + 0.02 * Math.sin(tot * 2)), C.sun, 0.18, 1.4) + disc(SX, SY, 190, "#ffd98a", "#ffb04a") + Array.from({ length: 12 }, (_, i) => { const q = i / 12 * 6.28 + tot * 0.2; return `<path d="M${SX + 220 * Math.cos(q)} ${SY + 220 * Math.sin(q)}L${SX + 270 * Math.cos(q)} ${SY + 270 * Math.sin(q)}" stroke="#ffd98a" stroke-width="16" stroke-linecap="round"/>`; }).join("");
  const sunLv = 0.18 * ease(seg(a, 1.5, 1.95)), boltLv = lerp(0, 0.9, ease(seg(a, 2.0, 3.1)));
  const fl = 0.75 + 0.25 * Math.sin(tot * 25);
  const b = bolt(BX, -80, BX + 30, G - 6, 23, 1, fl, 40) + rings(BX + 30, G - 20, 120, E.spark, 0.25, 1.5);
  const tS = at(760, G - 60, thermo(TH, sunLv, "#ffb04a"), pop(a - 0.3)), tB = at(1340, G - 60, thermo(TH, boltLv, E.el), pop(a - 0.5));
  const line = a > 1.95 ? `<path d="M760 ${G - 60 - (TH - 22) * 0.18 - 10}H1340" stroke="#ffb04a" stroke-width="6" stroke-dasharray="16 12" opacity=".8"/>` : "";
  const times = a > 2.85 ? at(1340, G - 60 - TH - 90, `${two(rr(-150, -80, 300, 155, 40), P.ink, "#020c14", 0, 10)}<path d="M-96 -32L-40 24M-40 -32L-96 24" stroke="${E.el}" stroke-width="16" stroke-linecap="round"/>${text(40, 38, "5", 110, E.el)}`, pop(a - 2.85)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(14, 60, -300, 2300, 700, tot), c, 0.15) + layer(sun + `<rect x="-800" y="${G}" width="3600" height="500" fill="${E.hill}"/>` + b + line + tS + tB + times, c);
  return { g, in: toScreen(c, SX, SY), inC: "#fff3c2", inZ: 12, out: toScreen(c, BX + 10, 400), outC: "#e8fbff", outZ: 14 };
}

// ---- 11: the thunder: rings of air burst out of the bolt ----
function s11(a, tot) {
  const burst = a > 1.6 ? a - 1.6 : -1, sh = burst > 0 && burst < 0.5 ? 14 * Math.sin(tot * 80) * (1 - burst / 0.5) : 0;
  const c = camAt(a, [[0, 960, 540, 1.12], [1.6, 960, 540, 1.04], [2.46, 960, 540, 1.0]]), BX = 960, G = 920;
  const fl = 0.7 + 0.3 * Math.sin(tot * 23);
  const b = bolt(BX - 40, -100, BX + 20, G - 6, 31, 1, fl, 46);
  // the air round the bolt: little puffs that sit still, then are thrown out by the burst
  let air = "";
  for (let i = 0; i < 26; i++) { const ang = rnd(i * 3) * 6.28, d0 = 130 + rnd(i * 3 + 1) * 200, d = d0 + (burst > 0 ? 900 * easeOut(clamp(burst / 0.9)) : 6 * Math.sin(tot * 3 + i)), y0 = 200 + rnd(i * 3 + 2) * 600;
    air += `<circle cx="${(BX + Math.cos(ang) * d).toFixed(1)}" cy="${(y0 + Math.sin(ang) * d * 0.3).toFixed(1)}" r="${12 + 6 * rnd(i)}" fill="#cfeaf3" opacity="${(0.35 * (1 - seg(burst, 0.5, 0.9))).toFixed(2)}"/>`; }
  const ringsB = burst > 0 ? [0, 1, 2].map((i) => { const q = clamp((burst - i * 0.12) / 0.8); return q <= 0 || q >= 1 ? "" : `<circle cx="${FH > FW ? FW / 2 : BX}" cy="${FH > FW ? 940 : 520}" r="${(80 + 1100 * easeOut(q)).toFixed(1)}" fill="none" stroke="${E.spark}" stroke-width="${(36 * (1 - q) + 4).toFixed(1)}" opacity="${(0.7 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const g = stormSky(0.8) + `<g transform="translate(${sh.toFixed(1)} ${(sh * 0.5).toFixed(1)})">` + layer(hills(G + 30, "#0d3445"), c, 0.6) + layer(`<rect x="-800" y="${G}" width="3600" height="600" fill="${E.hill}"/>` + air + b + rings(BX + 20, G - 20, 140, E.spark, 0.25, 1.5), c) + "</g>" + ringsB + flashAll(burst > 0 ? 0.3 * (1 - seg(burst, 0, 0.3)) : 0);
  return { g, in: toScreen(c, BX, 400), inC: "#e8fbff", inZ: 14, out: toScreen(c, BX, 400), outC: C.stormT, outZ: 10 };
}

// ---- 12: 1752, the kite with a key in the storm; FRANKLIN ----
function s12(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.05], [2.5, 1000, 540, 1.15], [5.6, 1020, 560, 1.32]]), KX2 = 1300, KY2 = 300, G = 940;
  const sway = 14 * Math.sin(tot * 1.3), kx = KX2 + sway, ky = KY2 + 8 * Math.sin(tot * 1.7);
  const post = [520, G - 260];
  const keyAt = [lerp(kx, post[0], 0.55) + 10, lerp(ky + 120, post[1], 0.55) + 30];
  const str = `<path d="M${kx} ${ky + 120}Q${(kx + post[0]) / 2 + 40} ${(ky + post[1]) / 2 + 90} ${post[0]} ${post[1]}" fill="none" stroke="${P.cream}" stroke-width="4" opacity=".8"/>`;
  // far lightning on "البرق ده كهربا", the key gives a small spark on "واقترح تجربة"
  const far = a > 3.3 && a < 3.75 ? bolt(300, -40, 380, 620, 41, seg(a, 3.3, 3.4), 1 - seg(a, 3.5, 3.75), 16) : "";
  const keySpark = a > 4.3 ? spark([keyAt[0], keyAt[1] + 170], [keyAt[0] + 10, keyAt[1] + 250], seg(a, 4.3, 4.45), Math.floor(tot * 12)) + rings(keyAt[0], keyAt[1] + 90, 70, C.brass, 0.25 * (0.6 + 0.4 * Math.sin(tot * 10)), 1.5) : "";
  const jar = at(keyAt[0] + 10, keyAt[1] + 330, `<path d="${rr(-50, -90, 100, 90, 16)}" fill="${C.glass}" opacity=".25" stroke="${C.glass}" stroke-width="6"/><path d="${rr(-50, -40, 100, 40, 10)}" fill="#c6d6de" opacity=".6"/><path d="M0 -90V-130" stroke="${C.brass}" stroke-width="8"/>`);
  const cal = at(300, 240, calPage("1752", "", 1, 150), pop(a - 0.38) * 0.95), name = a > 2.5 ? at(300, 470, plate("FRANKLIN", 66), pop(a - 2.5)) : "";
  const shed = `<path d="M${post[0] - 6} ${post[1]}V${G}" stroke="${P.wood}" stroke-width="18"/>${at(150, G, two(rr(-160, -260, 320, 260, 6), "#1b5a74", "#13465c", 12, 0) + two("M-190 -250L0 -360L190 -250Z", E.roof, P.ink, 0, 8) + `<path d="${rr(-40, -150, 80, 150, 6)}" fill="${P.win}"/>`)}`;
  const g = stormSky(1) + layer(at(980, 120, cloud(tot, 0, { c: C.cloud, cD: C.cloudD }), 2.2) + at(260, 60, cloud(tot, 0, { c: C.cloudD, cD: "#16313c" }), 1.6), c, 0.3) + layer(far, c, 0.4)
    + layer(hills(G + 20, "#0d3445"), c, 0.7) + layer(`<rect x="-800" y="${G}" width="3600" height="500" fill="${E.hill}"/>` + shed + str + at(keyAt[0], keyAt[1], key()) + jar + keySpark + at(kx, ky, kite(tot), 1, sway * 0.5), c)
    + layer(rain(tot, -300, 2300, -200, 1100, 90, 0.3), c, 1.1) + flashAll(a > 3.3 ? 0.25 * (1 - seg(a, 3.3, 3.7)) : 0) + cal + name;
  return { g, in: toScreen(c, 960, 300), inC: C.stormT, inZ: 10, out: toScreen(c, 960, 400), outC: "#071a28", outZ: 10 };
}

// ---- 13: 1753, the study; the candle goes out (sombre and still; host right) ----
function s13(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [2.9, 800, 540, 1.05]]), G = 900, DX = 860, DY = 700;
  const flame = 1 - ease(seg(a, 2.05, 2.5)), dim = ease(seg(a, 2.1, 2.8));
  const flick = a > 1.2 && a < 1.6 ? 1 - seg(a, 1.2, 1.6) : 0;   // one quiet flash in the window when he tries it
  const win = `${two(rr(170, 180, 400, 460, 10), "#3a2a1a", "#2a1d10", 0, 10)}<path d="${rr(195, 205, 350, 410, 6)}" fill="${C.stormT}"/>${rain(tot, 200, 540, 210, 600, 16, 0.3)}
    ${flick > 0 ? `<path d="${rr(195, 205, 350, 410, 6)}" fill="#e8fbff" opacity="${(0.6 * flick).toFixed(2)}"/>` : ""}<path d="M370 205V615M195 410H545" stroke="#3a2a1a" stroke-width="12"/>`;
  // the iron rod comes through the window down toward the desk
  const rod = `<path d="M480 300L760 560" stroke="#5f6f7a" stroke-width="14" stroke-linecap="round"/><path d="M760 560L790 600" stroke="#5f6f7a" stroke-width="8"/>${flick > 0 ? rings(760, 560, 60, E.spark, 0.4 * flick, 1.5) : ""}`;
  const desk = `${two(rr(DX - 400, DY - 30, 800, 40, 6), P.wood, P.woodD, 0, 8)}<path d="${rr(DX - 370, DY + 10, 40, G - DY - 10, 4)}${rr(DX + 330, DY + 10, 40, G - DY - 10, 4)}" fill="${P.woodD}"/>
    ${at(DX - 200, DY - 30, `<path d="${rr(-90, -20, 180, 20, 4)}" fill="${P.cream}"/><path d="${rr(-80, -36, 170, 16, 4)}" fill="#e9dcc0"/>`)}${at(DX - 60, DY - 30, `<path d="M0 0L30 -90" stroke="${P.ink}" stroke-width="6"/><path d="${rr(-20, -16, 40, 16, 4)}" fill="#1b3a48"/>`)}`;
  const smoke = flame < 1 ? [0, 1, 2].map((i) => { const q = clamp(((a - 2.2) * 0.7 + i * 0.3) % 1); return a < 2.2 ? "" : `<path d="M${DX + 200} ${DY - 340 - q * 220}q${16 * Math.sin(tot * 2 + i)} -30 0 -60" fill="none" stroke="#9bb7c4" stroke-width="6" stroke-linecap="round" opacity="${(0.4 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const cal = at(1180, 300, calPage("1753", "", 0.85, 150), pop(a - 0.1));
  const room = `<rect x="-800" y="-400" width="3600" height="${G + 400}" fill="#0b2a38"/><rect x="-800" y="${G}" width="3600" height="600" fill="${C.floorD}"/>${win}${rod}${cal}${desk}${at(DX + 200, DY - 30, candle(tot, flame), 1.6)}${smoke}`;
  const g = `<rect width="${FW}" height="${FH}" fill="#0b2a38"/>` + layer(room, c) + (flame > 0 ? `<rect width="${FW}" height="${FH}" fill="#ffb84a" opacity="${(0.05 * flame).toFixed(3)}"/>` : "") + `<rect width="${FW}" height="${FH}" fill="#020a10" opacity="${(0.45 * dim).toFixed(3)}"/>`;
  return { g, in: toScreen(c, 370, 410), inC: "#071a28", inZ: 10 };
}

// ---- 10 in portrait (spark.v.js): the sun with its thermometer above, the bolt with its thermometer under it, the lower
// right corner kept empty for the host ----
export function s10v(a, tot) {
  const c = camAt(a, [[0, 540, 960, 1.0], [3.86, 540, 960, 1.03]]), SX = 330, SY = 420, BX = 330, G = 1330, TH = 470, TX = 790;
  const sun = rings(SX, SY, 220 * (1 + 0.02 * Math.sin(tot * 2)), C.sun, 0.18, 1.4) + disc(SX, SY, 160, "#ffd98a", "#ffb04a") + Array.from({ length: 12 }, (_, i) => { const q = i / 12 * 6.28 + tot * 0.2; return `<path d="M${SX + 185 * Math.cos(q)} ${SY + 185 * Math.sin(q)}L${SX + 228 * Math.cos(q)} ${SY + 228 * Math.sin(q)}" stroke="#ffd98a" stroke-width="14" stroke-linecap="round"/>`; }).join("");
  const sunLv = 0.18 * ease(seg(a, 1.5, 1.95)) * 5, boltLv = lerp(0, 0.9, ease(seg(a, 2.0, 3.1)));
  const fl = 0.75 + 0.25 * Math.sin(tot * 25);
  const b = bolt(BX - 20, 720, BX + 20, G - 6, 23, 1, fl, 40) + rings(BX + 20, G - 20, 110, E.spark, 0.25, 1.5);
  // each thermometer reads its own scale: the sun's fills a fifth of the bolt's
  const tS = at(TX, 640, thermo(TH, Math.min(1, sunLv) * 0.18, "#ffb04a"), pop(a - 0.3)), tB = at(TX, G - 20, thermo(TH, boltLv, E.el), pop(a - 0.5));
  const times = a > 2.85 ? at(TX - 10, G - 20 - TH - 90, `${two(rr(-150, -80, 300, 155, 40), P.ink, "#020c14", 0, 10)}<path d="M-96 -32L-40 24M-40 -32L-96 24" stroke="${E.el}" stroke-width="16" stroke-linecap="round"/>${text(40, 38, "5", 110, E.el)}`, pop(a - 2.85)) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(14, 60, -300, 1400, 1300, tot), c, 0.15) + layer(sun + `<rect x="-800" y="${G}" width="2600" height="900" fill="${E.hill}"/>` + b + tS + tB + times, c);
  return { g, in: toScreen(c, SX, SY), inC: "#fff3c2", inZ: 12, out: toScreen(c, BX + 10, 900), outC: "#e8fbff", outZ: 14 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13];
// in a Short (cfg.vertical) the portrait versions of spark.v.js (see makeSet in kit.js)
export const sparkSet = makeSet(SHOTS, V, P);
