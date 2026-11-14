// "Why the network drops": four causes and two footnotes, each a place of its own, numbered 1 to 4 by a gold disc
// at the top left. The blue phone and the tower of the route set carry through all of them.
//   0 a field at night: the blue phone drifts away from a tower; the tower's rings thin out over the gap and the
//     bars over the phone drop 5 → 1 (distance)
//   1 a concrete wall between the tower and the phone: the rings run into it and are swallowed; the concrete opens to
//     show its steel bars, and the wall gulps (walls: concrete and steel eat the wave)
//   2 a lift shaft: the phone, mid-call, slides into the steel car; the doors shut; the tower's rings bounce off the
//     box; the car rides up with the call still going (the lift: a closed metal box they ride while talking)
//   3 a stadium at night: a few phone glows, then every seat glows; the tower's gauge fills to the brim, its light
//     turns to a red ✗ and new rings bounce back (crowds: a tower carries only so many)
//   4 the phone, big: five full bars light one by one, while a loading wheel turns and turns on an empty screen;
//     beside it, a tower buried in waiting dots; the bars puff up, proud of nothing. Host left.
//   5 a phone with an empty SIM tray (✗): an SOS key, rings to three towers of three different networks, a ✓ comes
//     back from all of them, and their lights blink together. Host right.
// Shots hand over through a shape: the phone's screen (0→1), the wall (1→2), the lift doors (2→3), a seat glow (3→4),
// the screen (4→5).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { P, mix, stars, skyline } from "./bank.js";
import { hills } from "./props.js";
import { WAVE, pop, bluePhone, phone, ringing, radio, tower, bars } from "./net.js";

