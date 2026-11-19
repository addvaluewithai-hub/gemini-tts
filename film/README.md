# film: Peek in Blender, made in code

Blender runs as a Python module (`pip install bpy scipy`, Blender 5.3) and renders with Cycles on the CPU, denoised
with OpenImageDenoise. No GPU, no image or video generation: characters are built and acted from code.

| Path | What |
|---|---|
| `lib/kit.py` | scene setup, meshes from numpy, lathes, tubes, materials, lights, camera |
| `lib/peek.py` | Peek: pear head with a real cut mouth, eyes with lids and brows, felt hat, PRESS card, antennae, belted trench coat, hands, shoes; `rig.pose(...)` sets the acting |
| `lookdev.py` | studio look-dev: `python3 lookdev.py out/x.png --view three|face|front|side --expr neutral|smug|shock|sneak` |

Speed on a 4-core container: about 25 s per frame at 540x960 (24 samples), about 60 s at 720x1280 (64 samples).

This replaces the first three.js attempt in `../video3d/`, which the owner rejected (2026-11-18): primitive models,
plastic shading, weak animation.
