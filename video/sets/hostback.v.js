// Behind the host in a Short's studio shots: the town of the sets at dusk, full frame, instead of the desk cut out of
// the landscape studio. He stands in it, big and whole, between the scenes he has just shown.
import { rings, layer, frame, setFrame } from "./kit.js";
import { P, stars, skyline, clouds } from "./bank.js";
export function hostBackV(t) {
  setFrame(1080, 1920);
  try {
    const c = { x: 540, y: 960, z: 1 + 0.01 * Math.sin(t * 0.4) };
    return frame(`<rect width="1080" height="1920" fill="url(#bsky)"/>` + layer(stars(9, 90, -100, 1200, 900, t), c, 0.2)
      + layer(rings(540, 900, 470, "#ffd27a", 0.16, 1.4) + `<circle cx="540" cy="900" r="330" fill="#ffd98a" opacity=".9"/>` + clouds(t, 330, 4, "#ffb199", 0.5), c, 0.3)
      + layer(skyline(61, -300, 1400, 1520, 160, 560, "#4a2690", P.win) + skyline(67, -300, 1400, 1600, 90, 320, "#2c1a66", P.win), c, 0.6)
      + `<rect y="1590" width="1080" height="330" fill="${P.ground}"/><rect y="1590" width="1080" height="12" fill="#3a2a7a"/><ellipse cx="540" cy="1640" rx="300" ry="40" fill="#120a30" opacity=".6"/>`, P);
  } finally { setFrame(1920, 1080); }
}
