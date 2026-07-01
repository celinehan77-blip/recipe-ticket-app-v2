# Parsed Draft Flow

## 1. ParsedRecipeDraft 是什么

`ParsedRecipeDraft` 是 AI 菜谱解析后的临时结构化草稿。

它包含：

- 菜谱标题、描述、耗时、难度、风味、主食材。
- 标签。
- 食材、调味料、步骤。
- `confidence` 和 `warnings`。

它不是正式 recipe，也不是数据库记录。

## 2. 为什么先保存草稿，不直接写数据库

- 当前仍然使用 Mock Parser，不是真实 AI 输出。
- 用户还没有确认解析结果是否正确。
- 真实保存需要处理 recipe、ingredients、recipe_steps 多张表。
- 直接写数据库会扩大 MVP 风险。
- 当前阶段只验证“首页能经过解析接口并获得结构化草稿”。

## 3. 当前草稿保存位置

当前最近一次 `ParsedRecipeDraft` 保存在当前浏览器的 `localStorage`。

本地 key：

```text
recipe-ticket:latest-parsed-draft
```

相关工具：

- `saveLatestParsedDraft(draft)`
- `getLatestParsedDraft()`
- `clearLatestParsedDraft()`

## 4. 后续如何变成真实 recipe

后续阶段可以按这个顺序推进：

1. 首页调用真实 AI Provider 得到 draft。
2. 展示 draft 给用户确认。
3. 用户确认后，把 draft 转换为正式 recipe 数据。
4. 写入 Supabase `recipes`。
5. 写入 Supabase `ingredients` 和 `recipe_steps`。
6. 生成真实动态详情页。

## 5. 草稿失败时如何 fallback

如果解析接口返回 400、500、网络失败、超时、draft 不完整，或者 `localStorage` 不可用：

- 首页不会阻塞用户。
- 继续创建原有 mock generation task。
- 继续进入 `/loading`。
- loading 后仍然进入 `/recipe/kung-pao-chicken`。
- 不写入 Supabase `recipes`。
- 不创建真实新菜谱。
