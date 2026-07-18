import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rishibiji.app",
  appName: "日食笔记",
  webDir: "mobile-shell",
  server: {
    allowNavigation: ["recipe-ticket-app-v2.vercel.app"],
    cleartext: false,
    errorPath: "error.html",
    url: "https://recipe-ticket-app-v2.vercel.app",
  },
};

export default config;
