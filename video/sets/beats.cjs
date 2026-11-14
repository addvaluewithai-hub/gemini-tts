#!/usr/bin/env node
// The beats of one board with their words and times, for timing a set to the voice; and the `ends` a set needs.
//   node sets/beats.cjs <storyboard.json> <cues.json> <board id> [--write]
// Prints each beat on the board: its step, start, length, and every word with its time from the start of the beat.
// --write stores `ends` (how long each step ran before the next step of the same board took over) in the board's spec.
const fs = require("fs"), path = require("path");
const [sbPath, cuePath, id, ...rest] = process.argv.slice(2);
if (!id) { console.error("usage: node sets/beats.cjs <storyboard.json> <cues.json> <board id> [--write]"); process.exit(2); }
const sb = JSON.parse(fs.readFileSync(sbPath, "utf8")), cues = JSON.parse(fs.readFileSync(cuePath, "utf8"));
const words = JSON.parse(fs.readFileSync(cuePath.replace(/\.json$/, ".words.json"), "utf8")).words, tempo = cues.tempo || 1, edit = cues.edit;
const beats = sb.scenes.flatMap((s) => s.beats);
const at = (w) => (w.start_ms / 1000 - 0.07) / tempo;
const steps = []; let last = -1;
beats.forEach((b, k) => { const e = edit[k], end = edit[k + 1] ? edit[k + 1].t : e.t + 5, mine = b.show === "board" && b.board === id;
  if (!mine) return; const st = typeof b.step === "number" ? b.step : e.step;
  const ws = words.filter((w) => at(w) >= e.t - 0.05 && at(w) < end - 0.05).map((w) => `${(at(w) - e.t).toFixed(2)} ${w.text}`);
  console.log(`#${k} step ${st} at ${e.t.toFixed(2)} for ${(end - e.t).toFixed(2)}${b.host ? " host " + b.host : ""}\n   ${ws.join(" | ")}`);
  if (st !== last) { steps[st] = { t: e.t }; last = st; } steps[st].end = end; });
const ends = steps.map((s, i) => (steps[i + 1] ? +(steps[i + 1].t - s.t).toFixed(2) : +(s.end - s.t).toFixed(2)));
console.log("ends", JSON.stringify(ends));
if (rest.includes("--write")) { sb.boards[id].ends = ends; fs.writeFileSync(sbPath, JSON.stringify(sb, null, 1) + "\n"); console.log("wrote ends to", path.basename(sbPath)); }
