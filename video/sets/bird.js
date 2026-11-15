// "The bird on the wire" (electricity part 2 of 4): four shots, no people; the bird is never hurt.
//   0 a small bird lands on a bare wire, calm; a "?" pops over it
//   1 close: both feet on the same wire; a gauge under each foot reads the same; the electrons run along the wire under it, none go up its legs
//   2 two wires: a twig falls across both; a red flash runs through the twig and it smokes; the bird hops away to safety
//   3 pull back: tall pylons, the wires hung far apart and far from the trees; the gaps glow as bands of air
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { hills } from "./props.js";
import { P, E, mix, stars, pop, pylon, pylonTips, span, gauge, electron, spark } from "./elec.js";
import { V } from "./bird.v.js";

const sky = (c, tot, seed = 7) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 90, -1400, 3400, 900, tot), c, 0.12);
// a small round bird (feet at y = 0), facing right; flap 0..1 opens the wing, look turns the eye
export const birdie = (t = 0, flap = 0, o = {}) => { const bob = o.still ? 0 : 3 * Math.sin(t * 3), wing = lerp(10, -70, flap);
  return `<path d="M-14 0V-34M14 0V-34" stroke="#ff9f3c" stroke-width="7" stroke-linecap="round"/><path d="M-24 0H-4M4 0H24" stroke="#ff9f3c" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(0 ${bob.toFixed(1)})">${two("M-70 -80Q-80 -150 -10 -160Q60 -168 70 -110Q76 -60 30 -40Q-40 -30 -70 -80Z", "#ffd04a", P.goldD, 0, 8)}<path d="M-70 -90L-120 -70L-74 -60Z" fill="${P.goldD}"/>
    <path d="M58 -128L92 -118L58 -108Z" fill="#ff8a3c"/><circle cx="38" cy="-128" r="11" fill="#fff"/><circle cx="${41 + (o.look || 0) * 3}" cy="-128" r="6" fill="${P.ink}"/>
    <g transform="rotate(${wing.toFixed(1)} -20 -100)">${two("M-50 -110Q-10 -130 30 -96Q0 -60 -50 -80Z", "#f0b020", "#c98a10", 0, 6)}</g></g>`; };
const wireY = 600;

