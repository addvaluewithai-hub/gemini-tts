// "crisis" in portrait (1080 x 1920), for the Shorts. V[k] is how landscape shot k is shown in the tall frame: { z, dx, dy } reframes it
// (a subject in the middle), { stack: true, cx: [top, bottom] } cuts it in two and stacks the halves (things side by side). See makeSet in kit.js.
export const V = [{ z: 1.1 }, { stack: true, cx: [420, 1400] }, { stack: true, cx: [520, 1420] }, { z: 0.9 }];
