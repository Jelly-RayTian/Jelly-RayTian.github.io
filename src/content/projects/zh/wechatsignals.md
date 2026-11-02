---
pageSlug: "wechatsignals"
lang: "zh"
title: "WechatSignals"
summary: "本地优先的 macOS 一对一聊天分析客户端：只读访问、匿名化、SQLite 与 Keychain。"
kind: "software"
order: 2
featured: true
stack: "TypeScript · Swift · SQLite · macOS"
period: "Oct 2026"
status: "测试版：v0.1.0-beta.1，arm64，ad-hoc 签名，未公证。"
image: "/assets/wechatsignals-screenshot.webp"
imageDark: "/assets/wechatsignals-screenshot.webp"
icon: "/assets/wechatsignals-icon.png"
flow: ["只读取单聊，只读方式", "先匿名化参与者（Me、Person A）", "点击“分析”才发送数据", "API Key 存放在 macOS Keychain"]
links: [{"label": "发布 v0.1.0-beta.1", "url": "https://github.com/Jelly-RayTian/WechatSignals/releases/tag/v0.1.0-beta.1"}, {"label": "源码", "url": "https://github.com/Jelly-RayTian/WechatSignals"}]
---

## 设计约束
- 只读取单聊，只读方式，来自本机。
- 联系人、缓存和分析结果都保存在本机。
- 只有当我点击“分析”所选聊天时，才会发送数据用于分析。
- 发送前先把参与者匿名化（“Me”“Person A”），不包含微信 ID、昵称、头像、手机号或本地路径。
- API Key 存放在 macOS Keychain，而不是配置文件。

## 状态与局限
这是测试版。它是 ad-hoc 签名、未经公证，首次启动时 macOS 会给出警告。尚未在大量不同机型上测试。
