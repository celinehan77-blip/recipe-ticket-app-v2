import { createHash } from "node:crypto";
import {
  chmod,
  copyFile,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const VERSION = "2026.06.09";
const EXPECTED_SHA256 =
  "bf8aac79b72287a6d2043074415132558b43743a8f9461a22b0141e90f16ce66";
const DOWNLOAD_URL = `https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/yt-dlp_linux`;
const runtimeToolsDirectory = path.join(process.cwd(), "runtime-tools");
const destination = path.join(runtimeToolsDirectory, "yt-dlp");
const ffmpegSource = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg");
const ffmpegDestination = path.join(runtimeToolsDirectory, "ffmpeg");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

if (process.platform === "linux" && process.arch === "x64") {
  let existing = null;
  try {
    existing = await readFile(destination);
  } catch {
    existing = null;
  }

  if (!existing || sha256(existing) !== EXPECTED_SHA256) {
    const response = await fetch(DOWNLOAD_URL, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(`yt-dlp download failed (${response.status}).`);
    }

    const binary = Buffer.from(await response.arrayBuffer());
    if (sha256(binary) !== EXPECTED_SHA256) {
      throw new Error("yt-dlp checksum verification failed.");
    }

    await mkdir(path.dirname(destination), { recursive: true });
    const temporaryPath = `${destination}.tmp`;
    await writeFile(temporaryPath, binary, { mode: 0o755 });
    await rename(temporaryPath, destination);
  }

  await chmod(destination, 0o755);
  await copyFile(ffmpegSource, ffmpegDestination);
  await chmod(ffmpegDestination, 0o755);
}
