# Product Roadmap

本路线图记录 Recipe Ticket / 日食笔记从 MVP 到真实上线的阶段状态。阶段是否完成以代码和验证结果为准，不以文档标题或计划描述代替验收。

开始开发前必须先阅读 [`AI_PROJECT_DIRECTOR.md`](./AI_PROJECT_DIRECTOR.md)。

## 路线原则

- MVP、可运行、可测试和可部署优先。
- 每次只推进一个可验收的小阶段。
- 保留游客路径、`mockData` 和 `localStorage` fallback，直到对应真实能力稳定。
- 不因架构优化推迟真实用户验证。
- Git commit、Git push、真实账号、Secret、付费和生产变更需要人工授权。

## 已完成阶段

### Phase 1：前端 MVP 闭环

状态：已完成

- 首页链接输入与模拟生成。
- Loading、菜谱详情、收藏、风味地图、Station 和“我的”页面。
- `mockData` 与 `localStorage` 本地演示路径。

### Phase 2：Supabase 基础设施与公共数据

状态：已完成基础版

- 数据库 schema、seed 和接入文档。
- 公共菜谱相关数据只读接入。
- Supabase 不可用时保留 `mockData` fallback。

### Phase 3：登录身份

状态：已完成基础版

- Supabase Auth 游客优先方案。
- Magic Link 登录、回调和 `/me` 登录状态。
- 缺少环境变量时保留 Local Demo。

### Phase 4：云端收藏与生成记录

状态：已完成基础版

- 已登录用户的云端收藏同步。
- 已登录用户的云端生成记录同步。
- 未登录用户继续使用本地存储。

### Phase 5：AI 菜谱解析管线

状态：已完成基础版

- `/api/parse-recipe` 接口和结构化草稿校验。
- 首页生成流程接入解析接口。
- 解析草稿保存为菜谱、食材和步骤。
- DeepSeek 服务端 Provider 与 mock fallback。

### Phase 6：AI Project Director 项目治理

状态：已完成

- 建立开发前强制阅读的项目级永久工作流。
- 建立统一的阶段闭环、Review、验证、文档和人工门槛规则。
- 建立本 ROADMAP 与 `docs/CHANGELOG.md`。

## 当前四级推进状态

```text
Milestone 2：Production Ready MVP
└── Phase A：Source Acquisition
    ├── Checkpoint A0：数据一致性基础（已完成，2026-07-15）
    │   ├── Task：生成任务精确绑定当前 Task ID
    │   ├── Task：失败状态与动态详情 fallback
    │   ├── Task：本地菜谱唯一 slug 与最多 50 道历史
    │   └── Task：收藏、我的菜谱和登录迁移按具体 slug 读取
    └── Checkpoint A1：小红书公开视频语音转菜谱（已完成，2026-07-16）
        ├── Task：小红书 / 抖音 URL 识别与短链解析（已完成）
        ├── Task：SSRF 防护与受控公开网页抓取（已完成）
        ├── Task：公开标题、正文和页面元数据提取（已完成）
        ├── Task：接入现有 DeepSeek 管线（已完成）
        ├── Task：yt-dlp + FFmpeg 临时音轨（已完成，两条真实样本）
        ├── Task：Qwen ASR 失败备用 + DeepSeek 动态菜谱（已完成，两条真实样本）
        ├── Task：火山录音文件 ASR 主 Provider（已完成，真实样本）
        ├── Task：登录用户 Supabase 全表写入（已完成）
        └── Task：Loading 真实阶段与动态 slug（已完成）
```

- Current Milestone：`Milestone 2`
- Current Phase：`Phase C - Production Verification`
- Current Checkpoint：`C1 - 重复生成与付费防护`
- Current Version：`0.2.0-working.6`
- Checkpoint A0 Rollback Commit：`a1303b6`
- Checkpoint A1 Working Rollback Commit：`07c54db`
- 历史项目阶段编号 `Phase 12` 仅作为旧记录保留，不再作为当前执行层级。

后续 Phase：

1. Phase B：User Journey，完成 Netlify 生产运行时和陌生用户端到端旅程验收。
2. Phase C：Production Verification，完成跨设备、生产数据和发布验收。

Checkpoint B1 已完成：Vercel Production 已跑通游客真实小红书链路、登录用户云端菜谱写入、动态详情刷新、云端收藏和 `/me` 数据恢复。Checkpoint C1 将为登录用户复用已完成的同来源云端任务，避免跨设备或浏览器缓存失效后重复调用付费链路。

