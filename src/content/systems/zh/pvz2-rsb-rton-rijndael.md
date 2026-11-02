---
pageSlug: "pvz2-rsb-rton-rijndael"
lang: "zh"
title: "深入 PvZ2：RSB、RTON 与 Rijndael"
subtitle: "《植物大战僵尸 2》中文版(Android)· 2026 年复现与迷你解码器"
summary: "一款手机游戏的资源文件如何分层、一个从零写成的小型 RTON 解码器，以及在一个真实文件上的检验，并列出未验证的部分。"
order: 4
updated: "2026-11-02"
glance: [{"k": "背景", "v": "2026 年的个人学习项目，不是工作"}, {"k": "工具", "v": "Python（解码器在 AI 协助下写成，我已读懂）；用 py3rijndael 做解密检验；社区格式笔记"}, {"k": "结果", "v": "从一个 APK 端到端解码了一个真实 RTON；合成数据上 14 个单元测试通过"}, {"k": "未覆盖", "v": "只解码了一个文件；本文不含 iOS 与网络分析"}]
references: [{"label": "RETON — RTON 格式笔记(h3x4n1um)", "url": "https://github.com/h3x4n1um/RETON"}, {"label": "Pvz2Tool — RSB/RSGP 头部定义(DreamMoonCai,MIT)", "url": "https://github.com/DreamMoonCai/Pvz2Tool"}, {"label": "[removed] — RTON 加密发现([removed])", "url": "https://[removed]"}, {"label": "Z-Editor — 代码注释中描述的 RSLB 容器布局(yhzxcv,GPL-3.0；仅作为格式说明参考，未复制代码）", "url": "https://github.com/yhzxcv/Z-Editor"}, {"label": "PvZ2ModdingGuide — 社区指南(apples1949)", "url": "https://github.com/apples1949/PvZ2ModdingGuide"}, {"label": "The Design of Rijndael — Daemen 与 Rijmen(Springer)", "url": "https://link.springer.com/book/10.1007/978-3-662-04722-4"}, {"label": "FIPS 197：高级加密标准(NIST)", "url": "https://csrc.nist.gov/pubs/fips/197/final"}]
---

> 这是对我较早的页面 [PvZ2 资源分析](/zh/systems/pvz2-resource-analysis/) 的 2026 年后续：那一页记录我初中和高中时借助现有工具做的事，这一篇是我自己重新做出其中一部分，并准确写出我验证了什么。

## 1. 引言

我初二到初三的时候开始研究《植物大战僵尸 2》中文版的游戏文件。起因有两个：一是当时出了一个新模式"潘妮的追击"，关卡数据存在加密的文件里，我想知道能不能读出里面的内容，比如每一关怎么出怪；二是我想改动游戏的一些小功能，比如用金币购买阳光能量豆。这些问题把我带进了二进制文件格式和加密的世界。

一个 PVZ2 资源文件要经过三层相互独立的处理：

<figure class="flow" aria-label="所分析安卓版本的真实资源链路,从 APK 到 JSON">
<ol class="flow-main"><li><b>APK</b><small>zip 压缩包</small></li><li class="tool"><b>解开 .smf</b><small>RSLB · LZMA 分块</small></li><li class="tool"><b>RSB → RSGP</b><small>偏移量 + 大小</small></li><li><b>加密 RTON</b><small>以 10 00 开头</small></li><li class="tool"><b>Rijndael 解密</b><small>192 位分组 · CBC</small></li><li class="tool"><b>RTON → JSON</b><small>我的迷你解码器</small></li></ol>
<div class="flow-aux"><span class="mine"><b>密钥材料查找</b><small>.so 字符串 · 十六进制查看器</small></span><span class="flow-link">密钥和 IV 的来源字符串用于解密这一步</span></div>
<figcaption>我在一个中文版 APK 上验证的链路(第 6 节)。金色边框的步骤用到了我写的或查阅过的代码;额外的 .smf 层是这个版本里意料之外的一层。虚线框是对原生库的手动查找。</figcaption>
</figure>

另外有一条辅助路径，用来*找到*解密所需的材料：

```
Android APK ──▶ 原生库 (.so) ──▶ 检查字符串 ──▶ 密钥材料
```

