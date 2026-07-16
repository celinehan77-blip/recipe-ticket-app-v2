import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/parse-recipe": [
      "./runtime-tools/yt-dlp",
      "./node_modules/ffmpeg-static/ffmpeg",
    ],
  },
};

export default nextConfig;
