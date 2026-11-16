// Props for the sets of crypto part 5 (the programmable ledger: smart contracts, staking, tokens, stablecoins, DeFi),
// drawn in the palette and style of parts 1 to 4. Each is drawn around (0, 0); standing props have their base on y = 0.
//   vending     the smart contract: a vending machine with a slot, a glass front, a condition light, a chute, code bars
//   codeBars    the coloured code bars (part 1's code case); one bar can be red (a bug), `run` 0..1 a playhead
//   stakeVault  a glass box of locked coins over a flame grate; `burn` 0..1 drops and burns a stake
//   tokenPress  a little desk stamp that pops out coins; `press` 0..1
//   dollarCoin  the stablecoin: a green $1 coin; `backed` 0..1 shows a real banknote on a thread behind it; `frost` 0..1
//   freezeBtn   the big blue snowflake button on its base; `down` 0..1
//   pool        the lending pool: a round basin of coins with pipes in and out; `level` 0..1, o.crack
//   gasPump     a small pump with a drip
//   bookGears   the brown book with gears and a small screen on its cover; `spin` angle, `grow` 0..1
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart, silo, balance, warehouse, clock, bolt, priceLine, fund, plank } from "./c4props.js";
import { book, rows, LINES } from "./bank.js";
import { banknote, laptop, calPage, padlock } from "./props.js";
export { P, mix, coin, WHO, tower, receipt, key, seedSlip, gavel, heart, silo, balance, warehouse, clock, bolt, priceLine, fund, plank, book, rows, LINES, banknote, laptop, calPage, padlock };

const BAR_C = [P.pink, P.teal, P.gold, P.blue, P.green, P.violet];
// code bars in a column, w wide, n rows; o.bad: index of the red bar; o.run 0..1 lights bars in turn; o.drawn 0..1 grows them
export const codeBars = (n = 6, w = 220, o = {}) => { let g = "";
  for (let r = 0; r < n; r++) { const ind = [0, 1, 2, 2, 1, 0][r % 6] * 22, len = (w - ind) * (0.55 + 0.45 * rnd(r * 7 + (o.seed || 1))) * clamp((o.drawn ?? 1) * n - r), y = r * 34;
    const lit = o.run !== undefined && o.run * n > r && o.run * n < r + 1.4, c = r === o.bad ? P.red : BAR_C[r % 6];
    if (len > 0) g += `${lit ? `<path d="${rr(ind - 8, y - 14, len + 16, 30, 15)}" fill="#fff" opacity=".35"/>` : ""}<path d="${rr(ind, y - 9, len, 18, 9)}" fill="${c}"/>`; }
  return g; };

// the vending machine, 300 wide, 560 high, base on y = 0. o.light: "off" | "wait" | "ok" | "no"; o.item: svg drawn behind
// the glass (centre (-30, -360)); o.drop 0..1: the item falling into the chute; o.locked: the chute flap locked
export const VEND_SLOT = [100, -330];
export const vending = (o = {}) => { const L = { off: "#3a2a7a", wait: P.gold, ok: P.green, no: P.red }[o.light || "off"], drop = o.drop || 0;
  return `${two(rr(-150, -560, 300, 560, 22), o.c || "#3c5bb0", o.cD || "#2c4590", 0, 12)}<path d="${rr(-130, -520, 190, 330, 12)}" fill="#bfe6ff" opacity=".9"/>
    ${o.item && drop < 1 ? at(-35, lerp(-360, -120, ease(drop)), o.item) : ""}<path d="${rr(-130, -520, 190, 330, 12)}" fill="none" stroke="#e8f6ff" stroke-width="6" opacity=".6"/>
    <path d="M-110 -500L-60 -500L-130 -400Z" fill="#fff" opacity=".25"/>${disc(105, -480, 22, L, mix(L, P.ink, 0.3))}${L !== "#3a2a7a" ? rings(105, -480, 30, L, 0.3) : ""}
    <path d="${rr(84, -350, 42, 54, 8)}" fill="${P.ink}"/><path d="${rr(98, -344, 14, 42, 6)}" fill="#cfd5ee"/>
    <path d="${rr(72, -270, 66, 110, 8)}" fill="${P.ink}"/>${[0, 1, 2, 3].map((i) => { const lit = o.run !== undefined && o.run * 4 > i && o.run * 4 < i + 1.4; return `<path d="${rr(82 + (i % 2) * 8, -258 + i * 24, 40 - (i % 2) * 10, 12, 6)}" fill="${i === o.bad ? P.red : [P.pink, P.teal, P.gold, P.green][i]}"/>${lit ? `<path d="${rr(78, -262 + i * 24, 54, 20, 10)}" fill="#fff" opacity=".3"/>` : ""}`; }).join("")}
    <path d="${rr(-120, -150, 230, 90, 12)}" fill="${P.ink}"/>${o.item && drop >= 1 ? at(-10, -105, o.item, 0.85) : ""}
    <path d="M-120 -150h230" stroke="${o.locked ? P.red : P.steel}" stroke-width="12"/>${o.locked ? at(110, -150, padlock(0.5, 0), 1) : ""}`; };

