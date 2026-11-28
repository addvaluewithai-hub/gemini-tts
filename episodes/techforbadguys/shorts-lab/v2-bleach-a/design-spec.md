# Design spec: bleach Short, studio A, version 2

Follows the video-skill visual phase (style guide, visual principles, SVG components), with its values changed for
a 1080 x 1920 Short. The tokens below are the ones in `video/shorts-v2a/palette.js`.

## Look

Flat geometric shapes, rounded everywhere, no outlines, soft gradients for depth, two or three depth layers per
set, one accent per scene. Peek is the channel's existing soft, volumetric rig and is used as it is; the world
around him is flat with gentle gradients so he sits in it as the one "real" visitor among drawn humans.

## Palette

| Role | Colour | Used for |
|---|---|---|
| Night | `#1B1440` `#2A1F5C` `#4B36A8` | hallway, stage, end card, shadows (never black) |
| Bathroom | `#0B4F5C` `#12808A` `#19A7A5` `#6FD9CB` | tiles, door, floor |
| **Danger** | `#C4E538` `#EAF86F` `#7FA312` | the gas, and nothing else |
| Peek | `#FF4FA3` | Peek, the lamp, the slippers, REPORT |
| Warm | `#FFB627` `#FF7A3D` | her galabeya, the sun, halo, warnings |
| Stop | `#FF3B4E` | alarm, crosses, symptom badges, the rule's underline |
| Clean | `#F7F5EE` `#3EC1F3` `#6FD3FF` | porcelain, water, fresh air |
| Her | skin `#D9925F`, scarf `#7A3FF2`, gloves `#FFE14D` | the mother, the same in every scene |

Rule: yellow-green means gas. It appears on frame one and nothing else in the film may use it.

## Type

- The rule: Cairo Black, 112 px, cream on a dark ink outline, two short rows, centred, y 330–470. Words appear as
  they are spoken. This is the only Arabic text on screen.
- Digits and Latin: Anton (badges 78 px, EARTH 270 px, REPORT 232 px, Cl on the label).

## Layout (1080 x 1920)

- Safe area for anything that matters: x 60–960, y 200–1560 (top bar, right-hand buttons and bottom caption of the
  Shorts player).
- Scene scale: a character's head is never less than about a fifth of the frame width; full-screen Peek moments put
  his face between 45% and 75% of the width.
- One focus per shot. When a diagram is needed (scenes 4 and 7a) the stage goes dark and one spotlight holds it.

## Motion

- Everything is a pure function of time (`kit.js`): `tw` (a to b with easing), `kf` (keyframes), `pop` (0 to 1 with
  overshoot), `wob` (a decaying wobble for settles and follow-through), `poseAt` (blended pose tracks).
- Entrances overshoot (`outBack`), drops bounce, impacts squash and stretch, big moves are prepared by a small
  move the other way (the crouch before the brush goes up, the pull before the glove snaps).
- Arms (third pass, after the owner's note that the hands moved badly): each arm is one curved stroke from shoulder
  to wrist ("rubber hose"), with no hinge at the elbow; hands travel between poses in shoulder angle and reach, so
  they swing in arcs instead of sliding on straight lines; the elbow side changes continuously, never with a snap;
  each move overshoots slightly and settles; the wrist drags behind the move; the right hand runs a frame behind the
  left; the shoulder lifts with a raised hand; the hand is a mitt with a thumb, or a fist when it holds something.
- Follow-through: scarf tails, Peek's antennae, the cap's tassel, the laundry.
- Always alive: blinks, breathing, the gas blobs, motes, the heater light, lamp and charm, clouds, laundry.
- No linear slides and no hard pops. The one hard cut is on Peek's gasp, on purpose.
- Scene changes go through a shape or a movement: iris from the door glass, thought bubble, bubble pop, gas flood,
  iris, water sheet, whip pan, sun glare, iris, hat circle.

## Sound

Synthesised in `sound.py` (no samples, nothing licensed): effects on the same word cues as the picture, and a light
plucked-bass-and-marimba bed that changes with the scenes (sneaky, march, tension, plain for the rule, bright for
the balcony and the payoff, sneaky again for the callback) and drops out for the alarm. Mixed to about -15 LUFS. Effects were lowered by about 8 dB in the third pass at the owner's request and now sit well under the voice.

## Voice

Puck, through Gemini TTS. Thirteen turns, one per beat, each with Peek's base description plus its own direction
and inline tags; four full takes with two different directions (`voice/build-requests.mjs`), measured line by line
(`video/shorts-v2a/voice_measure.py`: pace, pitch median and range, loudness), and the cut keeps the take with more
contrast for each line (`voice/edit.json`). All takes in the film were recorded on the Vertex voice factory. The cut voice: line pitch medians from 99 Hz (the dry aside,
line 2) to 261 Hz (the alarm, line 8), 16.8 semitones apart; pace from 1.7 to 4.9 words a second.
