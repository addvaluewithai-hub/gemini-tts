// ndict: placeholder until the set is drawn (see episodes/techforbadguys/explain-network-01-world/shots.md).
import { makeSet, text, FW, FH } from "./kit.js";
import { P } from "./net.js";
const SHOTS = [(a) => ({ g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + text(FW / 2, FH / 2, "ndict", 120, P.gold) })];
export const ndictSet = makeSet(SHOTS, [], P);
