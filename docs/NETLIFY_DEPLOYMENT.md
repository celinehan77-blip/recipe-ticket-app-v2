# Netlify 部署说明

本文档用于 Recipe Ticket / 日食笔记 的 Netlify 部署和线上检查。

Netlify 是当前备用部署平台，与 Vercel 连接同一个 GitHub 仓库。Netlify Credits 暂停时不删除站点或配置，额度恢复后可继续从 `main` 部署。

## 当前部署信息

- 部署平台：Netlify
- GitHub 仓库：`celinehan77-blip/recipe-ticket-app-v2`
- Netlify 项目名：`recipe-ticket-app-v2`
- 构建命令：`npm run build`
- 发布目录：`.next`
- Next.js 插件：`@netlify/plugin-nextjs`

## 部署步骤

### Step 1：打开 Netlify

打开：

```text
https://app.netlify.com
```

### Step 2：使用 GitHub 登录

使用 GitHub 账号登录 Netlify，并允许 Netlify 访问项目仓库。

### Step 3：Import Git Repository

选择：

```text
Add new site -> Import an existing project
```

然后选择 GitHub 仓库：

```text
celinehan77-blip/recipe-ticket-app-v2
```

### Step 4：确认构建配置

项目根目录已有 `netlify.toml`，Netlify 会读取以下配置：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

这些配置告诉 Netlify 按 Next.js 项目构建，而不是只发布仓库源文件。

### Step 5：添加环境变量

进入：

```text
Netlify -> recipe-ticket-app-v2 -> Site configuration -> Environment variables
```

添加：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

注意：

- `NEXT_PUBLIC_SUPABASE_URL` 应该是 Supabase 项目根 URL。
- 不要填成 `/rest/v1/` 结尾的 REST API URL。
- 不要把真实 URL 和 key 写进 GitHub。
- 不要把真实 URL 和 key 写进 README 或文档。

如果要在线上启用 DeepSeek 解析，还需要继续添加服务端 AI 环境变量：

```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

注意：

- `DEEPSEEK_API_KEY` 是服务端密钥，不要使用 `NEXT_PUBLIC_`。
- 不要把真实 DeepSeek key 写进 GitHub、README 或文档。
- `DEEPSEEK_BASE_URL` 和 `DEEPSEEK_MODEL` 可根据 DeepSeek 官方文档调整。
- 如果不配置这些变量，线上仍然使用 mock parser。
- 如果真实 AI 调用失败，接口会 fallback 到 mock parser。

小红书视频语音链路还需要按 `.env.example` 配置火山 ASR、阿里备用 ASR 和 `ASR_PROVIDER`。这些变量不会从 Vercel 自动同步到 Netlify。

### Step 6：添加环境变量后重新部署

环境变量添加或修改后，必须重新部署。

可以在 Netlify 后台点击：

```text
Deploys -> Trigger deploy -> Deploy site
```

如果怀疑缓存影响，可以选择：

```text
Trigger deploy -> Clear cache and deploy site
```

## 线上页面检查

部署完成后检查这些路径：

- `/`
- `/flavor-map`
- `/station/chicken`
- `/station/pasture`
- `/station/seafood`
- `/recipe/kung-pao-chicken`
- `/recipe/beef-stew`
- `/recipe/steamed-fish`
- `/favorites`
- `/me`
- `/search`
- `/loading`

预期结果：

- 页面返回 `200`
- 不出现 `404`
- 不出现 `500`
- 不出现 Next.js server error
- 页面视觉不发生明显变化

## 如何判断 Supabase 是否生效

项目提供一个安全诊断接口：

```text
/api/deploy-health
```

这个接口只返回：

- Supabase 是否配置
- `stations` 数量
- `recipes` 数量
- 表是否可读
- fallback 是否保留

它不会返回 Supabase URL、anon key 或任何真实环境变量。

线上预期：

```json
{
  "supabaseConfigured": true,
  "stationsCount": 3,
  "recipesCount": 9,
  "stationsReadable": true,
  "recipesReadable": true,
  "fallbackRetained": true
}
```

如果 `supabaseConfigured` 是 `false`，说明 Netlify 环境变量没有进入线上构建。

如果 `supabaseConfigured` 是 `true`，但数量是 `0`，请检查：

- Supabase URL 是否填成项目根 URL
- anon key 是否复制正确
- `stations` / `recipes` 表是否有 seed 数据
- RLS 是否允许公开只读
- SQL 是否成功执行

## 当前阶段说明

- Supabase 目前只读接入 `stations / recipes` 相关数据。
- Supabase Auth 已接入邮箱 Magic Link 登录基础版。
- 收藏功能仍然使用 `localStorage`。
- 首页生成任务仍然使用 `localStorage`。
- 当前生成流程仍然是模拟生成，不是真 AI。
- 如果 Supabase 不可用，页面会继续 fallback 到 `mockData`。

如果线上页面能打开但数据看起来没有变化，可能只是 Supabase 数据和 mockData 内容接近，也可能是仍在 fallback。请优先检查 `/api/deploy-health`。

## Supabase Auth URL 配置

Magic Link 登录需要 Supabase 后台允许回调地址。

请进入 Supabase：

```text
Authentication -> URL Configuration
```

建议配置：

```text
Site URL:
https://recipe-ticket-app-v2.netlify.app
```

Redirect URLs:

```text
https://recipe-ticket-app-v2.netlify.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

如果你修改了这些 URL 配置，需要重新测试登录。

登录相关页面：

- `/login`
- `/auth/callback`

当前登录只用于识别用户身份。收藏和生成任务仍然使用当前浏览器的 `localStorage`，不会跨设备同步。
