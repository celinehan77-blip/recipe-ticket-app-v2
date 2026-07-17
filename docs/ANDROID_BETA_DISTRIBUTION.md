# Android Beta 分发

## 当前目标

将“日食笔记”作为可安装 Android App 提供给小群用户，不改变现有 Web UI、Supabase、Auth 或 AI 服务。

当前 App 使用 Capacitor（把现有网页运行在 Android 原生容器中的工具），包名固定为：

```text
com.rishibiji.app
```

App 需要联网，业务和数据继续由 Vercel Production、Supabase 和现有 AI API 提供。GitHub APK 不包含任何服务端 Secret。

## 为什么先做 Android

- GitHub Releases 可以免费托管 APK，用户下载后可直接安装。
- Android 官方允许通过网站直接分发签名 APK，但用户需要允许浏览器安装未知来源应用。
- Google Play 开发者账号为一次性 25 美元，等 Beta 证明需求后再决定。
- Apple Developer Program 为每年 99 美元，因此当前不做 App Store 和 TestFlight 正式分发。

## GitHub Actions

工作流：`.github/workflows/android-beta.yml`

移动端相关文件推送到 `main` 后，工作流会自动：

1. 安装 Node.js 24 和 Java 21；
2. 同步 Capacitor Android 项目；
3. 构建可安装的 debug APK；
4. 将 APK 保存为 14 天有效的 GitHub Actions Artifact。

配置长期签名后，可以从 `Actions -> Android Beta -> Run workflow` 选择 `publish_release=true`，生成：

- `rishibiji-<version>.apk`：用户直接安装；
- `rishibiji-<version>.aab`：以后提交应用市场；
- GitHub Prerelease 下载页面。

## 长期签名

Android 每个安装包都必须签名。为了让用户以后直接覆盖升级，所有版本必须使用同一份 PKCS12 证书。

GitHub 仓库需要以下 Actions Secrets：

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

禁止把 keystore、密码或 Base64 内容提交到 Git。签名证书必须单独备份；丢失后，GitHub 直装版本无法继续原地升级。

## 用户安装步骤

1. 用 Android 手机打开 GitHub Prerelease 下载页；
2. 下载 `.apk` 文件；
3. 系统提示时，仅为当前浏览器开启“允许安装未知应用”；
4. 安装“日食笔记”；
5. 打开 App，游客可直接生成、浏览和本地收藏。

## 当前边界

- 第一版 Android App 本质上复用线上产品，因此必须联网。
- Magic Link 从外部邮件 App 打开时，可能在系统浏览器建立登录状态，而不是回到 App；首轮 Beta 以游客主流程为准。
- GitHub Actions 的 debug APK 只用于构建验证，不作为公开长期版本；公开给用户的版本必须使用长期证书签名。
- 中国大陆应用市场通常还涉及实名认证、软件著作权、隐私政策或其他资质，本阶段不提前投入。
