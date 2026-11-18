# video3d: Peek in real 3D, made in code

Three.js scenes rendered frame by frame in headless Chromium (WebGL2 on the CPU through SwiftShader, no GPU),
then encoded with ffmpeg. No image or video generation: every character, set, camera move and effect is code,
so Peek is the same in every Short.

| Path | What |
|---|---|
| `lib/peek.js` | Peek, rigged: lids, look, brows, mouth (driven by the voice), antennae, run cycle, arms out, squash |
| `lib/crowe.js` | Agent Crowe: lanky agent, aviators, flashlight with a real spotlight, alien detector |
| `lib/rooftop.js` | night rooftop set: parapet, stairwell door with backlight, water tower, city of lit windows, moon, rain, alley and dumpster 12 m below |
| `lib/post.js` | film look: depth of field, bloom (with a NaN/highlight guard), grade, vignette, aberration, grain, flash, fade |
| `lib/util.js` | seeded random, easing, springs, noise, procedural textures (brick, windows, noise) |
| `shots/s01-coldopen.js` | Short 01 cold open, 10 s: hide, run, leap, slow-motion float, fall, "Gotcha." |
| `shots/lookdev-peek.js` | turntable look-dev of Peek and Crowe |
| `audio/s01_sound.py` | all sound synthesized (rain, drone, beeps, door, steps, whoosh, heartbeat, pad, scratch, whistle, crash, braam) + voice placement + mouth envelope |
| `render.mjs` | renderer: `node render.mjs shots/x.js out/x.mp4 [--scale 0.5] [--stills 1,2]` |
| `mux.sh` | picture + sound + title card on black |

## Making S01's cold open

```bash
npm install
# voices: Vertex Voice Factory jobs peek-en-s01-3d-peek (Puck) and peek-en-s01-3d-crowe (Algenib),
# requests in vertex_ai/jobs/peek-en/s01-3d/; download the wavs to out/v-peek.wav and out/v-crowe.wav
python3 audio/s01_sound.py out/s01-mix.wav --peek out/v-peek.wav --crowe out/v-crowe.wav --env out/s01-env.json
node render.mjs shots/s01-coldopen.js out/s01-coldopen.mp4          # full 1080x1920; --scale 0.5 for a preview
./mux.sh out/s01-coldopen.mp4 out/s01-mix.wav out/s01-final.mp4 "FIELD REPORT #1" "GRAVITY"
```

Speed on a 4-core container: about 2 s per frame at half resolution (10 s = 300 frames, about 10 minutes).

## Lessons

- Lights are in physical units: a spotlight of a few candela at 1–2 m already blows out; use decay 2.
- Clearcoat/sheen on SwiftShader can produce NaN or huge pixels; the bloom then smears them over the whole frame.
  `post.js` sanitizes (NaN → 0, clamp) before the bloom.
- Leaning a character: rotate about the hips, not the feet (`pose({ lean })` does this).
