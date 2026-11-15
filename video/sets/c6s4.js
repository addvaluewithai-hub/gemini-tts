// Crypto part 6, scene "s4": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./bank.js";
import { V } from "./c6s4.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "6 s4", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c6s4Set = makeSet(SHOTS, V, P);
