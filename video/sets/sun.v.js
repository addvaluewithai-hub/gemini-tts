// "The sun" in portrait (1080 x 1920): every shot lays itself out for the tall frame (o.vert): the farm under the sun with
// the price chart above it; the day chart narrower and lower; the battery under the noon dip; the turbines over the bar;
// the price scale above the farm, the pylon and the house.
import { s0, s1, s2, s3, s4, s5 } from "./sun.js";

export const V = [s0, s1, s2, s3, s4, s5].map((f) => (a, tot, s) => f(a, tot, s, { vert: true }));
