import test from "node:test";
import assert from "node:assert/strict";
import { buildAttemptPlan, collectGeminiKeys, hashString, rotate } from "../src/router.mjs";
import { normalizeRequest } from "../src/schema.mjs";

test("collectGeminiKeys deduplicates keys without exposing values", () => {
  const keys = collectGeminiKeys({
    GEMINI_API_KEY_1: "a",
    GEMINI_API_KEY_2: "b",
    GEMINI_API_KEY_3: "a",
  });
  assert.equal(keys.length, 2);
  assert.deepEqual(keys.map((k) => k.name), ["GEMINI_API_KEY_1", "GEMINI_API_KEY_2"]);
});

test("rotate is deterministic", () => {
  assert.deepEqual(rotate(["a", "b", "c"], 1), ["b", "c", "a"]);
  assert.equal(hashString("job-123"), hashString("job-123"));
});

test("balanced route uses all four models for simple wav requests", () => {
  const request = normalizeRequest({ text: "hello" });
  const keys = collectGeminiKeys({ GEMINI_API_KEY_1: "a", GEMINI_API_KEY_2: "b" });
  const plan = buildAttemptPlan(request, keys, "job-a");
  assert.equal(new Set(plan.map((x) => x.modelId)).size, 4);
  assert.equal(plan.length, 8);
});

test("multi-speaker route excludes legacy models", () => {
  const request = normalizeRequest({
    turns: [
      { speaker: "A", text: "hello" },
      { speaker: "B", text: "hi" },
    ],
    speakers: { A: "Puck", B: "Kore" },
  });
  const keys = collectGeminiKeys({ GEMINI_API_KEY_1: "a" });
  const plan = buildAttemptPlan(request, keys, "job-b");
  assert.deepEqual(
    [...new Set(plan.map((x) => x.modelId))].sort(),
    ["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts"].sort(),
  );
});
