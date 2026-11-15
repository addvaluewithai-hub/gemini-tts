// "c4suits" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
export const V = [
  { stack: true, cx: [560, 1320], dy: [-60, -60] },  // 0 the tower and 2017 above, the labelled coin below
  { stack: true, cx: [560, 1420], dy: [-60, -60] },  // 1 the tower above, the fund filling below
  { stack: true, cx: [520, 1380], dy: [0, 0] },      // 2 the house above, the fund below
  { z: 0.95 },                                       // 3 the fund buying
  { stack: true, cx: [520, 1300], dy: [0, 0] },      // 4 the house, price tag and key above, the slip and fund below
  { stack: true, cx: [560, 1420], dy: [0, 0] },      // 5 the bank and the house above, the gate and the deck chair below
  { z: 0.9, dx: 220 },                               // 6 the flag and its label
  { stack: true, cx: [700, 1500], dy: [0, -40] },    // 7 the flag coming down above, the IMF and its loan below
  { stack: true, cx: [700, 1500], dy: [0, -60] },    // 8 the reserve vault above, the untouched BUY below
  { stack: true, cx: [700, 1420], dy: [-40, -40] },  // 9 the Strategy tower above, the loss and the calendar pages below
];
