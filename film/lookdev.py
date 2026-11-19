"""Look-dev: Peek on a studio sweep under three-point light.

  python3 lookdev.py out.png [--samples 48] [--size 720x1280] [--view front|three|side|face] [--expr name]
"""
import argparse
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy  # noqa: E402
from lib import kit  # noqa: E402
from lib.peek import build_peek  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("out")
ap.add_argument("--samples", type=int, default=48)
ap.add_argument("--size", default="720x1280")
ap.add_argument("--view", default="three")
ap.add_argument("--expr", default="neutral")
a = ap.parse_args()
w, h = [int(v) for v in a.size.split("x")]
s = kit.reset(samples=a.samples, width=w, height=h)

# studio: floor that curves up into a wall, deep violet
nt = s.world.node_tree
nt.nodes["Background"].inputs[0].default_value = kit.srgb("#141a3d")
nt.nodes["Background"].inputs[1].default_value = 0.25
floor = kit.material("floor", Base_Color=kit.srgb("#272c66"), Roughness=0.55)
prof = [(0.001, 0.0), (3.0, 0.0), (5.0, 0.0), (5.8, 0.25), (6.3, 1.0), (6.4, 6.0)]
kit.lathe("cyc", prof, segs=96, mat=floor)

peek = build_peek()
EXPR = {
    "neutral": dict(),
    "smug": dict(lid=0.5, smile=0.9, gaze=(0.5, 0.0), head=(0, 0.25, 0.06), brow=0.2),
    "shock": dict(lid=0.0, low=0.0, mouth_open=1.0, narrow=0.35, smile=-0.2, brow=1.0, brow_tilt=-0.4, antenna=(0, -0.15),
                  hand_l=(-0.33, -0.12, 0.5), hand_r=(0.33, -0.12, 0.5)),
    "sneak": dict(lid=0.3, gaze=(-0.9, 0.1), smile=-0.1, head=(0.05, -0.2, 0), brow_tilt=0.3),
}
peek.pose(**EXPR[a.expr])

VIEWS = {
    "front": dict(loc=(0, -3.9, 0.8), target=(0, 0, 0.7), lens=70),
    "three": dict(loc=(1.6, -3.5, 0.95), target=(0, 0, 0.7), lens=70),
    "side": dict(loc=(5.2, -0.3, 0.8), target=(0, 0, 0.66), lens=70),
    "face": dict(loc=(0.35, -1.9, 0.9), target=(0, 0, 0.84), lens=85),
}
v = VIEWS[a.view]
kit.camera(lens=v["lens"], loc=v["loc"], target=v["target"], fstop=4.0)
head = (0, 0, 0.8)
kit.area_light("key", (-2.2, -2.6, 2.6), head, 380, 1.6, color=(1.0, 0.93, 0.85))
kit.area_light("rim", (2.0, 2.4, 2.2), head, 700, 0.8, color=(0.5, 0.8, 1.0))
kit.area_light("rim2", (-2.4, 1.8, 1.4), head, 300, 0.8, color=(1.0, 0.45, 0.8))
kit.area_light("fill", (2.6, -2.2, 0.8), head, 90, 2.5, color=(0.7, 0.8, 1.0))
kit.render(a.out)
print("saved", a.out)