本文**不是**：新的攻击、新的密码学结果或完整的工具。这些格式早在本文之前就被社区逆向出来，
来源见[参考资料](#references)。属于我的部分只有：(a) 讲解，(b) 为学习 RTON 而写的小解码器，
(c) 我能复现和不能复现之处的如实记录。

范围与说明：本文是出于学习目的的个人分析，在我自己的电脑上进行，不盈利。该游戏的使用条款不允许逆向工程，我知道这一点，读者请自行遵守适用的条款。我不公开游戏文件、账号或会话令牌，解码器的测试数据全部是合成的（代码见附录）。

## 2. 理解 RSB

### 2.1 "资源包"是什么

游戏有成千上万个小资源。在手机上逐个读文件很慢，所以引擎把它们打包成少数大文件。RSB 就是这样的容器。
社区的解包工具先读容器的*索引*，再把每个条目写成独立文件。

### 2.2 RSB 不是 ZIP

两者都是"一个文件装很多文件"，但结构不同：

- ZIP 有中央目录，并对每个文件单独压缩。
- 按社区工具 Pvz2Tool 的实现，RSB 有一个由偏移量组成的**定长头部**、一份**文件列表**，以及一张**资源组(RSGP)表**。
  压缩作用于*资源组的某个部分*，而不是逐个文件。

[来源：Pvz2Tool 的 `RsbHeadInfo.kt`、`RsgpHeadInfo.kt`]

### 2.3 头部

所有字段都是 32 位小端整数。Pvz2Tool 读取的 RSB 头部前几项依次是：

| # | 字段 | 含义 |
|---|---|---|
| 0 | magic | `0x72736231`，字节 `31 62 73 72` = ASCII `1bsr` |
| 1 | version | 整数（该工具最高接受 4) |
| 2 | （零） | 必须为 0 |
| 3 | headLength | 头部大小 |
| 4 | fileList_Length | 文件名列表大小 |
| 5 | fileList_BeginOffset | 该列表起始位置 |
| 6–7 | （零） | 必须为 0 |
| 8 | rsgpList_Length | 资源组名列表大小 |
| 9 | rsgpList_BeginOffset | 其起始位置 |
| 10 | rsgp_Number | 资源组数量 |
| 11 | rsgpInfo_BeginOffset | 资源组信息记录起点（每条 `0xCC` 字节） |
| … | composite / autopool / ptx 表 | 更多"数量 + 起始偏移"对 |

要带走的核心思想是 *偏移量 + 长度*：头部不含数据本身，只含**数据在哪**。
解析器需要的一切，都是"跳到某偏移、读已知长度"。

[来源：Pvz2Tool `RsbHeadInfo.kt`。魔数我自己验证过：常量 `1920164401` 按小端转成字节就是 `1bsr`。]

**版本差异是真实存在的。** 同一份源码的注释提到：PTX 信息记录通常是 `0x10` 字节，
而"中文版二代 RSB"是 `0x18`。能解析一个版本的程序可能在另一个版本上失败，
所以我的复现记录必须标明确切版本。

