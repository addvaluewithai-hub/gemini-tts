// The recap of electricity part 2 of 4: one shot, three cards that come in on «واحد» (1.33), «اتنين» (6.46), «تلاتة»
// (10.75); the camera visits each and pulls back over all three at the end («كل ثانية»).
//   1 the magnet spinning in its coil, with a little boiler, dam and wind turbine round it, each lighting in turn on
//     «بتدوّر على حاجة تلفّه»
//   2 a transformer with an up arrow, a span of pylons, a transformer with a down arrow, the teal house: a gold pulse travels
//     along on «تسافر» and the house lights on «قبل البيت»
//   3 the balance: stations on one pan, lit windows on the other; it wobbles and settles level, the needle on 50 with a
//     check on «كل ثانية»
// The host leans in from the right: every card stays left of x = 1530.
import { clamp, lerp, ease, easeOut, seg, spring, camAt, layer, rr, two, disc, rings, text, drawn, at, check, makeSet, FW, FH, portrait } from "./kit.js";
import { P, E, mix, stars, house, pop, pylon, pylonTips, span, station, gauge } from "./elec.js";
import { gen, turbine } from "./faraday.js";
import { V } from "./e2recap.v.js";

const CW = 440, CH = 560, T = [1.33, 6.46, 10.75];
const marker = (n, on) => `${on > 0 ? rings(0, 0, 70 * on, P.gold, 0.25) : ""}${disc(0, 0, 50, mix("#1f6d8c", P.gold, clamp(on)), mix("#164a6a", P.goldD, clamp(on)))}${text(0, 24, String(n), 70, mix("#5a8aa6", "#8a5200", clamp(on)))}`;
const card = (inner, n, on, act) => `${act > 0 ? rings(0, 0, 330, P.gold, 0.06 * act, 1.15) : ""}${two(rr(-CW / 2, -CH / 2, CW, CH, 34), "#0f3a55", "#0a2b40", 10, 8)}<path d="${rr(-CW / 2 + 16, -CH / 2 + 16, CW - 32, CH - 32, 24)}" fill="#071d2c"/>${inner}${at(-CW / 2 + 20, -CH / 2 + 20, marker(n, on))}`;
// small things for the cards
const boiler = (on) => `${two(rr(-40, -70, 80, 70, 10), "#a8473a", "#84342a", 6, 0)}${on > 0 ? `<circle cx="10" cy="-96" r="${16 + 6 * on}" fill="#e8f3f6" opacity="${(0.7 * on).toFixed(2)}"/>` : ""}`;
const dam = (on, t) => `${two("M-50 0L-38 -80H38L50 0Z", "#9fb6c8", "#7890a5", 0, 6)}<rect x="-14" y="-60" width="28" height="60" fill="${E.water}" opacity="${(0.4 + 0.5 * on).toFixed(2)}"/>`;
const windT = (on, t) => `<path d="M-4 0L-2 -90H2L4 0Z" fill="#e8f3f6"/>${at(0, -90, [0, 1, 2].map((i) => `<path d="M-4 0Q-3 -26 0 -46Q3 -26 4 0Z" fill="#e8f3f6" transform="rotate(${t * (40 + 160 * on) + i * 120})"/>`).join(""))}`;
const xformer = (up) => `${two(rr(-46, -80, 92, 80, 10), "#5b7f8f", "#45687a", 6, 0)}${[0, 1, 2].map((i) => `<path d="M${-30 + i * 30} -80v-18" stroke="${P.cream}" stroke-width="8"/>`).join("")}<path d="M0 ${up ? -24 : -60}L${-18} ${up ? -4 : -40}M0 ${up ? -24 : -60}L18 ${up ? -4 : -40}M0 ${up ? -24 : -60}V${up ? -64 : -20}" stroke="${P.gold}" stroke-width="9" stroke-linecap="round" fill="none" transform="translate(0 ${up ? -10 : 0}) ${up ? "" : "rotate(180 0 -40)"}"/>`;

