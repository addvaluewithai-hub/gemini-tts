// "Spark" in portrait (1080 x 1920), for the Shorts (the lightning Short uses shots 5–13). Most shots are the landscape
// shot through a moved camera; the screen-space tags of shots 3–4, 6–9 and 11 sit in the tall frame (spark.js reads
// FW/FH for them). Shot 10, the sun and the bolt side by side, is redrawn one above the other (s10v in spark.js).
import { s10v } from "./spark.js";

export const V = [
  { z: 1.2 },                 // 0 the jar
  { z: 1.0 },                 // 1 the slippers on the carpet
  { z: 1.0 },                 // 2 the glove and the knob
  { z: 0.74, dx: -20 },       // 3 the spark between glove and knob, tag above
  { z: 0.74, dx: -20 },       // 4 three little charges
  { z: 1.0 },                 // 5 the spark grows into a bolt over the town
  { z: 1.0, dx: -150 },       // 6 the cloud charges, the bolt hits the ground
  { z: 1.0, dx: -150 },       // 7 300,000,000 V
  { z: 1.0, dx: -150 },       // 8 30,000 A
  { z: 1.0, dx: -140 },       // 9 the planet, flashes, the stopwatch above it
  (a, tot, s) => s10v(a, tot, s),   // 10 the sun above, the bolt below
  { z: 1.0 },                 // 11 the thunder
  { z: 0.75, dx: 60 },        // 12 1752, the kite with a key
  { z: 0.8 },                 // 13 1753, the study
];
