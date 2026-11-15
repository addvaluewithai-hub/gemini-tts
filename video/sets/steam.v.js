// "Steam" in portrait (1080 x 1920), for a Short. The chain (shot 1) runs up the tall frame: the boiler low, the pipe up
// to the turbine at the top, the shaft down to the generator, the wire down to the bulb. The nuclear plant, the balance and
// the volcano are laid out for the narrow frame; the lower side corners are kept clear for Peek.
import { chain, nuclear, scale3, geo } from "./steam.js";

const CHAIN_V = { boiler: [260, 1560], pipe: [[260, 1000], [260, 640], [400, 520]], turbine: [540, 520], gen: [540, 960], wire: [[540, 1110], [540, 1200], [700, 1200]], bulb: [700, 1180],
  cam: [[0, 420, 1250, 1.05], [1.6, 520, 700, 1.0], [2.9, 540, 960, 1.0], [4.5, 540, 960, 0.86]] };
const v1 = (a, tot) => chain(a, tot, CHAIN_V);
const v2 = (a, tot) => nuclear(a, tot, { G: 1300, RX: 340, TX: 640, cam: [[0, 520, 900, 0.85], [2.9, 380, 1000, 1.15], [4.4, 480, 900, 0.95], [5.66, 520, 860, 0.88]] });
const v3 = (a, tot) => scale3(a, tot, { X: 540, w: 300, G: 1300, cam: [[0, 540, 1000, 1.25], [1.6, 540, 960, 1.1], [3.68, 540, 960, 1.02]] });
const v4 = (a, tot) => geo(a, tot, { G: 1300, TX: 720, CR: [240, 420, 600], VX: 300, cam: [[0, 480, 900, 0.85], [1.6, 540, 1000, 0.95], [3.46, 600, 1040, 1.0]] });
export const V = [{ z: 0.82, dy: 60 }, v1, v2, v3, v4];
