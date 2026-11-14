// The closing card of a Short, in portrait (1080 x 1920) and in the world of the sets: the town at dusk, the full
// report as a video waiting to be played, and the bell with SUBSCRIBE on the word "subscribe" (step 1).
// Board `shortend` (boards.js) draws this when cfg.vertical; spec: { icons: [two of the names below], sub }.
import { clamp, ease, easeOut, spring, rr, two, disc, rings, text, at, frame, setFrame, layer } from "./kit.js";
import { P, bank, book, coin, stars, skyline, clouds } from "./bank.js";
import { banknote, fish, pizzaBox, hoodChair, calPage } from "./props.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
// what the report is about, drawn as a prop of the sets (the names are the Short's `end.card.icons`)
const PROP = {
  fish: () => at(0, 0, fish(0), 1.6), cash: () => banknote(2.4), bank: () => at(0, 90, bank(), 0.42), book: () => at(0, 0, book(), 0.9),
  file: () => at(0, 0, `${two(rr(-90, -120, 180, 240, 14), P.cream, P.creamD, 0, 8)}${[0, 1, 2, 3].map((i) => `<path d="${rr(-60, -80 + i * 40, 120 - (i % 2) * 30, 14, 7)}" fill="${P.steelD}"/>`).join("")}`),
  dup: () => [1, 0].map((i) => at(i * 34, i * -34, `${two(rr(-90, -120, 180, 240, 14), P.cream, P.creamD, 0, 8)}${[0, 1, 2].map((j) => `<path d="${rr(-60, -70 + j * 44, 110, 14, 7)}" fill="${P.steelD}"/>`).join("")}`, 1, 0, i ? 'opacity=".75"' : "")).join(""),
  chartdown: () => `<path d="M-130 -90L-60 -40L-10 -70L60 20L130 90" fill="none" stroke="${P.red}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="M95 100L150 110L140 55Z" fill="${P.red}"/>`,
  pizza: () => at(0, 30, pizzaBox(0.6), 1.2), coin: () => coin(90),
  ghost: () => at(0, 150, hoodChair({ coat: 1 }), 0.55),
};
export function shortEndV(s, step, age, total) {
  setFrame(1080, 1920);
  try {
    const t = total, b = step >= 1 ? age : -1, swing = b > 0 ? 22 * Math.sin(b * 16) * Math.exp(-b * 2.2) : 0, c = { x: 540, y: 960, z: 1 + 0.02 * t };
    const town = `<rect width="1080" height="1920" fill="url(#bsky)"/>` + layer(stars(5, 90, -100, 1200, 900, t), c, 0.2)
      + layer(rings(540, 1640, 300, "#ffd27a", 0.2, 1.45) + `<circle cx="540" cy="1640" r="200" fill="#ffd98a"/>` + clouds(t, 520, 4, "#ffb199", 0.5), c, 0.3)
      + layer(skyline(41, -300, 1400, 1760, 120, 300, "#4a2690", P.win) + skyline(47, -300, 1400, 1800, 70, 180, "#2c1a66", P.win), c, 0.6)
      + `<rect y="1790" width="1080" height="200" fill="${P.ground}"/><rect y="1790" width="1080" height="12" fill="#3a2a7a"/>`;
    // EARTH REPORT, on a sign that drops in
    const title = at(540, 250 - 260 * (1 - pop(t)), `${two(rr(-450, -100, 900, 170, 28), P.ink, "#0d0726", 0, 10)}<text x="0" y="22" text-anchor="middle" font-family="Anton" font-size="112"><tspan fill="#eef0ff">EARTH </tspan><tspan fill="${P.pink}">REPORT</tspan></text>`);
    // the full report as a video: a screen with the report's two props in it and the play button pulsing
    const ic = (s.icons || []).slice(0, 2), f = pop(t - 0.15), pulse = 1 + 0.06 * Math.sin(t * 5) * clamp(t - 0.6);
    const screen = at(540, 760, `${two(rr(-450, -300, 900, 600, 40), "#2c1f63", P.ink, 0, 14)}<path d="${rr(-414, -264, 828, 528, 22)}" fill="${P.night1}"/>
      <clipPath id="sevid"><path d="${rr(-414, -264, 828, 528, 22)}"/></clipPath><g clip-path="url(#sevid)"><rect x="-414" y="60" width="828" height="210" fill="${P.ground}"/>${skyline(53, -500, 500, 70, 60, 220, "#4a2690", P.win)}
      ${ic.map((name, i) => at(i ? 250 : -250, -40, (PROP[name] || PROP.coin)(), 1.25 * pop(t - 0.5 - i * 0.15))).join("")}</g>
      ${rings(0, 0, 130 * pulse, P.pink, 0.22)}${disc(0, 0, 110 * pulse, P.pink, "#d6407f")}<path d="M-34 -58L64 0L-34 58Z" fill="#fff"/>`, [f, f]);
    const label = at(540, 1200, `${two(rr(-400, -110, 800, 220, 30), P.ink, "#0d0726", 0, 10)}${text(0, 0, "FULL REPORT", 104, P.gold)}${text(0, 76, s.sub || "", 54, "#cfc6ff")}`, pop(t - 0.45));
    // the bell rings and SUBSCRIBE comes up on the word
    const bell = `<g transform="rotate(${swing} 0 -92)"><path d="M-62 44C-62 -46 -40 -82 0 -82C40 -82 62 -46 62 44L80 62H-80Z" fill="${P.gold}"/><path d="M-62 44C-62 -46 -40 -82 0 -82" fill="none" stroke="#fff3b0" stroke-width="10" opacity=".6"/><circle cy="-92" r="14" fill="${P.gold}"/><circle cy="80" r="20" fill="${P.goldD}"/></g>`;
    const waves = b > 0 ? [1, -1].map((d) => `<path d="M${d * 104} -40Q${d * 128} 0 ${d * 104} 40M${d * 134} -62Q${d * 166} 0 ${d * 134} 62" fill="none" stroke="${P.gold}" stroke-width="9" stroke-linecap="round" opacity="${clamp(1 - (b % 0.6) / 0.6)}"/>`).join("") : "";
    const sub = b >= 0 ? at(540, 1470, `${at(-290, 0, bell + waves, 1.05)}${two(rr(-160, -66, 520, 132, 66), "#ff2d3a", "#c41e2a", 0, 10)}${text(100, 30, "SUBSCRIBE", 84, "#fff")}`, pop(b)) : "";
    return frame(town + title + screen + label + sub, P);
  } finally { setFrame(1920, 1080); }
}
