// "Two words from the humans' dictionary": two shots.
//   0 an old dictionary opens and CRYPTO rises out of it; the camera travels on: a stone tablet with the old word
//     kryptós, covered by a cloth (hidden); a letter goes into a locked box and comes out scrambled, a key turns it back
//     (cryptography); and a cloth whips off a glass case of coins in plain view (the money is not what is hidden)
//   1 PEER-TO-PEER: a coin sets off from the blue house towards the bank, the bank sinks out of the way, the coin goes
//     straight to the pink house; the book above them shuts with a gold clip (that is the whole story)
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rnd, kf, bez, camAt, layer, toScreen, rr, circ, two, disc, rings, text, number, drawn, at, check, play, frame } from "./kit.js";
import { P, mix, house, bank, book, rows, coin, stars } from "./bank.js";
import { padlock } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
const word = (w, size, fill, t, t0, step = 0.06) => { const n = w.length, cw = size * 0.52; return [...w].map((ch, i) => { const u = t - t0 - i * step; return u > 0 ? at((i - (n - 1) / 2) * cw, 0, text(0, size * 0.36, ch, size, fill), [1, pop(u)], 0) : ""; }).join(""); };
const cloth = (drop, wave, c = P.red, cD = P.redD, w = 520, h = 560) => { const y = lerp(-h - 300, 0, drop), sag = 30 * Math.sin(wave);
  return `<g transform="translate(0 ${y.toFixed(1)})">${two(`M${-w / 2} ${-h}Q0 ${-h - 40} ${w / 2} ${-h}L${w / 2 + 20} 0Q${w / 4} ${-30 + sag} 0 0Q${-w / 4} ${30 - sag} ${-w / 2 - 20} 0Z`, c, cD, 18, 0)}${[-1, 0, 1].map((k) => `<path d="M${k * w / 4} ${-h + 20}Q${k * w / 4 + 20} ${-h / 2} ${k * w / 4} -20" stroke="${cD}" stroke-width="10" fill="none"/>`).join("")}</g>`; };
const paper = (inner) => `${two(rr(-90, -116, 180, 232, 10), P.cream, P.creamD, 0, 8)}${inner}`;
const LINESP = `<path d="M-60 -70h120M-60 -30h120M-60 10h90M-60 50h110" stroke="#b9a986" stroke-width="12" stroke-linecap="round"/>`;
const SCRAMBLED = [["#", -40, -50], ["%", 20, -50], ["&", 50, 0], ["@", -30, 10], ["?", 0, 60], ["*", -55, 64]].map(([ch, x, y]) => text(x, y + 20, ch, 58, P.violetD)).join("");