// ---- 0: the bird lands; "?" ----
function b0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.1], [2.5, 960, 470, 1.45], [5.26, 960, 450, 1.55]]);
  const land = ease(seg(a, 1.5, 2.3)), bx = lerp(-200, 960, land), by = lerp(150, wireY, land) - 60 * Math.sin(Math.PI * land), flap = land < 1 ? 0.5 + 0.5 * Math.sin(tot * 22) : 0;
  const q = a > 4.04 ? at(1110, wireY - 330, `${rings(0, -30, 70, P.gold, 0.2)}${text(0, 10, "?", 130, P.gold)}`, pop(a - 4.04)) : "";
  const g = sky(c, tot, 3) + layer(hills(61, -900, 3200, 860, 160, E.hill), c, 0.5) + layer(`<rect x="-900" y="860" width="3800" height="600" fill="${P.ground}"/><path d="M-900 ${wireY}H2900" stroke="#9fb3c8" stroke-width="10"/>`
    + (a > 1.4 ? at(bx, by, birdie(tot, flap), 1.8) : "") + q, c);
  return { g, out: toScreen(c, 960, wireY - 120), outC: "#ffd04a", outZ: 14 };
}
// ---- 1: same wire, same pressure, no current through the bird ----
function b1(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [8.66, 960, 520, 1.04]]), WY = 560;
  const els = Array.from({ length: 16 }, (_, i) => { const q = ((tot * 0.35 + i / 16) % 1); return at(-100 + q * 2200, WY, electron(14, { sign: false })); }).join("");
  const g1 = a > 3.0 ? at(700, WY + 260, gauge(0.62, { mark: "V" }), 1.5 * pop(a - 3.0)) : "", g2 = a > 3.3 ? at(1220, WY + 260, gauge(0.62, { mark: "V" }), 1.5 * pop(a - 3.3)) : "";
  const same = a > 6.43 ? at(960, WY + 260, text(0, 40, "=", 160, P.gold), pop(a - 6.43)) : "";
  const leg = a > 7.49 ? cross(1250, WY - 220, 50, P.red, a - 7.49) + `<path d="M1170 ${WY - 30}V${WY - 180}" stroke="${P.red}" stroke-width="8" stroke-dasharray="14 12" opacity=".7"/><path d="M1150 ${WY - 170}L1170 ${WY - 200}L1190 ${WY - 170}Z" fill="${P.red}" opacity=".7"/>` : "";
  const feet = a > 0.3 ? [760, 1160].map((x, i) => rings(x, WY, 46, P.gold, 0.25 * seg(a, 0.34 + i * 0.3, 0.6 + i * 0.3), 1.3)).join("") : "";
  const g = sky(c, tot, 5) + layer(`<path d="M-900 ${WY}H2900" stroke="#9fb3c8" stroke-width="22"/>` + els + feet + at(960, WY - 6, birdie(tot, 0, { still: 1 }), 2.6) + g1 + g2 + same + leg, c);
  return { g, in: [960, 400], inC: "#ffd04a" };
}
// ---- 2: two wires and a twig: the twig is the path (the bird flies off) ----
function b2(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.35], [4.6, 960, 560, 1.45]]), W1 = 420, W2 = 700;
  const off = ease(seg(a, 0.4, 1.2)), bx = lerp(760, 2100, off), by = lerp(W1, 60, off) - 40 * Math.sin(Math.PI * off);
  const fall = easeIn(seg(a, 0.71, 1.7)), tw = lerp(-260, 0, fall), touch = seg(a, 2.26, 2.45), flash = touch > 0 ? Math.max(0, 1 - (a - 2.45) / 1.6) : 0;
  const twig = at(960, lerp(W1 - 420, W1 + (W2 - W1) / 2, fall), `<path d="M-40 -200L40 200M10 -60L80 -110M-10 70L-90 110" stroke="${mix("#8a5a30", "#3a2a20", seg(a, 3.0, 3.8))}" stroke-width="18" stroke-linecap="round"/>`, 1, lerp(-30, 12, fall));
  const zap = flash > 0 ? spark([945, W1], [975, W2], 1, 5) + rings(960, (W1 + W2) / 2, 120, P.red, 0.3 * flash, 1.5) : "";
  const smoke = a > 3.55 ? [0, 1, 2].map((i) => { const q = ((tot * 0.5 + i / 3) % 1); return `<circle cx="${960 + 20 * Math.sin(tot + i)}" cy="${(W1 + 140 - q * 240).toFixed(0)}" r="${(16 + q * 30).toFixed(0)}" fill="#7b8a96" opacity="${(0.4 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const g = sky(c, tot, 9) + layer(`<path d="M-900 ${W1}H2900M-900 ${W2}H2900" stroke="#9fb3c8" stroke-width="12"/>` + twig + zap + smoke + at(bx, by, birdie(tot, off > 0 && off < 1 ? 0.5 + 0.5 * Math.sin(tot * 22) : 0), 1.1), c);
  return { g, in: [960, 540], inC: P.night1 };
}
// ---- 3: tall towers, wires far apart, the air between them ----
function b3(a, tot) {
  const c = camAt(a, [[0, 960, 420, 1.5], [1.9, 960, 560, 1.0], [6.66, 960, 560, 0.97]]), G = 1000, H = 760;
  const tips = pylonTips(H), xs = [300, 1620];
  const wires = tips.map(([tx, ty]) => span([xs[0] + tx, G + ty + H * 0.06], [xs[1] + tx, G + ty + H * 0.06], 30, "#9fb3c8", 6)).join("");
  const bands = a > 5.05 ? [[0, 2], [1, 2]].map(([i, j]) => { const y1 = G + tips[i][1] + H * 0.06 + 40, y2 = G + tips[j][1] + H * 0.06 + 40; return `<rect x="${xs[0] + 200}" y="${Math.min(y1, y2) + 10}" width="${xs[1] - xs[0] - 400}" height="${Math.abs(y1 - y2) - 20}" fill="${E.el}" opacity="${(0.12 * seg(a, 5.05, 5.6)).toFixed(3)}"/>`; }).join("") + at(960, G + tips[2][1] + 230, text(0, 0, "AIR", 64, E.el, { opacity: seg(a, 5.4, 5.8).toFixed(2) }), 1) : "";
  const trees = [[700, 0.95], [1240, 1.1]].map(([x, k]) => at(x, G, `<path d="M-14 0V-120" stroke="${P.woodD}" stroke-width="28"/>${two("M0 -360L120 -110H-120Z", "#1f6b55", "#155040", 0, 8)}`, k)).join("");
  const g = sky(c, tot, 13) + layer(hills(71, -900, 3200, G - 80, 160, E.hill), c, 0.5) + layer(`<rect x="-900" y="${G}" width="3800" height="700" fill="${P.ground}"/>` + trees + xs.map((x) => at(x, G, pylon(H))).join("") + wires + bands + at(xs[0] + tips[1][0] + 220, G + tips[1][1] + H * 0.06 - 4, birdie(tot, 0), 0.45), c);
  return { g, in: [960, 540], inC: P.night1 };
}

const SHOTS = [b0, b1, b2, b3];
export const birdSet = makeSet(SHOTS, V, P);
export { b0, b1, b2, b3, sky };
