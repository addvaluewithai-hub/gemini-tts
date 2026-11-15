// "c5s7" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// The wide street shots are cut in two and stacked; the close ones are reframed a little wider.
export const V = [
  { stack: true, z: 0.95 },
  { z: 0.7, dy: 40 },
  { z: 0.7, dy: 40 },
  { stack: true, z: 0.9 },
  { z: 0.8 },
  { stack: true, z: 0.95 },
  { stack: true, z: 0.85, dy: [-60, -60] },
  { stack: true, z: 0.95 },
];
