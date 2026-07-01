# Auth Testing

## 测试步骤

1. 打开本地或 Netlify 页面。
2. 进入 `/me`。
3. 点击“登录以同步”。
4. 输入测试邮箱。
5. 点击“发送登录链接”。
6. 打开邮箱。
7. 点击 Supabase 发来的登录链接。
8. 返回 `/auth/callback`。
9. 成功后跳转 `/me`。
10. 确认 `/me` 显示已登录邮箱。
11. 点击“退出登录”。
12. 确认回到未登录状态。

## 常见问题

### 1. 收不到邮件怎么办

- 先检查垃圾邮件、广告邮件和邮箱拦截规则。
- 等待 1 到 2 分钟后再刷新邮箱。
- 不要连续快速重复发送，Supabase 默认会限制短时间内重复发送。
- 如果使用 Supabase 默认邮件服务，免费测试邮件可能有发送频率限制；后期正式上线建议配置自有 SMTP。

### 2. 点链接后没有跳回 APP 怎么办

- 检查浏览器是否拦截了新页面。
- 确认邮件里的链接没有被复制截断。
- 确认 Supabase 后台的 Site URL 和 Redirect URLs 已经包含当前访问地址。

### 3. Redirect URL 配置错误怎么办

- 打开 Supabase Dashboard。
- 进入 Authentication 的 URL Configuration。
- 检查 Site URL 是否是当前站点地址。
- 检查 Redirect URLs 是否包含当前站点的 `/auth/callback`。
- 本地和 Netlify 要分别配置，例如 `http://localhost:3000/auth/callback` 和线上域名的 `/auth/callback`。

### 4. 本地端口是 3000 或 3001 时怎么办

- 如果本地页面运行在 `http://localhost:3000`，Redirect URL 需要包含 `http://localhost:3000/auth/callback`。
- 如果本地页面运行在 `http://localhost:3001`，Redirect URL 需要包含 `http://localhost:3001/auth/callback`。
- 如果开发服务器自动换到其他端口，也要把对应端口的 `/auth/callback` 加进 Supabase Redirect URLs。

### 5. 为什么登录后收藏还没有云端同步

- 当前 MVP 只把登录状态接入 Supabase Auth。
- 收藏同步属于下一阶段功能，本轮没有接入 Supabase 收藏表。
- 登录后页面只显示邮箱和登录状态，不会改变现有收藏逻辑。

### 6. 为什么当前仍然是 localStorage 收藏

- localStorage 是浏览器本地存储，用来在当前设备保存收藏和模拟生成任务。
- 这样可以保证游客不用登录也能完整体验核心流程。
- 后续做云端同步时，再设计本地数据和云端数据的合并规则。
