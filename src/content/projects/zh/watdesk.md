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
status: "已在 Microsoft Edge 加载项商店上架；v1.10.1 已在 GitHub 发布并提交商店审核（2026-11-04 核对）。"
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
- 可选的只读“课程大纲”来源（v1.10.1）：读取课程大纲中明确写明日期的考核项；未公布的日期不会猜测。
- 在工作量视图中悬停某一天，可查看当天的任务。
- 安静的后台同步：不抢占你的标签页，网站出问题时保留上一次的有效数据。

## 隐私设计
它在你自己已登录的会话里读取各站点。学业数据保存在你的浏览器中，不会上传到 WatDesk 后端。它不会看到或保存密码、Cookie 和验证码，也不会替你提交任何内容。匿名使用计数默认开启，可在设置向导或设置中关闭，设置页会列出它发送的全部内容。

## 验证
在 v1.10.1，发布说明记录了类型检查、生产构建和 69 个测试文件共 290 个测试全部通过，且安装包与主分支构建一致；说明中也写明本次发布没有重新测试需要学校账户登录的真实流程。项目共有 9 个标签版本（最新 v1.10.1，2026-11-04）。
