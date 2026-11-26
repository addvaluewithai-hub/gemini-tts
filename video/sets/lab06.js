// Shorts lab 06 "bluetooth" (Human dictionary): drawn for the tall frame only. The shots are filled in from the Writer's script.
import { clamp, lerp, ease, easeOut, seg, spring, at, text, makeSet } from "./kit.js";
import { P, pop, dictCard, king, rune, btLogo, tooth } from "./labprops.js";

const paper = (t) => `<rect width="1080" height="1920" fill="#1d2a6b"/><g opacity=".12">${Array.from({ length: 26 }, (_, i) => `<path d="M0 ${i * 80}H1080" stroke="#fff" stroke-width="2"/>`).join("")}</g>`;
// draft look: the card with the word, the king, the runes joining
function s0(a, tot) {
  const g = paper(tot) + at(540, 120, dictCard("Bluetooth", seg(a, 0, 0.6), { inner: at(0, 470, btLogo(seg(a, 0.8, 1.8)), 0.7) }))
    + at(300, 1300, king({ smile: 1 }), 1.1 * pop(a - 1)) + at(800, 1150, tooth(1), 1.2 * pop(a - 1.4));
  return { g };
}
const SHOTS = [s0];
export const lab06Set = makeSet(SHOTS, SHOTS, P);