const G = 860;
const sky = (c, tot, seed = 3) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -600, 2600, 700, tot), c, 0.15);
const ground = (c, col = P.ground) => layer(`<rect x="-1500" y="${G}" width="5000" height="900" fill="${col}"/><rect x="-1500" y="${G}" width="5000" height="12" fill="#3c2a7a"/>`, c);
// the cause number, at the top left of the frame
const marker = (n, a) => { const on = a > 0 ? spring(a, 8, 13) : 0; return on <= 0 ? "" : at(140, 140, `${rings(0, 0, 90, P.gold, 0.22)}${disc(0, 0, 62, P.gold, P.goldD)}${text(0, 30, String(n), 84, "#8a5200")}`, on); };
// the green call icon on a phone screen (a handset), centred on the screen
const callScreen = (t) => at(0, -125, `${rings(0, 0, 34 + 4 * Math.sin(t * 6), P.green, 0.25)}<circle r="30" fill="${P.green}"/><path d="M-14 -10q4 -8 10 -4l4 6q2 4 -2 6q4 8 10 12q2 -4 6 -2l6 4q4 6 -4 10q-26 2 -30 -32z" fill="#fff"/>`);
const spinner = (t, r = 26) => at(0, -90, [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle cx="${(Math.cos(i * Math.PI / 4 + t * 5) * r).toFixed(1)}" cy="${(Math.sin(i * Math.PI / 4 + t * 5) * r).toFixed(1)}" r="${3 + i * 0.9}" fill="#5b4fa8" opacity="${(0.2 + i * 0.1).toFixed(2)}"/>`).join(""));

// ---- 0: distance ----
function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [2.9, 980, 560, 0.98], [4.89, 1060, 560, 0.93]]), TX = 360;
  const px = lerp(820, 1720, ease(seg(a, 2.95, 4.4))), d = (px - 820) / 900, n = lerp(5, 1, ease(seg(a, 3.0, 4.42)));
  const tw = at(TX, G, tower({ t: tot, lit: 1 })) + radio(TX, G - 480, tot, 1500, { n: 5, speed: 0.7, w: 14, op: 0.85 });
  const gap = a > 2.2 ? `<path d="M${TX + 60} ${G + 70}H${(px - 60).toFixed(1)}" stroke="${P.cream}" stroke-width="7" stroke-dasharray="18 18" opacity="${(0.7 * ease(seg(a, 2.2, 2.6))).toFixed(2)}"/>` : "";
  const ph = at(px, G, bluePhone({ on: 1 - 0.5 * d }), 1.25) + at(px, G - 400, bars(n, n > 2.2 ? P.green : P.red), 0.95);
  return { g: sky(c, tot) + layer(hills(4, -800, 3000, 800, 50, "#2a1f66"), c, 0.4) + ground(c) + layer(gap + tw + ph, c) + marker(1, a - 1.4), out: toScreen(c, px, G - 156), outC: "#1a1446", outZ: 14 };
}
// ---- 1: the wall ----
function s1(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.04], [3.54, 960, 540, 1.1]]), WX = 980, WW = 230, WT = G - 640, TX = 330;
  const open = ease(seg(a, 2.1, 2.5)), gulp = a > 2.62 ? 1 + 0.05 * Math.exp(-(a - 2.62) * 6) * Math.sin((a - 2.62) * 18) : 1;
  const clip = `<clipPath id="dw"><rect x="-1000" y="-1000" width="${WX - WW / 2 + 1000}" height="3000"/></clipPath>`;
  const rads = `${clip}<g clip-path="url(#dw)">${radio(TX, G - 480, tot, 1300, { n: 5, speed: 0.75, w: 14 })}</g>`;
  const glow = a > 0.8 ? `<rect x="${WX - WW / 2}" y="${WT}" width="22" height="640" fill="${WAVE}" opacity="${(0.25 + 0.15 * Math.sin(tot * 9)).toFixed(2)}"/>` : "";
  let rebar = ""; for (let i = 0; i < 4; i++) rebar += `<path d="M${-WW / 2 + 40 + i * 50} -620V-20" stroke="#8a5a4a" stroke-width="12"/>`; for (let j = 0; j < 9; j++) rebar += `<path d="M${-WW / 2 + 20} ${-600 + j * 66}H${WW / 2 - 20}" stroke="#8a5a4a" stroke-width="12"/>`;
  const wall = at(WX, G, `${two(rr(-WW / 2, -640, WW, 640, 8), "#b9b3c9", "#8f88a6", 14, 0)}${[...Array(14)].map((_, i) => `<circle cx="${-80 + rnd(i) * 160}" cy="${-600 + rnd(i + 30) * 560}" r="${4 + rnd(i + 9) * 6}" fill="#8f88a6"/>`).join("")}
    ${open > 0 ? `<path d="${rr(-WW / 2 + 24, -616, WW - 48, 592, 6)}" fill="#6e6787" opacity="${open.toFixed(2)}"/><g opacity="${open.toFixed(2)}">${rebar}</g>` : ""}`, [gulp, 2 - gulp]);
  const ph = at(1560, G, bluePhone({ on: 0.4 }), 1.25) + at(1560, G - 400, bars(0, P.red), 0.95) + (a > 3.0 ? at(1560, G - 520, cross(0, 0, 44, P.red, a - 3.0)) : "");
  return { g: sky(c, tot, 8) + ground(c) + layer(rads + glow + at(TX, G, tower({ t: tot, lit: 1 })) + wall + ph, c) + marker(2, a - 0.36), in: toScreen(c, 1560, G - 156), inC: "#1a1446", inZ: 14, out: toScreen(c, WX, G - 320), outC: "#8f88a6", outZ: 12 };
}
// ---- 2: the lift ----
const STEEL = "#aab4d4", STEELD = "#8792bb";
function s2(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [2.3, 960, 560, 1.04], [4.6, 960, 560, 1.04], [6.02, 960, 380, 0.98]]), SX = 1060, TX = 280;
  const rise = easeIn(seg(a, 4.72, 6.02)) * 520, carY = G - rise;
  const slide = ease(seg(a, 0.6, 1.4)), px = lerp(1700, SX, slide), doors = ease(seg(a, 1.98, 2.3)), box = a > 1.68 ? pop(a - 1.68) : 0;
  const shaft = `<path d="${rr(SX - 260, -400, 520, G + 400, 0)}" fill="#1f1650"/>${[0, 1, 2, 3].map((i) => `<path d="M${SX - 260} ${G - i * 520}H${SX + 260}" stroke="#3c2a7a" stroke-width="16"/>`).join("")}<path d="M${SX} -400V${carY - 470}" stroke="${STEELD}" stroke-width="8"/>`
    + `<path d="${rr(SX - 900, -400, 640, G + 400, 0)}" fill="#2a1d66"/><path d="${rr(SX + 260, -400, 700, G + 400, 0)}" fill="#2a1d66"/>` + [...Array(6)].map((_, i) => `<path d="${rr(SX + 340 + (i % 2) * 260, G - 420 - Math.floor(i / 2) * 520, 160, 180, 12)}" fill="${P.win}" opacity=".8"/>`).join("");
  const rads = radio(TX, G - 480, tot, 900, { n: 5, speed: 0.7, w: 14 });
  const bounce = a > 2.85 && a < 4.6 ? [0, 1, 2].map((i) => { const q = ((tot * 1.4 + i / 3) % 1); return `<path d="M${SX - 220 - q * 160} ${carY - 380}q${-40} 170 0 340" fill="none" stroke="${WAVE}" stroke-width="12" stroke-linecap="round" opacity="${(0.8 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const call = (o) => bluePhone({ on: 1, inner: callScreen(tot), ...o });
  const phIn = at(px, G - rise * (slide >= 1 ? 1 : 0), call(), 1.0);
  const car = `${box > 0 ? rings(SX, carY - 210, 290 * box, STEEL, 0.1) : ""}${two(rr(SX - 210, carY - 440, 420, 440, 16), "#5b5f86", "#474a6d", 10, 0)}<path d="${rr(SX - 180, carY - 410, 360, 390, 10)}" fill="#2a2a4a"/>`;
  const doorL = doors > 0 ? `<path d="${rr(SX - 180, carY - 410, 180 * doors, 390, 4)}" fill="${STEEL}"/><path d="${rr(SX + 180 - 180 * doors, carY - 410, 180 * doors, 390, 4)}" fill="${STEELD}"/>` : "";
  const port = doors > 0.95 ? `<circle cx="${SX}" cy="${carY - 300}" r="44" fill="#1a1446" stroke="${STEELD}" stroke-width="10"/><circle cx="${SX}" cy="${carY - 300}" r="18" fill="${P.green}" opacity="${(0.6 + 0.4 * Math.sin(tot * 6)).toFixed(2)}"/>` : "";
  return { g: sky(c, tot, 12) + ground(c) + layer(shaft + rads + at(TX, G, tower({ t: tot, lit: 1 })) + car + phIn + doorL + port + bounce, c) + marker(3, a - 0.26), in: toScreen(c, SX, G - 320), inC: "#8f88a6", inZ: 12, out: toScreen(c, SX, carY - 210), outC: STEEL, outZ: 12 };
}
// ---- 3: the crowd ----
const SEATS = (() => { const out = []; for (let r = 0; r < 7; r++) for (let i = 0; i < 26 + r * 4; i++) { const an = Math.PI * (0.06 + 0.88 * (i + 0.5) / (26 + r * 4)), rx = 380 + r * 52, ry = 120 + r * 26; out.push([-Math.cos(an) * rx, -Math.sin(an) * ry * 0.9 - r * 22, rnd(r * 97 + i)]); } return out; })();
function s3(a, tot) {
  const c = camAt(a, [[0, 920, 540, 0.96], [3.6, 940, 530, 1.0], [6.44, 960, 520, 1.03]]), ST = [820, G - 40], TX = 1520;
  const lit = (r) => (a > 0.83 && r < 0.06) || (a > 3.92 && r < kf(a, [[3.92, 0.06], [4.7, 1]])), fill = clamp(kf(a, [[0.8, 0.08], [1.5, 0.22], [3.9, 0.3], [5.3, 1]]));
  let seats = ""; for (const [x, y, r] of SEATS) seats += lit(r) ? `<circle cx="${(ST[0] + x).toFixed(1)}" cy="${(ST[1] + y).toFixed(1)}" r="8" fill="#9fe7ff"/>` + (r < 0.02 ? rings(ST[0] + x, ST[1] + y, 14, "#9fe7ff", 0.3) : "") : `<circle cx="${(ST[0] + x).toFixed(1)}" cy="${(ST[1] + y).toFixed(1)}" r="6" fill="#3a2f80"/>`;
  const bowl = `<path d="M${ST[0] - 760} ${ST[1] - 200}Q${ST[0]} ${ST[1] - 520} ${ST[0] + 760} ${ST[1] - 200}L${ST[0] + 700} ${ST[1] + 40}H${ST[0] - 700}Z" fill="#2c2370"/><ellipse cx="${ST[0]}" cy="${ST[1] - 40}" rx="330" ry="90" fill="#2f9a5e"/><ellipse cx="${ST[0]}" cy="${ST[1] - 40}" rx="330" ry="90" fill="none" stroke="#eaffef" stroke-width="5" opacity=".6"/>`
    + [-1, 1].map((s) => `<path d="M${ST[0] + s * 700} ${ST[1] - 220}V${ST[1] - 520}" stroke="${P.steelD}" stroke-width="12"/><path d="${rr(ST[0] + s * 700 - 60, ST[1] - 560, 120, 50, 10)}" fill="#fff3c2"/>`).join("");
  const full = a > 5.43 ? a - 5.43 : 0;
  const gauge = at(TX + 200, G - 60, `${two(rr(-46, -420, 92, 420, 20), "#3a2f80", "#2c2370", 0, 0)}<path d="${rr(-34, -408 + 396 * (1 - fill), 68, 396 * fill, 14)}" fill="${fill > 0.95 ? P.red : WAVE}"/>${full > 0 ? `<path d="M-40 -440q40 -40 80 0" fill="none" stroke="${P.red}" stroke-width="10" opacity="${(0.8 * Math.abs(Math.sin(tot * 6))).toFixed(2)}"/>` : ""}`);
  const up = a > 3.92 ? [0, 1, 2, 3, 4].map((i) => { const q = ((tot * 1.1 + i / 5) % 1), x = ST[0] + (i - 2) * 160, y = ST[1] - 300 - q * 300; return full > 0 && q > 0.5 ? "" : `<path d="M${x - 40} ${y}q40 -30 80 0" fill="none" stroke="${WAVE}" stroke-width="9" opacity="${(0.7 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const back = full > 0 ? [0, 1, 2].map((i) => { const q = ((tot * 1.4 + i / 3) % 1); return `<path d="M${TX - 120 - q * 260} ${G - 560 + i * 60}q-30 30 0 60" fill="none" stroke="${P.red}" stroke-width="10" opacity="${(0.8 * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  const tw = at(TX, G, tower({ t: tot, lit: 1 })) + (full > 0 ? at(TX, G - 650, cross(0, 0, 50, P.red, full)) : "");
  return { g: sky(c, tot, 21) + layer(skyline(3, -600, 2600, G, 60, 160, "#271b62", "#ffb066"), c, 0.5) + ground(c) + layer(bowl + seats + up + tw + gauge + back, c) + marker(4, a - 0.41),
    in: toScreen(c, SX2, G - 320), inC: STEEL, inZ: 12, out: toScreen(c, ST[0] - 120, ST[1] - 200), outC: "#9fe7ff", outZ: 18 };
}
const SX2 = 960;
// ---- 4: full bars, nothing loads ----
function s4(a, tot) {
  const c = camAt(a, [[0, 1000, 520, 1.0], [7.62, 1010, 520, 1.05]]), PX = 960, K = 2.75;
  const n = kf(a, [[0.38, 0], [1.84, 5]], (p) => p), proud = a > 5.67 ? spring(a - 5.67, 6, 10) : 0, wheel = a > 3.3 ? 1 : 0;
  const inner = (wheel ? spinner(tot) : "") + at(-4, -166, bars(n, mix(P.green, P.gold, clamp(proud)), "#c9d7ee"), 0.4 * (1 + 0.1 * proud));
  const ph = at(PX, 930, phone({ on: 1, screen: "#eef6ff", inner }), K);
  const busy = a > 2.44 ? at(1590, G, tower({ t: tot, lit: 1 }), 0.75 * pop(a - 2.44)) + [...Array(26)].map((_, i) => { const q = pop(a - 2.6 - i * 0.03); return q > 0 ? `<circle cx="${1590 + Math.cos(i * 0.9) * (90 + (i % 5) * 26)}" cy="${G - 300 + Math.sin(i * 0.9) * (90 + (i % 5) * 22)}" r="${11 * q}" fill="#9fe7ff"/>` : ""; }).join("") : "";
  return { g: sky(c, tot, 30) + ground(c) + layer(busy + ph, c), in: toScreen(c, PX, 930 - 125 * K), inC: "#9fe7ff", inZ: 18, out: toScreen(c, PX, 930 - 125 * K), outC: "#eef6ff", outZ: 16 };
}
// ---- 5: the emergency number, on any network, without a SIM ----
function s5(a, tot) {
  const c = camAt(a, [[0, 960, 520, 1.0], [7.59, 940, 520, 1.03]]), PX = 520, PY = 920, K = 2.3;
  const press = a > 0.95 ? spring(a - 0.95, 9, 16) : 0, call = a > 1.4;
  const sos = at(0, -125, `${call ? rings(0, 0, 50 + 6 * Math.sin(tot * 7), P.red, 0.3) : ""}${disc(0, 0, 38 * (1 - 0.15 * Math.sin(Math.PI * clamp(press))), P.red, P.redD)}${text(0, 9, "SOS", 26, "#fff")}`);
  const ph = at(PX, PY, phone({ on: 1, screen: "#eef6ff", inner: sos }), K);
  const tray = at(PX + 300, PY - 170, `<path d="${rr(-60, -90, 120, 180, 14)}" fill="#2c2370"/><path d="M-44 -74H24L44 -54V74H-44Z" fill="none" stroke="${P.cream}" stroke-width="6" stroke-dasharray="14 10"/>${a > 3.21 ? cross(0, 0, 34, P.red, a - 3.21) : ""}`, 1.7 * pop(a - 2.9));
  const TW = [[1030, "#b07bff"], [1245, WAVE], [1460, "#ffa04a"]], go = seg(a, 4.0, 4.76), sync = a > 5.29;
  const towers = TW.map(([x, col], i) => { const blink = sync ? 0.5 + 0.5 * Math.sin(tot * 6) : 0.5 + 0.5 * Math.sin(tot * 4 + i * 2);
    return at(x, G, tower({ t: 0, lit: 1, c: mix("#c7cfe8", col, 0.35) }), 0.82) + `<circle cx="${x}" cy="${G - 606 * 0.82}" r="${14 + (sync ? 8 * blink : 0)}" fill="${sync ? mix(P.gold, "#fff", blink) : mix(P.redD, P.red, blink)}"/>`; }).join("");
  const links = TW.map(([x, col], i) => { const u = seg(go, i * 0.15, 0.6 + i * 0.15); return u > 0 ? drawn(`M${PX + 60} ${PY - 330}Q${(PX + x) / 2} ${PY - 700} ${x} ${G - 400}`, u, col, 10, 'stroke-dasharray="20 16"') : ""; }).join("");
  const ok = a > 4.76 ? at(PX, PY - 760, check(0, 0, 70, P.green, a - 4.76)) : "";
  return { g: sky(c, tot, 44) + ground(c) + layer(towers + links + tray + ph + ok, c), in: toScreen(c, PX, PY - 125 * K), inC: "#eef6ff", inZ: 16 };
}

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const dropSet = makeSet(SHOTS, [], P);
