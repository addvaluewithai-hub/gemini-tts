// "Intro" of electricity part 4 of 4 (where it is going; the file closes). Two shots; nothing to read but "1".."4",
// "4 / 4", "< 1 s" and a "?".
//   0 the file folder with its four tabs; tab 4 lights and "4 / 4" lands («رقم أربعة، والأخير»). The camera travels to
//     part 2's warehouse: on «مابتتخزنش» a padlock drops on its doors and a ✗; on «بيتعمل… يتستهلك» a gold pulse runs
//     down the lamp cord, the bulb lights and a stopwatch stops at "< 1 s"; on «بتتغير» the padlock rattles and a line
//     of gold light opens between the doors; the camera pushes into it
//   1 three windows open one by one: battery boxes as big as warehouses («بطاريات قد المخازن»), a sun with a falling
//     price («شمس… أرخص كهربا»), roofs covered in panels («فوق السطوح»); they lift away and a single dark bulb with a
//     "?" is left («مين… ماعندوش لمبة»). Host right: the lower right is kept clear.
// Hand-over: through the gold light between the doors (0 → 1).
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, at, cross, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./e4intro.v.js";
import { P, E, mix, house, pop, bulb, lamp } from "./elec.js";
import { hills } from "./props.js";
import { stopwatch } from "./balance.js";
import { depot, battBox, pill, sky, GOLDL } from "./storage.js";

const BOLT = "M14 -60L-30 6H0L-14 60L30 -6H0Z";
// the file folder (centre), 460 wide; lit 0..1 lights tab 4
const folder4 = (lit) => { const tab = (i) => { const on = i === 3 ? lit : 0, x = -180 + i * 100;
    return `${two(rr(x, -232, 84, 70, 16), i === 3 ? mix("#c47f22", P.gold, on) : "#c47f22", i === 3 ? mix("#a8661a", P.goldD, on) : "#a8661a", 0, 5)}${text(x + 42, -184, String(i + 1), 40, mix("#5a3a10", P.ink, on))}${on > 0 ? rings(x + 42, -200, 60, P.gold, 0.3 * on, 1.4) : ""}`; };
  return `${[0, 1, 2, 3].map(tab).join("")}${two(rr(-230, -180, 460, 330, 20), "#e8a23c", "#c47f22", 0, 10)}${two(rr(-240, -140, 480, 290, 20), "#ffc15a", "#e8a23c", 0, 10)}${at(0, 10, `${disc(0, 0, 90, P.ink, "#020c16", 0.06)}<path d="${BOLT}" fill="${P.gold}" transform="scale(1.1)"/>`)}`; };

// ---- 0: the last report; it can't be stored… that is changing ----
function s0(a, tot) {
  const v = portrait(), G = v ? 1500 : 900;
  const FX = v ? 960 : 520, FY = v ? 420 : 470, DX = v ? 900 : 1180, DK = v ? 1.15 : 1.3, LX = v ? 1330 : 1680;
  const c = camAt(a, v ? [[0, 960, 480, 1.3], [2.3, 960, 500, 1.25], [3.1, 990, 960, 0.78], [6.4, 990, 980, 0.8], [8.63, DX, G - 150 * DK, 1.6]]
    : [[0, 520, 440, 1.4], [2.3, 560, 470, 1.36], [3.0, 1100, 560, 1.0], [6.4, 1120, 580, 1.04], [8.63, DX, G - 150 * DK, 1.7]]);
  const lit = ease(seg(a, 0.3, 0.7));
  const fold = at(FX, FY, folder4(lit), (v ? 1.2 : 1.1) * pop(a + 1));
  const four = a > 0.6 ? at(FX, FY - (v ? 380 : 320), pill("4 / 4", 70, P.gold), pop(a - 0.65)) : "";
  // the warehouse: a padlock drops on «مابتتخزنش»; it rattles and the seam lights on «بتتغير»
  const drop = spring(a - 3.28, 8, 14), rattle = a > 6.25 ? 14 * Math.sin((a - 6.25) * 26) * Math.exp(-(a - 6.25) * 1.6) : 0, seam = ease(seg(a, 6.9, 8.0));
  const dp = at(DX, G, depot({ doors: 1, lockK: a > 3.2 ? 1 : 0, lockDY: -260 * (1 - drop), lockRot: rattle, seam, glow: 0 }), DK);
  const no = a > 3.35 ? at(DX + 330 * DK, G - 200 * DK, cross(0, 0, 54, P.red, a - 3.4), 1, 0, `opacity="${(1 - seg(a, 6.3, 6.7)).toFixed(2)}"`) : "";
  // made and used in the same second: a pulse down the cord, the bulb lights, the stopwatch stops at < 1 s
  const on = ease(seg(a, 4.75, 4.95));
  const cordTop = G - 1200, bulbTop = G - 690;
  const pulse = a > 4.2 && a < 4.85 ? rings(LX, lerp(cordTop, bulbTop, seg(a, 4.2, 4.8)), 26, P.gold, 0.7, 1.5) : "";
  const lp = at(LX, G - 390, lamp(on, 900), 1);
  const sw = a > 4.7 ? at(LX, G - 170, `${stopwatch(0.85 * ease(seg(a, 4.85, 5.5)), 80)}${a > 5.5 ? at(0, 150, pill("< 1 s", 54, P.gold), pop(a - 5.55)) : ""}`, pop(a - 4.72)) : "";
  const world = `<rect x="-1400" y="${G}" width="4800" height="1600" fill="${P.ground}"/>` + fold + four + dp + no + lp + pulse + sw;
  const g = sky(c, tot, 61) + layer(hills(12, -1400, 3400, G - 60, 100, "#0d3a4e"), c, 0.6) + layer(world, c);
  return { g, out: toScreen(c, DX, G - 115 * DK), outC: GOLDL, outZ: 18 };
}

