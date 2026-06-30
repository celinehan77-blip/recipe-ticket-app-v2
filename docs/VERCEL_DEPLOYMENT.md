# Vercel 部署说明

本文档用于把 Recipe Ticket / 日食笔记 部署到 Vercel。

Vercel 是前端部署平台，用来把 Next.js 网站发布到公网。当前项目已经支持 Supabase 只读读取，也保留了 mockData fallback，所以即使暂时没有配置 Supabase 环境变量，页面也应该可以正常打开。

## 部署前要知道

- Vercel 上不会自动读取你电脑里的 `.env.local`。
- 如果要让线上项目读取 Supabase，需要在 Vercel 后台单独添加环境变量。
- 不要把真实 Supabase URL 或 anon key 写进 GitHub。
- 没有 Supabase 环境变量时，项目会 fallback 到 `mockData`。
- 添加或修改 Vercel 环境变量后，需要重新 Deploy 才会生效。
- 当前收藏功能仍然使用 `localStorage`，所以不同浏览器、不同设备之间不会同步收藏。
- 当前生成流程仍然是模拟生成，不是真 AI 解析。

## Step 1：打开 Vercel

打开：

```text
https://vercel.com
```

## Step 2：使用 GitHub 登录

点击登录，并选择 GitHub 账号登录。

如果 Vercel 询问是否授权 GitHub 仓库访问，请允许它访问 `recipe-ticket-app-v2` 仓库。

## Step 3：Import Git Repository

进入 Vercel Dashboard 后，点击：

```text
Add New... -> Project
```

然后选择：

```text
Import Git Repository
```

## Step 4：选择 recipe-ticket-app-v2

在仓库列表中选择：

```text
celinehan77-blip/recipe-ticket-app-v2
```

如果没有看到这个仓库，通常是 GitHub 授权范围不够，需要回到 Vercel 的 GitHub 授权设置里重新授权该仓库。

## Step 5：Framework Preset 选择 Next.js

Vercel 通常会自动识别 Next.js。

如果需要手动选择，请选择：

```text
Framework Preset: Next.js
```

构建命令保持默认即可：

```bash
npm run build
```

## Step 6：添加环境变量

在 Vercel 的项目导入页面或项目设置中，找到：

```text
Environment Variables
```

添加以下两个变量：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

这些值需要从 Supabase 项目后台复制。

不要把真实值写进 GitHub、README、`.env.example` 或任何代码文件。

如果暂时不添加这两个变量，项目也应该能部署并使用 `mockData` 正常显示。

## Step 7：点击 Deploy

确认设置后，点击：

```text
Deploy
```

Vercel 会自动安装依赖、运行构建，并生成一个线上网址。

## Step 8：部署完成后打开 Vercel 网址

部署成功后，Vercel 会显示一个网址，例如：

```text
https://recipe-ticket-app-v2.vercel.app
```

点击打开，确认首页能正常显示。

## Step 9：检查核心页面

部署完成后，请依次检查：

- 首页 `/`
- Loading 页面 `/loading`
- 风味地图 `/flavor-map`
- 羽禽驿站 `/station/chicken`
- 牧场驿站 `/station/pasture`
- 海味码头 `/station/seafood`
- 菜谱详情 `/recipe/kung-pao-chicken`
- 收藏页 `/favorites`
- 我的页 `/me`

如果页面能打开，但 Supabase 数据没有出现，先检查 Vercel 环境变量是否填写正确，然后重新 Deploy。

## 常见问题

### Vercel 上为什么没有读取我的本地 .env.local？

`.env.local` 只在你自己的电脑上生效。Vercel 线上环境需要在 Vercel Project Settings 里单独添加环境变量。

### 添加环境变量后页面还是没变化？

环境变量通常需要重新 Deploy 才会进入新的线上构建。请在 Vercel 中触发一次 Redeploy。

### 没有配置 Supabase 环境变量，页面可以正常吗？

可以。当前项目保留了 `mockData` fallback，Supabase 未配置或读取失败时，页面会继续使用本地假数据。

### 收藏为什么不能跨设备同步？

当前收藏功能使用 `localStorage`。localStorage 是浏览器本地存储，只保存在当前浏览器中，不会同步到其他设备。

### 当前生成菜谱是真 AI 吗？

不是。当前首页生成流程是 Local Demo，只模拟从链接生成宫保鸡丁的流程。
