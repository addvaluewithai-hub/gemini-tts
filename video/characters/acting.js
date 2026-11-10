// The acting vocabulary: what the face can feel and what the arms can do. Pure data, shared by the
// sheets (browser) and the director (node). Face values are targets; the director eases between them.
//   mouth: the closed-mouth shape held while not talking (a key of MOUTHS in peek3d.js, or raw params)
//   talk:  { smile, smirk } nudges to the speech shapes so the feeling survives while he talks
export const EMOTES = {
  neutral: { browL: 0, browR: 0, browTilt: 0, lid: 0.14, mouth: "smirk", talk: { smile: 0, smirk: 0.35 } },
  smug: { browL: -0.3, browR: 0.75, browTilt: -0.15, lid: 0.34, squint: 0.25, mouth: "smug", ant: 6, tilt: 4, talk: { smile: 0.05, smirk: 0.9 } },
  deadpan: { browL: -0.45, browR: -0.45, lid: 0.58, look: 0.85, mouth: "flat", ant: -14, tilt: 3, talk: { smile: -0.1, smirk: 0 } },
  skeptical: { browL: -0.6, browR: 0.95, browTilt: -0.2, lid: 0.4, look: 0.2, mouth: { w: 0.8, smile: 0.04, jaw: 0, smirk: 0.9 }, tilt: 6, talk: { smile: -0.06, smirk: 0.7 } },
  surprised: { browL: 1, browR: 1, lid: 0, eyeScale: 1.2, pupil: 0.7, mouth: "o", ant: 16, symbol: "!", talk: { smile: -0.04, smirk: 0 } },
  grin: { browL: 0.4, browR: 0.4, lid: 0.1, squint: 0.55, mouth: "grin", blush: 0.5, ant: 8, talk: { smile: 0.12, smirk: 0.2 } },
  serious: { browL: -0.6, browR: -0.6, browTilt: -0.8, lid: 0.26, mouth: "frown", ant: -4, talk: { smile: -0.12, smirk: 0 } },
  worried: { browL: 0.5, browR: 0.5, browTilt: 0.9, lid: 0.06, eyeScale: 1.08, mouth: "wobble", sweat: 1, ant: -10, talk: { smile: -0.1, smirk: 0 } },
  eyeroll: { browL: 0.5, browR: 0.5, lid: 0.3, look: 0.3, lookY: -1, mouth: "flat", tilt: -3, talk: { smile: -0.08, smirk: 0 } },
  thinking: { browL: -0.2, browR: 0.7, lid: 0.2, look: -0.7, lookY: -0.7, mouth: "pout", tilt: -5, symbol: "?", talk: { smile: -0.04, smirk: 0.2 } },
  laugh: { browL: 0.6, browR: 0.6, lid: 1, squint: 1, mouth: "laugh", blush: 0.6, ant: 12, talk: { smile: 0.2, smirk: 0 } },
  wink: { browL: 0.5, browR: -0.2, lid: 0.12, lidR: 1, squint: 0.3, mouth: "smug", ant: 6, tilt: 5, talk: { smile: 0.08, smirk: 0.9 } },
  angry: { browL: -0.9, browR: -0.9, browTilt: -1, lid: 0.3, mouth: "grimace", ant: -6, talk: { smile: -0.14, smirk: 0 } },
  bored: { browL: -0.3, browR: -0.3, lid: 0.72, mouth: "flat", ant: -18, tilt: 6, talk: { smile: -0.1, smirk: 0 } },
  sly: { browL: -0.2, browR: -0.2, browTilt: -0.55, lid: 0.46, look: 0.6, mouth: "smug", ant: 4, talk: { smile: 0.04, smirk: 1 } },
  proud: { browL: 0.5, browR: 0.5, lid: 0.5, squint: 0.4, lookY: -0.3, mouth: "grin", ant: 10, tilt: -3, talk: { smile: 0.1, smirk: 0.3 } },
};

// Hand targets in character space (1200 x 1200, shoulders near y 650). null keeps that hand in its pocket.
export const GESTURES = {
  pockets: { armL: null, armR: null },
  present: { armL: null, armR: { x: 908, y: 632 } },            // open hand toward the captions
  presentHigh: { armL: null, armR: { x: 900, y: 520 } },
  point: { armL: null, armR: { x: 872, y: 462 } },              // hand raised beside the head
  count: { armL: { x: 316, y: 516 }, armR: null },              // the other hand up, for lists
  shrug: { armL: { x: 322, y: 664 }, armR: { x: 878, y: 664 }, shrug: 1 },
  hips: { armL: { x: 446, y: 820 }, armR: { x: 754, y: 820 } },
  cheer: { armL: { x: 330, y: 470 }, armR: { x: 870, y: 470 } },
  chin: { armL: null, armR: { x: 676, y: 634, front: true } },  // thinking
  facepalm: { armL: null, armR: { x: 652, y: 420, front: true } },
  stop: { armL: { x: 344, y: 566 }, armR: { x: 856, y: 566 } }, // both palms out
  wave: { armL: null, armR: { x: 884, y: 470 }, wave: true },
  tv: { armL: null, armR: { x: 950, y: 560 } },                 // arm out toward the studio screen
};
