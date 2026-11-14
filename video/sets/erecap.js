// The recap of electricity part 1: one shot, three cards that come in on «واحد», «اتنين», «تلاتة»; the camera visits each and
// pulls back over all three at the end.
//   1 a jar of charges that only jiggle (standing: static), then a wire whose charges flow (moving: current)
//   2 the rooftop tank with its three gauges: V (pressure), A (amount), Ω (the narrowing)
//   3 a pylon line carrying the wave far to the charger cube, a phone on its straight line; on «عايشين مع بعض» the cube
//     glows and the phone fills: the two live together
// The host leans in from the right: every card stays left of x = 1530.
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, makeSet, FW, FH } from "./kit.js";
import { P, E, mix, stars, electron, tube, tank, gauge, pylon, pylonTips, span, charger } from "./elec.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const CW = 440, CH = 540, CY = 420, CX = [300, 800, 1300], T = [1.4, 5.31, 9.27];
const marker = (n, on) => `${on > 0 ? rings(0, 0, 70 * on, P.gold, 0.25) : ""}${disc(0, 0, 50, mix("#1f6d8c", P.gold, clamp(on)), mix("#164a6a", P.goldD, clamp(on)))}${text(0, 24, String(n), 70, mix("#5a8aa6", "#8a5200", clamp(on)))}`;
const card = (inner, n, on, act) => `${act > 0 ? rings(0, 0, 330, P.gold, 0.06 * act, 1.15) : ""}${two(rr(-CW / 2, -CH / 2, CW, CH, 34), "#0f3a55", "#0a2b40", 10, 8)}<path d="${rr(-CW / 2 + 16, -CH / 2 + 16, CW - 32, CH - 32, 24)}" fill="#071d2c"/>${inner}${at(-CW / 2 + 20, -CH / 2 + 20, marker(n, on))}`;
// a glass jar (base on y = 0) of charges that jiggle in place; glow 0..1
const jar = (t, glow) => { let d = ""; for (let i = 0; i < 9; i++) d += at(-70 + (i % 3) * 70 + 14 * Math.sin(t * 7 + i * 2), -60 - Math.floor(i / 3) * 62 + 12 * Math.cos(t * 6 + i), electron(22));
  return `${glow > 0 ? rings(0, -110, 150, "#5fd6ff", 0.15 * glow) : ""}${d}<path d="M-120 -230h240v30q14 18 14 46v140q0 14 -14 14h-240q-14 0 -14 -14v-140q0 -28 14 -46Z" fill="#cfe9ff" opacity=".18" stroke="#cfe9ff" stroke-width="7"/>${two(rr(-130, -258, 260, 34, 10), P.wood, P.woodD, 0, 6)}`; };
// a phone (centre) whose battery fills; fill 0..1
const phoneC = (fill) => `${two(rr(-70, -130, 140, 260, 26), "#1d2c44", "#101a2c", 8, 0)}<path d="${rr(-56, -108, 112, 210, 12)}" fill="#0b2436"/><path d="${rr(-26, -60, 52, 110, 8)}" fill="none" stroke="#5dffb0" stroke-width="6"/><path d="${rr(-14, -72, 28, 12, 4)}" fill="#5dffb0"/>
  <path d="${rr(-18, 42 - 96 * clamp(fill), 36, 96 * clamp(fill), 4)}" fill="#5dffb0"/>`;

