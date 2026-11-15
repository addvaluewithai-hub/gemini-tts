// The recap of electricity part 3 of 4: one shot, three cards that come in on «واحد» (1.26), «اتنين» (6.85), «تلاتة»
// (11.59); the camera visits each and pulls back over all three at the end.
//   1 the domino: a small grid; shields pop on each line on «الحماية»; then the lines go dark one after another on «بتنشر الوقعة»
//   2 the enemies, one on each word: a tree, a snowflake, the Sun, a cursor, a squirrel
//   3 a dam lights by itself and the island of towns round it grows back
// The host leans in from the right: every card stays left of x = 1530.
import { clamp, lerp, ease, seg, spring, camAt, layer, rr, two, disc, rings, text, drawn, at, check, makeSet, FW, FH, portrait } from "./kit.js";
import { V } from "./e3recap.v.js";
import { P, E, mix, stars, pop } from "./elec.js";
import { sun, squirrel, cursor, tree, snowflake } from "./enemies.js";
import { dam } from "./blackstart.js";

const CW = 440, CH = 560, T = [1.26, 6.85, 11.59];
const marker = (n, on) => `${on > 0 ? rings(0, 0, 70 * on, P.gold, 0.25) : ""}${disc(0, 0, 50, mix("#1f6d8c", P.gold, clamp(on)), mix("#164a6a", P.goldD, clamp(on)))}${text(0, 24, String(n), 70, mix("#5a8aa6", "#8a5200", clamp(on)))}`;
const card = (inner, n, on, act) => `${act > 0 ? rings(0, 0, 330, P.gold, 0.06 * act, 1.15) : ""}${two(rr(-CW / 2, -CH / 2, CW, CH, 34), "#0f3a55", "#0a2b40", 10, 8)}<path d="${rr(-CW / 2 + 16, -CH / 2 + 16, CW - 32, CH - 32, 24)}" fill="#071d2c"/>${inner}${at(-CW / 2 + 20, -CH / 2 + 20, marker(n, on))}`;
const shield = (k = 1) => at(0, 0, `<path d="M0 -30L24 -20V2Q24 22 0 32Q-24 22 -24 2V-20Z" fill="${P.green}"/><path d="M-10 0L-2 9L12 -8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`, k);
// card 1's grid
const NODES = [[-130, -150], [0, -170], [130, -140], [-140, 0], [0, -10], [140, 10], [-120, 150], [10, 160], [140, 150]];
const EDGES = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8]];
// card 3's island
const ISLE = [[-120, -40], [-30, -90], [70, -60], [130, 30], [60, 110], [-60, 120], [-140, 70]];

function s0(a, tot) {
  const v = portrait();
  const CX = v ? [960, 960, 960] : [300, 800, 1300], CY = v ? [-120, 600, 1320] : [420, 420, 420];
  const c = v ? camAt(a, [[0, 960, 600, 0.7], [1.1, 960, -120, 1.25], [6.5, 960, -100, 1.25], [7.2, 960, 600, 1.25], [11.2, 960, 620, 1.25], [11.9, 960, 1320, 1.25], [15.0, 960, 1300, 1.25], [15.6, 960, 600, 0.72], [15.74, 960, 600, 0.72]])
    : camAt(a, [[0, 960, 470, 1.0], [1.1, 330, 430, 1.32], [6.5, 360, 430, 1.32], [7.2, 800, 430, 1.32], [11.2, 820, 430, 1.32], [11.9, 1290, 430, 1.32], [15.0, 1280, 430, 1.32], [15.5, 960, 470, 1.0], [15.74, 960, 470, 1.01]]);
  const act = (k) => (k === 0 ? seg(a, 1.26, 1.6) * (1 - seg(a, 6.6, 7.0)) : k === 1 ? seg(a, 6.85, 7.2) * (1 - seg(a, 11.3, 11.7)) : seg(a, 11.59, 11.9)) + (a > 15.2 ? seg(a, 15.2, 15.6) : 0);
  // 1: the domino with shields
  const fallE = (e) => seg(a, 6.02 + e * 0.05, 6.12 + e * 0.05);
  const g1 = EDGES.map(([i, j], e) => { const f = fallE(e); return `<path d="M${NODES[i][0]} ${NODES[i][1]}L${NODES[j][0]} ${NODES[j][1]}" stroke="${mix(E.el, "#21495c", f)}" stroke-width="7"/>${a > 3.72 + e * 0.06 ? at((NODES[i][0] + NODES[j][0]) / 2, (NODES[i][1] + NODES[j][1]) / 2, shield(0.8 * spring(a - 3.72 - e * 0.06, 9, 16))) : ""}`; }).join("")
    + NODES.map(([x, y], i) => { const f = seg(a, 6.02 + i * 0.03, 6.2 + i * 0.03); return `<circle cx="${x}" cy="${y}" r="16" fill="${mix(P.win, "#21495c", f)}"/>`; }).join("");
  const c1 = card(at(0, 40, g1), 1, seg(a, 1.26, 1.5), act(0));
  // 2: the enemies, one on each word
  const EN = [[8.35, -110, -130, () => tree(150)], [9.07, 110, -170, () => snowflake(54)], [9.63, -100, 50, () => sun(50, tot, 0)], [10.31, 90, 20, () => cursor(1.3, 0)], [11.03, 0, 230, () => squirrel(tot)]];
  const c2 = card(EN.map(([t0, x, y, f]) => a > t0 - 0.05 ? at(x, y, f(), pop(a - t0)) : "").join(""), 2, seg(a, 6.85, 7.1), act(1));
  // 3: the dam lights and the island grows
  const self = seg(a, 12.19, 12.6), R = lerp(0, 260, ease(seg(a, 13.06, 15.1)));
  const isle = ISLE.map(([x, y], i) => { const on = clamp((R - Math.hypot(x + 120, y - 200)) / 40); return `${on > 0 ? rings(x, y, 26, P.win, 0.3 * on, 1.5) : ""}${[0, 1].map((k) => `<rect x="${x - 14 + k * 16}" y="${y - 14}" width="12" height="24" rx="3" fill="${mix("#12303e", P.win, on)}"/>`).join("")}`; }).join("");
  const c3 = card(`<ellipse cx="0" cy="40" rx="190" ry="200" fill="#164a62"/>` + isle + at(-120, 230, dam(self, tot), 0.55) + (a > 15.0 ? check(130, 200, 34, P.green, a - 15.0) : ""), 3, seg(a, 11.59, 11.8), act(2));
  const cards = [c1, c2, c3].map((g, k) => (a > T[k] - 0.3 ? at(CX[k], CY[k], g, pop(a - T[k] + 0.3, 7, 12)) : at(CX[k], CY[k], card("", k + 1, 0, 0), 0.92))).join("");
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(83, 120, -300, 2300, 1000, tot), c, 0.2) + layer((v ? "" : `<rect x="-400" y="760" width="2800" height="600" fill="${P.ground}"/>`) + cards, c);
  return { g };
}

const SHOTS = [s0];
export const e3recapSet = makeSet(SHOTS, V, P);
