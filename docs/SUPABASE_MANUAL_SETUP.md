# Supabase 手动创建项目与执行 SQL 操作说明

这份文档给不写代码的人使用。你可以照着步骤在 Supabase 网站里手动创建数据库，并执行项目里已经准备好的 SQL 文件。

Supabase 是一个后端服务平台，用来管理数据库、登录、文件存储等。本项目现在只先用它准备数据库。

## 现在为什么要创建 Supabase 项目

Recipe Ticket 现在已经有完整的前端页面、mockData 假数据和 localStorage 本地收藏。

下一阶段如果要接真实数据库，就需要先有一个 Supabase 项目。现在先把数据库建好，后面再逐步把页面数据源从 mockData 切到 Supabase。

当前阶段请记住三点：

1. 前端页面仍然使用 `mockData`。
2. 收藏和模拟生成任务仍然使用 `localStorage`。
3. 本轮只是把数据库结构和初始数据准备好，页面看起来不会变化。

## 操作前准备

你需要准备：

- 一个 Supabase 账号。
- 当前项目代码目录：`/Users/celine/Workspace/recipe-ticket-app-v2`
- 两个 SQL 文件：
  - `supabase/schema.sql`
  - `supabase/seed.sql`

SQL 是数据库执行脚本，用来创建表和插入初始数据。

## Step 1：创建 Supabase 项目

1. 打开 Supabase 官网：https://supabase.com
2. 登录你的账号。
3. 点击 `New project`。
4. 选择一个 Organization。
5. 填写 Project name，例如：

```text
recipe-ticket-app-v2
```

6. 设置 Database Password。
7. Region 选择离你或主要用户较近的区域。
8. 点击创建项目。
9. 等待 Supabase 初始化完成。

如果页面提示项目还在创建中，先等几分钟，不要重复创建。

## Step 2：打开 SQL Editor

1. 进入刚刚创建的 Supabase 项目。
2. 在左侧菜单找到 `SQL Editor`。
3. 点击 `New query`。

SQL Editor 是 Supabase 里执行数据库脚本的地方。

## Step 3：复制 `supabase/schema.sql` 并执行

1. 在本地项目中打开：

```text
supabase/schema.sql
```

2. 全选文件内容并复制。
3. 回到 Supabase 的 SQL Editor。
4. 粘贴到新建 Query 里。
5. 点击 `Run`。
6. 等待执行完成。

`schema.sql` 的作用是创建数据库表、索引和基础权限策略。

执行成功后，通常会看到成功提示。如果看到红色报错，不要继续执行 seed，先看下方“常见错误说明”。

## Step 4：复制 `supabase/seed.sql` 并执行

1. 在 SQL Editor 里再点击一次 `New query`。
2. 在本地项目中打开：

```text
supabase/seed.sql
```

3. 全选文件内容并复制。
4. 粘贴到 Supabase SQL Editor。
5. 点击 `Run`。
6. 等待执行完成。

`seed.sql` 的作用是插入初始数据，例如驿站、菜谱、食材和步骤。

请先执行 `schema.sql`，再执行 `seed.sql`。顺序反了会失败，因为数据表还不存在。

## Step 5：打开 Table Editor 检查数据

1. 在 Supabase 左侧菜单点击 `Table Editor`。
2. 检查是否能看到这些表：
   - `stations`
   - `recipes`
   - `ingredients`
   - `recipe_steps`
3. 打开 `stations` 表，确认里面有：
   - `chicken`
   - `pasture`
   - `seafood`
4. 打开 `recipes` 表，确认里面有 9 道初始菜谱。

如果能看到这些表和数据，说明数据库准备成功。

## Step 6：复制 Project URL 和 anon key

1. 在 Supabase 左侧菜单点击 `Project Settings`。
2. 点击 `API`。
3. 找到 `Project URL`。
4. 复制这个 URL。
5. 继续在同一页找到 `Project API keys`。
6. 找到 `anon public` key。
7. 复制这个 anon public key。

Project URL 是前端连接 Supabase 项目的地址。

anon public key 是前端访问 Supabase 的公开 key。它可以放在前端环境变量里，但必须配合数据库权限策略使用。

## Step 7：创建 `.env.local`

在项目根目录创建一个文件：

```text
.env.local
```

项目根目录是：

```text
/Users/celine/Workspace/recipe-ticket-app-v2
```

`.env.local` 文件内容应该是：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

示例说明：

- `你的 Supabase Project URL` 替换成 Supabase 后台复制的 Project URL。
- `你的 Supabase anon public key` 替换成 Supabase 后台复制的 anon public key。
- 不要把真实 URL 和 key 写进 `.env.example`。
- 不要把真实 URL 和 key 写进代码。
- 不要提交 `.env.local`。

