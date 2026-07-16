import { spawn, type ChildProcess } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rm, stat } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import ffmpegStaticPath from "ffmpeg-static";
import { extractHttpUrlFromSharedText } from "@/lib/source/sharedInput";
import {
  sanitizeSourceUrl,
  upgradeInitialPlatformUrl,
  validateSourceUrl,
} from "@/lib/source/urlSafety";

const MAX_MEDIA_DURATION_SECONDS = 5 * 60;
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 60_000;

export type AudioExtractionErrorCode =
  | "unsupported_url"
  | "yt_dlp_unavailable"
  | "media_unavailable"
  | "media_too_long"
  | "media_too_large"
  | "ffmpeg_failed"
  | "process_timeout"
  | "audio_empty";

export class AudioExtractionError extends Error {
  constructor(
    public readonly code: AudioExtractionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AudioExtractionError";
  }
}

export type ExtractedAudio = {
  audio: Buffer;
  canonicalUrl: string;
  durationSeconds: number;
  sourceHash: string;
  title: string | null;
};

type MediaMetadata = {
  duration?: number;
  filesize?: number;
  filesize_approx?: number;
  title?: string;
  webpage_url?: string;
};

function resolveYtDlpPath() {
  if (process.env.YT_DLP_PATH) {
    return process.env.YT_DLP_PATH;
  }

  const macUserInstall = path.join(
    homedir(),
    "Library",
    "Python",
    "3.9",
    "bin",
    "yt-dlp",
  );

  if (process.platform === "darwin") {
    return macUserInstall;
  }

  return path.join("node_modules", ".cache", "recipe-ticket", "yt-dlp");
}

function resolveFfmpegPath() {
  if (process.env.FFMPEG_PATH) {
    return process.env.FFMPEG_PATH;
  }

  if (process.platform === "darwin") {
    return "/opt/homebrew/bin/ffmpeg";
  }

  return ffmpegStaticPath || "ffmpeg";
}

function safeProcessError(value: string) {
  return value
    .replace(/https?:\/\/\S+/gi, "[media-url]")
    .replace(/[A-Za-z0-9_-]{32,}/g, "[redacted]")
    .trim()
    .slice(0, 300);
}

function waitForProcess(
  child: ChildProcess,
  timeoutMs: number,
  captureStdout = true,
): Promise<{ code: number | null; stderr: string; stdout: Buffer }> {
  return new Promise((resolve, reject) => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new AudioExtractionError("process_timeout", "Media process timed out."));
    }, timeoutMs);

    if (captureStdout) {
      child.stdout?.on("data", (chunk: Buffer) => stdout.push(chunk));
    }
    child.stderr?.on("data", (chunk: Buffer) => stderr.push(chunk));
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      resolve({
        code,
        stderr: Buffer.concat(stderr).toString("utf8"),
        stdout: Buffer.concat(stdout),
      });
    });
  });
}

export function normalizeShareUrl(sharedValue: string) {
  const extracted = extractHttpUrlFromSharedText(sharedValue) ?? sharedValue.trim();
  const validated = validateSourceUrl(upgradeInitialPlatformUrl(extracted));

  if (!validated || validated.platform !== "xiaohongshu") {
    throw new AudioExtractionError(
      "unsupported_url",
      "Only public Xiaohongshu links are supported in this checkpoint.",
    );
  }

  const canonicalUrl = sanitizeSourceUrl(validated.url);

  return {
    canonicalUrl,
    sourceHash: createHash("sha256").update(canonicalUrl).digest("hex"),
  };
}

