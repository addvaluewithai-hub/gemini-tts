// "Sound becomes numbers" (network part 1): six shots with nothing to read but numbers.
//   0 the blue phone, big; pale rings of shaking air reach its microphone, the microphone glows and a teal wave runs
//     out of the phone across the frame (voice → shaking air → microphone → an electric wave)
//   1 the camera travels along the wave; gold sticks measure it at even steps, faster and faster; a counter rolls to
//     8,000 while a stopwatch makes one turn (8,000 measurements a second)
//   2 two waves: a calm speech wave, measured by the sticks and traced back true (✓); a dense music wave under notes,
//     measured by the same few sticks, traced back jagged, and the notes crack (✗): why hold music sounds awful
//   3 the sticks turn into gold digits that rise off the wave; the wave flattens and fades; the digits line up and set off
//   4 a tall pile of digits goes through a sieve: most fall away as dust, a small neat packet comes out and glows
//     (what arrives is a summary of your voice)
//   5 the packet slides into the blue phone and teal rings leave it into the night (into the air)
// Shots hand over through a shape: the wave (teal), a measuring dot (gold), a digit (gold).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, fmt, stars, skyline } from "./bank.js";
import { WAVE, WAVED, pop, bluePhone, radio, stopwatch } from "./net.js";

const bg = (c, tot, seed = 3) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 80, -800, 3600, 900, tot), c, 0.15);
// a wave as a path between x0 and x1 (f gives the height at x)
const path = (f, x0, x1, step = 6) => { let d = ""; for (let x = x0; x <= x1 + 0.1; x += step) d += (d ? "L" : "M") + x.toFixed(1) + " " + f(x).toFixed(1); return d; };
const line = (d, col, w, extra = "") => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
// a measuring stick from the axis y0 to the wave at x, with its gold dot (a: how far it has dropped in)
const stick = (x, y0, y, a) => { if (a <= 0) return ""; const k = pop(a, 10, 18), yy = lerp(y0, y, k);
  return `<path d="M${x.toFixed(1)} ${y0}V${yy.toFixed(1)}" stroke="${P.goldD}" stroke-width="6" stroke-linecap="round"/>` + (a < 0.3 ? rings(x, yy, 26 * (1 - a / 0.3) + 12, P.gold, 0.3) : "") + disc(x, yy, 13, P.gold, P.goldD); };
const note = (k = 1, c = P.pink, cD = P.pinkD) => at(0, 0, `<path d="M18 -10V-110L58 -90V-70L18 -88" fill="${cD}"/><path d="M14 -10V-108" stroke="${cD}" stroke-width="9"/>${two("M-22 0a24 18 -20 1 0 48 -14a24 18 -20 1 0 -48 14Z", c, cD, 0, 5)}`, k);
const mic = (glow) => `${glow > 0 ? rings(0, -12, 40 * glow, P.gold, 0.35) : ""}<circle cx="0" cy="-12" r="9" fill="${mix(P.blueD, P.gold, glow)}"/>`;

// ---- 0: air shakes, the microphone turns it into a wave ----
const PX = 620, PY = 900, PK = 2.3, MX = PX, MY = PY - 12 * PK;   // the phone and its microphone (world)
const f0 = (x) => MY - 30 + 120 * Math.sin((x - PX) / 55) * Math.min(1, (x - PX) / 300);
function s0(a, tot) {
  const c = camAt(a, [[0, 900, 540, 1.0], [2.0, 900, 540, 1.02], [4.79, 1000, 560, 1.06]]);
  // pale air rings travel in from the left and hit the microphone; stronger on "shakes"
  const air = a > 0.9 ? Array.from({ length: 5 }, (_, i) => { const q = ((a * 0.9 + i / 5) % 1), r = lerp(620, 40, q), op = (0.25 + 0.55 * seg(a, 1.3, 1.6)) * Math.sin(Math.PI * q);
    return `<path d="M${(MX - r).toFixed(1)} ${(MY - r * 0.7).toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 0 ${(MX - r).toFixed(1)} ${(MY + r * 0.7).toFixed(1)}" fill="none" stroke="#dcd3ff" stroke-width="${10 + 6 * seg(a, 1.3, 1.6)}" stroke-linecap="round" opacity="${op.toFixed(3)}" transform="translate(${(r * 0.28).toFixed(1)} 0)"/>`; }).join("") : "";
  const glow = a > 2.23 ? clamp(spring(a - 2.23, 7, 12)) : 0, shake = a > 1.46 ? 4 * Math.sin(a * 60) * Math.exp(-(a - 1.46) * 2) : 0;
  const grow = easeOut(seg(a, 2.8, 4.3)), xEnd = lerp(MX + 20, 2300, grow);
  const wave = grow > 0 ? line(path((x) => f0(x) + 6 * Math.sin(a * 6 + x / 40), MX + 20, xEnd, 5), WAVED, 26) + line(path((x) => f0(x) + 6 * Math.sin(a * 6 + x / 40), MX + 20, xEnd, 5), WAVE, 14) + rings(xEnd, f0(xEnd), 40, WAVE, 0.3) : "";
  const ph = at(PX + shake, PY, bluePhone({ inner: `<path d="M-30 -140h60M-30 -110h40" stroke="#5aa7d8" stroke-width="10" stroke-linecap="round"/>` }) + mic(glow), PK);
  const g = bg(c, tot) + layer(skyline(7, -400, 2600, 1000, 120, 300, "#22195a", "#ffb066"), c, 0.5) + layer(`<rect x="-500" y="${PY}" width="3600" height="400" fill="#141a45"/>` + air + ph + wave, c);
  const ox = 1500, out = toScreen(c, ox, f0(ox));
  return { g, out, outC: WAVE, outZ: 18 };
}

