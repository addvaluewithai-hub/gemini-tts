# Gemini TTS Factory — API & Operations Guide

This repository is an **asynchronous TTS factory**. GitHub Actions is the worker/control plane, Gemini generates the speech, and Cloudinary is the durable output store. A caller submits a JSON request, receives/chooses a stable `job_id`, and the worker uploads the generated audio to Cloudinary.

The implementation deliberately keeps the external request format stable even when Google changes model-specific request schemas.

## 1. What this factory does

The worker:

1. validates a compact TTS request;
2. chooses an eligible TTS model according to the routing policy;
3. selects a Gemini API key using deterministic distribution based on `job_id`;
4. retries other eligible key/model combinations on quota, auth, timeout, or transient server errors;
5. normalizes the generated audio;
6. uploads the result to Cloudinary under `gemini-tts/<job_id>`;
7. writes `result.json` and also stores the result/audio as a short-lived GitHub Actions artifact.

This is intentionally asynchronous. GitHub Actions is not a low-latency HTTP server.

## 2. Required repository secrets

Gemini key pool:

```text
GEMINI_API_KEY_1
GEMINI_API_KEY_2
GEMINI_API_KEY_3
GEMINI_API_KEY_4
GEMINI_API_KEY_5
```

The code accepts up to `GEMINI_API_KEY_20`, so the pool can grow without changing source code.

### Cloudinary

**Recommended:** create one GitHub secret named `CLOUDINARY_URL` containing the complete backend environment value copied from Cloudinary:

```text
cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

For compatibility, `CLOUDINARY_API_TOKEN` is also accepted **only when its value is that same complete `cloudinary://...` string**.

Alternatively, set all three:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

A plain OAuth/API token by itself is not enough for this Upload API implementation. The server-side Cloudinary Upload API needs the cloud name plus API key/secret (or an equivalent complete `CLOUDINARY_URL`). Never commit these values.

## 3. Quota note: keys are not automatically separate quota

The router can use many keys, but **multiple API keys from one Google project normally share the same project quota**. Real quota multiplication requires independently allocated project quota. The pool should be viewed as routing/failover across authorized projects, not a way to bypass limits on one project.

The worker never prints the key values. Result metadata exposes only a numeric `key_slot`.

## 4. Supported model IDs

The current factory knows these models:

| Model | Factory role | Multi-speaker | Advanced output formats |
|---|---|---:|---:|
| `gemini-3.8-flash-tts` | highest fidelity | yes | yes |
| `gemini-3.8-flash-lite-tts` | fast / efficient | yes | yes |
| `gemini-3.1-flash-tts-preview` | legacy fallback | no in this factory | WAV/L16 path only |
| `gemini-2.5-flash-preview-tts` | legacy fallback | no in this factory | WAV/L16 path only |

The conservative legacy restrictions are intentional. They keep a single stable API contract while newer 3.8 requests use structured `speech_metadata`, audio output format controls, and multi-speaker configuration.

## 5. Request schema

### Single speaker

```json
{
  "text": "Good morning! <short pause> How are you?",
  "style": "Warm, bright, friendly, crisp pacing.",
  "voice": "Kore",
  "routing": "quality",
  "format": "wav",
  "sample_rate": 24000,
  "temperature": 1,
  "allow_model_fallback": true,
  "metadata": {
    "customer_job": "demo-001"
  }
}
```

### Multi-speaker

```json
{
  "turns": [
    {
      "speaker": "Host",
      "text": "صباح الخير يا جماعة! <short pause> جاهزين نبدأ؟",
      "style": "Energetic Egyptian Arabic radio host."
    },
    {
      "speaker": "Guest",
      "text": "<chuckles> صباح النور، يلا بينا.",
      "style": "Relaxed Egyptian Arabic, friendly and natural."
    }
  ],
  "speakers": {
    "Host": "Puck",
    "Guest": "Kore"
  },
  "routing": "quality",
  "format": "wav",
  "temperature": 1
}
```

### Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `text` | string | — | Simple single-speaker transcript. Use either `text` or `turns`. |
| `turns` | array | — | Structured turns. Up to 50. |
| `turns[].text` | string | required | Verbatim transcript. |
| `turns[].style` | string | optional | Sustained delivery direction for that turn. |
| `turns[].speaker` | string | required for multi-speaker | Must match a key in `speakers`. |
| `turns[].voice` | string | optional | Per-speaker shortcut; overrides the matching `speakers` mapping. |
| `style` | string | optional | Single-speaker style. |
| `voice` | string | `Kore` | Prebuilt name, or supported custom voice ID for single speaker. |
| `speakers` | object | `{}` | Maps exactly two speaker labels to prebuilt voice names in multi-speaker mode. |
| `routing` | enum | `balanced` | `balanced`, `quality`, `speed`, `legacy`, or `explicit`. |
| `model` | string | — | Required only for `routing: "explicit"`. |
| `allow_model_fallback` | boolean | `true` | For explicit mode, whether other eligible models may be tried after transient/quota errors. |
| `format` | enum | `wav` | `wav`, `l16`, `mulaw`, `alaw`. |
| `sample_rate` | number | 24000 / 8000 | Defaults to 8000 for μ-law/A-law, otherwise 24000. |
| `temperature` | number | `1` | Range `0..2`. |
| `metadata` | object | `{}` | Passed through to `result.json`; never sent to Gemini. |

## 6. Speech control

For Gemini 3.8, transcript text is treated as text to be spoken. Put sustained acting instructions in `style`, not in the transcript.

Useful point-in-time vocal tags inside `text` include:

```text
<laugh>
<chuckles>
<sigh>
<cough>
<breath>
<short pause>
<long pause>
```

Example:

```json
{
  "text": "I checked the refund. <short pause> <chuckles> Good news — it is already approved.",
  "style": "Calm support agent, reassuring, natural pacing."
}
```

Punctuation still matters. Commas, em-dashes, and ellipses can shape pacing naturally.

## 7. Routing modes

### `balanced` — default

Designed to distribute jobs across the currently eligible model pool. The starting model is deterministically rotated from `job_id`, so repeated workers do not need shared routing state.

For a simple WAV single-speaker job, the pool is:

```text
gemini-3.8-flash-lite-tts
gemini-3.8-flash-tts
gemini-3.1-flash-tts-preview
gemini-2.5-flash-preview-tts
```

For multi-speaker or telephony-format requests, incompatible legacy models are automatically removed.

### `quality`

Preference order:

```text
3.8 Flash -> 3.8 Flash-Lite -> legacy fallbacks
```

### `speed`

Preference order:

```text
3.8 Flash-Lite -> 3.8 Flash -> legacy fallbacks
```

### `legacy`

Uses only 3.1 then 2.5. Intended for compatibility/testing.

### `explicit`

```json
{
  "text": "Hello",
  "routing": "explicit",
  "model": "gemini-3.8-flash-tts",
  "allow_model_fallback": false
}
```

## 8. Key selection and retries

The worker builds a model/key attempt plan from the `job_id`. For each model, it rotates the key pool deterministically.

It retries/falls back on:

- `401` / `403` — bad or unauthorized key/project;
- `408` — timeout;
- `409`;
- `429` — quota/rate limit;
- `5xx` — transient Gemini server errors.

A non-retryable request error such as a normal `400` stops immediately because another key would not repair malformed input.

This design is stateless across GitHub runners and avoids race-prone "current key index" files.

## 9. Trigger from GitHub UI

Open:

```text
Actions -> Gemini TTS Factory -> Run workflow
```

Provide:

- `job_id`: e.g. `invoice-demo-001`
- `request_json`: JSON using the schema above

The workflow summary will contain `result.json`. The audio is uploaded to Cloudinary and also retained as a GitHub Actions artifact for 3 days.

## 10. Trigger as an API using `repository_dispatch`

This is the cleanest automation interface when GitHub Actions is the worker.

Your caller needs a GitHub token that is allowed to dispatch repository events for this repository.

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
        "style": "Warm and friendly.",
        "voice": "Kore",
        "routing": "balanced",
        "format": "wav"
      }
    }
  }'
