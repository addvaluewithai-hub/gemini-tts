#!/usr/bin/env node
// The sound for film pilot 01: the five recorded lines placed on the scene's timeline, effects on the actions,
// and the music bed under it all.   node film/pilot01.sound.cjs <voice.wav> <outDir>   -> voice.wav (for the mouth), mix.wav
const path = require("path"), { spawnSync } = require("child_process"), sfx = require("../sfx.cjs");
const [voice, out] = process.argv.slice(2), DUR = 37;
// [start in the recording, end in the recording, where it lands in the scene]
const LINES = [[0.1, 2.45, 1.2], [2.95, 6.05, 7.9], [6.55, 11.45, 14.2], [11.65, 14.65, 26.8], [15.45, 18.9, 31.2]];
const FX = [[0.75, "pop", 0.6], [2.3, "ding", 0.5], [6.5, "whoosh", 0.7], [6.85, "impact", 0.8], [8.1, "riser", 0.4], [9.75, "tick", 0.8], [10.15, "tick", 0.8], [10.55, "tick", 0.8], [10.95, "tick", 0.8], [12.2, "thud", 0.9],
  [13.0, "swipe", 0.7], [13.9, "print", 0.5], [15.3, "pop", 0.5], [16.6, "pop", 0.5], [17.6, "swipe", 0.7], [17.9, "ding", 0.9], [19.2, "swipe", 0.6], [20.6, "tick", 0.5], [21.5, "whoosh", 0.6],
  [22.7, "tick", 0.5], [23.1, "tick", 0.5], [23.5, "tick", 0.5], [23.9, "tick", 0.5], [24.3, "tick", 0.5], [25.6, "shutter", 0.7], [26.0, "shutter", 0.7], [26.5, "down", 0.5], [29.5, "whoosh", 0.6], [35.0, "pop", 0.6], [35.6, "down", 0.5]];
sfx.writeWav(path.join(out, "fx.wav"), sfx.effects(FX.map(([t, type, gain]) => ({ t, type, gain })), DUR), 0.55);
sfx.writeWav(path.join(out, "music.wav"), sfx.music(DUR, { bpm: 96, end: DUR - 0.3, levels: [{ t: 0, g: 0.8 }, { t: 13, g: 0.45 }, { t: 21.5, g: 0.8 }] }));
const ins = LINES.flatMap(([a, b]) => ["-ss", String(a), "-t", String(b - a), "-i", voice]);
const lay = LINES.map(([, , at], i) => `[${i}:a]aresample=48000,adelay=${Math.round(at * 1000)}:all=1[v${i}]`).join(";") + ";" + LINES.map((_, i) => `[v${i}]`).join("") + `amix=inputs=${LINES.length}:normalize=0,apad,atrim=0:${DUR}[v]`;
let r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...ins, "-filter_complex", lay, "-map", "[v]", "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", path.join(out, "voice.wav")], { stdio: "inherit" });
if (r.status) process.exit(1);
r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(out, "voice.wav"), "-i", path.join(out, "fx.wav"), "-i", path.join(out, "music.wav"), "-filter_complex",
  "[0:a]aresample=48000,volume=1.5,asplit=2[v][k];[2:a][k]sidechaincompress=threshold=0.03:ratio=4:attack=15:release=380[m];[v][1:a][m]amix=inputs=3:normalize=0:weights=1 1 0.5[x];[x]loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[a]",
  "-map", "[a]", "-t", String(DUR), "-c:a", "pcm_s16le", path.join(out, "mix.wav")], { stdio: "inherit" });
if (r.status) process.exit(1);
console.log("wrote voice.wav and mix.wav in", out);
