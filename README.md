# Recipe Ticket / 日食笔记

一个将小红书 / 抖音美食视频链接整理成干净菜谱，并支持收藏、分类浏览和风味地图的高质感菜谱收藏 App MVP。

> **开发前必读：所有开发开始前必须先阅读 [`docs/AI_PROJECT_DIRECTOR.md`](docs/AI_PROJECT_DIRECTOR.md)，再继续规划、编码、调试或部署。**
>
> 项目阶段与变更记录：[`docs/ROADMAP.md`](docs/ROADMAP.md) · [`docs/CHANGELOG.md`](docs/CHANGELOG.md)
>
> 产品战略最高层：[`MASTER_PLAN.md`](MASTER_PLAN.md)

当前项目处于 **Milestone 2：Production Ready MVP**。数据一致性基础 Checkpoint 已完成，当前最高优先级是公开小红书 / 抖音分享链接的文字提取，完整四级进度以 ROADMAP 为准。

## 当前功能

- 首页粘贴菜谱正文或字幕，使用 DeepSeek 生成菜谱
- Loading 票根生成页
- 动态菜谱详情页
- 本地收藏
- 收藏页
- 风味地图
- Station Cover Flow 菜谱选择
- 我的页本地数据汇总
- Supabase 只读接入
- Supabase Auth 游客优先
- 云端收藏同步基础版
- 云端生成记录基础版
- AI 解析接口骨架
- mockData fallback
- localStorage fallback

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Framer Motion
- localStorage

## 本地运行

先安装依赖：

```bash
npm install
```

启动本地开发服务：

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

## 环境变量

如果需要连接 Supabase，请在项目根目录创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

说明：

- 没有配置 Supabase 时，项目会 fallback 到 `mockData`。
- 不要提交 `.env.local`。
- 不要把真实 Supabase URL 或 anon key 写进代码。
- 不要把真实 Supabase URL 或 anon key 写进 `.env.example`。

如果需要启用 DeepSeek 真实 AI 解析，可以在 `.env.local` 或部署平台环境变量中添加：

```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=30000
DEEPSEEK_MAX_RETRIES=1
DEEPSEEK_MAX_TOKENS=3000
```

说明：

- 默认 `AI_PROVIDER=mock`，不配置 AI key 也能运行。
- AI key 是服务端密钥，不要使用 `NEXT_PUBLIC_`。
- 不要把真实 DeepSeek key 写进代码、README 或 `.env.example`。

## Supabase 数据库

数据库相关文件：

- schema 文件：`supabase/schema.sql`
- seed 文件：`supabase/seed.sql`
- 手动设置说明：`docs/SUPABASE_MANUAL_SETUP.md`
- 只读接入说明：`docs/SUPABASE_READONLY_PHASE.md`

当前 Supabase 只读接入：

- `stations`
- `recipes`
- `ingredients`
- `recipe_steps`

如果 Supabase 未配置、查询失败或数据为空，页面会继续使用 `mockData` 正常运行。

## AI Parsing

- 当前已新增 `/api/parse-recipe`。
- 首页生成流程已经接入 `/api/parse-recipe`。
- 已新增小红书 / 抖音公开分享链接文字提取基础版，支持受控短链跳转、公开 HTML 元数据和内嵌 JSON 提取。
- 链接抓取只读取无需登录即可访问的公开内容，不执行页面脚本，不绕过登录、验证码或平台访问控制。
- 当前默认使用 mock parser，返回稳定的结构化菜谱草稿。
- 当前已接入 DeepSeek Provider，并已完成 Netlify Production 基础验收。
- DeepSeek 请求支持可配置超时、受控重试和 JSON 输出截断检测。
- 开发诊断会显示 attempted provider、模型、耗时、尝试次数、finish reason 和 Token 用量。
- 设置 `AI_PROVIDER=deepseek` 且填写 `DEEPSEEK_API_KEY` 后，服务端会尝试调用 DeepSeek。
- DeepSeek 失败、超时、未配置 key 或输出不合法时，会 fallback 到 mock parser。
- `npm run test:ai` 会运行本地 Provider fallback、Prompt、校验和解析样本质量测试，不调用真实 DeepSeek。
- 当前解析结果会先保存为本地 draft。
- 已登录用户会尝试把 draft 保存为 Supabase `recipes / ingredients / recipe_steps`。
- 保存成功后 loading 会跳转到新生成的 `/recipe/[slug]`。
- 游客生成的每道本地菜谱使用唯一 slug，保存失败时仍保留可用的本地动态菜谱。
- 公开链接提取基础代码已完成，真实平台短链仍需使用产品负责人提供的样本完成验收。
- AI key 只使用服务端环境变量，不使用 `NEXT_PUBLIC_`。

