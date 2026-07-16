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
| `0.2.0-working.4` | 未提交工作区 | Milestone 2 / A1 | 小红书视频语音链路本地验收完成；待 Git/Netlify 发布 | 最近安全提交 `0a35bb1` |

仓库当前没有 Git Tag，因此不能声称已有 Stable Release。Git 权限未明确授权时，只生成建议版本和 Release Note，不执行 Commit、Tag、Push 或 GitHub Release。
