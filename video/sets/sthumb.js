// Backdrops for the science part 1 thumbnails (not in the episode): the picture behind the label, headline and Peek.
//   0 the loose plug, big, its gap glowing, with the stopwatch at 60 above it (Arabic layout: objects in the middle)
//   1 the same for the English layout (mirrored placement: objects toward the left middle)
import { camAt, layer, rings, at, makeSet } from "./kit.js";
import { P, paperBg, cablePlug, stopwatch } from "./sci.js";
const shot = (x) => (a, tot) => { const c = camAt(a, [[0, 960, 540, 1]]), y = 880, k = 1.7, gx = x + (-150 - 60 * 0.7) * k * 0.5;
  return { g: paperBg(c, 0) + layer(at(x, y, cablePlug(0.7, 0.3), k) + rings(x - 128 * k * 0.55, y, 90, P.gold, 0.55) + rings(x - 128 * k * 0.55, y, 50, "#fff3b0", 0.8), c) }; };
export const sthumbSet = makeSet([shot(1420), shot(640)], [], P);
