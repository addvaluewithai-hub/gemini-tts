// "2025" in portrait (1080 x 1920): every shot laid out for the tall frame by the shot itself (o.vert): the map above,
// the calendar, the clock, the gauge and the tags stacked around it.
import { s0, s1, s2 } from "./iberia.js";

export const V = [s0, s1, s2].map((f) => (a, tot, s) => f(a, tot, s, { vert: true }));
