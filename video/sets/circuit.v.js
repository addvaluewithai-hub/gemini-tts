// "Current" in portrait (1080 x 1920), for the Shorts. The cut-open wire (shots 0, 1, 4) and the breaker panel (9) are the
// landscape shots through a moved camera; the circuit (2, 3, 5, 7, 8) is the same circuit laid out tall (GV in circuit.js:
// battery up the left side, bulb on top, switch on the bottom wire); the hose (6) hangs down from its tap with the nozzle
// pointing left, so the lower right stays free for the host; copper and rubber (10) stand one above the other; the jacket
// wire (11) runs down the frame.
import { ease, seg } from "./kit.js";
import { E } from "./elec.js";
import { SHOTS, GV, HV, MV, JV, withGeo, withHose, withSlabs, withJacket } from "./circuit.js";

const tall = (k) => (a, tot, s) => withGeo(GV, () => SHOTS[k](a, tot, s));
export const V = [
  { z: 1.15 },
  { keys: (c, t) => ({ x: c.x - 320 * ease(seg(t, 1.2, 3.4)), y: c.y, z: c.z }) },
  tall(2),
  tall(3),
  { z: 1.0 },
  tall(5),
  (a, tot, s) => withHose(HV, () => SHOTS[6](a, tot, s)),
  tall(7),
  tall(8),
  { z: 0.95, dx: 170, bg: [E.houseB, E.houseB] },
  (a, tot, s) => withSlabs(MV, () => SHOTS[10](a, tot, s)),
  (a, tot, s) => withJacket(JV, () => SHOTS[11](a, tot, s)),
];