`.env.local` 是本机私密配置文件，用来保存当前电脑上的环境变量。环境变量就是项目运行时读取的配置，例如数据库地址和 key。

## 为什么 `.env.local` 不能提交到 git

git 是代码版本管理工具，用来保存和共享代码历史。

`.env.local` 里可能包含真实项目地址、API key 或其他敏感信息。如果提交到 git，别人可能看到你的项目 key。

所以：

- `.env.local` 只放在你自己的电脑里。
- `.env.example` 只放变量名称，不放真实值。
- 真实 key 不写进页面代码。

## Step 8：重启本地项目

如果你已经在运行：

```bash
npm run dev
```

请先停止，再重新运行：

```bash
npm run dev
```

重启的原因是：Next.js 只会在启动时读取 `.env.local`。如果不重启，新写入的环境变量可能不会生效。

Next.js 是当前前端框架，用来运行网页应用。

## Step 9：确认前端仍然正常打开

重启后打开本地页面，例如：

```text
http://localhost:3000
```

你应该看到当前 Recipe Ticket 页面正常打开。

注意：页面看起来不会变化，这是正常的。

原因是当前前端仍然读取：

- `mockData`
- `localStorage`

还没有把页面数据源切换到 Supabase。

## 执行后检查清单

- [ ] Supabase 项目已创建
- [ ] `schema.sql` 已执行成功
- [ ] `seed.sql` 已执行成功
- [ ] Table Editor 能看到 `stations` 表
- [ ] Table Editor 能看到 `recipes` 表
- [ ] Table Editor 能看到 `ingredients` 表
- [ ] Table Editor 能看到 `recipe_steps` 表
- [ ] `stations` 里有 `chicken / pasture / seafood`
- [ ] `recipes` 里有 9 道初始菜谱
- [ ] `.env.local` 已创建
- [ ] `npm run dev` 已重启
- [ ] 前端页面仍然能正常打开
- [ ] 当前页面仍然使用 `mockData`，视觉不变化

## 常见错误说明

### 1. `schema.sql` 执行失败怎么办

先看 Supabase SQL Editor 里的红色报错。

常见原因：

- 没有复制完整 SQL。
- 在错误的 Supabase 项目里执行。
- Supabase 项目还没有初始化完成。
- 同一段 SQL 被手动改过，导致语法错误。

处理方式：

1. 重新打开本地 `supabase/schema.sql`。
2. 全选并重新复制。
3. 在 SQL Editor 新建 Query。
4. 重新粘贴并执行。

如果提示某些表已经存在，通常说明之前执行过一部分。当前 `schema.sql` 使用了 `if not exists`，多数情况下可以重新执行。

### 2. `seed.sql` 执行失败怎么办

常见原因：

- 没有先执行 `schema.sql`。
- `schema.sql` 没有执行成功。
- 没有复制完整 `seed.sql`。
- 手动修改过 seed 内容。

处理方式：

1. 先确认 Table Editor 里已经有 `stations` 和 `recipes` 表。
2. 如果没有，回到 Step 3 重新执行 `schema.sql`。
3. 再新建 Query，重新复制并执行 `seed.sql`。

如果提示重复数据，通常说明 seed 已经执行过。当前 seed 使用了冲突保护，重复执行一般不会插入重复菜谱。

### 3. 找不到 anon key 怎么办

在 Supabase Dashboard 里进入：

```text
Project Settings → API
```

然后找：

```text
Project API keys → anon public
```

如果 Supabase 页面菜单有变化，可以在项目设置里搜索 `API` 或 `anon`。

### 4. `.env.local` 创建后页面没变化是不是正常

正常。

本轮只是准备数据库和环境变量。当前页面还没有读取 Supabase，所以视觉、内容、交互都不会变化。

如果页面正常打开，说明本地项目没有被破坏。

### 5. 为什么现在还没有读取 Supabase

因为当前阶段目标是降低风险：

1. 先把数据库建好。
2. 确认 SQL 和初始数据没问题。
3. 再单独做页面数据源切换。

这样如果后面出问题，更容易判断是数据库问题，还是前端切换数据源的问题。

### 6. 如果 `npm run dev` 没重启会怎样

如果不重启，Next.js 可能读不到新创建的 `.env.local`。

表现可能是：

- 页面仍然能打开，但环境变量没有生效。
- 后续连接 Supabase 时提示 URL 或 key 缺失。

所以创建或修改 `.env.local` 后，请重新运行：

```bash
npm run dev
```

## 本轮完成后应该是什么状态

- Supabase 项目已经创建。
- 数据库表已经建好。
- 初始数据已经插入。
- `.env.local` 已经在你本机准备好。
- 前端页面仍然使用 `mockData + localStorage`。
- 页面视觉和交互没有任何变化。
