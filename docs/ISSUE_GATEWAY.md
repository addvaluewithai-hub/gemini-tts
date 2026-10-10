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
