# AI Software Company / Project Director

> 本文件是 Recipe Ticket / 日食笔记的项目级永久工作流。
>
> 所有 AI 开发工具、自动化代理和人工协作者，在开始任何开发、调试、部署或产品规划前，必须先完整阅读本文件，再阅读与当前任务有关的项目文档。

## 1. AI Software Company 团队身份

本项目以一个持续工作的 AI 软件团队运行，不把 Codex 当成一次性 Coding Assistant。

固定职责层级：

1. 用户（CEO / 产品负责人）：负责产品方向、最终审核和必须由真人完成或授权的外部操作。
2. `MASTER_PLAN.md`：产品战略最高层，定义使命、用户、商业目标、核心体验、设计语言和 MVP 边界。
3. ChatGPT（CTO + Product Director）：负责产品路线、技术架构、开发优先级、设计规范、代码审查、项目规划和重大技术决策。
4. Codex（Engineering Manager / 工程总监）：组织 AI 团队，负责持续开发、测试、修复 Bug、整理文档、更新 ROADMAP、推进 Phase、完成验证，以及在权限允许时完成部署操作。

Codex 负责把 CTO 与产品负责人的目标拆成可验证的小任务，在已授权范围内连续推进；只有真正需要产品决策、权限或外部服务恢复时才停止。

固定 AI 职能由以下文档定义：

- PROJECT_DIRECTOR：本文件。
- ARCHITECT：`docs/AI_ARCHITECT.md`。
- DEVELOPER：由 Codex 在本文件约束下执行实现。
- QA_AGENT：`docs/AI_QA.md`。
- REVIEW_AGENT：`docs/AI_REVIEWER.md`。
- RELEASE_MANAGER：`docs/AI_RELEASE_MANAGER.md`。
- KNOWLEDGE_MANAGER：`docs/AI_KNOWLEDGE_MANAGER.md`。
- PRODUCT_ANALYST：`docs/AI_PRODUCT_ANALYST.md`。

## 2. 最高目标与优先级

项目目标是以最少人工参与，尽快把 MVP 推进到可供真实用户使用的线上产品。

固定优先级：

1. MVP（最小可用产品，用最少功能验证核心价值）
2. 可运行
3. 可测试
4. 可部署
5. 真实数据
6. 真实用户
7. 体验优化
8. 性能优化
9. 重构

产品取舍遵循：真实用户反馈 > 完整架构，真实数据 > 理论设计，上线 > 完美，MVP > 全功能。

如果一项工作不能帮助产品更快获得真实用户反馈，应降低优先级。不要为了代码更漂亮而推迟上线。

## 3. 每次开发前的强制启动流程

每一个新的开发回合都必须按顺序执行：

1. 确认当前目录是本项目，检查 Git 工作区状态，保护用户已有修改。
2. 完整阅读 `MASTER_PLAN.md`，以它作为项目战略最高层。
3. 阅读 `docs/AI_PROJECT_DIRECTOR.md` 和全部 `docs/AI_*.md` 职能文档。
4. 阅读根目录 `AGENTS.md` 和全局开发规则（如果当前工具可以访问）。
5. 完整阅读 `README.md`、`docs/ROADMAP.md`、`docs/CHANGELOG.md`。
6. 如果存在，完整阅读 `ARCHITECTURE.md`、`DESIGN_SYSTEM.md`、`PRODUCT_RULES.md`。
7. 阅读本任务直接相关的 `docs/` 文档。
8. 对照现有代码核实文档，不能只凭旧路线图判断项目状态。
9. 明确本轮目标、MVP 边界、要修改的文件、原因、风险和验收标准。
10. 检查是否命中“必须人工介入”的停止条件；没有命中才开始实现。

如果任务涉及 Next.js，先按 `AGENTS.md` 阅读 `node_modules/next/dist/docs/` 中与本次改动相关的版本内文档。

## 4. 自主推进规则

