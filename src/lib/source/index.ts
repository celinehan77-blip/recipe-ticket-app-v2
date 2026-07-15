export { extractPublicSource } from "@/lib/source/extractSource";
export { extractPublicTextFromHtml } from "@/lib/source/extractHtml";
export { extractHttpUrlFromSharedText } from "@/lib/source/sharedInput";
export {
  hasOnlyPublicAddresses,
  identifySourcePlatform,
  isPublicIpAddress,
  sanitizeSourceUrl,
  validateSourceUrl,
} from "@/lib/source/urlSafety";
export type {
  PublicSourcePlatform,
  SourceExtractionErrorCode,
  SourceExtractionMetadata,
  SourceExtractionResult,
  SourceExtractorKind,
} from "@/lib/source/types";
