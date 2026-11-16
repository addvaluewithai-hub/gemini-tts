// "c3bank" in portrait (1080 x 1920), for the Shorts. V[k]: a shot drawn for the tall frame, or how to reframe landscape shot k (see makeSet in kit.js).
// Wide shots (several towers, a booth and a pie, a pipe between two buildings, two thefts, the sea and the tower) are cut in two and stacked.
export const V = [
  { stack: true, cx: [600, 1340], dy: [-40, -120] },   // 0 houses above, the tower below
  { z: 1.0 },                                         // 1 the vault
  { stack: true, cx: [460, 1300], dy: [-60, -180] },  // 2 houses with receipts above, the tower and its book below
  { stack: true, cx: [700, 1480], dy: [-60, -60] },   // 3 crowbar and sale board above, the frozen tower below
  { stack: true, cx: [560, 1450], dy: [-40, -20] },   // 4 the booth above, the pie below
  { stack: true, cx: [820, 1470], dy: [0, -40] },     // 5 the vault draining above, 2014 and its counter below
  { stack: true, cx: [700, 1420], dy: [-20, -60] },   // 6 the queue above, the window and calendar below
  { stack: true, cx: [520, 1300], dy: [-60, -60] },   // 7 13 years and the snail above, the bank at the flag below
  { stack: true, cx: [700, 1500], dy: [-120, -60] },  // 8 the FTX tower above, the stadium below
  { stack: true, cx: [700, 1450], dy: [80, -80] },    // 9 the customers' vault above, the penthouse below
  { z: 0.8, dx: 140 },                                // 10 gavel and 25 years
  { z: 0.62, dx: 120, dy: 40 },                       // 11 the repaid houses and the grown coin
  { z: 0.9, dy: 40 },                                 // 12 the Canadian tower
  { z: 0.75 },                                        // 13 the falling key and three locked vaults
  { stack: true, cx: [760, 1500], dy: [0, -120] },    // 14 the empty vault above, the unmasked tower below
  { z: 0.7, dy: 60 },                                 // 15 the camera's own pan from Bybit to Binance
  { stack: true, cx: [520, 1500], dy: [-40, -160] },  // 16 the far laptop above, the tower paying back below
];
