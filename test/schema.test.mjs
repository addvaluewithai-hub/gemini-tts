import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRequest } from "../src/schema.mjs";

test("normalizes a simple request", () => {
  const request = normalizeRequest({ text: "hello" });
  assert.equal(request.voice, "Kore");
  assert.equal(request.format, "wav");
  assert.equal(request.routing, "balanced");
  assert.equal(request.sample_rate, 24000);
});

test("telephony formats default to 8 kHz", () => {
  assert.equal(normalizeRequest({ text: "hello", format: "mulaw" }).sample_rate, 8000);
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
