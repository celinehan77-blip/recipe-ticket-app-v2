# Supabase Integration

## 当前状态

- 前端页面仍然使用 `mockData + localStorage`。
- `supabase/schema.sql` 和 `supabase/seed.sql` 已准备。
- 本轮只新增 Supabase SDK、client 和数据读取草稿。
- 页面还没有读取 Supabase。
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

1. 先让 stations 从 Supabase 读取。
2. 再让 recipes 从 Supabase 读取。
3. 再让 recipe details 从 Supabase 读取。
4. 再把 favorites 从 localStorage 切换到 Supabase。
5. 再把 generation tasks 从 localStorage 切换到 Supabase。
6. 最后再做登录和 AI 解析。

## 注意事项

- 不要提交 `.env.local`。
- 不要把真实 key 写进代码。
- 没有配置 Supabase 时，项目应该继续用 `mockData` 正常运行。
- Supabase 接入要分阶段推进，不要一次性替换所有页面。
- UI 页面不应该直接 import Supabase client，应优先通过 `src/lib/data/` 读取数据。
