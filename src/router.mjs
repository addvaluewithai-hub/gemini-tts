import {
  BALANCED_MODELS,
  LEGACY_MODELS,
  MODEL_REGISTRY,
  QUALITY_MODELS,
  SPEED_MODELS,
} from "./models.mjs";

export function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function rotate(values, offset) {
  if (!values.length) return [];
  const n = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(n), ...values.slice(0, n)];
}

export function collectGeminiKeys(env = process.env) {
  const candidates = [];
  if (env.GEMINI_API_KEY) candidates.push(["GEMINI_API_KEY", env.GEMINI_API_KEY]);
  for (let i = 1; i <= 20; i += 1) {
    const name = `GEMINI_API_KEY_${i}`;
    if (env[name]) candidates.push([name, env[name]]);
  }

  const seen = new Set();
  return candidates
    .filter(([, value]) => typeof value === "string" && value.trim())
    .filter(([, value]) => {
      const key = value.trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(([name, value], index) => ({ name, value: value.trim(), slot: index + 1 }));
}

function modelEligible(modelId, request) {
  const model = MODEL_REGISTRY[modelId];
  if (!model) return false;
  if (request.isMultiSpeaker && !model.supportsMultiSpeaker) return false;
  if (request.voice_requires_38 && model.generation !== "3.8") return false;
  if ((request.format === "mulaw" || request.format === "alaw") && !model.supportsTelephonyFormats) return false;
  return true;
}

function modelPreference(request) {
  if (request.routing === "explicit") return [request.model];
  if (request.routing === "quality") return QUALITY_MODELS;
  if (request.routing === "speed") return SPEED_MODELS;
  if (request.routing === "legacy") return LEGACY_MODELS;
  return BALANCED_MODELS;
}

export function buildAttemptPlan(request, keys, jobId) {
  if (!keys.length) throw new Error("No Gemini API keys configured");

  let models = modelPreference(request).filter((id) => modelEligible(id, request));
  if (!models.length) throw new Error("No configured model can satisfy this request");

  if (request.routing === "balanced" && models.length > 1) {
    models = rotate(models, hashString(`model:${jobId}`) % models.length);
  }

  if (request.routing === "explicit" && request.allow_model_fallback) {
    const fallback = BALANCED_MODELS.filter((id) => id !== request.model && modelEligible(id, request));
    models = [request.model, ...fallback];
  }

  const plan = [];
  for (const modelId of models) {
    const keyOrder = rotate(keys, hashString(`key:${jobId}:${modelId}`) % keys.length);
    for (const key of keyOrder) {
      plan.push({ modelId, key });
    }
  }
  return plan;
}

export function isRetryableStatus(status) {
  return status === 401 || status === 403 || status === 408 || status === 409 || status === 429 || status >= 500;
}
