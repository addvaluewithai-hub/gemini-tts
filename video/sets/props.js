// Props shared by the sets of crypto part 1, drawn in the bank set's palette and style. Each is drawn around (0, 0),
// standing on y = 0 unless said otherwise. The bank, the book, the houses and the coins themselves come from bank.js.
import { clamp, lerp, ease, seg, spring, rnd, rr, circ, two, disc, rings, text, number, drawn, at } from "./kit.js";
import { P, mix, coin } from "./bank.js";
export { P, mix };

// a calendar page (centre), 240 x 300 at k = 1; `big` is the main line (a day or a year), `small` a line under the red band
export const calPage = (big, small = "", k = 1, size = 150) => at(0, 0, `<path d="${rr(-120, -150, 240, 300, 16)}" fill="${P.creamD}"/><path d="${rr(-120, -150, 240, 292, 16)}" fill="${P.cream}"/>
  <path d="M-120 -134a16 16 0 0 1 16 -16h208a16 16 0 0 1 16 16v54h-240Z" fill="${P.red}"/>${small ? text(0, -96, small, 40, "#fff") : ""}<circle cx="-60" cy="-118" r="9" fill="${P.ink}"/><circle cx="60" cy="-118" r="9" fill="${P.ink}"/>
  ${text(0, 38 + size * 0.36, big, size * (String(big).length > 3 ? 0.62 : 1), P.ink)}`, k);
