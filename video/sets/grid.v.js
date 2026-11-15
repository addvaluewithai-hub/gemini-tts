// "One machine" in portrait (1080 x 1920): the three countries stacked one above the other, the oven above the alarm clock;
// the maps (Europe, Japan) through a wider camera.
import { g2, g4 } from "./grid.js";

const BG = ["#041624", "#082a3a"];
const v2 = (a, tot, s) => g2(a, tot, s, { vert: true, tx: [960, 960, 960], ty: [-170, 450, 1070] });
const v4 = (a, tot, s) => g4(a, tot, s, { ox: 960, oy: 260, ax: 960, ay: 980, tgx: 960, tgy: -300, nx: 1010, ny: 1330 });
export const V = [{ z: 0.72, bg: BG }, { z: 0.75, bg: BG }, v2, { z: 0.75, bg: BG }, v4, { z: 0.6, bg: BG }, { z: 0.62, bg: BG }];
