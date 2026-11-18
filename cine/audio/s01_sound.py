#!/usr/bin/env python3
"""Sound for the S01 cold open (2.5D cut): every effect is synthesized, the voice takes are placed on the timeline,
and the loudness of each voice per video frame is written out for the mouths.

  python3 audio/s01_sound.py out/s01-mix.wav --voices audio/voice --env out/s01-env.json
"""
import argparse, json, os, subprocess, tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR, DUR = 48000, 11.8
rng = np.random.default_rng(7)
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
T = np.arange(N) / SR
tx = lambda n: np.arange(n) / SR


def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    x = x[: N - i] * gain
    L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan)); R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))

def butter(kind, f, order=2):
    return signal.butter(order, np.array(f) / (SR / 2) if np.ndim(f) else f / (SR / 2), kind)
lp = lambda x, f: signal.lfilter(*butter("low", f), x)
hp = lambda x, f: signal.lfilter(*butter("high", f), x)
bp = lambda x, lo, hi: signal.lfilter(*butter("band", [lo, hi]), x)
noise = lambda n: rng.standard_normal(n)

SLOW = (5.5, 8.3)
sm = np.clip((T - (SLOW[0] - 0.2)) / 0.3, 0, 1) * np.clip((SLOW[1] - T) / 0.05, 0, 1)

# rain, muffled in the slow motion
rainL, rainR = hp(lp(noise(N), 7000), 400), hp(lp(noise(N), 7000), 400)
drops = np.zeros(N); idx = rng.integers(0, N, 2600); drops[idx] = rng.uniform(0.3, 1, len(idx)); drops = bp(drops, 1500, 6000) * 3
muff = lp(noise(N), 600) * 1.5
rg = 0.045 * (1 - 0.8 * sm) * (T < 10.6) + 0.015 * (T >= 10.6)
L += (rainL * (1 - sm) + muff * sm + drops * (1 - sm)) * rg; R += (rainR * (1 - sm) + muff * sm + drops[::-1] * (1 - sm)) * rg

# tension drone: builds to the leap, silent in the float, back for the ending
drone = sum(np.sin(2 * np.pi * f * T + np.sin(2 * np.pi * 0.2 * T) * 0.5) for f in (55, 65.4, 82.4, 110))
pulse = 0.65 + 0.35 * np.sin(2 * np.pi * np.cumsum(1.2 + T * 0.5) / SR)
dg = np.interp(T, [0, 1.8, 3.6, 5.3, 5.5, 9.8, 9.95, 10.55, 10.9], [0.02, 0.035, 0.06, 0.075, 0, 0, 0.05, 0.06, 0])
place(lp(drone * pulse, 400) * dg, 0)
# a ticking pulse under the chase
for s_ in np.arange(1.9, 5.4, 0.2):
    n = int(0.05 * SR); place(bp(noise(n), 3000, 9000) * np.exp(-tx(n) * 120), s_, 0.05 + 0.03 * (s_ > 3.6))
for s_ in np.arange(3.6, 5.4, 0.4):
    n = int(0.3 * SR); t = tx(n); place(np.sin(2 * np.pi * 55 * t * (1 - 0.5 * t)) * np.exp(-t * 14), s_, 0.5)

def beep(f=1760, d=0.07):
    n = int(d * SR); t = tx(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.003) * np.exp(-t * 20)
for s_ in np.arange(0.12, 1.75, 0.4): place(beep(), s_, 0.09, -0.5)
for s_ in np.arange(9.95, 10.58, 0.085): place(beep(1900, 0.045), s_, 0.12, 0.2)

def hit():                                    # the torch finds him / Crowe is revealed
    n = int(1.3 * SR); t = tx(n)
    return (np.sin(2 * np.pi * 58 * t * (1 - 0.3 * t)) * np.exp(-t * 7) * 1.3 + bp(noise(n), 700, 5000) * np.exp(-t * 30) * 0.7
            + sum(np.sin(2 * np.pi * f * t) for f in (220, 233, 440)) * np.exp(-t * 3) * 0.12)
place(hit(), 0.86, 0.3); place(hit(), 1.8, 0.6, -0.3)

def boing(f0=280, f1=720, d=0.28):
    n = int(d * SR); t = tx(n); f = f0 + (f1 - f0) * (t / d) ** 0.6
    return np.sin(2 * np.pi * np.cumsum(f) / SR + 4 * np.sin(2 * np.pi * 22 * t)) * np.exp(-t * 6) * np.minimum(1, t / 0.005)
