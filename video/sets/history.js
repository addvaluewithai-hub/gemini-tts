// "History" (network part 1): before cells, and the first handheld call. Six shots, nothing to read but a date, a name
// and a company sign.
//   0 an old city at night; a car with a phone drives in, the camera pulls back to one giant tower over the whole city,
//     and one huge ring sweeps over every roof
//   1 the tower's few channels: six lamps on its board light one by one (six calls); pull back: a whole city waiting
//   2 a queue of cars under the tower, each with a grey phone bubble; a lamp frees, one car goes; then the giant tower
//     sinks and many small towers pop up, each with its own hexagon cell, and every car's bubble lights (the idea of cells)
//   3 3 APR 1973: a New York street at dawn; a name plate MARTIN COOPER; the brick phone drops onto the pavement
//   4 the camera rises with the first call: rings from the brick reach a tower on a roof, which flares gold
//   5 the call crosses the street to the rival's building (BELL LABS): an unfinished brick on its drawing table, then its
//     desk phone rings and every window flashes
// Shots 0–2 are one city seen by one camera, and 3–5 one street (the camera carries on, no hand-over shape inside them).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, cross, makeSet, FW, FH } from "./kit.js";
import { P, mix, stars, skyline, dusk } from "./bank.js";
import { calPage, car } from "./props.js";
import { tower, radio, brick, hexPath, ringing, pop, WAVE, WAVED } from "./net.js";

// a telephone receiver, 100 wide, centred
const handset = (c = P.ink) => `<path d="M-34 10Q0 -36 34 10" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/><path d="${rr(-52, 0, 34, 22, 9)}" fill="${c}"/><path d="${rr(18, 0, 34, 22, 9)}" fill="${c}"/>`;
// a speech bubble with a receiver in it; on = lit (gold) or waiting (grey)
const bubble = (on, k = 1) => at(0, 0, `${two("M-70 -60h140a20 20 0 0 1 20 20v60a20 20 0 0 1 -20 20h-40l-30 30l-6 -30h-64a20 20 0 0 1 -20 -20v-60a20 20 0 0 1 20 -20Z", mix("#6b6596", P.cream, on), mix("#4b4576", P.creamD, on), 0, 7)}${at(0, -14, handset(mix("#2a2550", "#8a5200", on)))}`, k);
// an old car with a whip aerial
const oldCar = (c, cD, wobble = 0) => `<path d="M90 -84L120 -230" stroke="${P.steelD}" stroke-width="6" stroke-linecap="round" transform="rotate(${(wobble * 6).toFixed(2)} 90 -84)"/>${car(c, cD)}`;

