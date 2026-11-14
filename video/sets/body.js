// "The electricity inside them" (electricity part 1): five shots with nothing to read but a year and a number.
//   0 a brain and a glowing nerve tree that runs to a glove; once the tree is lit, pulses run down it and the glove closes
//   1 a heart with its beat line: each spike of the line makes the heart squeeze
//   2 a stray zigzag of current strikes the beat line and scribbles it; the camera moves on to two phones on a calm call wave,
//     and a red shout bursts into the middle of it and breaks the wave (host right)
//   3 a night river: an eel swims through, flashes like a weapon; 2019, and its strike rolls up to 860 V
//   4 the eel beside Volta's pile of discs; the pile grows a fish tail, fins and an eye: a fake fish (host right)
// The file's own night (P from elec.js). The host is not in the sets; on beats 2 and 4 he leans in from the right, so the
// lower right corner (x > 1560, y > 480) stays empty.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, stars, electron, tagV, plate } from "./elec.js";
import { calPage } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const sky = () => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>`;
const RED = "#ff4d6a", REDD = "#d23250";

// ---- props of this scene ----
// a brain seen from the side (centre), 420 wide at k = 1
const brain = (glow = 0) => `${glow > 0 ? rings(0, 0, 250, "#ff9ec4", 0.18 * glow, 1.4) : ""}${two("M-200 40Q-230 -70 -150 -130Q-110 -200 -10 -190Q70 -230 140 -160Q230 -130 210 -30Q240 60 160 100Q120 150 40 120Q-20 160 -90 120Q-190 120 -200 40Z", "#ff9ec4", "#e06f9e", 14, 10)}
  <path d="M-150 -40Q-110 -90 -60 -60Q-20 -120 40 -90Q90 -130 130 -70M-160 40Q-100 0 -40 30Q20 -20 80 20Q130 -10 180 30M-60 -150Q-40 -110 -70 -80M60 -170Q70 -130 40 -100M-20 60Q0 90 -30 110M110 60Q100 90 130 100" fill="none" stroke="#c4527f" stroke-width="12" stroke-linecap="round"/>
  <path d="M60 110Q70 170 50 220" fill="none" stroke="#e06f9e" stroke-width="40" stroke-linecap="round"/>`;
// a glove (the hand without a person), wrist on the left, fingers to the right; grip 0..1 curls the fingers
const glove = (grip = 0, c = "#f3e6c8", cD = "#d9c7a0") => { const f = (y, len, k) => { const bend = grip * (k ? 70 : 90); return `<path d="M60 ${y}h${len * (1 - 0.45 * grip)}" stroke="${cD}" stroke-width="46" stroke-linecap="round" transform="rotate(${bend.toFixed(1)} 60 ${y})"/><path d="M60 ${y - 6}h${len * (1 - 0.45 * grip)}" stroke="${c}" stroke-width="32" stroke-linecap="round" transform="rotate(${bend.toFixed(1)} 60 ${y})"/>`; };
  return `${two(rr(-170, -40, 120, 80, 18), "#2f8fb0", "#1f6d8c", 0, 8)}${f(-62, 110, 0)}${f(-20, 130, 0)}${f(22, 124, 0)}${f(62, 100, 1)}${two("M-60 -90Q60 -100 80 -60V70Q60 100 -60 90Z", c, cD, 0, 10)}<path d="M-10 -80Q-60 -150 -110 -150" stroke="${cD}" stroke-width="44" stroke-linecap="round" transform="rotate(${(grip * 30).toFixed(1)} -10 -80)"/>`; };
// a heart (centre), about 440 wide at k = 1; beat 0..1 squeezes it
const heart = (beat = 0) => { const k = 1 - 0.12 * beat; return at(0, 0, `${two("M0 170C-120 90 -230 10 -230 -90C-230 -170 -160 -210 -100 -210C-50 -210 -15 -180 0 -140C15 -180 50 -210 100 -210C160 -210 230 -170 230 -90C230 10 120 90 0 170Z", RED, REDD, 16, 12)}
  <path d="M-150 -120Q-160 -60 -120 -20" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".3"/><path d="M40 -150Q60 -250 120 -260M-20 -170Q-30 -240 -60 -270" fill="none" stroke="${REDD}" stroke-width="34" stroke-linecap="round"/>`, [k, k * (1 + 0.04 * beat)]); };
// a heartbeat trace from x0 to x1 at baseline y: spikes at the given x positions; drawn up to `head`; o.noise scribbles it
const trace = (x0, x1, y, spikes, head, o = {}) => { let d = `M${x0} ${y}`; const step = 6, noise = o.noise || 0;
  for (let x = x0 + step; x <= Math.min(head, x1); x += step) { let yy = y; for (const s of spikes) { const u = x - s; if (u > -30 && u < 60) yy += u < 0 ? 10 * (u + 30) / 30 : u < 12 ? -170 * (u / 12) : u < 30 ? lerp(-170, 120, (u - 12) / 18) : lerp(120, 0, (u - 30) / 30); }
    if (noise > 0) { const n = (rnd(Math.floor(x / step) * 13 + (o.seed || 0)) - 0.5) * 2; if (x > (o.nx || -1e9)) yy += n * 140 * noise; }
    d += `L${x} ${yy.toFixed(1)}`; }
  const col = o.c || "#5dffb0", hx = Math.min(head, x1);
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round" opacity=".25"/><path d="${d}" fill="none" stroke="${col}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>${head > x0 && head < x1 ? rings(hx, y, 20, col, 0.4) + `<circle cx="${hx}" cy="${y}" r="10" fill="#eafff4"/>` : ""}`; };
// a phone standing up (centre), 200 x 380; screen colour c
const phone = (c = "#5fd6ff") => `${two(rr(-100, -190, 200, 380, 34), "#1d2c44", "#101a2c", 10, 0)}<path d="${rr(-82, -162, 164, 300, 14)}" fill="${c}"/><circle cy="160" r="12" fill="#3a4c6a"/><path d="${rr(-30, -178, 60, 8, 4)}" fill="#3a4c6a"/>`;
// a shout: a red spiky burst (centre), r at k = 1
const shout = (r = 120, t = 0) => { let d = ""; const n = 12; for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr2 = i % 2 ? r * (0.62 + 0.06 * Math.sin(t * 20 + i)) : r; d += `${i ? "L" : "M"}${(Math.cos(a) * rr2).toFixed(1)} ${(Math.sin(a) * rr2).toFixed(1)}`; }
  return `${two(d + "Z", "#ff4d5a", "#d93544", 0, 8)}<path d="M-38 -40L-10 30M10 -46L20 30M44 -36L40 26" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`; };
