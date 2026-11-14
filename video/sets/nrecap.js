// The recap of network part 1: one shot that travels over three stops the viewer has already seen, each with its number.
//   1 the blue phone's rings go out and stop at the nearest tower (the phone is a radio, to the nearest tower only)
//   2 the ground opens under the tower: the cable, a gold pulse running along it to the core (the rest is cables)
//   3 a map of cells from above; a pin drops on the phone and a ring from its cell's tower reaches it (the network must
//     know where you are, to reach you)
import { clamp, lerp, ease, easeOut, seg, spring, camAt, layer, toScreen, rr, two, disc, rings, text, at, FW, FH, makeSet } from "./kit.js";
import { P, mix, pop, bluePhone, tower, radio, cable, core, hexPath, hexGrid, GROUP, WAVE } from "./net.js";
import { stars } from "./bank.js";

const marker = (n, t0, a) => { const on = a > t0 ? spring(a - t0, 8, 13) : 0; return `${on > 0 ? rings(0, 0, 90 * on, P.gold, 0.25) : ""}${disc(0, 0, 62, mix("#5b3aa6", P.gold, clamp(on)), mix("#472080", P.goldD, clamp(on)))}${text(0, 30, String(n), 84, mix("#8a74c9", "#8a5200", clamp(on)))}`; };
const G = 760;

function s0(a, tot) {
  const c = camAt(a, [[0, 760, 560, 0.95], [1.5, 760, 560, 1.0], [4.4, 780, 560, 1.0], [5.2, 1900, 760, 0.85], [6.5, 1950, 760, 0.88], [7.3, 3900, 540, 0.9], [10.29, 3900, 540, 0.95]]);
  // stop 1: phone and nearest tower
  const PX = 380, TX = 1080, rad = a > 2.2 ? radio(PX + 10, G - 170, tot, TX - PX - 60, { arc: [-40, 40], n: 3, speed: 1.1 }) : "";
  const hit = a > 4.0 ? spring(a - 4.0, 7, 12) : 0;
  const stop1 = at(PX, G, bluePhone(), 1.1 * pop(a - 1.7)) + rad + at(TX, G, tower({ t: tot, lit: clamp(hit) })) + at(PX, 200, marker(1, 1.52, a));
  // stop 2: the ground cut away, the cable and the core
  const open = ease(seg(a, 4.9, 5.4)), cab = `M${TX} ${G}V${G + 260}H2500V${G + 40}`, pulse = seg(a, 5.4, 6.5);
  const under = `<rect x="${TX - 120}" y="${G + 12}" width="${2700 - TX}" height="${420 * open}" fill="#0e0a2c" opacity="${(0.9 * open).toFixed(2)}"/>`;
  const stop2 = under + (open > 0 ? cable(cab, open, pulse) : "") + at(2620, G, core(tot), 0.8) + at(1700, 200 + 0, marker(2, 4.74, a));
  // stop 3: the map of cells, the pin, a ring that reaches the phone
  const R = 150, cells = hexGrid(3300, 120, R, 6, 4); let map = "";
  const MX = 3300 + 3 * R * 1.5, MY = 120 + 2 * R * Math.sqrt(3) + R * Math.sqrt(3) / 2;
  cells.forEach((h) => { const me = Math.abs(h.x - MX) < 5 && Math.abs(h.y - MY) < 5; map += `<path d="${hexPath(h.x, h.y, R - 6)}" fill="${me && a > 8.4 ? mix("#2c2766", GROUP[h.g][0], seg(a, 8.4, 8.8)) : mix("#241d5e", GROUP[h.g][1], 0.25)}" stroke="#3a3290" stroke-width="7"/>` + at(h.x, h.y + 60, tower({ t: tot + h.i }), 0.18); });
  const pinU = a - 8.5, pinY = pinU > 0 ? MY - 70 - 300 * (1 - Math.min(1, pinU / 0.25)) : -999;
  const pin = pinU > 0 ? at(MX + 70, pinY, `${two("M0 0C-50 -60 -50 -110 0 -110C50 -110 50 -60 0 0Z", P.red, P.redD, 0, 8)}<circle cx="0" cy="-74" r="18" fill="#fff"/>`, 1 + 0.15 * Math.exp(-Math.max(0, pinU - 0.25) * 8)) : "";
  const reach = a > 9.3 ? radio(MX, MY - 20, tot, R - 20, { c: "#fff", w: 7, n: 3, speed: 1.2 }) : "";
  const stop3 = map + at(MX + 70, MY + 30, bluePhone(), 0.35) + reach + pin + at(3300 - 260, 200, marker(3, 6.65, a));
  const ground = `<rect x="-2000" y="${G}" width="${3200 + 2000}" height="1200" fill="#141a45"/><rect x="-2000" y="${G}" width="${3200 + 2000}" height="12" fill="#2c366f"/>`;
  const g = `<rect width="${FW}" height="${FH}" fill="url(#bnight)"/>` + layer(stars(77, 240, -2000, 6000, 1200, tot), c, 0.2) + layer(ground + stop2 + stop1 + stop3, c);
  return { g };
}

const SHOTS = [s0];
export const nrecapSet = makeSet(SHOTS, [], P);