place(boing(), 1.93, 0.22)
def thud(f=120, k=30):
    n = int(0.25 * SR); t = tx(n); return np.sin(2 * np.pi * f * t * (1 - t)) * np.exp(-t * k) + bp(noise(n), 800, 5000) * np.exp(-t * 60) * 0.4
place(thud(), 2.53, 0.4)

def step():
    n = int(0.12 * SR); t = tx(n); return np.sin(2 * np.pi * 190 * t) * np.exp(-t * 55) * 0.6 + bp(noise(n), 1500, 7000) * np.exp(-t * 45) * 0.45
for i, s_ in enumerate(np.arange(3.0, 5.42, np.pi / 26)): place(step(), s_, 0.2, 0.25 if i % 2 else -0.25)

def whoosh(d=0.6, lo=300, hi=3000):
    n = int(d * SR); t = tx(n); src = noise(n); out = np.zeros(n)
    for k, c in enumerate(np.geomspace(lo, hi, 6)): out += bp(src, c * 0.8, c * 1.2) * np.exp(-((t / d - (k + 1) / 7) ** 2) / 0.02)
    return out * np.sin(np.pi * t / d)
place(whoosh(0.4, 400, 5000), 2.95, 0.3, 0.4)      # the bolt
place(whoosh(0.4, 300, 4000), 3.3, 0.35, 0.2)      # whip pan
place(whoosh(0.5), 5.2, 0.4, 0.3)                  # the leap
n = int(0.4 * SR); place(lp(noise(n), 900) * np.linspace(0, 1, n) ** 3, 5.1, 0.6)

def heart():
    n = int(0.5 * SR); t = tx(n)
    return lp(np.sin(2 * np.pi * 48 * t) * np.exp(-t * 18) + 0.7 * np.sin(2 * np.pi * 42 * (t - 0.18)) * np.exp(-np.clip(t - 0.18, 0, None) * 18) * (t > 0.18), 200)
for s_ in (5.85, 6.75, 7.65): place(heart(), s_, 0.85)
pn = int((SLOW[1] - SLOW[0]) * SR); pt = tx(pn)
pad = sum(np.sin(2 * np.pi * f * pt + 0.3 * np.sin(2 * np.pi * 0.3 * pt)) for f in (261.6, 329.6, 392.0, 493.9, 523.3)) * np.clip(pt / 0.6, 0, 1) * 0.6
shim = sum(np.sin(2 * np.pi * f * pt) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * pt + f)) for f in (1046.5, 1318.5, 1568))
harp = np.zeros(pn)
for i, f in enumerate((523.3, 659.3, 784, 987.8, 1046.5, 1318.5)):
    j = int((0.15 + i * 0.09) * SR); m = pn - j; harp[j:] += np.sin(2 * np.pi * f * tx(m)) * np.exp(-tx(m) * 3.5) * 0.6
place(lp(pad + 0.25 * shim + harp, 4500), SLOW[0], 0.04)
sn = int(0.22 * SR); st = tx(sn)
place(bp(noise(sn), 600, 3000) * np.sin(2 * np.pi * (40 - 120 * st) * st) * np.exp(-st * 8), SLOW[1] - 0.03, 0.4)   # record scratch

fn = int(0.84 * SR); ft = tx(fn); f = 1500 * np.exp(-ft * 1.9)
place(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.clip(ft / 0.05, 0, 1), 8.76, 0.1)                                    # falling whistle
place(whoosh(0.85, 150, 1500), 8.78, 0.3)
def crash():
    n = int(1.0 * SR); t = tx(n)
    return (np.sin(2 * np.pi * 50 * t * (1 - 0.4 * t)) * np.exp(-t * 7) * 1.3 + bp(noise(n), 300, 6000) * np.exp(-t * 9) * (1 + 0.5 * np.sin(2 * np.pi * 23 * t))
            + bp(noise(n), 2000, 8000) * np.exp(-t * 4) * (rng.random(n) < 0.02) * 6)
place(crash(), 9.6, 0.6)
def clang():
    n = int(1.2 * SR); t = tx(n)
    return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((180, 5), (433, 6), (870, 7), (1630, 9))) + bp(noise(n), 500, 4000) * np.exp(-t * 40)
place(clang(), 9.74, 0.38, 0.1)
place(thud(260, 40), 9.88, 0.3); place(boing(500, 380, 0.18), 9.9, 0.08)                                            # the hat lands
bn = int(1.4 * SR); bt = tx(bn)
place(lp(sum(signal.sawtooth(2 * np.pi * f * bt) for f in (43.65, 43.9, 87.3, 65.4)), 600) * np.clip(bt / 0.02, 0, 1) * np.exp(-bt * 1.6), 10.57, 0.3)   # braam on black

