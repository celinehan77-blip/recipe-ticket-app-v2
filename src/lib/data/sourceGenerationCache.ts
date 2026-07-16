import { extractHttpUrlFromSharedText } from "@/lib/source/sharedInput";

const CACHE_KEY = "recipe-ticket:source-generation-cache";
const MAX_ENTRIES = 20;

type CacheEntry = {
  savedAt: string;
  slug: string;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

async function hashSourceValue(value: string) {
  const extracted = extractHttpUrlFromSharedText(value) ?? value.trim();
  let normalized = extracted;

  try {
    const url = new URL(extracted);
    if (url.protocol === "http:") {
      url.protocol = "https:";
    }
    url.search = "";
    url.hash = "";
    normalized = url.toString();
  } catch {
    normalized = extracted.trim();
  }

  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function readCache(): Record<string, CacheEntry> {
  if (!canUseLocalStorage()) {
    return {};
  }
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || "{}") as Record<
      string,
      CacheEntry
    >;
  } catch {
    return {};
  }
}

export async function getCachedGeneratedRecipeSlug(sourceValue: string) {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const key = await hashSourceValue(sourceValue);
    return readCache()[key]?.slug ?? null;
  } catch {
    return null;
  }
}

export async function saveGeneratedRecipeSourceCache(
  sourceValue: string,
  slug: string,
) {
  if (!canUseLocalStorage()) {
    return false;
  }
  try {
    const key = await hashSourceValue(sourceValue);
    const entries = Object.entries({
      ...readCache(),
      [key]: { savedAt: new Date().toISOString(), slug },
    })
      .sort((left, right) => right[1].savedAt.localeCompare(left[1].savedAt))
      .slice(0, MAX_ENTRIES);
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
    return true;
  } catch {
    return false;
  }
}