// a page tearing off a calendar: p 0..1 as it flips up and away
export const calFlip = (big, small, p, size) => p >= 1 ? "" : `<g transform="translate(0 -80) scale(1 ${(1 - ease(p)).toFixed(3)}) translate(0 80)" opacity="${(1 - seg(p, 0.7, 1)).toFixed(2)}">${calPage(big, small, 1, size)}</g>`;
// a banknote, 160 x 84 at k = 1 (centre)
export const banknote = (k = 1, c = "#6fe3a1", cD = "#3fbf7a", mark = "#2b9a5e") => at(0, 0, `${two(rr(-80, -42, 160, 84, 8), c, cD, 6, 5)}<path d="${rr(-68, -31, 136, 62, 5)}" fill="none" stroke="${mark}" stroke-width="4"/><circle r="20" fill="none" stroke="${mark}" stroke-width="6"/>${text(0, 9, "$", 26, mark)}<circle cx="-50" cy="-16" r="6" fill="${mark}"/><circle cx="50" cy="16" r="6" fill="${mark}"/>`, k);
// a padlock (centre of the body), open: 0 shut .. 1 shackle up
export const padlock = (k = 1, open = 0, c = P.gold, cD = P.goldD) => at(0, 0, `<path d="M-30 ${-20 - 40 * open}v-26a30 30 0 0 1 60 0v${26 + (open > 0 ? 0 : 0)}" fill="none" stroke="${P.steel}" stroke-width="14" transform="translate(${open * 12} 0)"/>${two(rr(-46, -24, 92, 76, 14), c, cD, 6, 6)}<circle cy="8" r="10" fill="${P.ink}"/><path d="M-4 10h8v20h-8Z" fill="${P.ink}"/>`, k);
// a printing press, 520 wide, base on y = 0; `stamp` 0..1 is how far the plate is down
export const press = (stamp = 0, o = {}) => { const y = -300 + 120 * stamp;
  return `<path d="${rr(-260, -40, 520, 40, 8)}" fill="${P.steelD}"/><path d="${rr(-230, -470, 50, 440, 8)}" fill="${P.steel}"/><path d="${rr(180, -470, 50, 440, 8)}" fill="${P.steel}"/>${two(rr(-250, -520, 500, 70, 14), P.violet, P.violetD, 0, 10)}
    <rect x="-16" y="-460" width="32" height="${(y + 460).toFixed(1)}" fill="${P.steelD}"/>${two(rr(-170, y - 40, 340, 50, 8), P.red, P.redD, 0, 8)}<path d="${rr(-160, -150, 320, 20, 6)}" fill="${P.ink}"/>
    ${disc(0, -486, 26, P.gold, P.goldD)}${[0, 1, 2].map((i) => `<circle cx="${-150 + i * 30}" cy="-486" r="9" fill="${(o.lamp || 0) > i ? P.gold : "#3a2a7a"}"/>`).join("")}`; };
// a laptop, the screen's inner colour is `glow`; `inner` is drawn on the screen (screen centre is (0, -110), 240 x 150)
export const laptop = (glow = "#9fe7ff", inner = "", lid = 1) => `<path d="M-170 0h340l-30 -22h-280Z" fill="${P.steelD}"/>${lid > 0 ? `<g transform="scale(1 ${lid.toFixed(3)})"><path d="${rr(-140, -200, 280, 180, 14)}" fill="${P.ink}"/><path d="${rr(-124, -186, 248, 152, 8)}" fill="${glow}"/>${inner}</g>` : ""}`;
// the empty chair that stands for Satoshi: a hooded coat over the back of a desk chair, seen from behind and to the side
export const hoodChair = (o = {}) => { const coat = o.coat ?? 1, spin = o.spin || 0, c = o.colour || "#3a2a7a", cD = o.colourD || "#291d5c";
  return `<g transform="scale(${Math.cos(spin).toFixed(3)} 1)"><rect x="-8" y="-150" width="16" height="120" fill="${P.ink}"/><path d="M-80 -16h160" stroke="${P.ink}" stroke-width="14" stroke-linecap="round"/><circle cx="-80" cy="-6" r="10" fill="${P.ink}"/><circle cx="80" cy="-6" r="10" fill="${P.ink}"/>
    ${two(rr(-100, -190, 200, 44, 18), "#4b3d8f", "#36296e", 0, 8)}${two(rr(-90, -420, 180, 240, 40), "#4b3d8f", "#36296e", 12, 0)}
    ${coat > 0 ? `<g transform="translate(0 -190) scale(1 ${coat.toFixed(3)}) translate(0 190)">${two("M-96 -330Q-110 -250 -104 -190H104Q110 -250 96 -330Z", c, cD, 10, 0)}${two("M-70 -330Q-78 -470 0 -478Q78 -470 70 -330Q0 -300 -70 -330Z", c, cD, 10, 0)}<path d="M-46 -350Q0 -440 46 -350Q0 -330 -46 -350Z" fill="${P.ink}"/></g>` : ""}</g>`; };
// a glass jar; `fill` 0..1 is how full of coins it is
export const jar = (fill = 0) => { let coins = ""; const n = Math.round(14 * fill); for (let i = 0; i < n; i++) coins += at(-50 + (i % 4) * 33 + (Math.floor(i / 4) % 2) * 16, -30 - Math.floor(i / 4) * 30, coin(18));
  return `${coins}<path d="M-80 -220h160v30q14 20 14 50v130q0 10 -10 10h-168q-10 0 -10 -10v-130q0 -30 14 -50Z" fill="#cfe9ff" opacity=".28" stroke="#cfe9ff" stroke-width="6"/>${two(rr(-90, -246, 180, 34, 10), P.wood, P.woodD, 0, 6)}<path d="M-56 -170v120" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".35"/>`; };
// a folder, seen from the front; `open` 0..1 is how far the front flap is folded down
export const folder = (open = 0, inner = "") => `${two(rr(-200, -150, 400, 290, 16), "#e8a23c", "#c47f22", 0, 10)}<path d="M-200 -150h130l24 -30h-130Z" fill="#c47f22"/>${inner}
  <g transform="translate(0 140) scale(1 ${(1 - open * 0.92).toFixed(3)}) translate(0 -140)">${two(rr(-210, -120, 420, 260, 16), "#ffc15a", "#e8a23c", 0, 10)}</g>`;
// a price tag with a hole and a coin mark
export const tag = (label) => `${two("M-60 -40h110l40 40l-40 40h-110Z", P.cream, P.creamD, 0, 6)}<circle cx="60" cy="0" r="9" fill="${P.ink}"/>${disc(-28, 0, 22, P.gold, P.goldD)}${text(18, 18, label, 50, P.ink)}`;
// a market stall: counter `w` wide, an awning in two colours; `shutter` 0..1 pulls a shutter down over the opening
export const stall = (c, cD, shutter = 0, w = 380) => { const h = w / 2, stripes = 6;
  return `<rect x="${-h + 10}" y="-330" width="18" height="330" fill="${P.woodD}"/><rect x="${h - 28}" y="-330" width="18" height="330" fill="${P.woodD}"/>
    ${two(rr(-h, -130, w, 130, 8), P.wood, P.woodD, 0, 10)}<path d="${rr(-h - 10, -140, w + 20, 22, 6)}" fill="${P.cream}"/>
    ${shutter > 0 ? `<path d="${rr(-h + 28, -330, w - 56, 190 * shutter, 0)}" fill="${P.steel}"/>${Array.from({ length: Math.floor(10 * shutter) }, (_, i) => `<path d="M${-h + 28} ${-330 + 19 * (i + 1) * 1}h${w - 56}" stroke="${P.steelD}" stroke-width="4"/>`).join("")}<path d="${rr(-h + 20, -336 + 190 * shutter, w - 40, 14, 6)}" fill="${P.steelD}"/>` : ""}
    <path d="M${-h - 30} -330L${-h} -400H${h}L${h + 30} -330Z" fill="${cD}"/>${Array.from({ length: stripes }, (_, i) => { const x0 = -h - 30 + (w + 60) * i / stripes, x1 = x0 + (w + 60) / stripes; return `<path d="M${x0} -330h${x1 - x0}v34a${(x1 - x0) / 2} ${(x1 - x0) / 2 * 0.5} 0 0 1 ${-(x1 - x0)} 0Z" fill="${i % 2 ? P.cream : c}"/>`; }).join("")}`; };
export const fish = (wag = 0) => `<path d="M60 0L100 ${-28 + wag * 10}L100 ${28 + wag * 10}Z" fill="${P.blueD}"/>${two("M-80 0Q-30 -50 40 -26Q70 -14 70 0Q70 14 40 26Q-30 50 -80 0Z", "#7fd0ff", P.blue, 0, 8)}<circle cx="-46" cy="-8" r="9" fill="${P.ink}"/><path d="M0 -20q12 20 0 40" stroke="${P.blue}" stroke-width="6" fill="none"/>`;
export const loaf = (mould = 0) => `${two("M-90 10Q-100 -60 0 -64Q100 -60 90 10Z", mix("#f0a65a", "#7fae5a", mould), mix("#c9773a", "#5a8a3a", mould), 0, 9)}${[-40, 0, 40].map((x) => `<path d="M${x - 14} -40l24 22" stroke="${mix("#ffd29a", "#a8d47a", mould)}" stroke-width="8" stroke-linecap="round"/>`).join("")}
  ${mould > 0.2 ? [[-50, -20], [30, -34], [56, -6], [-10, 0]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${(10 + 4 * i) * clamp((mould - 0.2) * 2)}" fill="#4f8a3a"/>`).join("") : ""}`;
// a gold bar, 220 wide, standing on y = 0
export const goldBar = (k = 1) => at(0, 0, `${two("M-110 0L-80 -80H80L110 0Z", P.gold, P.goldD, 0, 10)}<path d="M-80 -80H80L70 -66H-70Z" fill="#fff0a8"/>`, k);
// a screen on a stand, the inner area is 420 x 260 around (0, -260)
export const monitor = (glow, inner = "") => `<path d="M-30 0h60l-10 -100h-40Z" fill="${P.steelD}"/><path d="${rr(-100, -14, 200, 14, 7)}" fill="${P.steelD}"/>${two(rr(-240, -410, 480, 310, 22), "#2c1f63", P.ink, 0, 10)}<path d="${rr(-212, -386, 424, 252, 10)}" fill="${glow}"/>${inner}`;
// a little car, 260 wide
export const car = (c = P.red, cD = P.redD) => `${two("M-130 -40Q-130 -80 -90 -84L-60 -130H50L90 -84Q130 -80 130 -40V-20H-130Z", c, cD, 0, 10)}<path d="M-50 -120H-4V-86H-76ZM8 -120H44L74 -86H8Z" fill="#bfe6ff"/>${[-70, 70].map((x) => `<circle cx="${x}" cy="-20" r="28" fill="${P.ink}"/><circle cx="${x}" cy="-20" r="11" fill="${P.steel}"/>`).join("")}`;
// a bus, 620 wide, facing right
export const bus = (c = P.gold, cD = P.goldD) => `${two(rr(-310, -260, 620, 230, 30), c, cD, 0, 12)}${[0, 1, 2, 3, 4].map((i) => `<path d="${rr(-280 + i * 110, -230, 90, 80, 10)}" fill="#bfe6ff"/>`).join("")}<path d="${rr(250, -230, 50, 150, 10)}" fill="#bfe6ff"/><path d="M-310 -110h620" stroke="${cD}" stroke-width="12"/>${[-200, 200].map((x) => `<circle cx="${x}" cy="-30" r="44" fill="${P.ink}"/><circle cx="${x}" cy="-30" r="18" fill="${P.steel}"/>`).join("")}<circle cx="296" cy="-70" r="14" fill="#fff3c2"/>`;
// soft round hills along y = base
export const hills = (seed, x0, x1, base, h, fill) => { let d = `M${x0} ${base + 600}V${base}`; for (let x = x0, i = 0; x < x1; i++) { const w = 300 + rnd(seed + i) * 400, hh = h * (0.5 + rnd(seed + i + 50) * 0.5); d += `q${w / 2} ${-hh * 2} ${w} 0`; x += w; } return `<path d="${d}V${base + 600}Z" fill="${fill}"/>`; };
// a pedestal that lights up: `on` 0..1
export const pedestal = (on = 0, c = P.violet, cD = P.violetD) => `${on > 0 ? `<path d="M-170 -60L-90 -700H90L170 -60Z" fill="#ffd98a" opacity="${(0.12 * on).toFixed(3)}"/>` : ""}${two(rr(-150, -60, 300, 60, 10), c, cD, 0, 10)}${two(rr(-120, -100, 240, 46, 10), mix(c, "#ffffff", 0.15), c, 0, 8)}<ellipse cx="0" cy="-100" rx="110" ry="14" fill="${mix(cD, P.gold, on)}"/>`;
export { coin };
