// "Still dark", electricity part 4 of 4: three calm shots, the camera slow, nothing jokey.
//   0 the night Earth from space, Europe and Africa: Europe, the north coast, the Nile and the far south lit; the middle of
//     Africa almost black. "2024" on «ألفين أربعة وعشرين», the counter rolls to "~730,000,000" on «سبعمية وتلاتين مليون»,
//     the dark region gets a quiet ring and an unlit bulb on «من غير كهربا خالص»
//   1 close on Africa: ten unlit bulbs, eight glide down into the region south of the Sahara («تمانية من كل عشرة»); two
//     calendar cards 2010 and 2024 with the same bar and an "=" («زي ما كان سنة ألفين وعشرة»); then a race: a row of
//     houses climbing steeply beside a copper wire that crawls («السكان بيزيدوا أسرع من الأسلاك»)
//   2 split: left, a dark room with a desk, an open book and a kerosene lamp (a small warm flame); right, a noon sun over
//     a price tag that sinks below a zero line to "−" («بالسالب»). Host right: everything stays left of x = 1530.
import { clamp, lerp, ease, seg, spring, rnd, camAt, layer, toScreen, rr, two, disc, rings, text, drawn, at, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./dark.v.js";
import { P, E, mix, stars, house, pop, bulb, wire } from "./elec.js";
import { sun } from "./enemies.js";
import { calPage } from "./props.js";

const tagBox = (t, size = 70, fill = P.gold) => { const w = String(t).length * size * 0.5 + size; return `${two(rr(-w / 2, -size * 0.75, w, size * 1.5, size * 0.75), P.ink, "#0d0826", 0, 6)}${text(0, size * 0.34, t, size, fill)}`; };
const SPACE = (c, tot, seed = 61) => `<rect width="${FW}" height="${FH}" fill="#020c16"/>` + layer(stars(seed, 160, -800, 2800, 1200, tot), c, 0.12);

// ---- the night globe (centre 960, 560; r 470), Europe and Africa facing us ----
const GX = 960, GY = 560, GR = 470;
const AFRICA = "M780 380L880 360L1000 370L1080 400L1130 450L1180 470L1220 540L1200 600L1160 640L1140 720L1100 800L1060 870L1010 920L960 930L930 880L910 800L890 720L860 650L820 600L760 580L700 560L670 510L690 450L730 400Z";
const EUROPE = "M760 340L740 290L770 240L820 220L860 170L930 150L1000 160L1060 190L1100 230L1150 250L1180 300L1140 330L1080 340L1020 320L960 340L900 330L840 350Z";
const ARABIA = "M1150 400L1220 390L1290 430L1320 490L1280 540L1230 560L1200 520L1180 470Z";
const AMER = "M300 520L360 470L420 480L450 540L440 620L400 700L360 760L330 700L310 620Z";
const MADA = "M1210 760L1235 740L1250 790L1225 840L1205 810Z";
// lights: [x, y, size] on the land, with a weight: Europe and the coasts dense; the middle sparse
const LIGHTS = (() => { const L = [];
  const add = (x0, x1, y0, y1, n, seed, k = 1) => { for (let i = 0; i < n; i++) L.push([lerp(x0, x1, rnd(seed + i)), lerp(y0, y1, rnd(seed + i + 500)), k * (0.6 + rnd(seed + i + 900) * 0.8)]); };
  add(780, 1130, 180, 330, 70, 11);           // Europe
  add(720, 1120, 380, 420, 26, 41, 0.9);      // the north coast of Africa
  add(1080, 1100, 420, 520, 10, 71, 0.9);     // the Nile
  add(1160, 1290, 410, 520, 14, 91, 0.9);     // Arabia and the Gulf
  add(940, 1040, 860, 910, 12, 121, 0.9);     // the far south
  add(720, 800, 560, 580, 5, 151, 0.7);       // the west coast
  add(1110, 1150, 640, 680, 3, 171, 0.6);     // the east
  add(330, 440, 500, 680, 18, 191, 0.9);      // South America's coast
  return L; })();
const globe = (tot, ring = 0) => { const id = "dglobe";
  const land = (d) => `<path d="${d}" fill="#0e3346" stroke="#164a62" stroke-width="4"/>`;
  const lights = LIGHTS.map(([x, y, k], i) => { const tw = 0.75 + 0.25 * Math.sin(tot * 1.3 + i); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(4.5 * k).toFixed(1)}" fill="${P.win}" opacity="${tw.toFixed(2)}"/>`; }).join("");
  const glowE = rings(950, 260, 120, P.win, 0.07, 1.3);
  return `${rings(GX, GY, GR * 1.02, E.el, 0.06, 1.12)}<clipPath id="${id}"><circle cx="${GX}" cy="${GY}" r="${GR}"/></clipPath>${disc(GX, GY, GR, "#06223d", "#041624", 0.06)}<g clip-path="url(#${id})">${[AMER, EUROPE, AFRICA, ARABIA, MADA].map(land).join("")}${glowE}${lights}</g>
    <circle cx="${GX}" cy="${GY}" r="${GR}" fill="none" stroke="${E.el}" stroke-width="6" opacity=".35"/>
    ${ring > 0 ? `<ellipse cx="930" cy="690" rx="${(250 * (0.9 + 0.1 * ring)).toFixed(0)}" ry="${(160 * (0.9 + 0.1 * ring)).toFixed(0)}" fill="none" stroke="${P.cream}" stroke-width="7" stroke-dasharray="18 16" opacity="${(0.75 * ring).toFixed(2)}"/>` : ""}`; };

// ---- 0: the night Earth ----
function s0(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 560, 1.05], [8.98, 940, 640, 1.35]]) : camAt(a, [[0, 960, 560, 0.92], [8.98, 940, 620, 1.16]]);
  const cal = a > 2.9 ? at(v ? 960 : 400, v ? 60 : 300, calPage("2024", "", 0.62, 150), pop(a - 2.95) * (1 - seg(a, 4.5, 4.85))) : "";
  const n = Math.round(lerp(0, 730, ease(seg(a, 4.92, 6.3))));
  const cnt = a > 4.8 ? at(v ? 960 : 400, v ? 60 : 300, tagBox(`~${n},000,000`, v ? 62 : 66), pop(a - 4.85)) : "";
  const ring = seg(a, 6.4, 7.4);
  const off = a > 7.6 ? at(v ? 960 : 400, v ? 1270 : 640, bulb(0, {}), 0.6 * pop(a - 7.66)) : "";
  const g = SPACE(c, tot) + layer(globe(tot, ring) + cal + cnt + off, c);
  return { g, out: toScreen(c, 930, 690), outC: "#020c16", outZ: 10 };
}

