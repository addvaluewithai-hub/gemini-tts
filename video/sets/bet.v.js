// "The bet" in portrait (1080 x 1920): every shot lays itself out for the tall frame (o.vert): the map with the calendar
// and the plate under it; the phone above the battery field and the 100-day bar; the coins, the dial, the battery and the
// station stacked, lower corners clear.
import { s0, s1, s2 } from "./bet.js";

export const V = [s0, s1, s2].map((f) => (a, tot, s) => f(a, tot, s, { vert: true }));
