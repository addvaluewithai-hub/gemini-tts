// "Mix" in portrait (1080 x 1920). The pie is reframed (it sits in the middle); the two bars stand narrower and taller
// in the tall frame; the sun's bar climbs the frame. Lower side corners kept clear.
import { bars, sunbar } from "./mix.js";
const v1 = (a, tot) => bars(a, tot, { XC: 330, XR: 750, B: 1400, H: 26, W: 260, cam: [[0, 540, 960, 1.0], [6.42, 540, 900, 1.05]] });
const v2 = (a, tot) => sunbar(a, tot, { X: 540, B: 1450, H: 100, cam: [[0, 540, 980, 1.0], [3.95, 540, 960, 0.98]] });
export const V = [{ z: 0.8, dy: 40 }, v1, v2];
