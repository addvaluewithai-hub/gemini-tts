# Owner-gated Issue-to-TTS bridge

Issue requests now activate the **existing** asynchronous Gemini TTS factory without requiring a ChatGPT connector to expose repository_dispatch.

1. Prepare immutable job JSON from the curriculum's current canonical scene speech.
2. Create an open Issue **authored by** `addvaluewithai-hub` with its entire body as a `~~~json` fenced object.
3. Creating the Issue as **owner** launches the gateway directly. An owner-applied `tts-run` label is an optional retrigger, subject to the one-time claim. This launches `.github/workflows/issue-tts.yml` on the factory's default branch. Opening a PR cannot generate speech; an owner-created Issue with `mode: produce` can generate speech **only with explicit owner-approved scope**.
4. Dry-run mode performs source checks with **zero** dispatch. Production mode writes an idempotency **claim comment** first, then dispatches at most five validated jobs via the unchanged `tts.generate` factory handler. Each accepted dispatch is recorded with its exact job ID.
5. The actual factory's existing workflow independently generates WAV, transcript JSON and VTT and uploads deliverables to Cloudinary/GitHub Actions artifacts. **Accepted dispatch != delivered audio or listening approval.**

Example Issue body (replace pinned commit and paths):

~~~json
{
  "schemaVersion": 1,
  "command": "tts.issue.batch",
  "mode": "dry-run",
  "sourceRepo": "addvaluewithai-hub/learn-curriculums",
  "sourceCommit": "40HEXCOMMITGOESHERE",
  "jobs": [
    {
      "path": "curricula/C/lessons/L/jobs/job-id.json",
      "sceneId": "S02"
    }
  ]
}
~~~

Set `mode` to `produce` **only after the owner explicitly authorizes paid production**, on a **new Issue**; do not relabel an already claimed Issue. The job file and scene are fetched from one pinned immutable **40-character commit SHA**. The gateway checks exact spoken text, SHA-256, clip/lesson IDs, allowed path, voice Gacrux, quality routing, WAV 24 kHz and bilingual transcript defaults. It never runs untrusted code, and the control-plane workflow is not given Gemini or Cloudinary secrets.

Safety: only issues created **and opened/labeled** by account `addvaluewithai-hub` can trigger, and only in this repository. Public repositories expose Issue bodies and GitHub Actions logs. Avoid private scripts. Source job IDs must be unique, and claiming the Issue blocks blind repeat spending. If only some dispatches succeed, inspect matching factory job IDs and reconcile **before** a fresh, separately approved request. The worker runs asynchronously; retrieval and audio QA are separate.

## Canonical B01 remaining-audio batch (small, issue-pinned scene ranges)

To produce B01's remaining 64 canonical clips without hand-writing 64 TTS jobs, use
`tts.issue.scene-range`. Restriction: **only the three issued B01 lesson IDs**, and
**1–5 scene positions per Issue**. The gateway reads the pinned `lesson.json`,
fetches its exact selected `scenes/Sxx.json`, and produces each narration plus
its separate post-attempt feedback (if present), **maximum 8 TTS clips per Issue**.

The existing five completed pilot clips are **always excluded**, determined by the
gateway's approved allowlist: Foundations N02, Newton N09/N13/F02, Units N12.
Unique factory job IDs include the canonical SHA-256 and Issue number to avoid
overwriting previously delivered Cloudinary assets.

~~~json
{
  "schemaVersion": 1,
  "command": "tts.issue.scene-range",
  "mode": "dry-run",
  "sourceRepo": "addvaluewithai-hub/learn-curriculums",
  "sourceCommit": "EXACT_40_HEX_PINNED_SOURCE_COMMIT",
  "courseId": "engineering-mechanics-statics-y1",
  "lessonId": "ems-y1-foundations-models",
  "startScene": 1,
  "endScene": 5
}
~~~

A cost-free `dry-run` smoke test precedes a new `produce` Issue; user must explicitly
authorize bulk audio separately from the pilot. All requests use the unchanged
Gacrux/quality WAV 24kHz style, verbatim canonical clip scripts, and automatic
bilingual word transcript + VTT. Claims are idempotent per Issue and accepted jobs
are individually recorded. Audio quality, listening, academic approval and timed
preview are *not* implied by successful generation.

## Zephyr issue-driven original multi-clip pilot (Mathematics I ONLY)

