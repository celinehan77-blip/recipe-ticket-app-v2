# Supabase SQL Setup

本目录用于后续接入 Supabase 前的数据库准备。

当前只提供 SQL 文件，不会自动连接数据库，也不会改变现有前端逻辑。

## 文件用途

- `schema.sql`：创建数据库表、索引和基础 RLS 权限策略。
- `seed.sql`：插入当前 MVP 的初始 mock 数据。
- `README.md`：说明如何在 Supabase 后台执行 SQL。

## 执行位置

在 Supabase Dashboard 中执行：

1. 打开 Supabase 项目。
2. 进入左侧菜单的 SQL Editor。
3. 新建 Query。
4. 粘贴 SQL 文件内容并运行。

## 执行顺序

请按顺序执行：

1. 先执行 `schema.sql`
2. 再执行 `seed.sql`

原因：
- `schema.sql` 会先创建表结构。
- `seed.sql` 依赖这些表，负责插入初始数据。

## 当前状态

当前还没有接入前端。

也就是说：
- 前端仍然使用 `src/lib/mockData.ts`。
- 收藏功能仍然使用 `localStorage`。
- 生成任务仍然使用本地模拟逻辑。
- 没有创建 Supabase client。
- 没有真实 API。
- 没有连接真实数据库。
- 没有接 AI API。

## 后续才会做的事

后续阶段才会逐步：

1. 创建 Supabase 项目。
2. 执行 `schema.sql` 和 `seed.sql`。
3. 配置前端环境变量。
4. 创建 Supabase client。
5. 将 `mockData` 替换为 Supabase 数据。
6. 将收藏从 `localStorage` 切换到 `favorites` 表。
7. 将生成任务从 `localStorage` 切换到 `generation_tasks` 表。
8. 接入 AI 解析接口。

## 后续需要的环境变量

未来接入前端时需要配置：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

注意：
- 本轮不创建 `.env` 文件。
- 不要把真实密钥提交到 Git。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是前端可用的匿名 key，但仍需要配合 RLS 策略保护数据。

## 关于 RLS

RLS 是 Supabase 的行级权限控制，用来限制用户只能访问自己有权限的数据。

当前 `schema.sql` 已经为这些表开启基础 RLS：

- `profiles`
- `recipes`
- `favorites`
- `generation_tasks`

当前 `stations`、`ingredients`、`recipe_steps` 暂时保持公开读取思路，方便展示公开 mock 菜谱。后续如果要支持私有菜谱或草稿菜谱，再收紧这些表的权限。

