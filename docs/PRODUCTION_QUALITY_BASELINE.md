# Production Quality Baseline

本文件定义 Milestone 3 小范围真实用户 Beta 的解析质量与运行成本验收口径。只记录聚合指标和安全诊断，不保存原始口播、完整分享链接、邮箱、Token 或 Secret。

## 单次生成记录

登录用户完成生成后，`generation_tasks.diagnostics` 可记录：

- 菜谱解析 Provider 与模型。
- ASR Provider 与模型。
- AI / ASR 是否使用 fallback。
- 端到端处理耗时。
- 结构化菜谱质量分。
- DeepSeek 总 Token 数（Provider 返回时）。

历史任务没有诊断数据时保留空对象，不回填推测值。

## Beta 验收样本

第一轮至少收集：

- 10 条普通菜谱正文。
- 5 条无需登录即可访问的小红书公开做饭视频。
- 至少覆盖炒、蒸、炖、凉拌和烘焙中的 3 类。

同一来源重复提交命中缓存时不计为新样本，也不重复计费。

## 第一轮门槛

- 动态菜谱完成率不低于 80%。
- 已完成菜谱质量分不低于 70。
- 正文输入 P95 处理耗时不高于 20 秒。
- 小红书视频 P95 处理耗时不高于 60 秒。
- 真实 Provider fallback 率不高于 20%。
- completed task 必须关联 recipe，生成 recipe 必须同时有 ingredients 和 recipe_steps。
- 不允许出现 Secret 泄露、RLS 绕过或跨用户数据读取。

这些是首轮 Beta 的启动门槛，不是长期 SLA。样本不足时只报告实际数量，不外推成功率。

## 失败分类

失败只记录安全分类：来源不可读、媒体提取失败、ASR 失败、AI 解析失败、质量校验失败、菜谱保存失败、任务中断。不得把 Provider 原始敏感响应直接写入数据库或普通日志。

## Checkpoint A1 完成条件

1. 新生成 task 能在 RLS 下写入安全 diagnostics。
2. 至少一条正文和一条小红书真实生成记录可被聚合读取。
3. 诊断不包含原始口播、完整链接参数或 Secret。
4. 测试、lint、build 和生产路由检查通过。

## 首次生产验证

- 正文样本：质量分 86，无 fallback，约 5.0 秒。
- 小红书公开视频样本：质量分 98，火山 Seed ASR 与 DeepSeek 均无 fallback，约 30.4 秒。
- 当前样本数不足以计算稳定成功率或 P95；Checkpoint A2 继续收集，禁止用这两条样本外推。