// a can, the vending machine's item
export const can = (c = P.red) => `${two(rr(-28, -48, 56, 96, 10), c, mix(c, P.ink, 0.25), 6, 0)}<path d="${rr(-28, -48, 56, 12, 6)}" fill="${P.steel}"/><path d="M-16 -10h32" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;

// the staking vault: a glass box of locked coins, 360 wide, over a flame grate; o.coins 0..1, o.burn 0..1, o.t for flicker
export const stakeVault = (o = {}) => { const n = Math.round(12 * (o.coins ?? 1)), b = o.burn || 0, t = o.t || 0; let coins = "";
  for (let i = 0; i < n; i++) coins += `<path d="M${-120 + (i % 6) * 48} ${-90 - Math.floor(i / 6) * 40}l18 -20l18 20l-18 20Z" fill="${i % 2 ? P.violet : "#a78bfa"}"/>`;
  const flame = (x, k) => { const h = (90 + 25 * Math.sin(t * 8 + x)) * k; return `<path d="M${x - 30} 0Q${x - 34} ${-h * 0.5} ${x} ${-h}Q${x + 34} ${-h * 0.5} ${x + 30} 0Z" fill="#ff7a3a"/><path d="M${x - 16} 0Q${x - 18} ${-h * 0.3} ${x} ${-h * 0.6}Q${x + 18} ${-h * 0.3} ${x + 16} 0Z" fill="${P.gold}"/>`; };
  return `<path d="${rr(-190, -20, 380, 20, 6)}" fill="${P.steelD}"/>${[-150, -90, -30, 30, 90, 150].map((x) => `<path d="M${x} -20v20" stroke="${P.ink}" stroke-width="6"/>`).join("")}
    <path d="${rr(-170, -230, 340, 200, 16)}" fill="#1b1550"/>${coins}<path d="${rr(-170, -230, 340, 200, 16)}" fill="#cfe9ff" opacity=".12" stroke="#cfe9ff" stroke-width="8"/>${at(150, -230, padlock(0.6, 0), 1)}${b > 0 ? [-110, -40, 30, 100].map((x) => flame(x, 0.4 + b)).join("") : ""}`; };

// the token press: a small desk stamp, 240 wide, base on y = 0; press 0..1 brings the stamp down
export const tokenPress = (press = 0, c = P.pink) => { const y = -200 + 110 * ease(press);
  return `<path d="${rr(-120, -30, 240, 30, 8)}" fill="${P.woodD}"/><path d="${rr(-90, -60, 180, 30, 6)}" fill="${P.wood}"/><rect x="-10" y="-300" width="20" height="${(y + 300).toFixed(1)}" fill="${P.steelD}"/>
    ${two(rr(-60, y - 20, 120, 40, 10), c, mix(c, P.ink, 0.3), 0, 6)}${two(rr(-90, -320, 180, 40, 14), P.violet, P.violetD, 0, 8)}`; };

