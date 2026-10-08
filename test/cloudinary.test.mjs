import test from "node:test";
import assert from "node:assert/strict";
import { getCloudinaryConfig, parseCloudinaryUrl } from "../src/storage/cloudinary.mjs";

test("parseCloudinaryUrl reads the full CLOUDINARY_URL", () => {
  assert.deepEqual(
    parseCloudinaryUrl("cloudinary://12345:secret-value@demo-cloud"),
    {
      cloudName: "demo-cloud",
      apiKey: "12345",
      apiSecret: "secret-value",
    },
  );
});

test("getCloudinaryConfig reads only CLOUDINARY_URL", () => {
  const config = getCloudinaryConfig({
    CLOUDINARY_URL: "cloudinary://key:secret@cloud-name",
    CLOUDINARY_API_TOKEN: "ignored",
    CLOUDINARY_CLOUD_NAME: "ignored",
    CLOUDINARY_API_KEY: "ignored",
    CLOUDINARY_API_SECRET: "ignored",
  });
  assert.equal(config.cloudName, "cloud-name");
  assert.equal(config.apiKey, "key");
  assert.equal(config.apiSecret, "secret");
});

test("getCloudinaryConfig fails clearly when CLOUDINARY_URL is missing", () => {
  assert.throws(
    () => getCloudinaryConfig({}),
    /Add the GitHub secret CLOUDINARY_URL/,
  );
});

test("parseCloudinaryUrl rejects name=value text pasted into the secret value", () => {
  assert.throws(
    () => parseCloudinaryUrl("CLOUDINARY_URL=cloudinary://key:secret@cloud-name"),
    /must be the full Cloudinary environment URL/,
  );
});
