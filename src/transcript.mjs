import { GoogleGenAI } from "@google/genai";
import { rotate, hashString } from "./router.mjs";

export const TRANSCRIPT_SCHEMA_VERSION = 1;
export const TRANSCRIBE_MODEL = "gemini-3.5-transcribe";

export class TranscriptError extends Error {
  constructor(message, attempts = []) {
    super(message);
    this.name = "TranscriptError";
    this.attempts = attempts;
  }
}

export function parseOffsetMs(value) {
  if (value == null || value === "") throw new Error("Missing word offset");
  if (typeof value === "number") return Math.round(value * 1000);

  const text = String(value).trim().toLowerCase();
  if (text.endsWith("ms")) return Math.round(Number.parseFloat(text.slice(0, -2)));
  if (text.endsWith("s")) return Math.round(Number.parseFloat(text.slice(0, -1)) * 1000);

  const numeric = Number.parseFloat(text);
  if (!Number.isFinite(numeric)) throw new Error(`Invalid word offset: ${value}`);
  return Math.round(numeric * 1000);
}

export function extractWordAnnotations(interaction) {
  const words = [];
  for (const step of interaction?.steps ?? []) {
    for (const content of step?.content ?? []) {
      for (const annotation of content?.annotations ?? []) {
        if (annotation?.type !== "word_info") continue;
        const text = String(annotation.text ?? "").trim();
        if (!text) continue;

        let startMs;
        let endMs;
        try {
          startMs = Math.max(0, parseOffsetMs(annotation.start_offset));
          endMs = Math.max(startMs + 1, parseOffsetMs(annotation.end_offset));
        } catch {
          continue;
        }

        words.push({
          start_ms: startMs,
          end_ms: endMs,
          text,
          ...(annotation.speaker ? { speaker: String(annotation.speaker) } : {}),
        });
      }
    }
  }

  words.sort((a, b) => (a.start_ms - b.start_ms) || (a.end_ms - b.end_ms));
  return words;
}

export function cleanSourceText(text) {
  return String(text ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sourceTranscriptFromRequest(request) {
  const turns = request.turns
    .map((turn, index) => ({
      index,
      ...(turn.speaker ? { speaker: turn.speaker } : {}),
      text: cleanSourceText(turn.text),
    }))
    .filter((turn) => turn.text);

  return {
    text: turns.map((turn) => turn.text).join(" ").trim(),
    turns,
  };
}

function formatVttTime(ms) {
  const safe = Math.max(0, Math.round(ms));
  const hours = Math.floor(safe / 3_600_000);
  const minutes = Math.floor((safe % 3_600_000) / 60_000);
  const seconds = Math.floor((safe % 60_000) / 1000);
  const millis = safe % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

export function buildCaptionCues(words, { maxWords = 10, maxDurationMs = 4500 } = {}) {
  const cues = [];
  let current = [];

  const flush = () => {
    if (!current.length) return;
    cues.push({
      start_ms: current[0].start_ms,
      end_ms: current[current.length - 1].end_ms,
      speaker: current[0].speaker ?? null,
      text: current.map((word) => word.text).join(" "),
    });
    current = [];
  };

  for (const word of words) {
    if (!current.length) {
      current.push(word);
      continue;
    }

    const first = current[0];
    const speakerChanged = (first.speaker ?? null) !== (word.speaker ?? null);
    const tooManyWords = current.length >= maxWords;
    const tooLong = word.end_ms - first.start_ms > maxDurationMs;
    const longGap = word.start_ms - current[current.length - 1].end_ms > 900;

    if (speakerChanged || tooManyWords || tooLong || longGap) flush();
    current.push(word);
  }
  flush();
  return cues;
}

export function renderVtt(words) {
  const cues = buildCaptionCues(words);
  const lines = ["WEBVTT", ""];
  cues.forEach((cue, index) => {
    const speakerPrefix = cue.speaker ? `[${cue.speaker}] ` : "";
    lines.push(
      String(index + 1),
      `${formatVttTime(cue.start_ms)} --> ${formatVttTime(cue.end_ms)}`,
      `${speakerPrefix}${cue.text}`,
      "",
    );
  });
  return `${lines.join("\n")}\n`;
}

function errorStatus(error) {
  const candidates = [error?.status, error?.code, error?.statusCode];
  for (const candidate of candidates) {
    const number = Number(candidate);
    if (Number.isInteger(number) && number >= 100 && number <= 599) return number;
  }
  const match = String(error?.message ?? error ?? "").match(/\b([45]\d\d)\b/);
  return match ? Number(match[1]) : null;
}

function retryableTranscriptError(error) {
  const status = errorStatus(error);
  if (status == null) return true;
  return status === 401 || status === 403 || status === 408 || status === 409 || status === 429 || status >= 500;
}

function languageCodesFor(request) {
  return request.transcript?.language_codes ?? [];
}

export async function transcribeWithGemini({
  audioPath,
  mimeType,
  request,
  keys,
  jobId,
}) {
  if (!keys.length) throw new TranscriptError("No Gemini API keys configured for transcription");

  const keyOrder = rotate(keys, hashString(`transcript:${jobId}`) % keys.length);
  const attempts = [];

  for (const key of keyOrder) {
    const client = new GoogleGenAI({ apiKey: key.value });
    let uploaded = null;
    try {
      uploaded = await client.files.upload({
        file: audioPath,
        config: { mime_type: mimeType },
      });

      const mode = {
        type: "verbatim",
        timestamp_granularities: ["word"],
        ...(request.transcript.diarization ? { diarization_mode: "speaker" } : {}),
      };

      const interaction = await client.interactions.create({
        model: TRANSCRIBE_MODEL,
        input: [{
          type: "audio",
          uri: uploaded.uri,
          mime_type: uploaded.mimeType || uploaded.mime_type || mimeType,
        }],
        generation_config: {
          transcription_config: {
            language_codes: languageCodesFor(request),
            mode,
          },
        },
      });

      const words = extractWordAnnotations(interaction);
      if (!words.length) throw new Error("Gemini Transcribe returned no word_info annotations");

      const source = sourceTranscriptFromRequest(request);
      const durationMs = Math.max(...words.map((word) => word.end_ms));
      const transcript = {
        schema_version: TRANSCRIPT_SCHEMA_VERSION,
        type: "word_timestamps",
        alignment_mode: "whole_audio_gemini_transcribe",
        alignment_provider: "gemini",
        alignment_model: TRANSCRIBE_MODEL,
        generated_at: new Date().toISOString(),
        duration_ms: durationMs,
        word_count: words.length,
        diarization: Boolean(request.transcript.diarization),
        language_codes: languageCodesFor(request),
        recognized_text: String(interaction.output_text ?? "").trim(),
        source_text: source.text,
        source_turns: source.turns,
        words,
      };

      return {
        transcript,
        vtt: request.transcript.write_vtt ? renderVtt(words) : null,
        key_slot: key.slot,
        key_name: key.name,
        model: TRANSCRIBE_MODEL,
        attempts,
      };
    } catch (error) {
      const status = errorStatus(error);
      attempts.push({
        key_slot: key.slot,
        status,
        message: String(error?.message ?? error),
      });
      if (!retryableTranscriptError(error)) {
        throw new TranscriptError(`Transcript generation failed: ${error?.message ?? error}`, attempts);
      }
    } finally {
      if (uploaded?.name) {
        try {
          await client.files.delete({ name: uploaded.name });
        } catch {
          // Uploaded Gemini files expire automatically. Cleanup failure should not fail the job.
        }
      }
    }
  }

  throw new TranscriptError("All Gemini transcription key attempts were exhausted", attempts);
}
