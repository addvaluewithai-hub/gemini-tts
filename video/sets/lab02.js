// Shorts lab 02 "apollo" (One number), drawn for the tall frame only (1080 x 1920). Script: Writer, branch
// shorts-writer, episodes/techforbadguys/shorts-lab/02-apollo/script.md (1f4de73). Numbers are the only text on screen.
// Peek stands small at the bottom right (peekFixed), so everything sits above y ~ 1320.
//   0 the phone next to the Moon, 1,000,000x grows between them        5 4 GB towers over a tiny 4 KB
//   1 the Apollo computer drifts toward the Moon, 1969                    6 4 GB / 4 KB, the counter spins to 1,048,576x
//   2 32 kg: the box drops onto a scale                                   7 the lander touches down, a small 4 KB beside it
//   3 2,048 turns into 4 KB                                               8 the phone screen fills the frame: a cat; 1,000,000x behind
//   4 a food photo bounces off the tiny 4 KB box
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rr, two, rings, at, makeSet } from "./kit.js";
import { P, pop, space, moon, earth, rocket, lander, footprint, phone, agc, bigNum } from "./labprops.js";

const T = (s, size, fill = P.gold) => `<text x="0" y="${(size * 0.36).toFixed(1)}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="none" stroke="#05061a" stroke-width="${(size * 0.08).toFixed(1)}" stroke-linejoin="round">${s}</text><text x="0" y="${(size * 0.36).toFixed(1)}" text-anchor="middle" font-family="Anton" font-size="${size}" fill="${fill}">${s}</text>`;
const drift = (tot, k = 1) => 10 * Math.sin(tot * 0.9 * k);
// a plate of food as a photo, 280 x 220 (a burger on a plate, in a white photo frame)
const foodPhoto = () => `${two(rr(-140, -110, 280, 220, 14), "#fff", "#dcdcdc", 0, 8)}<path d="${rr(-122, -92, 244, 166, 8)}" fill="#ffd9a8"/><ellipse cy="40" rx="100" ry="26" fill="#f4f1ea"/>
  <path d="M-70 20Q-70 -50 0 -50Q70 -50 70 20Z" fill="#e0a050"/><path d="M-76 22H76" stroke="#5a3a1a" stroke-width="16" stroke-linecap="round"/><path d="M-72 8H72" stroke="${P.green}" stroke-width="8" stroke-linecap="round"/><path d="M-70 32Q0 44 70 32" stroke="#e0a050" stroke-width="12" fill="none" stroke-linecap="round"/>`;
// a small box: the 4 KB of memory as a tiny crate with its number
const tinyBox = (k = 1) => at(0, 0, `${two(rr(-70, -60, 140, 120, 12), "#8c8f99", "#6d707b", 0, 6)}${T("4 KB", 54, "#fff")}`, k);
// a cat, sitting, 300 tall, feet on y = 0
const cat = (t = 0) => { const tl = 20 * Math.sin(t * 4);
  return `<path d="M60 -30Q${(150 + tl).toFixed(1)} -60 ${(130 + tl).toFixed(1)} -170" stroke="#f0a35a" stroke-width="26" fill="none" stroke-linecap="round"/>${two("M-90 0Q-110 -150 0 -160Q110 -150 90 0Z", "#f0a35a", "#d9863f", 0, 0)}
    <circle cy="-220" r="90" fill="#f0a35a"/><path d="M-80 -260L-70 -330L-20 -290ZM80 -260L70 -330L20 -290Z" fill="#f0a35a"/><path d="M-62 -275L-58 -312L-32 -290ZM62 -275L58 -312L32 -290Z" fill="#ffb7c5"/>
    <ellipse cx="-34" cy="-228" rx="14" ry="${(18 * (Math.sin(t * 2.3) > 0.96 ? 0.15 : 1)).toFixed(1)}" fill="${P.ink}"/><ellipse cx="34" cy="-228" rx="14" ry="${(18 * (Math.sin(t * 2.3) > 0.96 ? 0.15 : 1)).toFixed(1)}" fill="${P.ink}"/>
    <path d="M-8 -196H8L0 -186Z" fill="#ff8aa0"/><path d="M0 -186Q-14 -172 -24 -180M0 -186Q14 -172 24 -180" stroke="${P.ink}" stroke-width="5" fill="none"/>
    <path d="M-40 -196H-110M-40 -186H-104M40 -196H110M40 -186H104" stroke="#fff" stroke-width="4" opacity=".8"/>`; };

