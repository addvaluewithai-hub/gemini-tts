// Shorts lab 06 "bluetooth" (Human dictionary), drawn for the tall frame only (1080 x 1920). Script: Writer, branch
// shorts-writer, episodes/techforbadguys/shorts-lab/06-bluetooth/script.md (5d550ff). Full Arabic captions run word by
// word in a band at y ~ 1060 above Peek's hat (peekFixed), so every picture sits above y ~ 1000.
// The card is the format: the word "Bluetooth" big, the rest of the card drawn, not written (the captions carry the words).
// No reason is drawn for the nickname (the dead-tooth story is not sourced); the blue tooth is only the literal meaning.
//   0 the card, the word big; the crowned king with earbuds beside it     5 the engineer with a Viking book; shields turn into devices
//   1 the definition line: a blue tooth icon                                6 a sticky note on the card that never comes off
//   2 the origin line: the king on a map of Denmark and Norway             7 the runes slide together into the logo
//   3 scattered shields slide together into one                            8 the logo stamps down on a phone's status bar; the king nods
//   4 the card turns to 1997: a phone, a laptop, a headset, no cables
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, rr, two, rings, at, text, makeSet } from "./kit.js";
import { P, pop, dictCard, king, rune, btLogo, tooth, phone } from "./labprops.js";

const bg = (t) => `<rect width="1080" height="1920" fill="#16205a"/><g opacity=".1">${Array.from({ length: 26 }, (_, i) => `<path d="M0 ${i * 80 + 40}H1080" stroke="#fff" stroke-width="2"/>`).join("")}</g><path d="M120 0V1920" stroke="${P.red}" stroke-width="4" opacity=".25"/>`;
const CARD = (p, inner = "", h = 560) => at(540, 70, dictCard("Bluetooth", p, { h, size: 170, inner }));
// a round shield, r 70, in a colour, with a cross
const shield = (c, cD) => `<circle r="72" fill="${cD}"/><circle r="62" fill="${c}"/><path d="M0 -62V62M-62 0H62" stroke="${cD}" stroke-width="14"/><circle r="16" fill="${P.gold}"/>`;
const SH = [[P.red, P.redD], [P.blue, P.blueD], [P.green, P.greenD], [P.violet, P.violetD], [P.gold, P.goldD]];
// earbuds on the king (two small white pods at his ears, head at (0, -250))
const buds = `<path d="M-84 -262q-16 0 -16 16v26" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="-86" cy="-262" r="16" fill="#fff"/><path d="M84 -262q16 0 16 16v26" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="86" cy="-262" r="16" fill="#fff"/>`;
const kingB = (o = {}) => king({ crown: 1, smile: 0, ...o }) + (o.buds ? buds : "");
// a laptop, 360 wide, base on y = 0
const laptop = () => `${two(rr(-150, -230, 300, 200, 14), "#2b2f45", "#16182a", 0, 0)}<path d="${rr(-132, -212, 264, 164, 8)}" fill="#3fa9ff" opacity=".7"/><path d="M-190 -30H190L170 0H-170Z" fill="#c9ccd8"/>`;
// a headset, 260 wide
const headset = () => `<path d="M-100 20V-20Q-100 -130 0 -130Q100 -130 100 -20V20" stroke="#2b2f45" stroke-width="26" fill="none"/>${two(rr(-130, -10, 64, 110, 24), "#2b2f45", "#16182a", 0, 0)}${two(rr(66, -10, 64, 110, 24), "#2b2f45", "#16182a", 0, 0)}`;
// an open book with a Viking helmet on its cover, 240 x 300
const vikingBook = () => `${two(rr(-120, -150, 240, 300, 12), "#7a3a20", "#5a2a14", 0, 0)}<path d="M-100 -150V150" stroke="#5a2a14" stroke-width="10"/><path d="M-60 20Q-60 -60 10 -60Q80 -60 80 20Z" fill="#aab4d4"/><path d="M-66 20H86" stroke="#8792bb" stroke-width="14"/><path d="M10 -60V20" stroke="#8792bb" stroke-width="8"/>`;
// an engineer, 420 tall, feet on y = 0, holding the book
const engineer = (t) => `${two("M-130 0L-110 -190Q0 -230 110 -190L130 0Z", "#4a5a9a", "#384680", 0, 0)}<circle cy="-280" r="82" fill="#e8b48c"/><path d="M-82 -300Q-80 -372 0 -372Q80 -372 82 -300Q60 -340 0 -340Q-60 -340 -82 -300Z" fill="#3a2a1a"/>
  <circle cx="-30" cy="-282" r="9" fill="${P.ink}"/><circle cx="30" cy="-282" r="9" fill="${P.ink}"/><path d="M-30 -240Q0 -222 30 -240" stroke="#7a3a20" stroke-width="6" fill="none"/>
  <path d="M-46 -298a18 14 0 1 0 36 0a18 14 0 1 0 -36 0M10 -298a18 14 0 1 0 36 0a18 14 0 1 0 -36 0" fill="none" stroke="${P.ink}" stroke-width="5"/><rect x="-90" y="-150" width="40" height="22" fill="#fff"/>${at(60, -150, vikingBook(), 0.7, -8 + 3 * Math.sin(t * 2))}`;