// ---- 1: eight in ten; the same as 2010; people faster than wires ----
const AFR_MAP = (k = 1) => at(0, 0, `${two(AFRICA, "#164a62", "#0f3a4f", 0, 10)}<path d="M690 470Q900 520 1150 480" fill="none" stroke="#d9b56a" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round" opacity=".55"/>`, k);
function s1(a, tot) {
  const v = portrait();
  const MX = v ? -10 : -400, MY = v ? -300 : 0;   // where Africa is drawn (offset of its world coordinates)
  const RX = v ? 960 : 1300, RY = v ? 1180 : 520;
  const c = v ? camAt(a, [[0, 960, 380, 1.15], [2.4, 960, 400, 1.15], [3.0, 960, 1000, 0.95], [7.78, 960, 1020, 0.97]])
    : camAt(a, [[0, 600, 560, 1.2], [2.4, 620, 560, 1.22], [3.0, 1260, 520, 1.08], [7.78, 1270, 520, 1.1]]);
  // ten unlit bulbs; eight glide into the region south of the Sahara, two drift off to the rest of the world
  const BX0 = MX + 940, BY0 = MY + 230;
  const bulbs = Array.from({ length: 10 }, (_, i) => { const into = i < 8, p = ease(seg(a, 0.4 + i * 0.07, 1.3 + i * 0.07));
    const sx = BX0 + (i - 4.5) * 64, sy = BY0, tx = into ? MX + 880 + (i % 4) * 66 : MX + 1260 + (i - 8) * 70, ty = into ? MY + 640 + Math.floor(i / 4) * 120 : MY + 200;
    return at(lerp(sx, tx, p), lerp(sy, ty, p), bulb(0, {}), 0.3 * pop(a - 0.05 * i) * (into ? 1 : 1 - seg(a, 2.0, 2.4))); }).join("");
  const tally = a > 1.4 ? at(MX + (v ? 990 : 1340), MY + (v ? 980 : 560), tagBox("8 / 10", 70), pop(a - 1.45) * (1 - seg(a, 2.5, 2.9))) : "";
  const map = at(MX, MY, AFR_MAP());
  // 2010 = 2024: two calendars with the same bar
  const same = seg(a, 2.66, 3.0) * (1 - seg(a, 5.4, 5.7));
  const bar = (yr, t0, x) => { const h = 300 * ease(seg(a, t0, t0 + 0.6)); return at(x, 0, `${at(0, -330, calPage(yr, "", 0.62, 150))}${h > 1 ? two(rr(-70, 200 - h, 140, h, 12), "#3b6a82", "#2a4a60", 0, 8) : ""}<path d="M-110 200H110" stroke="#3b6a82" stroke-width="8" stroke-linecap="round"/>`); };
  const cals = same > 0 ? at(RX, RY + 40, `${bar("2010", 4.3, -200)}${bar("2024", 2.9, 200)}${a > 4.9 ? `<path d="M-300 -100H300" stroke="${P.cream}" stroke-width="6" stroke-dasharray="16 14" opacity="${seg(a, 4.9, 5.1).toFixed(2)}"/>` : ""}${a > 4.9 ? at(0, 60, text(0, 34, "=", 140, P.cream), pop(a - 4.95)) : ""}`, 1.1 * same) : "";
  // the race: houses climb steeply, the wire crawls
  const race = seg(a, 5.5, 5.8), RP = clamp((a - 5.6) / 2.0);
  const climb = Array.from({ length: 6 }, (_, i) => (RP * 6 > i ? at(-230 + i * 100, 250 - i * 100, house(i % 2 ? E.houseB : E.houseA, i % 2 ? E.houseBD : E.houseAD, { roof: E.roof, lit: [false, false, false] }), 0.32 * pop(a - 5.6 - i * 0.32)) : "")).join("");
  const wlen = lerp(0, 300, RP);
  const cable = wlen > 4 ? wire(`M-280 250L${-280 + wlen} ${250 - wlen * 0.16}`, 22) : "";
  const arrows = race > 0 ? at(RX, RY, `<path d="M-320 290H340M-320 290V-330" stroke="#3b6a82" stroke-width="8" stroke-linecap="round"/>${climb}${cable}`, 1.15 * race) : "";
  const g = SPACE(c, tot, 67) + layer(map + bulbs + tally + cals + arrows, c);
  return { g, in: toScreen(c, MX + 930, MY + 690), inC: "#020c16", inZ: 10 };
}

