// "c3use" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Side-by-side shots (house and tower, two houses, slip and phone, the balance) are cut in two and stacked; the page and the code are reframed.
export const V = [
  { stack: true },                       // 0 the exchange: house above, tower and counter below
  { stack: true },                       // 1 two houses over the fence
  { stack: true, cx: [560, 1260] },      // 2 the slip above, the phone below
  { z: 1.0, dx: 120 },                   // 3 the fee flies up to the page
  { z: 1.0 },                            // 4 the page is sealed
  { stack: true, cx: [700, 1100] },      // 5 the wrong character, the dark house, the closed window
  { z: 0.85, dx: 0 },                    // 6 the bug, the code, the magnifier
  { stack: true },                       // 7 the company and its $2,000
  { stack: true, cx: [700, 1250] },      // 8 the balance and the fee
  { stack: true },                       // 9 given back
];
