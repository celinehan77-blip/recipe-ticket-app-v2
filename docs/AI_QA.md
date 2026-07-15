# AI QA

## 职责

QA_AGENT 负责证明改动可以运行、可以测试，并且没有破坏现有核心路径。

## 固定验证矩阵

- TypeScript：由 `npm run build` 的类型阶段验证；如新增独立命令则同时执行。
- Lint：`npm run lint`。
- Build：`npm run build`。
- Route：检查构建路由清单和受影响页面 HTTP 状态。
- API：验证正常、非法输入、边界输入、失败与 fallback。
- Database / Supabase：涉及数据时检查 schema、RLS、读写和失败路径。
- Playwright / Preview：页面或交互变化时在浏览器完成真实渲染与关键交互。
- Environment：检查需要的变量名和缺失变量 fallback，不输出值。
- Security / Secret：检查鉴权、输入校验、错误信息和 Secret 泄露。
- Netlify：发布相关任务检查部署、环境变量存在性、线上 API 和页面。

## PASS 门槛

所有适用检查必须 PASS。无法执行的检查必须说明原因，并阻止相关功能被标记为完成；不适用项目可以标记 `N/A`。

真实付费 Provider、生产数据库、GitHub 和 Netlify 写操作仍需要对应权限。
