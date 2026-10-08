import test from "node:test";
import assert from "node:assert/strict";
import { isStudioVoice, STUDIO_VOICES, voiceRequires38 } from "../src/voices.mjs";

test("curated studio voice catalog has 30 voices", () => {
  assert.equal(STUDIO_VOICES.length, 30);
  assert.equal(new Set(STUDIO_VOICES.map((v) => v.id)).size, 30);
});

test("known studio voices do not force 3.8-only routing", () => {
  assert.equal(isStudioVoice("Kore"), true);
  assert.equal(isStudioVoice("puck"), true);
  assert.equal(voiceRequires38("Kore"), false);
});

test("extended and custom voice IDs force 3.8 routing", () => {
  assert.equal(voiceRequires38("Fola"), true);
  assert.equal(voiceRequires38("voice_abc123"), true);
  assert.equal(voiceRequires38("voicekey_abc123"), true);
});