async function readMetadata(sourceUrl: string) {
  const child = spawn(
    resolveYtDlpPath(),
    ["--no-warnings", "--no-playlist", "--skip-download", "--dump-single-json", sourceUrl],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const result = await waitForProcess(child, PROCESS_TIMEOUT_MS);

  if (result.code !== 0) {
    const summary = safeProcessError(result.stderr);
    const unavailable = /ENOENT|not found/i.test(summary);
    throw new AudioExtractionError(
      unavailable ? "yt_dlp_unavailable" : "media_unavailable",
      summary || "yt-dlp could not read this public media.",
    );
  }

  try {
    return JSON.parse(result.stdout.toString("utf8")) as MediaMetadata;
  } catch {
    throw new AudioExtractionError("media_unavailable", "yt-dlp returned invalid metadata.");
  }
}

async function streamAudio(sourceUrl: string, outputPath: string) {
  const ytDlp = spawn(
    resolveYtDlpPath(),
    ["--quiet", "--no-warnings", "--no-playlist", "-f", "best[ext=mp4]/best", "-o", "-", sourceUrl],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const ffmpeg = spawn(
    resolveFfmpegPath(),
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      "pipe:0",
      "-vn",
      "-ac",
      "1",
      "-ar",
      "16000",
      "-codec:a",
      "libmp3lame",
      "-b:a",
      "48k",
      outputPath,
    ],
    { stdio: ["pipe", "pipe", "pipe"] },
  );

  let streamedBytes = 0;
  ytDlp.stdout.on("data", (chunk: Buffer) => {
    streamedBytes += chunk.length;
    if (streamedBytes > MAX_MEDIA_BYTES) {
      ytDlp.kill("SIGKILL");
      ffmpeg.kill("SIGKILL");
      return;
    }
    if (!ffmpeg.stdin.write(chunk)) {
      ytDlp.stdout.pause();
      ffmpeg.stdin.once("drain", () => ytDlp.stdout.resume());
    }
  });
  ytDlp.stdout.once("end", () => ffmpeg.stdin.end());

  try {
    const [ytDlpResult, ffmpegResult] = await Promise.all([
      waitForProcess(ytDlp, PROCESS_TIMEOUT_MS, false),
      waitForProcess(ffmpeg, PROCESS_TIMEOUT_MS, false),
    ]);

    if (streamedBytes > MAX_MEDIA_BYTES) {
      throw new AudioExtractionError("media_too_large", "Media exceeded the MVP size limit.");
    }
    if (ytDlpResult.code !== 0) {
      throw new AudioExtractionError(
        "media_unavailable",
        safeProcessError(ytDlpResult.stderr) || "yt-dlp media stream failed.",
      );
    }
    if (ffmpegResult.code !== 0) {
      throw new AudioExtractionError(
        "ffmpeg_failed",
        safeProcessError(ffmpegResult.stderr) || "FFmpeg audio extraction failed.",
      );
    }
  } finally {
    if (!ytDlp.killed) {
      ytDlp.kill("SIGKILL");
    }
    if (!ffmpeg.killed) {
      ffmpeg.kill("SIGKILL");
    }
  }
}

export async function extractAudioWithYtDlp(sharedValue: string): Promise<ExtractedAudio> {
  const normalized = normalizeShareUrl(sharedValue);
  const metadata = await readMetadata(normalized.canonicalUrl);
  const durationSeconds = Number(metadata.duration ?? 0);
  const mediaBytes = Number(metadata.filesize ?? metadata.filesize_approx ?? 0);

  if (!durationSeconds || durationSeconds > MAX_MEDIA_DURATION_SECONDS) {
    throw new AudioExtractionError("media_too_long", "Media duration exceeds 5 minutes.");
  }
  if (mediaBytes > MAX_MEDIA_BYTES) {
    throw new AudioExtractionError("media_too_large", "Media exceeds 100 MB.");
  }

  const tempDirectory = path.join(tmpdir(), `recipe-ticket-${randomUUID()}`);
  const audioPath = path.join(tempDirectory, "audio.mp3");

  await mkdir(tempDirectory, { recursive: true });
  try {
    await streamAudio(normalized.canonicalUrl, audioPath);
    const audioStats = await stat(/* turbopackIgnore: true */ audioPath);

    if (!audioStats.size) {
      throw new AudioExtractionError("audio_empty", "Extracted audio was empty.");
    }
    if (audioStats.size > MAX_AUDIO_BYTES) {
      throw new AudioExtractionError("media_too_large", "Extracted audio exceeds 8 MB.");
    }

    const metadataUrl = metadata.webpage_url
      ? validateSourceUrl(upgradeInitialPlatformUrl(metadata.webpage_url))
      : null;

    return {
      audio: await readFile(/* turbopackIgnore: true */ audioPath),
      canonicalUrl: metadataUrl
        ? sanitizeSourceUrl(metadataUrl.url)
        : normalized.canonicalUrl,
      durationSeconds,
      sourceHash: normalized.sourceHash,
      title: typeof metadata.title === "string" ? metadata.title.slice(0, 160) : null,
    };
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}
