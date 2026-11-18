#!/usr/bin/env python3
"""Sound design for the S01 cold open, all synthesized (numpy/scipy): no samples, no licences.

  python3 s01_sound.py out.wav [--peek peek.wav --peek-words peek.json --crowe crowe.wav --crowe-words crowe.json]
          [--env env.json]

Builds a 48 kHz stereo mix: rain (muffled in slow motion), a tension drone, detector beeps, the door slam,
footsteps, the leap whoosh, slow-motion heartbeats and a dreamy pad that stops dead (record scratch) when Peek
realises, a falling whistle, the crash and the lid clang, the final braam. The voice lines are placed on the
timeline by their word times; their loudness envelope per video frame is written to env.json (mouth animation).
"""
import json, sys, argparse
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DUR = 11.2          # 10 s of picture + the braam tail under the title
rng = np.random.default_rng(7)
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)


def t_axis(n):
    return np.arange(n) / SR


def place(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    x = x[: N - i] * gain
    L[i:i + len(x)] += x * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(x)] += x * np.sqrt(0.5 * (1 + pan))


def env_adsr(n, a=0.005, d=0.1, s=0.0, r=0.0, sus=0.0):
    t = t_axis(n); e = np.zeros(n)
    e[t < a] = t[t < a] / max(a, 1e-6)
    m = (t >= a) & (t < a + d); e[m] = 1 - (1 - s) * (t[m] - a) / d
    m = t >= a + d; e[m] = s * np.exp(-(t[m] - a - d) / max(r, 1e-3)) if r else s
    return e


def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "low"); return signal.lfilter(b, a, x)


def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), "high"); return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band"); return signal.lfilter(b, a, x)


def noise(n):
    return rng.standard_normal(n)


def slowmo(t):
    """1 during the float (5.2-7.45 s), with short ramps."""
    return np.clip((t - 5.0) / 0.3, 0, 1) * np.clip((7.45 - t) / 0.05, 0, 1)


T = t_axis(N)
sm = slowmo(T)

# --- rain bed (stereo, filtered noise with drops), muffled and quieter in slow motion
rainL, rainR = hp(lp(noise(N), 7000), 400), hp(lp(noise(N), 7000), 400)
drops = np.zeros(N); idx = rng.integers(0, N, 2500); drops[idx] = rng.uniform(0.3, 1, len(idx))
drops = bp(drops, 1500, 6000) * 3
muffled = lp(noise(N), 600) * 1.5
rain_gain = 0.05 * (1 - 0.75 * sm) * (T < 10.0) + 0.02 * (T >= 10.0)
L += (rainL * (1 - sm) + muffled * sm + drops) * rain_gain
R += (rainR * (1 - sm) + muffled * sm + drops[::-1]) * rain_gain

# --- tension drone (low minor cluster) rising to the leap; cut at the slow motion; returns for the ending
drone = sum(np.sin(2 * np.pi * f * T + np.sin(2 * np.pi * 0.2 * T) * 0.5) for f in (55, 65.4, 82.4, 110))
pulse = 0.65 + 0.35 * np.sin(2 * np.pi * (1.2 + T * 0.35) * T)
drone_gain = np.interp(T, [0, 1.6, 4.4, 5.0, 5.2, 9.2, 9.4, 10.0, 10.4], [0.02, 0.035, 0.06, 0.07, 0, 0, 0.05, 0.06, 0])
place(lp(drone * pulse, 400) * drone_gain, 0)

# --- detector beeps: slow while hiding, frantic at the ending
def beep(f=1760, d=0.07):
    n = int(d * SR); t = t_axis(n); return np.sin(2 * np.pi * f * t) * env_adsr(n, 0.003, d - 0.01, 0)
for s in np.arange(0.15, 1.6, 0.42):
    place(beep(), s, 0.10, -0.4)
for s in np.arange(9.35, 10.0, 0.09):
    place(beep(1900, 0.045), s, 0.13, 0.2)

# --- the door slam at 1.7: thump + crack + metal ring
def door_slam():
    n = int(1.2 * SR); t = t_axis(n)
    thump = np.sin(2 * np.pi * 60 * t * (1 - 0.3 * t)) * np.exp(-t * 9)
    crack = bp(noise(n), 800, 5000) * np.exp(-t * 35)
    ring = sum(np.sin(2 * np.pi * f * t) for f in (412, 655, 1210)) * np.exp(-t * 4) * 0.15
    return thump * 1.2 + crack * 0.8 + ring
place(door_slam(), 1.7, 0.55, -0.5)

