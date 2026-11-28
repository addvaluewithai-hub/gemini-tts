import { mom, momDefs, momDefsUS, FACE } from "./mom.js";
import { G, T } from "./kit.js";
import { C } from "./palette.js";
// Test sheet for the American look: t < 1 draws every face small, t >= 1 one large figure with a raised arm.
export const frame = (t) => { const names = Object.keys(FACE); let s = `<defs>${momDefs}${momDefsUS}</defs><rect width="1080" height="1920" fill="${C.teal1}"/>`;
  if (t >= 1) return s + G(T(540, 1800, 0, 1.4), mom({ look: "us", face: FACE.grin, tt: t, tails: 20, handL: { x: -330, y: -620 }, handR: { x: 150, y: -420 } }));
  names.forEach((n, i) => { const x = 140 + (i % 4) * 265, y = 470 + Math.floor(i / 4) * 470; s += G(T(x, y, 0, 0.42), mom({ look: "us", face: FACE[n], tt: t, tails: (i % 3 - 1) * 25, handL: { x: -150 - i * 6, y: -250 - i * 30 }, handR: { x: 205, y: -300 + (i % 3) * 120 } })) + `<text x="${x}" y="${y + 36}" fill="#fff" font-size="26" text-anchor="middle" font-family="sans-serif">${n}</text>`; });
  return s; };
