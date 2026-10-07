# Gemini TTS Factory

A small asynchronous TTS factory built around Gemini TTS, GitHub Actions, key/model routing, and Cloudinary delivery.

The public README stays intentionally short. **Start here: [`docs/API.md`](docs/API.md)** — it contains the request schema, supported parameters, model routing, GitHub dispatch examples, Cloudinary setup, response format, limits, and troubleshooting.

> Important: multiple Gemini API keys only provide independent quota when the underlying Google projects/quotas are independent. Keys from the same project normally share that project's quota.
