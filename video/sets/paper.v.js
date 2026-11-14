// "paper" in portrait (1080 x 1920), for the Shorts. V[k] is how landscape shot k is shown in the tall frame: { z, dx, dy } reframes it
// (a subject in the middle), { stack: true, cx: [top, bottom] } cuts it in two and stacks the halves (things side by side); bg fills
// above and below a world that ends (a room, a table). See makeSet in kit.js.
export const V = [{ z: 0.85 }, { z: 0.62, bg: ["#a86a3b", "#a86a3d"] }, { z: 1.0 }, { z: 0.85, bg: ["#3b2a80", "#2c1a66"] }];
