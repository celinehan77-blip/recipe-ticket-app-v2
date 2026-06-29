# Next Backend Steps

本文件记录 Recipe Ticket 从当前前端 MVP 走向 Supabase（后端数据库服务）和 AI 解析的后续阶段路线。本轮只做规划，不做实现。

## 阶段 1：当前状态

当前状态：前端 MVP + `mockData` + `localStorage`。

已具备：
- 首页粘贴链接并进入模拟生成流程。
- Loading 页面模拟生成完成。
- 菜谱详情页。
- 风味地图和动态 Station 页面。
- 收藏页。
- 我的页本地数据汇总。
- 搜索入口和搜索页面保留。

验收标准：
- `npm run build` 通过。
- `npm run lint` 通过。
- 不接后端也能完整演示核心 MVP。

## 阶段 2：创建 Supabase 项目

目标：创建独立 Supabase 项目，用于保存未来真实数据。

要做：
- 创建 Supabase 项目。
- 确认项目区域、免费额度、数据库连接方式。
- 准备本地 `.env.local` 所需变量，但不要提交真实密钥。

验收标准：
- Supabase 项目创建成功。
- 能进入 Supabase Dashboard。
- 明确项目 URL 和 anon key 的保存位置。

## 阶段 3：根据 DATABASE_SCHEMA.md 建表

目标：按照 `docs/DATABASE_SCHEMA.md` 创建数据库表。

要做：
- 创建 `users`、`stations`、`recipes`、`ingredients`、`recipe_steps`、`favorites`、`generation_tasks`。
- 添加主键、外键、唯一约束和基础索引。
- 暂时只做 MVP 必需字段，不扩展复杂社交、评论、计划等功能。

验收标准：
- 所有表创建完成。
- 表关系能覆盖当前 MVP 数据。
- 不影响当前前端运行。

## 阶段 4：把 mockData 导入 Supabase 作为初始数据

目标：把当前 `mockData` 转换为数据库初始数据。

要做：
- 将 `mockData.stations` 导入 `stations`。
- 将 `mockData.recipes` 导入 `recipes`。
- 将 `recipe.ingredients` 和 `recipe.seasonings` 导入 `ingredients`。
- 将 `recipe.steps` 导入 `recipe_steps`。

验收标准：
- Supabase 中能看到当前三张驿站票根。
- Supabase 中能看到当前 MVP 菜谱。
- 每道菜能查到对应食材和步骤。

## 阶段 5：前端读取 Supabase 数据，替换 mockData

目标：让前端页面从 Supabase 读取数据，而不是直接依赖 `mockData`。

要做：
- 先替换风味地图数据来源。
- 再替换 Station 菜谱列表数据来源。
- 再替换菜谱详情数据来源。
- 保留 UI、布局、动画和页面跳转不变。

验收标准：
- `/flavor-map` 正常展示驿站。
- `/station/[slug]` 正常展示该分类下菜谱。
- `/recipe/[slug]` 正常展示菜谱详情。
- 删除或停用 `mockData` 不会破坏核心页面。

## 阶段 6：收藏功能从 localStorage 切换到 Supabase

目标：收藏记录从浏览器本地迁移到 `favorites` 表。

要做：
- 登录体系完成前，可先使用临时用户或测试用户。
- `加入收藏` 写入 `favorites`。
- `取消收藏` 删除 `favorites`。
- `/favorites` 从 API 读取收藏列表。
- `/me` 从 API 读取收藏数量和最近收藏。

验收标准：
- 刷新页面后收藏仍保留。
- 换浏览器或设备登录后，能看到同一用户收藏。
- 重复点击不会产生重复收藏记录。

## 阶段 7：生成任务从 localStorage 切换到 generation_tasks 表

目标：把当前模拟生成任务替换成真实任务记录。

要做：
- 首页提交链接后创建 `generation_tasks`。
- Loading 页面读取任务状态。
- 任务完成后跳转到生成出的菜谱详情。
- 任务失败时展示明确失败原因和可重试入口。

验收标准：
- `pending`、`processing`、`completed`、`failed` 四种状态可被前端识别。
- 成功任务能关联 `generated_recipe_id`。
- 失败任务能保存 `error_message`。

## 阶段 8：接入 AI 解析接口

目标：后端调用 AI，把链接内容解析成菜谱结构。

要做：
- 定义 AI 输出 JSON 格式。
- 校验 AI 输出是否包含菜名、食材、步骤、时间、难度等字段。
- 将解析结果写入 `recipes`、`ingredients`、`recipe_steps`。
- 保留人工兜底或失败提示。

验收标准：
- AI 输出能稳定转成数据库记录。
- 异常输出不会写入脏数据。
- 前端仍通过同一套菜谱详情页展示结果。

## 阶段 9：处理小红书 / 抖音链接解析与失败兜底

目标：处理真实平台链接可能失败、不完整或无法访问的问题。

要做：
- 判断来源平台。
- 处理无法抓取、链接失效、内容过少、权限限制等情况。
- 允许用户手动补充菜名或关键内容。
- 记录失败原因，避免 Loading 页面无限等待。

验收标准：
- 失败时用户能知道原因。
- 失败任务写入 `generation_tasks.failed`。
- 不因为单个平台解析失败影响其他核心流程。

## 阶段 10：最终视觉 QA 与上线准备

目标：在后端接入后做完整质量检查和上线准备。

要做：
- 检查所有页面在真实数据下是否溢出、错位或空状态异常。
- 检查生成、浏览、收藏、我的页闭环。
- 检查环境变量、错误提示、加载状态和空状态。
- 准备部署平台，例如 Vercel。

验收标准：
- 核心流程可在真实数据下完整跑通。
- build 和 lint 通过。
- 本地预览和线上预览都可访问。
- 不暴露 Supabase 密钥或 AI API 密钥。

## 当前阶段不要做

- 不接 Supabase。
- 不创建真实 API。
- 不写数据库连接。
- 不接 AI API。
- 不做小红书 / 抖音解析。
- 不新增登录。
- 不修改页面 UI。
- 不修改现有页面跳转。