// an eel (centre of its body) facing right, length L; t makes it swim; flash 0..1 lights it up
const eel = (t, L = 900, flash = 0) => { const pts = []; for (let i = 0; i <= 24; i++) { const p = i / 24, x = lerp(-L / 2, L / 2, p), y = Math.sin(t * 4 - p * 6) * 40 * (1 - 0.6 * p); pts.push([x, y]); }
  const d = "M" + pts.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join("L"), h = pts[24];
  const body = mix("#3a7a5a", "#bfffe8", flash * 0.6), bodyD = mix("#24563e", "#6fe0b8", flash * 0.6);
  return `${flash > 0 ? rings(0, 0, L * 0.55, "#9ffff0", 0.14 * flash, 1.25) + Array.from({ length: 8 }, (_, i) => { const q = pts[3 + i * 2]; return `<path d="M${q[0]} ${q[1] - 50}l${(rnd(i) - 0.5) * 40} -40l20 10l${(rnd(i + 9) - 0.5) * 40} -50" fill="none" stroke="${E.spark}" stroke-width="7" stroke-linejoin="round" opacity="${(flash * (0.5 + 0.5 * Math.sin(t * 30 + i))).toFixed(2)}"/>`; }).join("") : ""}
    <path d="${d}" fill="none" stroke="${bodyD}" stroke-width="150" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${body}" stroke-width="116" stroke-linecap="round" transform="translate(-4 -8)"/>
    <path d="${d}" fill="none" stroke="#d9b45a" stroke-width="14" stroke-linecap="round" transform="translate(0 44)" opacity=".75"/>
    <circle cx="${h[0] - 6}" cy="${h[1] - 14}" r="18" fill="#fff"/><circle cx="${h[0] - 2}" cy="${h[1] - 14}" r="10" fill="${P.ink}"/><path d="M${h[0] - 10} ${h[1] + 14}h34" stroke="${bodyD}" stroke-width="7" stroke-linecap="round"/>`; };
