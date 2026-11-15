// "Electricity inside them" in portrait (1080 x 1920), for the Short "fish". Every shot is drawn for the tall frame:
//   0 the brain at the top, the nerve running down, the glove at the bottom (fingers down); pulses run down and it grips
//   1 the heart above its beat line (the landscape shot through a closer camera)
//   2 the heart and its line at the top, the zigzag scrambles it; the camera goes DOWN to the call: one phone above the
//     other, the wave running between them, the shout bursting in the middle
//   3 the river, tall: the eel swims in low, 2019 and the 860 V tag above it
//   4 VOLTA at the top, the eel across the middle, the pile below; the pile grows its tail and fins
import { clamp, lerp, ease, easeOut, easeIn, seg, rnd, kf, bez, camAt, layer, toScreen, rings, drawn, at, FW, FH } from "./kit.js";
import { P, E, mix, stars, tagV, plate } from "./elec.js";
import { calPage } from "./props.js";
import { pop, sky, RED, brain, glove, heart, trace, phone, shout, eel, pile } from "./body.js";

// ---- 0: brain above, glove below ----
const BR = [540, 480], GL = [560, 1380];
const NERVE = (p) => bez([BR[0] + 60, BR[1] + 230], [820, 900], [GL[0], GL[1] - 260], p);
function v0(a, tot) {
  const c = camAt(a, [[0, 540, 600, 1.3], [1.9, 540, 760, 1.08], [4.0, 540, 920, 1.0], [6.98, 540, 920, 1.02]]);
  const grow = ease(seg(a, 1.97, 3.6)), lit = seg(a, 3.47, 3.9), ncol = mix("#2f8fb0", "#ffe08a", lit);
  const trunk = Array.from({ length: 41 }, (_, i) => NERVE(i / 40)), d = "M" + trunk.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join("L");
  let tree = drawn(d, grow, ncol, 50, 'opacity=".3"') + drawn(d, grow, ncol, 20);
  for (let i = 1; i < 8; i++) { const p = i / 8, q = NERVE(p), side = i % 2 ? -1 : 1, bd = `M${q[0].toFixed(1)} ${q[1].toFixed(1)}l${(side * 90).toFixed(0)} ${(side * 30 + 50).toFixed(0)}l${(side * 50).toFixed(0)} ${(60).toFixed(0)}`;
    tree += drawn(bd, seg(grow, p, p + 0.25), ncol, 13); }
  const T = [4.13, 4.9, 5.72, 6.3], pulses = T.map((t0) => { const u = (a - t0) / 0.75; if (u < 0 || u > 1) return ""; const q = NERVE(easeIn(u) * 0.6 + u * 0.4); return at(q[0], q[1], rings(0, 0, 40, "#fff3b0", 0.4) + `<circle r="18" fill="#fff8d8"/>`); }).join("");
  const grip = T.reduce((g, t0) => { const u = a - t0 - 0.75; return u > 0 && u < 0.5 ? Math.max(g, Math.sin(Math.PI * u / 0.5)) : g; }, 0);
  const b = at(BR[0], BR[1], brain(clamp(lit + 0.6 * T.reduce((g, t0) => (a > t0 && a < t0 + 0.25 ? 1 : g), 0))), 1.1 * pop(a - 0.05, 7, 12));
  const gl = at(GL[0], GL[1], at(0, 0, glove(grip), 1, 90), 1.6 * pop(a - 1.97));
  const g = sky() + layer(stars(31, 90, -400, 1500, 2200, tot), c, 0.2) + layer(tree + b + gl + pulses, c);
  return { g, out: toScreen(c, GL[0], GL[1] + 60), outC: "#fff3b0", outZ: 16 };
}

// ---- 2: the scrambled beat, then the call, one phone above the other ----
function v2(a, tot) {
  const c = camAt(a, [[0, 540, 760, 1.0], [2.85, 540, 780, 1.0], [3.4, 540, 2500, 1.0], [4.61, 540, 2500, 1.03]]);
  const Y = 1000, head = 40 + a * 300, spikes = [140, 380, 620].filter((x) => x < 40 + 1.55 * 300);
  const hit = a - 0.27, bp = clamp(hit / 0.3), noise = clamp((a - 1.55) / 0.4), shake = noise > 0 ? 10 * Math.sin(a * 60) * noise : 0;
  const zd = `M60 260L300 380L200 470L520 600L420 720L740 ${Y - 20}`;
  const zig = hit > 0 ? `<path d="${zd}" fill="none" stroke="${E.warn}" stroke-width="30" stroke-linejoin="round" pathLength="1" stroke-dasharray="${bp.toFixed(3)} 1" opacity=".35"/><path d="${zd}" fill="none" stroke="#fff3b0" stroke-width="11" stroke-linejoin="round" pathLength="1" stroke-dasharray="${bp.toFixed(3)} 1"/>` + (bp >= 1 ? rings(740, Y - 20, 80 * (1 - seg(a, 0.6, 1.2)) + 30, E.warn, 0.3) : "") : "";
  const beat = noise > 0 ? 0.5 + 0.5 * Math.sin(a * 37) * noise : 0;
  const top = at(540 + shake, 560, heart(beat), 0.85) + trace(20, 1060, Y, spikes, Math.min(head, 1060), { noise, nx: 740, seed: Math.floor(a * 12), c: mix("#5dffb0", "#ff6a7a", noise) }) + zig;
  // the call, running down the frame
  const CY = 2500, sh = a - 3.62, broke = clamp(sh / 0.25);
  let wave = `M540 ${CY - 380}`; for (let y = CY - 380; y <= CY + 380; y += 10) { const u = (y - CY) / 380, calm = 40 * Math.sin(y / 30 - a * 8), wild = (rnd(Math.floor(y / 10) + Math.floor(a * 14) * 97) - 0.5) * 300 * Math.exp(-u * u * 4); wave += `L${(540 + calm * (1 - broke) + wild * broke).toFixed(1)} ${y}`; }
  const call = at(540, CY - 560, phone(), 1.0) + at(540, CY + 560, phone(), 1.0) + `<path d="${wave}" fill="none" stroke="${mix("#5fd6ff", "#ff6a7a", broke)}" stroke-width="12" stroke-linejoin="round"/>` + (sh > 0 ? at(540, CY, shout(150, a), pop(sh, 8, 14)) : "");
  const g = sky() + layer(stars(41, 140, -400, 1500, 3600, tot), c, 0.2) + layer(top + call, c);
  return { g, in: toScreen(c, 540, 560), inC: RED, inZ: 12, out: toScreen(c, 540, CY), outC: "#062033", outZ: 16 };
}

