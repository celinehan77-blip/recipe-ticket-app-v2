# Recipe Ticket / 日食笔记

一个将小红书 / 抖音美食视频链接整理成干净菜谱，并支持收藏、分类浏览和风味地图的高质感菜谱收藏 App MVP。

当前项目仍处于 MVP 阶段，重点是验证核心体验：输入链接、模拟生成菜谱、浏览风味地图、收藏菜谱，并为后续接入真实 AI 解析和云端数据做准备。

## 当前功能

- 首页粘贴链接，模拟生成菜谱
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
- 当前默认使用 mock parser，返回稳定的结构化菜谱草稿。
- 当前解析结果只保存为本地 draft。
- 暂未写入 Supabase `recipes`。
- 暂未生成真实动态菜谱。
- 暂未接真实 AI。
- 暂未接小红书 / 抖音真实解析。
- AI key 未来只使用服务端环境变量，不使用 `NEXT_PUBLIC_`。

## 当前阶段说明

当前是 MVP 阶段。

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 未登录用户继续使用 `localStorage` 收藏和模拟生成任务。
- 已登录用户可以使用 Supabase 收藏同步和生成记录同步。
- AI 解析当前只有接口骨架和 Mock Parser，尚未接入真实 AI。

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
```

说明：

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 没有配置 Supabase 环境变量时，项目会 fallback 到 `mockData`。
- 收藏与生成任务仍然使用 `localStorage`。
- 不要把真实 Supabase URL 或 anon key 写进 GitHub。
- Netlify 不会自动读取本地 `.env.local`，线上环境变量需要在 Netlify 后台单独配置。
- 环境变量更新后需要重新部署。
- 如果 Supabase 不可用，线上页面会继续 fallback 到 `mockData`。

线上 Supabase 诊断接口：

- `/api/deploy-health`

详细步骤：

- `docs/NETLIFY_DEPLOYMENT.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/DEPLOYMENT_CHECKLIST.md`

## 后续计划

- 登录 / Auth
- 收藏云端同步
- AI 菜谱解析
- 小红书 / 抖音链接解析
- 视觉 QA
- 部署上线

## 常用命令

```bash
npm run dev
npm run build
npm run lint
```
