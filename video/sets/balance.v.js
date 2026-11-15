// "The balance" in portrait (1080 x 1920). Shots with things side by side are laid out one above the other through the
// shots' own layout options (balance.js); the rest are the landscape shot through a wider camera. In portrait the camera of
// each shot still looks at world (960, 540), so the tall frame shows world x 420..1500 and y -420..1500.
import { s1, s2, s4, s6, s9, s10 } from "./balance.js";

const BG = ["#041624", "#082a3a"], ROOM = ["#0a2536", "#061a28"];
const v1 = (a, tot, s) => s1(a, tot, s, { dx: 960, dy: 120, rx: 960, ry: 720, t50x: 760, t50y: 1130, t60x: 1180, t60y: 1130 });
const v2 = (a, tot, s) => s2(a, tot, s, { dx: 960, dy: 60, wx: 1180, wy: 520, ccx: 820, ccy: -300, hx: 470, hn: 3 });
const v4 = (a, tot, s) => s4(a, tot, s, { rx: 960, ry: 200, dx: 1180, dy: 780 });
const v6 = (a, tot, s) => s6(a, tot, s, { x: 1000, y: 380 });
const v9 = (a, tot, s) => s9(a, tot, s, { x0: 520, x1: 1420, y0: 560, tx: 960, ty: -170, sx: 620, sy: 1180 });
const v10 = (a, tot, s) => s10(a, tot, s, { scx: 960, scy: 20, tvx: 960, tvy: 640, ckx: 1180, cky: 980, stx: 720, sty: 1300 });
export const V = [{ z: 0.7, bg: BG }, v1, v2, { z: 0.7, dx: -60, bg: ROOM }, v4, { z: 0.58, dx: 10, bg: BG }, v6, { z: 0.72, bg: BG }, { z: 0.62, bg: ["#041624", "#082a3a"] }, v9, v10];
