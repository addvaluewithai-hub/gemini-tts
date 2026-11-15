// "Intro" of electricity part 1 in portrait (1080 x 1920), for the Shorts. Shot 0 (the push into the wire) is the
// landscape shot through a closer camera. Shots 1 and 2 are the landscape town seen through a camera that pans to each thing
// as it lights (street lamps, the phone in the tower block, the factory, the hospital), then back to the queue at the dead
// traffic light, held high so the cars stay above the host's corner. Shot 3, the race, follows the snail as it pulls ahead.
// Shot 4 is redrawn tall: the wall switch above, the wire running down the wall, the bulb below.
import { clamp, kf, ease, seg, spring, layer, rr, drawn, at, FW, FH } from "./kit.js";
import { E, wire, wallSwitch, bulb } from "./elec.js";

const T2 = (s) => (s.ends || [])[1] || 4.59;
// the pan across the town: x of the camera at time t of the shot-1-and-2 timeline
const townX = (t, s) => kf(t, [[0, 700], [1.3, 420], [2.2, 360], [2.7, 960], [3.35, 960], [3.75, 1520], [T2(s) + 0.3, 1520], [T2(s) + 1.5, 760], [T2(s) + 3.47, 700]]);

function v4(a, tot) {
  const flip = seg(a, 0.45, 0.6), on = a > 0.55 ? clamp(0.2 + 0.8 * spring(a - 0.55, 7, 14)) : 0, z = 1 + 0.04 * ease(seg(a, 0, 1.81));
  const c = { x: 540, y: 900, z };
  const wall = `<rect x="-400" y="-600" width="1900" height="3200" fill="#0f4258"/><rect x="-400" y="1500" width="1900" height="900" fill="#0a2e3e"/><rect x="-400" y="1490" width="1900" height="20" fill="#0c3a4e"/>`
    + `<rect x="-400" y="-600" width="1900" height="3200" fill="#ffe7a0" opacity="${(0.12 * on).toFixed(3)}"/>`;
  const d = "M540 330V170H860V880H540V930";
  const run = a > 0.5 ? drawn(d, ease(seg(a, 0.5, 0.6)), "#fff6c0", 10) : "";
  const g = `<rect width="${FW}" height="${FH}" fill="#0f4258"/>` + layer(wall + wire(d, 16) + run + at(540, 520, wallSwitch(flip), 2.0) + at(540, 1420, bulb(on), 1.6), c);
  return { g, in: [540, 300], inC: E.cuD };
}

export const V = [
  { z: 1.25 },
  { keys: (c, t) => ({ x: townX(t, {}), y: 640, z: c.z * 1.5 }) },
  { keys: (c, t) => ({ x: townX(T2({}) + t, {}), y: 700, z: c.z * 1.45 }) },
  { keys: (c, t) => ({ x: kf(t, [[0, 360], [1.2, 390], [4.35, 870]]), y: 600, z: 1.15 }) },
  v4,
];
