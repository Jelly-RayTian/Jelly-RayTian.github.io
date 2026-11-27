---
pageSlug: "ctxport"
lang: "zh"
title: "ctxport"
summary: "把 ChatGPT、Claude、Codex、Gemini 等 AI 里的聊天记录汇总到本机，提炼成一份“关于我”的档案，再一键导入别的 AI，换助手不用从头介绍自己。"
kind: "software"
order: 0.3
featured: true
stack: "Python（核心仅用标准库）· SQLite · 浏览器扩展 · MCP"
image: "/assets/ctxport-app.jpg"
imageDark: "/assets/ctxport-app-dark.jpg"
period: "2026 年 11 月至今"
status: "与合作者共同开发；v0.2.0 已在 GitHub 发布（2026-11-27 核对），尚未发布到 PyPI。"
links: [{"label": "v0.2.0 发布", "url": "https://github.com/Memoryport/ctxport/releases/tag/v0.2.0"}, {"label": "源码", "url": "https://github.com/Memoryport/ctxport"}]
---

ctxport 是开源项目（MIT 许可证），在 Memoryport 组织下与合作者共同开发。

## 功能
- **收集**：直接解析各平台的原始数据，而不是让模型去“回忆”。支持 ChatGPT、Claude.ai、Claude Code、Codex、Gemini CLI、Gemini 网页版、Google Antigravity、Cherry Studio 和 Chatbox，网页版用官方导出包或可选的浏览器扩展。
- **提炼**：用你已经登录的 Claude Code 或 Codex 把每个对话写成一张“情节卡”，不需要 API Key；ctxport 在本机合并去重，写成按主题分组、每条带日期的档案，并检查每条事实都写进去了。
- **省 token**：默认先压缩对话（代码只保留“是干什么的”，长段粘贴只留开头和结尾），再把多个对话打包成一次提问。在我自己的聊天记录上实测，每个对话约 1.4k token，而让 Agent 逐个读文件约 18k。
- **导入**：档案分精简、标准、完整三个版本，一键写进 Claude Code、Codex、Gemini CLI、Antigravity、Cursor 的指令文件；网页版 AI 通过扩展写入，或者复制后粘贴。
- **MCP**：接上后，Agent 可以按需搜索完整档案和原始对话，精简版没写进去的细节也查得到。
- **桌面应用**：带引导的本地网页，按“收集 → 提炼 → 检查 → 导入”四步走；可以选模型、推理程度和并行数，显示 token 预估和进度；额度用完时会换另一个 Agent 接着跑，或者等额度恢复后自动继续。

## 隐私设计
全部数据保存在本机的 SQLite 里，没有遥测。只有你明确开始提炼时，才会把对话发给你自己选的 AI。写入别的工具的指令文件前会先备份，并且只改 ctxport 自己那一块。导出时会遮蔽密钥和账号类信息，导出的项目记忆只写文件夹名，不带本地完整路径。

## 验证
在 v0.2.0，CI 在 Windows、macOS、Linux 上用 Python 3.10、3.12、3.13 跑完 291 个测试并全部通过，同时检查了打包内容和体积；发布流程用打出的安装包做了冒烟测试。完整流程（导入、提炼、生成档案、写入 Claude Code 和 Codex、连接 MCP）用我自己 3000 多个对话实际跑过。
