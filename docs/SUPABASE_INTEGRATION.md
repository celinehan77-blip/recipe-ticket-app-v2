# Supabase Integration

## 当前状态

- 前端公共菜谱数据已支持 Supabase 只读读取。
- Supabase 不可用时，页面会 fallback 到 `mockData`。
- 收藏、生成任务和最近活动仍然使用 `localStorage`。
- 已新增 Supabase Auth 登录基础版，先使用邮箱 Magic Link。
- 没有配置 Supabase 环境变量时，项目应该继续正常运行。

## 手动创建 Supabase 项目

1. 打开 Supabase，创建新项目。
2. 进入 SQL Editor。
3. 先执行 `supabase/schema.sql`。
4. 再执行 `supabase/seed.sql`。
5. 在 Supabase 项目设置中获取 Project URL。
6. 获取 anon public key。
7. 在本地创建 `.env.local`。
8. 填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env.local` 只放在本地，不要提交到代码仓库。

## 后续正式接入顺序

1. 验证 Supabase Auth 登录稳定。
2. 登录完成后，再把 favorites 从 localStorage 切换到 Supabase。
3. 再把 generation tasks 从 localStorage 切换到 Supabase。
4. 最后再做 AI 解析和真实链接解析。

## Auth 登录配置

当前登录方式：

- 邮箱 Magic Link
- 不做密码登录
- 不做第三方登录
- 不把收藏和生成任务切到 Supabase

Magic Link 是 Supabase 发送到用户邮箱的一次性登录链接，用户点击链接后完成登录。

Supabase Auth 需要在后台配置 URL：

```text
Authentication -> URL Configuration
```

建议填写：

```text
Site URL:
https://recipe-ticket-app-v2.netlify.app
```

Redirect URLs 建议包含：

```text
https://recipe-ticket-app-v2.netlify.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

本项目已新增：

- 登录页：`/login`
- Auth 回调页：`/auth/callback`

如果 Magic Link 邮件能发送，但点击后没有回到 App，优先检查 Supabase Auth 的 Site URL 和 Redirect URLs。

## profiles 表说明

当前 Supabase 项目已有 `public.profiles` 表，并且 `profiles.id` 引用 `auth.users.id`。

本轮只读取当前用户 profile，不修改表结构。

如果后续希望用户首次登录后自动创建 profile，可以单独补充 `auth.users` 的触发器。但这不属于本轮登录基础版范围。

## 注意事项

- 不要提交 `.env.local`。
- 不要把真实 key 写进代码。
- 没有配置 Supabase 时，项目应该继续用 `mockData` 正常运行。
- Supabase 接入要分阶段推进，不要一次性替换所有页面。
- UI 页面不应该直接 import Supabase client，应优先通过 `src/lib/data/` 读取数据。
- Auth 页面通过 `src/lib/auth/` 调用 Supabase，不直接把 key 写进页面。
- `NEXT_PUBLIC_SUPABASE_URL` 要填写 Supabase 项目根 URL，不要填写 `/rest/v1/` 地址。
