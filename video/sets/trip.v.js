// "The trip" in portrait (1080 x 1920), for the Shorts. The shots with things side by side are laid out for the tall
// frame through the layout argument of their landscape function (trip.js); the rest are the landscape shots through
// a moved camera. Lower side corners stay clear for the host.
//   0 the generator above, the line running down into the transformer box below; tags at the top
//   3 the wall of plugs in three columns, 15 at the top
//   6 the two lanes one above the other, narrower
//   7 the jammed road above, the train's track below
//   8 the AC box above (TESLA), the DC box below (EDISON)
//  10 the pylon tall at the left, the kite drifting in high
import { s0, s3, s4, s6, s7, s8, s10 } from "./trip.js";

const G0 = 880;
export const V = [
  (a, t, s) => s0(a, t, s, { gen: [960, 520], box: [960, 1500], tag0: [540, 230], tag1: [540, 230], cam: [[0, 960, 900, 1.0], [7.2, 960, 960, 0.98]] }),
  { z: 0.8 },
  { z: 1.3, dy: 140 },
  (a, t, s) => s3(a, t, s, { cols: 3, x0: 720, y0: 560, dx: 240, dy: 250, k: 1.05, tag: [540, 260], cam: [[0, 960, 1020, 1.05], [5.39, 960, 1000, 1.0]] }),
  { z: 0.62 },
  { z: 0.78 },
  (a, t, s) => s6(a, t, s, { x0: 540, x1: 1380, y1: 760, y2: 1280, lab: 960, cam: [[0, 960, 1000, 1.0], [6.34, 960, 1000, 1.02]] }),
  (a, t, s) => s7(a, t, s, { road: 760, rail: 1300, w: 1920, cam: [[0, 960, 980, 1.0], [5.66, 960, 1000, 1.04]] }),
  (a, t, s) => s8(a, t, s, { ac: [960, 560], dc: [960, 1330], plates: [[960, 860], [960, 1640]], k: 1.2, cam: [[0, 960, 1000, 1.0], [5.46, 960, 1000, 1.03]] }),
  { z: 0.75, dy: 60 },
  (a, t, s) => s10(a, t, s, { px: 1150, g: 1450, h: 1150, kx0: 460, kx1: 640, ky: 560, cam: [[0, 960, 1000, 1.0], [10.89, 960, 980, 1.06]] }),
];
