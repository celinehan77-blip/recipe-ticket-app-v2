import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/parse-recipe": [
      "./runtime-tools/yt-dlp",
      "./runtime-tools/ffmpeg",
    ],
  },
};

export default nextConfig;
