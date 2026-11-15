// Crypto part 5, scene "intro": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-05-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./bank.js";
import { V } from "./c5intro.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "5 intro", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c5introSet = makeSet(SHOTS, V, P);
