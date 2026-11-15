// Science part 1, section 4 "the dragon in the garage": eight shots, timed to the words.
//   0 a garage at night; its door rolls up on an empty garage; a speech bubble with a dragon in it pops up over it
//   1 a flashlight sweeps the garage: nothing; a dashed outline of a dragon flickers once and is gone (it cannot be seen)
//   2 a bag pours flour over the floor: the floor stays clean, no footprints; the dashed outline lifts off (it flies)
//   3 a thermometer in front of the garage: the level stays low and turns blue, a snowflake (its fire is cold)
//   4 the tests in a row: flashlight, flour, thermometer, camera; each gets a ✗ in turn (an excuse for every test). Host right.
//   5 two claims: the dashed dragon, which every test arrow passes through; a "?" card standing on a trapdoor with a lever
//     (it can fail): a test arrow comes in, and the trapdoor shows it could drop
//   6 the sun, a star beyond it; the star's light passes close to the sun and bends; the straight path is dashed beside it
//   7 1919: the moon covers the sun, a telescope on the ground, the star's light comes in bent, ✓ (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, bez, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, dur, pop, nightSky, paperBg, room, garage, dragonGhost, flashlight, flourBag, thermometer, card, sun } from "./sci.js";
import { stars } from "./sci.js";

const G = 900, GX = 960;
const street = () => `<rect x="-1500" y="${G}" width="5000" height="600" fill="${P.ground}"/><rect x="-1500" y="${G + 40}" width="5000" height="110" fill="${P.road}"/>`;
const houseBits = () => [[220, 300], [1720, 340]].map(([x, h]) => `${two(rr(x - 170, G - h, 340, h, 8), "#e9c58f", "#d4a86a", 12, 0)}<path d="${rr(x - 60, G - h + 60, 120, 90, 8)}" fill="${P.win}"/>`).join("");
const dragonIcon = () => `<path d="M-60 20Q-70 -30 -20 -40Q20 -46 30 -20Q50 -40 60 -60Q70 -30 50 0Q30 20 0 14Q-30 30 -60 20Z" fill="${P.green}"/><path d="M-10 -40L0 -70L14 -42" fill="${P.greenD}"/><circle cx="46" cy="-44" r="5" fill="${P.ink}"/><path d="M62 -54q16 -4 22 -16" stroke="${P.coral}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
const bubble = (inner, k) => at(0, 0, `${two("M-150 -100H150Q180 -100 180 -70V50Q180 80 150 80H-20L-60 130L-60 80H-150Q-180 80 -180 50V-70Q-180 -100 -150 -100Z", "#fffaf0", P.creamD, 0, 8)}${at(0, -10, inner, 1.5)}`, k);
// the garage set, shared by shots 0–3
function garageShot(a, tot, c, o = {}) {
  const inner = (o.flour ? `<rect x="-300" y="-60" width="600" height="60" fill="#fffaf0" opacity="${(0.9 * o.flour).toFixed(2)}"/>` : "") + dragonGhost(o.ghost || 0, tot) + (o.light ? `<path d="M-300 -380H300V0H-300Z" fill="#fff3b0" opacity="${(0.12 * o.light).toFixed(3)}"/>` : "");
  return nightSky(c, tot, 41, true) + layer(street() + houseBits() + at(GX, G, garage(o.door ?? 1, at(0, o.ghostY || 0, inner), { c: P.violet, cD: P.violetD, inside: "#3a2f55" }), 1.25) + (o.extra || ""), c);
}

// ---- 0: I have a dragon in my garage ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 520, 0.95], [2.87, 960, 560, 1.05]]), door = ease(seg(a, 0.6, 1.5));
  const b = a > 1.85 ? at(GX + 380, 260, bubble(dragonIcon(), 1), pop(a - 1.85)) : "";
  return { g: garageShot(a, tot, c, { door, extra: b }) };
}
// ---- 1: show me. It's invisible ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.05], [2.15, 960, 600, 1.2]]), sweep = Math.sin(a * 2.4) * 0.5;
  const fl = at(GX - 620, G - 120, flashlight(1, 900), 1.0, sweep * 30 - 10);
  const ghost = a > 1.1 && a < 1.6 ? 0.8 * Math.sin(Math.PI * seg(a, 1.1, 1.6)) : 0;
  return { g: garageShot(a, tot, c, { light: 1, ghost, ghostY: -40, extra: fl }) };
}
// ---- 2: flour on the floor; it flies ----
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.2], [2.72, 960, 560, 1.15]]), pour = seg(a, 0.4, 1.3);
  const bag = at(GX + 520, G - 380, flourBag(ease(seg(a, 0.2, 0.5)) * (1 - seg(a, 1.4, 1.7))), 1.0);
  const fall = pour > 0 && pour < 1 ? Array.from({ length: 14 }, (_, i) => { const q = (a * 2 + i / 14) % 1; return `<circle cx="${GX + 420 - i * 40}" cy="${G - 300 + 260 * q}" r="7" fill="#fffaf0"/>`; }).join("") : "";
  const up = seg(a, 1.85, 2.6);
  return { g: garageShot(a, tot, c, { flour: ease(pour), ghost: up > 0 ? 0.7 : 0, ghostY: -40 - 200 * ease(up), extra: bag + fall }), out: [960, 520], outC: P.ink };
}
// ---- 3: a thermometer; the fire is cold ----
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.15], [2.72, 980, 600, 1.25]]), cold = seg(a, 1.9, 2.4);
  const th = at(GX + 120, G - 40, thermometer(lerp(0.5, 0.12, cold), mix(P.red, P.blue, cold)), 1.3 * pop(a - 0.3));
  const flake = cold > 0 ? at(GX + 330, G - 380, `${[0, 60, 120].map((r) => `<path d="M0 -70V70" stroke="${P.blue}" stroke-width="14" stroke-linecap="round" transform="rotate(${r})"/>`).join("")}<circle r="16" fill="#cfe9ff"/>`, pop(a - 2.1)) : "";
  return { g: garageShot(a, tot, c, { extra: th + flake }), in: [960, 520], inC: P.ink };
}
// ---- 4: every test gets an excuse (host right) ----
const cam = () => `${two(rr(-90, -60, 180, 120, 16), P.steel, P.steelD, 0, 8)}<circle r="40" fill="${P.ink}"/><circle r="24" fill="${P.blue}"/><path d="${rr(-50, -84, 50, 26, 6)}" fill="${P.steelD}"/>`;
function s4(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [2.43, 800, 540, 1.03]]);
  const tools = [[flashlight(0), 0.0], [flourBag(0), 0.45], [thermometer(0.4), 0.9], [cam(), 1.4]];
  const row = tools.map(([g, t], i) => { const x = 260 + i * 330, y = i === 1 ? 700 : i === 2 ? 760 : 560; return at(x, y, g, 0.9) + (a > t + 0.2 ? cross(x + 80, 380, 52, P.red, a - t - 0.2) : ""); }).join("");
  return { g: paperBg(c, tot) + layer(row, c), in: [960, 540], inC: P.ink };
}
// ---- 5: a claim that cannot fail, and one that can ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [6.29, 1100, 540, 1.1]]);
  const arrows = (x0, y0, t0, stop) => [0, 1, 2].map((i) => { const p = seg(a, t0 + i * 0.35, t0 + i * 0.35 + 0.7); if (p <= 0 || p >= 1 && !stop) return ""; const x = lerp(x0 - 500, stop ? x0 - 140 : x0 + 500, stop ? easeOut(p) : p);
    return `<path d="M${x - 90} ${y0 - 60 + i * 60}H${x}" stroke="${P.blue}" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y0 - 60 + i * 60}l-24 -16v32Z" fill="${P.blue}"/>`; }).join("");
  const left = at(520, 640, dragonGhost(1, tot), 1.1) + arrows(520, 520, 0.5, false);
  const trap = ease(seg(a, 5.5, 5.9)) * 0.35;
  const right = `<path d="${rr(1180, 760, 420, 40, 6)}" fill="${P.ink}"/>${at(1240, 760, two(rr(0, -16, 150, 24, 4), P.wood, P.woodD, 0, 5), 1, 30 * trap)}${at(1540, 760, two(rr(-150, -16, 150, 24, 4), P.wood, P.woodD, 0, 5), 1, -30 * trap)}<path d="M1660 760V600" stroke="${P.steelD}" stroke-width="16"/>${disc(1660, 590, 30, P.red, P.redD)}` + at(1390, 610, card("?"), 1.0) + (a > 3.6 ? arrows(1390, 600, 3.7, true) : "");
  const xNo = a > 2.6 ? cross(520, 300, 50, P.red, a - 2.6) : "", yes = a > 5.9 ? check(1390, 330, 50, P.green, a - 5.9) : "";
  return { g: paperBg(c, tot) + layer(left + right + xNo + yes, c) };
}
// ---- 6: starlight bends near the sun ----
function s6(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.95], [7.17, 960, 540, 1.05]]);
  const SX = 1000, SY = 520, star = [1820, 260], eye = [180, 700];
  const st = at(...star, `${rings(0, 0, 40, P.gold, 0.25)}<path d="M0 -40L10 -10L40 0L10 10L0 40L-10 10L-40 0L-10 -10Z" fill="${P.gold}"/>`, pop(a - 2.2));
  const bend = seg(a, 4.2, 5.2), dash = seg(a, 5.4, 6.0);
  const path = bend > 0 ? drawn(`M${star[0]} ${star[1]}Q${SX + 40} ${SY - 210} ${eye[0]} ${eye[1]}`, bend, P.goldD, 10) : "";
  const straight = dash > 0 ? drawn(`M${star[0]} ${star[1]}L${eye[0]} ${eye[1] - 280}`, dash, P.ink, 6, 'stroke-dasharray="16 14" opacity=".5"') + cross(eye[0] + 120, eye[1] - 330, 34, P.red, a - 6.1) : "";
  const g = nightSky(c, tot, 42, false) + layer(at(SX, SY, sun(150, tot), pop(a - 1.3)) + st + path + straight + at(eye[0], eye[1], disc(0, 0, 60, P.blue, P.blueD) + `<circle r="22" fill="${P.ink}"/>`, pop(a - 0.3)), c);
  return { g, out: [SX, SY], outC: P.night0 };
}
// ---- 7: 1919, the eclipse, it bent ----
function s7(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [4.45, 920, 560, 1.05]]), SX = 1000, SY = 360;
  const moon = ease(seg(a, 1.6, 2.6)), dark = moon;
  const scope = at(560, 900, `<path d="M-60 0L0 -150L60 0" stroke="${P.ink}" stroke-width="14" fill="none"/>${at(0, -160, two(rr(-40, -150, 80, 300, 20), P.steel, P.steelD, 8, 0), 1, 52)}`, pop(a - 2.9));
  const ray = seg(a, 3.3, 3.9);
  const sky = `<rect width="${FW}" height="${FH}" fill="${mix(P.sky0, P.night0, 0.85 * dark)}"/>` + (dark > 0.3 ? `<g opacity="${(dark).toFixed(2)}">${layer(stars(77, 50, 0, 1920, 700, tot), c, 0.2)}</g>` : "");
  const g = sky + layer(`<rect x="-500" y="900" width="3000" height="400" fill="${mix(P.ground, "#3a3350", dark)}"/>` + at(SX, SY, sun(120, tot, 1 - dark) + disc(lerp(-300, 0, moon), 0, 124, P.night0, "#0a0f22", 0.05) + (moon > 0.95 ? `<circle r="140" fill="none" stroke="#fff3c2" stroke-width="10" opacity=".8"/>` : "")) + (ray > 0 ? drawn(`M1820 160Q${SX + 60} ${SY - 230} 600 760`, ray, P.gold, 10) : "") + scope + (a > 3.9 ? check(1300, 700, 60, P.green, a - 3.9) : "") + at(260, 220, calPage("1919", "", 0.8), pop(a - 0.3)), c);
  return { g, in: [SX, SY], inC: P.night0 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7];
export const dragonSet = makeSet(SHOTS, [], P);
