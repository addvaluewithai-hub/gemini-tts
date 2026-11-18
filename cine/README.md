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
| `shots/ep01.js` | **Episode 1, Gravity** (54.5 s): the arrival cold open (no hat until the dumpster), the report with pictures on a space board and word-timed captions, the Crowe tag, the end card. Timed by `out/ep01.json` |
| `lib/act.js` | faces, blends, speech, Peek placed in a world, night lighting, rooftop layers, film finish (shared by the shots) |
| `lib/explain.js` | report pictures: board, apple, cup, rock, phone, Earth, Moon, human figures, pull arrows, labels, captions |
| `audio/ep01_sound.py` | Episode 1 soundtrack and cue file: tightens the report take, finds the beat of every sentence in its word times, synthesizes every effect, -14 LUFS |
| `audio/ep01/` | Episode 1 voice requests and takes (report, Commander, Peek's lines, Crowe) |
| `shots/rigtest.js`, `shots/hatless.js` | test sheets: turns, poses, lighting; Peek without the hat |
| `audio/s01_sound.py` | all effects synthesized; places the voice takes; writes the mouth envelope (`out/s01-env.json`) |
| `audio/voice/*.json` | the seven voice requests (one line each, with acting direction) for the Vertex Voice Factory, and the takes |
| `render.cjs` | `node render.cjs shots/x.js out/x.mp4 [--audio mix.wav] [--still 1,2.5]` |

```bash
npm install
# Episode 1
python3 audio/ep01_sound.py out/ep01-mix.wav --voices audio/ep01 --shared audio/voice --cues out/ep01.json
node render.cjs shots/ep01.js out/peek-ep01-gravity.mp4 --audio out/ep01-mix.wav     # about 25 minutes
# the first test (chase cold open)
python3 audio/s01_sound.py out/s01-mix.wav --voices audio/voice --env out/s01-env.json   # needs numpy, scipy, ffmpeg
node render.cjs shots/s01-coldopen.js out/s01.mp4 --audio out/s01-mix.wav
```

History (2026-11-18): the owner rejected a three.js 3D attempt (`../video3d/`) and a Blender rebuild (`../film/`);
the direction is the original drawn Peek in 2.5D.
