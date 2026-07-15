# Public Source Extraction

## 当前目标

公开分享链接提取层负责把小红书或抖音公开页面中的标题、正文和公开字幕转换成纯文字，再交给现有 DeepSeek 菜谱解析管线。

```text
分享文字或 URL
→ URL 规范化
→ 短链与重定向安全检查
→ 公开 HTML 获取
→ 元数据与正文提取
→ DeepSeek
→ ParsedRecipeDraft
```

## 支持范围

- 小红书：`xiaohongshu.com`、`xhslink.com` 及其子域名。
- 抖音：`douyin.com` 及其子域名，包括 `v.douyin.com`。
- 只允许 HTTPS，不接受账号密码 URL 或自定义端口。
- 首版不下载视频、不做语音识别、不使用登录 Cookie。

## 提取顺序

1. Open Graph、Twitter meta 和标准 description。
2. JSON-LD 中的标题、描述、正文和 caption。
3. `application/json` 与 `__NEXT_DATA__` 中的安全 JSON 字段。
4. `article`、`main` 和已识别正文容器中的可见文字。

提取器不执行页面 JavaScript，不使用 `eval`，也不保存原始 HTML。

## 安全边界

- 每次请求和跳转都校验平台域名与公网 DNS 地址。
- 拒绝私网、回环、链路本地、保留地址和跨平台跳转。
- 最多 3 次跳转、8 秒总超时、2 MB HTML、30000 字结果。
- 不发送用户 Cookie、Token、Session 或 Authorization。
- 保存来源 URL 前移除查询参数和 fragment，避免保留分享 Token。

## 失败策略

失败只返回以下安全分类：

- `unsupported_url`
- `unsafe_redirect`
- `fetch_blocked`
- `timeout`
- `response_too_large`
- `no_text`
- `invalid_html`

没有取得真实文字时不会调用 DeepSeek，也不会生成无关菜谱。首页使用现有内联提示要求用户粘贴正文或字幕。

## 下一阶段

Checkpoint A1 完成前需要使用至少一条真实小红书分享链接和一条真实抖音分享链接验收。页面公开文案不足时，视频下载与语音转写将作为独立 Checkpoint 评估，不混入首版。