# --- footsteps: Peek's quick wet taps, Crowe's heavy far steps
def step(heavy=False):
    n = int(0.18 * SR); t = t_axis(n)
    body = np.sin(2 * np.pi * (90 if heavy else 180) * t) * np.exp(-t * (25 if heavy else 45))
    splash = bp(noise(n), 1200, 7000) * np.exp(-t * 30)
    return body * (1.0 if heavy else 0.6) + splash * 0.5
for i, s in enumerate(np.arange(1.85, 4.45, np.pi / 15)):
    place(step(), s, 0.18, 0.15 if i % 2 else -0.15)
for i, s in enumerate(np.arange(2.0, 4.45, 0.33)):
    place(lp(step(True), 2500), s, 0.12 * (0.6 + 0.4 * (s - 2) / 2.5), -0.45)

# --- the leap: whoosh at 4.85, then the slow-motion "suck" and heartbeats
def whoosh(d=0.6, lo=300, hi=3000):
    n = int(d * SR); t = t_axis(n)
    sweep = noise(n)
    out = np.zeros(n)
    for k, c in enumerate(np.geomspace(lo, hi, 6)):
        out += bp(sweep, c * 0.8, c * 1.2) * np.exp(-((t / d - (k + 1) / 7) ** 2) / 0.02)
    return out * np.sin(np.pi * t / d)
place(whoosh(0.55), 4.6, 0.35, 0.3)
reverse_swell = lp(noise(int(0.45 * SR)), 900) * np.linspace(0, 1, int(0.45 * SR)) ** 3
place(reverse_swell, 4.8, 0.6)
def heartbeat():
    n = int(0.5 * SR); t = t_axis(n)
    lub = np.sin(2 * np.pi * 48 * t) * np.exp(-t * 18)
    dub = np.sin(2 * np.pi * 42 * (t - 0.18)) * np.exp(-np.clip(t - 0.18, 0, None) * 18) * (t > 0.18)
    return lp(lub + 0.7 * dub, 200)
for s in (5.45, 6.25, 7.0):
    place(heartbeat(), s, 0.9)

# --- dreamy pad in slow motion (major 7th, slow attack), stopped dead by a record scratch at 7.45
pad_n = int(2.3 * SR); pt = t_axis(pad_n)
pad = sum(np.sin(2 * np.pi * f * pt + 0.3 * np.sin(2 * np.pi * 0.3 * pt)) for f in (261.6, 329.6, 392.0, 493.9, 523.3))
pad *= np.clip(pt / 0.6, 0, 1) * 0.6
shimmer = sum(np.sin(2 * np.pi * f * pt) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * pt + f)) for f in (1046.5, 1318.5, 1568))
place(lp(pad + 0.25 * shimmer, 4000), 5.15, 0.035)
scratch_n = int(0.22 * SR); st = t_axis(scratch_n)
scratch = bp(noise(scratch_n), 600, 3000) * np.sin(2 * np.pi * (40 - 120 * st) * st) * np.exp(-st * 8)
place(scratch, 7.43, 0.35)

# --- the fall: cartoon falling whistle, then the crash and the lid
fw_n = int(0.95 * SR); ft = t_axis(fw_n)
freq = 1500 * np.exp(-ft * 1.7)
whistle = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.clip(ft / 0.05, 0, 1)
place(whistle, 8.02, 0.12)
place(whoosh(0.9, 150, 1500), 8.05, 0.3)
def crash():
    n = int(1.0 * SR); t = t_axis(n)
    boom = np.sin(2 * np.pi * 50 * t * (1 - 0.4 * t)) * np.exp(-t * 7)
    trash = bp(noise(n), 300, 6000) * np.exp(-t * 9) * (1 + 0.5 * np.sin(2 * np.pi * 23 * t))
    rattle = bp(noise(n), 2000, 8000) * np.exp(-t * 4) * (rng.random(n) < 0.02) * 6
    return boom * 1.3 + trash + rattle
place(crash(), 8.98, 0.6)
def clang():
    n = int(1.4 * SR); t = t_axis(n)
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((180, 5), (433, 6), (870, 7), (1630, 9)))
            + bp(noise(n), 500, 4000) * np.exp(-t * 40))
place(clang(), 9.13, 0.4, 0.1)

# --- the ending: braam on the cut to black
def braam():
    n = int(1.5 * SR); t = t_axis(n)
    saw = sum(signal.sawtooth(2 * np.pi * f * t) for f in (43.65, 43.9, 87.3, 65.4))
    return lp(saw, 600) * np.clip(t / 0.02, 0, 1) * np.exp(-t * 1.6)
place(braam(), 9.97, 0.3)