# ---- voices
ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--voices"); ap.add_argument("--env"); ap.add_argument("--fps", type=int, default=30)
a = ap.parse_args()

def load(name):
    sr, x = wavfile.read(os.path.join(a.voices, name + ".wav")); x = x.astype(np.float64) / 32768.0
    return signal.resample_poly(x if x.ndim == 1 else x.mean(axis=1), SR, sr)
def tighten(x, gap=0.1, tempo=1.0):
    h = int(0.02 * SR); e = np.sqrt(np.convolve(x ** 2, np.ones(h) / h, mode="same")); out = []; quiet = 0
    for i in range(0, len(x), h):
        if (e[i:i + h] > 0.012).any(): out.append(x[i:i + h]); quiet = 0
        else:
            quiet += h
            if quiet <= gap * SR: out.append(x[i:i + h])
    y = np.concatenate(out)
    if abs(tempo - 1) < 0.01: return y
    with tempfile.TemporaryDirectory() as d:
        p, q = os.path.join(d, "a.wav"), os.path.join(d, "b.wav"); wavfile.write(p, SR, (y * 32767).astype(np.int16))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", p, "-af", f"atempo={tempo}", q], check=True)
        return wavfile.read(q)[1].astype(np.float64) / 32768.0
def norm(x, peak=0.7): return x / (np.abs(x).max() + 1e-9) * peak
def fades(x, i=0.01, o=0.04):
    x = x.copy(); n1, n2 = int(i * SR), int(o * SR); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x
def echo(x, d, g): y = np.concatenate([x, np.zeros(int(d * SR * 2))]); y[int(d * SR):int(d * SR) + len(x)] += x * g; return y

tracks = {"peek": np.zeros(N), "crowe": np.zeros(N)}
def put(who, x, at, gain=1.0):
    i = int(at * SR); n = min(len(x), N - i); tracks[who][i:i + n] += x[:n] * gain
if a.voices:
    x = load("p1-ohno"); put("peek", fades(norm(x[int(0.85 * SR):int(1.6 * SR)], 0.4)), 0.98)
    stop = tighten(load("c1-stop"), gap=0.05); stop = tighten(load("c1-stop"), gap=0.05, tempo=min(1.9, max(1.0, len(stop) / SR / 1.45)))
    put("crowe", fades(echo(lp(norm(stop, 0.85), 4200), 0.11, 0.3)), 1.98)
    pant = tighten(load("p2-pant"), gap=0.08)
    for at in (3.72, 3.72 + len(pant) / SR + 0.05): put("peek", fades(norm(pant, 0.38)), at)
    fl = tighten(load("p3-float"), gap=0.16); tempo = max(1.0, len(fl) / SR / 2.45); fl = tighten(load("p3-float"), gap=0.16, tempo=tempo)
    put("peek", fades(echo(norm(fl, 0.75), 0.24, 0.28)), 5.72)
    x = tighten(load("p4-uhoh"), gap=0.05); put("peek", fades(norm(x, 0.6)), 8.42)
    sc = tighten(load("p5-scream"), gap=0.02)[: int(1.5 * SR)]
    sc = signal.resample(sc, int(len(sc) * 0.62)); sc = sc * np.linspace(1, 0.08, len(sc)) ** 1.4       # faster, then falling away
    put("peek", fades(norm(sc, 0.8), 0.01, 0.1), 8.74)
    x = tighten(load("c2-gotcha"), gap=0.08); put("crowe", fades(norm(x, 0.8)), 9.93)
    place(tracks["peek"], 0, 1.5, 0.0); place(tracks["crowe"], 0, 1.5, -0.15)
    if a.env:
        hop = SR // a.fps; env = {"fps": a.fps}
        for who, tr in tracks.items():
            rms = np.sqrt(np.convolve(tr ** 2, np.ones(hop) / hop, mode="same"))[::hop]
            env[who] = np.round(np.clip(rms / (np.percentile(rms[rms > 1e-4], 92) + 1e-9), 0, 1), 3).tolist()
        json.dump(env, open(a.env, "w"))

mix = np.stack([L, R], axis=1); mix = np.tanh(mix * 1.2) / np.tanh(1.2); mix /= max(1e-9, np.abs(mix).max()) / 0.89
wavfile.write(a.out, SR, (mix * 32767).astype(np.int16)); print(a.out)
