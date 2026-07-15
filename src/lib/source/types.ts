export type PublicSourcePlatform = "xiaohongshu" | "douyin";

export type SourceExtractorKind =
  | "meta"
  | "json_ld"
  | "embedded_json"
  | "page_text"
  | "combined";

export type SourceExtractionErrorCode =
  | "unsupported_url"
  | "unsafe_redirect"
  | "fetch_blocked"
  | "timeout"
  | "response_too_large"
  | "no_text"
  | "invalid_html";

export type SourceExtractionSuccess = {
  canonicalUrl: string;
  extractor: SourceExtractorKind;
  ok: true;
  platform: PublicSourcePlatform;
  text: string;
  title: string | null;
  warnings: string[];
};

export type SourceExtractionFailure = {
  errorCode: SourceExtractionErrorCode;
  message: string;
  ok: false;
  platform: PublicSourcePlatform | null;
  warnings: string[];
};

export type SourceExtractionResult =
  | SourceExtractionSuccess
  | SourceExtractionFailure;

export type SourceExtractionMetadata = Pick<
  SourceExtractionSuccess,
  "canonicalUrl" | "extractor" | "platform" | "warnings"
>;
