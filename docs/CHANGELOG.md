# Changelog

本文件记录 Recipe Ticket / 日食笔记的重要产品、代码和项目治理变化。

## 2026-07-16

### Vercel / Netlify 双平台兼容

- Vercel Production 已部署 GitHub `main` 提交 `b058dab`，页面、Supabase、DeepSeek、yt-dlp、FFmpeg 和火山 ASR 运行信号通过。
- Vercel 真实小红书样本在 24.9 秒内完成 `yt-dlp -> FFmpeg -> 火山 ASR -> DeepSeek`，返回“黄焖鸡”动态草稿。
- 首页在 Netlify Background Functions 不存在（404/405）时改走 Next.js `/api/parse-recipe`，保留 Netlify 后台任务路径且不重复创建业务实现。
- `/api/parse-recipe` 明确配置 60 秒最长运行时间，并补充双平台环境变量与部署策略文档。

### 小红书公开视频语音转菜谱 Working Release

- 新增小红书分享链接到 `yt-dlp` 的公开媒体解析，只支持小红书且不使用 Cookie。
- Netlify Linux 构建会下载固定版本的 yt-dlp 独立二进制并校验 SHA-256，不依赖函数运行时 Python。
- 媒体通过管道交给 FFmpeg，磁盘只产生随机临时 MP3；成功和失败都会删除临时目录。
- 新增统一 `transcribeAudio()`：火山 Seed ASR 主 Provider，明确失败后才调用阿里 Qwen ASR。
- 新增 transcript 来源一致性与菜谱质量校验；没有真实口播时不根据标题生成假菜谱。
- 新增 source hash 运行期去重和浏览器成功 slug 缓存，降低刷新或重复提交导致的重复付费。
- Loading 保持原设计并使用真实管线阶段数据，完成后跳转动态 recipe slug。
- 首页只负责创建待处理任务并立即进入 Loading；刷新 Loading 可恢复当前任务，不再先等待服务端完成后才展示动画。
- 待处理分享 URL 落盘前移除查询参数和 fragment，原始链接只用于当前内存请求。
- Supabase 表和 RLS 已只读复核，未关闭 RLS、未使用 service role、未修改 schema。

### 真实样本验收

- `一个神秘调料，让你的黄焖鸡有了灵魂！`：媒体和 FFmpeg 成功，Qwen ASR 备用成功，DeepSeek 生成 7 项食材、6 项调料和 9 个步骤。
- `省油版农家一碗香`：浏览器完整流程成功，生成动态 `/recipe/local-recipe-*`，刷新后仍存在，游客收藏页可读取。
- 火山主 ASR 使用真实样本成功：`provider=volcengine`、`model=seed-asr-2.0-turbo`、`usedFallback=false`，DeepSeek 生成“黄焖鸡”并通过质量校验。
- 该真实链路端到端约 16.5 秒；媒体约 5.6 秒，ASR 约 9.1 秒。
- 登录 Session 下普通正文生成已写入真实 `recipes / ingredients / recipe_steps / generation_tasks`，动态详情刷新后仍存在。
- Loading 回归生成 `/recipe/stir-fried-broccoli`；数据库包含 4 项食材、4 个步骤和 1 个已完成任务。
- 完整回归 60 项测试、lint 和 production build 通过；Build 仅保留 Next.js NFT 动态文件追踪警告。

## 2026-07-15

### Milestone 2 数据一致性基础 Checkpoint

- 建立 `Milestone → Phase → Checkpoint → Task` 四级推进与断点续作记录。
- Generation Task 使用当前创建的 Task ID 完成或失败，避免误更新历史任务。
- 解析失败、AI fallback 和云端保存失败会记录安全错误状态，同时保留可用详情页。
- 游客菜谱改为唯一 `local-recipe-*` slug，并在当前浏览器保留最多 50 道本地菜谱。
- 收藏、详情、“我的菜谱”和登录迁移按具体本地 slug 读取，避免新生成覆盖旧收藏。
- 菜谱详情读取到缺失食材或步骤的云端数据时不再视为完整菜谱。
- `/api/parse-recipe` 增加基础请求限流，生产环境默认隐藏开发测试入口。
- 本 Checkpoint 的回滚基线：`a1303b6`。

### 验证

- `npm test`：41 项通过。
- `npm run lint`：通过。
- `npm run build`：通过。
- 浏览器验证：游客正文生成进入唯一动态 slug，详情内容正确，收藏按钮可切换为“已收藏”。
- 下一 Checkpoint：公开小红书 / 抖音分享链接文字提取。

### 公开分享链接文字提取 Working Release

