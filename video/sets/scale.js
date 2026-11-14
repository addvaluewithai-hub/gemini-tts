// "Scale": how big the numbers are, as one tall world the camera climbs, with a gauge bar up its left side that fills as it climbs.
//   0 at the bottom, on a desk: a phone charger, 5 V
//   1 up the wall: a socket, 110-240 V
//   2 up into the night: a pylon, 100,000s V
//   3 up into the storm: a cloud and its bolt, 100,000,000s V
//   4 back down to the socket: a warning mark, the socket glows red, a jagged current leaps from its holes (host right)
// One world and one camera for all five shots (no hand-over shapes inside the set).
import { clamp, lerp, ease, easeOut, seg, spring, kf, camAt, layer, rr, two, disc, rings, text, drawn, at, FW, FH, makeSet } from "./kit.js";
import { P, E, pop, stars, charger, socket, pylon, cloud, bolt, tagV, warning, boltPath } from "./elec.js";

const ends = (s) => s.ends || [3.35, 3.08, 2.21, 1.99, 7.9];
const cum = (s, k) => ends(s).slice(0, k).reduce((a, b) => a + b, 0);
// where each thing stands in the tall world
const OX = 1000, YC = 640, YS = -380, YP = -1150, YK = -2500, BARX = 330;
const LEVEL = [YC - 120, YS, YP - 420, YK + 40];

function world(T, c, tot, s) {
  const C1 = cum(s, 1), C2 = cum(s, 2), C3 = cum(s, 3), C4 = cum(s, 4);
  // the walls of the house up to YS + 400, the night sky above, the storm above that
  const bg = `<rect x="-900" y="${YS + 420}" width="3800" height="1400" fill="${E.roof}"/><rect x="-900" y="${YS + 400}" width="3800" height="30" fill="${P.ink}"/>
    <rect x="-900" y="${YK - 1400}" width="3800" height="${YS + 400 - YK + 1400}" fill="url(#bnight)"/><rect x="-900" y="${YK - 1400}" width="3800" height="900" fill="${P.night0}"/>`;
  const desk = `${two(rr(-900, YC + 30, 3800, 40, 6), P.wood, P.woodD, 0, 8)}<rect x="-900" y="${YC + 70}" width="3800" height="600" fill="${P.woodD}"/>`;
  const ch = T > 1.27 ? at(OX, YC - 470, charger(), 1.65 * pop(T - 1.27)) : "";
  const sk = T > C1 + 0.23 ? at(OX, YS, socket(), 2.3 * pop(T - C1 - 0.23)) : "";
  const py = T > C2 + 0.2 ? at(OX, YP + 120, pylon(920), [1, Math.min(1.05, spring(T - C2 - 0.2, 8, 14))]) : "";
  const hill = `<path d="M-900 ${YP + 120}Q${OX} ${YP + 40} 2900 ${YP + 120}V${YP + 400}H-900Z" fill="${E.hill}"/>`;
  const ck = T > C3 - 0.1 ? at(OX, YK, cloud(tot, 0.8), 1.7 * pop(T - C3 + 0.1)) : "";
  const bp = seg(T, C3 + 0.6, C3 + 0.85), flash = T > C3 + 0.6 ? 0.6 + 0.4 * Math.abs(Math.sin(tot * 9)) : 0;
  const bt = T > C3 + 0.6 ? bolt(OX - 40, YK + 100, OX + 80, YK + 760, 7, bp, flash, 40) : "";
  // the tags beside each thing, rolling up on their words
  const tag = (t0, y, val, unit, k = 1) => (T > t0 ? at(OX + 620, y, tagV(val, unit, { size: 90 }), pop(T - t0) * k) : "");
  const fade = 1 - seg(T, C4 + 0.2, C4 + 0.6);
  const tags = tag(2.63, YC - 470, "5", "V") + (T < C4 + 0.6 ? tag(C1 + 0.91, YS, T < C1 + 1.59 ? "110" : "110-240", "V", fade) : "")
    + tag(C2 + 1.21, YP - 380, "100,000s", "V") + tag(C3 + 1.11, YK + 300, "100,000,000s", "V");
  // the bar up the left side: how high the number is
  const lvl = kf(T, [[0, YC + 20], [2.63, YC + 20], [2.9, LEVEL[0]], [C1 + 0.91, LEVEL[0]], [C1 + 2.31, LEVEL[1]], [C2 + 1.21, LEVEL[1]], [C2 + 1.51, LEVEL[2]], [C3 + 0.67, LEVEL[2]], [C3 + 1.11, LEVEL[3]], [C4 + 0.2, LEVEL[3]], [C4 + 1.0, LEVEL[1]]]);
  const hot = clamp((YC - lvl) / (YC - YK));
  const bar = `<path d="${rr(BARX - 40, YK - 200, 80, YC + 220 - YK, 40)}" fill="${P.ink}" opacity=".8"/><path d="${rr(BARX - 26, lvl, 52, YC + 6 - lvl, 26)}" fill="${hot > 0.6 ? P.red : hot > 0.3 ? "#ff8a3c" : P.gold}"/>
    ${LEVEL.map((y) => `<path d="M${BARX + 40} ${y}h40" stroke="${P.cream}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`).join("")}`;
  // 4: the warning at the socket
  const u = T - C4, warn = u > 1.11 ? at(OX - 420, YS - 200, warning(120), pop(u - 1.11)) : "";
  const red = u > 2.54 ? rings(OX, YS, 300 * (1 + 0.05 * Math.sin(tot * 8)), P.red, 0.3 * ease(seg(u, 2.54, 3.22)), 1.4) : "";
  const zap = u > 4.66 ? [0, 1].map((i) => { const ph = (tot * 2.2 + i * 0.5) % 1; return drawn(boltPath(OX + (i ? 45 : -45), YS, OX + (i ? 260 : -260), YS + 300, 11 + i + Math.floor(tot * 6), 5), clamp(ph * 3), "#ff6070", 14, 'stroke-linejoin="round"'); }).join("") : "";
  return `<rect width="${FW}" height="${FH}" fill="${P.night0}"/>` + layer(bg + starField(tot), c) + layer(desk + hill + py + red + sk + ch + ck + bt + tags + bar + warn + zap, c);
}
// stars only above the house
const starField = (tot) => stars(23, 160, -900, 2900, 1700, tot).replace(/^/, `<g transform="translate(0 ${YK - 1400})">`) + "</g>";

const KEYS = (s) => { const C1 = cum(s, 1), C2 = cum(s, 2), C3 = cum(s, 3), C4 = cum(s, 4), C5 = cum(s, 5);
  return [[0, 960, YC - 250, 1.05], [C1 - 0.2, 960, YC - 270, 1.05], [C1 + 0.7, 980, YS - 40, 1.0], [C2, 980, YS - 50, 1.0], [C2 + 0.6, 980, YP - 300, 0.85], [C3, 980, YP - 320, 0.85], [C3 + 0.5, 980, YK + 220, 0.85], [C4, 980, YK + 220, 0.85], [C4 + 1.1, 900, YS - 60, 1.05], [C5, 900, YS - 60, 1.12]]; };
const shot = (k) => (a, tot, s) => { const T = cum(s, k) + a; return { g: world(T, camAt(T, KEYS(s)), tot, s) }; };
export const scaleSet = makeSet([0, 1, 2, 3, 4].map(shot), [], P);
