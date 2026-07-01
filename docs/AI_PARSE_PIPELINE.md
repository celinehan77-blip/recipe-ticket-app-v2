# AI Parse Pipeline

## 1. 当前阶段目标

- 先搭建菜谱解析接口骨架。
- 当前默认使用 Mock Parser。
- 当前不接真实小红书 / 抖音解析。
- 当前不调用 OpenAI、DeepSeek、Qwen 或其他真实 AI Provider。
- 当前不写入数据库，也不创建真实 recipe。

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
-> mockRecipeParser()
-> 返回结构化草稿
```

当前 Mock Parser 会根据输入文本中的关键词返回稳定草稿：

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
DEEPSEEK_API_KEY=
OPENAI_API_KEY=
QWEN_API_KEY=
AI_PROVIDER=mock
```

## 7. 后续阶段

- 接入真实 AI Provider。
- 首页生成流程调用 parse API。
- 生成真实 recipe draft。
- 用户确认后保存到 Supabase。
- 最后再处理小红书 / 抖音链接解析。

## 8. 首页生成流程接入 parse API

当前首页生成流程已经接入解析接口，但仍然保持原 MVP 的固定结果页：

```text
首页输入
-> POST /api/parse-recipe
-> 保存 latest parsed draft
-> 创建 generation task
-> loading
-> 暂时进入 /recipe/kung-pao-chicken
```

说明：

- 当前不会创建真实新菜谱。
- 当前不会写入 Supabase `recipes`。
- 当前仍然使用 Mock Parser。
- 当前 `ParsedRecipeDraft` 只保存在当前浏览器的 `localStorage`。
- 后续阶段会把 draft 转换并保存为真实 recipe。
- 如果解析接口失败、超时或返回不完整，首页会 fallback 到原有 mock 生成流程。
