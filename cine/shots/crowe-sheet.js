// Test sheet for the drawn Agent Crowe (lib/crowe.js). t = 0: design, in plain light, beside the old silhouette and Peek.
// t = 1: the walk cycle. t = 2: at night on the roof with the torch. t = 3: close on the head. t = 4..: walking across.
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as X from "../lib/explain.js";
import { crowe, croweHands, WALK_CYCLE } from "../lib/crowe.js";
import { F, ants, peek, night, roof, finish } from "../lib/act.js";
export const DUR = 8;
const at = (x, y, k, inner, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -k : k} ${k})">${inner}</g>`;
const studio = `<defs><linearGradient id="stu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d3ea"/><stop offset="1" stop-color="#8f9cc0"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#stu)"/><rect y="1500" width="1080" height="420" fill="#7684ab"/>`;
export function draw(t) {
  return fx.frame(() => {
    if (t < 1) return studio + at(210, 1500, 0.62, N.crowe({})) + at(560, 1500, 0.62, crowe({ shadow: true })) + peek(ants(F("smug"), 4, 4), { shadow: true }, 900, 1500, 0.46)
      + at(200, 640, 0.36, crowe({ shadow: true, hand: { x: 150, y: -940 }, aim: -60, nod: -8 })) + at(540, 640, 0.36, crowe({ shadow: true, crouch: 0.6, lean: 14, hand: { x: 250, y: -470 }, aim: 30, nod: 14 })) + at(880, 640, 0.36, crowe({ shadow: true, handL: { x: -60, y: -1010 }, led: "#ff3b3b" }), true)
      + X.label(210, 1580, "OLD", 44, "#fff") + X.label(560, 1580, "NEW", 44, "#ffe66d");
    if (t < 2) return studio + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => at(150 + (i % 4) * 260, i < 4 ? 880 : 1500, 0.5, crowe({ walk: i / 8 * WALK_CYCLE, shadow: true }))).join("");
    if (t < 3 || t >= 4) { const u = t < 3 ? 0 : t - 4, cx = t < 3 ? 420 : 60 + u * 215, k = 0.9, sw = t < 3 ? -14 : -10 + Math.sin(u * 2.1) * 16, o = { walk: t < 3 ? undefined : (cx - 60) / k, aim: sw, nod: t < 3 ? 0 : Math.sin(u * 2.1 + 0.5) * 7, glint: 0.9, filter: night("Lc", [{ color: "#cfe3ff", az: 225, power: 1.5, size: 9 }, { color: "#ffd9a0", az: 20, power: 0.7, size: 12 }], [0.62, 0.6, 0.95], 0.0) };
      const h = croweHands(o), bx = cx + h.lens[0] * k, by = N.FLOOR - 4 + h.lens[1] * k, c = fx.camera(u, [[0, 560, 1180, 0.92, 0], [4, 760, 1180, 0.96, 0]]);
      const plane = at(cx, N.FLOOR - 4, k, crowe(o)) + fx.beam(bx, by, sw, 2200, 16, "#fff3d6", 0.5, 10) + fx.glow(bx, by, 120, "#fff6dc", 0.9)
        + N.acUnit() + peek(ants(F("worried"), -30, -30), { filter: night("Lp", [{ color: "#cfe3ff", az: 225, power: 1.5, size: 10 }]), shadow: false }, 1240, N.FLOOR + 30, 0.62);
      return [...roof(c, t, t, { plane, hut: true }), ...finish(t, t, { vig: 0.6 })].join(""); }
    return studio + at(430, 3560, 2.9, crowe({})) ;
  });
}