// ---- 0: the phone next to the Moon; 1,000,000x grows between them ----
function s0(a, tot) {
  const grow = easeOut(seg(a, 0.3, 2.2));
  const g = space(tot, 3) + at(800, 330, moon(170)) + at(290, 640 + drift(tot), phone(1, { screen: at(0, 0, earth(80, tot)) }), 1.05)
    + at(540, 1120, T("1,000,000×", 170 + 50 * grow), 0.75 + 0.25 * grow);
  return { g, out: [540, 1120], outC: P.gold, outZ: 18 };
}
// ---- 1: the Apollo computer drifts toward the Moon; 1969 ----
function s1(a, tot) {
  const p = easeOut(seg(a, 0, 4));
  const g = space(tot, 5) + at(lerp(880, 760, p), lerp(380, 300, p), moon(lerp(150, 200, p))) + at(lerp(240, 380, p), lerp(900, 760, p), agc(1, tot), 0.85, -6 + 4 * Math.sin(tot))
    + at(540, 1180, T("1969", 240), pop(a - 0.4));
  return { g, in: [540, 900], inC: P.gold, inZ: 18 };
}
// ---- 2: 32 kg; the box drops heavily onto a scale ----
function s2(a, tot) {
  const fall = easeIn(seg(a, 0.1, 0.6)), bump = a > 0.6 ? 18 * Math.exp(-(a - 0.6) * 7) * Math.sin((a - 0.6) * 30) : 0, y = lerp(250, 640, fall) + bump;
  const scale = `${two(rr(-260, 0, 520, 90, 20), "#c9ccd8", "#a7abbd", 0, 0)}<path d="M-200 0H200" stroke="#8792bb" stroke-width="16"/>${two(rr(-90, 20, 180, 56, 10), "#1a1c22", "#1a1c22", 0, 0)}`;
  const g = space(tot, 7) + at(540, 870 + Math.max(0, bump) * 0.5, scale) + at(540, y, agc(1, tot), 0.75)
    + at(540, 1150, T("32 kg", 230), pop(a - 0.6));
  return { g };
}
// ---- 3: 2,048 turns into 4 KB ----
function s3(a, tot) {
  const turn = seg(a, 2.0, 2.5);
  const g = space(tot, 9) + at(540, 420, agc(1, tot), 0.7)
    + at(540, 980, T("2,048", 260), (1 - turn) * pop(a - 0.2) + 0.0001, 0) + (turn > 0 ? at(540, 980, T("4 KB", 300), pop(a - 2.1)) : "");
  return { g };
}
// ---- 4: a food photo bounces off the tiny 4 KB box ----
function s4(a, tot) {
  const p = seg(a, 0.4, 1.6), x = p < 0.55 ? lerp(-200, 470, p / 0.55) : lerp(470, 260, (p - 0.55) / 0.45), y = p < 0.55 ? lerp(420, 720, p / 0.55) : 720 - 380 * Math.sin(Math.PI * (p - 0.55) / 0.45) * 0.6, rot = p < 0.55 ? 10 : 10 - 300 * (p - 0.55);
  const shake = p > 0.53 && p < 0.7 ? 8 * Math.sin(a * 60) : 0;
  const g = space(tot, 11) + at(720 + shake, 800, tinyBox(1.3)) + at(x, y, foodPhoto(), 1.1, rot) + (p > 0.53 && p < 0.75 ? at(640, 760, `<path d="M-30 -30L30 30M30 -30L-30 30" stroke="${P.red}" stroke-width="16" stroke-linecap="round"/>`) : "");
  return { g };
}
// ---- 5: 4 GB towers over a tiny 4 KB ----
function s5(a, tot) {
  const up = easeOut(seg(a, 0.2, 1.4));
  const g = space(tot, 13) + at(540, lerp(1300, 620, up), T("4 GB", 520, "#7fd4ff"), 0.3 + 0.7 * up) + at(820, 1180, tinyBox(0.8));
  return { g };
}
// ---- 6: 4 GB / 4 KB; the counter spins up to 1,048,576x ----
function s6(a, tot) {
  const div = pop(a - 0.1), spin = seg(a, 1.6, 4.4);
  const g = space(tot, 15) + at(540, 380, `${at(-250, 0, T("4 GB", 150, "#7fd4ff"))}${T("÷", 130, "#fff")}${at(250, 0, T("4 KB", 150, "#fff"))}`, div)
    + (a > 1.5 ? at(540, 900, bigNum(1048576, spin, { size: 190, suffix: "×" }) + rings(0, -40, 260, P.gold, 0.12 * clamp(spin * 2)), 1) : "");
  return { g, out: [540, 900], outC: P.gold, outZ: 18 };
}
// ---- 7: the lander touches down; a small 4 KB beside it ----
function s7(a, tot) {
  const d = easeOut(seg(a, 0, 2.2)), G = 1080, dust = a > 2.0 ? clamp(1 - (a - 2.0) / 1.5) : 0;
  const ground = `<path d="M0 ${G}Q270 ${G - 40} 540 ${G - 10}T1080 ${G - 30}V1920H0Z" fill="#d6cdb4"/>${[[160, G + 120, 60], [820, G + 200, 90], [420, G + 320, 40]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.35}" fill="#bdb39a"/>`).join("")}`;
  const g = space(tot, 17, { ny: 300 }) + at(860, 260, earth(90, tot)) + ground + at(500, lerp(560, G + 10, d), lander(), 1.2)
    + (dust > 0 ? `<ellipse cx="500" cy="${G + 10}" rx="${(260 + 200 * (1 - dust)).toFixed(0)}" ry="40" fill="#e9e2cf" opacity="${(dust * 0.7).toFixed(2)}"/>` : "")
    + at(200, G + 250, footprint(), 0.7 * clamp((a - 2.6) * 3)) + at(850, G + 120, tinyBox(0.8), pop(a - 2.3));
  return { g };
}
// ---- 8: the phone screen fills the frame: a cat; 1,000,000x glows behind ----
function s8(a, tot) {
  const z = easeOut(seg(a, 0.2, 1.4)), k = lerp(0.9, 2.9, z);
  const screen = `<rect x="-130" y="-270" width="260" height="540" fill="#ffe7c2"/><rect x="-130" y="90" width="260" height="180" fill="#c98b5a"/>${at(0, 120, cat(tot), 0.62)}`;
  const g = space(tot, 19) + at(540, 330, T("1,000,000×", 170), 0.6 + 0.4 * clamp(a - 1)) + at(540, lerp(900, 980, z), phone(1, { screen }), k * 0.5);
  return { g };
}
const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8];
export const lab02Set = makeSet(SHOTS, SHOTS, P);
