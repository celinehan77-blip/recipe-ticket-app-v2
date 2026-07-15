import { load } from "cheerio";
import type {
  SourceExtractionErrorCode,
  SourceExtractorKind,
} from "@/lib/source/types";

const MAX_EXTRACTED_TEXT_LENGTH = 30000;
const MIN_USEFUL_TEXT_LENGTH = 20;
const JSON_TEXT_KEYS = new Set([
  "articlebody",
  "caption",
  "content",
  "desc",
  "description",
  "headline",
  "name",
  "notetext",
  "title",
]);

type HtmlExtractionSuccess = {
  extractor: SourceExtractorKind;
  ok: true;
  text: string;
  title: string | null;
  warnings: string[];
};

type HtmlExtractionFailure = {
  errorCode: Extract<
    SourceExtractionErrorCode,
    "fetch_blocked" | "no_text" | "invalid_html"
  >;
  message: string;
  ok: false;
  warnings: string[];
};

export type HtmlExtractionResult =
  | HtmlExtractionSuccess
  | HtmlExtractionFailure;

function cleanText(value: string) {
  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/\\n|\\r/g, "\n")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function addFragment(
  fragments: string[],
  value: unknown,
  minimumLength = 8,
) {
  if (typeof value !== "string") {
    return;
  }

  const text = cleanText(value);

  if (text.length < minimumLength || /^https?:\/\//i.test(text)) {
    return;
  }

  if (fragments.some((existing) => existing === text || existing.includes(text))) {
    return;
  }

  for (let index = fragments.length - 1; index >= 0; index -= 1) {
    if (text.includes(fragments[index])) {
      fragments.splice(index, 1);
    }
  }

  fragments.push(text);
}

function collectJsonText(
  value: unknown,
  fragments: string[],
  depth = 0,
) {
  if (!value || depth > 12) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value.slice(0, 100)) {
      collectJsonText(item, fragments, depth + 1);
    }
    return;
  }

  if (typeof value !== "object") {
    return;
  }

  for (const [key, child] of Object.entries(value).slice(0, 200)) {
    if (JSON_TEXT_KEYS.has(key.toLowerCase())) {
      addFragment(fragments, child);
    }

    collectJsonText(child, fragments, depth + 1);
  }
}

function parseJsonScript(rawScript: string, fragments: string[]) {
  const script = rawScript.trim();

  if (!script || script.length > 1_000_000) {
    return false;
  }

  try {
    collectJsonText(JSON.parse(script), fragments);
    return true;
  } catch {
    return false;
  }
}

function hasBlockedPageMarker(text: string) {
  return /验证码|访问过于频繁|请登录后查看|captcha|verify you are human|access denied/i.test(
    text,
  );
}

export function extractPublicTextFromHtml(html: string): HtmlExtractionResult {
  if (!html.trim() || !html.includes("<")) {
    return {
      errorCode: "invalid_html",
      message: "公开页面没有返回可解析的 HTML。",
      ok: false,
      warnings: [],
    };
  }

  try {
    const $ = load(html);
    const metaFragments: string[] = [];
    const jsonLdFragments: string[] = [];
    const embeddedFragments: string[] = [];
    const pageFragments: string[] = [];

    const title = cleanText(
      $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").first().text() ||
        "",
    );

    addFragment(metaFragments, title, 2);
    addFragment(metaFragments, $('meta[property="og:description"]').attr("content"));
    addFragment(metaFragments, $('meta[name="description"]').attr("content"));
    addFragment(
      metaFragments,
      $('meta[name="twitter:description"]').attr("content"),
    );

    $('script[type="application/ld+json"]').each((_, element) => {
      parseJsonScript($(element).text(), jsonLdFragments);
    });

    $('script[type="application/json"], script#__NEXT_DATA__').each((_, element) => {
      parseJsonScript($(element).text(), embeddedFragments);
    });

    $("article, main, [class*='desc'], [class*='content'], [class*='caption']")
      .slice(0, 30)
      .each((_, element) => addFragment(pageFragments, $(element).text()));

    const bodyText = cleanText($("body").text());
    const fragments = [
      ...metaFragments,
      ...jsonLdFragments,
      ...embeddedFragments,
      ...pageFragments,
    ];
    const uniqueFragments: string[] = [];

    for (const fragment of fragments) {
      addFragment(uniqueFragments, fragment, 2);
    }

    const text = cleanText(uniqueFragments.join("\n\n")).slice(
      0,
      MAX_EXTRACTED_TEXT_LENGTH,
    );

    if (text.length < MIN_USEFUL_TEXT_LENGTH) {
      const blocked = hasBlockedPageMarker(bodyText);
      return {
        errorCode: blocked ? "fetch_blocked" : "no_text",
        message: blocked
          ? "平台要求额外验证，无法读取这条公开分享链接。"
          : "公开页面中没有找到足够的正文或字幕。",
        ok: false,
        warnings: [],
      };
    }

    const usedKinds = [
      metaFragments.length ? "meta" : null,
      jsonLdFragments.length ? "json_ld" : null,
      embeddedFragments.length ? "embedded_json" : null,
      pageFragments.length ? "page_text" : null,
    ].filter(Boolean) as SourceExtractorKind[];

    return {
      extractor: usedKinds.length === 1 ? usedKinds[0] : "combined",
      ok: true,
      text,
      title: title || null,
      warnings:
        text.length >= MAX_EXTRACTED_TEXT_LENGTH
          ? ["提取文字已截断到安全长度。"]
          : [],
    };
  } catch {
    return {
      errorCode: "invalid_html",
      message: "公开页面 HTML 解析失败。",
      ok: false,
      warnings: [],
    };
  }
}
