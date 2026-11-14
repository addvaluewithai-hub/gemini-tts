// "idea" scene of crypto part 1: work in progress (see episodes/techforbadguys/explain-crypto-01-world/shots.md).
import { play, frame } from "./kit.js";
import { P } from "./bank.js";
const SHOTS = [() => ({ g: `<rect width="1920" height="1080" fill="${P.night0}"/>` })];
export const ideaSet = (s, step, age, total) => frame(play(SHOTS, s, step, age, total), P);
