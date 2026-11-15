// "Sources" in portrait (1080 x 1920). The three windows and the dam are reframed on the subject; the wind farm is
// the landscape shot through a closer camera; the solar shot is laid out tall: the sun at the top, the panel in the
// middle, the wire climbing to the bulb on the left, the lower side corners kept clear for Peek.
import { solar } from "./sources.js";
const v3 = (a, tot) => solar(a, tot, { G: 1300, PX: 540, SX: 840, SY: 260, BX: 180, BY: 560, TX: 820, cam: [[0, 540, 960, 1.0], [6.76, 540, 940, 0.96]] });
export const V = [{ z: 1.0, dx: 120 }, { z: 1.25 }, { z: 1.3, dy: -60 }, v3];