<figure class="flow">
<div style="overflow-x:auto"><svg viewBox="0 0 760 392" role="img" aria-label="RSB 的字节布局:头部、资源组记录、RSGP 块" style="width:100%;min-width:640px;height:auto;display:block"><text x="20" y="16" style="fill:var(--muted);font:11px var(--mono)">RSB 文件(所分析版本为 147,292,160 字节)</text><rect x="20" y="24" width="170" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="105.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">头部 + 各表</text><rect x="190" y="24" width="140" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="260.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP Credits_1200</text><rect x="330" y="24" width="150" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="405.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP Credits_Common</text><rect x="480" y="24" width="110" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="535.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">… 共 30 个资源组 …</text><rect x="590" y="24" width="150" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="665.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP __MANIFESTGROUP__</text><path d="M105 60 V96" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="92" style="fill:var(--muted);font:11px var(--mono)">RSB 头部字段</text><rect x="20" y="100" width="120" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="80.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">1bsr · 版本 4</text><rect x="140" y="100" width="110" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="195.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">headLength</text><rect x="250" y="100" width="170" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="335.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">rsgpInfo_BeginOffset</text><rect x="420" y="100" width="320" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="580.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">30 条 × 0xCC 字节的组记录</text><circle cx="414" cy="100" r="9" style="fill:var(--gold)"/><text x="414" y="104" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">1</text><path d="M580 136 V170" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="166" style="fill:var(--muted);font:11px var(--mono)">一条资源组记录(0xCC 字节)</text><rect x="20" y="174" width="180" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="110.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">名称(0x80 字节)</text><rect x="200" y="174" width="90" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="245.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">offset</text><rect x="290" y="174" width="90" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="335.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">size</text><rect x="380" y="174" width="360" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="560.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">part0 / part1:偏移、ZSize、Size</text><circle cx="284" cy="174" r="9" style="fill:var(--gold)"/><text x="284" y="178" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">2</text><path d="M245 210 V244" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="240" style="fill:var(--muted);font:11px var(--mono)">它指向的 RSGP 块</text><rect x="20" y="248" width="720" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="380.0" y="270.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">头部,魔数 pgsr:版本 · flags · 各部分偏移和大小 · 文件列表</text><rect x="20" y="284" width="720" height="36" rx="6" style="fill:var(--bg);stroke:var(--ok);stroke-width:1.2"/><text x="380.0" y="306.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">part0 数据:文件字节(这里以 10 00 开头 = 加密 RTON)</text><circle cx="731" cy="248" r="9" style="fill:var(--gold)"/><text x="731" y="252" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">3</text><text x="20" y="348" style="fill:var(--muted);font:11px var(--mono)">1  RSB 头部告诉你资源组记录从哪里开始。</text><text x="20" y="366" style="fill:var(--muted);font:11px var(--mono)">2  每条记录告诉你它的 RSGP 块从哪里开始、各部分多大。</text><text x="20" y="384" style="fill:var(--muted);font:11px var(--mono)">3  RSGP 块里才是真正的文件字节;解析器只需要「偏移 + 长度」。</text></svg></div>
<figcaption>图:解析器如何从 RSB 头部走到文件字节。字段名参照 Pvz2Tool 的定义;数字来自第 6 节分析的那个版本。</figcaption>
</figure>

### 2.4 资源组(RSGP)

每条资源组记录指向一个 RSGP 块，它有自己的头部，魔数 `0x72736770`(`70 67 73 72` = ASCII `pgsr`)。
里面有版本、flags、文件偏移，以及两个**部分**，每部分记录 `Offset`、`ZSize`（压缩后大小）和
`Size`（解压后大小），另有自己的文件列表。Pvz2Tool 的 README 说明使用 zlib 压缩与 4K 对齐。

恢复单个文件的流程：

1. 读 RSB 头 → 找到资源组表。
2. 对每个资源组，跳到它的 RSGP 块 → 读各部分的偏移和大小。
3. 若 `ZSize` 与 `Size` 不同，用 zlib 解压。
4. 用该组的文件列表把解压后的区域切成带路径的命名文件。

在本文使用的这个安装包里，RSB 外层还有一层 `.smf` 容器，资源组也没有使用 zlib 压缩，详见第 6 节。

我刻意不声称 `flags` 每一位的含义，因为我没有验证过。

## 3. 理解 RTON

RTON 是一种**二进制序列化**格式：对类 JSON 的结构化数据（对象、数组、字符串、数字、布尔值）的紧凑编码。
JSON 把一切写成文本；RTON 把每个值写成*一个字节的类型标记 + 数据*。

### 3.1 布局

```
"RTON"  | 版本 (uint32 小端,通常为 1) | 条目 … | FF | "DONE"
```

### 3.2 类型标记（我实现的子集）

| 标记 | 含义 |
|---|---|
| `00` / `01` | false / true |
| `08` / `0A` | int8 / uint8,1 字节 |
| `10` / `12` | int16 / uint16,2 字节（字节序假定为小端） |
| `20` | int32,4 字节（字节序假定为小端） |
| `21` | int32 零值，无载荷（仅有一个真实文件佐证，见第 6 节） |
| `24` | 无符号 varint |
| `25` | 有符号 varint |
| `81` | 字符串：varint 字节长度 + 字节 |
| `90` / `91` | 定义缓存字符串 / 按下标引用缓存 |
| `85` … `FF` | 对象 … 结束 |
| `86 FD` 个数 … `FE` | 数组 |

[来源：h3x4n1um/RETON 格式笔记。笔记本身把其他一些标记(`09`、`0B` 等 zero 变体、RTID `83`)标为不确定，所以我不实现。]

