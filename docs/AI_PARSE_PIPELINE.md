# AI Parse Pipeline

## 1. 当前阶段目标

- 先搭建菜谱解析接口骨架。
- 当前默认使用 Mock Parser。
- 当前已接入 DeepSeek Provider 稳定性优化版。
- 当前不接真实小红书 / 抖音解析。
- 当前不调用 OpenAI、Qwen。
- 当前 `ParsedRecipeDraft` 已可以尝试保存为真实 Supabase recipe。

## 2. 输入

`POST /api/parse-recipe` 接收 JSON：

```json
{
  "sourceUrl": "https://example.com/mock-note",
  "rawText": "宫保鸡丁，鸡腿肉切丁，花生，大葱，酸甜微辣。",
  "sourcePlatform": "manual"
}
```

字段说明：

- `sourceUrl`：可选，用户粘贴的来源链接。
- `rawText`：可选，用户粘贴的普通菜谱文本。
- `sourcePlatform`：可选，支持 `xiaohongshu`、`douyin`、`manual`、`mock`。

`sourceUrl` 和 `rawText` 不能同时为空。

输入边界：

- `sourceUrl` 最多 2048 个字符。
- `rawText` 最多 30000 个字符。
- 超限请求会直接拒绝，不会进入付费 Provider。

## 3. 输出

接口返回 `RecipeParseResult`，其中核心结果是 `ParsedRecipeDraft`：

- `titleZh`
- `titleEn`
- `description`
- `timeMinutes`
- `difficulty`
- `flavor`
- `mainIngredient`
- `tags`
- `ingredients`
- `seasonings`
- `steps`
- `confidence`
- `warnings`

## 4. 当前流程

```text
POST /api/parse-recipe
-> parseRecipeInput()
-> 根据 AI_PROVIDER 选择 provider
-> AI_PROVIDER=deepseek 且 DEEPSEEK_API_KEY 存在时调用 DeepSeek
-> 使用 JSON Output + 非思考模式，记录 finish reason 和 Token usage
-> 对 408 / 429 / 5xx、网络失败、超时、空内容、截断和非法 JSON 做受控重试
-> DeepSeek 成功时返回 ParsedRecipeDraft
-> DeepSeek 失败、超时、未配置 key 或输出不合法时 fallback 到 mockRecipeParser()
-> 返回结构化草稿
```

当前 DeepSeek Provider 使用官方 OpenAI-compatible Chat Completions 接口。

Mock Parser 会根据输入文本中的关键词返回稳定草稿：

- `宫保`、`鸡丁`、`kung pao`：宫保鸡丁。
- `牛肉`、`beef`：土豆炖牛肉。
- `鱼`、`fish`：清蒸鱼。
- 无法识别时：默认宫保鸡丁，并在 `warnings` 中说明当前使用 Mock Parser。

## 5. 为什么先不接爬虫

- 链接平台复杂。
- 小红书 / 抖音内容获取不稳定。
- 链接解析需要失败兜底和合规判断。
- 当前 MVP 更需要先保证 AI 菜谱结构化能力和接口格式稳定。

## 6. 为什么 AI key 不能用 NEXT_PUBLIC

- `NEXT_PUBLIC_` 环境变量会暴露到浏览器。
- AI key 是服务端密钥，不能被用户看到。
- 真实 AI Provider 只能在服务端 API route 中调用。

当前预留环境变量：

```env
AI_PROVIDER=mock

DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=30000
DEEPSEEK_MAX_RETRIES=1
DEEPSEEK_MAX_TOKENS=3000

OPENAI_API_KEY=
OPENAI_MODEL=

QWEN_API_KEY=
QWEN_MODEL=
```

说明：

- 默认 `AI_PROVIDER=mock`，不需要真实 AI key。
- 如果设置 `AI_PROVIDER=deepseek`，并填写 `DEEPSEEK_API_KEY`，服务端会尝试调用 DeepSeek。
- `DEEPSEEK_BASE_URL` 和 `DEEPSEEK_MODEL` 可根据 DeepSeek 官方文档调整。
- `DEEPSEEK_TIMEOUT_MS` 限制单次请求等待时间，代码会约束在 5–60 秒。
- `DEEPSEEK_MAX_RETRIES` 默认 1，代码会约束在 0–2；重试可能增加费用。
- `DEEPSEEK_MAX_TOKENS` 默认 3000，代码会约束在 1000–8000。
- 所有 AI key 都是服务端密钥，不能使用 `NEXT_PUBLIC_` 前缀。
- Netlify 部署时需要在 Netlify Environment Variables 中添加这些服务端环境变量。

## 7. 后续阶段

- 使用真实样本验证 DeepSeek 质量、Token 成本和响应时间。
- 首页生成流程调用 parse API。
- 生成真实 recipe draft。
- 用户确认后保存到 Supabase。
- 最后再处理小红书 / 抖音链接解析。

## 8. 首页生成流程接入 parse API

当前首页生成流程已经接入解析接口，并会尝试把 draft 保存为真实 Supabase recipe：

```text
首页输入
-> POST /api/parse-recipe
-> 保存 latest parsed draft
-> 创建 generation task
-> 尝试写入 Supabase recipes / ingredients / recipe_steps
-> 保存 latestGeneratedRecipeSlug
-> loading
-> 进入 /recipe/[latestGeneratedRecipeSlug]
```

说明：

- 默认 Mock Parser 可以创建演示菜谱；配置 DeepSeek 后可以基于真实 AI draft 创建菜谱。
- 如果 `AI_PROVIDER=deepseek` 且 key 配置正确，可以基于 DeepSeek draft 创建真实菜谱。
- 当前会尝试写入 Supabase `recipes / ingredients / recipe_steps`。
- 当前默认仍然使用 Mock Parser。
- 当前不会调用 OpenAI / Qwen。
- 当前仍然不会解析真实小红书 / 抖音页面。
- 当前 `ParsedRecipeDraft` 仍会保存在当前浏览器的 `localStorage`，作为 fallback。
- 如果 DeepSeek 调用失败、超时、返回不完整，或 Supabase 保存失败，首页会 fallback 到原有 mock 生成流程。
- 后续阶段会继续复用同一套保存流程，并增强真实 AI 输出质量。

## 9. 稳定性与诊断

`RecipeParseResult.diagnostics` 在尝试真实 Provider 时包含：

- `attemptedProvider`：实际尝试的 Provider，即使最终 fallback 到 Mock 也会保留。
- `model`：请求或响应使用的模型名。
- `durationMs`：从开始尝试到返回结果的总耗时。
- `attemptCount`：实际调用次数。
- `finishReason`：模型停止输出的原因；`length` 会被视为截断失败。
- `usage`：prompt、completion 和 total Token 数，用于成本观察。

DeepSeek 官方说明 JSON Output 仍可能偶发返回空内容，因此当前实现会在配置范围内重试，然后安全 fallback。Prompt 会把用户内容标记为数据，忽略其中改变角色、泄露提示词或输出非菜谱内容的指令。

开发页 `/dev/parse-test` 会展示上述诊断信息。生产首页只消费稳定的 `draft / provider / usedFallback / error` 合约，不暴露 Secret。
