// The sign-off card of a standalone Short (shorts lab, Nov 2026), portrait 1080 x 1920: the town at dusk, EARTH REPORT
// on a sign that drops in, and the bell that rings. No "full report", no file number, no chip.
// Board `labend` (boards.js); spec: { look: "elec" | "day" } (optional). Two seconds or so, under Peek's sign-off line.
import { clamp, spring, rr, two, rings, at, frame, setFrame, layer } from "./kit.js";
import { P as P0, stars, skyline } from "./bank.js";
import { P as PE, E } from "./elec.js";

const pop = (a, k = 9, w = 16) => (a <= 0 ? 0 : 0.2 + 0.8 * spring(a, k, w));
export function labEnd(s, step, age, total) {
  setFrame(1080, 1920);
  const P = PE, Q = { far: E.far, far2: "#0a2a3c", sun: "#ffcf6b", line: "#123a57" };
  try {
    const t = total, c = { x: 540, y: 960, z: 1 + 0.02 * t }, b = t - 0.45;
    const town = `<rect width="1080" height="1920" fill="url(#bnight)"/>` + layer(stars(5, 90, -100, 1200, 900, t), c, 0.2)
      + layer(rings(540, 1640, 300, "#ffd27a", 0.2, 1.45) + `<circle cx="540" cy="1640" r="200" fill="${Q.sun}"/>`, c, 0.3)
      + layer(skyline(41, -300, 1400, 1760, 120, 300, Q.far, P.win) + skyline(47, -300, 1400, 1800, 70, 180, Q.far2, P.win), c, 0.6)
      + `<rect y="1790" width="1080" height="200" fill="${P.ground}"/><rect y="1790" width="1080" height="12" fill="${Q.line}"/>`;
    const title = at(540, 560 - 300 * (1 - pop(t)), `${two(rr(-470, -120, 940, 210, 32), P.ink, "#0d0726", 0, 12)}<text x="0" y="40" text-anchor="middle" font-family="Anton" font-size="150"><tspan fill="#eef0ff">EARTH </tspan><tspan fill="${P.pink}">REPORT</tspan></text>`);
    const swing = b > 0 ? 24 * Math.sin(b * 16) * Math.exp(-b * 1.6) : 0;
    const bell = `<g transform="rotate(${swing} 0 -92)"><path d="M-62 44C-62 -46 -40 -82 0 -82C40 -82 62 -46 62 44L80 62H-80Z" fill="${P.gold}"/><path d="M-62 44C-62 -46 -40 -82 0 -82" fill="none" stroke="#fff3b0" stroke-width="10" opacity=".6"/><circle cy="-92" r="14" fill="${P.gold}"/><circle cy="80" r="20" fill="${P.goldD}"/></g>`;
    const waves = b > 0 ? [1, -1].map((d) => `<path d="M${d * 104} -40Q${d * 128} 0 ${d * 104} 40M${d * 134} -62Q${d * 166} 0 ${d * 134} 62" fill="none" stroke="${P.gold}" stroke-width="9" stroke-linecap="round" opacity="${clamp(1 - (b % 0.6) / 0.6)}"/>`).join("") : "";
    const ring = at(540, 980, rings(0, 0, 230, P.gold, 0.18, 1.3) + bell + waves, 2.1 * pop(b));
    return frame(town + title + ring, P);
  } finally { setFrame(1920, 1080); }
}
