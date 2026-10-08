export const STUDIO_VOICES = Object.freeze([
  { id: "Zephyr", character: "Bright" },
  { id: "Puck", character: "Upbeat" },
  { id: "Charon", character: "Informative" },
  { id: "Kore", character: "Firm" },
  { id: "Fenrir", character: "Excitable" },
  { id: "Leda", character: "Youthful" },
  { id: "Orus", character: "Firm" },
  { id: "Aoede", character: "Breezy" },
  { id: "Callirrhoe", character: "Easy-going" },
  { id: "Autonoe", character: "Bright" },
  { id: "Enceladus", character: "Breathy" },
  { id: "Iapetus", character: "Clear" },
  { id: "Umbriel", character: "Easy-going" },
  { id: "Algieba", character: "Smooth" },
  { id: "Despina", character: "Smooth" },
  { id: "Erinome", character: "Clear" },
  { id: "Algenib", character: "Gravelly" },
  { id: "Rasalgethi", character: "Informative" },
  { id: "Laomedeia", character: "Upbeat" },
  { id: "Achernar", character: "Soft" },
  { id: "Alnilam", character: "Firm" },
  { id: "Schedar", character: "Even" },
  { id: "Gacrux", character: "Mature" },
  { id: "Pulcherrima", character: "Forward" },
  { id: "Achird", character: "Friendly" },
  { id: "Zubenelgenubi", character: "Casual" },
  { id: "Vindemiatrix", character: "Gentle" },
  { id: "Sadachbia", character: "Lively" },
  { id: "Sadaltager", character: "Knowledgeable" },
  { id: "Sulafat", character: "Warm" },
]);

const STUDIO_VOICE_SET = new Set(STUDIO_VOICES.map((voice) => voice.id.toLowerCase()));

export function isStudioVoice(voiceId) {
  return typeof voiceId === "string" && STUDIO_VOICE_SET.has(voiceId.trim().toLowerCase());
}

export function voiceRequires38(voiceId) {
  return !isStudioVoice(voiceId);
}

function appendMany(params, name, value) {
  if (value == null) return;
  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    const text = String(item).trim();
    if (text) params.append(name, text);
  }
}

function normalizeVoice(raw) {
  return {
    id: raw?.id ?? null,
    display_name: raw?.display_name ?? raw?.displayName ?? null,
    type: raw?.type ?? null,
    language_code: raw?.language_code ?? raw?.languageCode ?? null,
    accent: raw?.accent ?? null,
    region_code: raw?.region_code ?? raw?.regionCode ?? null,
    gender: raw?.gender ?? null,
    pitch: raw?.pitch ?? null,
    persona: raw?.persona ?? null,
    context: raw?.context ?? null,
    description: raw?.description ?? null,
    expire_time: raw?.expire_time ?? raw?.expireTime ?? null,
    model: raw?.model ?? null,
  };
}

export async function listGeminiVoices({
  apiKey,
  pageSize = 200,
  maxVoices = 500,
  pageToken,
  search,
  languageCode,
  accent,
  context,
  gender,
  persona,
  pitch,
  regionCode,
  type,
} = {}) {
  if (!apiKey) throw new Error("apiKey is required to list Gemini voices");

  const safePageSize = Math.max(1, Math.min(1000, Number(pageSize) || 200));
  const safeMax = Math.max(1, Math.min(5000, Number(maxVoices) || 500));
  const voices = [];
  let token = pageToken || null;

  do {
    const params = new URLSearchParams();
    params.set("page_size", String(Math.min(safePageSize, safeMax - voices.length)));
    if (token) params.set("page_token", token);
    if (search) params.set("search", String(search));

    appendMany(params, "language_code", languageCode);
    appendMany(params, "accent", accent);
    appendMany(params, "context", context);
    appendMany(params, "gender", gender);
    appendMany(params, "persona", persona);
    appendMany(params, "pitch", pitch);
    appendMany(params, "region_code", regionCode);
    appendMany(params, "type", type);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/voices?${params.toString()}`,
      { headers: { "x-goog-api-key": apiKey } },
    );

    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(payload?.error?.message || `Gemini Voices API HTTP ${response.status}`);
    }

    for (const voice of payload?.voices ?? []) {
      if (voices.length >= safeMax) break;
      voices.push(normalizeVoice(voice));
    }

    token = payload?.next_page_token ?? payload?.nextPageToken ?? null;
  } while (token && voices.length < safeMax);

  return {
    count: voices.length,
    voices,
    next_page_token: token,
  };
}
