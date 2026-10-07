import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCaptionCues,
  cleanSourceText,
  extractWordAnnotations,
  parseOffsetMs,
  renderVtt,
} from "../src/transcript.mjs";

test("parseOffsetMs accepts seconds and milliseconds", () => {
  assert.equal(parseOffsetMs("1.25s"), 1250);
  assert.equal(parseOffsetMs("420ms"), 420);
  assert.equal(parseOffsetMs(0.5), 500);
});

test("extractWordAnnotations normalizes Gemini word_info annotations", () => {
  const words = extractWordAnnotations({
    steps: [{
      content: [{
        annotations: [
          { type: "word_info", text: "Hello", start_offset: "0.1s", end_offset: "0.4s", speaker: "spk_1" },
          { type: "word_info", text: "world", start_offset: "0.5s", end_offset: "0.9s", speaker: "spk_1" },
        ],
      }],
    }],
  });

  assert.deepEqual(words, [
    { start_ms: 100, end_ms: 400, text: "Hello", speaker: "spk_1" },
    { start_ms: 500, end_ms: 900, text: "world", speaker: "spk_1" },
  ]);
});

test("caption cues split on speaker changes", () => {
  const cues = buildCaptionCues([
    { start_ms: 0, end_ms: 200, text: "Hi", speaker: "spk_1" },
    { start_ms: 250, end_ms: 500, text: "there", speaker: "spk_1" },
    { start_ms: 700, end_ms: 1000, text: "Hello", speaker: "spk_2" },
  ]);
  assert.equal(cues.length, 2);
  assert.equal(cues[0].text, "Hi there");
  assert.equal(cues[1].speaker, "spk_2");
});

test("renderVtt produces timestamped captions", () => {
  const vtt = renderVtt([
    { start_ms: 100, end_ms: 400, text: "Hello" },
    { start_ms: 500, end_ms: 900, text: "world" },
  ]);
  assert.match(vtt, /WEBVTT/);
  assert.match(vtt, /00:00:00\.100 --> 00:00:00\.900/);
  assert.match(vtt, /Hello world/);
});

test("cleanSourceText removes non-verbal inline tags", () => {
  assert.equal(cleanSourceText("Hello <short pause> <chuckles> world"), "Hello world");
});
