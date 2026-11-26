// Shorts lab 02 "apollo" (One number): drawn for the tall frame only. The shots are filled in from the Writer's script.
import { clamp, lerp, ease, easeOut, seg, spring, at, makeSet } from "./kit.js";
import { P, pop, space, moon, earth, rocket, lander, phone, agc, bigNum } from "./labprops.js";

// draft look: the phone against the Moon, one huge number
function s0(a, tot) {
  const g = space(tot, 3) + at(820, 330, moon(170)) + at(170, 1500, earth(70, tot), 1)
    + at(320, 820, phone(1, { screen: at(0, 0, bigNum(4, 1, { size: 160, fill: "#fff" })) }), 0.95 * pop(a)) + at(760, 820, agc(1, tot), 0.8 * pop(a - 0.3))
    + at(540, 1330, bigNum(1000000, seg(a, 0.6, 2.4), { size: 190 }), 1);
  return { g };
}
const SHOTS = [s0];
export const lab02Set = makeSet(SHOTS, SHOTS, P);