// ---- 1: measuring the wave, faster and faster: 8,000 a second ----
const Y1 = 560, f1 = (x) => Y1 - 150 * Math.sin(x / 95) - 40 * Math.sin(x / 31 + 1);
const DX1 = 62, N1 = 52;
function s1(a, tot) {
  const c = camAt(a, [[0, 760, 540, 1.0], [3.9, 2100, 540, 1.0], [5.39, 2250, 500, 0.92]]);
  const wave = line(path(f1, -400, 4200, 6), WAVED, 22) + line(path(f1, -400, 4200, 6), WAVE, 12);
  let sticks = ""; for (let k = 0; k < N1; k++) { const x = 300 + k * DX1, tk = 0.53 + 3.2 * Math.pow(k / N1, 0.62); sticks += stick(x, Y1, f1(x), a - tk); }
  const axis = `<path d="M-400 ${Y1}H4200" stroke="#3a3478" stroke-width="6"/>`;
  // the number: thousands of measurements; then exactly 8,000 in one second
  const on = a > 3.7 ? pop(a - 3.7) : 0, n = Math.round(lerp(0, 8000, easeOut(seg(a, 3.78, 4.4))));
  const hud = on > 0 ? at(840, 175, `<path d="${rr(-330, -100, 660, 170, 85)}" fill="#120c34" opacity=".85"/>${number(-40, 30, fmt(n), 120, P.gold)}${text(230, 30, "/ s", 70, P.cream)}`, on) + at(1380, 170, stopwatch(78, seg(a, 3.78, 4.99)), on) : "";
  const g = bg(c, tot, 11) + layer(axis + wave + sticks, c) + hud;
  const lx = 300 + 44 * DX1;
  return { g, in: toScreen(c, 300 + 3 * DX1, f1(300 + 3 * DX1)), inC: WAVE, inZ: 18, out: toScreen(c, lx, f1(lx)), outC: P.gold, outZ: 30 };
}

// ---- 2: speech is measured well enough; music is not ----
const XA = 470, XB = 1850, YS = 310, YM = 760, D2 = 46;
const fs_ = (x) => YS - 105 * Math.sin((x - XA) / 72) * (0.7 + 0.3 * Math.sin((x - XA) / 300));
const fm = (x) => YM - 95 * Math.sin((x - XA) / 13.1) - 25 * Math.sin((x - XA) / 5.3);
function s2(a, tot) {
  const c = camAt(a, [[0, 1150, 540, 1.0], [8.37, 1160, 540, 1.02]]);
  const xs = []; for (let x = XA; x <= XB; x += D2) xs.push(x);
  // speech: sticks, then the traced line, then ✓
  const sp = line(path(fs_, XA, XB), WAVED, 18) + line(path(fs_, XA, XB), WAVE, 9);
  const spS = xs.map((x, i) => stick(x, YS, fs_(x), a - 0.99 - i * 0.03)).join("");
  const spT = drawn("M" + xs.map((x) => `${x} ${fs_(x).toFixed(1)}`).join("L"), seg(a, 2.0, 2.7), P.gold, 8, 'stroke-linejoin="round" opacity=".9"');
  const ok = check(XB + 10, YS - 160, 46, P.green, a - 2.75);
  // music: notes ride a dense wave; the same sticks miss it; the traced line comes out jagged; the notes crack
  const mOn = seg(a, 3.0, 3.5), mm = mOn > 0 ? `<g opacity="${mOn.toFixed(2)}">${line(path(fm, XA, XB, 2.5), "#ff5fa2", 12)}</g>` : "";
  const notes = mOn > 0 ? [0, 1, 2, 3, 4].map((i) => { const x = XA + 140 + i * 280, crack = seg(a, 6.93 + i * 0.12, 7.4 + i * 0.12), bob = 14 * Math.sin(tot * 3 + i), y = YM - 230 + bob;
    if (crack <= 0) return at(x, y, note(1.15), pop(a - 3.14 - i * 0.08));
    const fall = easeIn(seg(crack, 0.3, 1)) * 300, cr = `<path d="M8 -120L-6 -80L14 -50L-4 -20L10 10" stroke="#120c34" stroke-width="7" fill="none" stroke-linejoin="round"/>`;
    return at(x - 50 * crack, y + fall, note(1.15) + cr, 1, -30 * crack, `opacity="${(1 - seg(crack, 0.5, 1) * 0.7).toFixed(2)}"`) + (crack > 0.3 ? at(x + 40 * crack, y + fall * 1.3, `<path d="M18 -10V-110L58 -90V-70L18 -88" fill="${P.pinkD}"/>`, 1.15, 40 * crack) : ""); }).join("") : "";
  const mS = xs.map((x, i) => stick(x, YM, fm(x), a - 4.42 - i * 0.03)).join("");
  const mT = drawn("M" + xs.map((x) => `${x} ${fm(x).toFixed(1)}`).join("L"), seg(a, 5.4, 6.2), P.gold, 9, 'stroke-linejoin="round"');
  const bad = cross(XB + 10, YM - 200, 46, P.red, a - 7.65);
  const axes = `<path d="M${XA - 30} ${YS}H${XB + 30}M${XA - 30} ${YM}H${XB + 30}" stroke="#3a3478" stroke-width="6"/>`;
  const g = bg(c, tot, 21) + layer(axes + sp + spS + spT + ok + mm + notes + mS + mT + bad, c);
  return { g, in: toScreen(c, xs[4], fs_(xs[4])), inC: P.gold, inZ: 30, out: toScreen(c, xs[20], fs_(xs[20])), outC: P.gold, outZ: 30 };
}

