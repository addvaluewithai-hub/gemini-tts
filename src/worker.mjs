import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeRequest } from "./schema.mjs";
import { buildAttemptPlan, collectGeminiKeys, isRetryableStatus } from "./router.mjs";
import { generateWithGemini, GeminiHttpError } from "./providers/gemini.mjs";
import { transcribeWithGemini } from "./transcript.mjs";
import {
  uploadAudioToCloudinary,
  uploadTextArtifactToCloudinary,
} from "./storage/cloudinary.mjs";

function safeJobId(value) {
  const source = String(value || "").trim();
  if (!source) throw new Error("jobId is required");
  const clean = source.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 120);
  if (!clean) throw new Error("jobId contains no usable characters");
  return clean;
}

function publicError(error) {
  if (error instanceof GeminiHttpError) {
    return { status: error.status, message: error.message };
  }
  return { status: null, message: error?.message || String(error) };
}

export async function runTtsJob({
  rawRequest,
  jobId,
  env = process.env,
  outputDir = "out",
  upload = true,
}) {
  const id = safeJobId(jobId);
  const request = normalizeRequest(rawRequest);
  const keys = collectGeminiKeys(env);
  const attempts = buildAttemptPlan(request, keys, id);

  const failures = [];
  let generated = null;
  let selected = null;

  for (const attempt of attempts) {
    const startedAt = Date.now();
    try {
      generated = await generateWithGemini({
        apiKey: attempt.key.value,
        modelId: attempt.modelId,
        request,
      });
      selected = {
        model: attempt.modelId,
        key_slot: attempt.key.slot,
        key_name: attempt.key.name,
        latency_ms: Date.now() - startedAt,
      };
      break;
    } catch (error) {
      const info = publicError(error);
      failures.push({
        model: attempt.modelId,
        key_slot: attempt.key.slot,
        status: info.status,
        message: info.message,
      });

      if (!(error instanceof GeminiHttpError) || !isRetryableStatus(error.status)) {
        throw Object.assign(new Error(`Gemini generation failed: ${info.message}`), { attempts: failures });
      }
    }
  }

  if (!generated || !selected) {
    throw Object.assign(new Error("All eligible Gemini model/key attempts were exhausted"), { attempts: failures });
  }

  await mkdir(outputDir, { recursive: true });
  const audioPath = path.join(outputDir, `${id}.${generated.extension}`);
  await writeFile(audioPath, generated.audio);

  let transcriptResult = null;
  let transcriptJson = null;
  let transcriptPath = null;
  let vttPath = null;

  if (request.transcript.enabled) {
    transcriptResult = await transcribeWithGemini({
      audioPath,
      mimeType: generated.mime_type,
      request,
      keys,
      jobId: id,
    });

    transcriptJson = `${JSON.stringify(transcriptResult.transcript, null, 2)}\n`;
    transcriptPath = path.join(outputDir, `${id}.transcript.json`);
    await writeFile(transcriptPath, transcriptJson, "utf8");

    if (transcriptResult.vtt) {
      vttPath = path.join(outputDir, `${id}.transcript.vtt`);
      await writeFile(vttPath, transcriptResult.vtt, "utf8");
    }
  }

  let cloudinary = null;
  let transcriptCloudinary = null;
  let vttCloudinary = null;

  if (upload) {
    cloudinary = await uploadAudioToCloudinary({
      audio: generated.audio,
      format: request.format,
      mimeType: generated.mime_type,
      jobId: id,
      model: selected.model,
      env,
    });

    if (transcriptJson) {
      transcriptCloudinary = await uploadTextArtifactToCloudinary({
        content: transcriptJson,
        jobId: id,
        suffix: "transcript.json",
        mimeType: "application/json",
        model: transcriptResult.model,
        env,
      });
    }

    if (transcriptResult?.vtt) {
      vttCloudinary = await uploadTextArtifactToCloudinary({
        content: transcriptResult.vtt,
        jobId: id,
        suffix: "transcript.vtt",
        mimeType: "text/vtt",
        model: transcriptResult.model,
        env,
      });
    }
  }

  return {
    id,
    status: "completed",
    created_at: new Date().toISOString(),
    model: selected.model,
    routing: request.routing,
    key_slot: selected.key_slot,
    format: request.format,
    mime_type: generated.mime_type,
    sample_rate: request.sample_rate,
    bytes: generated.audio.length,
    audio_url: cloudinary?.secure_url || null,
    transcript_url: transcriptCloudinary?.secure_url || null,
    vtt_url: vttCloudinary?.secure_url || null,
    transcript: request.transcript.enabled ? {
      status: "completed",
      provider: "gemini",
      model: transcriptResult.model,
      key_slot: transcriptResult.key_slot,
      word_count: transcriptResult.transcript.word_count,
      duration_ms: transcriptResult.transcript.duration_ms,
      diarization: transcriptResult.transcript.diarization,
      failed_attempts: transcriptResult.attempts,
      local_json: transcriptPath,
      local_vtt: vttPath,
    } : {
      status: "disabled",
    },
    cloudinary,
    transcript_cloudinary: transcriptCloudinary,
    vtt_cloudinary: vttCloudinary,
    local_file: audioPath,
    attempts_before_success: failures.length,
    failed_attempts: failures,
    metadata: request.metadata,
  };
}
