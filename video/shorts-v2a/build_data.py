#!/usr/bin/env python3
"""timeline.json + the cut voice track -> data.json for the stage: word times, total length, and the voice level
60 times a second (normalised inside each line, so the mouth opens on a whispered line too).
usage: build_data.py timeline.json voice.wav data.json [end_card_seconds]"""
import json, sys, wave
import numpy as np
tl = json.load(open(sys.argv[1])); f = wave.open(sys.argv[2]); sr = f.getframerate()
x = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float32) / 32768
card = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
total = round((tl["voice_end"] - 0.1 + card) * 30) / 30
H = sr // 60; n = int(total * 60) + 2; env = np.zeros(n)
for i in range(min(n, len(x) // H)): env[i] = np.sqrt(np.mean(x[i * H:(i + 1) * H] ** 2))
out = np.zeros(n)
for L in tl["lines"]:
    a, b = int(L["t0"] * 60), min(n, int(L["t1"] * 60) + 1); seg = env[a:b]
    if len(seg): out[a:b] = np.clip(seg / (np.percentile(seg, 92) + 1e-6), 0, 1.2)
out[out < 0.12] = 0
sm = np.zeros(n); v = 0.0
for i in range(n): v = v + (out[i] - v) * (0.75 if out[i] > v else 0.42); sm[i] = v
json.dump(dict(total=total, voice_end=tl["voice_end"], lines=tl["lines"], env=[round(float(q), 3) for q in sm]), open(sys.argv[3], "w"), ensure_ascii=False)
print("total", total, "frames", round(total * 30))