// ---- 2: a desk by kerosene; a price below zero elsewhere ----
const lampK = (t) => { const f = 1 + 0.08 * Math.sin(t * 13) + 0.05 * Math.sin(t * 7.3);
  return `${rings(0, -90, 120 * f, "#ffb04a", 0.12, 1.5)}${two("M-44 0Q-56 -30 -30 -46H30Q56 -30 44 0Z", "#8a5a3a", "#6a4028", 0, 6)}<path d="M-24 -46Q-40 -110 0 -150Q40 -110 24 -46Z" fill="#fff3d0" opacity=".35" stroke="#fff3d0" stroke-width="5"/>
    <path d="M0 ${-60 - 30 * f}Q-14 -70 0 -56Q14 -70 0 ${-60 - 30 * f}Z" fill="#ffcf6b"/><path d="M-30 -150H30" stroke="${P.steelD}" stroke-width="8" stroke-linecap="round"/>`; };
const desk = (t) => `<path d="M-300 0H300" stroke="#6a4028" stroke-width="26" stroke-linecap="round"/><path d="M-260 0V180M260 0V180" stroke="#5a3420" stroke-width="20"/>
  ${at(-40, -6, `${two("M-160 0L-150 -24Q-80 -50 0 -20Q80 -50 150 -24L160 0Q80 -24 0 4Q-80 -24 -160 0Z", P.cream, P.creamD, 0, 4)}${[0, 1, 2, 3].map((i) => `<path d="M${-130 + i * 8} ${-22 - i * 4}Q-70 ${-40 - i * 2} -16 ${-18 - i * 3}" fill="none" stroke="${P.creamD}" stroke-width="4"/><path d="M${16} ${-18 - i * 3}Q70 ${-40 - i * 2} ${130 - i * 8} ${-22 - i * 4}" fill="none" stroke="${P.creamD}" stroke-width="4"/>`).join("")}`)}
  ${at(190, -12, lampK(t))}`;