// ---- 0–2: the city of one tower ----
const G = 900, TX = 960, TK = 1.45;
const CARC = [[P.red, P.redD], [P.blue, P.blueD], [P.teal, P.tealD], [P.pink, P.pinkD], [P.gold, P.goldD], [P.violet, P.violetD]];
const LAMP = (i) => [TX - 250 + i * 100, 330];
function city(t, c, tot, s) {
  const e = s.ends || [4.25, 3.81, 5.26], T1 = e[0], T2 = T1 + e[1], u1 = t - T1, u2 = t - T2;
  // the giant tower sinks into the ground when the idea of cells comes in; small towers pop up in its place
  const sink = easeIn(seg(u2, 2.0, 2.6)), small = (i) => (u2 > 2.35 + i * 0.07 ? pop(u2 - 2.35 - i * 0.07) : 0);
  const giant = sink < 1 ? at(TX, G + 1100 * sink, tower({ t: tot, lit: t > 3.37 && u1 < 0 ? 1 - seg(t, 3.9, 4.3) * 0.5 : 0 }), TK) : "";
  // its board of six channels
  const lampOn = (i) => { if (u1 < 0) return 0; const on = u1 > 0.4 + [0, 0.2, 0.45, 0.9, 1.15, 1.4][i] ? 1 : 0; if (i === 0 && u2 > 0.72) return 1 - seg(u2, 0.72, 0.85) + (u2 > 1.2 ? 1 : 0) * seg(u2, 1.2, 1.35); return on; };
  const boardK = u1 > 0 ? pop(u1 - 0.1) : 0;
  let board = "";
  if (boardK > 0 && sink < 0.5) { board += `<path d="M${TX} 300V${380 - 70}" stroke="${P.steelD}" stroke-width="10"/>` + at(TX, 330, `${two(rr(-310, -60, 620, 120, 24), "#2c2766", "#1a1446", 0, 8)}`, boardK);
    for (let i = 0; i < 6; i++) { const [x, y] = LAMP(i), on = lampOn(i); board += at(x, y, `${on > 0 ? rings(0, 0, 46, P.gold, 0.3 * on) : ""}${disc(0, 0, 34, mix("#4b4576", P.gold, on), mix("#3a3463", P.goldD, on))}`, boardK); } }
  // one ring that sweeps over the whole city
  const sweep = t > 3.37 && u1 < 0 ? rings(TX, G - 760 * TK / 1.45, 200 + 1400 * seg(t, 3.37, 4.25), WAVE, 0.14 * (1 - seg(t, 3.9, 4.25)), 1.03) : "";
  const thin = t > 3.37 && u1 < 0.5 ? radio(TX, G - 700, tot, 1500, { n: 2, speed: 0.6, w: 8, op: 0.5 }) : "";
  // lines from the lamps down to the cars that hold them (shot 1)
  let links = "";
  if (u1 > 0 && u2 < 0) for (let i = 0; i < 6; i++) { const on = lampOn(i); if (on <= 0) continue; const [x, y] = LAMP(i), cx = 260 + i * 290; links += drawn(`M${x} ${y + 34}Q${(x + cx) / 2} ${y + 300} ${cx} ${G - 260}`, seg(u1, 0.4 + i * 0.22, 0.75 + i * 0.22), P.gold, 6, 'stroke-dasharray="6 16" opacity=".8"'); }
  // cars: shot 0 one car drives in; shot 1 six cars talking along the avenue; shot 2 a queue left of the tower
  let cars = "";
  if (u1 < 0) { const x = lerp(-300, 560, easeOut(seg(t, 0.1, 1.3))), b = t > 1.13 ? pop(t - 1.13) : 0;
    cars += at(x, G, oldCar(P.red, P.redD, Math.sin(tot * 8) * (1 - seg(t, 1.3, 1.8))), 1.2) + (b > 0 ? at(x + 10, G - 300, bubble(1, b)) : ""); }
  else if (u2 < 0) { for (let i = 0; i < 6; i++) { const x = 260 + i * 290, on = lampOn(i), [cc, cD] = CARC[i]; cars += at(x, G, oldCar(cc, cD), 0.9) + at(x, G - 230, bubble(on, 0.8)); } }
  else { const go = ease(seg(u2, 0.75, 1.5)), allOn = seg(u2, 3.35, 3.7);
    for (let i = 0; i < 6; i++) { const slot = i - go, x = 760 - slot * 260 + (i === 0 ? 1500 * go : 0), [cc, cD] = CARC[i], on = i === 0 ? clamp(go * 2) : allOn; if (x < -300) continue;
      cars += at(x, G, oldCar(cc, cD, i === 0 ? Math.sin(tot * 9) * go : 0), 0.9) + at(x, G - 230, bubble(on, 0.8 * (1 + (i > 0 && allOn > 0 && allOn < 1 ? 0.1 * Math.sin(allOn * Math.PI) : 0)))); } }
  // the idea of cells: small towers, each with its hexagon
  let cells = "";
  if (u2 > 2.3) { const SP = [[200, 760], [560, 700], [960, 780], [1360, 690], [-160, 700], [2200, 760], [-520, 760]];
    SP.forEach(([x, y], i) => { const k = small(i); if (k <= 0) return; cells += `<path d="${hexPath(x, y - 260, 210 * k)}" fill="${GROUPC[i % 3]}" opacity=".14" stroke="${GROUPC[i % 3]}" stroke-width="8" stroke-opacity=".6"/>` + at(x, y, tower({ t: tot + i, lit: seg(u2, 3.35, 3.6) }), 0.5 * k); }); }
  const ground = `<rect x="-2000" y="${G}" width="6000" height="900" fill="#1f1650"/><rect x="-2000" y="${G}" width="6000" height="12" fill="#3a2f80"/><rect x="-2000" y="${G + 40}" width="6000" height="90" fill="#150f3a"/><path d="M-2000 ${G + 85}H4000" stroke="#ffb066" stroke-width="6" stroke-dasharray="50 50" opacity=".4"/>`;
  return `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(41, 120, -1500, 3500, 900, tot), c, 0.15) + layer(`<circle cx="1500" cy="160" r="60" fill="${P.cream}"/><circle cx="1480" cy="146" r="54" fill="${P.night0}"/>`, c, 0.15)
    + layer(skyline(23, -1600, 3600, G - 40, 120, 360, "#251a5c", "#ffb066"), c, 0.5) + layer(skyline(29, -1600, 3600, G, 80, 220, "#2f2270", "#ffd27a"), c, 0.75)
    + layer(ground + sweep + thin + cells + giant + board + links + cars, c);
}
const GROUPC = ["#ff5fa2", "#3fa9ff", "#ffd04a"];
function s0(a, tot, s) { const c = camAt(a, [[0, 520, 760, 1.55], [1.4, 600, 740, 1.5], [2.2, 640, 720, 1.4], [3.0, 960, 420, 0.62], [4.25, 960, 430, 0.6]]); return { g: city(a, c, tot, s) }; }
function s1(a, tot, s) { const T1 = (s.ends || [])[0] || 4.25, c = camAt(a, [[0, 960, 430, 0.6], [0.4, 960, 420, 1.05], [2.6, 960, 480, 0.95], [3.81, 960, 560, 0.78]]); return { g: city(T1 + a, c, tot, s) }; }
function s2(a, tot, s) { const e = s.ends || [4.25, 3.81], T2 = e[0] + e[1], c = camAt(a, [[0, 960, 560, 0.78], [1.6, 820, 620, 0.85], [2.2, 900, 580, 0.8], [5.26, 900, 580, 0.82]]);
  return { g: city(T2 + a, c, tot, s), out: toScreen(c, 960, 520), outC: "#ffb066", outZ: 18 }; }

// ---- 3–5: a street in New York, dawn, 3 April 1973 ----
const SG = 880, BX = 700, ROOF = [1300, 300], RIV = 2700;
function street(t, c, tot, s) {
  const e = s.ends || [4.25, 3.81, 5.26, 6.15, 3.39], T4 = e[3], T5 = T4 + e[4], u4 = t - T4, u5 = t - T5;
  const cal = t > 0.94 && u4 < 0.6 ? at(380, 330, calPage("1973", "3 APR", 1, 150), pop(t - 0.94) * (1 - ease(seg(u4, 0.1, 0.6)))) : "";
  const plate = t > 3.69 && u4 < 0.4 ? at(BX, SG - 560, `${two(rr(-230, -44, 460, 88, 20), P.gold, P.goldD, 0, 8)}${text(0, 18, "MARTIN COOPER", 54, "#8a5200")}`, pop(t - 3.69) * (1 - ease(seg(u4, 0, 0.4)))) : "";
  // the brick drops onto the pavement and stands
  const fall = seg(t, 4.49, 4.8), land = t > 4.8 ? spring(t - 4.8, 8, 15) : 0, by = t < 4.8 ? lerp(-700, SG, easeIn(fall)) : SG, sq = t > 4.8 ? 0.1 * (1 - land) : 0;
  const theBrick = t > 4.49 ? at(BX, by, `${t > 4.8 ? rings(0, -240, 300 * (0.7 + 0.3 * land), P.gold, 0.12) : ""}${brick()}`, [1 + sq, 1 - sq]) : "";
  // the first call: rings up to the roof tower, which flares gold
  const call = u4 > 0.55 ? radio(BX + 30, SG - 520, tot, 260, { n: 3, speed: 1.4, w: 9 }) : "";
  const leg = (p0, p1, cpt, p, col = WAVE) => (p > 0 ? drawn(`M${p0[0]} ${p0[1]}Q${cpt[0]} ${cpt[1]} ${p1[0]} ${p1[1]}`, p, col, 10, 'stroke-dasharray="20 18"') : "");
  const up = leg([BX + 30, SG - 520], [ROOF[0], ROOF[1] - 420], [BX + 200, ROOF[1] - 700], seg(u4, 0.64, 1.1));
  const flare = u4 > 1.09 ? rings(ROOF[0], ROOF[1] - 380, 120 + 60 * spring(u4 - 1.09, 6, 10), P.gold, 0.3) + star(ROOF[0] + 120, ROOF[1] - 520, 50 * pop(u4 - 1.09), tot) : "";
  const across = leg([ROOF[0], ROOF[1] - 420], [RIV - 300, 180], [(ROOF[0] + RIV) / 2, -300], seg(u5, 0.3, 1.2), P.gold);
  // the rival's building: its sign lights, its drawing table with an unfinished brick, then its desk phone rings
  const sign = u5 > 0.97 ? pop(u5 - 0.97) : 0, ringA = u5 > 4.91 ? 1 : 0, flash = u5 > 5.0 ? 0.5 + 0.5 * Math.sin(tot * 18) : 0;
  const winC = (i, j) => (flash > 0 && (i + j) % 2 === Math.floor(tot * 6) % 2 ? P.gold : (rnd(i * 5 + j) > 0.4 ? "#ffd27a" : "#3a2f80"));
  let wins = ""; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { if (i >= 1 && i <= 4 && j >= 2 && j <= 5) continue; wins += `<rect x="${RIV - 380 + i * 130}" y="${150 + j * 110}" width="80" height="80" rx="8" fill="${winC(i, j)}"/>`; }
  const desk = u5 > 2.6 ? at(RIV + 20, 790, `${two(rr(-200, -12, 400, 24, 8), P.wood, P.woodD, 0, 6)}<path d="M-160 12V140M160 12V140" stroke="${P.woodD}" stroke-width="14"/>${at(-90, -12, brickSketch(seg(u5, 2.6, 3.4)), 0.7)}${u5 > 3.0 ? at(-200, -200, text(0, 0, "?", 160, P.gold), pop(u5 - 3.0)) : ""}
      ${at(110, -12, ringing(deskPhone(), tot, ringA * (1 - seg(u5, 5.9, 6.17) * 0.5)), 1.5)}`) : "";
  const rival = `${two(rr(RIV - 450, 100, 900, SG - 100), "#3c3088", "#2c2370", 18, 0)}<path d="${rr(RIV - 270, 360, 520, 450, 16)}" fill="#ffe2a8"/><path d="${rr(RIV - 270, 360, 520, 450, 16)}" fill="none" stroke="#2c2370" stroke-width="18"/>${wins}
    ${at(RIV, 30, `${two(rr(-300, -60, 600, 120, 24), mix("#2c2766", P.ink, 0), P.ink, 0, 8)}${text(0, 34, "BELL LABS", 92, mix("#4a3a80", P.gold, sign))}${sign > 0.5 ? rings(0, 0, 200, P.gold, 0.1 * sign, 1.2) : ""}`, 0.6 + 0.4 * sign)}${desk}`;
  const near = `${two(rr(ROOF[0] - 300, ROOF[1], 600, SG - ROOF[1] + 200), "#4a3a96", "#382c7d", 16, 0)}${[0, 1, 2].map((i) => [0, 1, 2, 3].map((j) => `<rect x="${ROOF[0] - 230 + i * 170}" y="${ROOF[1] + 60 + j * 130}" width="100" height="80" rx="8" fill="${rnd(i * 3 + j + 9) > 0.5 ? "#ffd27a" : "#2c2370"}"/>`).join("")).join("")}${at(ROOF[0], ROOF[1], tower({ t: tot, lit: u4 > 1.09 ? 1 : 0 }), 0.6)}`;
  const pave = `<rect x="-2000" y="${SG}" width="7000" height="70" fill="#8a7fb8"/><rect x="-2000" y="${SG + 70}" width="7000" height="20" fill="#5a4f8f"/><rect x="-2000" y="${SG + 90}" width="7000" height="600" fill="#241a55"/><path d="M-2000 ${SG + 200}H5000" stroke="${P.gold}" stroke-width="8" stroke-dasharray="80 60" opacity=".5"/>`;
  return dusk(c, tot, 1650, 320) + layer(skyline(73, -1800, 4200, SG - 20, 300, 700, "#5a2a8c", "#ffb066"), c, 0.4) + layer(skyline(79, -1800, 4200, SG, 200, 420, "#472080", "#ffd27a"), c, 0.65)
    + layer(pave + near + rival + up + across + call + theBrick + flare + plate + cal, c);
}
const star = (x, y, r, tot) => (r <= 0 ? "" : at(x, y, `<path d="M0 ${-r}L${r * 0.25} ${-r * 0.25}L${r} 0L${r * 0.25} ${r * 0.25}L0 ${r}L${-r * 0.25} ${r * 0.25}L${-r} 0L${-r * 0.25} ${-r * 0.25}Z" fill="#fff"/>`, 1, tot * 60));
const deskPhone = () => `${two("M-80 0L-60 -70H60L80 0Z", "#2c2a3a", "#1a1826", 0, 6)}${at(0, -86, handset("#2c2a3a"), 1.2)}<circle cx="0" cy="-36" r="20" fill="#e9e2cf"/>`;
// the rival's own brick, still a sketch: drawn lines that are not finished
const brickSketch = (p) => `<path d="${rr(-60, -420, 120, 420, 18)}" pathLength="1" fill="none" stroke="${P.blueD}" stroke-width="12" stroke-dasharray="${(0.7 * p).toFixed(3)} 1"/><path d="M30 -420V-520" stroke="${P.blueD}" stroke-width="12" stroke-dasharray="14 14" opacity="${p > 0.8 ? 1 : 0}"/>`;
function s3(a, tot, s) { const c = camAt(a, [[0, 760, 520, 0.9], [3.5, 760, 540, 0.95], [4.4, 720, 600, 1.05], [6.15, 720, 610, 1.1]]); return { g: street(a, c, tot, s), in: toScreen(c, 1650, 320), inC: "#ffb066", inZ: 18 }; }
function s4(a, tot, s) { const T4 = (s.ends || [])[3] || 6.15, c = camAt(a, [[0, 720, 610, 1.1], [0.5, 760, 560, 1.0], [1.4, 1000, 360, 0.8], [3.39, 1040, 350, 0.82]]); return { g: street(T4 + a, c, tot, s) }; }
function s5(a, tot, s) { const e = s.ends || [], T5 = (e[3] || 6.15) + (e[4] || 3.39), c = camAt(a, [[0, 1040, 350, 0.82], [0.3, 1150, 340, 0.8], [1.3, 2100, 420, 0.75], [2.4, 2600, 520, 0.92], [4.4, 2620, 540, 1.0], [6.17, 2500, 500, 0.86]]); return { g: street(T5 + a, c, tot, s) }; }

const SHOTS = [s0, s1, s2, s3, s4, s5];
export const historySet = makeSet(SHOTS, [], P);