// ---- 1: batteries, the sun, the rooftops… and one dark bulb ----
const sunIcon = (r, t) => `<g transform="rotate(${(t * 20).toFixed(1)})">${Array.from({ length: 10 }, (_, i) => `<path d="M${-r * 0.16} ${-r * 1.18}L0 ${-r * 1.5}L${r * 0.16} ${-r * 1.18}Z" fill="${P.gold}" transform="rotate(${i * 36})"/>`).join("")}</g>${rings(0, 0, r, P.gold, 0.25, 1.3)}${disc(0, 0, r, P.gold, P.goldD, 0.1)}`;
const panel = (w = 100) => `<path d="${rr(-w / 2, -16, w, 32, 4)}" fill="#1e4fa0"/>${[1, 2, 3].map((i) => `<path d="M${-w / 2 + i * w / 4} -16V16" stroke="#5fa8ff" stroke-width="3"/>`).join("")}<path d="M${-w / 2} 0H${w / 2}" stroke="#5fa8ff" stroke-width="3"/>`;
const solarHouse = (c, cD) => `${house(c, cD, { roof: E.roof, lit: [1, 1, 1] })}${at(-72, -228, panel(120), 1, -41)}${at(72, -228, panel(120), 1, 41)}`;
const card = (id, inner) => `${two(rr(-222, -182, 444, 364, 36), P.cream, P.creamD, 0, 10)}<clipPath id="${id}"><path d="${rr(-206, -166, 412, 332, 26)}"/></clipPath><g clip-path="url(#${id})"><rect x="-210" y="-170" width="420" height="340" fill="#0b3a4f"/>${inner}</g>`;
function s1(a, tot) {
  const v = portrait();
  const c = camAt(a, v ? [[0, 960, 900, 1.0], [10.63, 960, 900, 1.02]] : [[0, 920, 480, 1.0], [10.63, 920, 490, 1.03]]);
  const ground = `<rect x="-220" y="96" width="440" height="100" fill="#082a3a"/>`;
  const c1 = card("c4a", ground + [0, 1, 2].map((i) => at(-120 + i * 120, 40, battBox(0.6 + 0.2 * i), 0.3)).join("") + [0, 1, 2].map((i) => at(-120 + i * 120, 128, battBox(0.5 + 0.25 * ((i + 1) % 3)), 0.34)).join(""));
  const fall = ease(seg(a, 2.2, 3.2));
  const c2 = card("c4b", ground + at(-50, -20, sunIcon(80, tot)) + at(110, lerp(-40, 70, fall), `${two(`M-50 -34h80l30 34l-30 34h-80Z`, P.cream, P.creamD, 0, 5)}${text(-6, 18, "$", 52, P.ink)}`) + at(110, lerp(-40, 70, fall) + 70, `<path d="M0 -20V20M-20 4L0 26L20 4" fill="none" stroke="${P.green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`, fall));
  const c3 = card("c4c", ground + at(-95, 110, solarHouse(E.houseA, E.houseAD), 0.6) + at(100, 110, solarHouse(E.houseB, E.houseBD), 0.6) + `<circle cx="150" cy="-110" r="30" fill="${P.gold}"/>`);
  const lift = ease(seg(a, 6.0, 7.3));
  const pos = v ? [[960, 330], [960, 750], [960, 1170]].map(([x, y], i) => [lerp(x, 600 + i * 360, lift), lerp(y, 300, lift)]) : [[280, 370], [790, 370], [1300, 370]].map(([x, y]) => [x, lerp(y, 230, lift)]);
  const k = lerp(v ? 0.9 : 1.04, v ? 0.72 : 0.72, lift);
  const cards = [[c1, 0.0], [c2, 1.47], [c3, 3.7]].map(([cc, t0], i) => a > t0 - 0.05 ? at(pos[i][0], pos[i][1], cc, k * pop(a - t0 + (i ? 0 : 0.6))) : "").join("");
  const BX = v ? 960 : 760, BY = v ? 1700 : 1000;
  const b = a > 8.1 ? at(BX, BY, bulb(0), (v ? 1.7 : 1.45) * pop(a - 8.15)) : "";
  const q = a > 8.5 ? at(BX + (v ? 300 : 280), BY - (v ? 430 : 380), `${rings(0, -60, 110, P.gold, 0.2, 1.4)}${text(0, 40, "?", 240, P.gold)}`, pop(a - 9.06)) : "";
  const g = sky(c, tot, 67) + layer(cards + b + q, c);
  return { g, in: toScreen(c, pos[0][0], pos[0][1]), inC: GOLDL };
}

const SHOTS = [s0, s1];
export const e4introSet = makeSet(SHOTS, V, P);