// Volta's pile (base on y = 0): discs of copper and zinc with brown cloth between, n discs; fish 0..1 grows a tail, fins and an eye
const pile = (n = 12, fish = 0, t = 0) => { let s = `<path d="${rr(-120, -20, 240, 20, 6)}" fill="${P.woodD}"/>`; for (let i = 0; i < n; i++) { const y = -20 - i * 36, c = i % 3 === 0 ? [E.cu, E.cuD] : i % 3 === 1 ? ["#c9d2e6", "#9aa6c4"] : ["#9a6a44", "#7a4e30"];
    s += two(rr(-100, y - 30, 200, 30, 12), c[0], c[1], 0, 7); }
  const top = -20 - n * 36, rods = `<path d="M-130 0V${top - 30}M130 0V${top - 30}" stroke="${P.woodD}" stroke-width="16"/><path d="${rr(-140, top - 50, 280, 22, 8)}" fill="${P.wood}"/>`;
  if (fish <= 0) return rods + s;
  const f = pop(fish), turn = ease(clamp(fish / 0.5)), wag = 14 * Math.sin(t * 6), cy = top / 2;
  const tail = at(0, top - 40, two(`M0 0L-140 ${-170 + wag}L0 -80L140 ${-170 - wag}Z`, "#3a9a6a", "#24663e", 0, 8), f);
  const fins = [-1, 1].map((d) => at(d * 150, cy, two(`M0 -60L${d * 150} ${-20 + wag * d}L0 60Z`, "#3a9a6a", "#24663e", 0, 6), f)).join("");
  const eye = at(0, -90, `<circle r="38" fill="#fff"/><circle cx="10" r="19" fill="${P.ink}"/>`, f);
  return `<g transform="rotate(${(-90 * turn).toFixed(2)} 0 ${cy})">${tail + fins + rods + s + eye}</g>`; };

// ---- 0: the nerves carry orders ----
const BR = [520, 440], GL = [1520, 640];
const NERVE = (p) => bez([BR[0] + 70, BR[1] + 210], [960, 900], [GL[0] - 190, GL[1]], p);
function s0(a, tot) {
  const c = camAt(a, [[0, 600, 470, 1.35], [1.9, 700, 500, 1.15], [4.0, 960, 540, 1.0], [6.98, 960, 540, 1.03]]);
  const grow = ease(seg(a, 1.97, 3.6)), lit = seg(a, 3.47, 3.9);
  // the tree: the main trunk and side branches, drawn as it grows
  let tree = ""; const trunk = Array.from({ length: 41 }, (_, i) => NERVE(i / 40)), d = "M" + trunk.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join("L");
  const ncol = mix("#2f8fb0", "#ffe08a", lit);
  tree += drawn(d, grow, ncol, 50, 'opacity=".3"') + drawn(d, grow, ncol, 20);
  for (let i = 1; i < 8; i++) { const p = i / 8, q = NERVE(p), side = i % 2 ? -1 : 1, bd = `M${q[0].toFixed(1)} ${q[1].toFixed(1)}l${(side * 70).toFixed(0)} ${(side * 90 - 40).toFixed(0)}l${(side * 30 + 40).toFixed(0)} ${(side * 50).toFixed(0)}`;
    tree += drawn(bd, seg(grow, p, p + 0.25), ncol, 13); }
  // pulses from the brain to the glove on «بنبضات»; each one makes the glove close
  const T = [4.13, 4.9, 5.72, 6.3], pulses = T.map((t0) => { const u = (a - t0) / 0.75; if (u < 0 || u > 1) return ""; const q = NERVE(easeIn(u) * 0.6 + u * 0.4); return at(q[0], q[1], rings(0, 0, 40, "#fff3b0", 0.4) + `<circle r="18" fill="#fff8d8"/>`); }).join("");
  const grip = T.reduce((g, t0) => { const u = a - t0 - 0.75; return u > 0 && u < 0.5 ? Math.max(g, Math.sin(Math.PI * u / 0.5)) : g; }, 0);
  const b = at(BR[0], BR[1], brain(clamp(lit + 0.6 * T.reduce((g, t0) => (a > t0 && a < t0 + 0.25 ? 1 : g), 0))), 1.1 * pop(a - 0.05, 7, 12));
  const g = sky() + layer(stars(31, 70, -300, 2300, 800, tot), c, 0.2) + layer(tree + b + at(GL[0], GL[1], glove(grip), 1.7 * pop(a - 1.97)) + pulses, c);
  return { g, out: toScreen(c, GL[0] - 100, GL[1]), outC: "#fff3b0", outZ: 16 };
}

