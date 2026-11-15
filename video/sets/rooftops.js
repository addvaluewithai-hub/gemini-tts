// Electricity part 4 of 4: stub for `rooftops` (3 shots); a drawing fork replaces it (see the part 4 shots.md).
import { makeSet, FW, FH } from "./kit.js";
import { V } from "./rooftops.v.js";
import { P } from "./elec.js";
const stub = () => ({ g: `<rect width="${FW}" height="${FH}" fill="#04121e"/>` });
const SHOTS = Array.from({ length: 3 }, () => stub);
export const rooftopsSet = makeSet(SHOTS, V, P);
