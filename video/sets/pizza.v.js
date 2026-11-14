// "pizza" in portrait (1080 x 1920), for the Shorts. V[k] is how landscape shot k is shown in the tall frame: { z, dx, dy } reframes it
// (a subject in the middle), { stack: true, cx: [top, bottom] } cuts it in two and stacks the halves (things side by side); bg fills
// above and below a world that ends (a room, a table). See makeSet in kit.js.
const table = ["#1a0f39", "#a76a3d"];
export const V = [{ z: 1.0, bg: table }, { z: 0.9, dx: -100 }, { z: 0.9, dx: -60 }, { z: 1.0, bg: table }];
