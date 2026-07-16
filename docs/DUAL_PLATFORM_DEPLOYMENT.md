# 双平台部署说明

本项目同时保留 Vercel 和 Netlify，两个平台连接同一个 GitHub `main` 分支，并共用同一个 Supabase 项目及第三方 AI 服务。

## 当前角色

- 主要测试站点：`https://recipe-ticket-app-v2.vercel.app`
- 备用站点：`https://recipe-ticket-app-v2.netlify.app`
- Netlify 当前可因 Credits 暂停，但站点、`netlify.toml` 和环境变量配置继续保留。
- 两个平台的环境变量必须分别维护，GitHub push 不会同步平台环境变量。

## 生成任务兼容方式

- Netlify：优先使用 Netlify Background Functions 和 Netlify Blobs，避免同步函数 30 秒限制。
- Vercel：Netlify 专属路由返回 404/405 时，客户端改用同一个 Next.js `/api/parse-recipe`；该函数最长运行 60 秒。
- 两条路径最终复用同一套 `yt-dlp -> FFmpeg -> ASR -> DeepSeek` 业务代码。
- 不创建第二套 Supabase、AI Provider 或菜谱数据。

## 配置边界

- `netlify.toml` 只由 Netlify 读取，不影响 Vercel。
- Vercel 使用 Next.js 原生构建，不删除或改写 Netlify Functions。
- `.vercel` 和 `.netlify` 都是本地平台状态目录，已被 Git 忽略。
- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 可在浏览器使用。
- DeepSeek、火山、阿里云和媒体路径变量只能用于服务端，不能添加 `NEXT_PUBLIC_` 前缀。

## 部署节奏

普通文案、UI 和本地调试只运行本地测试与构建。一个稳定 Checkpoint 完成后再 push，由 Git 集成各触发一次部署；线上失败时先看构建和运行日志，避免无改动重复部署。
