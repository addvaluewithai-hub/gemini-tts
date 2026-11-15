// "War of the currents" in portrait (1080 x 1920), for the Short "edison-tesla" (shots 0–4, 9, 10) and any later Short.
// Most shots are the landscape world through a camera made for the tall frame (`keys`); the screen labels move into the
// tall frame in war.js itself (tall()). Three are redrawn for the tall frame:
//   2 the wire runs UP the frame from Edison's station: lamps on both sides, the 1.5 km mark halfway, the lamps above it
//     fade and the wire glows hot; then the camera pulls back and a station pops up on every block;
//   9 the domed hall of the Chicago fair close up, lighting all at once, the plates stacked under it;
//  10 Niagara at the bottom, the line climbing the frame over pylons to BUFFALO at the top; 30+ km along it and
//     Edison's 1.5 km as a tiny stroke beside it.
import { clamp, lerp, ease, easeOut, seg, kf, camAt, layer, toScreen, rr, two, rings, drawn, at, FW, FH } from "./kit.js";
import { hills } from "./props.js";
import { P, E, skyline, pop, station, pylon, pylonTips, plate, tagV } from "./elec.js";
import { sky, year, lampPost, whiteCity } from "./war.js";

const NIGHT = [P.night0, P.ground];

// ---- 2: the wire climbs the frame ----
const SX = 540, SG = 1900, LY = (i) => SG - 260 - i * 300, NL = 11, MKY = LY(4) - 150;   // lamps every 300 up the street; the 1.5 km mark after the fourth
function v2(a, tot) {
  const c = camAt(a, [[0, 540, 1350, 1.0], [2.4, 540, 900, 1.0], [4.3, 540, 520, 0.95], [6.6, 540, 420, 0.92], [8.4, 540, 380, 0.46], [11.9, 540, 380, 0.45]]);
  const top = LY(NL - 1) - 200, run = seg(a, 1.3, 2.4), fade = seg(a, 2.3, 3.9), hot = seg(a, 5.75, 6.4);
  const road = `<rect x="${SX - 110}" y="${top - 400}" width="220" height="${SG - top + 400}" fill="${P.road}"/><path d="M${SX} ${top - 400}V${SG}" stroke="#ff8a5c" stroke-width="8" stroke-dasharray="60 60" opacity=".35"/>`;
  const land = `<rect x="-2200" y="${top - 1400}" width="5400" height="${SG - top + 2400}" fill="${P.ground}"/>` + road;
  // the wire: up the left side of the street, from the station's roof to the top
  const WX = SX - 160, wireD = `M${WX} ${SG - 330}V${top}`, mkP = (SG - 330 - MKY) / (SG - 330 - top);
  const heat = `rgb(${Math.round(lerp(22, 255, hot))},${Math.round(lerp(17, 106, hot))},${Math.round(lerp(58, 58, hot))})`;
  const wire = `<path d="${wireD}" stroke="#16113a" stroke-width="10" fill="none"/>` + (run > 0 ? drawn(`M${WX} ${SG - 330}V${MKY}`, run * 2, P.gold, 12) + drawn(`M${WX} ${MKY}V${top}`, (run * 2 - 1) * (1 - fade * 0.7), P.gold, 8) : "") + (hot > 0 ? `<path d="M${WX} ${MKY}V${top}" stroke="${heat}" stroke-width="16" opacity="${(0.6 + 0.4 * Math.sin(tot * 9)).toFixed(2)}"/>` : "");
  let lamps = ""; for (let i = 0; i < NL; i++) { const y = LY(i), reach = clamp(run * NL - i), far = y < MKY ? lerp(1, 0.08, fade) * (1 - 0.5 * seg(MKY - y, 0, 1500)) : 1;
    lamps += at(i % 2 ? SX + 200 : SX - 200, y, lampPost(reach > 0 ? far * ease(Math.min(1, reach)) : 0, 240)); }
  const mk = a > 3.3 ? at(SX, MKY, `<path d="M-230 0H230" stroke="${P.cream}" stroke-width="8" stroke-dasharray="20 16"/>` + at(330, 0, tagV("1.5", "km", { size: 80, fill: P.cream })), [pop(a - 3.3), 1]) : "";
  let more = ""; [[-700, 1100, 0], [1780, 1500, 0.15], [-700, 300, 0.25], [1780, 600, 0.4], [-700, -500, 0.5], [1780, -300, 0.6]].forEach(([x, y, d], i) => { const p = pop(a - 6.9 - d); if (p > 0) more += at(x, y, `<rect x="-420" y="0" width="840" height="60" fill="${P.road}"/>` + station(tot + i, { lit: 1 }), [p, p]); });
  const g = sky(c, tot, 9) + layer(land + more + at(SX, SG, station(tot, { lit: 1 }) + at(0, -245, plate("EDISON", 40))) + wire + lamps + mk, c);
  return { g, in: toScreen(c, SX, SG - 120), inC: P.win };
}

// ---- 9: the domed hall, close up ----
function v9(a, tot) {
  const c = camAt(a, [[0, 960, 470, 1.4], [4.0, 960, 500, 1.5], [6.38, 960, 510, 1.56]]), G = 860, lit = seg(a, 4.01, 4.4);
  const burst = lit > 0 && lit < 1 ? rings(960, G - 300, 300 + 900 * lit, "#fff3c2", 0.25 * (1 - lit), 1.1) : "";
  const g = sky(c, tot, 23) + (lit > 0 ? `<rect width="${FW}" height="${FH}" fill="#1f6d8c" opacity="${(0.35 * lit).toFixed(2)}"/>` : "")
    + layer(`<rect x="-900" y="${G}" width="3800" height="1200" fill="${lit > 0 ? "#0f3a55" : P.ground}"/>` + at(0, G, whiteCity(lit, tot)) + burst + at(960, 210, plate("CHICAGO", 70), pop(a - 4.5)), c)
    + at(240, 230, year(a, 2.01, "1893", 0.95)) + at(540, 1600, plate("WESTINGHOUSE", 52), pop(a - 3.79)) + at(540, 1760, tagV("AC", "", { size: 96 }), pop(a - 5.6));
  return { g, in: [540, 900], inC: P.win, out: [540, 900], outC: "#fff4dc", outZ: 12 };
}

