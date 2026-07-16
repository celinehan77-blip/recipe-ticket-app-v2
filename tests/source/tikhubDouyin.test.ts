import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveDouyinMedia,
  validatePublicMediaUrl,
} from "@/lib/media/tikhubDouyin";
import { AudioExtractionError } from "@/lib/media/errors";

const publicLookup = async () => [{ address: "8.8.8.8", family: 4 }];

test("resolves a public Douyin video without exposing recipe pages to media ids", async () => {
  let authorization = "";
  const result = await resolveDouyinMedia("https://v.douyin.com/sample/", {
    apiKey: "test-only-key",
    fetchImpl: async (_input, init) => {
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      return Response.json({
        data: {
          aweme_detail: {
            aweme_type: 0,
            desc: "可乐鸡翅",
            duration: 42_200,
            share_url: "https://www.douyin.com/video/123?share_token=private",
            video: {
              play_addr: { url_list: ["https://media.example.com/video.mp4?signature=test"] },
            },
          },
        },
      });
    },
    lookupHost: publicLookup,
  });

  assert.equal(authorization, "Bearer test-only-key");
  assert.equal(result.mediaType, "video");
  assert.equal(result.durationSeconds, 43);
  assert.equal(result.description, "可乐鸡翅");
  assert.equal(result.canonicalUrl, "https://www.douyin.com/video/123");
  assert.match(result.mediaUrl ?? "", /^https:\/\/media\.example\.com/);
});

test("classifies Douyin image posts without attempting ASR", async () => {
  await assert.rejects(
    () =>
      resolveDouyinMedia("https://v.douyin.com/image/", {
        apiKey: "test-only-key",
        fetchImpl: async () =>
          Response.json({
            data: {
              aweme_detail: {
                aweme_type: 68,
                images: [{ url_list: ["https://image.example.com/one.jpg"] }],
              },
            },
          }),
        lookupHost: publicLookup,
      }),
    (error: unknown) =>
      error instanceof AudioExtractionError && error.code === "image_post_unsupported",
  );
});

test("requires server-only provider configuration", async () => {
  await assert.rejects(
    () => resolveDouyinMedia("https://v.douyin.com/sample/", { apiKey: "" }),
    (error: unknown) =>
      error instanceof AudioExtractionError && error.code === "media_provider_unavailable",
  );
});

test("rejects unsafe media URLs", async () => {
  assert.equal(await validatePublicMediaUrl("http://media.example.com/video.mp4", publicLookup), null);
  assert.equal(
    await validatePublicMediaUrl("https://127.0.0.1/video.mp4", async () => [
      { address: "127.0.0.1", family: 4 },
    ]),
    null,
  );
});
