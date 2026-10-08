#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { runTtsJob } from "./worker.mjs";
import { collectGeminiKeys } from "./router.mjs";
import { getCloudinaryConfig } from "./storage/cloudinary.mjs";
import { listGeminiVoices, STUDIO_VOICES } from "./voices.mjs";

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function has(name) {
  return process.argv.includes(name);
}

async function main() {
  if (has("--studio-voices")) {
    console.log(JSON.stringify({
      count: STUDIO_VOICES.length,
      voices: STUDIO_VOICES,
    }, null, 2));
    return;
  }

  if (has("--list-voices")) {
    const keys = collectGeminiKeys(process.env);
    if (!keys.length) throw new Error("No Gemini API keys configured");

    const result = await listGeminiVoices({
      apiKey: keys[0].value,
      search: argValue("--voice-search"),
      languageCode: argValue("--voice-language"),
      type: argValue("--voice-type"),
      accent: argValue("--voice-accent"),
      persona: argValue("--voice-persona"),
      context: argValue("--voice-context"),
      gender: argValue("--voice-gender"),
      pitch: argValue("--voice-pitch"),
      regionCode: argValue("--voice-region"),
      maxVoices: Number(argValue("--voice-limit") || 500),
    });

    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (has("--check-config")) {
    const keys = collectGeminiKeys(process.env);
    if (!keys.length) throw new Error("No Gemini API keys configured");
    const cloud = getCloudinaryConfig(process.env);
    console.log(JSON.stringify({
      ok: true,
      gemini_key_count: keys.length,
      cloudinary_cloud_name: cloud.cloudName,
      transcript_model: "gemini-3.5-transcribe",
    }, null, 2));
    return;
  }

  const file = argValue("--file");
  const inline = argValue("--request");
  if (!file && !inline) throw new Error("Provide --file request.json or --request '<json>'");

  const raw = file ? await readFile(file, "utf8") : inline;
  const request = JSON.parse(raw);

  const jobId = argValue("--job-id") || `job-${Date.now()}`;
  const resultPath = argValue("--result") || "result.json";
  const upload = !has("--no-upload");

  try {
    const result = await runTtsJob({
      rawRequest: request,
      jobId,
      outputDir: argValue("--output-dir") || "out",
      upload,
    });
    await writeFile(resultPath, `${JSON.stringify(result, null, 2)}\n`);
    console.log(JSON.stringify({
      id: result.id,
      status: result.status,
      model: result.model,
      key_slot: result.key_slot,
      audio_url: result.audio_url,
      transcript_url: result.transcript_url,
      vtt_url: result.vtt_url,
      word_count: result.transcript?.word_count ?? null,
    }, null, 2));
  } catch (error) {
    const failure = {
      id: jobId,
      status: "failed",
      error: error?.message || String(error),
      attempts: error?.attempts || [],
    };
    await writeFile(resultPath, `${JSON.stringify(failure, null, 2)}\n`).catch(() => {});
    throw error;
  }
}

main().catch((error) => {
  console.error(`ERROR: ${error?.message || error}`);
  process.exitCode = 1;
});
