// Rig test sheet: turn, run poses, emotions, lighting. t picks the panel set.
import { peek3d } from "../lib/peek.js";
import { EMOTES } from "../lib/acting.js";
import * as fx from "../lib/fx.js";
export const DUR = 2;
const P = (e, o, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${peek3d(e, { face: "pear", bg: false, grain: false, roll: false, ...o })}</g>`;
export function draw(t) {
  return fx.frame(() => {
    const cells = t < 1 ? [
      [{ ...EMOTES.neutral }, { turn: -1, id: "a" }], [{ ...EMOTES.neutral }, { turn: -0.5, id: "b" }], [{ ...EMOTES.neutral }, { turn: 0.5, id: "c" }], [{ ...EMOTES.neutral }, { turn: 1, id: "d" }],
      [{ ...EMOTES.worried, look: -1 }, { turn: -0.8, nod: 0.6, id: "e", legL: { y: -50, x: -10, rot: -20 }, armL: { x: 380, y: 700 }, armR: { x: 800, y: 760 }, sway: -8, bounce: 20 }],
      [{ ...EMOTES.surprised }, { id: "f", bounce: 90, squash: 1.12, legL: { y: -40, x: -20, rot: -25 }, legR: { y: -30, x: 20, rot: 25 }, armL: { x: 300, y: 560 }, armR: { x: 900, y: 560 }, hatLift: 40, hatRot: 6 }],
      [{ ...EMOTES.proud, lid: 1 }, { id: "g", bounce: 60, armL: { x: 300, y: 640 }, armR: { x: 900, y: 640 }, legL: { y: -20, rot: 15 }, legR: { y: -20, rot: -15 }, shadow: false }],
      [{ ...EMOTES.worried, lookY: 1, pupil: 0.55, eyeScale: 1.2 }, { id: "h", nod: 1, armL: { x: 340, y: 520 }, armR: { x: 860, y: 520 } }],
    ] : [
      [{ ...EMOTES.neutral }, { id: "a", filter: fx.litFilter("L1", { ambient: [0.42, 0.48, 0.85], lights: [{ color: "#8fd0ff", az: 200, power: 1.3, size: 10 }] }) }],
      [{ ...EMOTES.worried }, { id: "b", turn: 0.6, filter: fx.litFilter("L2", { ambient: [0.3, 0.33, 0.6], lights: [{ color: "#fff1d0", az: 330, power: 1.8, size: 14 }, { color: "#ff5fb0", az: 190, power: 0.8, size: 8 }] }) }],
      [{ ...EMOTES.surprised }, { id: "c", filter: fx.litFilter("L3", { ambient: [0.9, 0.9, 0.95], bright: 0.08, lights: [{ color: "#ffffff", az: 270, power: 0.6, size: 10 }] }) }],
      [{ ...EMOTES.sly }, { id: "d", turn: -0.7, filter: fx.litFilter("L4", { ambient: [0.42, 0.45, 0.8], lights: [{ color: "#bfe0ff", az: 250, power: 2.2, size: 9 }] }) }],
    ];
    const out = [`<rect width="1080" height="1920" fill="#101536"/>`];
    cells.forEach(([e, o], i) => { const col = i % 2, row = Math.floor(i / 2), k = t < 1 ? 0.43 : 0.45; out.push(P(e, o, 20 + col * 530, 10 + row * (t < 1 ? 478 : 940), k * (t < 1 ? 1 : 1.9) / (t < 1 ? 1 : 1.9) * (t < 1 ? 1 : 1))); });
    return out;
  });
}