// ---- 3–4: the river, tall ----
const SURF = 380, BED = 1760;
const river = (c, tot, extra) => { const water = `<rect x="-1000" y="${SURF}" width="3200" height="2400" fill="#0a3550"/><rect x="-1000" y="${SURF + 600}" width="3200" height="2000" fill="#072a40"/><rect x="-1000" y="${SURF + 1100}" width="3200" height="1600" fill="#05202f"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${-400 + i * 360 + (tot * 30) % 360} ${SURF + 8}h140" stroke="#5fd6ff" stroke-width="6" stroke-linecap="round" opacity=".35"/>`).join("")}`;
  const reeds = Array.from({ length: 14 }, (_, i) => { const x = -300 + i * 130 + rnd(i) * 60, h = 180 + rnd(i + 5) * 260, sw = 18 * Math.sin(tot * 1.2 + i); return `<path d="M${x} ${BED}Q${x + sw} ${BED - h / 2} ${x + sw * 2} ${BED - h}" fill="none" stroke="#0e4a3c" stroke-width="22" stroke-linecap="round"/>`; }).join("");
  const bubbles = Array.from({ length: 10 }, (_, i) => { const q = (tot * 0.25 + i / 10) % 1; return `<circle cx="${-100 + i * 130 + 20 * Math.sin(tot + i)}" cy="${BED - 100 - q * 1200}" r="${6 + (i % 3) * 4}" fill="none" stroke="#9fe7ff" stroke-width="3" opacity="${(0.5 * (1 - q)).toFixed(2)}"/>`; }).join("");
  return sky() + layer(stars(43, 60, -400, 1500, 360, tot) + `<circle cx="860" cy="170" r="54" fill="${P.cream}"/>`, c, 0.15) + layer(water + bubbles + reeds + extra, c); };
function v3(a, tot) {
  const c = camAt(a, [[0, 520, 980, 1.04], [2.0, 540, 960, 1.0], [5.6, 540, 940, 1.0], [7.2, 540, 920, 1.05]]);
  const ex = lerp(-800, 540, easeOut(seg(a, 0, 3.4))), flash = a > 1.37 ? Math.max(Math.exp(-(a - 1.37) * 3) * (0.6 + 0.4 * Math.sin(a * 40)), 0) : 0, strike = a > 6.5 ? Math.exp(-(a - 6.5) * 2.5) : 0;
  const cal = at(300, 640, calPage("2019", "", 0.9, 150), pop(a - 4.45));
  const v = Math.round(lerp(0, 860, ease(seg(a, 5.8, 6.7)))), tag = a > 5.75 ? at(700, 680, rings(0, 0, 140 * (0.6 + 0.4 * strike), E.warn, 0.2 * strike) + tagV(String(v), "V", { size: 110 }), pop(a - 5.75)) : "";
  const g = river(c, tot, at(ex, 1180, eel(tot, 900, Math.max(flash, strike))) + cal + tag);
  return { g, in: toScreen(c, 540, 960), inC: "#062033", inZ: 16 };
}
function v4(a, tot) {
  const c = camAt(a, [[0, 540, 980, 1.04], [2.6, 540, 960, 1.0], [5.71, 540, 950, 1.02]]);
  const pair = a > 2.12 ? Math.exp(-(a - 2.12) * 2) : 0, fish = a - 4.6;
  const pl = at(500, 1560, (pair > 0 ? rings(0, -260, 280, "#9ffff0", 0.18 * pair, 1.2) : "") + pile(12, fish > 0 ? fish : 0, tot), 1.0 * pop(a - 0.3, 7, 12));
  const name = at(540, 300, plate("VOLTA", 80), pop(a - 0.46));
  const link = pair > 0 ? `<path d="M920 840Q860 960 620 1060" fill="none" stroke="${E.spark}" stroke-width="8" stroke-dasharray="14 14" opacity="${pair.toFixed(2)}"/>` : "";
  const g = river(c, tot, at(540, 820, eel(tot, 760, pair)) + link + pl + name);
  return { g };
}

export const V = [v0, { z: 1.3, dy: 110, bg: [P.night0, P.night1] }, v2, v3, v4];
