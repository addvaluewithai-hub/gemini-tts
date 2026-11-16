// "c3use" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Side-by-side shots (house and tower, two houses, slip and phone, the balance) are cut in two and stacked; the page and the code are reframed.
export const V = [
  { z: 0.58 },                       // 0 the exchange: house above, tower and counter below
  { z: 0.58 },                       // 1 two houses over the fence
  { z: 0.58 },      // 2 the slip above, the phone below
  { z: 1.0, dx: 120 },                   // 3 the fee flies up to the page
  { z: 1.0 },                            // 4 the page is sealed
  { z: 0.58 },      // 5 the wrong character, the dark house, the closed window
  { z: 0.85, dx: 0 },                    // 6 the bug, the code, the magnifier
  { z: 0.58 },                       // 7 the company and its $2,000
  { z: 0.58 },      // 8 the balance and the fee
  { z: 0.58 },                       // 9 given back
];
