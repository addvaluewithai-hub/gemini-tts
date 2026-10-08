# Agent Contract — Gemini TTS Factory

This file is the fastest safe path for an autonomous agent. Read this before constructing requests.

## Goal

Submit a TTS job and receive a complete delivery package:

- generated audio;
- word-level transcript JSON;
- WebVTT captions;
- Cloudinary URLs for all deliverables;
- routing metadata and retry information in `result.json`.

For the exhaustive field-by-field reference, read [`API.md`](API.md).

## Default behavior

If the caller does not specify otherwise:

- `voice`: `Kore`;
- `routing`: `balanced`;
- `format`: `wav`;
- `sample_rate`: `24000`;
- `temperature`: `1`;
- transcript generation: enabled;
- VTT generation: enabled;
- transcript diarization: disabled for single speaker, enabled for multi-speaker.

Do not disable transcript generation unless the caller explicitly does not need timing.

## Minimal valid request

```json
{
  "text": "Hello from the Gemini TTS factory."
}
```

## Recommended production request

```json
{
  "text": "Good morning! <short pause> I hope you have a great day.",
  "style": "Warm, natural, confident delivery with medium pacing.",
  "voice": "Kore",
  "routing": "quality",
  "format": "wav",
  "temperature": 1,
  "transcript": {
    "language_codes": ["en-US"],
    "write_vtt": true
  },
  "metadata": {
    "purpose": "narration"
  }
}
```

## Multi-speaker request

Exactly two speakers are supported in one request.

```json
{
  "turns": [
    {
      "speaker": "Host",
      "text": "صباح الخير يا جماعة!",
      "style": "Energetic Egyptian Arabic host."
    },
    {
      "speaker": "Guest",
      "text": "<chuckles> صباح النور، يلا بينا.",
      "style": "Relaxed and friendly."
    }
  ],
  "speakers": {
    "Host": "Puck",
    "Guest": "Kore"
  },
  "routing": "quality",
  "format": "wav",
  "transcript": {
    "language_codes": ["ar-EG"],
    "write_vtt": true
  }
}
```

## Voice decision tree

### 1. Caller gives a voice

Use it exactly. Do not rename or substitute it unless the API rejects it and the caller has allowed fallback behavior.

### 2. Caller gives no voice

Use `Kore` unless the requested persona strongly suggests another curated studio voice.

### 3. Caller asks for a personality

Choose from the curated studio catalog:

```text
Zephyr          Bright
Puck            Upbeat
Charon          Informative
Kore            Firm
Fenrir          Excitable
Leda            Youthful
Orus            Firm
Aoede           Breezy
Callirrhoe      Easy-going
Autonoe         Bright
Enceladus       Breathy
Iapetus         Clear
Umbriel         Easy-going
Algieba         Smooth
Despina         Smooth
Erinome         Clear
Algenib         Gravelly
Rasalgethi      Informative
Laomedeia       Upbeat
Achernar        Soft
Alnilam         Firm
Schedar         Even
Gacrux          Mature
Pulcherrima     Forward
Achird          Friendly
Zubenelgenubi   Casual
Vindemiatrix    Gentle
Sadachbia       Lively
Sadaltager      Knowledgeable
Sulafat         Warm
```

### 4. Caller asks for a specific accent, language, region, or broader catalog

Query the live Gemini Voices API through the factory CLI rather than guessing:

```bash
node src/cli.mjs --list-voices --voice-language ar-EG
node src/cli.mjs --list-voices --voice-search Egyptian
node src/cli.mjs --list-voices --voice-persona Narrator
node src/cli.mjs --list-voices --voice-type prebuilt --voice-limit 200
```

Use the returned `id` as the request's `voice`.

To print only the 30 curated names without credentials:

```bash
node src/cli.mjs --studio-voices
```

Never invent a voice ID.

## Voice compatibility

Curated studio voices can participate in the normal model fallback pool.

Extended Voice Library IDs and custom voices (`voice_...`, `voicekey_...`) are automatically restricted to Gemini 3.8 models by the router.

