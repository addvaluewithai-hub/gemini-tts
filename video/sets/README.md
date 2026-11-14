# Illustrated sets

A set is a full-frame illustrated scene that carries a line of the script with the picture alone. The reference
is `bank.js` (board kind `trail`, the "bank is a ledger" section of crypto part 1); it is the look and the level
the channel owner approved. New sets are built the same way, with `kit.js`.

## What was decided (do not drift from these)

1. One video for every language. Only the audio track changes, so **nothing on screen is in Arabic** and there are
   no captions (`settings.captions: false`). Numbers, dates, symbols (+ − ✓ ✗ $) and names are fine; a short
   English word only where a picture cannot do it (`BANK` on the bank).
2. **The picture says the line.** Test for every shot: someone who cannot hear the voice and reads nothing still
   understands it. A set is designed from the meaning of the sentence; it is never an older text board with the
   text taken off.
3. **No people in the sets**, and the host is not in them either. He stays himself and leans in from the side of
   the frame (`"host": "left"` or `"right"` on the beat). Keep the lower corner on his side clear: about
   x > 1560 or x < 360, y > 480. The chapter chip sits at the bottom left (x < 340, y > 960).
4. The look: illustrated worlds in saturated colour on deep violet and night blue, layers with depth, glow,
   something always moving. Not interface panels with numbers on them.
5. The Arabic voice recordings already made are kept; a set is timed to them.
6. Sound stays restrained: no new effect per action. The owner finds busy sound effects annoying.

## How a set is made

1. **Write the shots first**, one per beat: what is in frame, what happens, and why that says the line. Take the
   beat's words and their times (`cues/<episode>.json` and its `.words.json`) and put each action on the word it
   belongs to. Three or four actions in a five-second beat is plenty.
2. **One subject per shot**, at least a third of the frame height at the moment that matters. One number or one
   mark on screen at a time where possible.
3. **A camera, not a slide.** `camAt(t, keys)` and `layer(inner, cam, depth)`: track, push in, pull back to
   reveal. Far layers get a smaller depth. Use the move that fits the meaning (a pull-back to show where
   something is, a push to say "look at this").
4. **Weight.** Things arrive with `spring` (one overshoot), wind up before they act, settle after. A value that
   changes rolls; it does not jump. Use keyframes (`kf`) and easing, never a pose switched inside an `if`.
5. **Shot to shot through a shape.** Each shot returns `out` (a point and a flat colour to leave through) and the
   next one `in`; `through()` does the hand-over in about 0.65 s. Pick shapes that mean something: a page, a
   window, a doorway, the dark inside an empty wallet. No fades, no plain cuts inside a set.
6. **Continuity.** Carry objects and colours across shots (the blue and pink houses, the 70 and 80 in the book),
   so the section reads as one story.
7. **Flat and solid.** One shade step per shape (`two`, `disc`), glow as two hard rings (`rings`), no blur
   filters. Palette `P` in `bank.js`; gold is the colour of money and of "look here".

Everything is a pure function of `(step, age, total)`; nothing is remembered between frames, and anything random
comes from `rnd(seed)`.

## Looking at it

```
node sets/preview.cjs <storyboard.json> <board id> sheet.jpg 0:0.5,2,3.5,5 1:0.1,0.4,2,4
```

renders stills at the given `step:age` moments into one sheet. Look at every shot this way before rendering
video: is the subject large enough, is anything under the host's corner, does each frame pass the test in point 2.
Then render the section (a copy of the cue file with `from`, `to` and `lead: 0`, through `clip.cjs`), make a
contact sheet with ffmpeg and watch the hand-overs frame by frame.

## The sets of crypto part 1

One file per scene (`money.js`, …), each a board kind in `boards.js`, all drawn in the bank set's world: `bank.js`
exports its palette and props (town, bank, book, houses, coins), `props.js` holds the ones the other scenes share
(calendar page, banknote, press, padlock, laptop, the hooded chair). The shot list is
`episodes/techforbadguys/explain-crypto-01-world/shots.md`.

- Give every beat on a set an explicit `"step"`; the scene's shots are `SHOTS[step]`, run by `play()` in `kit.js`.
- `node sets/beats.cjs <storyboard> <cues> <board> [--write]` prints each beat's words with their times from the
  start of the beat, and `--write` stores `ends` (how long each shot ran) in the board's spec, which `play()` needs to
  hand one shot over to the next. A shot that follows a host beat comes in on a cut from the studio, with no hand-over.
