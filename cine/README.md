# cine: 2.5D cinematic Shorts with the drawn Peek

The approved Peek (`video/characters/peek3d.js`, face `pear`, from branch `science-world`) with film acting and a
multiplane camera on top. Pure SVG, drawn per frame as a function of time, captured in headless Chromium and encoded
with ffmpeg. About 0.9 s per 1080x1920 frame on a 4-core container; no GPU, no image or video generation.

| Path | What |
|---|---|
| `lib/peek.js` | the rig, extended: `turn` / `nod` (2.5D head turn), `legL` / `legR` (steps, run, tucked legs), `hatRot` / `hatLift`, `shadow`, `filter` (lighting), `id` |
| `lib/acting.js` | the emotes and gestures (unchanged) |
| `lib/fx.js` | camera with parallax, roll and shake; depth-of-field blur per layer; `litFilter` (night tint + rim lights on a figure); cast-shadow filter; light beams and glows; rain, fog, speed lines, impact burst; tint, vignette, grain, flash, bars |
| `sets/night.js` | the night world in layers: sky and moon, three city depths, the rooftop (parapet, stairwell hut, AC unit, floor), across the alley, foreground masts; Agent Crowe as a silhouette; the alley and dumpster |
| `shots/s01-coldopen.js` | Short 01 cold open, 10.6 s + title: peek, spotted, jump, run, leap in slow motion against the moon, "Uh-oh", the fall, "Gotcha." |
| `shots/rigtest.js` | test sheet: turns, poses, lighting |
| `audio/s01_sound.py` | all effects synthesized; places the voice takes; writes the mouth envelope (`out/s01-env.json`) |
| `audio/voice/*.json` | the seven voice requests (one line each, with acting direction) for the Vertex Voice Factory, and the takes |
| `render.cjs` | `node render.cjs shots/x.js out/x.mp4 [--audio mix.wav] [--still 1,2.5]` |

```bash
npm install
python3 audio/s01_sound.py out/s01-mix.wav --voices audio/voice --env out/s01-env.json   # needs numpy, scipy, ffmpeg
node render.cjs shots/s01-coldopen.js out/s01.mp4 --audio out/s01-mix.wav
```

History (2026-11-18): the owner rejected a three.js 3D attempt (`../video3d/`) and a Blender rebuild (`../film/`);
the direction is the original drawn Peek in 2.5D.
