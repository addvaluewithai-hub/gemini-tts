// "Texas" in portrait (1080 x 1920): every shot laid out for the tall frame by the shot itself (o.vert).
import { s0, s1, s2, s3 } from "./texas.js";

export const V = [s0, s1, s2, s3].map((f) => (a, tot, s) => f(a, tot, s, { vert: true }));
