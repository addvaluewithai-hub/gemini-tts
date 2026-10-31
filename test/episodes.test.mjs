import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeRequest } from "../src/schema.mjs";
import { isStudioVoice } from "../src/voices.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "episodes");

async function episodeRequests(dir) {
  const found = [];
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) found.push(...await episodeRequests(full));
    else if (name === "request.json") found.push(full);
  }
  return found.sort();
}

test("every episode request.json is a valid factory request", async () => {
  const files = await episodeRequests(ROOT);
  assert.ok(files.length > 0, `expected at least one episode request under ${ROOT}`);
  for (const file of files) {
    const raw = JSON.parse(await readFile(file, "utf8"));
    const request = normalizeRequest(raw);
    assert.equal(request.isMultiSpeaker, false, `${file}: episodes are single-host`);
    assert.ok(isStudioVoice(request.voice), `${file}: host voice must be a curated studio voice`);
    assert.equal(request.transcript.enabled, true, `${file}: transcript must stay enabled`);
    for (const [index, turn] of request.turns.entries()) {
      assert.ok(!/^(say|read|speak)\b/i.test(turn.text), `${file}: turns[${index}] leaks a stage direction into text`);
    }
  }
});

test("every episode dispatch.json wraps its sibling request.json", async () => {
  const files = await episodeRequests(ROOT);
  assert.ok(files.length > 0, "expected at least one episode request");
  for (const file of files) {
    const dispatchPath = path.join(path.dirname(file), "dispatch.json");
    const dispatch = JSON.parse(await readFile(dispatchPath, "utf8"));
    assert.equal(dispatch.event_type, "tts.generate");
    assert.match(dispatch.client_payload.job_id, /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,119}$/);
    assert.deepEqual(dispatch.client_payload.request, JSON.parse(await readFile(file, "utf8")));
  }
});