// ---- 3: each measurement becomes a number; the wave stops mattering; the numbers travel ----
const Y3 = 640, f3 = (x) => Y3 - 160 * Math.sin((x - 300) / 80) * Math.sin((x - 300) / 900 + 0.6), D3 = 70, X30 = 335;
const DIG = Array.from({ length: 20 }, (_, i) => String(Math.floor(rnd(i * 17 + 3) * 10)));
function s3(a, tot) {
  const c = camAt(a, [[0, 1000, 540, 1.0], [3.2, 1000, 520, 1.0], [4.78, 1150, 500, 1.04]]);
  const flat = ease(seg(a, 1.31, 2.67)), fw = (x) => lerp(f3(x), Y3, flat);
  const wv = `<g opacity="${(1 - 0.85 * flat).toFixed(2)}">${line(path(fw, 200, 1750), WAVED, 22)}${line(path(fw, 200, 1750), WAVE, 12)}</g>`;
  let out = ""; const go = ease(seg(a, 3.27, 4.78));
  DIG.forEach((d, i) => { const x = X30 + i * D3, y = f3(x), t0 = 0.3 + i * 0.03, u = a - t0;
    if (u < 0) { out += stick(x, Y3, y, 5); return; }
    const turn = clamp(u / 0.2), rise = easeOut(seg(u, 0.1, 0.7)), dy = lerp(y, 330 + 30 * Math.sin(i * 1.7), rise), lineX = lerp(x, 600 + i * 62, go), lineY = lerp(dy, 330, go);
    const fx = lineX + go * go * 520, sz = 74;
    out += (rise < 1 ? `<path d="M${x} ${Y3}V${lerp(y, Y3, rise).toFixed(1)}" stroke="${P.goldD}" stroke-width="6" opacity="${(1 - rise).toFixed(2)}"/>` : "")
      + at(fx, lineY, (turn < 1 ? disc(0, 0, 13 * (1 - turn) + 1, P.gold, P.goldD) : "") + (u < 0.4 ? rings(0, -20, 50, P.gold, 0.25) : "") + text(0, sz * 0.36, d, sz, P.gold), [1, Math.max(0.05, turn)]); });
  const g = bg(c, tot, 31) + layer(`<path d="M150 ${Y3}H1800" stroke="#3a3478" stroke-width="6" opacity="${(1 - flat).toFixed(2)}"/>` + wv + out, c);
  return { g, in: toScreen(c, X30 + 3 * D3, f3(X30 + 3 * D3)), inC: P.gold, inZ: 30, out: toScreen(c, 600 + 10 * 62, 330), outC: P.gold, outZ: 30 };
}

