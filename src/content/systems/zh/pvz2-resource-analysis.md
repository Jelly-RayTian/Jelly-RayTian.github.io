---
pageSlug: "pvz2-resource-analysis"
lang: "zh"
title: "PvZ2 资源分析"
subtitle: "《植物大战僵尸 2》中文版（Android）· 高中阶段"
summary: "借助社区已有工具，研究一款手机游戏的加密资源文件如何打包、保护和读取。"
order: 1
updated: "2026-11-02"
glance: [{"k": "背景", "v": "高中阶段的个人学习项目，不是工作"}, {"k": "工具", "v": "MT Manager；解包、解密和 RTON 解码使用社区已有工具（名称未记录）"}, {"k": "结果", "v": "解密了 RTON 资源文件，并读取解码后的配置数据"}, {"k": "进行中", "v": "网络流量分析，尚未验证"}]
references: []
---

## 概述

高中时，我拆解了《植物大战僵尸 2》中文版（Android）的加密资源文件，想弄清楚它们是怎样被打包和保护的。我沿用社区已有的工具和文档。我没有编写解包器、解密代码或 RTON 解析器，也不声称发现了漏洞。

这是个人学习，不是有偿或专业工作。部分实现细节已不再有记录。

## 技术背景

- **RSB** 是 PopCap 游戏使用的资源归档格式，打包游戏的各类资源，社区作者有相关文档。
- **RTON** 是一种二进制、类似 JSON 的格式，用于游戏配置数据。
- 中文版用 **Rijndael**（AES 所出自的加密算法家族）加密 RTON 数据。解密需要**密钥（key）**和 **IV（初始化向量）**，而这些必然包含在游戏自己的原生代码里。
- **MT Manager** 是 Android 上的文件与二进制查看工具，我用它读取游戏的原生库（`.so`）。

<figure class="flow" aria-label="《植物大战僵尸 2》资源处理流程，Android 原生库作为辅助的密钥分析步骤">
<ol class="flow-main">
<li><b>RSB</b><small>资源包</small></li>
<li class="tool"><b>Unpack</b><small>已有工具</small></li>
<li><b>Encrypted RTON</b><small>数据文件</small></li>
<li class="tool"><b>Rijndael Decrypt</b><small>已有工具</small></li>
<li class="tool"><b>RTON Decode</b><small>已有工具</small></li>
<li><b>JSON</b><small>可读数据</small></li>
</ol>
<div class="flow-aux"><span class="mine"><b>.so key analysis</b><small>MT Manager · 我的检查</small></span><span class="flow-link">密钥与 IV 供给 Rijndael Decrypt 步骤</span></div>
<figcaption>我理解的处理流程。带金色边框的步骤使用的是社区已有工具，不是我写的代码。虚线框是我亲手做的部分：在 Android 原生库里检查密钥材料。</figcaption>
</figure>

## 我的实验

1. 用已有工具解开 RSB 资源包，提取其中的 RTON 文件。
2. 作为独立的辅助步骤，用 MT Manager 打开 Android 的 `.so` 文件，在字符串和常量里查找与加密相关的内容。
3. 找到与 Rijndael 加密相关的密钥材料，并学习 key 与 IV 的用法。具体数值不在此公开。
4. 用已有工具解密 RTON 文件并解码。
5. 查看解密后的游戏配置数据。

### 网络流量分析（进行中）

我也观察过中文版与服务器通信的方式。它的 HTTP 请求带有类似下面的表单字段（数值为占位符）：

```text
req=V1270
e=<encrypted payload>
ev=3
```

我没有验证每个字段的含义。社区有项目处理相关的服务器数据，例如 [Lawnstrings-Server](https://github.com/viiguess/Lawnstrings-Server)，它把服务器下发的文件做 Base64 解码，得到加密的 RTON。我也见过社区对这种请求格式的实现，使用 Base64URL 和分组密码处理，但我还没有用自己的抓包数据核对它们，因此不把它们当作引用来源。

我没有确认自己早先抓到的请求能否被解密。这是进行中的探索，不是结果。本站不公开账号数据、服务器令牌或第三方密钥。

## 结果

- 用已有工具解密 RTON 资源文件，并读取解码后的配置数据。
- 亲手在 Android 原生库中找到与加密相关的字符串和密钥材料。
- 网络请求分析尚未完成，也未验证。

解密、解包和解码工具是其他作者的成果。我的部分是调查过程和对密钥材料的检查。

## 我学到了什么

- 游戏如何用对称加密保护数据，以及为什么 key 和 IV 必须能从游戏自己的代码里取到。
- 面对不熟悉的二进制格式，如何通过阅读社区文档、对照工具输出来推进，而不是靠猜。
- 实验时要记笔记，方便以后复现；并清楚地说明哪些是我做的，哪些来自已有工具。
