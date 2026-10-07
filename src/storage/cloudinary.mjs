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
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig(env);
  const resourceType = resourceTypeFor(format);
  const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`;

  const form = new FormData();
  const extension = format === "wav" ? "wav" : format === "l16" ? "pcm" : format;
  form.append("file", new Blob([audio], { type: mimeType }), `${jobId}.${extension}`);
  form.append("public_id", `gemini-tts/${jobId}`);
  form.append("overwrite", "true");
  form.append("unique_filename", "false");
  form.append("tags", "gemini-tts,generated-audio");
  form.append("context", `job_id=${jobId}|model=${model}`);

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
    format: payload.format || extension,
  };
}
