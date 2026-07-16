import { AudioExtractionError } from "@/lib/media/errors";
import type { HostLookup } from "@/lib/source/urlSafety";
import {
  defaultHostLookup,
  hasOnlyPublicAddresses,
  sanitizeSourceUrl,
  upgradeInitialPlatformUrl,
  validateSourceUrl,
} from "@/lib/source/urlSafety";

const TIKHUB_TIMEOUT_MS = 20_000;
const MAX_TIKHUB_RESPONSE_BYTES = 2 * 1024 * 1024;
const VIDEO_AWEME_TYPES = new Set([0, 4, 51, 55, 58, 61]);
const IMAGE_AWEME_TYPES = new Set([2, 68, 150]);

type TikHubUrlValue = { url_list?: unknown };

type TikHubAweme = {
  aweme_type?: unknown;
  desc?: unknown;
  duration?: unknown;
  images?: unknown;
  share_url?: unknown;
  video?: Record<string, unknown> | null;
};

export type DouyinMedia = {
  canonicalUrl: string;
  description: string | null;
  durationSeconds: number;
  imageUrls: string[];
  mediaType: "video" | "image";
  mediaUrl: string | null;
};

function firstHttpsUrl(value: unknown) {
  const urlList: unknown[] =
    value && typeof value === "object" && Array.isArray((value as TikHubUrlValue).url_list)
      ? ((value as TikHubUrlValue).url_list as unknown[])
      : [];

  return urlList.find((url): url is string => {
    if (typeof url !== "string") return false;
    try {
      const parsed = new URL(url);
      return (
        parsed.protocol === "https:" &&
        !parsed.username &&
        !parsed.password &&
        (!parsed.port || parsed.port === "443")
      );
    } catch {
      return false;
    }
  }) ?? null;
}

function getVideoUrl(video: TikHubAweme["video"]) {
  if (!video) return null;

  for (const field of [
    "play_addr_265",
    "play_addr",
    "play_addr_h264",
    "download_addr",
    "play_addr_lowbr",
  ]) {
    const mediaUrl = firstHttpsUrl(video[field]);
    if (mediaUrl) return mediaUrl;
  }

  return null;
}

function getImageUrls(images: unknown) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => firstHttpsUrl(image))
    .filter((url): url is string => Boolean(url));
}

function getAweme(payload: unknown): TikHubAweme | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;
  const aweme = (data as { aweme_detail?: unknown }).aweme_detail;
  return aweme && typeof aweme === "object" ? (aweme as TikHubAweme) : null;
}

export async function validatePublicMediaUrl(
  mediaUrl: string,
  lookupHost: HostLookup = defaultHostLookup,
) {
  let url: URL;
  try {
    url = new URL(mediaUrl);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    (url.port && url.port !== "443") ||
    !(await hasOnlyPublicAddresses(url.hostname, lookupHost))
  ) {
    return null;
  }

  return url;
}

export async function resolveDouyinMedia(
  sharedValue: string,
  options: {
    apiKey?: string;
    baseUrl?: string;
    fetchImpl?: typeof fetch;
    lookupHost?: HostLookup;
  } = {},
): Promise<DouyinMedia> {
  const validated = validateSourceUrl(upgradeInitialPlatformUrl(sharedValue), "douyin");
  if (!validated) {
    throw new AudioExtractionError("unsupported_url", "Unsupported Douyin URL.");
  }

  const apiKey = options.apiKey ?? process.env.TIKHUB_API_KEY;
  if (!apiKey) {
    throw new AudioExtractionError(
      "media_provider_unavailable",
      "Douyin media provider is not configured.",
    );
  }

  const baseUrl = options.baseUrl ?? process.env.TIKHUB_BASE_URL ?? "https://api.tikhub.io";
  let endpoint: URL;
  try {
    endpoint = new URL("/api/v1/douyin/app/v3/fetch_one_video_by_share_url", baseUrl);
  } catch {
    throw new AudioExtractionError(
      "media_provider_unavailable",
      "Douyin media provider endpoint is invalid.",
    );
  }
  if (endpoint.protocol !== "https:") {
    throw new AudioExtractionError(
      "media_provider_unavailable",
      "Douyin media provider must use HTTPS.",
    );
  }
  endpoint.searchParams.set("share_url", sanitizeSourceUrl(validated.url));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIKHUB_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (options.fetchImpl ?? fetch)(endpoint, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
  } catch {
    throw new AudioExtractionError("media_unavailable", "Douyin media lookup failed.");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new AudioExtractionError("media_unavailable", "Douyin media lookup was rejected.");
  }

  const declaredBytes = Number(response.headers.get("content-length") ?? 0);
  if (declaredBytes > MAX_TIKHUB_RESPONSE_BYTES) {
    throw new AudioExtractionError("media_unavailable", "Douyin media response was too large.");
  }

  let payload: unknown;
  try {
    const responseText = await response.text();
    if (Buffer.byteLength(responseText, "utf8") > MAX_TIKHUB_RESPONSE_BYTES) {
      throw new Error("response_too_large");
    }
    payload = JSON.parse(responseText);
  } catch {
    throw new AudioExtractionError("media_unavailable", "Douyin media response was invalid.");
  }

  const aweme = getAweme(payload);
  if (!aweme) {
    throw new AudioExtractionError("media_unavailable", "Douyin post data was unavailable.");
  }

  const awemeType = Number(aweme.aweme_type);
  const mediaUrl = getVideoUrl(aweme.video);
  const imageUrls = getImageUrls(aweme.images);
  const mediaType = IMAGE_AWEME_TYPES.has(awemeType) || (!mediaUrl && imageUrls.length)
    ? "image"
    : "video";

  if (mediaType === "image") {
    throw new AudioExtractionError(
      "image_post_unsupported",
      "This Douyin image post requires OCR and has no audio track.",
    );
  }
  if (!VIDEO_AWEME_TYPES.has(awemeType) && !mediaUrl) {
    throw new AudioExtractionError("media_unavailable", "Douyin video URL was unavailable.");
  }
  if (!mediaUrl || !(await validatePublicMediaUrl(mediaUrl, options.lookupHost))) {
    throw new AudioExtractionError("media_unavailable", "Douyin video URL was unsafe.");
  }

  const shareUrl =
    typeof aweme.share_url === "string"
      ? validateSourceUrl(aweme.share_url, "douyin")
      : null;

  return {
    canonicalUrl: shareUrl ? sanitizeSourceUrl(shareUrl.url) : sanitizeSourceUrl(validated.url),
    description: typeof aweme.desc === "string" ? aweme.desc.trim().slice(0, 300) || null : null,
    durationSeconds: Math.ceil(Number(aweme.duration ?? 0) / 1000),
    imageUrls,
    mediaType,
    mediaUrl,
  };
}
