// "vanish" in portrait (1080 x 1920), for the Shorts. V[k] is how landscape shot k is shown in the tall frame: { z, dx, dy } reframes it
// (a subject in the middle), { stack: true, cx: [top, bottom] } cuts it in two and stacks the halves (things side by side); bg fills
// above and below a world that ends (a room, a table). See makeSet in kit.js.
const room = ["#4a2b89", "#402479"], night = ["#3b1d73", "#2c1a66"];
export const V = [{ z: 0.85, bg: room }, { z: 0.85, bg: room }, { z: 0.85, bg: room }, { z: 0.9, bg: night }, { z: 0.8, bg: night }];
