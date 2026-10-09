# Owner-gated Issue-to-TTS bridge

Issue requests now activate the **existing** asynchronous Gemini TTS factory without requiring a ChatGPT connector to expose repository_dispatch.

1. Prepare immutable job JSON from the curriculum's current canonical scene speech.
2. Create an open Issue **authored by** `addvaluewithai-hub` with its entire body as a `~~~json` fenced object.
3. Only the **owner** adds the `tts-run` label. This launches `.github/workflows/issue-tts.yml` on the factory's default branch. Merely creating an Issue or opening a PR cannot generate speech.
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

Safety: only issues created **and labeled** by account `addvaluewithai-hub` can trigger, and only in this repository. Public repositories expose Issue bodies and GitHub Actions logs. Avoid private scripts. Source job IDs must be unique, and claiming the Issue blocks blind repeat spending. If only some dispatches succeed, inspect matching factory job IDs and reconcile **before** a fresh, separately approved request. The worker runs asynchronously; retrieval and audio QA are separate.
