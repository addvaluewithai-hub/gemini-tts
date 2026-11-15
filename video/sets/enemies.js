// "Enemies of the grid" (electricity part 3 of 4): four shots, nothing to read but years, names and numbers.
//   0 the Sun throws a storm at the Earth (1989); the camera dives into the Earth onto QUEBEC, which goes dark in 90 s
//   1 1859: a telegraph office whose key and wires spark by themselves; then the camera pans out to today's dense grid
//     under the same sky, and a big "?"
//   2 Dec 2015, UKRAINE: a remote cursor clicks substation switches open one after another on a screen; 225,000 homes go
//     dark; a gold "1st" badge (host right)
//   3 a squirrel climbs a pole onto the transformer, a flash, the street goes dark; the squirrel leaps away unharmed; pull
//     back over more streets whose transformers flash one after another
// No people: the attack is a cursor on a screen. Props shared with the recap are exported (sun, squirrel, cursor, tree, snowflake).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, check, cross, FW, FH, makeSet, portrait } from "./kit.js";
import { V } from "./enemies.v.js";
import { P, E, mix, stars, house, pop, plate, tagV, pylon, pylonTips, span, bolt, spark } from "./elec.js";
import { calPage } from "./props.js";
import { stopwatch, screen, homes, RED } from "./balance.js";

const SPACE = "#03101b";
// ---- props (centre unless noted) ----
// the Sun with its corona; flare 0..1 grows the rings
export const sun = (r = 160, t = 0, flare = 0) => `${rings(0, 0, r * (1.25 + 0.25 * flare + 0.03 * Math.sin(t * 2)), "#ffcf6b", 0.18 + 0.2 * flare, 1.45)}${Array.from({ length: 12 }, (_, i) => { const q = i / 12 * 2 * Math.PI + t * 0.1, L = r * (1.18 + 0.12 * Math.sin(t * 3 + i)); return `<path d="M${(r * 1.02 * Math.cos(q)).toFixed(1)} ${(r * 1.02 * Math.sin(q)).toFixed(1)}L${(L * Math.cos(q)).toFixed(1)} ${(L * Math.sin(q)).toFixed(1)}" stroke="#ffb04a" stroke-width="${r * 0.08}" stroke-linecap="round"/>`; }).join("")}${disc(0, 0, r, "#ffd04a", "#f09a1a", 0.12)}`;
// the Earth: an ocean disc with a few teal continents; `inner` is drawn clipped to the disc
export const earth = (r = 170, inner = "", o = {}) => { const id = "ear" + Math.round(r) + (o.id || "");
  const land = `<path d="M${-r * 0.7} ${-r * 0.2}Q${-r * 0.4} ${-r * 0.7} ${-r * 0.05} ${-r * 0.45}Q${r * 0.15} ${-r * 0.15} ${-r * 0.2} ${r * 0.05}Q${-r * 0.5} ${r * 0.25} ${-r * 0.7} ${-r * 0.2}Z" fill="#1f8a7a"/><path d="M${r * 0.15} ${r * 0.2}Q${r * 0.5} ${-r * 0.1} ${r * 0.7} ${r * 0.25}Q${r * 0.55} ${r * 0.65} ${r * 0.2} ${r * 0.55}Z" fill="#1f8a7a"/>`;
  return `<clipPath id="${id}"><circle r="${r}"/></clipPath>${disc(0, 0, r, "#1d5f8a", "#164a6a", 0.1)}<g clip-path="url(#${id})">${land}${inner}</g>${o.ring ? `<circle r="${r * 1.12}" fill="none" stroke="${E.el}" stroke-width="${r * 0.05}" opacity="${o.ring.toFixed(2)}"/>` : ""}`; };
