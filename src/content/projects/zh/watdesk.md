---
pageSlug: "watdesk"
lang: "zh"
title: "WatDesk"
summary: "把 LEARN、Crowdmark、Odyssey 的 Waterloo 截止日期、考试和成绩放进同一个侧边栏，数据保存在你自己的浏览器里。"
kind: "software"
order: 1
featured: true
stack: "TypeScript · React · Vite · Edge extension"
period: "Oct 2026 – Present"
status: "Edge 加载项商店：审核中（以仓库 README 为准，2026-11-02 核对）。可从 GitHub Releases 安装。"
image: "/assets/watdesk.jpg"
imageDark: "/assets/watdesk-dark.jpg"
links: [{"label": "最新版本", "url": "https://github.com/Jelly-RayTian/WatDesk/releases/latest"}, {"label": "源码", "url": "https://github.com/Jelly-RayTian/WatDesk"}]
---

WatDesk 是独立学生项目，不是滑铁卢大学的产品。

## 功能
- 一条时间线汇总作业、小测和考试，按天分组，可按课程筛选。
- 两周工作量视图，提前看出哪几天任务集中。
- 考试页：倒计时、教室与座位、变更提醒。
- 可排序的成绩页，已公布成绩与估算分开显示。
- 日历与 `.ics` 导出、提醒、中英双语、浅色与深色，以及包括 Liquid Glass 在内的五种外观。
- 安静的后台同步：不抢占你的标签页，网站出问题时保留上一次的有效数据。

## 隐私设计
它在你自己已登录的会话里读取各站点。学业数据保存在你的浏览器中，不会上传到 WatDesk 后端。它不会看到或保存密码、Cookie 和验证码，也不会替你提交任何内容。匿名使用计数默认开启，可在设置向导或设置中关闭，设置页会列出它发送的全部内容。

## 验证
在 v1.9.0，仓库的持续集成运行了类型检查、生产构建和 67 个测试文件共 284 个测试，全部通过。项目共有 8 个正式发布版（最新 v1.9.0）。以上是仓库自己的检查，不是独立测试，也不是用户数据。

## 不声称
不声称用户数量、商店评分或学校背书。