- 新增小红书、`xhslink`、抖音和 `v.douyin` 公开 HTTPS 链接识别。
- 支持最多 3 次同平台短链跳转，并在每一步重新执行域名和公网地址检查。
- 新增 SSRF 防护、8 秒超时、2 MB HTML 上限和 30000 字提取上限。
- 使用 `cheerio` 安全提取 Open Graph、description、JSON-LD、JSON script 和公开页面正文，不执行脚本或 `eval`。
- 支持从“说明文字 + 分享 URL”中提取干净链接，并在保存前移除查询参数和 fragment。
- `/api/parse-recipe` 只有在取得真实公开文字后才调用 DeepSeek；失败返回安全错误分类。
- 首页移除链接硬拦截；抓取失败时停留首页并显示内联中文提示，不生成无关 Mock 菜谱。
- 新增 URL、DNS、重定向、HTML、超时、超大响应和失败分类测试。
- Working Release 回滚基线：`07c54db`。
- 尚未完成：真实小红书 / 抖音分享短链验收。

## 2026-07-14

### AI Software Company 工作流

- 新增 `MASTER_PLAN.md`，作为产品使命、核心体验、设计语言和 MVP 边界的战略最高层。
- 新增 Architect、QA、Reviewer、Release Manager、Knowledge Manager 和 Product Analyst 职责文档。
- 将团队层级更新为：产品负责人 → MASTER_PLAN → ChatGPT（CTO + Product Director）→ Codex（Engineering Manager）。
- 固化十步开发闭环、Working Release、Stable Release、回滚记录和权限门槛。

### DeepSeek 真实解析优化

- 新增可配置的 DeepSeek 超时、受控重试和最大输出 Token。
- 使用 DeepSeek V4 非思考 JSON 模式，并识别 `finish_reason=length` 输出截断。
- 新增 Provider、模型、耗时、尝试次数、finish reason 和 Token usage 诊断。
- fallback 到 Mock 后继续保留真实 Provider 的失败诊断。
- 新增 `sourceUrl` 和 `rawText` 输入长度保护及 Prompt 注入隔离。
- `/dev/parse-test` 增加诊断展示和网络错误状态。

### 验证

- `npm run lint`：通过。
- `npm run build`：通过，包含 TypeScript 检查与应用路由构建。
- `/api/parse-recipe`：Mock 正常输入 200、空输入 400、非法 JSON 400、超长输入 413。
- DeepSeek 不可达模拟：成功 fallback 到 Mock，并保留 diagnostics。
- `/dev/parse-test`：浏览器 Preview 通过。
- Netlify Production `/api/parse-recipe`：HTTP 200，`provider=deepseek`，`usedFallback=false`。
- Netlify Production `/dev/parse-test`：HTTP 200，页面可用于同一接口的开发验证。
- Secret Scan：Netlify 部署记录无 Secret 命中；本地扫描仅发现空值示例、变量名和测试用 `test-key`。

### 解析样本测试体系

- 新增解析质量评分工具，覆盖食材、调料、步骤、火候、时间、标签、描述和置信度。
- 新增 16 条本地解析样本，覆盖详细文本、短文本、噪声文本、口语输入、缺失信息、重复步骤和 Prompt 注入。
- 新增 `npm run test:ai`，用于运行 DeepSeek Provider fallback、Prompt、结构校验和样本质量测试。
- 当前 `npm run test:ai`：23 项通过，不调用真实 DeepSeek API。

## 2026-07-13

### 新增

- 新增 `docs/AI_PROJECT_DIRECTOR.md`，建立项目级永久 AI Project Director 工作流。
- 新增 `docs/ROADMAP.md`，汇总已完成阶段、当前阶段、验收标准和人工依赖。
- 新增 `docs/CHANGELOG.md`，用于持续记录每轮交付。

### 更新

- 在 `README.md` 增加开发前强制阅读入口。
- 在根目录 `AGENTS.md` 增加 Project Director 强制启动规则，使支持仓库指令的 AI 工具进入项目后先读取工作流。
- 修正 `README.md` 中与当前 Supabase 和真实 AI 基础版状态不一致的旧描述。
- 根据产品负责人决策，将当前项目阶段更新为 `Phase 12`。
- 在 `docs/ROADMAP.md` 建立 10 项有序 `Next Queue`，首项为 DeepSeek 真实解析优化，末项为正式上线。
- 在 Project Director 工作流中加入 ROADMAP 队列自动维护规则；完成项保留记录并自动推进下一项，AI 不得擅自重排。

### 验证

- 本轮仅修改 Markdown 文档；Build、Lint、TypeScript、API、Database 和 Preview 不适用。
- 已检查文档路径、相互链接、工作流边界和 Git diff。
