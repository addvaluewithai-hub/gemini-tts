# Studio B: where the work stopped

Stopped on the manager's instruction (2026-11-28): the owner decided one video is enough. Nothing was recorded, rendered or uploaded.

## What exists

- `script.md` here: the finished script v1.
- `video/v2b/`: the start of a deterministic SVG engine (every frame is a pure function of time, captured with Playwright).
  - `lib.js` easing, springs, keyframes, blink, two-bone arms, clouds.
  - `peek.js` drives the channel's existing Peek rig (`video/characters/peek3d.js`, pear face, `acting.js` emotes) with eased blends between emotes. Peek is not redrawn, per the owner.
  - `mama.js` the co-star: an Egyptian mother on cleaning day, posable (eyes, lids, brows, mouth shapes, arms, lean, squash, sick tint, tears).
  - `props.js` bottles (bleach, toilet cleaner, vinegar, glass cleaner; no brands), toilet, gas clouds with faces, icons, ambulance, Earth, saucer, bell, liquid stream and splash.
  - `world.js` sets: bathroom (window, heater, towel, door), haze, Peek's observation post and screen, lab view, balcony over Cairo roofs.
  - `script.json`, `build-cues.cjs`, `cues.js` word-time anchors (estimates only; no voice yet).
  - `sheet.html`, `shot.cjs` pose sheet and still capture.

## Not done

- Scene acting and timeline (`scenes.js`, `index.html`), renderer, sound, voice requests, storyboard.md, design-spec.md.
- Only the character pose sheet was rendered and looked at; props and sets were written but never rendered, so expect drawing errors there.

## Planned storyboard, in one paragraph

Peek at his observation post watches Earth on a screen (hook); the screen pushes in on Mama and opens into the bathroom; her creed as a picture equation; three pours landing on the words; a dive into the bowl for the chemistry (two gas clouds); three acted symptoms; she bolts; Peek ticks "mission succeeded" and the screen finds her on the balcony; balcony advice (fresh air, phone, what was mixed); the rule with one line of Arabic, then Mama doing it right (one bottle, bucket of water, window open); Peek cancels the invasion; end card.
