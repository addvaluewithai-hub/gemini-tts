// The human dictionary of electricity part 4 of 4, the last two words of the file.
//   0 GIGAWATT: a dark power station waits; the plate drops on «Gigawatt»; "1 GW = 1,000 MW" on «ألف ميجاوات»; the
//     station lights up and the camera pushes in on «محطة كبيرة كاملة»
//   1 DUCK CURVE: the plate on «ومنحنى البطة»; a day sky from dawn to night with a sun and a moon; the line is drawn on
//     «شكل الطلب»; the belly at noon glows on «واطي الضهر», the neck rises like a wall on «وطالع زي الحيطة»; on «وفعلاً شكله
//     بطة» the area under the line fills yellow and gets a head, beak, eye and tail: a duck. Host right: left of x = 1530.
import { clamp, lerp, ease, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./e4dict.v.js";
import { P, E, mix, stars, pop, plate, station } from "./elec.js";
import { sun } from "./enemies.js";

const NIGHT = (c, tot) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(57, 90, -600, 2600, 1000, tot), c, 0.15);
const tagBox = (t, size = 70, fill = P.gold) => { const w = String(t).length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };

// ---- 0: Gigawatt ----
function s0(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 900, 0.9], [4.2, 960, 920, 0.92], [5.43, 960, 980, 1.05]]) : camAt(a, [[0, 960, 560, 0.95], [4.2, 960, 560, 0.97], [5.43, 960, 620, 1.05]]);
  const G = v ? 1300 : 990;
  const lit = seg(a, 4.3, 4.7);
  const st = at(960, G, station(tot, { lit, smoke: lit > 0 }), v ? 0.95 : 1.0);
  const ground = `<rect x="-800" y="${G}" width="3600" height="900" fill="${P.ground}"/>`;
  const glow = lit > 0 ? rings(960, G - 160, 420, P.win, 0.08 * lit, 1.3) : "";
  const pl = a > 3.0 ? at(960, (v ? 260 : 150) - 240 * (1 - pop(a - 3.09)), plate("GIGAWATT", v ? 110 : 100), pop(a - 3.09)) : "";
  const eq = a > 3.3 ? at(960, v ? 470 : 310, tagBox("1 GW = 1,000 MW", v ? 60 : 64), pop(a - 3.39)) : "";
  const g = NIGHT(c, tot) + layer(ground + glow + st + pl + eq, c);
  return { g, out: toScreen(c, 960, G - 300), outC: "#17607a", outZ: 12 };
}

// ---- 1: the duck curve ----
// demand left for the other stations over a day, 0..24 h -> 0..1 (the duck: tail in the morning, belly at noon, neck at dusk)
const duckY = (h) => { const base = 0.55 + 0.08 * Math.exp(-((h - 8) ** 2) / 4) - 0.38 * Math.exp(-((h - 13) ** 2) / 7) + 0.42 * Math.exp(-((h - 19.5) ** 2) / 3.2) - 0.05 * Math.exp(-((h - 3) ** 2) / 6); return base; };
function s1(a, tot) {
  const v = portrait();
  const X0 = v ? 620 : 260, X1 = v ? 1300 : 1460, YB = v ? 1300 : 880, HH = v ? 620 : 560;
  const c = v ? camAt(a, [[0, 960, 900, 0.85], [3.2, 960, 930, 0.88], [5.5, 960, 940, 0.9], [6.67, 960, 940, 0.92]])
    : camAt(a, [[0, 860, 540, 1.0], [3.2, 860, 560, 1.04], [5.5, 860, 540, 1.0], [6.67, 860, 540, 1.02]]);
  const xp = (h) => lerp(X0, X1, h / 24), yp = (h) => YB - HH * duckY(h);
  // the day sky behind the chart: dawn, noon, dusk, night
  const id = "dsky";
  const skyG = `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b2c46"/><stop offset=".25" stop-color="#2a7aa0"/><stop offset=".5" stop-color="#4fb0d6"/><stop offset=".72" stop-color="#f08a4a"/><stop offset=".85" stop-color="#3a2a6a"/><stop offset="1" stop-color="#0b1a36"/></linearGradient>`;
  const panel = `${skyG}<path d="${rr(X0 - 60, YB - HH - 160, X1 - X0 + 120, HH + 220, 30)}" fill="url(#${id})"/>${at(xp(13), YB - HH - 70, sun(46, tot), 1)}${at(xp(22), YB - HH - 70, `<circle r="40" fill="#e8f3f6"/><circle cx="18" cy="-12" r="36" fill="#0b1a36"/>`)}
    <path d="M${X0 - 20} ${YB}H${X1 + 20}" stroke="${P.ink}" stroke-width="8" stroke-linecap="round"/>`;
  // the line
  let d = ""; for (let i = 0; i <= 96; i++) { const h = (i / 96) * 24; d += (i ? "L" : "M") + xp(h).toFixed(1) + " " + yp(h).toFixed(1); }
  const p = seg(a, 1.0, 2.9), duck = seg(a, 5.5, 6.0);
  const fill = duck > 0 ? `<path d="${d}L${X1} ${YB}L${X0} ${YB}Z" fill="#ffd04a" opacity="${(0.9 * duck).toFixed(2)}"/>` : "";
  const line = drawn(d, p, duck > 0.5 ? "#e8a020" : P.cream, 12, 'stroke-linejoin="round"');
  const belly = a > 3.3 ? rings(xp(13), yp(13), 50, P.gold, 0.3 * (1 - seg(a, 4.0, 4.4)) * seg(a, 3.3, 3.5), 1.5) + at(xp(13), yp(13) + 70, `<path d="M0 -40V30M-20 10L0 30L20 10" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 3.33) * (1 - seg(a, 5.4, 5.6))) : "";
  const wall = a > 4.0 ? at(xp(17.6), yp(17.6), `<path d="M0 40V-60M-20 -40L0 -60L20 -40" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, pop(a - 4.09) * (1 - seg(a, 5.4, 5.6))) : "";
  // the duck: a head on the neck's top, a beak, an eye; a tail flick at the start of the day
  const hx = xp(19.5), hy = yp(19.5);
  const head = duck > 0 ? at(hx - 10, hy - 40, `${disc(0, 0, 70, "#ffd04a", "#e8a020", 0.1)}<path d="M50 -6Q120 0 130 20Q90 40 50 24Z" fill="#ff8a3c"/><circle cx="20" cy="-16" r="12" fill="${P.ink}"/><circle cx="24" cy="-20" r="4" fill="#fff"/>`, pop(a - 5.56)) : "";
  const tail = duck > 0 ? at(xp(0.6), yp(0.6) - 10, `<path d="M0 0L-60 -50L-30 10Z" fill="#ffd04a"/>`, pop(a - 5.7)) : "";
  const wing = "";
  const pl = at(v ? 960 : 860, (v ? 320 : 115) - 220 * (1 - pop(a - 0.05)), plate("DUCK CURVE", v ? 100 : 90), pop(a - 0.05));
  const g = NIGHT(c, tot) + layer(panel + fill + wing + line + belly + wall + tail + head + pl, c);
  return { g, in: toScreen(c, 860, 540), inC: "#17607a", inZ: 12 };
}

const SHOTS = [s0, s1];
export const e4dictSet = makeSet(SHOTS, V, P);