// a simple map of Denmark (peninsula and islands) and Norway (the long coast above), 600 x 600, centred
const map = (hl = 1) => `<rect x="-300" y="-300" width="600" height="600" rx="30" fill="#2f6fb0"/><path d="M-260 -300L-150 -300L-60 -230L40 -260L110 -300H300V-150L200 -100L120 -130L10 -60L-120 -120L-220 -60L-280 -130Z" fill="${hl ? "#d9c98a" : "#c7bb88"}"/>
  <path d="M-70 40L-30 -10L10 30L0 120L30 200L-20 250L-80 200L-100 110Z" fill="#e0b860"/><path d="M60 120Q110 90 140 130Q120 180 70 170Z" fill="#e0b860"/><path d="M170 150Q210 130 230 160Q210 200 180 190Z" fill="#e0b860"/>`;
// the Bluetooth status-bar icon on a phone, as a seal stamped down
const seal = (k) => `<circle r="120" fill="#b01e2e"/><circle r="100" fill="none" stroke="#e05060" stroke-width="8"/>${btLogo(1, { oval: false })}`;

// ---- 0: the card with the word; the crowned king with earbuds beside it ----
function s0(a, tot) {
  const g = bg(tot) + CARD(0.55 + 0.45 * seg(a, 0, 0.5)) + at(300, 1000, kingB({ buds: 1 }), 1.5 * (0.6 + 0.4 * pop(a))) + at(800, 840, rings(0, 0, 90, P.blue, 0.15) + `<path d="M-60 -40Q0 -100 60 -40M-40 -10Q0 -50 40 -10" stroke="${P.blue}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(0.5 + 0.5 * Math.sin(tot * 5)).toFixed(2)}"/>`, pop(a - 0.6));
  return { g };
}
// ---- 1: the definition line: a blue tooth icon under the word ----
function s1(a, tot) {
  const inner = at(-170, 420, `<text x="0" y="0" text-anchor="middle" font-family="Anton" font-size="90" fill="${P.blue}">=</text>`, pop(a - 0.2)) + at(60, 400, tooth(1), 1.2 * pop(a - 0.5));
  const g = bg(tot) + CARD(1, inner) + at(300, 1000, kingB({ buds: 1 }), 1.5);
  return { g };
}
// ---- 2: the origin line: King Harald on a map of Denmark and Norway ----
function s2(a, tot) {
  const g = bg(tot) + CARD(1, "", 260) + at(540, 670, map(1), 0.98 * pop(a)) + at(470, 960, kingB(), 1.0 * pop(a - 0.4));
  return { g };
}
// ---- 3: scattered tribe shields slide together into one ----
function s3(a, tot) {
  const p = ease(seg(a, 0.5, 2.6)), pos = [[190, 500], [880, 450], [260, 860], [820, 880], [540, 420]];
  let sh = ""; pos.forEach(([x, y], i) => { sh += at(lerp(x, 540 + (i - 2) * 26, p), lerp(y, 650, p), shield(...SH[i]), 1 - 0.1 * p); });
  const one = p > 0.95 ? at(540, 650, rings(0, 0, 150, P.gold, 0.2) + shield(P.gold, P.goldD), 1.6 * pop(a - 2.5)) : "";
  const g = bg(tot) + CARD(1, "", 260) + at(540, 650, map(0), 0.9, 0, 'opacity=".25"') + sh + one;
  return { g };
}
// ---- 4: the card turns to 1997: a phone, a laptop, a headset, no cables ----
function s4(a, tot) {
  const flip = seg(a, 0, 0.6), k = Math.abs(Math.cos(Math.PI * flip));
  const card = flip < 0.5 ? CARD(1, "", 260) : at(540, 70, `${two(rr(-450, 0, 900, 260, 34), "#fff8e8", "#ead9b6", 0, 14)}<text x="0" y="200" text-anchor="middle" font-family="Anton" font-size="190" fill="${P.ink}">1997</text>`);
  const devs = at(200, 700, phone(1), 0.95 * pop(a - 0.9)) + at(560, 860, laptop(), 1.6 * pop(a - 1.2)) + at(890, 640, headset(), 1.4 * pop(a - 1.5));
  const nocable = a > 2.2 ? [[350, 680, 440, 700], [720, 700, 790, 660]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-width="8" stroke-dasharray="14 16" opacity=".55"/>`).join("") : "";
  const g = bg(tot) + `<g transform="translate(540 0) scale(${k.toFixed(3)} 1) translate(-540 0)">${card}</g>` + nocable + devs;
  return { g };
}
// ---- 5: the engineer with a Viking book; the shields turn into devices that join ----
function s5(a, tot) {
  const turn = seg(a, 1.6, 2.4), join = ease(seg(a, 2.6, 4.2)), ic = [phone(1), laptop(), headset()];
  let d = ""; [[640, 300], [930, 500], [660, 720]].forEach(([x, y], i) => { const X = lerp(x, 800, join * 0.55), Y = lerp(y, 520, join * 0.55);
    d += turn < 1 ? at(X, Y, shield(...SH[i]), 0.9 * (1 - turn) + 0.0001) : ""; d += turn > 0 ? at(X, Y, ic[i], [0.5, 0.8, 0.8][i] * turn) : ""; });
  const link = join > 0.4 ? rings(800, 520, 150, P.blue, 0.2 * join) + at(800, 520, btLogo(1), 0.45 * pop(a - 3.6)) : "";
  const g = bg(tot) + at(270, 1000, engineer(tot), 1.55 * (0.5 + 0.5 * pop(a))) + d + link;
  return { g };
}
// ---- 6: a sticky note on the card that never comes off ----
function s6(a, tot) {
  const st = pop(a - 0.3), peel = a > 1.4 ? 12 * Math.sin((a - 1.4) * 9) * Math.exp(-(a - 1.4) * 0.6) : 0;
  const note = at(760, 500, `<path d="M-120 -120H120V90L90 120H-120Z" fill="#ffe66d"/><path d="M90 120V90H120Z" fill="#e0c040"/>
    <circle cx="0" cy="-10" r="56" fill="none" stroke="${P.ink}" stroke-width="10"/><path d="M0 -10V-48M0 -10L26 8" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/>`, st, -8 + peel);
  const g = bg(tot) + CARD(1, at(-260, 410, tooth(1), 0.55)) + note + at(300, 1000, kingB({ buds: 1 }), 1.5);
  return { g };
}
// ---- 7: the two runes slide together and become the Bluetooth logo ----
function s7(a, tot) {
  const draw1 = seg(a, 0.3, 1.2), draw2 = seg(a, 1.4, 2.3), join = seg(a, 2.8, 3.8);
  const runes = join <= 0 ? at(380, 660, rune("hagall", draw1, P.ink, 22), 2.0) + at(720, 660, rune("bjarkan", draw2, P.ink, 22), 2.0) : at(540, 660, btLogo(join), 1.55);
  const g = bg(tot) + CARD(1, "", 300) + at(540, 660, `<circle r="330" fill="#fff8e8"/>`, 1) + runes + (join >= 1 ? rings(540, 660, 330, P.blue, 0.15) : "");
  return { g };
}
// ---- 8: the logo stamps down on a phone's status bar like a royal seal; the king nods ----
function s8(a, tot) {
  const drop = easeIn(seg(a, 0.3, 0.8)), bump = a > 0.8 ? 1 + 0.12 * Math.exp(-(a - 0.8) * 8) : 1, nod = a > 1.2 ? 6 * Math.sin((a - 1.2) * 7) * Math.exp(-(a - 1.2)) : 0;
  const bar = `<rect x="-130" y="-270" width="260" height="60" fill="#0b0d1a"/><text x="-110" y="-228" font-family="Anton" font-size="30" fill="#fff">9:41</text>`;
  const play = at(0, 40, headset(), 0.6) + `<path d="M-70 170H70" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".5"/><path d="M-70 170H${(-70 + 140 * ((tot * 0.15) % 1)).toFixed(0)}" stroke="${P.blue}" stroke-width="10" stroke-linecap="round"/>`;
  const g = bg(tot) + at(660, 560, phone(1, { screen: bar + play }), 1.4) + at(lerp(660, 760, drop), lerp(60, 240, drop), seal(1), 0.85 * bump * (0.5 + 0.5 * drop) * pop(a - 0.1))
    + at(240, 1000, kingB({ buds: 1 }), 1.3, nod);
  return { g };
}
const SHOTS = [s0, s1, s2, s3, s4, s5, s6, s7, s8];
export const lab06Set = makeSet(SHOTS, SHOTS, P);