# --- voices, placed by their word times; also the per-frame loudness envelope for the mouths
ap = argparse.ArgumentParser(); ap.add_argument("out")
ap.add_argument("--peek"); ap.add_argument("--peek-words"); ap.add_argument("--crowe"); ap.add_argument("--crowe-words")
ap.add_argument("--env"); ap.add_argument("--fps", type=int, default=30)
a = ap.parse_args()

def load(path):
    sr, x = wavfile.read(path); x = x.astype(np.float64)
    if x.ndim > 1: x = x.mean(axis=1)
    x /= 32768.0
    return signal.resample_poly(x, SR, sr)

# Each line: (from, to) in the take, where it starts in the picture, gain, treatment.
LINES = {
    "peek": [(0.12, 1.4, 0.55, 1.0, None),        # <gasp> Oh no.
             (1.8, 3.6, 2.45, 0.55, None),        # running breaths
             (4.1, 8.6, 5.3, 1.0, "tighten"),     # Relax... on my planet... we float.
             (8.95, 10.0, 7.48, 1.0, None),       # <gasp> Uh-oh.
             (10.05, 12.4, 8.0, 1.0, "fall")],    # WHOOOAAA (falling away)
    "crowe": [(0.25, 1.95, 1.9, 0.9, "far"),      # STOP RIGHT THERE!
              (2.55, 3.6, 9.58, 1.0, None)],      # Gotcha.
}
env_out = {"fps": a.fps}

def tighten(x, gap=0.12, tempo=1.18):
    """Collapse pauses longer than `gap`, then speed up without changing pitch (ffmpeg atempo)."""
    import subprocess, tempfile, os
    h = int(0.02 * SR); e = np.sqrt(np.convolve(x ** 2, np.ones(h) / h, mode="same"))
    loud = e > 0.012; out = []; quiet = 0
    for i in range(0, len(x), h):
        if loud[i:i + h].any(): out.append(x[i:i + h]); quiet = 0
        else:
            quiet += h
            if quiet <= gap * SR: out.append(x[i:i + h])
    y = np.concatenate(out)
    with tempfile.TemporaryDirectory() as d:
        a_, b_ = os.path.join(d, "a.wav"), os.path.join(d, "b.wav")
        wavfile.write(a_, SR, (y * 32767).astype(np.int16))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a_, "-af", f"atempo={tempo}", b_], check=True)
        return wavfile.read(b_)[1].astype(np.float64) / 32768.0

def place_voice(who, wav_path, pan):
    x = load(wav_path)
    voice_track = np.zeros(N)
    for s, e, at, gain, fx in LINES[who]:
        seg_ = x[int(s * SR): int(e * SR)].copy()
        if fx == "tighten":
            seg_ = tighten(seg_)
            seg_ = seg_ + 0.3 * np.concatenate([np.zeros(int(0.22 * SR)), seg_])[: len(seg_)]   # dreamy echo
        if fx == "far":
            seg_ = lp(seg_, 3500)
            seg_ = seg_ + 0.35 * np.concatenate([np.zeros(int(0.09 * SR)), seg_])[: len(seg_)]
        if fx == "fall":   # the scream falls away: fade, darken, pitch drop by resampling
            seg_ = seg_[: int(1.05 * SR)]
            seg_ = signal.resample(seg_, int(len(seg_) * 1.12))[: int(1.0 * SR)]
            seg_ = seg_ * np.linspace(1, 0.05, len(seg_)) ** 1.5
        fade = min(len(seg_), int(0.03 * SR)); seg_[-fade:] *= np.linspace(1, 0, fade); seg_[:fade // 3] *= np.linspace(0, 1, fade // 3)
        i = int(at * SR); n = min(len(seg_), N - i)
        voice_track[i:i + n] += seg_[:n] * gain
    place(voice_track, 0, 1.6, pan)
    hop = SR // a.fps
    rms = np.sqrt(np.convolve(voice_track ** 2, np.ones(hop) / hop, mode="same"))[::hop]
    env_out[who] = np.round(np.clip(rms / (np.percentile(rms[rms > 1e-4], 95) + 1e-9), 0, 1), 3).tolist()

if a.peek:
    place_voice("peek", a.peek, 0.0)
if a.crowe:
    place_voice("crowe", a.crowe, -0.1)

mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.2) / np.tanh(1.2)        # gentle bus saturation
mix /= max(1e-9, np.abs(mix).max()) / 0.89
wavfile.write(a.out, SR, (mix * 32767).astype(np.int16))
if a.env:
    json.dump(env_out, open(a.env, "w"))
print(a.out)