// the stablecoin: a green coin "$1"; backed 0..1 hangs a real banknote on a thread behind it; frost 0..1 ices it over
export const dollarCoin = (r = 60, o = {}) => { const bk = o.backed || 0, fr = o.frost || 0;
  return `${bk > 0 ? `<path d="M0 0L${(r * 1.6).toFixed(0)} ${(-r * 1.4).toFixed(0)}" stroke="${P.cream}" stroke-width="4" stroke-dasharray="6 6" opacity="${bk.toFixed(2)}"/>${at(r * 1.6, -r * 1.4, banknote(r / 80), 0.2 + 0.8 * spring(bk, 9, 16))}` : ""}
    ${disc(0, 0, r, P.green, P.greenD)}<circle r="${r * 0.78}" fill="none" stroke="${P.greenD}" stroke-width="${r * 0.08}"/>${text(0, r * 0.32, "$1", r * 0.86, "#0d3b26")}
    ${fr > 0 ? `<circle r="${r * 1.04}" fill="#dff4ff" opacity="${(0.75 * fr).toFixed(2)}"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 0L${(Math.cos(i * 1.047) * r * 0.8 * fr).toFixed(1)} ${(Math.sin(i * 1.047) * r * 0.8 * fr).toFixed(1)}" stroke="#7fc8ff" stroke-width="${r * 0.08}" stroke-linecap="round"/>`).join("")}` : ""}`; };

// the freeze button: a big blue dome with a snowflake on a steel base, 220 wide, base on y = 0; down 0..1
export const freezeBtn = (down = 0) => { const y = -90 + 30 * ease(down);
  const flake = [0, 1, 2].map((i) => `<path d="M${(Math.cos(i * 1.047) * -34).toFixed(1)} ${(y - 30 + Math.sin(i * 1.047) * -34).toFixed(1)}L${(Math.cos(i * 1.047) * 34).toFixed(1)} ${(y - 30 + Math.sin(i * 1.047) * 34).toFixed(1)}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`).join("");
  return `${two(rr(-110, -60, 220, 60, 12), P.steel, P.steelD, 0, 8)}${two(`M-80 ${y + 30}A80 70 0 0 1 80 ${y + 30}Z`, "#3fa9ff", "#2a80d2", 0, 8)}${flake}${down > 0.5 ? rings(0, y - 20, 110, "#9fe7ff", 0.3) : ""}`; };

// the lending pool: a round basin, 520 wide, base on y = 0, with an inflow pipe on the left and an outflow on the right
// level 0..1 how full; o.crack 0..1 a crack across its code panel; o.scale: draws a collateral scale on its right rim
export const pool = (level = 0.7, o = {}) => { let coins = ""; const top = -40 - 120 * clamp(level);
  for (let y = -40; y > top; y -= 22) for (let i = 0; i < 9; i++) coins += `<ellipse cx="${-200 + i * 50 + ((y / 22) % 2 ? 0 : 25)}" cy="${y}" rx="24" ry="9" fill="${(i + y) % 3 ? P.gold : P.goldD}"/>`;
  return `<path d="M-300 -150h80v20h-80Z" fill="${P.steel}"/><path d="M220 -60h90v20h-90Z" fill="${P.steel}"/>
    <path d="M-260 -180Q-260 0 0 0Q260 0 260 -180Z" fill="#1b1550"/><clipPath id="poolc${o.id || ""}"><path d="M-250 -175Q-250 -8 0 -8Q250 -8 250 -175Z"/></clipPath><g clip-path="url(#poolc${o.id || ""})">${coins}</g>
    <path d="M-260 -180Q-260 0 0 0Q260 0 260 -180" fill="none" stroke="${P.steel}" stroke-width="14"/><path d="M-280 -180h560" stroke="${P.steelD}" stroke-width="16" stroke-linecap="round"/>
    ${at(-60, -230, `<path d="${rr(-90, -40, 180, 80, 12)}" fill="${P.ink}"/>${at(-70, -24, codeBars(3, 140, { seed: 5 }), 0.9)}${o.crack ? drawn("M-90 -30L-30 0L-50 10L20 20L90 -10", o.crack, P.red, 6) : ""}`)}`; };

// a small gas pump with a fuel coin dripping; drip 0..1
export const gasPump = (drip = 0) => `${two(rr(-60, -200, 120, 200, 14), P.red, P.redD, 0, 8)}<path d="${rr(-40, -180, 80, 50, 8)}" fill="#bfe6ff"/><path d="M60 -150q40 0 40 40v60" fill="none" stroke="${P.ink}" stroke-width="10"/>
  ${drip > 0 && drip < 1 ? at(100, -40 + 80 * drip, coin(14, ""), 1) : ""}`;

// the book with gears and a little screen growing on its cover; grow 0..1, spin angle
export const bookGears = (o = {}) => { const g = o.grow ?? 1, s = o.spin || 0;
  const gear = (cx, cy, r, a) => { let d = ""; for (let i = 0; i < 8; i++) { const t0 = a + i * 0.785, t1 = t0 + 0.35; d += `M${cx} ${cy}L${(cx + Math.cos(t0) * r * 1.25).toFixed(1)} ${(cy + Math.sin(t0) * r * 1.25).toFixed(1)}L${(cx + Math.cos(t1) * r * 1.25).toFixed(1)} ${(cy + Math.sin(t1) * r * 1.25).toFixed(1)}Z`; }
    return `<path d="${d}" fill="${P.gold}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.gold}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="${P.goldD}"/>`; };
  return `${book(rows("70", "80"))}${g > 0 ? at(0, 0, `${gear(-190, -120, 34, s)}${gear(-150, -60, 24, -s * 1.4)}<path d="${rr(150, -150, 90, 64, 10)}" fill="${P.ink}"/><path d="${rr(158, -142, 74, 48, 6)}" fill="#9fe7ff"/>${at(166, -132, codeBars(3, 58, { seed: 9, run: (s / 6) % 1 }), 0.4)}`, spring(g, 9, 16)) : ""}`; };
export { check, cross } from "./kit.js";
