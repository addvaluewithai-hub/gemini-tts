// Look check: Peek before the disguise (no hat), next to the Peek we know.
import { peek3d, MOUTHS } from "../lib/peek.js";
import { EMOTES } from "../lib/acting.js";
import * as fx from "../lib/fx.js";
export const DUR = 1;
const P = (e, o, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${peek3d({ ...e, m: typeof e.mouth === "string" ? MOUTHS[e.mouth] : e.mouth, mouth: undefined, antL: e.ant, antR: e.ant }, { face: "pear", bg: false, grain: false, roll: false, ...o })}</g>`;
export const draw = () => fx.frame(() => [`<rect width="1080" height="1920" fill="#141a48"/>`,
  P(EMOTES.neutral, { hat: false, id: "a" }, 0, 20, 0.47), P(EMOTES.neutral, { id: "b" }, 520, 20, 0.47),
  P(EMOTES.surprised, { hat: false, id: "c", turn: 0.7 }, 0, 640, 0.47), P(EMOTES.grin, { hat: false, id: "d", turn: -0.6, armL: { x: 330, y: 470 }, armR: { x: 870, y: 470 } }, 520, 640, 0.47),
  P(EMOTES.worried, { hat: false, id: "e", nod: 0.8 }, 0, 1260, 0.47), P({ ...EMOTES.proud, lid: 1 }, { hat: false, id: "f", armL: { x: 300, y: 640 }, armR: { x: 900, y: 640 } }, 520, 1260, 0.47)]);
