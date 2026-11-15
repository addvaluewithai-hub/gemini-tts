// Electricity part 4 of 4: stub for `e4intro` (2 shots); a drawing fork replaces it (see the part 4 shots.md).
import { makeSet, FW, FH } from "./kit.js";
import { V } from "./e4intro.v.js";
import { P } from "./elec.js";
const stub = () => ({ g: `<rect width="${FW}" height="${FH}" fill="#04121e"/>` });
const SHOTS = Array.from({ length: 2 }, () => stub);
export const e4introSet = makeSet(SHOTS, V, P);