```

GitHub accepts the dispatch asynchronously. The worker then generates and uploads the result.

Do **not** embed a GitHub token in browser-side JavaScript. Call the dispatch endpoint from a trusted backend/automation environment.

## 11. Local worker usage

With secrets exported locally:

```bash
node src/cli.mjs \
  --file examples/single-speaker.json \
  --job-id local-demo \
  --result result.json
```

To test generation without Cloudinary:

```bash
node src/cli.mjs \
  --file examples/single-speaker.json \
  --job-id local-demo \
  --no-upload
```

Validate secrets without making a Gemini request:

```bash
node src/cli.mjs --check-config
```

Run unit tests:

```bash
npm test
```

## 12. Output

Successful `result.json` resembles:

```json
{
  "id": "demo-001",
  "status": "completed",
  "created_at": "2026-10-07T19:30:00.000Z",
  "model": "gemini-3.8-flash-tts",
  "routing": "quality",
  "key_slot": 3,
  "format": "wav",
  "mime_type": "audio/wav",
  "sample_rate": 24000,
  "bytes": 183240,
  "audio_url": "https://res.cloudinary.com/.../video/upload/.../gemini-tts/demo-001.wav",
  "cloudinary": {
    "secure_url": "https://res.cloudinary.com/.../demo-001.wav",
    "public_id": "gemini-tts/demo-001",
    "resource_type": "video",
    "bytes": 183240,
    "format": "wav"
  },
  "local_file": "out/demo-001.wav",
  "attempts_before_success": 0,
  "failed_attempts": [],
  "metadata": {}
}
```

The public Cloudinary ID is deterministic:

```text
gemini-tts/<job_id>
```

Using the same `job_id` overwrites that asset. Use unique job IDs if every generation should be preserved.

## 13. Audio formats

- `wav`: normal WAV file; best default for playback/download.
- `l16`: headerless signed 16-bit linear PCM.
- `mulaw`: G.711 μ-law; typically useful for telephony.
- `alaw`: G.711 A-law; typically useful for telephony.

For old preview models, the provider may return headerless PCM. When the requested public format is WAV, the factory detects that and adds a standard mono 16-bit WAV header.

## 14. Cloudinary behavior

WAV output is uploaded as Cloudinary `video` resource type because Cloudinary handles audio media under the video/audio pipeline. Headerless/telephony formats are stored as `raw`.

The worker uses authenticated server-side upload. Nothing in this repository requires exposing the Cloudinary API secret to users.

## 15. Public repository safety

The repository may be public, but secrets must stay in GitHub Actions Secrets.

Also remember that **public GitHub Actions logs and summaries can be public**. This workflow does not intentionally echo the transcript, but do not use a public repository workflow for highly sensitive/private text unless you have reviewed the exposure model you need.

The generated Cloudinary asset is public by default in this implementation. If private delivery is required, change the upload storage policy before sending sensitive content.

## 16. Current limitations

- GitHub Actions is asynchronous; it is not suitable for live voice-agent latency.
- Multi-speaker generation is intentionally limited to Gemini 3.8 and exactly two prebuilt voices in one request.
- Custom/replicated `voice_...` / `voicekey_...` IDs are supported only for single-speaker requests in this factory.
- A dispatch request does not directly return the completed audio URL. Read the workflow summary/artifact, or add a thin HTTP gateway later if you need `POST /v1/tts -> 202 + status URL`.
- The router does not persist daily quota counters. It learns quota exhaustion from Gemini responses and falls back during the current job.

## 17. Recommended next layer

If you need a conventional external API, keep this repository as the worker and put a tiny trusted gateway in front of it:

```text
POST /v1/tts
  -> validate request
  -> create job_id
  -> GitHub repository_dispatch
  -> return HTTP 202 with job_id

GET /v1/tts/:job_id
  -> check the deterministic Cloudinary asset / job state
  -> return queued/completed + audio_url
```

That preserves the cheap GitHub Actions worker model without pretending a workflow runner is a synchronous web server.
