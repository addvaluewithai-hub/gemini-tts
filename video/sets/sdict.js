// Science part 1, "the humans' dictionary": two shots, then the recap: three stops. Host right on both of the dictionary's
// second shot and on every recap stop, so all of it sits left of the lower right corner.
//   dict 0 a "?" card beside a flask, an empty tick box under it (a guess that can be tested, not proven yet)
//   dict 1 the card turns gold; a counter rolls to 1,000 ✓; a thought cloud "?" beside it is crossed out (not a guess)
//   recap 0 (1) the big book closes and turns into the workshop door, sparks inside
//   recap 1 (2) the garage with the dashed dragon, a ✗
//   recap 2 (3) the loose plug; a magnifier finds the gap and the plug clicks home, ✓
import { clamp, lerp, ease, easeOut, easeIn, seg, spring, kf, camAt, layer, toScreen, rr, two, disc, rings, text, number, drawn, at, check, cross, FW, FH, makeSet } from "./kit.js";
import { book } from "./bank.js";
import { P, mix, pop, paperBg, room, card, flask, thought, garage, dragonGhost, cablePlug, magnifier } from "./sci.js";

function d0(a, tot) {
  const c = camAt(a, [[0, 960, 540, 1.0], [5.47, 960, 540, 1.05]]);
  const box = a > 4.5 ? at(800, 860, `<path d="${rr(-50, -50, 100, 100, 12)}" fill="#fffaf0" stroke="${P.ink}" stroke-width="10"/>`, pop(a - 4.5)) : "";
  return { g: paperBg(c, tot) + layer(at(800, 520, card("?"), 1.6 * pop(a - 2.0)) + (a > 2.8 ? at(1180, 700, flask(P.mint, a - 2.8), 1.5 * pop(a - 2.8)) : "") + box, c) };
}
function d1(a, tot) {
  const c = camAt(a, [[0, 800, 540, 1.0], [4.81, 800, 540, 1.04]]), gold = seg(a, 0.6, 1.1), n = Math.round(1000 * ease(seg(a, 1.2, 2.5)));
  const cnt = a > 1.2 ? at(760, 900, `<path d="${rr(-230, -70, 460, 120, 24)}" fill="${P.ink}"/>${text(-30, 24, n.toLocaleString("en"), 90, P.gold)}`, pop(a - 1.2)) + (a > 2.5 ? check(130 + 760 - 0, 860 - 30, 44, P.green, a - 2.5) : "") : "";
  const th = a > 3.3 ? at(260, 340, thought("?"), 0.9) + cross(360, 280, 44, P.red, a - 3.5) : "";
  return { g: paperBg(c, tot) + layer(at(760, 460, card(gold > 0.5 ? "✓" : "?", gold), 1.6) + cnt + th, c), in: [960, 540], inC: P.cream };
}
export const sdictSet = makeSet([d0, d1], [], P);

const marker = (n, on) => `${on > 0 ? rings(0, 0, 80 * on, P.gold, 0.25) : ""}${disc(0, 0, 58, mix("#e3c79a", P.gold, clamp(on)), mix("#c9a57a", P.goldD, clamp(on)))}${text(0, 28, String(n), 80, mix("#8a6a4a", "#8a5200", clamp(on)))}`;
function r0(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [5.41, 820, 540, 1.04]]), shut = seg(a, 2.2, 2.6), toDoor = seg(a, 2.9, 3.5);
  const bk = toDoor < 1 ? at(760, 560, shut < 0.5 ? book() : `<path d="${rr(-162, -100, 324, 206, 12)}" fill="${P.wood}"/>`, [lerp(2.2, 1.2, shut) * (1 - toDoor), 2.2 * (1 - toDoor) + 0.01]) : "";
  const dr = toDoor > 0 ? at(760, 860, `<path d="${rr(-160, -460, 320, 460, 10)}" fill="${P.violet}"/><path d="${rr(-120, -420, 240, 420, 8)}" fill="#ffd27a"/>${[0, 1, 2, 3].map((i) => { const q = (tot * 1.3 + i / 4) % 1; return `<circle cx="${60 * Math.sin(i * 2.1 + tot)}" cy="${-380 + 340 * q}" r="${7 + (i % 3) * 3}" fill="${P.goldD}" opacity="${(1 - q).toFixed(2)}"/>`; }).join("")}`, pop(toDoor)) : "";
  return { g: paperBg(c, tot) + layer(at(300, 200, marker(1, spring(a - 1.0, 8, 13))) + bk + dr, c) };
}
function r1(a, tot) {
  const c = camAt(a, [[0, 820, 560, 1.0], [4.51, 820, 560, 1.04]]);
  return { g: paperBg(c, tot) + layer(`<rect x="-500" y="900" width="3000" height="400" fill="${P.floor}"/>` + at(820, 900, garage(1, at(0, -40, dragonGhost(1, tot)), { c: P.violet, cD: P.violetD, inside: "#3a2f55" }), 1.05) + at(300, 200, marker(2, spring(a - 0.6, 8, 13))) + (a > 3.4 ? cross(1260, 380, 56, P.red, a - 3.4) : ""), c), in: [960, 540], inC: "#ffd27a" };
}
function r2(a, tot) {
  const c = camAt(a, [[0, 820, 540, 1.0], [5.82, 820, 540, 1.04]]), push = ease(seg(a, 4.3, 4.7));
  const mg = a > 3.0 ? at(lerp(400, 830, ease(seg(a, 3.0, 3.6))), 470, magnifier(90, "", "rc2"), 1) : "";
  return { g: paperBg(c, tot) + layer(at(300, 200, marker(3, spring(a - 0.6, 8, 13))) + at(900, 560, cablePlug(0.6 * (1 - push), tot), 0.9) + mg + (a > 4.7 ? check(1200, 360, 56, P.green, a - 4.7) : ""), c), in: [960, 540], inC: P.violet };
}
export const srecapSet = makeSet([r0, r1, r2], [], P);
