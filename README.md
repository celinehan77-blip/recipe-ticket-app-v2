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
- mockData fallback
- localStorage 收藏和模拟任务

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

## 当前阶段说明

当前是 MVP 阶段。

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 收藏功能仍然使用 `localStorage`。
- 首页模拟生成任务仍然使用 `localStorage`。
- AI 解析、登录、云端收藏还未接入。

这样做是为了先保证前端体验稳定，再逐步切换真实后端能力。

## Deployment

推荐部署平台：

- Vercel

部署前需要：

- GitHub 仓库：`celinehan77-blip/recipe-ticket-app-v2`
- Vercel 账号
- Supabase 项目的 Project URL 和 anon public key

在 Vercel Project Settings -> Environment Variables 中添加：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

说明：

- Supabase 目前只读接入 `stations / recipes` 相关公共菜谱数据。
- 没有配置 Supabase 环境变量时，项目会 fallback 到 `mockData`。
- 收藏与生成任务仍然使用 `localStorage`。
- 不要把真实 Supabase URL 或 anon key 写进 GitHub。
- Vercel 不会自动读取本地 `.env.local`，线上环境变量需要在 Vercel 后台单独配置。

详细步骤：

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