// ---- 1: each beat is a pulse ----
const HC = [960, 400], BL = 870, X0 = 60, X1 = 1860, SPD = 640;   // the trace head moves SPD px a second
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.12], [3.03, 960, 530, 1.02]]);
  const T = [0.99, 1.63, 2.6], head = X0 + 300 + a * SPD, spikes = T.map((t) => X0 + 300 + t * SPD);
  const beat = T.reduce((b, t) => { const u = a - t - 0.04; return u > 0 && u < 0.4 ? Math.max(b, Math.sin(Math.PI * u / 0.4)) : b; }, 0);
  const g = sky() + layer(stars(37, 60, -200, 2200, 700, tot), c, 0.2) + layer(`<path d="M-200 ${BL}H2200" stroke="#0f3a55" stroke-width="4"/>` + rings(HC[0], HC[1], 300, RED, 0.08 + 0.12 * beat, 1.3) + at(HC[0], HC[1], heart(beat), pop(a, 7, 12)) + trace(X0, X1, BL, spikes, head), c);
  return { g, in: toScreen(c, HC[0], HC[1]), inC: "#fff3b0", inZ: 16, out: toScreen(c, HC[0], HC[1]), outC: RED, outZ: 12 };
}

// ---- 2: a stray current scrambles the beat; like a shout in a call ----
function s2(a, tot) {
  const c = camAt(a, [[0, 820, 520, 1.0], [2.85, 840, 520, 1.0], [3.4, 2960, 520, 1.0], [4.61, 2980, 520, 1.03]]);
  const HX = [640, 360], Y = 780, head = 120 + a * 420, spikes = [220, 560, 900].filter((x) => x < 120 + 1.55 * 420);
  const hit = a - 0.27, bp = clamp(hit / 0.3), noise = clamp((a - 1.55) / 0.4), shake = noise > 0 ? 10 * Math.sin(a * 60) * noise : 0;
  const zig = hit > 0 ? at(0, 0, `<path d="M-40 120L200 220L120 300L420 420L320 520L640 ${Y - 20}" fill="none" stroke="${E.warn}" stroke-width="30" stroke-linejoin="round" pathLength="1" stroke-dasharray="${bp.toFixed(3)} 1" opacity=".35"/><path d="M-40 120L200 220L120 300L420 420L320 520L640 ${Y - 20}" fill="none" stroke="#fff3b0" stroke-width="11" stroke-linejoin="round" pathLength="1" stroke-dasharray="${bp.toFixed(3)} 1"/>`) + (bp >= 1 ? rings(640, Y - 20, 80 * (1 - seg(a, 0.6, 1.2)) + 30, E.warn, 0.3) : "") : "";
  const beat = noise > 0 ? 0.5 + 0.5 * Math.sin(a * 37) * noise : 0;
  const left = at(HX[0] + shake, HX[1], heart(beat), 0.95) + trace(80, 1440, Y, [220, 560, 900], Math.min(head, 1440), { noise, nx: 640, seed: Math.floor(a * 12), c: mix("#5dffb0", "#ff6a7a", noise) }) + zig;
  // the call: two phones and a calm wave between them; a shout drops into the middle on «يزعّق»
  const CX = 2960, sh = a - 3.62, broke = clamp(sh / 0.25);
  let wave = `M${CX - 420} 420`; for (let x = CX - 420; x <= CX + 420; x += 10) { const u = (x - CX) / 420, calm = 40 * Math.sin(x / 30 - a * 8), wild = (rnd(Math.floor(x / 10) + Math.floor(a * 14) * 97) - 0.5) * 300 * Math.exp(-u * u * 4); wave += `L${x} ${(420 + calm * (1 - broke) + wild * broke).toFixed(1)}`; }
  const call = at(CX - 560, 420, phone(), 1.15) + at(CX + 560, 420, phone(), 1.15) + `<path d="${wave}" fill="none" stroke="${mix("#5fd6ff", "#ff6a7a", broke)}" stroke-width="12" stroke-linejoin="round"/>` + (sh > 0 ? at(CX, 420, shout(140, a), pop(sh, 8, 14)) : "");
  const g = sky() + layer(stars(41, 120, -300, 4200, 800, tot), c, 0.2) + layer(left + call, c);
  return { g, in: toScreen(c, HX[0], HX[1]), inC: RED, inZ: 12, out: toScreen(c, CX, 420), outC: "#062033", outZ: 16 };
}