function s2(a, tot) {
  const v = portrait();
  const c = v ? camAt(a, [[0, 960, 700, 1.15], [2.3, 960, 760, 1.12], [2.9, 960, 960, 0.86], [4.8, 960, 970, 0.87]]) : camAt(a, [[0, 560, 520, 1.25], [2.3, 600, 520, 1.2], [2.9, 840, 520, 1.0], [4.8, 840, 520, 1.02]]);
  const LX = v ? 960 : 390, LY = v ? 600 : 560, RX = v ? 960 : 1100, RY = v ? 1330 : 520;
  const glow = 0.85 + 0.15 * Math.sin(tot * 9);
  const room = `<path d="${rr(LX - 400, LY - 420, 800, 760, 30)}" fill="#030d18"/><circle cx="${LX + 190}" cy="${LY - 100}" r="${(300 * glow).toFixed(0)}" fill="#ffb04a" opacity=".1"/><circle cx="${LX + 190}" cy="${LY - 100}" r="${(180 * glow).toFixed(0)}" fill="#ffb04a" opacity=".1"/>
    ${at(LX, LY + 80, desk(tot), pop(a + 0.5))}`;
  // the other place: a sunny noon, a price tag sinking through zero
  const show = seg(a, 2.5, 2.9);
  const drop = ease(seg(a, 3.3, 4.1)), ZY = 120;
  const tagY = lerp(-60, 240, drop);
  const right = show > 0 ? at(RX, RY, `<path d="${rr(-330, -400, 660, 760, 30)}" fill="#17607a"/><path d="${rr(-330, 120, 660, 240, 0)}" fill="#0e4a5e"/>${at(150, -260, sun(80, tot), 1)}
    <path d="M-280 ${ZY}H280" stroke="${P.cream}" stroke-width="8" stroke-dasharray="20 14"/>${text(-250, ZY - 20, "0", 56, P.cream)}
    ${at(-20, tagY, `${two("M-110 -60h170l60 60l-60 60h-170Z", drop > 0.5 ? "#ff6b6b" : P.cream, drop > 0.5 ? "#d94a4a" : P.creamD, 0, 6)}<circle cx="70" cy="0" r="12" fill="${P.ink}"/>${text(-30, 28, drop > 0.5 ? "−$" : "$", 78, P.ink)}`)}
    <path d="${rr(-330, -400, 660, 760, 30)}" fill="none" stroke="${P.ink}" stroke-width="10"/>`, show) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#020a12"/>` + layer(room + right, c);
  return { g };
}

const SHOTS = [s0, s1, s2];
export const darkSet = makeSet(SHOTS, V, P);
