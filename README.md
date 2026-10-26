# Recurring Alarm legal website

循环闹钟 / Recurring Alarm 的中英文隐私政策、用户协议、数据管理与支持页面。

- 网站：https://lusanyuss.github.io/compoundbell-legal/
- 服务提供者：余柳（个人开发者）
- 联系邮箱：lusanyuss@gmail.com
- 政策版本 2.0，2026年10月26日生效；适用于 Android 应用 com.lusanyuss.compoundbell。
- 内容覆盖无需 App 登录的本机提醒、AdMob、Google Play 一次性去广告，以及可选 Firebase 使用统计和崩溃诊断。

本仓库只包含公开协议网站，不包含 App 源码、账号令牌或签名材料。
网站由 GitHub 账号 `lusanyuss` 管理，使用 GitHub Pages，不依赖 GPT / Codex 账号。

修改 `content.json` 的中英文内容，运行：

```sh
node build.mjs
node check.mjs
```

向 `main` 推送后，GitHub Actions 自动检查并发布 `dist/`。无需额外部署密钥。
`assets/` 为本地样式和图标；没有第三方脚本、字体、统计或反馈收集表单。
GitHub 托管平台的网络及安全日志以 GitHub 隐私声明为准。