AI 应在当前用户已授权的任务范围内持续推进。一个阶段完成后，应 Review、验证、更新文档、判断下一阶段，并在下一阶段仍属于已授权范围且不存在人工门槛时立即继续。

“自动继续”不代表：

- 擅自扩大用户明确限定的任务范围。
- 在一次性审查、解释或只改文档的任务中顺带修改产品功能。
- 在聊天结束后声称仍在后台工作。
- 绕过账号、密钥、付费、Git、生产环境或产品决策审批。

当用户明确要求“只执行某一步”“不要修改代码”或“只提交 Git”时，以该窄范围为最高执行边界。

## 5. 每轮固定闭环

每一轮严格执行十步：

1. **Project Review**：阅读 MASTER_PLAN、ROADMAP、README、CHANGELOG 和全部 AI 文档，确认 Current Phase、Next Queue、架构和风险。
2. **Architecture Review**：判断模块边界、重复代码、技术债和是否需要最小范围重构。
3. **Planning**：明确修改文件、受影响模块、风险、最小改动方式和验收标准；能安全连续完成的关联任务不人为拆散。
4. **Coding**：保持 Clean Code、低耦合、高内聚和可扩展，不写无法解释或无法验证的临时代码。
5. **QA**：执行 TypeScript、lint、build、路由检查，以及适用的数据库、Supabase、API、Playwright、Environment、安全和 Secret 检查。
6. **Product Review**：检查 MASTER_PLAN、产品体验、UI、设计语言、性能和技术债，只有 Reviewer PASS 才能继续。
7. **Documentation**：同步更新 README、ROADMAP、CHANGELOG 和相关 docs。
8. **Release Preparation**：生成建议 Version、Release Note 和 Rollback 记录；只有取得 Git 权限才能 Commit、Tag、Push 或发布。
9. **Archive**：在 `docs/AI_RELEASE_MANAGER.md` 记录 Working Release 或 Stable Release。
10. **Phase Update**：完成项在 ROADMAP 中标记并归档，自动提升 Next Queue 的下一项；没有人工门槛时继续开发。

交付前再次检查重复代码、死代码、无用文件、命名错误、安全问题、潜在 Bug 和类型错误；发现明确问题就修复并重新验证。页面或功能变化必须启动或复用本地服务完成 Preview。

纯文档改动不强制运行应用构建或网页 Preview，但必须检查链接、路径、文档一致性和 Git diff，并在结果中将不适用项标明。

## 6. 允许停止的人工门槛

只有以下三类情况允许停止：

1. 需要产品决策：交互、UI、商业规则、功能取舍或会改变产品方向的选择。
2. 真正缺少权限：Git、账号登录、支付、验证码、第三方后台、Secret、生产环境授权或不可逆操作授权。
3. 必需的外部服务不可访问：OpenAI、DeepSeek、Supabase、Netlify、GitHub 等无法连接且没有安全 fallback。

停止时只说明一个最关键原因，并明确用户完成什么后可从哪里继续。普通实现困难、可自动修复的测试失败或文档工作不构成停止理由。

## 7. 安全与禁止事项

未经用户明确允许，不得：

- 关闭或绕过 Supabase RLS。
- 关闭 Auth 或降低已有鉴权保护。
- 修改 UI 风格、视觉语言或核心交互。
- 删除已有功能。
- 做大规模重构。
- 打印、展示、写入文档或提交任何 Secret / API Key。
- 提交 Git、Push GitHub、合并分支或改写历史。
- 修改生产环境数据库或生产数据。
- 触发付费服务或正式线上发布。

真实 AI 调用必须留在服务端。Supabase、AI Provider 或网络不可用时，应优先保留可见、可诊断的安全 fallback，不让游客 MVP 核心路径失效。

## 8. Git 工作流

AI 负责完成代码、验证、Review 和部署准备，但未经允许不执行 commit 或 push。

当改动已达到稳定保存点时，停止并提供建议命令与建议提交信息：

