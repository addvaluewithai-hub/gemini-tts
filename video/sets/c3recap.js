// Crypto part 3, scene "recap": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-03-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./c3props.js";
import { V } from "./c3recap.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "recap", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c3recapSet = makeSet(SHOTS, V, P);