// a squirrel, sitting, facing right, base on y = 0, about 120 tall; o.puff 0..1 fluffs the tail (surprised), o.leap tilts it
export const squirrel = (t = 0, o = {}) => { const puff = o.puff || 0, c = "#b06a3a", cD = "#8a4f28", w = 1 + 0.35 * puff;
  return `<path d="M-30 -20Q${-90 * w} -40 ${-80 * w} ${-110 * w}Q${-60 * w} ${-160 * w} ${-20} ${-130 * w}Q${-50 * w} -100 -20 -40Z" fill="${cD}"/><path d="M-26 -26Q${-76 * w} -44 ${-68 * w} ${-104 * w}Q${-54 * w} ${-140 * w} -24 ${-118 * w}" fill="none" stroke="#d48c56" stroke-width="10" stroke-linecap="round"/>
    ${two("M-30 0Q-40 -60 0 -70Q40 -66 34 -20Q30 0 -30 0Z", c, cD, 0, 6)}${two("M14 -62Q10 -96 40 -100Q66 -96 60 -70Q52 -54 24 -56Z", c, cD, 0, 5)}
    <path d="M22 -96L30 -116L38 -98Z" fill="${cD}"/><circle cx="46" cy="-80" r="${5 + 3 * puff}" fill="${P.ink}"/><circle cx="48" cy="-82" r="2" fill="#fff"/><circle cx="62" cy="-70" r="4" fill="${P.ink}"/>
    <path d="M-6 -2Q0 -20 14 -14" fill="none" stroke="${cD}" stroke-width="8" stroke-linecap="round"/><path d="M20 -40Q30 -30 40 -38" fill="none" stroke="${cD}" stroke-width="7" stroke-linecap="round"/>`; };
