// "copy" in portrait (1080 x 1920), for the Shorts. V[k] is how landscape shot k is shown in the tall frame: { z, dx, dy } reframes it
// (a subject in the middle), { stack: true, cx: [top, bottom] } cuts it in two and stacks the halves (things side by side). See makeSet in kit.js.
export const V = [{ z: 1.3 }, { stack: true, cx: [640, 1280] }, { stack: true, cx: [480, 1250] }, { z: 0.95 }, { z: 0.85 }, { stack: true, cx: [480, 1450] }];