// ---- 3–4: the river and the eel ----
const SURF = 230;
const river = (c, tot, extra) => { const water = `<rect x="-1000" y="${SURF}" width="5000" height="1400" fill="#0a3550"/><rect x="-1000" y="${SURF + 420}" width="5000" height="1200" fill="#072a40"/><rect x="-1000" y="${SURF + 760}" width="5000" height="900" fill="#05202f"/>
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${-600 + i * 520 + (tot * 30) % 520} ${SURF + 8}h160" stroke="#5fd6ff" stroke-width="6" stroke-linecap="round" opacity=".35"/>`).join("")}`;
  const reeds = Array.from({ length: 22 }, (_, i) => { const x = -600 + i * 190 + rnd(i) * 80, h = 160 + rnd(i + 5) * 200, sw = 18 * Math.sin(tot * 1.2 + i); return `<path d="M${x} 1100Q${x + sw} ${1100 - h / 2} ${x + sw * 2} ${1100 - h}" fill="none" stroke="#0e4a3c" stroke-width="22" stroke-linecap="round"/>`; }).join("");
  const bubbles = Array.from({ length: 10 }, (_, i) => { const q = (tot * 0.25 + i / 10) % 1; return `<circle cx="${-200 + i * 330 + 20 * Math.sin(tot + i)}" cy="${1000 - q * 760}" r="${6 + (i % 3) * 4}" fill="none" stroke="#9fe7ff" stroke-width="3" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("");
  return sky() + layer(stars(43, 50, -400, 2400, 220, tot) + `<circle cx="260" cy="110" r="54" fill="${P.cream}"/>`, c, 0.15) + layer(water + bubbles + reeds + extra, c); };
function s3(a, tot) {
  const c = camAt(a, [[0, 900, 560, 1.05], [2.0, 960, 560, 1.0], [5.6, 960, 540, 1.0], [7.2, 960, 520, 1.06]]);
  const ex = lerp(-800, 760, easeOut(seg(a, 0, 3.4))), flash = a > 1.37 ? Math.max(Math.exp(-(a - 1.37) * 3) * (0.6 + 0.4 * Math.sin(a * 40)), 0) : 0, strike = a > 6.5 ? Math.exp(-(a - 6.5) * 2.5) : 0;
  const cal = at(1380, 210, calPage("2019", "", 0.9, 150), pop(a - 4.45));
  const v = Math.round(lerp(0, 860, ease(seg(a, 5.8, 6.7)))), tag = a > 5.75 ? at(1380, 470, rings(0, 0, 140 * (0.6 + 0.4 * strike), E.warn, 0.2 * strike) + tagV(String(v), "V", { size: 110 }), pop(a - 5.75)) : "";
  const g = river(c, tot, at(ex, 720, eel(tot, 1100, Math.max(flash, strike))) + cal + tag);
  return { g, in: toScreen(c, 960, 540), inC: "#062033", inZ: 16 };
}
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.06], [2.6, 900, 520, 1.0], [5.71, 900, 500, 1.03]]);
  const pair = a > 2.12 ? Math.exp(-(a - 2.12) * 2) : 0, fish = a - 4.6;
  const pl = at(1180, 920, (pair > 0 ? rings(0, -260, 280, "#9ffff0", 0.18 * pair, 1.2) : "") + pile(12, fish > 0 ? fish : 0, tot), 1.2 * pop(a - 0.3, 7, 12));
  const name = at(1180, 120, plate("VOLTA", 70), pop(a - 0.46));
  const link = pair > 0 ? `<path d="M760 640Q960 480 1060 560" fill="none" stroke="${E.spark}" stroke-width="8" stroke-dasharray="14 14" opacity="${pair.toFixed(2)}"/>` : "";
  const g = river(c, tot, at(330, 640, eel(tot, 760, pair)) + link + pl + name);
  return { g };
}

const SHOTS = [s0, s1, s2, s3, s4];
export const bodySet = makeSet(SHOTS, [], P);
