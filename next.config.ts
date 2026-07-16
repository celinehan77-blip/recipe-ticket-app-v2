import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/parse-recipe": [
      "./node_modules/.cache/recipe-ticket/yt-dlp",
      "./node_modules/ffmpeg-static/ffmpeg",
    ],
  },
};

export default nextConfig;
