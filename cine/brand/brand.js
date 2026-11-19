// Channel art for "Earth Report" (English Shorts channel), drawn with the same rig and night city as the episodes.
//   banner(): 2560 x 1440. Everything that matters sits in the centre 1546 x 423 strip (x 507..2053, y 508..931),
//             which is all a phone shows; a TV shows the whole picture.
//   avatar(): 800 x 800, shown as a circle, often tiny: the face fills it.
import * as fx from "../lib/fx.js";
import * as N from "../sets/night.js";
import * as X from "../lib/explain.js";
import { F, ants, peek, night } from "../lib/act.js";
import { GESTURES } from "../lib/acting.js";

const sized = (w, h, bg, build) => fx.frame(build).replace(/^<svg [^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`).replace(/<rect width="1080" height="1920" fill="#000"\/>/, `<rect width="${w}" height="${h}" fill="${bg}"/>`);
const stars = (n, w, h, seed = 1) => Array.from({ length: n }, (_, i) => `<circle cx="${(fx.rnd(i * 3 + seed) * w).toFixed(0)}" cy="${(fx.rnd(i * 7 + seed) * h).toFixed(0)}" r="${(1 + fx.rnd(i * 11 + seed) * 2.6).toFixed(1)}" fill="#fff" opacity="${(0.25 + fx.rnd(i * 13 + seed) * 0.6).toFixed(2)}"/>`).join("");
const skyDefs = `<defs><linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04061a"/><stop offset=".45" stop-color="#121a52"/><stop offset=".8" stop-color="#3b2a78"/><stop offset="1" stop-color="#7a3f8c"/></linearGradient></defs>`;
const LIT = () => night("Lb", [{ color: "#cfe3ff", az: 200, power: 1.5, size: 10 }, { color: "#cfe3ff", az: 330, power: 1.2, size: 10 }, { color: "#ff7ac0", az: 90, power: 0.45, size: 14 }], [0.9, 0.8, 1.0], 0.03);

export function banner() {
  const W = 2560, H = 1440, mx = 735, my = 735, mr = 265;
  return sized(W, H, "#04061a", () => {
    const e = ants({ ...F("smug"), look: 0.55, lid: 0.3 }, 6, -4);
    const title = (x, y, text, size, fill, sw = 0.1) => `<text x="${x}" y="${y}" font-family="Anton" font-size="${size}" letter-spacing="${size * 0.02}" fill="${fill}" stroke="#04061a" stroke-width="${size * sw}" stroke-linejoin="round" paint-order="stroke">${text}</text>`;
    return skyDefs + `<rect width="${W}" height="${H}" fill="url(#bsky)"/>` + stars(260, W, 1000, 5)
      + X.moon(mx, my, mr)
      + `<g transform="translate(-300 150)">${N.cityFar()}</g><g transform="translate(-200 330)" opacity=".96">${N.cityMid()}</g><g transform="translate(-350 240)">${N.cityNear()}</g>`
      + `<rect x="300" y="1212" width="930" height="320" fill="#070a24"/><rect x="300" y="1212" width="930" height="10" fill="#2a3378"/><rect x="270" y="1180" width="990" height="40" rx="6" fill="#0b0f2e"/><rect x="270" y="1180" width="990" height="7" fill="#39439a"/>`
      + peek(e, { filter: LIT(), shadow: false, ...GESTURES.present, tilt: 3 }, 735, 1184, 0.70)
      + title(1052, 622, "AGENT PEEK'S FIELD REPORTS", 58, "#9fd0ff")
      + title(1046, 806, "EARTH REPORT", 180, "#ffffff", 0.07)
      + title(1052, 892, "AN ALIEN SPY EXPLAINS YOUR PLANET", 60, "#ffe66d")
      + fx.glow(mx, my, 620, "#9fb8ff", 0.16);
  });
}

export function avatar() {
  const S = 800;
  return sized(S, S, "#0b1040", () => {
    const e = ants({ ...F("smug"), look: 0, lid: 0.26 }, 4, 4);
    return `<defs><radialGradient id="abg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#2a3aa8"/><stop offset=".6" stop-color="#141a58"/><stop offset="1" stop-color="#070a24"/></radialGradient></defs><rect width="${S}" height="${S}" fill="url(#abg)"/>` + stars(40, S, S, 9)
      + X.moon(400, 410, 315)
      + peek(e, { filter: LIT(), shadow: false }, 400, 1010, 0.88);
  });
}
