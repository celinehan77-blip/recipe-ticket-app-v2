const TRAILING_URL_PUNCTUATION = /[)\]}>，。！？、,.;:：；！？”’]+$/;

export function extractHttpUrlFromSharedText(value: string) {
  const match = value.match(/https?:\/\/[^\s，。！、；：“”‘’<>,;!]+/i);

  if (!match) {
    return null;
  }

  const candidate = match[0].replace(TRAILING_URL_PUNCTUATION, "");

  try {
    return new URL(candidate).toString();
  } catch {
    return null;
  }
}