The new `tts.issue.audio-batch` command accepts **ONE** previously saved, pinned `tts.generate` job bundling up to **8 original clips** and **200 total original words**. Factory settings must be **Zephyr**, the identical warm/calm Egyptian tutor style, explicit **gemini-3.8-flash-tts** without fallback, 24-kHz WAV and bilingual word transcript/VTT. Historical Gacrux per-clip / Statics scene-range commands remain unchanged.

Open an owner-authored GitHub Issue on `addvaluewithai-hub/gemini-tts` with ONLY this `~~~json` fenced object, substituting the actual 40-character source commit:

~~~json
{
  "schemaVersion": 1,
  "command": "tts.issue.audio-batch",
  "mode": "dry-run",
  "sourceRepo": "addvaluewithai-hub/learn-curriculums",
  "sourceCommit": "PINNED_40_HEX_SOURCE_COMMIT",
  "job": "curricula/engineering-math-1/batches/jobs/batch-zephyr-em1-pilot01-20261011-a63f27c1.json",
  "clips": [
    {"lessonId":"em1-prelim-absolute-value","sceneId":"S02","clipId":"N02"},
    {"lessonId":"em1-limits-trigonometric","sceneId":"S05","clipId":"N05"},
    {"lessonId":"em1-limits-trigonometric","sceneId":"S05","clipId":"F01"}
  ]
}
~~~

The gateway independently fetches the pinned job, issued lesson and scene JSON for each item, and rejects changed original scripts/roles/hashes, wrong order, altered batch text, invalid style/model/voice and excessive words. **Dry-run** validates with zero paid dispatch. Once it passes and this code has been deployed to the factory's **default branch**, a NEW owner-created Issue with the same job, source commit, clip references and `mode: "produce"` sends exactly **ONE paid factory request** for the previously approved Zephyr pilot. Issue claim comments guard against accidental resends; accepted is not delivered audio.

After real WAV/transcript delivery, actually listen to Egyptian Arabic, English, numbers and math signs, inspect quiet cuts, and stage source-clip slices before importing. A gateway success is NOT listening, timing, academic or device-playback approval. This pilot gate intentionally does not authorize mass batch dispatch or other voices.

## Full Mathematics I Zephyr production (216 remaining clips; 54 requests in 11 Issues)

The separate `tts.issue.math-bulk` command is the **explicitly owner-approved**
source-pinned follow-up to the successful three-clip Zephyr pilot. It reads
one of 11 immutable, pre-audited group manifests under
`curricula/engineering-math-1/batches/campaigns/zephyr-remaining-20261011/`.
Each owner-created Issue dispatches **up to FIVE distinct factory requests**,
each containing only original canonical teaching/question/feedback clips,
never more than **200 original source words / 120 planning seconds**.

~~~json
{
  "schemaVersion": 1,
  "command": "tts.issue.math-bulk",
  "mode": "dry-run",
  "sourceRepo": "addvaluewithai-hub/learn-curriculums",
  "sourceCommit": "f6e5a5c9d5180228eb5762fa433cf45a4e4b4933",
  "group": "curricula/engineering-math-1/batches/campaigns/zephyr-remaining-20261011/group-01.json"
}
~~~

After a passing no-cost dry-run, create a NEW separate Issue with `mode: "produce"`
for **each group 01..11**, reusing the exact pinned source commit and group path.
Never relabel or reopen a claimed production Issue: inspect its issue comments
and factory job IDs and reconcile any partial dispatches before trying again.
Group issues should be admitted in manageable waves to avoid key concurrency.

The compiler independently fetches each original lesson/scene under the pinned
source SHA, recomputes original word counts and SHA-256 for each source clip,
checks role, uniqueness, full combined text, voice `Zephyr`, identical calm
Egyptian tutor style, explicit `gemini-3.8-flash-tts`, WAV 24 kHz, and
Gemini transcribe JSON/VTT. Previously generated pilot clip IDs
`em1-prelim-absolute-value/N02`, `em1-limits-trigonometric/N05`, and
`em1-limits-trigonometric/F01` are **explicitly refused** for re-synthesis.
All job IDs are deterministically tied to group/batch and the full text SHA.

The existing Gacrux and initial Zephyr pilot commands are unaffected. Passing
factory synthesis is not actual listened or split student audio acceptance.