### 3.3 Varint

varint 用尽量少的字节存数字：每字节 7 位有效数据，最高位表示"后面还有字节"，低位组在前。

例：`FE 01` → `0x7E + (0x01 << 7)` = 126 + 128 = **254**。

有符号形式把解出的 `n` 映射为：偶数 `n/2`，奇数 `-(n+1)/2`，所以 `25 03` → `n=3` → **−2**。
正负小数都只占很少字节。

### 3.4 字符串缓存

键名如 `"Value"` 第一次出现时用 `90` 写出并存入表；之后只写 `91 下标`。
所以重复键很多的文件很小，也因此解码器必须在读取过程中保持状态。

### 3.5 解析器如何把字节变成 JSON

解析器维护位置 `pos`。循环：读一个字节（标记）→ 标记决定再读几个字节、怎么解释 → 推进 `pos`。
对象和数组是递归：见到 `85` 就调用"读对象"，直到 `FF`。结束时 `pos` 必须等于文件长度，
这是一个简单而有效的正确性检查。

## 4. 实现最小 RTON 解码器

**声明：** 我是在 AI 编程助手(Claude Code)的协助下写出这个解码器的：出发点是上文引用的社区格式笔记，以及我自己早先对这个格式的一些想法。我读过全部代码，能解释每个函数的作用。它不是纯手写，也不是新颖的实现。

**设计。** `Reader` 类保存字节和游标 `pos`。每个 `read_*` 方法消耗字节并推进 `pos`;
`read_value` 看标记后分派。对象和数组递归调用 `read_value`，所以嵌套无需特殊处理。
遇到不认识的标记就报错，不去猜。

**先写测试。** `tests/fixtures.py` 里有 11 组手工算出的字节串和期望的 Python 值，逐字节注释。
另有 11 个错误测试：魔数错误、版本错误、缺少尾部、尾部多余字节、字符串被截断、缓存下标错误、
不支持的标记、数组缺少结束符、无限长 varint、嵌套过深、非法 UTF-8。

