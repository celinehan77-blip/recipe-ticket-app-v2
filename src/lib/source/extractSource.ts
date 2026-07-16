import {
  hasOnlyPublicAddresses,
  sanitizeSourceUrl,
  upgradeInitialPlatformUrl,
  validateSourceUrl,
  type HostLookup,
} from "@/lib/source/urlSafety";
import { extractPublicTextFromHtml } from "@/lib/source/extractHtml";
import type { SourceExtractionResult } from "@/lib/source/types";

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

type SourceFetchOptions = {
  fetchImpl?: typeof fetch;
  lookupHost?: HostLookup;
  timeoutMs?: number;
};

async function readLimitedText(response: Response) {
  const contentLength = Number(response.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) {
    return { error: "response_too_large" as const, text: null };
  }

  if (!response.body) {
    return { error: null, text: "" };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > MAX_HTML_BYTES) {
      await reader.cancel();
      return { error: "response_too_large" as const, text: null };
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { error: null, text: new TextDecoder().decode(bytes) };
}

export async function extractPublicSource(
  sourceUrl: string,
  {
    fetchImpl = fetch,
    lookupHost,
    timeoutMs = FETCH_TIMEOUT_MS,
  }: SourceFetchOptions = {},
): Promise<SourceExtractionResult> {
  const initialSource = validateSourceUrl(upgradeInitialPlatformUrl(sourceUrl));

  if (!initialSource) {
    return {
      errorCode: "unsupported_url",
      message: "目前只支持公开的小红书和抖音 HTTPS 分享链接。",
      ok: false,
      platform: null,
      warnings: [],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let currentUrl = initialSource.url;

  try {
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
      const validatedUrl = validateSourceUrl(
        currentUrl.toString(),
        initialSource.platform,
      );

      if (!validatedUrl) {
        return {
          errorCode: "unsafe_redirect",
          message: "分享链接跳转到了不受支持的地址。",
          ok: false,
          platform: initialSource.platform,
          warnings: [],
        };
      }

      const publicAddress = await hasOnlyPublicAddresses(
        validatedUrl.url.hostname,
        lookupHost,
      );

      if (!publicAddress) {
        return {
          errorCode: "unsafe_redirect",
          message: "分享链接地址未通过安全检查。",
          ok: false,
          platform: initialSource.platform,
          warnings: [],
        };
      }

      const response = await fetchImpl(validatedUrl.url, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.6",
          "User-Agent":
            "Mozilla/5.0 (compatible; RecipeTicket/0.2; +https://recipe-ticket-app-v2.netlify.app)",
        },
        redirect: "manual",
        signal: controller.signal,
      });

      if (REDIRECT_STATUSES.has(response.status)) {
        const location = response.headers.get("location");

        if (!location || redirectCount === MAX_REDIRECTS) {
          return {
            errorCode: "unsafe_redirect",
            message: "分享链接跳转次数过多或缺少目标地址。",
            ok: false,
            platform: initialSource.platform,
            warnings: [],
          };
        }

        currentUrl = new URL(location, validatedUrl.url);
        continue;
      }

      if ([401, 403, 429].includes(response.status)) {
        return {
          errorCode: "fetch_blocked",
          message: "平台暂时阻止了公开页面访问。",
          ok: false,
          platform: initialSource.platform,
          warnings: [],
        };
      }

      if (!response.ok) {
        return {
          errorCode: "fetch_blocked",
          message: `公开页面请求失败（HTTP ${response.status}）。`,
          ok: false,
          platform: initialSource.platform,
          warnings: [],
        };
      }

      const body = await readLimitedText(response);

      if (body.error || body.text === null) {
        return {
          errorCode: "response_too_large",
          message: "公开页面内容超过安全读取上限。",
          ok: false,
          platform: initialSource.platform,
          warnings: [],
        };
      }

      const htmlResult = extractPublicTextFromHtml(body.text);

      if (!htmlResult.ok) {
        return {
          ...htmlResult,
          platform: initialSource.platform,
        };
      }

      return {
        canonicalUrl: sanitizeSourceUrl(validatedUrl.url),
        extractor: htmlResult.extractor,
        ok: true,
        platform: initialSource.platform,
        text: htmlResult.text,
        title: htmlResult.title,
        warnings: htmlResult.warnings,
      };
    }
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || controller.signal.aborted);

    return {
      errorCode: timedOut ? "timeout" : "fetch_blocked",
      message: timedOut
        ? "公开页面读取超时。"
        : "公开页面暂时无法读取。",
      ok: false,
      platform: initialSource.platform,
      warnings: [],
    };
  } finally {
    clearTimeout(timeout);
  }

  return {
    errorCode: "unsafe_redirect",
    message: "分享链接跳转次数超过安全上限。",
    ok: false,
    platform: initialSource.platform,
    warnings: [],
  };
}
