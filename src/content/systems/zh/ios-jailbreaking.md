---
pageSlug: "ios-jailbreaking"
lang: "zh"
title: "iOS 越狱与移动系统探索"
subtitle: "签名、侧载、越狱与 IPA 改包 · 高中阶段"
summary: "亲手进行的 iOS 实验：苹果代码签名原理、AltStore 与 SideStore 侧载、Dopamine 越狱、iPad mini 6 上的 TrollStore、插件，以及自己改包 PVZ2 的 IPA。"
order: 3
updated: "2026-11-02"
glance: [{"k": "背景", "v": "高中阶段的个人实验，不是工作"}, {"k": "工具", "v": "Dopamine、TrollStore、AltStore、SideStore、Filza、第三方软件源（均为他人成果）"}, {"k": "设备", "v": "iPad mini 6；Dopamine 运行在 iOS 15.4.1 上"}, {"k": "结果", "v": "完成工具配置并使用；修改过 IPA，但没有开发越狱或漏洞利用"}]
references: [{"label": "Dopamine — opa334 开发的越狱", "url": "https://github.com/opa334/Dopamine"}, {"label": "TrollStore — opa334 开发", "url": "https://github.com/opa334/TrollStore"}]
---

## 概述

高中时，我试验过 iOS 设备定制。我了解了苹果的代码签名机制（开发者证书、免费 Apple ID 签名和企业签名），侧载过应用，使用过 Dopamine 越狱，在 iPad mini 6 上配置过 TrollStore，并且自己改包过一款游戏（植物大战僵尸2）的 IPA。我用的是其他人编写的工具。我没有开发越狱、漏洞利用或这些工具。这些是个人实验，不是专业工作。部分实现细节已不再有记录。

## 技术背景

- **越狱**会解除 iOS 的部分限制，让应用和插件可以改变系统的行为。
- **Dopamine** 由 opa334 开发，作者将其描述为支持一系列 iOS 15 至 26 版本的半完美越狱（semi-untethered）。
- **TrollStore** 同样由 opa334 开发，作者将其描述为可以永久安装 IPA 文件的应用，且只适用于特定 iOS 版本。
- **软件源**是越狱设备可以从中获取应用和插件的软件包仓库。
- **代码签名**：iOS 只运行带有苹果认可证书签名的应用。免费 Apple ID 签名的应用 7 天后过期；**AltStore** 和 **SideStore** 会自动重签来绕开这个限制；**企业证书**本是用于公司内部分发。
- **有根与无根（rootful / rootless）越狱**的区别在于越狱文件放在哪里：有根会修改真正的根文件系统，无根则把所有内容放在独立的前缀目录下（Dopamine 是无根越狱），所以插件要按对应的目录布局来编译。
- **dylib 插件**是被加载进应用、用来改变其行为的动态库；**JIT**（即时编译）是部分应用需要、而 iOS 默认限制的能力；**Filza** 是越狱设备上用来浏览文件系统的文件管理器。

## 我的实验

- 在运行 iOS 15.4.1 的 iPad mini 6 上使用 Dopamine 越狱，并理解有根与无根越狱的区别。
- 在 iPad mini 6 上配置 TrollStore。
- 使用第三方软件源，并用 Filza 浏览文件系统。
- 用免费 Apple ID（7 天签名）通过 AltStore 和 SideStore 侧载应用。
- 为应用开启 JIT，并使用 dylib 插件。
- 为个人学习修改并重新打包了植物大战僵尸2 的 IPA。
- 了解企业签名的原理，以及它为什么只适用于公司内部分发。

## 结果

这些工具我都成功运行并使用过，PVZ2 的 IPA 也是我自己改包的。修改后的安装包只用于个人学习、在我自己的设备上运行，我不分发。TrollStore 所用的 iOS 版本、改过哪些插件以及具体步骤都没有记录，因此这里不陈述。

## 我学到了什么

- 哪个工具可用取决于具体设备和 iOS 版本，所以首先要读项目自己的支持版本说明。
- iOS 上应用的安装和签名方式与其他平台不同；第三方软件源和任何外部代码一样需要谨慎对待。
- 证书到期、权限（entitlements）和越狱的文件系统布局，决定了什么能装、什么不能装。

## 参考资料

以下是其他作者的项目，仅供参考，均不是我的作品。AltStore 和 SideStore 同样是其他作者的项目。
