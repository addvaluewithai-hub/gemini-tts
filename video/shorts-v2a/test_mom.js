import { mom, momDefs, FACE } from "./mom.js";
import { G, T } from "./kit.js";
import { C } from "./palette.js";
export const frame = (t) => { const names = Object.keys(FACE); let s = `<defs>${momDefs}</defs><rect width="1080" height="1920" fill="${C.teal1}"/>`;
  names.forEach((n, i) => { const x = 140 + (i % 4) * 265, y = 470 + Math.floor(i / 4) * 470; s += G(T(x, y, 0, 0.42), mom({ face: FACE[n], tt: t, handL: { x: -150 - i * 6, y: -250 - i * 30 }, handR: { x: 205, y: -300 + (i % 3) * 120 } })) + `<text x="${x}" y="${y + 36}" fill="#fff" font-size="26" text-anchor="middle" font-family="sans-serif">${n}</text>`; });
  return s; };
