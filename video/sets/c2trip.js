// Crypto part 2, scene "trip": one wordless shot per board beat (shot list: episodes/techforbadguys/explain-crypto-02-world/shots.md).
import { camAt, layer, rr, text, FW, FH, makeSet } from "./kit.js";
import { P } from "./c2props.js";
import { V } from "./c2trip.v.js";
const stub = (a) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(text(960, 560, "trip", 120, P.cream), c) }; };
const SHOTS = [stub];
export const c2tripSet = makeSet(SHOTS, V, P);