function s0(a, tot) {
  const c = camAt(a, [[0, 800, 440, 1.0], [1.2, 330, 430, 1.32], [4.9, 360, 430, 1.32], [5.6, 800, 430, 1.32], [8.9, 820, 430, 1.32], [9.6, 1290, 430, 1.32], [12.7, 1280, 430, 1.32], [13.4, 960, 470, 1.0], [14.22, 960, 470, 1.02]]);
  const act = (k) => (k === 0 ? seg(a, 1.4, 1.8) * (1 - seg(a, 5.0, 5.4)) : k === 1 ? seg(a, 5.3, 5.7) * (1 - seg(a, 9.0, 9.4)) : seg(a, 9.3, 9.7)) + (a > 12.99 ? seg(a, 12.99, 13.4) : 0);
  // 1: standing charge, moving charge
  const c1 = card(at(0, 60, jar(tot, a > 3.0 ? Math.exp(-(a - 3.0) * 1.5) : 0), 0.9) + tube(-170, 170, 140, 80, tot, a > 4.09 ? (a - 4.09) * 160 : 0, { n: 6, r: 20 })
    + (a > 4.09 ? `<path d="M-120 230H120M90 210L120 230L90 250" fill="none" stroke="${P.gold}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="${seg(a, 4.09, 4.4).toFixed(2)}"/>` : ""), 1, seg(a, 1.4, 1.7), act(0));
  // 2: the tank and its three gauges
  const flowOn = a > 5.9, pipe = `<path d="M-60 -10V120H120" fill="none" stroke="${P.steelD}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/><path d="M-60 -10V120H120" fill="none" stroke="${E.waterD}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>${flowOn ? `<path d="M-60 -10V120H120" fill="none" stroke="${E.water}" stroke-width="12" stroke-dasharray="26 30" stroke-dashoffset="${(-tot * 160).toFixed(0)}"/>` : ""}${a > 8.26 ? `<path d="M30 102h40v36h-40Z" fill="${P.steel}"/>` : ""}`;
  const g3 = [["V", -110, 5.92, 0.8], ["A", 20, 6.83, 0.6], ["Ω", 150, 8.26, 0.3]].map(([m, x, t0, v]) => (a > t0 ? at(x, 200, gauge(v * ease(seg(a, t0, t0 + 0.5)), { mark: m }), 0.55 * pop(a - t0)) : "")).join("");
  const c2 = card(at(-60, 40, tank(0.8, { c: "#2f8fb0", cD: "#1f6d8c" }), 0.62) + pipe + g3, 2, seg(a, 5.31, 5.6), act(1));
  // 3: the line carries the wave far to the cube, the phone runs on a straight line; then the two together
  const tip = pylonTips(300)[0], P1 = [-130, 20], P2 = [130, 20];
  const line = at(P1[0], P1[1], pylon(300), 0.9) + at(P2[0], P2[1], pylon(300), 0.9) + span([P1[0] + tip[0] * 0.9, P1[1] + tip[1] * 0.9], [P2[0] + tip[0] * 0.9, P2[1] + tip[1] * 0.9], 14, "#9aa6d8", 5);
  const wv = a > 10.41 ? drawn(`M-180 -215${Array.from({ length: 8 }, (_, i) => `q${11} ${i % 2 ? 22 : -22} 22 0`).join("")}`, seg(a, 10.41, 10.9), P.gold, 10, `transform="translate(${((a * 60) % 44).toFixed(1)} 0)"`) : "";
  const together = a > 12.99 ? ease(seg(a, 12.99, 13.6)) : 0;
  const cube = at(-80, 120, (together > 0 ? rings(0, 0, 90, P.gold, 0.3 * together) : "") + charger(), 0.5 * pop(a - 10.6));
  const ph = at(120, 150, phoneC(lerp(0.2, 1, together)), 0.8 * pop(a - 11.9)) + (a > 11.95 ? `<path d="M10 260H230" stroke="#5fd6ff" stroke-width="10" stroke-linecap="round" opacity="${seg(a, 11.95, 12.2).toFixed(2)}"/>` : "");
  const c3 = card(line + wv + cube + ph + (together > 0 ? `<path d="M-40 150Q20 210 60 160" fill="none" stroke="${P.gold}" stroke-width="10" stroke-dasharray="14 10" opacity="${together.toFixed(2)}"/>` : ""), 3, seg(a, 9.27, 9.6), act(2));
  const cards = [c1, c2, c3].map((g, k) => (a > T[k] - 0.3 ? at(CX[k], CY, g, pop(a - T[k] + 0.3, 7, 12)) : at(CX[k], CY, card("", k + 1, 0, 0), 0.92))).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(71, 120, -300, 2300, 1000, tot), c, 0.2) + layer(`<rect x="-400" y="760" width="2800" height="600" fill="${P.ground}"/>` + cards, c);
  return { g };
}

const SHOTS = [s0];
export const erecapSet = makeSet(SHOTS, [], P);
