// Crypto part 4, scene "value": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-04-world/shots.md).
import { camAt, layer, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./c4props.js";
import { V } from "./c4value.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "value", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c4valueSet = makeSet(SHOTS, V, P);
