import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRequest } from "../src/schema.mjs";

test("normalizes a simple request", () => {
  const request = normalizeRequest({ text: "hello" });
  assert.equal(request.voice, "Kore");
  assert.equal(request.format, "wav");
  assert.equal(request.routing, "balanced");
  assert.equal(request.sample_rate, 24000);
  assert.equal(request.transcript.enabled, true);
  assert.equal(request.transcript.model, "gemini-3.5-transcribe");
  assert.equal(request.transcript.diarization, false);
});

test("telephony formats default to 8 kHz", () => {
  assert.equal(normalizeRequest({ text: "hello", format: "mulaw" }).sample_rate, 8000);
});

test("multi speaker enables transcript diarization by default", () => {
  const request = normalizeRequest({
    turns: [
      { speaker: "A", text: "one" },
      { speaker: "B", text: "two" }
    ]
  });
  assert.equal(request.transcript.diarization, true);
});

test("transcript can be disabled explicitly", () => {
  const request = normalizeRequest({ text: "hello", transcript: false });
  assert.equal(request.transcript.enabled, false);
});

test("multi speaker rejects more than two unique speakers", () => {
  assert.throws(
    () => normalizeRequest({
      turns: [
        { speaker: "A", text: "one" },
        { speaker: "B", text: "two" },
        { speaker: "C", text: "three" }
      ]
    }),
    /exactly 2 unique speakers/,
  );
});

test("explicit routing requires a known model", () => {
  assert.throws(
    () => normalizeRequest({ text: "hello", routing: "explicit" }),
    /requires model/,
  );
});
