// Crypto part 6, scene "intro": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-06-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./bank.js";
import { V } from "./c6intro.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "6 intro", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c6introSet = makeSet(SHOTS, V, P);