## 当前阶段说明

当前是 MVP 阶段。

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 未登录用户继续使用 `localStorage` 收藏和模拟生成任务。
- 已登录用户可以使用 Supabase 收藏同步和生成记录同步。
- AI 解析默认仍保留 Mock Parser fallback；配置 DeepSeek 服务端环境变量后可使用真实 AI 解析。

这样做是为了先保证前端体验稳定，再逐步切换真实后端能力。

## Deployment

当前部署平台：

- Netlify

部署前需要：

- GitHub 仓库：`celinehan77-blip/recipe-ticket-app-v2`
- Netlify 账号
- Supabase 项目的 Project URL 和 anon public key

说明：

- Vercel 因手机号验证暂时未使用。
- Netlify 已连接 GitHub，会在 `main` 分支更新后自动部署。
- 构建命令：`npm run build`
- 发布目录：`.next`
- Next.js 插件：`@netlify/plugin-nextjs`

在 Netlify Site configuration -> Environment variables 中添加：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_PROVIDER=mock
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=30000
DEEPSEEK_MAX_RETRIES=1
DEEPSEEK_MAX_TOKENS=3000
```

说明：

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 没有配置 Supabase 环境变量时，项目会 fallback 到 `mockData`。
- 未登录用户的收藏与生成任务继续使用 `localStorage`；已登录用户会尝试同步到 Supabase。
- 不要把真实 Supabase URL 或 anon key 写进 GitHub。
- 不要把真实 DeepSeek key 写进 GitHub，也不要使用 `NEXT_PUBLIC_`。
- Netlify 不会自动读取本地 `.env.local`，线上环境变量需要在 Netlify 后台单独配置。
- 环境变量更新后需要重新部署。
- 如果 Supabase 不可用，线上页面会继续 fallback 到 `mockData`。
- 如果 DeepSeek 不配置或调用失败，线上解析会 fallback 到 mock parser。
- `DEEPSEEK_MAX_RETRIES=1` 表示失败后最多额外尝试一次；增加重试会增加耗时和可能的 API 费用。

线上 Supabase 诊断接口：

- `/api/deploy-health`

详细步骤：

- `docs/NETLIFY_DEPLOYMENT.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/DEPLOYMENT_CHECKLIST.md`

## 后续计划

- 当前完整路线、Phase 状态和验收标准见 [`docs/ROADMAP.md`](docs/ROADMAP.md)。
- Current Phase：`Phase 12`。
- Next Queue 当前项：解析样本测试体系；后续依次推进小红书、抖音、OCR、质量评分、Embedding 搜索、收藏夹、iOS PWA、数据分析与正式上线。
- Git commit、Git push、真实账号、API Key、付费和生产环境变更仍需人工授权。

## AI Software Company

项目由产品负责人、ChatGPT（CTO + Product Director）和 Codex（Engineering Manager）共同推进。固定职责文档：

- [`AI_PROJECT_DIRECTOR.md`](docs/AI_PROJECT_DIRECTOR.md)
- [`AI_ARCHITECT.md`](docs/AI_ARCHITECT.md)
- [`AI_QA.md`](docs/AI_QA.md)
- [`AI_REVIEWER.md`](docs/AI_REVIEWER.md)
- [`AI_RELEASE_MANAGER.md`](docs/AI_RELEASE_MANAGER.md)
- [`AI_KNOWLEDGE_MANAGER.md`](docs/AI_KNOWLEDGE_MANAGER.md)
- [`AI_PRODUCT_ANALYST.md`](docs/AI_PRODUCT_ANALYST.md)

## 常用命令

```bash
npm run dev
npm run build
npm run lint
```