// ---- 10: Niagara at the bottom, Buffalo at the top ----
function v10(a, tot) {
  const c = camAt(a, [[0, 470, 1350, 1.0], [2.9, 520, 1050, 0.92], [4.0, 560, 600, 0.57], [5.75, 560, 590, 0.55]]), FY = 1700;
  const falls = `${two(`M-900 ${FY - 420}H160L200 ${FY + 300}H-900Z`, "#164a66", "#0f3a55", 0, 10)}<path d="M160 ${FY - 420}h260v720h-220Z" fill="#7fc4ff"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${190 + i * 26} ${FY - 420}V${FY + 300}" stroke="#d8f0ff" stroke-width="6" stroke-dasharray="40 50" stroke-dashoffset="${(-tot * 400 - i * 30) % 90}"/>`).join("")}
    ${[0, 1, 2, 3, 4].map((i) => { const q = ((tot * 0.5 + i / 5) % 1); return `<circle cx="${280 + 140 * Math.sin(i * 2.1)}" cy="${FY + 260 - q * 200}" r="${50 + q * 60}" fill="#fff" opacity="${(0.3 * (1 - q)).toFixed(2)}"/>`; }).join("")}`;
  // pylons climbing a long hill toward the top
  const PY = [[560, 1500], [620, 900], [680, 300], [740, -300]], TOPY = -760, h = 380;
  const tips = PY.map(([x, y]) => [x, y + pylonTips(h)[2][1] + 20]);
  const line = `M300 ${FY - 420}` + tips.map(([x, y]) => `L${x} ${y}`).join("") + `L800 ${TOPY + 80}`;
  const land = `<rect x="-1400" y="${TOPY}" width="3400" height="${FY - TOPY + 1200}" fill="${P.ground}"/>` + hills(91, -1400, 2000, TOPY + 40, 160, E.far);
  const city = skyline(81, 420, 1500, TOPY, 160, 460, "#0f3a55", seg(a, 3.59, 3.7) > 0 ? "#ffb066" : null);
  const dist = Math.round(lerp(0, 30, ease(seg(a, 4.4, 5.3)))), GX = 1080;
  const span1 = a > 4.3 ? `<path d="M${GX} ${FY - 400}V${TOPY + 60}" stroke="${P.gold}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${clamp(seg(a, 4.3, 5.2)).toFixed(3)} 1" pathLength="1"/>` + at(GX - 40, 520, tagV((dist >= 30 ? "30+" : dist), "km", { size: 150 })) : "";
  // Edison's 1.5 km to the same scale: 1/20 of the line
  const edison = a > 5.0 ? at(GX + 240, FY - 400, `<path d="M0 0V${-(FY - 400 - TOPY - 60) / 20}" stroke="${P.cream}" stroke-width="16" stroke-linecap="round"/>` + at(0, 110, tagV("1.5", "km", { size: 90, fill: P.cream })), pop(a - 5.0)) : "";
  const g = sky(c, tot, 29) + layer(land + falls + PY.map(([x, y]) => at(x, y, pylon(h))).join("") + drawn(line, seg(a, 2.98, 3.7), E.el, 8) + city + at(300, FY - 560, plate("NIAGARA", 70), pop(a - 2.6)) + at(900, TOPY - 330, plate("BUFFALO", 100), pop(a - 3.59)) + span1 + edison, c)
    + at(240, 230, year(a, 0.38, "1896", 0.95));
  return { g, in: [540, 960], inC: "#fff4dc" };
}

export const V = [
  { keys: (c) => ({ x: 960, y: 560 + (c.y - 560) * 0.5, z: c.z * 1.22 }), bg: NIGHT },                     // 0 the station, big
  { keys: (c) => ({ x: 960, y: 600, z: c.z * 1.1 }), bg: NIGHT },                                            // 1 lamps round the station
  v2,
  { keys: (c, t) => ({ x: kf(t, [[0, 520], [1.9, 860], [2.6, 1350], [5, 1420]]), y: 560, z: 1.25 + 0.04 * t }), bg: [P.night0, "#1d3f8a"] },  // 3 ship, then the suitcase
  { keys: (c) => ({ x: c.x + 10, y: c.y - 60, z: c.z * 1.0 }), bg: NIGHT },                                 // 4 Edison's door
  { keys: (c, t) => ({ x: kf(t, [[0, 660], [3.2, 680], [4.6, 1380], [6.46, 1420]]), y: 520, z: 1.0 }), bg: NIGHT },  // 5 blueprint to the gate
  { keys: (c) => ({ x: c.x, y: c.y, z: c.z * 1.05 }), bg: NIGHT },                                           // 6 step up, travel, step down
  { keys: (c) => ({ x: 960, y: c.y, z: c.z * 0.92 }), bg: ["#0e3a50", P.ground] },                           // 7 posters and cameras
  { keys: (c) => ({ x: c.x, y: c.y, z: c.z * 1.0 }), bg: ["#0a2b3c", "#061e2c"] },                           // 8 the chair
  v9,
  v10,
];
