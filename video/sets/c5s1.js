// Crypto part 5, scene "s1": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-05-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./bank.js";
import { V } from "./c5s1.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "5 s1", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c5s1Set = makeSet(SHOTS, V, P);
