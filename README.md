# CompoundBell legal website

复利闹钟 / CompoundBell 的中英文隐私政策、用户协议、断开连接及支持页面。

- 网站：https://lusanyuss.github.io/compoundbell-legal/
- 服务提供者：北京晓目标科技有限公司
- 联系邮箱：yuliu0018@gmail.com
- 当前为 Android 海外开发测试审核稿，正式生效日期及发布要求尚待确认。

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
