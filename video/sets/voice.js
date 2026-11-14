// voice: placeholder until the set is drawn (see episodes/techforbadguys/explain-network-01-world/shots.md).
import { makeSet, text, FW, FH } from "./kit.js";
import { P } from "./net.js";
const SHOTS = [(a) => ({ g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + text(FW / 2, FH / 2, "voice", 120, P.gold) })];
export const voiceSet = makeSet(SHOTS, [], P);
