// Electricity part 4 of 4: stub for `battery` (4 shots); a drawing fork replaces it (see the part 4 shots.md).
import { makeSet, FW, FH } from "./kit.js";
import { V } from "./battery.v.js";
import { P } from "./elec.js";
const stub = () => ({ g: `<rect width="${FW}" height="${FH}" fill="#04121e"/>` });
const SHOTS = Array.from({ length: 4 }, () => stub);
export const batterySet = makeSet(SHOTS, V, P);
