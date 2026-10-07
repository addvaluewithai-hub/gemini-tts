import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeRequest } from "./schema.mjs";
import { buildAttemptPlan, collectGeminiKeys, isRetryableStatus } from "./router.mjs";
import { generateWithGemini, GeminiHttpError } from "./providers/gemini.mjs";
import { uploadAudioToCloudinary } from "./storage/cloudinary.mjs";

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

  let cloudinary = null;
  if (upload) {
    cloudinary = await uploadAudioToCloudinary({
      audio: generated.audio,
      format: request.format,
      mimeType: generated.mime_type,
      jobId: id,
      model: selected.model,
      env,
    });
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
    cloudinary,
    local_file: audioPath,
    attempts_before_success: failures.length,
    failed_attempts: failures,
    metadata: request.metadata,
  };
}