function s0(a, tot) {
  const v = portrait();
  const CX = v ? [540, 540, 540].map(() => 960) : [300, 800, 1300], CY = v ? [-120, 600, 1320] : [420, 420, 420];
  const c = v ? camAt(a, [[0, 960, 600, 0.7], [1.2, 960, -120, 1.25], [6.1, 960, -100, 1.25], [6.8, 960, 600, 1.25], [10.4, 960, 620, 1.25], [11.1, 960, 1320, 1.25], [13.4, 960, 1300, 1.25], [14.0, 960, 600, 0.72], [14.56, 960, 600, 0.72]])
    : camAt(a, [[0, 800, 440, 1.0], [1.2, 330, 430, 1.32], [6.1, 360, 430, 1.32], [6.8, 800, 430, 1.32], [10.4, 820, 430, 1.32], [11.1, 1290, 430, 1.32], [13.4, 1280, 430, 1.32], [13.9, 960, 470, 1.0], [14.56, 960, 470, 1.02]]);
  const act = (k) => (k === 0 ? seg(a, 1.33, 1.7) * (1 - seg(a, 6.2, 6.6)) : k === 1 ? seg(a, 6.46, 6.8) * (1 - seg(a, 10.5, 10.9)) : seg(a, 10.75, 11.1)) + (a > 13.6 ? seg(a, 13.6, 14.0) : 0);
  // 1: the magnet and what turns it
  const turn = (i) => seg(a, 4.3 + i * 0.4, 4.6 + i * 0.4);
  const c1 = card(at(0, -20, gen(a * 4, { R: 110, el: 1, glow: a > 2.6 ? 0.5 : 0 })) + at(-120, 210, boiler(turn(0))) + at(0, 220, dam(turn(1), tot)) + at(130, 220, windT(turn(2), tot), 1.1), 1, seg(a, 1.33, 1.6), act(0));
  // 2: up, travel, down, the house
  const tip = pylonTips(220)[2], P1 = [-60, 40], P2 = [80, 40];
  const travel = seg(a, 8.0, 8.8), houseLit = a > 9.5;
  const pulse = travel > 0 && travel < 1 ? rings(lerp(-150, 150, travel), lerp(-40, 10, travel) - 70 * Math.sin(travel * Math.PI), 18, P.gold, 0.7, 1.6) : "";
  const c2 = card(at(-150, -40, xformer(true), 1.0) + at(P1[0], P1[1], pylon(220), 0.9) + at(P2[0], P2[1], pylon(220), 0.9) + span([P1[0] + tip[0] * 0.9, P1[1] + tip[1] * 0.9], [P2[0] + tip[0] * 0.9, P2[1] + tip[1] * 0.9], 10, "#9aa6d8", 5)
    + at(150, -40, xformer(false), 1.0) + pulse + at(40, 240, house(E.houseA, E.houseAD, { roof: E.roof, lit: [houseLit, houseLit, houseLit] }), 0.62), 2, seg(a, 6.46, 6.7), act(1));
  // 3: the balance at 50
  const wob = a > 11 ? 10 * Math.sin((a - 11) * 6) * Math.exp(-(a - 11) * 0.9) : 8, level = a > 13.6 ? 0 : wob;
  const beam = at(0, -80, `<path d="M-170 0H170" stroke="${P.gold}" stroke-width="12" stroke-linecap="round"/>` + at(-170, 0, `<path d="M0 0V60" stroke="${P.gold}" stroke-width="4"/><path d="M-70 60h140l-20 30h-100Z" fill="${P.steel}"/>${at(0, 60, station(tot, { smoke: false }), 0.14)}`, 1, -level) + at(170, 0, `<path d="M0 0V60" stroke="${P.gold}" stroke-width="4"/><path d="M-70 60h140l-20 30h-100Z" fill="${P.steel}"/>${[0, 1, 2, 3].map((i) => `<path d="${rr(-50 + (i % 2) * 54, 18 + Math.floor(i / 2) * 22, 40, 16, 3)}" fill="${P.win}"/>`).join("")}`, 1, 0, ""), 1, level);
  const post = `<path d="M0 -80V140" stroke="${P.steelD}" stroke-width="16"/><path d="M-80 150H80" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>`;
  const gz = at(0, 210, gauge(0.5 + level * 0.01, {}), 0.62);
  const c3 = card(post + beam + gz + (a > 13.6 ? check(110, 170, 34, P.green, a - 13.6) : ""), 3, seg(a, 10.75, 11.0), act(2));
  const cards = [c1, c2, c3].map((g, k) => (a > T[k] - 0.3 ? at(CX[k], CY[k], g, pop(a - T[k] + 0.3, 7, 12)) : at(CX[k], CY[k], card("", k + 1, 0, 0), 0.92))).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(71, 120, -300, 2300, 1000, tot), c, 0.2) + layer((v ? "" : `<rect x="-400" y="760" width="2800" height="600" fill="${P.ground}"/>`) + cards, c);
  return { g };
}

const SHOTS = [s0];
export const e2recapSet = makeSet(SHOTS, V, P);
