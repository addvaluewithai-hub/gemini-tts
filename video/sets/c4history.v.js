// "c4history" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// The mountain is wide, so the shots that show it whole are cut in two and stacked; close shots are reframed.
export const V = [
  { z: 1.0, bg: ["#120c3a", "#241656"] },   // 0 the first peak
  { stack: true },                           // 1 2013 and 2017
  { stack: true },                           // 2 2021 and 2025
  { stack: true },                           // 3 the falls
  { z: 1.0 },                                // 4 Cyprus board
  { z: 1.0 },                                // 5 2017 board
  { z: 1.0 },                                // 6 2021 board
  { z: 1.0 },                                // 7 2025 board
  { z: 0.9 },                                // 8 the cycle
  { stack: true },                           // 9 three years
  { stack: true },                           // 10 two and a half years
  { z: 0.62, dy: 40 },                       // 11 the study, whole
  { z: 0.9 },                                // 12 the obituary
  { z: 0.8 },                                // 13 400+
  { z: 1.0 },                                // 14 still breathing
  { stack: true },                           // 15 the halvings
];
