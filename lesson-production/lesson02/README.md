# Learn lesson 02 — isolated Gacrux TTS run

This draft PR contains the 13 unchanged spoken scripts for the Learn phase-changes lesson, as individual `tts.generate` payloads, and one branch-scoped GitHub Actions workflow.

- Course: `chemistry-gas-laws`.
- Runtime lesson: `chem-gas-phase-changes`.
- Script revision: `lesson02-script-v2-review-2026-10-08`.
- Source review: curriculum notes; original source PDF not present. Scripts are still editorial drafts.
- This is a **one-time production attempt**: workflow triggers only on the creation/change of `START_ONCE.md` on branch `experiment/learn-lesson02-audio-20261008`. PR events and unrelated commits do not trigger another take.
- Validated factory secrets stay in GitHub Actions; the runner uses the existing `src/cli.mjs` and Cloudinary storage, not a new endpoint.
- Preflight checks tests and secret configuration; generation is limited to two concurrent jobs. Each clip has a unique immutable take job ID.
- Per-clip `tts-lesson02-<CLIP>` artifacts contain WAV, transcript JSON/VTT and result JSON (3-day GitHub retention). The long-term destination is the versioned Cloudinary URLs returned in `result.json`.
- The transcribe model timestamps recognized words in the **actual output audio**; verify script fidelity, duration, pronunciation, terms, negation and source facts before using cues.
- Completion here does not mean authorized lesson package, Remotion preview, or student publication; no Learn engine changes and no main merge.
- Never rerun completed clip with the same ID. Retakes require new job IDs and cue/hash versions.

Please leave this PR **draft/unmerged**: its workflow is a one-off delivery mechanism.
