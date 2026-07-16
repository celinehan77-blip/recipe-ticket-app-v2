import { createHash } from "node:crypto";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSION = "2025.10.14";
const EXPECTED_SHA256 =
  "83d2c55a8893b49d0ccd23f5c528acf06840fc59bd1100519832b60724af34b7";
const DOWNLOAD_URL = `https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/yt-dlp_linux`;
const destination = path.join(
  process.cwd(),
  "node_modules",
  ".cache",
  "recipe-ticket",
  "yt-dlp",
);

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
}
