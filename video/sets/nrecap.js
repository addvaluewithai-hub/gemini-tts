// nrecap: placeholder (props test) until the set is drawn.
import { makeSet, at, FW, FH } from "./kit.js";
import { P, bluePhone, pinkPhone, tower, radio, cable, core, sim, satellite, router, earbud, busStop, bars, stopwatch, brick, palmTower, hexPath, waveLine, ringing } from "./net.js";
const SHOTS = [(a) => ({ g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + at(150, 500, bluePhone()) + at(330, 500, ringing(pinkPhone(), a)) + at(560, 600, tower({ t: a, lit: 1 })) + radio(560, 120, a, 260)
  + at(1100, 500, core(a)) + cable("M560 620Q800 760 1100 620", 1, (a % 1)) + at(1600, 300, sim()) + at(1500, 800, satellite(), 0.6) + at(250, 900, router(a), 0.7) + at(480, 900, earbud()) + at(820, 1000, busStop(), 0.5)
  + at(1100, 1000, bars(3)) + at(1350, 900, stopwatch(90, 0.3)) + at(1800, 1000, brick(), 0.8) + at(1700, 600, palmTower({ ears: 1 }), 0.5) + `<path d="${hexPath(1300, 150, 90)}" fill="${P.pink}"/>` + waveLine(0, 1920, 1050, 120, 20, a) })];
export const nrecapSet = makeSet(SHOTS, [], P);
