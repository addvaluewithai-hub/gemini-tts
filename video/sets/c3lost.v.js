// "c3lost" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Wide shots are cut in two and stacked; shots with one subject in the middle are reframed around it.
export const V = [
  { stack: true, cx: [700, 1300] },          // 0 house | bin and 2013
  { stack: true, cx: [620, 1320] },          // 1 drive and key | ≈ 8,000
  { stack: true, cx: [760, 1560] },          // 2 landfill | council and the gavel
  { z: 1.1, dx: 0, dy: -40 },                // 3 the flag on the heap
  { stack: true, cx: [620, 1320] },          // 4 flash drive | 7,002
  { stack: true, cx: [620, 1180] },          // 5 flash drive | ????
  { z: 1.0, dx: -40, dy: 0 },                // 6 ten dots
  { z: 0.9, dx: 0, dy: 40 },                 // 7 coins sinking
  { stack: true, cx: [620, 1180] },          // 8 mask | bubble
  { stack: true, cx: [1000, 1440] },         // 9 chair and key | the greyed row
  { stack: true, cx: [700, 1160] },          // 10 house | hush sign
  { z: 1.0, dx: 0, dy: 0 },                  // 11 the cold wallet cracks
  { stack: true, cx: [700, 1450] },          // 12 cracked box | keys and die
  { stack: true, cx: [600, 1450] },          // 13 cold boxes | sack
  { z: 1.0, dx: -60, dy: 0 },                // 14 the exchange path
  { stack: true, cx: [1280, 1720] },         // 15 your own box | the wilting flower
];
