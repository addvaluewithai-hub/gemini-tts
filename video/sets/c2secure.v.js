// "c2secure" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Wide shots are cut in two and stacked (left part above right part); the others are seen through a moved camera.
export const V = [{ stack: true, z: 1.0 }, { z: 0.8, dx: -60, dy: -150 }, { stack: true, z: 0.95 }, { stack: true, z: 0.95 }, { z: 0.8, dy: -180 }, { stack: true, z: 0.95 }, { stack: true, z: 0.9 }];