**结果。** `python -m unittest` 共 14 个测试，全部通过(2026-11-02 运行）。

**局限。** 支持的标记：`00 01 08 0A 10 12 20 21 24 25 81 85 86 90 91`。
不支持浮点、`82`/`92`/`93` UTF-8 字符串、64 位整数、RTID。16/32 位整数的字节序是假定小端，
**尚未在真实文件上确认**。所有测试数据都是合成的，所以本节只能说明解码器与我对规格的理解一致，
**不能**说明它能解码真实的 PVZ2 文件，这只有 §6 能回答。

## 5. 理解 Rijndael 加密

### 5.1 Rijndael 与 AES

Rijndael 是 Joan Daemen 与 Vincent Rijmen 设计的分组密码家族。AES 是其标准化子集：
分组固定 128 位，密钥 128/192/256 位。Rijndael 本身允许分组为 128、192、256 位，且与密钥长度相互独立。
所以当分组不是 128 位时，"AES"和"Rijndael"不能互换。

### 5.2 社区对 PVZ2 RTON 的发现

来自 [removed] 的笔记（从某修改工具的原生库逆向而来）:

- 加密的 RTON 以两个字节 `10 00` 开头；
- 算法：**Rijndael CBC 模式**,**32 字节密钥**,**24 字节(192 位）分组**;
- IV 24 字节；填充：零填充到 24 字节的整数倍；解密时去掉最后一块末尾的零字节。

[来源：[removed]/NEW 的 `tools/RTON_ANALYSIS.md` 和 `tools/rton_crypto_cli.py`。
该仓库没有 LICENSE 文件，所以我只引用它的*发现*，不复制它的代码。]

实际后果：标准 AES 库(128 位分组）**无法**解密这类数据，需要支持 192 位分组的 Rijndael 实现。

### 5.3 密钥材料从哪来

我用 Python `hashlib` 自己验证过一个对应关系：取字符串 `[removed]`,
计算 [removed]，写成 32 个小写十六进制字符，这 32 个 ASCII 字符就是密钥；IV 是这 32 位密钥的第 4–27 位共 24 个字符(Python:`[removed]`)。
两者都和社区文档里的值一致。（我不在文中列出推导出的值，读者用三行代码就能算出来。）

这也说明了 ASCII 密钥与十六进制密钥的区别：这 32 个字符是*当作 ASCII 字节*直接使用的，
不是把十六进制还原成 16 字节。

### 5.4 为什么找到密钥不等于"破解"

算法是公开的，强度没有变化。客户端要解密自己的数据，就必须包含密钥，所以任何能读这个 App 的人都能找到它。
这是密钥*提取*，不是密码分析。Rijndael 本身没有被攻击。

### 5.5 我自己的探索

**当年的经历（来自我的记忆，不是本文的实验结果）。** 初中时，我在手机上用 MT Manager 直接打开 APK 本身，浏览其中的原生库(`.so`)，看到了字符串 `[removed]`。我记得它附近有一个和 key 有关的词，但记不清是哪个词。(2026 年重新查看时，同一位置附近与 key 相关的字符串是 `No public key loaded`，但我不能确定它就是当年记得的那个词。）之后，我的团队做了一个解密工具（我不是它的开发者）：把上面那个字符串输入进去，工具会用 [removed] 算出密钥和 IV，再解密文件。我只是使用它。我用它解密了关卡文件，得到能直接阅读的 JSON，并在电脑上用 Notepad++ 打开查看。具体的工具名称和操作顺序我已记不清，所以本文第 6 节用自己写的脚本重新走了一遍这条链路。

## 6. 复现工作流

**输入。** 一个中文版 Android APK(`baokai_4.2.7_1885_715_dj2.0-4.0.1.apk`,2,271,163,986 字节，
SHA-256 `7c09515d…90a5d7`)，仅在本机分析，不再分发。
我于 2026-11-02 从游戏网站 <https://pvz2.hrgame.com.cn/> 的安卓下载入口下载了这个安装包（页面版权方：拓维信息系统股份有限公司）。如开头所述，该游戏的使用条款不允许逆向工程；本文的分析仅限本机、仅为学习，我不分发游戏文件。
下面所有步骤于 2026-11-02 用项目 `tools/` 里的脚本运行。

**一个我没预料到的额外层。** 这个 APK 里的 RSB 不是裸文件：`assets/dynamic.rsb.smf` 以 ASCII 魔数 `RSLB` 开头。
它是一个分块容器：32 字节头、若干 36 字节的块记录，然后每块一个原始 LZMA1 流
（块大小 32 MiB,LZMA 参数 `lc=3 lp=0 pb=2`)。我是从社区解压器的注释里找到布局的，解压器是自己写的；
它输出的正好是头部声明的 147,292,160 字节。所以这个版本的真实链路是：

```
APK ─▶ .rsb.smf (RSLB, LZMA 分块) ─▶ RSB ─▶ RSGP ─▶ 加密 RTON ─▶ Rijndael ─▶ RTON ─▶ JSON
```

| 步骤 | 在这个 APK 上的结果 |
|---|---|
| 解开 `dynamic.rsb.smf` | 147,292,160 字节，以 `1bsr` 开头，与声明大小一致 |
| 读 RSB 头 | 版本 4,30 个资源组，组记录 `0xCC` 字节，PTX 记录 `0x18` 字节(Pvz2Tool 提到的"二代"变体） |
| 压缩 | 30 个资源组全部 `ZSize == Size`:**这个版本没有用到 zlib**，我完全没有实际测试过 zlib |
| 读一个 RSGP(`WorldPackages_beach`) | 魔数 `pgsr`，版本 4;part0 以 `10 00` 开头，即加密 RTON 标记 |
| Rijndael 解密 | 密钥 = 上述字符串的 [removed] 十六进制，IV = `[removed]`,24 字节分组，CBC；第一个文件解出 `RTON`、版本 1，以 `DONE` 结尾(258 字节） |
| 用 `mini_rton` 解码 | 完整解码，`pos` 正好停在文件末尾 |
| 原生库 | 该字符串在 `lib/arm64-v8a/libSrc.so` 和 `lib/armeabi-v7a/libSrc.so` 中各出现一次 |

解码出的对象（世界地图记录，不含个人或账号数据）:

```json
{"version": 1, "objects": [{"uid": "2.0.144207b4", "objclass": "WorldData",
  "objdata": {"m_worldName": "beach", "m_worldId": 8, "m_resGroupID": 7,
              "m_boundingRect": {"mX": 0, "mY": -150, "mWidth": 0, "mHeight": 300},
              "m_mapPieces": [], "m_eventList": [], "m_creationTime": 340233434,
              "m_version": 1}}]}
```

**真实文件教给解码器的东西。** 我第一次运行停在标记 `0x21`，格式笔记只把它列为未确认的"int32 零值"。
数据里 `mX` 和 `mWidth` 后面直接跟着 `21`、没有载荷，`mY` 是 `25 AB 02`（有符号 varint,−150),
`mHeight` 是 `24 AC 02`(300)。把 `21` 当作"值 0、无载荷"之后，整个文件解码完成并正好停在文件尾，
这是来自这一个文件的支持证据。我据此补了一个合成测试数据。

**未复现 / 未验证。**
- 只解码了**一个**资源组里的**一个** RTON，同组其他文件和其余 29 个资源组没有解码。
- 没有解析 RSGP 的文件名表，所以文件名只读懂了一部分。
- 16 位和 32 位整数的字节序仍未在真实数据上确认。
- 浮点、64 位整数、UTF-8 字符串(`82`)和 RTID(`83`)仍未实现。
- zlib 压缩没有被实际测试（见上），其他版本可能不同。
- 我初中时具体做过其中哪几步、用的什么工具，仍然只是我自己的记忆，这次运行并不能证明。

## 7. 收获

这个项目让我对手机应用的安装包有了更整体的理解。这次我实际分析的是 Android 的 APK：它本质上是一个 zip 包，里面有原生库(`.so`)、`assets` 资源和配置。此外，初三那年我也分析过 iOS 的 IPA，由此接触到苹果的签名证书（例如企业签名），以及越狱相关的工具和生态，如 TrollStore、软件源和 Filza，并且自己修改过 IPA，再重新打包、签名。这些是我凭记忆写下的个人经历，不属于本文的实验，本文没有复现它们。

我也第一次比较系统地接触了加解密：知道了密钥和 IV 的长度要求、不同加密算法的区别，以及 AES 和 Rijndael 的关系（这次遇到的是 192 位分组，标准 AES 库解不了）。同时我明白了"找到密钥"和"破解算法"是两回事。

在方法上，先依据规格写测试再写代码很有用。合成数据全部通过之后，真实文件仍然暴露出一个规格里没写清楚的标记 `0x21`，让我体会到格式文档和真实数据之间总有差距，必须用数据去验证。分析解码出来的 JSON，也让我学会了阅读结构化数据，看懂游戏如何把一个世界、一个关卡描述成数据。

接下来我想把网络协议(HTTP 请求的加密）作为独立的研究，先完成可复现的实验，再另写一篇文章。

## 附录 A：解码器(`mini_rton/decoder.py`)

MIT 许可，版权 2026 Ray Tian。只支持第 4 节列出的标记，其余标记会抛出 `RtonError`。

```python
"""A minimal RTON decoder covering a documented subset of the format.

Format notes: https://github.com/h3x4n1um/RETON (see docs/rton-scope.md).
Supported tags: 00 01 08 0A 10 12 20 24 25 81 85 86(FD..FE) 90 91.
Anything else raises RtonError instead of guessing.
"""

MAGIC = b"RTON"
FOOTER = b"DONE"

TAG_FALSE, TAG_TRUE = 0x00, 0x01
TAG_INT8, TAG_UINT8 = 0x08, 0x0A
TAG_INT16, TAG_UINT16 = 0x10, 0x12
TAG_INT32 = 0x20
TAG_INT32_ZERO = 0x21
TAG_UVARINT, TAG_SVARINT = 0x24, 0x25
TAG_STRING = 0x81
TAG_OBJECT = 0x85
TAG_ARRAY = 0x86
TAG_CACHE_DEFINE, TAG_CACHE_RECALL = 0x90, 0x91
TAG_ARRAY_BEGIN, TAG_ARRAY_END = 0xFD, 0xFE
TAG_OBJECT_END = 0xFF

MAX_DEPTH = 64


class RtonError(ValueError):
    """Raised for malformed or unsupported input."""


class Reader:
    """A cursor over bytes: every read advances `pos`."""

    def __init__(self, data):
        self.data = data
        self.pos = 0
        self.cache = []  # strings defined by tag 0x90, indexed by 0x91

    def read_bytes(self, n):
        if n < 0 or self.pos + n > len(self.data):
            raise RtonError(f"truncated: need {n} bytes at offset {self.pos}")
        chunk = self.data[self.pos:self.pos + n]
        self.pos += n
        return chunk

    def read_u8(self):
        return self.read_bytes(1)[0]

    def read_int(self, size, signed):
        return int.from_bytes(self.read_bytes(size), "little", signed=signed)

    def read_uvarint(self):
        """7 payload bits per byte, low group first; high bit = more bytes."""
        result = 0
        shift = 0
        while True:
            byte = self.read_u8()
            result |= (byte & 0x7F) << shift
            if byte < 0x80:
                return result
            shift += 7
            if shift > 63:
                raise RtonError(f"varint too long at offset {self.pos}")

    def read_svarint(self):
        n = self.read_uvarint()
        return n // 2 if n % 2 == 0 else -(n + 1) // 2

    def read_string_body(self):
        length = self.read_uvarint()
        raw = self.read_bytes(length)
        try:
            return raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise RtonError(f"invalid string bytes before offset {self.pos}") from exc

    def read_string(self, tag):
        """Read a string-valued tag (81, 90, 91) whose tag byte is already consumed."""
        if tag == TAG_STRING:
            return self.read_string_body()
        if tag == TAG_CACHE_DEFINE:
            text = self.read_string_body()
            self.cache.append(text)
            return text
        if tag == TAG_CACHE_RECALL:
            index = self.read_uvarint()
            if index >= len(self.cache):
                raise RtonError(f"cache index {index} out of range ({len(self.cache)} entries)")
            return self.cache[index]
        raise RtonError(f"expected string tag, got 0x{tag:02X} at offset {self.pos - 1}")

    def read_value(self, tag, depth):
        if depth > MAX_DEPTH:
            raise RtonError("nesting too deep")
        if tag == TAG_FALSE:
            return False
        if tag == TAG_TRUE:
            return True
        if tag == TAG_INT8:
            return self.read_int(1, True)
        if tag == TAG_UINT8:
            return self.read_int(1, False)
        if tag == TAG_INT16:
            return self.read_int(2, True)
        if tag == TAG_UINT16:
            return self.read_int(2, False)
        if tag == TAG_INT32:
            return self.read_int(4, True)
        if tag == TAG_INT32_ZERO:
            return 0  # no payload; seen in a real sample (mX / mWidth), see docs
        if tag == TAG_UVARINT:
            return self.read_uvarint()
        if tag == TAG_SVARINT:
            return self.read_svarint()
        if tag in (TAG_STRING, TAG_CACHE_DEFINE, TAG_CACHE_RECALL):
            return self.read_string(tag)
        if tag == TAG_OBJECT:
            return self.read_object(depth + 1)
        if tag == TAG_ARRAY:
            return self.read_array(depth + 1)
        raise RtonError(f"unsupported tag 0x{tag:02X} at offset {self.pos - 1}")

    def read_object(self, depth):
        """Read key/value pairs until FF. The opening 85 is already consumed."""
        result = {}
        while True:
            tag = self.read_u8()
            if tag == TAG_OBJECT_END:
                return result
            key = self.read_string(tag)
            result[key] = self.read_value(self.read_u8(), depth)

    def read_array(self, depth):
        """86 FD <count> <values...> FE. The opening 86 is already consumed."""
        marker = self.read_u8()
        if marker != TAG_ARRAY_BEGIN:
            raise RtonError(f"expected FD after array tag, got 0x{marker:02X}")
        count = self.read_uvarint()
        items = [self.read_value(self.read_u8(), depth) for _ in range(count)]
        end = self.read_u8()
        if end != TAG_ARRAY_END:
            raise RtonError(f"expected FE at array end, got 0x{end:02X}")
        return items


def decode(data):
    """Decode RTON bytes into Python objects (dict at the top level)."""
    reader = Reader(bytes(data))
    if reader.read_bytes(4) != MAGIC:
        raise RtonError("bad magic: not an RTON file")
    version = reader.read_int(4, False)
    if version != 1:
        raise RtonError(f"unsupported version {version}")
    result = reader.read_object(0)
    if reader.read_bytes(4) != FOOTER:
        raise RtonError("missing DONE footer")
    if reader.pos != len(reader.data):
        raise RtonError(f"{len(reader.data) - reader.pos} trailing bytes after footer")
    return result
```

## 附录 B：合成测试数据(`tests/fixtures.py`)

每个字节都有注释。错误处理的测试因篇幅省略。

```python
"""Hand-built RTON byte strings, each with its expected decoded value.

Every byte is annotated so you can check it against docs/rton-scope.md.
These are synthetic: they contain no game data.
"""

HEADER = bytes.fromhex("52544F4E" "01000000")  # "RTON" + version 1 (uint32 LE)
FOOTER = bytes.fromhex("444F4E45")              # "DONE"

# name -> (bytes, expected decoded Python value)
FIXTURES = {
    # {}   -- just the end-of-object marker FF
    "empty": (HEADER + bytes.fromhex("FF") + FOOTER, {}),

    # {"a": true, "b": false}
    #   81 01 61   string, 1 byte: "a"      01  true
    #   81 01 62   string, 1 byte: "b"      00  false
    "bools": (
        HEADER + bytes.fromhex("81 01 61 01  81 01 62 00  FF") + FOOTER,
        {"a": True, "b": False},
    ),

    # {"name": "Zombie"}
    #   81 04 6E616D65         "name"
    #   81 06 5A6F6D626965     "Zombie"
    "string": (
        HEADER + bytes.fromhex("81 04 6E616D65  81 06 5A6F6D626965  FF") + FOOTER,
        {"name": "Zombie"},
    ),

    # {"n": -2, "u": 200}
    #   08 FE   int8 0xFE = -2 (two's complement)
    #   0A C8   uint8 0xC8 = 200
    "small_ints": (
        HEADER + bytes.fromhex("81 01 6E 08 FE  81 01 75 0A C8  FF") + FOOTER,
        {"n": -2, "u": 200},
    ),

    # {"a": {"a": 1}}  -- cache define (90) then recall (91 00) inside a nested object
    #   90 01 61  define "a" (index 0)   85  object start
    #   91 00     recall index 0 ("a")   08 01  int8 1
    #   FF FF     inner end, outer end
    "nested_cache_recall": (
        HEADER + bytes.fromhex("90 01 61  85  91 00  08 01  FF  FF") + FOOTER,
        {"a": {"a": 1}},
    ),

    # {"a": [1, 2]}  -- 86 FD <count=2> 08 01 08 02 FE
    "array": (
        HEADER + bytes.fromhex("81 01 61  86 FD 02  08 01  08 02  FE  FF") + FOOTER,
        {"a": [1, 2]},
    ),

    # {"w": -300, "i": 70000}
    #   10 D4 FE  int16 LE: 0xFED4 = -300
    #   20 70 11 01 00  int32 LE: 0x00011170 = 70000
    "wide_ints": (
        HEADER + bytes.fromhex("81 01 77 10 D4 FE  81 01 69 20 70 11 01 00  FF") + FOOTER,
        {"w": -300, "i": 70000},
    ),

    # {"mX": 0, "mY": -150}  -- modelled on a real sample: 21 = int32 zero (no payload);
    # 25 AB 02 -> varint 0x2B + (2 << 7) = 299 (odd) -> -(299+1)/2 = -150
    "int32_zero_and_signed": (
        HEADER + bytes.fromhex("81 02 6D 58 21  81 02 6D 59 25 AB 02  FF") + FOOTER,
        {"mX": 0, "mY": -150},
    ),

    # --- varint fixtures ---
    # {"Value": 61}: key via cache-define 90, value unsigned varint 24 3D (0x3D = 61)
    "varint_cached_key": (
        HEADER + bytes.fromhex("90 05 56616C7565  24 3D  FF") + FOOTER,
        {"Value": 61},
    ),
    # {"n": -2}: signed varint 25 03 -> n=3 is odd -> -(3+1)/2 = -2
    "signed_varint": (
        HEADER + bytes.fromhex("81 01 6E  25 03  FF") + FOOTER,
        {"n": -2},
    ),
    # {"x": 254}: varint FE 01 -> 0x7E + (1 << 7) = 254
    "varint_two_bytes": (
        HEADER + bytes.fromhex("81 01 78  24 FE 01  FF") + FOOTER,
        {"x": 254},
    ),
}
```

## 参考资料

他人的成果，列出以供参考。Z-Editor 一项为 GPL-3.0，我只参考了其中的格式说明。