// a mouse pointer (tip at 0,0); click 0..1 shows a ring
export const cursor = (k = 1, click = 0) => `${click > 0 && click < 1 ? `<circle r="${(14 + 46 * click) * k}" fill="none" stroke="${P.gold}" stroke-width="${6 * k}" opacity="${(1 - click).toFixed(2)}"/>` : ""}<path d="M0 0L0 ${58 * k}L${14 * k} ${45 * k}L${25 * k} ${70 * k}L${35 * k} ${65 * k}L${24 * k} ${41 * k}L${42 * k} ${41 * k}Z" fill="#fff" stroke="${P.ink}" stroke-width="${4 * k}" stroke-linejoin="round"/>`;
// a tree, base on y = 0, h tall
export const tree = (h = 200, c = "#2f9a6a", cD = "#1f7a52") => `<rect x="${-h * 0.05}" y="${-h * 0.45}" width="${h * 0.1}" height="${h * 0.45}" fill="${P.woodD}"/>${disc(0, -h * 0.62, h * 0.3, c, cD)}${disc(-h * 0.2, -h * 0.5, h * 0.22, c, cD)}${disc(h * 0.2, -h * 0.5, h * 0.22, c, cD)}`;
// a snowflake (centre), r
export const snowflake = (r = 60, c = "#dff4ff") => [0, 1, 2, 3, 4, 5].map((i) => `<g transform="rotate(${i * 60})"><path d="M0 0V${-r}M0 ${-r * 0.55}L${-r * 0.22} ${-r * 0.78}M0 ${-r * 0.55}L${r * 0.22} ${-r * 0.78}" stroke="${c}" stroke-width="${r * 0.12}" stroke-linecap="round"/></g>`).join("");
// the Ukrainian flag (centre), w wide
const flagUA = (w = 180) => { const h = w * 2 / 3; return `<path d="${rr(-w / 2, -h / 2, w, h / 2 + 1, 8)}" fill="#2f6fd6"/><path d="${rr(-w / 2, 0, w, h / 2, 8)}" fill="#ffd04a"/>`; };
// a substation box with a switch (centre); open 0..1 lifts the blade, lit 0..1 for the little lamp
const sub = (open, lit) => `${two(rr(-70, -50, 140, 100, 14), "#5b7f8f", "#45687a", 0, 6)}${disc(-36, 14, 9, P.steel, P.steelD)}${disc(36, 14, 9, P.steel, P.steelD)}<g transform="translate(-36 14) rotate(${(-60 * ease(open)).toFixed(1)})"><path d="${rr(-4, -6, 78, 12, 6)}" fill="${open > 0.5 ? RED : P.gold}"/></g><circle cx="0" cy="-30" r="9" fill="${mix("#2a3f4a", P.green, lit)}"/>`;
const tagBox = (t, size = 70, fill = P.gold) => { const w = String(t).length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };
const night = (c, tot, seed = 5) => `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(seed, 110, -1200, 3200, 1200, tot), c, 0.15);

// ---- 0: 1989, the Sun hits the Earth; Quebec goes dark in 90 s ----
// Quebec (map drawn in a 1000-unit space, shown inside the Earth at scale QK)
const QK = 0.2;
const QUEBEC = "M-560 -300L-380 -420L-120 -440L120 -400L360 -330L520 -200L560 -20L470 160L300 300L60 360L-160 330L-360 240L-520 80L-600 -120Z";
const QCITY = [[-300, 180], [-120, 230], [60, 250], [220, 180], [-200, 40], [0, 80], [180, 30], [-60, -100], [140, -160], [-260, -180], [320, -60], [-400, -40]];
function s0(a, tot) {
  const v = portrait(), SX = v ? 960 : 330, SY = v ? -60 : 540, EX = v ? 960 : 1500, EY = v ? 980 : 520;
  const c = camAt(a, v ? [[0, 960, 520, 0.92], [5.6, 960, 540, 0.95], [6.6, EX, EY, 5.6], [10.68, EX, EY + 2, 5.8]] : [[0, 960, 540, 1.0], [5.6, 930, 540, 1.04], [6.6, EX, EY, 5.5], [10.68, EX, EY + 2, 5.7]]);
  const flare = seg(a, 1.84, 2.3) * (1 - 0.5 * seg(a, 3.0, 4.0)) + seg(a, 4.19, 4.5);
  // the storm: a stream of particles from the Sun to the Earth
  const go = seg(a, 4.19, 5.17);
  const storm = go > 0 ? Array.from({ length: 26 }, (_, i) => { const q = ((a * 0.9 + i / 26) % 1) * Math.min(1, go * 1.4), x = lerp(SX, EX, q), y = lerp(SY, EY, q) + Math.sin(i * 2.3 + a * 3) * 60 * (1 - Math.abs(q - 0.5) * 2);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${8 + 6 * rnd(i)}" fill="${i % 3 ? "#ffb04a" : "#ffe08a"}" opacity="${(0.85 * (1 - 0.5 * seg(a, 6, 7))).toFixed(2)}"/>`; }).join("") : "";
  const hit = a > 5.17 ? Math.exp(-(a - 5.17) * 2) : 0;
  // Quebec inside the Earth
  const dark = (x) => clamp((a - 7.17 - (x + 560) / 1120 * 0.7) / 0.18);
  const map = `${two(QUEBEC, "#1f8a7a", "#16705f", 0, 10)}${QCITY.map(([x, y]) => { const d = dark(x); return `${d < 1 ? rings(x, y, 32, P.win, 0.35 * (1 - d), 1.5) : ""}<circle cx="${x}" cy="${y}" r="14" fill="${mix(P.win, "#0f2a36", d)}"/>`; }).join("")}
    ${a > 6.5 ? at(0, -540, plate("QUEBEC", 70), pop(a - 6.57)) : ""}
    ${a > 8.0 ? at(470, -330, `${stopwatch(seg(a, 8.04, 8.7) * 1.5, 52)}${at(150, 0, tagBox("90 s", 64))}`, pop(a - 8.04)) : ""}`;
  const inner = at(0, 0, map, QK);
  const er = 170;
  const world = (v ? "" : "") + at(SX, SY, sun(v ? 150 : 160, tot, flare)) + storm + at(EX, EY, earth(er, inner, { ring: hit * 0.9 })) + (hit > 0 ? rings(EX, EY, er * (1.2 + 0.6 * (1 - hit)), E.el, 0.25 * hit, 1.3) : "")
    + (a > 2.6 ? at(v ? 960 : 960, v ? 330 : 190, calPage("1989", "", 0.62, 150), pop(a - 2.71) * (1 - seg(a, 5.6, 6.0))) : "");
  const g = `<rect width="${FW}" height="${FH}" fill="${SPACE}"/>` + layer(stars(17, 140, -1200, 3200, 1600, tot), c, 0.1) + layer(world, c);
  return { g, out: toScreen(c, EX, EY), outC: "#0b2a3c", outZ: 12 };
}

// ---- 1: 1859, the telegraph office sparks; today's grid, "?" ----
function s1(a, tot) {
  const v = portrait();
  const c = camAt(a, [[0, 960, 540, v ? 0.95 : 1.0], [6.4, 960, 540, v ? 0.98 : 1.04], [7.4, 3380, 540, v ? 0.9 : 1.0], [9.46, 3380, 530, v ? 0.92 : 1.03]]);
  const storm = seg(a, 1.81, 2.6);
  // the office: wall, window with an aurora and one telegraph line outside, a desk with a key, a sounder and a paper tape
  const aur = storm > 0 ? [0, 1, 2].map((i) => `<path d="M${560 + i * 40} ${150 + i * 30}Q${800} ${60 + i * 50 + 20 * Math.sin(tot + i)} ${1060 - i * 30} ${170 + i * 20}" fill="none" stroke="${i % 2 ? "#3ddc97" : "#5fd6ff"}" stroke-width="${26 - i * 6}" stroke-linecap="round" opacity="${(0.55 * storm).toFixed(2)}"/>`).join("") : "";
  const win = `<path d="${rr(500, 80, 620, 420, 20)}" fill="#0a2236"/><g clip-path="url(#tgwin)">${aur}<rect x="500" y="420" width="620" height="80" fill="#06141f"/><path d="M640 420V300M980 420V300M600 310H1020" stroke="${P.woodD}" stroke-width="10"/></g>
    <clipPath id="tgwin"><path d="${rr(500, 80, 620, 420, 20)}"/></clipPath><path d="M810 80V500M500 290H1120" stroke="#3a2a1a" stroke-width="16"/><path d="${rr(500, 80, 620, 420, 20)}" fill="none" stroke="#5a3a20" stroke-width="22"/>`;
  const wallC = "#2a3a3a";
  const wires = `<path d="M1180 260H1400V640" fill="none" stroke="#333" stroke-width="8"/><path d="M1240 260H1460V640" fill="none" stroke="#333" stroke-width="8"/>${[1180, 1240].map((x) => `<circle cx="${x}" cy="260" r="16" fill="${P.cream}"/>`).join("")}`;
  const desk = `<rect x="-200" y="700" width="2300" height="40" fill="${P.wood}"/><rect x="-200" y="740" width="2300" height="500" fill="${P.woodD}"/>`;
  const keyUp = a > 3.36 ? Math.max(0, Math.sin((a - 3.36) * 22)) * (1 - seg(a, 5.0, 5.6)) : 0;
  const key = at(1300, 700, `${two(rr(-160, -30, 320, 30, 8), "#5a3a20", "#3e2814", 0, 6)}<g transform="rotate(${(-6 * keyUp).toFixed(2)} -120 -40)">${two(rr(-130, -60, 230, 22, 10), "#d9a441", "#b07f2a", 0, 4)}</g>${disc(110, -50, 24, P.ink, "#000")}${disc(-110, -40, 14, "#d9a441", "#b07f2a")}`);
  const sounder = at(1560, 700, `${two(rr(-90, -120, 180, 120, 10), "#5a3a20", "#3e2814", 0, 6)}${disc(-40, -90, 26, "#d9a441", "#b07f2a")}${disc(40, -90, 26, "#d9a441", "#b07f2a")}`);
  const tape = `<path d="M600 690Q700 660 800 690T1000 690" fill="none" stroke="${P.cream}" stroke-width="22"/>${[620, 680, 720, 800, 860, 940].map((x, i) => `<rect x="${x}" y="682" width="${i % 2 ? 26 : 10}" height="8" fill="${P.ink}"/>`).join("")}`;
  const sparks = a > 3.3 && a < 6.2 ? [[1300, 640], [1400, 420], [1460, 560], [1180, 260], [1560, 600]].map(([x, y], i) => { const on = Math.sin(a * 9 + i * 2.1) > 0.2 ? 1 : 0; return on ? spark([x - 30, y - 40], [x + 30, y + 30], 1, i * 5 + Math.floor(a * 8)) : ""; }).join("") : "";
  const office = `<rect x="-400" y="-400" width="2420" height="1500" fill="${wallC}"/>` + win + wires + desk + tape + key + sounder + sparks
    + (a > 0.2 ? at(v ? 960 : 250, v ? -120 : 300, calPage("1859", "", 0.75, 150), pop(a - 0.34)) : "");
  // today: a dense grid under the same aurora sky, from x 2300
  const G = 820;
  const today = `<rect x="2020" y="-600" width="2600" height="1500" fill="url(#bnight)"/>${[0, 1, 2].map((i) => `<path d="M${2500 + i * 60} ${120 + i * 30}Q${3300} ${20 + i * 50 + 20 * Math.sin(tot + i)} ${4200 - i * 40} ${140 + i * 20}" fill="none" stroke="${i % 2 ? "#3ddc97" : "#5fd6ff"}" stroke-width="${30 - i * 6}" stroke-linecap="round" opacity=".5"/>`).join("")}
    <rect x="2020" y="${G}" width="2600" height="600" fill="${P.ground}"/>${homes(2420, 10, G, 1, 21, 0.5)}${[2560, 3000, 3440, 3880, 4320].map((x) => at(x, G - 120, pylon(420))).join("")}
    ${[[2560, 3000], [3000, 3440], [3440, 3880], [3880, 4320]].map(([x0, x1]) => { const t0 = pylonTips(420); return [0, 1, 2].map((k) => span([x0 + t0[k][0], G - 120 + t0[k][1]], [x1 + t0[k][0], G - 120 + t0[k][1]], 18, E.el, 4)).join(""); }).join("")}
    ${a > 8.0 ? at(3380, 330, `${rings(0, -60, 150, P.gold, 0.25)}${text(0, 40, "?", 300, P.gold)}`, pop(a - 8.09)) : ""}`;
  const door = `<rect x="2020" y="-600" width="60" height="1800" fill="#1a2626"/>`;
  const g = `<rect width="${FW}" height="${FH}" fill="${wallC}"/>` + layer(office + today + door, c);
  return { g, in: toScreen(c, 810, 290), inC: "#0b2a3c", inZ: 10, out: toScreen(c, 3380, 300), outC: "#071d2c" };
}

// ---- 2: Dec 2015, Ukraine: a remote cursor opens the switches ----
const SUBS = [[-360, -150], [0, -170], [360, -150], [-360, 110], [0, 130], [360, 110]], CLICK = [5.33, 6.05, 6.43, 7.0, 7.5, 8.0];
function s2(a, tot) {
  const v = portrait(), MX = v ? 960 : 820, MY = v ? 760 : 470, MK = v ? 0.78 : 1;
  const c = camAt(a, v ? [[0, 960, 900, 1.0], [11.21, 960, 900, 1.03]] : [[0, 900, 520, 1.0], [11.21, 880, 520, 1.03]]);
  const open = (i) => seg(a, CLICK[i] + 0.05, CLICK[i] + 0.3);
  // the network on the screen: substations, the towns they feed (lit windows), lines between them
  const net = `${[[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [2, 5]].map(([i, j]) => `<path d="M${SUBS[i][0]} ${SUBS[i][1]}L${SUBS[j][0]} ${SUBS[j][1]}" stroke="${mix(E.el, "#2a3f4a", (open(i) + open(j)) / 2)}" stroke-width="6"/>`).join("")}
    ${SUBS.map(([x, y], i) => `${at(x, y, sub(open(i), 1 - open(i)))}${[0, 1, 2, 3].map((k) => `<rect x="${x - 60 + k * 32}" y="${y + 64}" width="22" height="22" rx="4" fill="${mix(P.win, "#123447", open(i))}"/>`).join("")}`).join("")}`;
  const mon = at(MX, MY, `<path d="M-40 360h80l-10 -60h-60Z" fill="${P.steelD}"/><path d="${rr(-200, 356, 400, 24, 10)}" fill="${P.steelD}"/>${screen(1100, 620, tot, 9, 1, net)}`, MK);
  // the cursor: comes in from the right on «دخلوا», visits each switch and clicks
  let cx, cy; const path = [[MX + 700, MY + 260], ...SUBS.map(([x, y]) => [MX + (x + 36) * MK, MY + (y + 14) * MK])], tk = [3.3, ...CLICK];
  { let k = 0; while (k < tk.length - 1 && a > tk[k + 1]) k++; const p = k < tk.length - 1 ? ease(seg(a, tk[k] + 0.05, tk[k + 1])) : 1; const A = path[k], B = path[Math.min(k + 1, path.length - 1)]; cx = lerp(A[0], B[0], p); cy = lerp(A[1], B[1], p); }
  const ci = CLICK.findIndex((t) => a >= t && a < t + 0.45), cur = a > 3.29 ? at(cx, cy, cursor(v ? 1.2 : 1.4, ci >= 0 ? (a - CLICK[ci]) / 0.45 : 0), pop(a - 3.29)) : "";
  const n = Math.round(lerp(0, 225000, ease(seg(a, 6.89, 8.47))));
  const cnt = a > 6.85 ? at(v ? 960 : 820, v ? 1420 : 930, `${at(-260, 40, house(E.houseA, E.houseAD, { roof: E.roof, lit: [0, 0, 0] }), 0.4)}${at(60, 0, tagBox(n.toLocaleString("en"), v ? 80 : 84))}`, pop(a - 6.89)) : "";
  const head = at(v ? 960 : 280, v ? 220 : 150, `${a > 2.5 ? at(v ? -170 : 0, 0, calPage("2015", "DEC", 0.55, 150), pop(a - 2.45)) : ""}`) + (a > 2.5 ? at(v ? 1080 : 1450, v ? 230 : 140, `${flagUA(v ? 150 : 170)}${at(0, v ? 120 : 130, plate("UKRAINE", v ? 56 : 60))}`, pop(a - 2.57)) : "");
  const first = a > 8.95 ? at(v ? 960 : 1300, v ? 1620 : 900, `${rings(0, 0, 90, P.gold, 0.3)}${disc(0, 0, 80, P.gold, P.goldD)}${text(0, 30, "1st", 80, "#8a5200")}`, pop(a - 8.99)) : "";
  const g = night(c, tot, 31) + layer(mon + head + cnt + cur + first, c);
  return { g, in: toScreen(c, MX, MY), inC: "#071d2c", out: toScreen(c, MX, MY), outC: "#04121e" };
}

// ---- 3: the squirrel ----
const PX = 960, G3 = 900;
function s3(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, PX, 640, 1.15], [4.5, PX, 640, 1.18], [6.0, PX + 200, 560, 0.55], [6.63, PX + 200, 560, 0.53]] : [[0, PX, 520, 1.0], [4.5, PX, 520, 1.05], [5.9, PX + 600, 470, 0.45], [6.63, PX + 600, 470, 0.43]]);
  const dark = seg(a, 3.95, 4.15);
  const TY = G3 - 560;   // the transformer can
  const can = (x, f) => at(x, TY, `${two(rr(-46, -70, 92, 120, 20), "#7f93b8", "#5f7299", 8, 0)}${[-26, 0, 26].map((dx) => `<path d="M${dx} -70v-30" stroke="${P.cream}" stroke-width="8"/><circle cx="${dx}" cy="-104" r="9" fill="${P.cream}"/>`).join("")}${f > 0 ? rings(0, -100, 140 * f, "#ffffff", 0.6 * f, 1.6) + spark([-26, -104], [26, -104], f, 7) : ""}`);
  const streetAt = (x0, f, d, seed) => `${at(x0, G3, `${two(rr(-16, -620, 32, 620, 6), P.wood, P.woodD, 6, 0)}<path d="${rr(-130, -600, 260, 18, 6)}" fill="${P.woodD}"/>`)}${can(x0, f)}
    ${span([x0 - 120, G3 - 596], [x0 - 560, G3 - 380], 20, "#16113a", 5)}${span([x0 + 120, G3 - 596], [x0 + 560, G3 - 380], 20, "#16113a", 5)}
    ${[-480, -240, 240, 480].map((dx, i) => at(x0 + dx, G3, house(i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, { roof: E.roof, lit: [d < 0.5, d < 0.5, d < 0.5] }), 0.85)).join("")}
    ${[-560, 560].map((dx) => at(x0 + dx, G3, `<path d="M0 0V-380" stroke="${P.woodD}" stroke-width="16"/>${d < 0.5 ? rings(0, -390, 40, P.win, 0.3) : ""}<circle cx="0" cy="-390" r="16" fill="${d < 0.5 ? P.win : "#2a3f4a"}"/>`)).join("")}`;
  // the squirrel: in at the foot of the pole, climbs, touches across, leaps away
  const climb = ease(seg(a, 2.86, 3.69)), leap = seg(a, 4.0, 4.8);
  let sx = PX + 30, sy = G3, rot = 0, puff = 0;
  if (a < 2.86) { sx = lerp(PX + 340, PX + 30, ease(seg(a, 1.2, 2.2))); }
  else if (a < 4.0) { sx = PX + 30; sy = lerp(G3, TY - 60, climb); rot = a < 3.69 ? -90 : 0; }
  else { sx = lerp(PX + 30, PX + 700, leap); sy = lerp(TY - 60, G3 - 60, leap) - 260 * Math.sin(Math.PI * leap); rot = 0; puff = 1; }
  const sq = a > 1.2 && leap < 1 ? at(sx, sy, squirrel(tot, { puff }), 1.1, rot) : "";
  const kg = a > 1.4 && a < 4.0 ? at(PX + 360, G3 - 230, tagBox("0.5 kg", 58), pop(a - 1.45)) : "";
  const flash = a > 3.69 ? Math.exp(-(a - 3.69) * 5) : 0;
  // more streets, revealed by the pull back, each transformer flashing in turn
  const more = [-2600, 2900, 5000].map((dx, i) => { const t0 = 4.9 + i * 0.4, f = a > t0 ? Math.exp(-(a - t0) * 5) : 0; return streetAt(PX + dx, f, seg(a, t0 + 0.1, t0 + 0.25), 40 + i); }).join("");
  const sky = `<rect x="-6000" y="-3000" width="14000" height="${G3 + 3000}" fill="url(#bnight)"/>`;
  const ground = `<rect x="-6000" y="${G3}" width="14000" height="3000" fill="${P.ground}"/>`;
  const g = night(c, tot, 47) + layer(sky + ground + more + streetAt(PX, flash, dark, 1) + sq + kg + (flash > 0.4 ? `<rect x="-6000" y="-3000" width="14000" height="7000" fill="#fff" opacity="${(0.25 * flash).toFixed(2)}"/>` : ""), c);
  return { g, in: toScreen(c, PX, TY), inC: "#04121e" };
}

const SHOTS = [s0, s1, s2, s3];
export const enemiesSet = makeSet(SHOTS, V, P);
