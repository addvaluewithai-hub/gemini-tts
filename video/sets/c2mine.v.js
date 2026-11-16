// "c2mine" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Most shots have one subject in the middle and reframe; side-by-side shots are stacked (left part above right part).
export const V = [
  { stack: true, cx: [1250, 720], z: 1.0, bg: ["#120c3a", "#241455"] },   // 0 target above, machine below
  { z: 1.0, dy: 120 },                                                    // 1 the machine, then the planet
  { stack: true, cx: [1350, 640], z: 0.95 },                               // 2 chain above, machine and card below
  { z: 1.25, dy: 0 },                                                     // 3 laptops, then the haystack
  { z: 1.2 },                                                             // 4 cart, then the warehouse
  { stack: true, cx: [700, 1500] },                                       // 5 certificate above, pylon below
  { stack: true, cx: [950, 1350] },                                       // 6 target above, clock and rigs below
  { z: 1.3 },                                                             // 7 the room, then the pull back
  { stack: true, cx: [800, 1250] },                                       // 8 balance above, rig below
  { z: 1.5 },                                                             // 9 the planet
  { z: 1.3 },                                                             // 10 the container under the tarp
  { stack: true, cx: [650, 1520] },                                       // 11 teams above, pie below
  { z: 1.4 },                                                             // 12 the network
  { stack: true, cx: [880, 1600] },                                       // 13 laptops in two panels
];
