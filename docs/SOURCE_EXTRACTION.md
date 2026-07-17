# Public Source Extraction

## 当前目标

公开分享链接提取层负责把公开小红书或抖音做饭视频转换成真实口播文字，再交给现有 DeepSeek 菜谱解析管线。HTML 文案提取继续作为错误分类辅助，不再把标题当成完整菜谱来源。

```text
分享文字或 URL
→ URL 规范化
→ 平台域名与短链检查
→ 小红书使用 yt-dlp；抖音使用 ALAPI 解析公开媒体
→ FFmpeg 只输出临时单声道 16kHz MP3
→ 火山 ASR；明确失败后才调用 Qwen ASR
→ DeepSeek
→ ParsedRecipeDraft
```

## 支持范围

- 当前媒体链路支持小红书与抖音公开视频：小红书使用 `yt-dlp`，抖音使用 ALAPI。
- 只允许 HTTPS，不接受账号密码 URL 或自定义端口。
- 不使用登录 Cookie、不模拟登录、不绕过验证码。
- 不永久保存完整视频，不做画面分析或 OCR。

## 媒体与语音顺序

1. 小红书由 `yt-dlp` 读取公开元数据；抖音由 ALAPI 返回公开作品媒体数据，并检查媒体大小与处理超时。
2. 媒体通过标准输出直接交给 FFmpeg，不在磁盘保存完整视频。
3. FFmpeg 输出临时 16kHz、单声道、48 kbps MP3，音频上限 8 MB。
4. 火山录音文件极速识别成功即结束；明确失败后才调用 Qwen ASR。
5. transcript 为空或质量不足时停止，不调用 DeepSeek 保存正式菜谱。
6. DeepSeek 输出还需通过食材、步骤、来源一致性和质量评分。

临时目录使用随机名称，并在成功或失败的 `finally` 中递归删除。

## 安全边界

- 规范化 URL 后移除查询参数和 fragment，并生成 SHA-256 source hash。
- 不记录签名媒体 URL、Authorization、Secret 或原始 Provider 响应。
- 媒体子进程 60 秒超时，ASR 请求 35 秒超时。
- 同一运行实例复用相同 source hash 的进行中或已完成任务；浏览器保存成功 slug，避免刷新后重复进入付费链路。

## 失败策略

失败只返回以下安全分类：

- `unsupported_url`
- `unsafe_redirect`
- `fetch_blocked`
- `timeout`
- `response_too_large`
- `no_text`
- `invalid_html`

没有取得真实 transcript 时不会调用 DeepSeek，也不会生成无关菜谱。首页使用现有内联提示要求用户粘贴正文或字幕。

## 当前验收结果

已使用真实小红书做饭视频验收 yt-dlp、FFmpeg、火山 Seed ASR 主调用、Qwen ASR 失败备用、DeepSeek、质量校验和临时文件清理。登录 Session 下的 Supabase 四表写入、Loading 动态跳转和刷新持久化也已通过。

抖音 ALAPI 适配器和无付费测试已完成。抖音图文作品当前无音轨时返回安全错误，OCR 留到后续 Checkpoint。
