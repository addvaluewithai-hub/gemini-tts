// "Rooftops" in portrait (1080 x 1920): every shot lays itself out for the tall frame (o.vert): the map and flag above the
// town; the crates above a row of houses and, under it, the factory and the farm; the pylon and the pile of roofs side by
// side, taller.
import { s0, s1, s2 } from "./rooftops.js";

export const V = [s0, s1, s2].map((f) => (a, tot, s) => f(a, tot, s, { vert: true }));