每个 Checkpoint 必须依次完成 Architect Review、QA、Reviewer、Debug、Release、CHANGELOG 和 Git Commit。网络中断或新会话启动时，从本节最近一个已完成 Checkpoint 继续。

## Next Queue

| 顺序 | 待开发项 | 状态 | 启动时必须确认 |
| --- | --- | --- | --- |
| 1 | DeepSeek 真实解析优化 | 已完成（2026-07-16） | 真实 Provider 与登录用户写入均已验证 |
| 2 | 解析样本测试体系 | 进行中（进入生产重复计费防护） | 扩充真实样本文本、成本和耗时统计 |
| 3 | 小红书链接解析 | 已完成（2026-07-16） | yt-dlp、火山 ASR、Qwen 备用与 DeepSeek 已验收 |
| 4 | 抖音链接解析 | 待开发 | 合法内容获取方式、平台限制和失败兜底 |
| 5 | OCR 图片识别 | 待开发 | 图片输入范围、OCR Provider 和隐私策略 |
| 6 | AI 菜谱质量评分 | 待开发 | 评分维度、合格阈值和人工样本 |
| 6 | Recipe Embedding 搜索 | 待开发 | Embedding（把菜谱转成可搜索向量）Provider、数据库方案和成本 |
| 7 | 收藏夹优化 | 待开发 | 产品交互与视觉范围 |
| 8 | iOS PWA | 待开发 | PWA（可安装到手机桌面的网页应用）范围、图标和真机测试 |
| 9 | 数据分析 | 待开发 | 事件清单、分析平台、隐私与 Cookie 策略 |
| 10 | 正式上线 | 待开发 | 真人验收、Git push、生产配置和发布授权 |

## 队列推进规则

- 严格保持产品负责人给出的顺序，未经确认不重排、不跳项。
- 每完成一项，先完成 Review、lint、build、类型、API、数据库、安全和 Preview 中适用的验证。
- 完成项保留在表格中并标记为 `已完成（YYYY-MM-DD）`，同时记录关键验证结果。
- 当前项完成后，自动将下一项提升为待开发首项，并同步 README、CHANGELOG 和相关 docs。
- 遇到真实账号、API Key、付费、产品设计、Git、生产环境或真人测试时停止，明确请求最小人工操作。
- 小红书和抖音解析不得以绕过平台权限或访问限制为实现前提；若直接链接方案不可行，优先采用用户提供正文、字幕、截图或授权数据的 MVP fallback。

### Queue #1 当前验收记录

已完成（2026-07-14）：

- 可配置超时、受控重试、输出截断检查和非思考 JSON 模式。
- fallback 后保留 attempted provider、模型、耗时、尝试次数、finish reason 和 Token usage。
- `sourceUrl` / `rawText` 输入长度保护与 Prompt 注入隔离。
- Mock 正常请求、空输入、非法 JSON、超长输入和 DeepSeek 不可达 fallback 验证。
- lint、build、TypeScript、路由和 `/dev/parse-test` Preview 通过。
- Netlify Production 已验证 `/api/parse-recipe` 返回 `provider=deepseek`、`usedFallback=false`。
- 线上 `/dev/parse-test` 返回 200，可用于同一接口的开发验证。

补充验收（2026-07-16）：

- 登录用户真实写入 `recipes / ingredients / recipe_steps / generation_tasks` 已通过。
- 火山主 ASR 真实样本 `usedFallback=false`，Qwen 备用保留并有自动测试覆盖。
- 真实样本的长期质量、Token 成本和耗时统计进入 Queue #2 继续推进。

### Queue #2 当前验收记录

已完成（2026-07-14）：

- 新增解析质量评分工具，用于检查食材、调料、步骤、火候、时间、标签和置信度。
- 新增 16 条本地解析样本，覆盖详细菜谱、短文本、噪声文本、口语输入、缺失信息、重复步骤和 Prompt 注入。
- 新增 `npm run test:ai`，当前 23 项 AI 解析相关测试通过。

未完成：

- 尚未形成真实用户样本集。
- 尚未建立生产环境成本、耗时和质量趋势统计。

## 长期暂缓事项

- 社交、评论、复杂会员、积分和广告。
- 复杂后台和大规模数据架构。
- 未被真实用户反馈证明必要的性能优化或重构。
- 未确认授权与稳定性的第三方平台抓取方案。
