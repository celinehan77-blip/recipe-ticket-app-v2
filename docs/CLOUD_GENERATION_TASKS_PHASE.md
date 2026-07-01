# Cloud Generation Tasks Phase

## 1. 当前生成任务策略

- 未登录：生成任务继续保存在 `localStorage`。
- 已登录：生成任务优先写入 Supabase `generation_tasks`。
- Supabase 失败：fallback 到 `localStorage`，不阻塞首页生成、loading 和菜谱详情跳转。

## 2. 当前仍然是模拟生成

- 首页仍然只是接收用户粘贴的链接。
- Loading 结束后仍然进入固定菜谱 `kung-pao-chicken`。
- 当前不会根据链接内容生成真实新菜谱。

## 3. 当前不接 AI

- 本阶段不调用 AI 模型。
- 不做食材识别、步骤生成、口味分析或自动结构化菜谱。
- `generation_tasks` 只是为后续 AI 流程准备任务状态记录。

## 4. 当前不解析真实小红书 / 抖音

- 不抓取小红书或抖音内容。
- 不解析真实视频、图文或评论。
- `source_url` 只作为用户输入记录保存。

## 5. 为什么先做 generation_tasks

- 以后 AI 解析需要任务状态，例如 `processing`、`completed`、`failed`。
- Loading 页面需要知道生成任务是否完成。
- 用户后续会需要生成历史和多设备同步。
- 先打通任务记录，可以在不改变当前 MVP 体验的前提下，为真实生成能力铺底。

## 6. 后续阶段

- 接入 AI 解析。
- 让 `generation_tasks` 从 `processing` 进入 `completed` 或 `failed`。
- 生成真实 recipe，而不是固定跳转 `kung-pao-chicken`。
- 增加失败兜底与错误提示。
- 增加生成历史列表。
