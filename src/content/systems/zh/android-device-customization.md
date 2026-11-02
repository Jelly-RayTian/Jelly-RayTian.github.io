---
pageSlug: "android-device-customization"
lang: "zh"
title: "Android 与嵌入式设备定制"
subtitle: "手机、儿童电话手表与学习机 · 高中阶段"
summary: "Root、TWRP、自定义系统、在小米 8 上刷写 Windows 的实验、已 Root 的小天才 Z6，以及被修改系统的小爱老师。"
order: 2
updated: "2026-11-02"
glance: [{"k": "背景", "v": "高中阶段在自己设备上做的个人实验，不是工作"}, {"k": "设备", "v": "Android 手机、小米 8、小天才 Z6 电话手表、小爱老师学习机"}, {"k": "结果", "v": "手机已 Root 并安装自定义系统；小天才 Z6 已 Root；学习机系统已修改"}, {"k": "未定", "v": "小米 8 上 Windows 实验的结果暂不陈述"}]
references: [{"label": "TWRP — Team Win Recovery Project（自定义 Recovery）", "url": "https://twrp.me"}, {"label": "LineageOS（Android 发行版）", "url": "https://lineageos.org"}, {"label": "Havoc-OS（Android 发行版）", "url": "https://havoc-os.com"}]
---

## 概述

高中时，我试验过定制 Android 设备：给手机 Root、使用自定义 Recovery、安装自定义系统，并折腾过两台嵌入式 Android 设备。这些都是在我自己的设备上做的个人实验，不是专业或有偿工作。部分实现细节已不再有记录。

## 技术背景

- **Root** 指获得设备系统的管理员级权限，原厂固件通常会限制这一点。
- **TWRP** 是社区制作的自定义 Recovery 环境，用于安装和备份系统镜像。
- **LineageOS** 和 **Havoc OS** 是社区维护的 Android 发行版。我安装使用，并没有开发它们。
- **小天才 Z6** 是儿童电话手表，**小爱老师**是学习机。两者运行基于 Android 的系统，带有厂商限制。

## 我的实验

- 给 Android 手机 Root。
- 使用 TWRP Recovery。
- 安装自定义系统并刷机，包括 Havoc OS 和 LineageOS 的安装实验。
- 在小米 8 上做了刷写 Windows 的实验。
- **对小天才 Z6 儿童电话手表完成了 Root。**
- 修改了小爱老师学习机的系统。

## 结果

- 手机已 Root，并安装了自定义系统。
- 小天才 Z6 电话手表已 Root。
- 小爱老师学习机的系统已被修改。
- 小米 8 上的 Windows 实验，我没有确认过结果，所以不写结论。

Z6 和学习机使用的工具、固件版本和具体方法没有记录，因此这里不列出。我不声称编译过内核、修改过 bootloader 源码、制作过 ROM 或发现过漏洞利用。这些操作系统和恢复工具都是他人的项目。

## 我学到了什么

- 定制设备时，具体型号和软件版本有多重要。
- 要依靠相关项目（TWRP、LineageOS）的文档，而不是凭猜测。
- 要边做边记录设备、版本和步骤，而我当时没有一直做到。

## 参考资料

以下是其他作者的项目，仅供参考，均不是我的作品。
