// "Pipes" in portrait (1080 x 1920), for the Shorts (the tea Short uses shots 6–12). Shots 0–5 and 8 are the landscape
// shots through a moved camera; the balance (6) is redrawn taller and narrower, the bulbs round the tea glass (7) fill a
// tall grid with the lower right corner left for the host, and the shelf of names (9–12) becomes four shelves one under
// the other with the camera going down (shelfShotV in pipes.js).
import { s6, s7, shelfShotV } from "./pipes.js";

export const V = [
  { z: 0.82, dy: -40 },       // 0 the teal house, the tank lands on its roof
  { z: 0.82, dy: -40 },       // 1 the tank climbs; V
  { z: 0.9 },                 // 2 the pipe; the stopwatch; A
  { z: 0.9 },                 // 3 the clamp; Ω
  { z: 0.85, dy: 40 },        // 4 the tank climbs again; the wire under the street
  { z: 0.78, dx: 60 },        // 5 the water wheel, V × A = W, the bill
  (a, tot, s) => s6(a, tot, s, { keys: [[0, 540, 920, 1.0], [3.69, 540, 930, 0.97]], PX: 540, PYv: 560, L: 285, hang: 420, stand: 820, tip: 24 }),
  (a, tot, s) => s7(a, tot, s, { keys: [[0, 540, 960, 1.1], [2.0, 540, 960, 1.0]], CX: 540, CY: 820, rows: 20, cols: 13, x0: 48, y0: 70, dy: 92, tagDy: 330, skip: (x, y) => x > 700 && y > 1330 }),
  { z: 1.0 },                 // 8 inside the old bulb
  ...[9, 10, 11, 12].map((k) => (a, tot, s) => shelfShotV(k)(a, tot, s)),   // 9–12 the four names, one under the other
];