function s0(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.28], [2.85, 960, 510, 1.3], [3.6, 960, 500, 1.3], [4.1, 2500, 550, 1.05], [4.85, 2500, 550, 1.08], [5.3, 4000, 570, 1.15], [6.95, 4000, 570, 1.18], [7.4, 5500, 610, 1.3], [9.09, 5500, 600, 1.36]]), G = 860;
  // A: the dictionary opens and the word rises out of it
  const op = ease(seg(a, 1.85, 2.35)), lands = a < 0.15 ? -1500 : lerp(-500, 0, easeIn(seg(a, 0.15, 0.45))), thud = a > 0.45 ? 1 - 0.08 * Math.exp(-(a - 0.45) * 9) * Math.cos((a - 0.45) * 16) : 1;
  const dictBook = at(960, G - 160 + lands, `${op < 0.5 ? `<g transform="scale(${(1 - 2 * op).toFixed(3)} 1)">${two(rr(-260, -170, 520, 340, 24), P.violet, P.violetD, 0, 14)}<path d="${rr(-200, -110, 400, 220, 16)}" fill="none" stroke="${P.gold}" stroke-width="10"/>${disc(0, 0, 50, P.gold, P.goldD)}${text(0, 22, "A", 64, "#8a5200")}</g>`
    : `<g transform="scale(1 ${(0.6 + 0.4 * (op * 2 - 1)).toFixed(3)})">${book(`<path d="M-120 -40h90M-120 -10h90M-120 20h70M30 -40h90M30 -10h90M30 20h70" stroke="#dccaa0" stroke-width="9" stroke-linecap="round"/>`, { cover: P.violet, coverD: P.violetD })}</g>`}`, [2.1 * thud, 2.1 / thud]);
  const rise = easeOut(seg(a, 2.89, 3.3)), cryptoW = at(960, lerp(G - 160, 300, rise), (rise > 0 ? rings(0, -10, 330, P.gold, 0.12 * rise, 1.2) : "") + word("CRYPTO", 200, P.gold, a, 2.89, 0.05));
  // B: the old word on a stone, and a cloth comes down over it
  const tab = at(2500, G, `${two("M-300 0V-460Q-300 -620 0 -620Q300 -620 300 -460V0Z", "#c9b9a0", "#9e8c74", 16, 0)}<path d="M-120 -560l40 70l-30 50" stroke="#9e8c74" stroke-width="8" fill="none"/>${text(0, -270, "kryptós", 130, "#6b5a44")}<path d="M-200 -200h400" stroke="#9e8c74" stroke-width="8"/>`, pop(a - 3.85, 7, 12))
    + (a > 4.75 ? at(2500, G + 4, cloth(easeOut(seg(a, 4.75, 5.05)), (a - 4.75) * 8 * Math.exp(-(a - 4.75) * 3), P.red, P.redD, 660, 640)) : "");
  // C: a letter into the locked box, out scrambled; a key turns it back
  const BX = 4000, BY = G - 320, lin = ease(seg(a, 5.3, 5.65)), lout = ease(seg(a, 5.75, 6.15)), keyA = a - 6.3, opened = seg(a, 6.55, 6.75), back = seg(a, 6.75, 6.95);
  const letterIn = lin < 1 ? at(lerp(BX - 700, BX - 160, lin), BY, paper(LINESP), [2.0 * (1 - 0.6 * seg(lin, 0.7, 1)), 2.0], -6 * (1 - lin)) : "";
  const outP = lout > 0 ? at(lerp(BX + 160, BX + 600, lout), BY - 20 * Math.sin(Math.PI * lout), paper(back < 0.5 ? `<g transform="scale(1 ${(1 - 2 * back).toFixed(3)})">${SCRAMBLED}</g>` : `<g transform="scale(1 ${(2 * back - 1).toFixed(3)})">${LINESP}</g>`) + (back >= 1 ? check(70, -110, 34, P.green, a - 6.95) : ""), 2.0 * pop(a - 5.75)) : "";
  const key = keyA > 0 ? at(lerp(BX + 420, BX + 88, easeOut(seg(keyA, 0, 0.25))), BY + 96, `<g transform="rotate(${(-90 * ease(seg(a, 6.55, 6.75))).toFixed(1)})">${disc(70, 0, 34, P.gold, P.goldD)}<circle cx="70" cy="0" r="12" fill="${P.ink}"/><path d="M36 -8h-56v16h56ZM-10 8v14M-2 8v10" fill="${P.gold}" stroke="${P.goldD}" stroke-width="4"/></g>`, 1.8 * pop(keyA)) : "";
  const lockBox = at(BX, G, `${two(rr(-200, -420, 400, 420, 26), "#5d678f", "#44507a", 14, 0)}<path d="${rr(-170, -390, 340, 360, 18)}" fill="none" stroke="#44507a" stroke-width="10"/><path d="${rr(-214, -260, 20, 80, 6)}" fill="${P.ink}"/><path d="${rr(194, -260, 20, 80, 6)}" fill="${P.ink}"/>${at(0, -160, padlock(1.5, opened), pop(a - 5.0))}`, 1.4);
  // D: the coins themselves, under a cloth that whips off: in plain view, nothing hidden
  const DX = 5500, off = easeIn(seg(a, 7.35, 7.65)), shine = a > 7.6 ? spring(a - 7.6, 7, 11) : 0;
  let pile = ""; [9, 8, 7, 5, 3].forEach((n, r) => { for (let i = 0; i < n; i++) pile += at(DX + (i - (n - 1) / 2) * 76, G - 80 - r * 58, coin(40)); });
  const caseD = `${shine > 0 ? rings(DX, G - 260, 420 * shine, P.gold, 0.14) + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${DX} ${G - 240}L${(DX + Math.cos(i * 1.05 + tot * 0.3) * 600).toFixed(0)} ${(G - 240 + Math.sin(i * 1.05 + tot * 0.3) * 600).toFixed(0)}" stroke="${P.gold}" stroke-width="12" opacity="${(0.12 * shine).toFixed(2)}"/>`).join("") : ""}
    <path d="${rr(DX - 380, G - 520, 760, 520, 20)}" fill="${P.ink}"/>${pile}<path d="${rr(DX - 380, G - 520, 760, 520, 20)}" fill="#cfe9ff" opacity=".1" stroke="#cfe9ff" stroke-width="10"/>${two(rr(DX - 420, G, 840, 50, 10), "#5d678f", "#44507a", 0, 10)}
    ${off < 1 ? at(DX + 900 * off, G + 2 - 300 * off * off, cloth(1, a * 3, P.red, P.redD, 820, 560), 1, 40 * off) : ""}`;
  const floor = `<rect x="-900" y="${G + 50}" width="7600" height="500" fill="#141a45"/><rect x="-900" y="${G + 50}" width="7600" height="10" fill="#2c366f"/>`;
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(53, 160, -600, 6200, 800, tot), c, 0.3) + layer(floor + dictBook + cryptoW + tab + lockBox + letterIn + outP + key + caseD, c);
  return { g, out: toScreen(c, DX, G - 80 - 4 * 58), outC: P.gold, outZ: 18 };
}

function s1(a, tot) {
  const c = camAt(a, [[0, 960, 560, 1.0], [4.45, 960, 560, 1.02]]), G = 930, HB = [333, G], HP = [1319, G], BX = 826, HK = 1.5, BK = 0.6;
  const sink = easeIn(seg(a, 1.88, 2.35)), A = [HB[0] + 30, G - 60], Z = [HP[0] - 30, G - 60], OVER = [BX, G - 620], straight = ease(seg(a, 2.2, 2.5));
  const pathPt = (p) => { const curved = bez(A, OVER, Z, p), flat = [lerp(A[0], Z[0], p), A[1] - 60 * Math.sin(Math.PI * p)]; return [lerp(curved[0], flat[0], straight), lerp(curved[1], flat[1], straight)]; };
  let road = ""; for (let i = 1; i < 24; i++) { const p = i / 24, b = pathPt(p), u = a - 0.4 - i * 0.02; if (u > 0) road += `<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="${(8 * pop(u)).toFixed(1)}" fill="${P.gold}" opacity=".8"/>`; }
  // the coin: up towards the bank, a wait while the bank goes, then straight across
  const cp = a < 0.66 ? 0 : a < 1.5 ? 0.32 * ease(seg(a, 0.66, 1.5)) : a < 2.4 ? 0.32 : lerp(0.32, 1, ease(seg(a, 2.4, 3.0))), cb = pathPt(cp), arrived = a > 3.0;
  const coinG = arrived ? "" : at(cb[0], cb[1] - 30, coin(48), a < 0.66 ? pop(a - 0.1) : 1);
  const glowP = arrived ? rings(HP[0], G - 220, 260 * spring(a - 3.0, 7, 11), P.win, 0.16, 1.3) : "";
  const bk = `<clipPath id="dground"><rect x="-500" y="-500" width="3000" height="${G + 500}"/></clipPath><g clip-path="url(#dground)">${at(BX, G + 560 * sink, bank({ inside: "#3b1d74", sign: [1, 1, 1, 1] }), BK)}</g>`;
  const houses = at(HB[0], G, house(P.blue, P.blueD, { lit: [1, 1, 1] }), HK) + glowP + at(HP[0], G, house(P.pink, P.pinkD, { lit: [1, arrived ? 1 : 0, 1] }), [HK, HK * (arrived ? 1 + 0.06 * Math.exp(-(a - 3.0) * 7) * Math.cos((a - 3.0) * 14) : 1)]);
  const title = at(826, 90, word("PEER-TO-PEER", 128, P.cream, a, 0.19, 0.035));
  // the book of the whole story, shut with a gold clip
  const bA = a - 2.95, shut = ease(seg(a, 3.5, 3.8)), clip = a - 3.8;
  const theBook = bA > 0 ? at(BX, 320, (shut < 1 ? `<g transform="scale(${(1 - shut * 0.5).toFixed(3)} 1)">${book(rows("70", "80"))}</g>` : two(rr(-84, -104, 168, 210, 14), P.wood, P.woodD, 0, 10) + `<path d="${rr(-70, -90, 140, 182, 10)}" fill="none" stroke="${P.goldD}" stroke-width="6"/>`) + (clip > 0 ? at(0, -100, `<path d="${rr(-24, -20, 48, 60, 8)}" fill="none" stroke="${P.gold}" stroke-width="12"/>`, pop(clip)) + rings(0, 0, 220 * spring(clip, 7, 11), P.gold, 0.14 * (1 - seg(clip, 0.4, 0.65))) : ""), 1.5 * pop(bA)) : "";
  const g = `<rect width="1920" height="1080" fill="url(#bnight)"/>` + layer(stars(61, 60, -200, 2200, 700, tot), c, 0.2) + layer(`<rect x="-500" y="${G}" width="3000" height="400" fill="#141a45"/><rect x="-500" y="${G}" width="3000" height="10" fill="#2c366f"/>` + bk + road + houses + coinG + theBook + title, c);
  return { g, in: toScreen(c, A[0], A[1] - 30), inC: P.gold, inZ: 18 };
}

const SHOTS = [s0, s1];
export const dictSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
