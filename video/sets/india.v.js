// "2012" in portrait (1080 x 1920): the map through a closer camera; the states stacked 2x2 under the sun; the dark map
// above, the stopped train and the mine lift below it.
import { s0, s1, s2 } from "./india.js";

const BG = ["#041624", "#082a3a"];
const v1 = (a, tot, s) => s1(a, tot, s, { vert: true });
const v2 = (a, tot, s) => s2(a, tot, s, { vert: true });
const v0 = (a, tot, s) => s0(a, tot, s, { vert: true });
export const V = [v0, v1, v2];
