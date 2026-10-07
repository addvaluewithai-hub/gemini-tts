import { formatInfo, isWav, wrapPcm16MonoAsWav } from "../audio.mjs";
import { MODEL_REGISTRY } from "../models.mjs";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export class GeminiHttpError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = "GeminiHttpError";
    this.status = status;
    this.payload = payload;
  }
}

function compactObject(value) {
  if (Array.isArray(value)) return value.map(compactObject);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, compactObject(v)]),
  );
}

function build38Body(request) {
  const parts = request.turns.map((turn) => ({
    text: turn.text,
    speech_metadata: compactObject({
      speaker: request.isMultiSpeaker ? turn.speaker : undefined,
      style: turn.style,
    }),
  }));

  const speechConfig = request.isMultiSpeaker
    ? {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: Object.entries(request.speakers).map(([speaker, voice]) => ({
            speaker,
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          })),
        },
      }
    : {
        voiceConfig: { voice: request.voice },
      };

  return compactObject({
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      temperature: request.temperature,
      responseFormat: {
        audio: {
          mimeType: formatInfo(request.format).gemini,
          sampleRate: request.sample_rate,
        },
      },
      speechConfig,
    },
  });
}

function buildLegacyBody(request) {
  const turn = request.turns[0];
  const prompt = turn.style
    ? `Read the following transcript using this delivery style: ${turn.style}\n\nTranscript:\n${turn.text}`
    : turn.text;

  return {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      temperature: request.temperature,
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: request.voice },
        },
      },
    },
  };
}

function findAudioPart(payload) {
  for (const candidate of payload?.candidates ?? []) {
    for (const part of candidate?.content?.parts ?? []) {
      if (part?.inlineData?.data) return part.inlineData;
      if (part?.inline_data?.data) return part.inline_data;
    }
  }
  return null;
}

export async function generateWithGemini({ apiKey, modelId, request, timeoutMs = 120000 }) {
  const model = MODEL_REGISTRY[modelId];
  if (!model) throw new Error(`Unknown Gemini model: ${modelId}`);

  const body = model.generation === "3.8" ? build38Body(request) : buildLegacyBody(request);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${BASE_URL}/${encodeURIComponent(modelId)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new GeminiHttpError(408, `Gemini request timed out after ${timeoutMs}ms`, null);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini HTTP ${response.status}`;
    throw new GeminiHttpError(response.status, message, payload);
  }

  const inline = findAudioPart(payload);
  if (!inline?.data) {
    throw new GeminiHttpError(502, "Gemini returned no audio bytes", payload);
  }

  let audio = Buffer.from(inline.data, "base64");
  if (!audio.length) throw new GeminiHttpError(502, "Gemini returned an empty audio payload", payload);

  if (request.format === "wav" && !isWav(audio)) {
    audio = wrapPcm16MonoAsWav(audio, request.sample_rate);
  }

  return {
    audio,
    mime_type: formatInfo(request.format).mime,
    extension: formatInfo(request.format).extension,
    model: modelId,
    provider_mime_type: inline.mimeType || inline.mime_type || null,
  };
}
