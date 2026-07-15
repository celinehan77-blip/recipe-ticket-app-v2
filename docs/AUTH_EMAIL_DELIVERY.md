# Auth Email Delivery

本文件记录 Recipe Ticket 当前 Supabase Auth 邮件发送策略。不得在本文档中写入真实 SMTP 密码、API Key、Magic Link、Token、Session 或用户邮箱。

## 当前结论

- 当前 MVP 使用 Supabase Email Magic Link。
- 当前很可能仍在使用 Supabase 默认邮件服务。
- Supabase 默认邮件服务适合开发测试，不适合正式上线。
- 默认邮件服务额度低，频繁测试可能触发 `email rate limit exceeded`。
- 触发限流后，应停止继续发送真实 Magic Link，等待额度恢复。

## 错误分类

前端只暴露安全错误分类：

- `over_email_send_rate_limit`：邮件发送额度或同一邮箱发送间隔触发限制。
- `over_request_rate_limit`：请求级 429 限流。
- `invalid_email`：邮箱格式或邮箱输入无效。
- `redirect_not_allowed`：登录回跳地址未被 Supabase 允许。
- `unknown_error`：其他未知错误。

禁止记录或展示：

- 邮箱地址。
- Magic Link。
- Token。
- Session。
- Authorization。
- 完整 Supabase Auth 原始响应。

## 为什么默认邮件服务不适合上线

Supabase 默认邮件服务主要用于探索和开发测试：

- 每小时发送额度有限。
- 送达率和稳定性不适合作为正式生产能力依赖。
- 部分收件地址可能受到项目成员或平台策略限制。
- 正式用户增长后，默认发送服务容易触发限流。

正式上线前需要配置 Custom SMTP（自定义邮件发送服务，用自己的邮件服务发登录邮件）。

## 推荐接入顺序

1. 选择事务邮件服务。
   可选方向：Resend、Postmark、AWS SES、SendGrid、Brevo、ZeptoMail。
2. 准备发件域名。
   建议使用独立认证邮件域名，例如 `auth.example.com`。
3. 配置 DNS。
   按邮件服务要求设置 SPF、DKIM、DMARC。
4. 在 Supabase 后台配置 Custom SMTP。
   路径：Supabase Dashboard -> Authentication -> SMTP Settings。
5. 保存后发送少量测试邮件。
   只用真实需要的测试邮箱，不做批量压测。
6. 检查送达率、垃圾箱、链接回跳和登录状态保持。
7. 再恢复登录用户数据库写入验收。

## Supabase Custom SMTP 所需配置项

常见配置项：

- SMTP Host。
- SMTP Port，常见为 `587` 或 `465`。
- SMTP User。
- SMTP Password。
- Sender Email。
- Sender Name。
- Secure / TLS 设置。

安全要求：

- SMTP Password 只保存在 Supabase 后台或安全 Secret 管理中。
- 不写入 GitHub。
- 不写入 README。
- 不写入 `.env.example`。
- 不写入测试文件。
- 不在 Codex 回复中展示。

## 前端防重复发送策略

当前登录页必须保持：

- 页面加载不自动发送 Magic Link。
- 切换邮箱不自动发送 Magic Link。
- 只有用户提交表单时才调用 `signInWithOtp`。
- 发送中按钮立即禁用。
- 连续双击只允许一次发送。
- 成功发送后进入 60 秒倒计时。
- 发送失败不自动重试。
- 限流错误显示中文提示：“登录邮件发送过于频繁，请稍后再试。”

## 当前人工操作建议

在出现 `email rate limit exceeded` 后：

1. 暂停继续发送真实 Magic Link。
2. 等待 Supabase 邮件额度恢复。
3. 恢复后只从正式 Netlify 网站发送一次最新 Magic Link。
4. 使用同一个浏览器打开邮件链接。
5. 确认 `/me` 显示已登录邮箱并刷新后仍保持登录。

完成以上验证前，不继续登录用户数据库写入测试。
