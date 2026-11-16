// Science part 1, section 7 "Halley": seven shots, timed to the words. Quiet at the end.
//   0 1705: a candle-lit desk, nameplate "Edmond Halley"; old records with comet sketches fly onto it
//   1 a time line with three comets on it, 1531, 1607, 1682, and 76 between each pair
//   2 the three comets slide together into one, which swings round the sun on a long oval and comes back
//   3 the oval again; a pin with 1758 where it comes back; an hourglass turns over and starts to run
//   4 the candle goes out; a gravestone with 1742
//   5 night, 25 DEC 1758, snow; the comet sweeps in over the grave and the hourglass
//   6 the comet's tail carries a nameplate "HALLEY" (host right)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { calPage } from "./props.js";
import { P, mix, pop, paperBg, nightSky, room, desk, sun, comet, hourglass, grave, scroll } from "./sci.js";

const sheetC = (k) => at(0, 0, `${two(rr(-80, -60, 160, 120, 6), "#f3dfb6", "#e3c79a", 4, 4)}${at(10, 0, comet(90, 0, 0.6))}`, k);

// ---- 0: 1705, old records ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 600, 0.9], [5.68, 980, 660, 1.15]]), G = 920;
  const sheets = [0, 1, 2, 3].map((i) => { const t0 = 3.6 + i * 0.3, p = seg(a, t0, t0 + 0.6); if (p <= 0) return ""; const fx = [200, 1800, 300, 1700][i], tx = 860 + i * 70, ty = G - 250 - i * 6;
    return at(lerp(fx, tx, easeOut(p)), lerp(200, ty, easeOut(p)), sheetC(1.0), 1, lerp(30, -6 + i * 4, p)); }).join("");
  return { g: `<rect width="${FW}" height="${FH}" fill="#3a2f55"/>` + layer(room(G, "#4a3d66", "#2f2747") + at(960, G, desk({ plate: "Edmond Halley", tot, flame: 1 }), 1.6 * pop(a - 2.3, 7, 12)) + sheets + at(320, 260, calPage("1705", "", 0.85), pop(a - 0.2)), c) };
}
// ---- 1: every 76 years ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [3.06, 960, 540, 1.04]]), Y = 600, xs = [380, 960, 1540], ys = ["1531", "1607", "1682"];
  const line = `<path d="M200 ${Y}H1720" stroke="${P.cream}" stroke-width="8"/>`;
  const marks = xs.map((x, i) => (a > 0.2 + i * 0.3 ? at(x, Y, `<circle r="14" fill="${P.cream}"/>${at(0, -150, comet(180, tot, 0.9))}${text(0, 80, ys[i], 60, P.cream)}`, pop(a - 0.2 - i * 0.3)) : "")).join("");
  const gaps = [0, 1].map((i) => (a > 1.4 + i * 0.4 ? at((xs[i] + xs[i + 1]) / 2, Y + 190, `<path d="M-250 -40V0H250V-40" stroke="${P.gold}" stroke-width="8" fill="none"/>${text(0, 70, "76", 70, P.gold)}`, pop(a - 1.4 - i * 0.4)) : "")).join("");
  return { g: nightSky(c, tot, 60, false) + layer(line + marks + gaps, c) };
}
// ---- 2–3: one comet, an orbit, a return in 1758 ----
const OC = [1060, 520], ORX = 700, ORY = 250;
const orbitAt = (t) => [OC[0] + Math.cos(t) * ORX, OC[1] + Math.sin(t) * ORY];
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.95], [3.41, 960, 540, 0.95]]), merge = ease(seg(a, 0.6, 1.6)), go = seg(a, 1.8, 3.4);
  const three = merge < 1 ? [380, 960, 1540].map((x) => at(lerp(x, 960, merge), 260, comet(180, tot, 0.9))).join("") : "";
  const orb = go > 0 ? `<ellipse cx="${OC[0]}" cy="${OC[1]}" rx="${ORX}" ry="${ORY}" fill="none" stroke="${P.ink}" stroke-width="5" stroke-dasharray="16 14" opacity="${(0.5 * seg(a, 1.8, 2.2)).toFixed(2)}"/>` + at(OC[0] + ORX - 120, OC[1], sun(70, tot)) : "";
  const t = Math.PI + go * Math.PI * 2, [x, y] = orbitAt(t);
  return { g: nightSky(c, tot, 61, false) + layer(three + orb + (go > 0 ? at(x, y, comet(200, tot, 0.8), 1, (t + Math.PI / 2) * 57.3 + 180) : ""), c) };
}
function s3(a, tot) {
  const c = camAt(a, [[0, 960, 540, 0.95], [4.71, 960, 560, 1.0]]), [px, py] = orbitAt(Math.PI);
  const pin = a > 1.9 ? at(px, py, `<path d="M0 0V-140" stroke="${P.red}" stroke-width="8"/>${disc(0, -150, 22, P.red, P.redD)}${at(0, -330, calPage("1758", "", 0.7))}`, pop(a - 1.9)) : "";
  const hg = a > 2.4 ? at(1500, 860, hourglass(seg(a, 2.9, 30), ease(seg(a, 2.4, 2.9)) * 0 ), 1.1 * pop(a - 2.4)) : "";
  return { g: nightSky(c, tot, 61, false) + layer(`<ellipse cx="${OC[0]}" cy="${OC[1]}" rx="${ORX}" ry="${ORY}" fill="none" stroke="${P.cream}" stroke-width="5" stroke-dasharray="16 14" opacity=".45"/>` + at(OC[0] + ORX - 120, OC[1], sun(70, tot)) + pin + hg, c), out: [1500, 860], outC: P.night0 };
}
// ---- 4: he died sixteen years before (calm) ----
function s4(a, tot) {
  const c = camAt(a, [[0, 960, 600, 1.0], [1.45, 960, 620, 1.04]]), G = 920, out = seg(a, 0.2, 0.5);
  return { g: `<rect width="${FW}" height="${FH}" fill="#3a2f55"/>` + layer(room(G, "#4a3d66", "#2f2747") + at(640, G, desk({ plate: "Edmond Halley", tot, flame: 1 - out }), 1.3) + at(1400, G, grave("1742"), 1.3 * pop(a - 0.5, 7, 12)) + `<rect x="-500" y="-500" width="3000" height="2000" fill="#000" opacity="${(0.25 * out).toFixed(2)}"/>`, c), in: [960, 540], inC: P.night0 };
}
// ---- 5: Christmas night 1758: it came back ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [3.58, 960, 520, 0.96]]), G = 880, sw = easeOut(seg(a, 2.4, 3.1));
  const snow = Array.from({ length: 40 }, (_, i) => { const q = (tot * 0.12 + i / 40) % 1; return `<circle cx="${(i * 53) % 1920 + 20 * Math.sin(tot + i)}" cy="${q * 1000}" r="${3 + (i % 3)}" fill="#fff" opacity=".7"/>`; }).join("");
  const cm = sw > 0 ? at(lerp(2200, 1100, sw), lerp(-100, 260, sw), comet(620, tot, 1.2), 1, -18) : "";
  return { g: nightSky(c, tot, 62, false) + layer(cm + `<path d="M-500 ${G}Q960 ${G - 60} 2400 ${G}V1400H-500Z" fill="#eef3ff"/>` + at(700, G, grave("1742")) + at(1240, G - 130, hourglass(1), 1.0) + at(330, 250, calPage("1758", "25 DEC", 0.8), pop(a - 1.0)), c) + snow, out: [1100, 260], outC: "#cff6ff" };
}
// ---- 6: they named it after him (host right) ----
function s6(a, tot) {
  const c = camAt(a, [[0, 900, 420, 1.0], [1.13, 900, 420, 1.04]]);
  const plate = at(1040, 300, `${two(rr(-200, -50, 400, 100, 12), P.gold, P.goldD, 0, 8)}${text(0, 30, "HALLEY", 76, "#8a5200")}`, pop(a - 0.3), -18);
  return { g: nightSky(c, tot, 62, false) + layer(at(700, 380, comet(760, tot, 1.2), 1, -18) + plate, c), in: [700, 380], inC: "#cff6ff" };
}

const SHOTS = [s0, s1, s2, s3, s4, s5, s6];
export const halleySet = makeSet(SHOTS, [{ z: 0.62, dx: -120 }, { z: 0.56 }, { z: 0.56, dx: 40 }, { z: 0.56, dx: 40 }, { z: 0.62 }, { z: 0.62 }, { z: 0.62, dx: -60 }], P);