Single-speaker Gemini 3.8 supports:

- curated studio voices;
- Extended Voice Library IDs;
- persistent custom designed/replicated IDs (`voice_...`);
- stateless replicated keys (`voicekey_...`).

Single-request multi-speaker mode supports exactly two prebuilt voices. Do not use `voice_...` or `voicekey_...` in that mode.

## Model decision tree

Use `routing: "quality"` for studio narration, difficult pronunciation, dialect-heavy work, expressive acting, and important final output.

Use `routing: "speed"` for bulk generation or lower-latency jobs.

Use `routing: "balanced"` when the caller has no preference.

Use `routing: "explicit"` only when the caller explicitly requests a model or deterministic model choice is required:

```json
{
  "text": "Hello",
  "routing": "explicit",
  "model": "gemini-3.8-flash-tts",
  "allow_model_fallback": false
}
```

Do not choose `legacy` for new production work unless compatibility testing is the purpose.

## Transcript rules

Transcript timing is derived from the rendered audio, not estimated from the source text.

The transcript deliverable contains:

```json
{
  "words": [
    {
      "start_ms": 120,
      "end_ms": 430,
      "text": "Hello"
    }
  ]
}
```

For multi-speaker jobs, word entries may also contain `speaker`.

Use `source_text` when you need the intended script. Use `recognized_text` and `words[]` when you need what was actually heard in the rendered audio.

Inline event tags such as `<short pause>`, `<laugh>`, and `<sigh>` are excluded from `source_text` and do not appear as lexical words.

## Style rules

For Gemini 3.8, `text` is the verbatim transcript. Put sustained delivery instructions in `style`.

Correct:

```json
{
  "text": "The refund has already been approved.",
  "style": "Calm, reassuring support agent."
}
```

Avoid putting prose directions such as "Say cheerfully:" into the transcript because the TTS model may speak them.

Momentary vocal events belong inline:

```text
<laugh>
<chuckles>
<sigh>
<cough>
<breath>
<short pause>
<long pause>
```

## Triggering a job

The repository exposes an asynchronous `repository_dispatch` contract:

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/addvaluewithai-hub/gemini-tts/dispatches \
  -d '{
    "event_type": "tts.generate",
    "client_payload": {
      "job_id": "demo-001",
      "request": {
        "text": "Hello from the TTS factory.",
        "voice": "Kore",
        "routing": "quality",
        "format": "wav"
      }
    }
  }'
```

A dispatch is asynchronous. Do not expect the HTTP dispatch response itself to contain the final audio.

## Successful delivery contract

Expect `result.json` to contain:

```json
{
  "id": "demo-001",
  "status": "completed",
  "model": "gemini-3.8-flash-tts",
  "key_slot": 3,
  "audio_url": "https://res.cloudinary.com/.../demo-001.wav",
  "transcript_url": "https://res.cloudinary.com/.../demo-001.transcript.json",
  "vtt_url": "https://res.cloudinary.com/.../demo-001.transcript.vtt",
  "transcript": {
    "status": "completed",
    "model": "gemini-3.5-transcribe",
    "word_count": 83,
    "duration_ms": 7420
  }
}
```

Treat the job as incomplete if transcript generation was requested but the transcript deliverable failed.

## Important constraints

- GitHub Actions is asynchronous and is not a real-time streaming API.
- One-request multi-speaker synthesis is limited to exactly two speakers.
- Do not expose Gemini, GitHub, or Cloudinary secrets in requests, logs, output, or client-side code.
- Public repository Actions logs may be visible. Do not send highly sensitive transcripts without reviewing that exposure model.
- Reusing the same `job_id` overwrites deterministic Cloudinary assets.
- Multiple API keys only represent independent quota when their underlying Google project quotas are independent.
- If a voice is unfamiliar, discover it; do not guess.
- If a request uses an Extended Library/custom voice, keep it on Gemini 3.8.
- For complete validation rules and output formats, read [`API.md`](API.md).
