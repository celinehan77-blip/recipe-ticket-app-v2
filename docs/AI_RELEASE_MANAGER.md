# AI Release Manager

## 职责

RELEASE_MANAGER 以 Working Release 为单位管理版本，而不是把每个 Commit 都视为可发布版本。

## 版本规则

- `MAJOR`：不兼容的产品或数据变化。
- `MINOR`：向后兼容的新功能或完成一个重要 Phase。
- `PATCH`：向后兼容的 Bug、安全或稳定性修复。
- 未通过发布门槛的改动使用 `<version>-working`，不创建 Git Tag。

## 发布门槛

只有同时满足以下条件才能准备 Stable Release：

- QA_AGENT：PASS。
- REVIEW_AGENT：PASS。
- README、ROADMAP、CHANGELOG 和相关 docs 已同步。
- 已记录回滚版本与迁移风险。
- 用户已授权 Git commit、tag、push 和正式 release 操作。

## Release 记录字段

每个 Stable Release 必须记录：Version、Commit Hash、Phase、日期、功能、QA、Reviewer、Rollback Version 和 Release Note。

## 当前版本登记

| Version | Commit | Phase | 状态 | Rollback |
| --- | --- | --- | --- | --- |
| `0.2.0-working.10` | 当前工作区 | Milestone 3 / A2 | 真实样本首轮、重点提醒、失败分类与 yt-dlp 升级；待部署验证 | `001463e` |
| `0.2.0-working.9` | 当前工作区 | Milestone 3 / A1 | 正文与小红书生产 diagnostics 写入、RLS 与动态菜谱完整性验收通过 | `4911230` |
| `0.2.0-working.8` | 当前工作区 | Milestone 2 / C2 | 过期任务恢复、孤儿数据审计与 Milestone 2 收口；66 tests、lint、build 通过 | `51303c6` |
| `0.2.0-working.7` | 当前工作区 | Milestone 2 / C1 | 同来源云端任务复用、重复付费防护与缓存命中导航修复；64 tests、lint、build 通过 | `a4c7354` |
| `0.2.0-working.6` | 当前工作区 | Milestone 2 / C1 | B1 生产登录、四表写入、动态详情与云端收藏验收通过 | `75dd3d3` |
| `0.2.0-working.5` | 当前工作区 | Milestone 2 / B1 | Vercel 真实样本、61 tests、lint、build、Secret Scan 通过 | `b058dab` |
| `0.2.0-working.4` | 未提交工作区 | Milestone 2 / A1 | 小红书视频语音链路本地验收完成；待 Git/Netlify 发布 | 最近安全提交 `0a35bb1` |

仓库当前没有 Git Tag，因此不能声称已有 Stable Release。Git 权限未明确授权时，只生成建议版本和 Release Note，不执行 Commit、Tag、Push 或 GitHub Release。
