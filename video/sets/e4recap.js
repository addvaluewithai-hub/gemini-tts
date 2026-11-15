// Electricity part 4 of 4: stub for `e4recap` (2 shots); a drawing fork replaces it (see the part 4 shots.md).
import { makeSet, FW, FH } from "./kit.js";
import { V } from "./e4recap.v.js";
import { P } from "./elec.js";
const stub = () => ({ g: `<rect width="${FW}" height="${FH}" fill="#04121e"/>` });
const SHOTS = Array.from({ length: 2 }, () => stub);
export const e4recapSet = makeSet(SHOTS, V, P);
