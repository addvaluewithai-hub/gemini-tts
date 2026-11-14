// Stub for the "amber" set of electricity part 1: replaced by the drawn set (see episodes/techforbadguys/explain-electricity-01-world/shots.md).
import { camAt, layer, text, makeSet } from "./kit.js";
import { P, stars } from "./elec.js";
const stub = (k) => (a, tot) => { const c = camAt(a, [[0, 960, 540, 1]]); return { g: `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(3, 60, 0, 1920, 1080, tot), c, 0.2) + text(960, 560, "amber " + k, 120, P.gold) }; };
export const amberSet = makeSet(Array.from({ length: 20 }, (_, k) => stub(k)), [], P);