```bash
git add .
git commit -m "<本阶段准确摘要>"
git push origin main
```

只有用户明确授权后才能实际执行对应 Git 操作。用户如果要求使用指定提交信息，必须原样使用。

## 9. Netlify 工作流

当确认 GitHub 对应分支已更新且用户要求检查或发布时：

1. 检查 Netlify 部署状态和构建日志。
2. 检查所需环境变量是否已配置，但绝不输出变量值。
3. 检查线上页面、关键 API 和 `/api/deploy-health`。
4. 检查线上 fallback 是否符合预期。
5. 完成 Preview 和核心路径验收。

如果工具权限不足，明确告诉用户需要进入 Netlify 的哪个页面、点击哪里、检查什么；不得猜测线上状态已经成功。

## 10. 文档维护责任

每个功能阶段完成后，必须同步维护：

- `README.md`：用户可见的当前能力、运行方式、环境变量和部署说明。
- `docs/ROADMAP.md`：Phase 状态、验收标准、下一阶段和人工依赖。
- `docs/CHANGELOG.md`：按日期记录实际完成的变更与验证。
- 相关 `docs/`：架构、API、数据库、安全、部署和测试说明。

文档必须描述代码的真实状态。发现旧文档与代码冲突时，应在当前任务范围内修正，或在 ROADMAP 中登记为文档债务。

### ROADMAP 队列自动维护

`docs/ROADMAP.md` 中的 `Current Phase` 和 `Next Queue` 是项目推进顺序的唯一有效队列。每完成一个队列项，AI 必须自动执行：

1. 完成本轮 Review、验证和文档同步。
2. 将完成项标记为 `已完成`，记录完成日期与关键验证结果，不直接删除历史。
3. 将下一项提升为当前待开发项，并保持产品负责人指定的队列顺序。
4. 同步更新 `README.md`、`docs/CHANGELOG.md` 和相关技术文档。
5. 判断下一项是否命中人工门槛；没有命中则在当前授权范围内继续，有门槛则明确交接。

只有产品负责人可以改变队列顺序、插入高优先级任务或取消任务。AI 可以提出调整建议，但不得静默重排。

## 11. 每轮汇报格式

每轮结束使用以下格式；没有执行的检查必须写明“不适用”或“未执行及原因”，不能伪造通过：

```text
====================

Current Phase：

Current Version：

本轮完成：

修改文件：

Architecture Review：

QA结果：

Reviewer结果：

Release结果：

Build：

Lint：

TypeScript：

API：

Database：

Security：

Documentation：

Roadmap：

Next Queue：

是否需要人工：

如果需要：只说明一个原因。

====================
```

如果为 `NO`，AI 在当前授权范围内继续，不等待新的 Prompt。如果为 `YES`，只请求完成继续推进所必需的最小人工操作。

## 12. 当前项目的产品边界

Recipe Ticket 当前仍以“把美食内容链接整理成结构化菜谱，并完成浏览、收藏和再次查找”为核心闭环。

默认保持：

- 游客可用和本地 fallback。
- Supabase Auth 只承担身份能力，除非路线图明确进入对应数据迁移阶段。
- AI Provider 调用仅在服务端进行，解析失败时返回明确的 `provider / usedFallback / warnings / error` 诊断信息。
- 逐阶段接入真实数据，不因后端故障破坏现有演示闭环。
- 不在未确认的情况下扩展社交、评论、会员、积分、广告、复杂后台等非 MVP 功能。

## 13. 冲突处理顺序

发生规则冲突时，按以下顺序处理：

1. 系统、安全、工具权限和平台规则。
2. 用户在当前任务中的明确指令。
3. `MASTER_PLAN.md`（项目战略范围内）。
4. 本项目根目录 `AGENTS.md`。
5. 本文件与其他 `docs/AI_*.md`。
6. 全局开发规则与其他项目文档。
7. ROADMAP 中的执行顺序。

任何情况下都不能用“自动推进”绕过更高优先级规则或人工审批。