// ---- 4: the sieve: most of the numbers fall away, a small packet comes out ----
const SX = 760, SY = 600, COLS = 9, ROWS = 9;
const PILE = []; for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { const i = r * COLS + q; PILE.push({ x: SX + (q - (COLS - 1) / 2) * 50, y: SY - 50 - r * 50, d: String(Math.floor(rnd(i * 7 + 1) * 10)), keep: rnd(i * 13 + 5) > 0.84, tf: 1.06 + rnd(i * 3 + 2) * 2.0 }); }
const packet = (k = 1) => at(0, 0, `${two(rr(-90, -70, 180, 140, 18), P.cream, P.creamD, 0, 9)}<path d="${rr(-90, -14, 180, 28, 0)}" fill="${P.gold}"/><path d="${rr(-14, -70, 28, 140, 0)}" fill="${P.gold}"/>${disc(0, 0, 26, P.gold, P.goldD)}`, k);
const sieve = (shake) => at(SX + shake, SY, `<path d="M-300 0Q0 230 300 0Z" fill="#2c2766"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${-270 + i * 54} 0V${(170 * (1 - Math.pow((-270 + i * 54) / 300, 2))).toFixed(0)}" stroke="#8792bb" stroke-width="5"/>`).join("")}<path d="M-250 70Q0 110 250 70M-200 140Q0 175 200 140" stroke="#8792bb" stroke-width="5" fill="none"/><path d="${rr(-320, -14, 640, 28, 14)}" fill="${P.gold}"/><path d="M300 0L420 -40" stroke="${P.wood}" stroke-width="26" stroke-linecap="round"/>`);
function s4(a, tot) {
  const c = camAt(a, [[0, 800, 420, 1.18], [3.2, 820, 520, 1.12], [6.65, 960, 600, 1.08]]);
  const shake = a > 0.38 && a < 3.2 ? 10 * Math.sin(a * 38) * seg(a, 0.38, 0.6) : 0;
  const born = seg(a, 3.43, 3.8), slide = ease(seg(a, 4.04, 4.83)), px = lerp(SX, 1240, slide), py = lerp(880, 560, slide);
  let pile = "", dust = "";
  PILE.forEach((p, i) => { const sz = 44;
    if (p.keep) { const down = ease(seg(a, 2.6, 3.43)), x = lerp(p.x, SX, down), y = lerp(p.y, SY + 150, down);
      if (a < 3.5) pile += at(x + shake * 0.5, y, text(0, sz * 0.36, p.d, sz, P.gold), 1 - 0.6 * down); return; }
    const u = a - p.tf; if (u < 0) { pile += at(p.x + shake * 0.5, p.y, text(0, sz * 0.36, p.d, sz, P.cream)); return; }
    // falls, goes through the mesh and turns to dust
    const y = p.y + 900 * u * u + 160 * u; if (y > SY + 40) { const q = clamp((y - SY - 40) / 400); for (let k = 0; k < 3; k++) dust += `<circle cx="${(p.x + (k - 1) * 14 + 30 * Math.sin(i + k)).toFixed(1)}" cy="${(y + k * 10).toFixed(1)}" r="${(6 - 4 * q).toFixed(1)}" fill="#8a74c9" opacity="${(0.8 * (1 - q)).toFixed(2)}"/>`; }
    else pile += at(p.x, y, text(0, sz * 0.36, p.d, sz, P.cream)); });
  const glowK = a > 5.63 ? spring(a - 5.63, 7, 12) : 0;
  const pk = born > 0 ? at(px, py, (glowK > 0 ? rings(0, 0, 150 * glowK, P.gold, 0.25) : "") + packet(1), 1.3 * pop(a - 3.43)) : "";
  const g = bg(c, tot, 41) + layer(dust + sieve(shake) + pile + pk, c);
  return { g, in: toScreen(c, PILE[40].x, PILE[40].y), inC: P.gold, inZ: 30, out: toScreen(c, px, py), outC: P.cream, outZ: 20 };
}

// ---- 5: the packet goes into the phone, and the phone sends it into the air ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.06], [2.1, 960, 520, 0.92]]);
  const inP = ease(seg(a, 0, 0.45)), lit = a > 0.45 ? clamp(spring(a - 0.45, 8, 14)) : 0;
  const pk = inP < 1 ? at(lerp(560, 960, inP), lerp(620, 700, inP), packet(1), lerp(1.2, 0.3, inP)) : "";
  const ph = at(960, 980, bluePhone({ screen: mix("#9fe7ff", "#fff3c2", lit * 0.6) }), 2.2);
  const rr_ = a > 0.57 ? radio(960, 440, a - 0.57, 900, { n: 4, speed: 1.1, w: 14, k: seg(a, 0.57, 0.8) }) : "";
  const g = bg(c, tot, 51) + layer(skyline(9, -400, 2400, 1000, 140, 360, "#22195a", "#ffb066"), c, 0.5) + layer(`<rect x="-400" y="980" width="2800" height="300" fill="#141a45"/>` + rr_ + ph + pk, c);
  return { g, in: toScreen(c, 560, 620), inC: P.cream, inZ: 20 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const voiceSet = makeSet(SHOTS, [], P);
