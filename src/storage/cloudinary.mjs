function parseCloudinaryUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  if (!raw.startsWith("cloudinary://")) return null;

  const url = new URL(raw);
  const apiKey = decodeURIComponent(url.username);
  const apiSecret = decodeURIComponent(url.password);
  const cloudName = url.hostname;
  if (!apiKey || !apiSecret || !cloudName) return null;
  return { cloudName, apiKey, apiSecret };
}

export function getCloudinaryConfig(env = process.env) {
  const fromUrl = parseCloudinaryUrl(env.CLOUDINARY_URL)
    || parseCloudinaryUrl(env.CLOUDINARY_API_TOKEN);
  if (fromUrl) return fromUrl;

  const cloudName = env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = env.CLOUDINARY_API_SECRET?.trim();
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };

  throw new Error(
    "Cloudinary is not configured. Set CLOUDINARY_URL, set CLOUDINARY_API_TOKEN to the full cloudinary://API_KEY:API_SECRET@CLOUD_NAME value, or provide CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.",
  );
}

async function uploadBuffer({
  buffer,
  filename,
  mimeType,
  publicId,
  resourceType,
  tags,
  context,
  env,
}) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig(env);
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`;

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimeType }), filename);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("unique_filename", "false");
  if (tags) form.append("tags", tags);
  if (context) form.append("context", context);

  const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Basic ${authorization}` },
    body: form,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Cloudinary upload failed with HTTP ${response.status}`);
  }

  return {
    secure_url: payload.secure_url,
    public_id: payload.public_id,
    asset_id: payload.asset_id,
    resource_type: payload.resource_type,
    bytes: payload.bytes,
    format: payload.format || null,
    duration: payload.duration ?? null,
  };
}

function resourceTypeFor(format) {
  return format === "wav" ? "video" : "raw";
}

export async function uploadAudioToCloudinary({
  audio,
  format,
  mimeType,
  jobId,
  model,
  env = process.env,
}) {
  const extension = format === "wav" ? "wav" : format === "l16" ? "pcm" : format;
  return uploadBuffer({
    buffer: audio,
    filename: `${jobId}.${extension}`,
    mimeType,
    publicId: `gemini-tts/${jobId}`,
    resourceType: resourceTypeFor(format),
    tags: "gemini-tts,generated-audio",
    context: `job_id=${jobId}|model=${model}`,
    env,
  });
}

export async function uploadTextArtifactToCloudinary({
  content,
  jobId,
  suffix,
  mimeType,
  model,
  env = process.env,
}) {
  const buffer = Buffer.from(String(content), "utf8");
  return uploadBuffer({
    buffer,
    filename: `${jobId}.${suffix}`,
    mimeType,
    publicId: `gemini-tts/${jobId}.${suffix}`,
    resourceType: "raw",
    tags: "gemini-tts,transcript",
    context: `job_id=${jobId}|model=${model}|artifact=${suffix}`,
    env,
  });
}
