---
pageSlug: "pvz2-rsb-rton-rijndael"
lang: "en"
title: "Inside PvZ2: RSB, RTON and Rijndael"
subtitle: "Plants vs. Zombies 2 (Chinese version, Android) · 2026 reproduction and a mini decoder"
summary: "How the resource files of a mobile game are layered, a small RTON decoder written from scratch, and a check against one real file, with the unverified parts listed."
order: 4
updated: "2026-11-02"
glance: [{"k": "Context", "v": "Personal learning project, 2026; not employment"}, {"k": "Tools", "v": "Python (decoder written with AI assistance, read and understood by me); py3rijndael for the decrypt check; community format notes"}, {"k": "Outcome", "v": "One real RTON decoded end to end from an APK; 14 unit tests pass on synthetic data"}, {"k": "Not covered", "v": "Only one file decoded; no iOS or network analysis in this article"}]
references: [{"label": "RETON — RTON format notes (h3x4n1um)", "url": "https://github.com/h3x4n1um/RETON"}, {"label": "Pvz2Tool — RSB/RSGP header definitions (DreamMoonCai, MIT)", "url": "https://github.com/DreamMoonCai/Pvz2Tool"}, {"label": "[removed] — RTON encryption findings ([removed])", "url": "https://[removed]"}, {"label": "Z-Editor — RSLB container layout described in code comments (yhzxcv, GPL-3.0; used as a format description only, no code copied)", "url": "https://github.com/yhzxcv/Z-Editor"}, {"label": "PvZ2ModdingGuide — community guide (apples1949)", "url": "https://github.com/apples1949/PvZ2ModdingGuide"}, {"label": "The Design of Rijndael — Daemen and Rijmen (Springer)", "url": "https://link.springer.com/book/10.1007/978-3-662-04722-4"}, {"label": "FIPS 197: Advanced Encryption Standard (NIST)", "url": "https://csrc.nist.gov/pubs/fips/197/final"}]
---

> This is a 2026 follow-up to my older page [PvZ2 Resource Analysis](/systems/pvz2-resource-analysis/), which describes what I did in middle and high school with existing tools. Here I rebuild part of that work myself and say exactly what I verified.

## 1. Introduction

In middle school (around Grades 8–9), I started poking at the files of the Chinese version of *Plants vs. Zombies 2*. I had two motivations. A new mode, Penny's Pursuit, had just come out, and its level data lived in encrypted files; I wanted to read what was inside, such as how zombies are spawned in each level. I also wanted to change small features of the game, for example buying Plant Food with coins. Those questions led me into binary file formats and encryption.

This article explains three separate layers that a PVZ2 asset passes through:

<figure class="flow" aria-label="Real resource chain of the analysed Android build, from APK to JSON">
<ol class="flow-main"><li><b>APK</b><small>zip archive</small></li><li class="tool"><b>Unwrap .smf</b><small>RSLB · LZMA blocks</small></li><li class="tool"><b>RSB → RSGP</b><small>offsets + sizes</small></li><li><b>Encrypted RTON</b><small>starts 10 00</small></li><li class="tool"><b>Rijndael decrypt</b><small>192-bit block · CBC</small></li><li class="tool"><b>RTON → JSON</b><small>my mini decoder</small></li></ol>
<div class="flow-aux"><span class="mine"><b>Key-material search</b><small>.so strings · hex viewer</small></span><span class="flow-link">the string behind the key and IV feeds the decrypt step</span></div>
<figcaption>The chain I verified on one Chinese-version APK (§6). Gold-edged steps used code I wrote or read about; the extra .smf layer was a surprise in this build. The dashed box is the manual search of the native library.</figcaption>
</figure>

and a side path used to *find* the decryption material:

```
Android APK ──▶ native library (.so) ──▶ inspect strings ──▶ key material
```

Three things this article is **not**: it does not present a new attack, a new
cryptographic result, or a complete tool. The formats were reverse-engineered by the
modding community long before this article; I credit the sources in
[References](#references). What is mine is (a) the explanation, (b) a small
decoder I wrote to learn the RTON layer, and (c) a record of what I could and could
not reproduce.

Scope and notice: this is personal, non-commercial analysis for learning, done locally on my own computer. The game's terms of service do not permit reverse engineering, and I am aware of that; readers should follow the terms that apply to them. I publish no game files, account data or session tokens, and all test data for my decoder is synthetic (the code is in the appendices).

## 2. Understanding RSB

### 2.1 What a "resource bundle" is

A game ships thousands of small assets (images, sound, data). Reading them one by
one from the filesystem is slow on a phone, so the engine packs them into a few big
files. An RSB is such a container. The unpacking tools you see in the community read
the container's *index* and then write each entry out as its own file.

### 2.2 RSB is not ZIP

Both are "many files in one file", but they differ in structure:

- A ZIP has a central directory of entries and compresses each file individually.
- An RSB, as implemented by the community tool Pvz2Tool, has a fixed-size **header of
  offsets**, a **file list**, and a table of **resource groups (RSGP)**. Compression
  is applied to *parts of a group*, not to each file separately.

[Source: Pvz2Tool, `RsbHeadInfo.kt`, `RsgpHeadInfo.kt`.]

### 2.3 The header

All fields are 32-bit little-endian integers. The first fields of the RSB header, as
read by Pvz2Tool, are in this order:

| # | Field | Meaning |
|---|---|---|
| 0 | magic | `0x72736231`, which are the bytes `31 62 73 72` = ASCII `1bsr` |
| 1 | version | an integer (the tool accepts up to 4) |
| 2 | (zero) | must be 0 |
| 3 | headLength | header size |
| 4 | fileList_Length | size of the file-name list |
| 5 | fileList_BeginOffset | where that list starts |
| 6–7 | (zero) | must be 0 |
| 8 | rsgpList_Length | size of the group-name list |
| 9 | rsgpList_BeginOffset | where it starts |
| 10 | rsgp_Number | how many resource groups |
| 11 | rsgpInfo_BeginOffset | where the group-info records start (each record is `0xCC` bytes) |
| … | composite / autopool / ptx tables | more `Number` + `BeginOffset` pairs |

The idea to take away is *offset + length*: the header does not contain the data, it
contains **where to find the data**. Everything a parser needs is reachable by
jumping to an offset and reading a known number of bytes.

[Source: Pvz2Tool `RsbHeadInfo.kt`. I verified the magic value by converting the
constant `1920164401` to bytes myself: little-endian gives `1bsr`.]

**Version differences are real.** The same source notes in a comment that the PTX
info record is `0x10` bytes normally but `0x18` in the "Chinese-version second
generation RSB". A parser that works for one build can fail on another; this is why I
mark my own reproduction by exact version.

<figure class="flow">
<div style="overflow-x:auto"><svg viewBox="0 0 760 392" role="img" aria-label="Byte layout of an RSB: header, group records, RSGP blocks" style="width:100%;min-width:640px;height:auto;display:block"><text x="20" y="16" style="fill:var(--muted);font:11px var(--mono)">RSB file (147,292,160 bytes in the analysed build)</text><rect x="20" y="24" width="170" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="105.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">header + tables</text><rect x="190" y="24" width="140" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="260.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP Credits_1200</text><rect x="330" y="24" width="150" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="405.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP Credits_Common</text><rect x="480" y="24" width="110" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="535.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">… 30 groups …</text><rect x="590" y="24" width="150" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="665.0" y="46.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">RSGP __MANIFESTGROUP__</text><path d="M105 60 V96" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="92" style="fill:var(--muted);font:11px var(--mono)">RSB header fields</text><rect x="20" y="100" width="120" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="80.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">1bsr · version 4</text><rect x="140" y="100" width="110" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="195.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">headLength</text><rect x="250" y="100" width="170" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="335.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">rsgpInfo_BeginOffset</text><rect x="420" y="100" width="320" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="580.0" y="122.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">30 × 0xCC group records</text><circle cx="414" cy="100" r="9" style="fill:var(--gold)"/><text x="414" y="104" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">1</text><path d="M580 136 V170" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="166" style="fill:var(--muted);font:11px var(--mono)">one group record (0xCC bytes)</text><rect x="20" y="174" width="180" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="110.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">name (0x80 bytes)</text><rect x="200" y="174" width="90" height="36" rx="6" style="fill:var(--bg);stroke:var(--gold);stroke-width:1.2"/><text x="245.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">offset</text><rect x="290" y="174" width="90" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="335.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">size</text><rect x="380" y="174" width="360" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="560.0" y="196.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">part0 / part1: offset, ZSize, Size</text><circle cx="284" cy="174" r="9" style="fill:var(--gold)"/><text x="284" y="178" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">2</text><path d="M245 210 V244" style="stroke:var(--gold);stroke-width:1.2;stroke-dasharray:4 3;fill:none"/><text x="20" y="240" style="fill:var(--muted);font:11px var(--mono)">the RSGP block it points to</text><rect x="20" y="248" width="720" height="36" rx="6" style="fill:var(--bg);stroke:var(--line);stroke-width:1.2"/><text x="380.0" y="270.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">header, magic pgsr: version · flags · part offsets and sizes · file list</text><rect x="20" y="284" width="720" height="36" rx="6" style="fill:var(--bg);stroke:var(--ok);stroke-width:1.2"/><text x="380.0" y="306.0" text-anchor="middle" style="fill:var(--ink);font:11px var(--mono)">part0 data: file bytes (here starts 10 00 = encrypted RTON)</text><circle cx="731" cy="248" r="9" style="fill:var(--gold)"/><text x="731" y="252" text-anchor="middle" style="fill:var(--on-gold);font:bold 11px var(--sans)">3</text><text x="20" y="348" style="fill:var(--muted);font:11px var(--mono)">1  The RSB header says where the group records start.</text><text x="20" y="366" style="fill:var(--muted);font:11px var(--mono)">2  Each record says where its RSGP block starts and how big its parts are.</text><text x="20" y="384" style="fill:var(--muted);font:11px var(--mono)">3  The RSGP block holds the actual file bytes; offset + length is all a parser needs.</text></svg></div>
<figcaption>Figure: how a parser walks from the RSB header to file bytes. Field names follow the Pvz2Tool definitions; the numbers come from the build analysed in §6.</figcaption>
</figure>

### 2.4 Resource groups (RSGP)

Each group record points to an RSGP block with its own header, magic `0x72736770`
(`70 67 73 72` = ASCII `pgsr`). It stores a version, flags, a file offset, and two
**parts**, each as `Offset`, `ZSize` (compressed size) and `Size` (uncompressed
size), plus its own file list. Pvz2Tool's README describes zlib compression and 4 KB
alignment.

So the recovery procedure for one file is:

1. Read the RSB header → find the group table.
2. For each group, jump to its RSGP block → read the part offsets and sizes.
3. If `ZSize` differs from `Size`, inflate the bytes with zlib.
4. Use the group's file list to cut the decompressed region into named files with
   their paths.

In the package used for this article, the RSB is wrapped in an extra `.smf` container and the resource groups do not use zlib compression; see §6.

I am deliberately not claiming what every `flags` bit means; I have not verified it.

### 2.5 Checking the layout on a real RSB

Everything above came from other people's source code. To see whether it holds on a real file, I parsed the 147,292,160-byte RSB from §6 with a short script (Appendix D). What came out:

- The header says version 4 and 30 resource groups. The group records are 204 (`0xCC`) bytes each and start at offset 383,936 (`0x5DBC0`). `headLength` is 397,312 (`0x61000`).
- The first group starts exactly at `headLength`. Every group starts where the previous one ends, and the last group ends exactly at the end of the file. So `headLength + (sum of group sizes) = 397,312 + 146,894,848 = 147,292,160`: the header accounts for the whole file. A parser can use this as a cheap sanity check.
- Every group offset and size is a multiple of 4096, which matches the "4 KB alignment" in Pvz2Tool's README.
- 24 groups use only `part0` and 6 use only `part1`. I do not know what the two parts mean in this build, so I do not interpret them.
- 19 groups have a first part that begins with the two bytes `10 00`: `Packages` and the 18 `WorldPackages_*` groups. That is the encrypted-RTON marker from §5.

| Group | Offset | Size | part0 | part1 |
|---|---:|---:|---:|---:|
| `Credits_1200` | 397,312 | 679,936 | 0 | 675,840 |
| `Credits_Common` | 1,077,248 | 348,160 | 344,064 | 0 |
| `LawnStrings` | 1,425,408 | 3,047,424 | 3,043,328 | 0 |
| `MainMenu_Background_1200` | 4,472,832 | 2,695,168 | 0 | 2,691,072 |
| `MainMenu_Background_Effect_1200` | 7,168,000 | 22,405,120 | 0 | 22,401,024 |
| `MainMenu_Background_Effect_Common` | 29,573,120 | 413,696 | 409,600 | 0 |
| `Packages` | 29,986,816 | 67,760,128 | 67,354,624 | 0 |
| `UI_AlwaysLoaded_Dynamic_1200` | 97,746,944 | 7,471,104 | 0 | 7,467,008 |
| `UI_Card_Plant_BG_1200` | 105,218,048 | 3,743,744 | 0 | 3,739,648 |
| `UI_PVZ1_Temp_1200` | 108,961,792 | 34,975,744 | 0 | 34,971,648 |
| `UI_PVZ1_Temp_Common` | 143,937,536 | 1,945,600 | 1,941,504 | 0 |
| `WorldPackages_beach` | 145,883,136 | 40,960 | 36,864 | 0 |
| `WorldPackages_cowboy` | 145,924,096 | 24,576 | 20,480 | 0 |
| `WorldPackages_dark` | 145,948,672 | 45,056 | 40,960 | 0 |
| `WorldPackages_dino` | 145,993,728 | 49,152 | 45,056 | 0 |
| `WorldPackages_egypt` | 146,042,880 | 20,480 | 16,384 | 0 |
| `WorldPackages_eighties` | 146,063,360 | 40,960 | 36,864 | 0 |
| `WorldPackages_future` | 146,104,320 | 28,672 | 24,576 | 0 |
| `WorldPackages_heian` | 146,132,992 | 28,672 | 24,576 | 0 |
| `WorldPackages_iceage` | 146,161,664 | 36,864 | 32,768 | 0 |
| `WorldPackages_kongfu` | 146,198,528 | 20,480 | 16,384 | 0 |
| `WorldPackages_lostcity` | 146,219,008 | 49,152 | 45,056 | 0 |
| `WorldPackages_mausoleum` | 146,268,160 | 24,576 | 20,480 | 0 |
| `WorldPackages_modern` | 146,292,736 | 36,864 | 32,768 | 0 |
| `WorldPackages_pirate` | 146,329,600 | 28,672 | 24,576 | 0 |
| `WorldPackages_renai` | 146,358,272 | 28,672 | 24,576 | 0 |
| `WorldPackages_skycity` | 146,386,944 | 20,480 | 16,384 | 0 |
| `WorldPackages_steam` | 146,407,424 | 24,576 | 20,480 | 0 |
| `WorldPackages_tutorial` | 146,432,000 | 8,192 | 4,096 | 0 |
| `__MANIFESTGROUP__DYNAMIC` | 146,440,192 | 851,968 | 847,872 | 0 |

## 3. Understanding RTON

RTON is a **binary serialization** format: a compact encoding of JSON-like structured
data (objects, arrays, strings, numbers, booleans). A JSON file spells everything as
text; RTON spells each value as *a one-byte type tag followed by its payload*.

### 3.1 Layout

```
"RTON"  | version (uint32 LE, usually 1) | entries … | FF | "DONE"
```

### 3.2 Type tags (subset I implement)

| Tag | Meaning |
|---|---|
| `00` / `01` | false / true |
| `08` / `0A` | int8 / uint8, 1 byte |
| `10` / `12` | int16 / uint16, 2 bytes (byte order assumed little-endian) |
| `20` | int32, 4 bytes (byte order assumed little-endian) |
| `21` | int32 zero, no payload (confirmed only by one real file, see §6) |
| `24` | unsigned varint |
| `25` | signed varint |
| `81` | string: varint byte-length, then bytes |
| `90` / `91` | define a cached string / refer to cache entry by index |
| `85` … `FF` | object … end |
| `86 FD` count … `FE` | array |

[Source: h3x4n1um/RETON format notes. The notes themselves mark several other tags
(`09`, `0B`, … zero-value variants, RTID `83`) as uncertain, so I leave them out.]

### 3.3 Varints

A varint stores a number in as few bytes as needed: each byte carries 7 payload bits,
and the top bit says "another byte follows", least-significant group first.

Example: `FE 01` → `0x7E + (0x01 << 7)` = 126 + 128 = **254**.

The signed form maps the decoded value `n` to `n/2` if even and `-(n+1)/2` if odd, so
`25 03` → `n = 3` → **−2**. Small magnitudes, positive or negative, stay short.

### 3.4 String cache

The first time a key such as `"Value"` appears it is written with `90` and added to a
table; later occurrences are just `91 index`. This is why files with many repeated
keys stay small — and why a decoder must keep state while it reads.

### 3.5 How a parser turns bytes into JSON

A parser keeps a position `pos`. Loop: read one byte (tag) → the tag decides how many
more bytes to read and how to interpret them → advance `pos`. Objects and arrays are
recursion: seeing `85`, call "read an object" until `FF`. When finished, `pos` must
equal the file length — a cheap but powerful correctness check.

### 3.6 A real RTON, byte by byte

This is the whole 258-byte file from §6, decrypted, with each line explained by an annotator I wrote (Appendix E). Indentation shows nesting; offsets are in hex.

```text
0000  52 54 4f 4e                    magic "RTON"
0004  01 00 00 00                    version = 1 (uint32 LE)
0008  90 07 76 65 72 73 69 6f ..+1     key, define cache[0] "version"
0011  24 01                            unsigned varint = 1
0013  90 07 6f 62 6a 65 63 74 ..+1     key, define cache[1] "objects"
001C  86 fd 01                         array start, 1 item(s)
001F  85                                 object start
0020  90 03 75 69 64                       key, define cache[2] "uid"
0025  90 0c 32 2e 30 2e 31 34 ..+6         define cache[3] = "2.0.144207b4"
0033  90 08 6f 62 6a 63 6c 61 ..+2         key, define cache[4] "objclass"
003D  90 09 57 6f 72 6c 64 44 ..+3         define cache[5] = "WorldData"
0048  90 07 6f 62 6a 64 61 74 ..+1         key, define cache[6] "objdata"
0051  85                                   object start
0052  90 0b 6d 5f 6d 61 70 50 ..+5           key, define cache[7] "m_mapPieces"
005F  86 fd 00                               array start, 0 item(s)
0062  fe                                     array end
0063  90 0b 6d 5f 65 76 65 6e ..+5           key, define cache[8] "m_eventList"
0070  86 fd 00                               array start, 0 item(s)
0073  fe                                     array end
0074  90 0b 6d 5f 77 6f 72 6c ..+5           key, define cache[9] "m_worldName"
0081  90 05 62 65 61 63 68                   define cache[10] = "beach"
0088  90 0e 6d 5f 63 72 65 61 ..+8           key, define cache[11] "m_creationTime"
0098  20 da 8c 47 14                         fixed int, value 340233434
009D  90 0c 6d 5f 72 65 73 47 ..+6           key, define cache[12] "m_resGroupID"
00AB  24 07                                  unsigned varint = 7
00AD  90 0e 6d 5f 62 6f 75 6e ..+8           key, define cache[13] "m_boundingRect"
00BD  85                                     object start
00BE  90 02 6d 58                              key, define cache[14] "mX"
00C2  21                                       int32 zero (no payload) = 0
00C3  90 02 6d 59                              key, define cache[15] "mY"
00C7  25 ab 02                                 signed varint = -150
00CA  90 06 6d 57 69 64 74 68                  key, define cache[16] "mWidth"
00D2  21                                       int32 zero (no payload) = 0
00D3  90 07 6d 48 65 69 67 68 ..+1             key, define cache[17] "mHeight"
00DC  24 ac 02                                 unsigned varint = 300
00DF  ff                                     object end
00E0  90 09 6d 5f 77 6f 72 6c ..+3           key, define cache[18] "m_worldId"
00EB  24 08                                  unsigned varint = 8
00ED  90 09 6d 5f 76 65 72 73 ..+3           key, define cache[19] "m_version"
00F8  24 01                                  unsigned varint = 1
00FA  ff                                   object end
00FB  ff                                 object end
00FC  fe                               array end
00FD  ff                             object end
00FE  44 4f 4e 45                    footer "DONE"
```

Things worth noticing:

- Every string, keys and values alike, goes through the cache: there are 20 `90` definitions and no `91` recalls. A recall only appears when a string repeats, and nothing repeats in this small file. Recalls are tested by my synthetic fixture `nested_cache_recall`.
- An empty array is just `86 FD 00 FE`.
- `mX` and `mWidth` are `21`: one byte, no payload.
- `mY = -150` and `mHeight = 300` describe a rectangle centred on y = 0, which is what a sensible bounding box looks like. That is a sanity check on the signed varint, not a proof.
- `m_creationTime` is `20 DA 8C 47 14`, a 32-bit integer. Read as little-endian it is 340,233,434. This file alone cannot tell me whether little-endian is right, because I do not know what value to expect.

## 4. Building a Minimal RTON Decoder

**Disclosure.** I wrote this decoder with the help of an AI coding assistant (Claude Code), starting from the community format notes cited above and from my own earlier ideas about how the format works. I have read the code and can explain each function. It is not hand-written, and it is not a novel implementation.

**Design.** A `Reader` class holds the bytes and a cursor `pos`. Every `read_*`
method consumes bytes and advances `pos`; `read_value` looks at the tag and
dispatches. Objects and arrays call `read_value` recursively, so nesting works
without special cases. The decoder rejects anything it does not recognise instead of
guessing.

**Tests first.** Eleven fixtures in `tests/fixtures.py` are hand-computed byte strings
with their expected Python values, each annotated byte by byte. A further eleven
tests cover errors: bad magic, bad version, missing footer, trailing bytes, truncated
string, bad cache index, unsupported tag, missing array end, runaway varint,
excessive nesting, invalid UTF-8.

**Result.** `python -m unittest` runs 14 tests, all passing (run on 2 Nov 2026).

**Limits.** Supported tags: `00 01 08 0A 10 12 20 21 24 25 81 85 86 90 91`. No floats,
no `82`/`92`/`93` UTF-8 strings, no 64-bit integers, no RTID. Integer byte order for
16/32-bit values is assumed little-endian and is **not yet confirmed on a real file**.
All fixtures are synthetic, so this section shows the decoder agrees with my reading
of the spec, **not** that it decodes real PVZ2 files. Only §6 can say that.

### 4.1 Reading the decoder, function by function

The full code is in Appendix A. This is what each part does and why.

**`Reader`.** Holds `data`, the cursor `pos`, and the string `cache`. Keeping `cache` on the object, not in a global, means two decodes cannot interfere with each other.

**`read_bytes(n)`.** The only place that touches `data` and moves `pos`. It checks `pos + n` against the length first, so a truncated file raises `RtonError("truncated ...")` instead of quietly returning fewer bytes. Everything else is built on it, so the bounds check exists exactly once.

**`read_int(size, signed)`.** Converts `size` bytes with `int.from_bytes(..., "little", signed=...)`. This is where the little-endian assumption lives, in one place.

**`read_uvarint()`.** The loop from §3.3: take the low 7 bits (`byte & 0x7F`), shift them into place, stop when the high bit is 0 (`byte < 0x80`), otherwise add 7 to the shift. It gives up past 63 bits so a file full of `FF` bytes cannot loop forever.

**`read_svarint()`.** Reads an unsigned varint `n` and applies the mapping: `n // 2` if even, `-(n + 1) // 2` if odd.

**`read_string(tag)`.** Three tags share one function. `81` reads a length-prefixed string. `90` does the same and appends the result to `cache`. `91` reads an index and returns `cache[index]`, raising `RtonError` if the index is out of range.

**`read_value(tag, depth)`.** A chain of `if` checks, one per supported tag. Anything not listed ends in `raise RtonError("unsupported tag ...")`: the decoder refuses to guess. `depth` is passed down so deeply nested input stops at 64 levels instead of exhausting Python's stack.

**`read_object` and `read_array`.** They call `read_value` for each child, so nesting needs no special code. An object reads a key (always a string tag) and then a value until it meets `FF`. An array requires `FD`, reads a count, reads that many values, and requires `FE`.

**`decode(data)`.** Checks the magic and version, reads the top-level object, then requires `DONE` and that `pos` equals the file length. The last check catches files with trailing bytes.

The design choice that matters most: every function either returns a correct value or raises. There is no "best effort" path, so a wrong tag shows up as an error with an offset, not as quietly wrong data.

## 5. Understanding Rijndael Encryption

### 5.1 Rijndael vs. AES

Rijndael is a family of block ciphers designed by Joan Daemen and Vincent Rijmen. AES
is the standardised subset: block size fixed at 128 bits, keys of 128/192/256 bits.
Rijndael itself allows block sizes 128, 192 or 256 bits independently of the key
size. So "AES" and "Rijndael" are not interchangeable when the block size is not
128 bits.

### 5.2 What the community found for PVZ2 RTON

From the [removed] notes (reverse-engineered from a modding toolkit's native
library):

- an encrypted RTON starts with the two bytes `10 00`;
- cipher: **Rijndael in CBC mode**, **32-byte key**, **24-byte (192-bit) block**;
- IV: 24 bytes; padding: zero-padding to a 24-byte block; on decryption trailing
  zero bytes of the last block are stripped.

[Source: [removed]/NEW, `tools/RTON_ANALYSIS.md` and `tools/rton_crypto_cli.py`. That
repository shows no license file, so I cite its *findings* and do not copy its code.]

A practical consequence: a standard AES library (128-bit block) will **not** decrypt
this data. You need a Rijndael implementation that supports a 192-bit block.

### 5.3 Where the key material comes from

I checked one relationship myself with Python's `hashlib`: take the string
`[removed]`, compute its [removed], write the digest as
32 lowercase hex characters, and use those 32 ASCII characters as the key. The IV is
the 24 characters at positions 4–27 of that 32-character key (Python: `[removed]`). Both matched the values
documented by the community. (I do not print the derived values here; readers can
compute them in three lines.)

This also illustrates ASCII key vs. hex key: the 32 characters are used *as ASCII
bytes*, not decoded from hex into 16 bytes.

### 5.4 Why finding the key is not "breaking" the cipher

The algorithm is public and its strength is unchanged. A client app that decrypts
its own data must contain the key, so anyone who can read the app can find it. That
is key *extraction*, not cryptanalysis. Rijndael itself was not attacked in any way.

### 5.5 My own exploration

**What I did back then (from memory, not a result of this article's experiments).** In middle school I opened the APK itself with MT Manager on my phone and browsed the native library (`.so`), where I saw the string `[removed]`. I remember a key-related word near it but not which word. (When I looked again in 2026, the nearest key-related string at that spot was `No public key loaded`; I cannot say it is the word I remembered.) Later, my team built a decryption tool (I was not one of its developers): you type that string in, the tool derives the key and IV with [removed], and decrypts the file. I only used it. I decrypted level files with it, got JSON I could read directly, and opened it in Notepad++ on a computer. I no longer remember the tool's name or the exact order of my steps, which is why §6 re-runs the chain with my own scripts.

### 5.6 CBC decryption, step by step

CBC (cipher block chaining) cuts the data into blocks of the cipher's block size, 24 bytes here. Decrypting works like this:

```text
plaintext[i] = Decrypt(key, ciphertext[i]) XOR ciphertext[i-1]      with ciphertext[-1] = IV
```

Each block is decrypted on its own with the raw cipher and then XORed with the *previous ciphertext block*; for the first block the "previous block" is the IV. Three consequences are useful in practice:

1. **The IV only matters for the first block.** A wrong IV garbles block 0 but leaves every later block correct, which is a handy way to tell a wrong IV from a wrong key.
2. **Decrypting block i needs only two ciphertext blocks.** So I could decrypt a long region and read just its first file, without knowing where that file ends.
3. **Identical plaintext blocks encrypt differently**, because each is mixed with the previous ciphertext. That is the reason to use CBC rather than encrypting block by block (ECB).

The raw single-block cipher comes from the `py3rijndael` library. The chaining is code I wrote (Appendix F):

```python
def rijndael_cbc_decrypt(ct, key, iv, block=24):
    cipher = Rijndael(key, block_size=block)
    out, prev = bytearray(), iv
    for i in range(0, len(ct), block):
        blk = ct[i:i + block]
        out += bytes(a ^ b for a, b in zip(cipher.decrypt(blk), prev))
        prev = blk
    return bytes(out)
```

Before decrypting I skip the first two bytes (`10 00`): they are a marker, not ciphertext. The 36,862 bytes after the marker are not a multiple of 24 and hold more than one file (the file I decoded is only 258 bytes), so I decrypt the first 1,535 whole blocks and stop. I do not claim to know where each file's ciphertext ends.

## 6. Reproducing the Workflow

**Input.** One Chinese-version Android APK (`baokai_4.2.7_1885_715_dj2.0-4.0.1.apk`,
2,271,163,986 bytes, SHA-256 `7c09515d…90a5d7`), analysed locally and not redistributed.
I downloaded it on 2 Nov 2026 from the Android download link of the game's website, <https://pvz2.hrgame.com.cn/> (page footer: Talkweb Information System Co., Ltd.). As noted at the start, the game's terms do not permit reverse engineering; this analysis was local and for learning, and I redistribute no game files.
Everything below ran on 2 Nov 2026 with the scripts in the project's `tools/`.

**An extra layer I did not expect.** The RSB files in this APK are not stored bare:
`assets/dynamic.rsb.smf` begins with the ASCII magic `RSLB`. It is a block container:
a 32-byte header, a table of 36-byte block records, then one raw LZMA1 stream per block
(32 MiB blocks, LZMA properties `lc=3 lp=0 pb=2`). I found the layout in a community
decompressor's comments and wrote my own decompressor; it produced exactly the 147,292,160
bytes the header declares. So the real chain for this build is:

```
APK -> .rsb.smf (RSLB, LZMA blocks) -> RSB -> RSGP -> encrypted RTON -> Rijndael -> RTON -> JSON
```

| Step | Result on this APK |
|---|---|
| Unwrap `dynamic.rsb.smf` | 147,292,160 bytes; starts with `1bsr`; matches the declared size |
| Read RSB header | version 4, 30 resource groups, group records `0xCC` bytes, PTX records `0x18` bytes (the "second-generation" variant noted in Pvz2Tool) |
| Compression | In every one of the 30 groups `ZSize == Size`: **no zlib was involved in this build.** I did not exercise zlib at all |
| Read one RSGP (`WorldPackages_beach`) | magic `pgsr`, version 4; its part0 begins with `10 00`, the encrypted-RTON marker |
| Rijndael decrypt | key = [removed]-hex of the string above, IV = `[removed]`, 24-byte blocks, CBC; the first file decrypts to `RTON`, version 1, and ends with `DONE` (258 bytes) |
| Decode with `mini_rton` | decodes completely; `pos` ends exactly at the end of the file |
| Native library | the key-source string appears once in each of `lib/arm64-v8a/libSrc.so` and `lib/armeabi-v7a/libSrc.so` |

The decoded object (a world-map record, no personal or account data):

```json
{"version": 1, "objects": [{"uid": "2.0.144207b4", "objclass": "WorldData",
  "objdata": {"m_worldName": "beach", "m_worldId": 8, "m_resGroupID": 7,
              "m_boundingRect": {"mX": 0, "mY": -150, "mWidth": 0, "mHeight": 300},
              "m_mapPieces": [], "m_eventList": [], "m_creationTime": 340233434,
              "m_version": 1}}]}
```

**What the real file taught the decoder.** My first run stopped at tag `0x21`, which the
format notes list only as an unconfirmed "int32 zero". In the data, `mX` and `mWidth`
are followed directly by `21` with no payload, `mY` is `25 AB 02` (signed varint, -150)
and `mHeight` is `24 AC 02` (300). Treating `21` as "the value 0, no payload" made the
whole file decode and end exactly at the footer, which is evidence for that reading
from this one file. I added a synthetic fixture modelled on it.

**Not reproduced / not verified.**
- Only **one** RTON from **one** group was decoded. The other files in that group and the
  other 29 groups were not decoded.
- I did not decode the RSGP file-name table, so file names are only partly read.
- 16-bit and 32-bit integer byte order is still unconfirmed on real data.
- Floats, 64-bit integers, UTF-8 strings (`82`) and RTID (`83`) remain unimplemented.
- zlib compression was not exercised (see above). Other builds may differ.
- Which steps of this chain I did in middle school, and with which tool, remain my own memory, not something this run proves.

### 6.1 The RSLB container, field by field

The `.smf` file is 69,183,497 bytes and expands to 147,292,160. All numbers are little-endian. The header:

| Offset | Field | Value in this file |
|---|---|---|
| `0x00` | magic | `RSLB` |
| `0x04` | version | 1 |
| `0x08` | total uncompressed size | 147,292,160 |
| `0x10` | packed size | 69,183,465 (= file size − 32) |
| `0x18` | block size | 33,554,432 (32 MiB) |
| `0x1C` | block count | 5 |

After the header comes a table of 36-byte records, one per block. Decoded for this file:

| Block | Uncompressed start | Uncompressed size | Data offset | Compressed size | LZMA dictionary |
|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 33,554,432 | 212 | 10,267,186 | 33,554,432 |
| 1 | 33,554,432 | 33,554,432 | 10,267,398 | 22,168,257 | 33,554,432 |
| 2 | 67,108,864 | 33,554,432 | 32,435,655 | 18,241,763 | 33,554,432 |
| 3 | 100,663,296 | 33,554,432 | 50,677,418 | 14,198,046 | 33,554,432 |
| 4 | 134,217,728 | 13,074,432 | 64,875,464 | 4,308,033 | 13,631,488 |

Each block's data begins with 5 bytes of LZMA properties (`5D` plus a 4-byte dictionary size) followed by a raw LZMA1 stream with no end marker; the table supplies the size to stop at. The properties byte `0x5D` = 93 unpacks as `lc = 93 mod 9 = 3`, `lp = (93 div 9) mod 5 = 0`, `pb = 93 div 45 = 2`.

Checks that came out right: block 0's data starts at 212 = `0x20` + 5 × 36, right after the table; each block starts where the previous one ends (212 + 10,267,186 = 10,267,398); the five uncompressed sizes add up to 147,292,160; and the five compressed sizes plus the 212-byte header and table add up to the file size. The last block is shorter and uses a smaller dictionary; I do not know why.

### 6.2 What went wrong first

I kept the failures because they show what the checks are for. The scripts were written and run with the AI assistant described in §4.

1. **One stream or many?** The first attempt decompressed the `.smf` as a single LZMA stream after the header. It started well (`1bsr`, so the idea was right) and then failed with "Corrupt input data" after about 33.6 MB. The container is chunked into 32 MiB blocks; the fix was to read the block table.
2. **A wrong header offset.** The first end-to-end script read part0's offset from the wrong position in the RSGP header. The "decrypted" output was garbage and the `RTON` magic check failed at once. I fixed the offset and added an assertion that the RSGP header and the RSB's group record agree.
3. **A tag the notes were unsure about.** The decoder stopped at `0x21` (see above).

None of these would have been caught by synthetic tests alone.

### 6.3 Reproducing it yourself

You need an Android APK of the game that you are entitled to use, Python 3, and `py3rijndael` (`pip install py3rijndael`). The scripts are in the appendices.

1. An APK is a zip file. Take out `assets/dynamic.rsb.smf` (`unzip app.apk assets/dynamic.rsb.smf`).
2. `python3 rslb.py dynamic.rsb.smf dynamic.rsb`. For the build I analysed, expect 147,292,160 bytes starting with `1bsr`. Other builds will differ.
3. `python3 rsb_probe.py dynamic.rsb`. Expect version 4 and 30 groups, and `Credits_1200` first.
4. Run `reproduce.py` (Appendix F), with `MINI_RTON_SRC` set to the folder that contains the `mini_rton` package. It prints the decoded object.
5. Optionally, save the decrypted bytes and run `annotate_rton.py` (Appendix E) on them to get the byte-by-byte view from §3.6.

If a step gives a different number, trust your number and check which build you have: that is the point of recording the SHA-256 of the APK.

## 7. Lessons Learned

This project gave me a more complete picture of how mobile apps are packaged. What I actually analysed this time was an Android APK: at bottom it is a zip archive holding native libraries (`.so`), `assets` and configuration. In Grade 9 I also analysed iOS IPA files, which introduced me to Apple's signing certificates (such as enterprise signing) and to the jailbreak ecosystem (TrollStore, package sources, Filza), and I modified an IPA myself, then repackaged and signed it. These are personal experiences written from memory and are not part of this article's experiments; I did not reproduce them here.

It was also my first fairly systematic contact with encryption: I learned about key and IV lengths, how different ciphers differ, and how AES relates to Rijndael (here the block size was 192 bits, which a standard AES library cannot handle). I also understood that "finding the key" and "breaking the algorithm" are different things.

On method, writing tests from the spec before the code paid off. After every synthetic test passed, the real file still exposed a tag, `0x21`, that the notes had not made clear, which taught me that format documents and real data always differ somewhat and have to be checked against data. Reading the decoded JSON also taught me to read structured data and see how the game describes a world or a level as data.

Next I want to treat the network protocol (encrypted HTTP requests) as a separate study: finish reproducible experiments first, then write a second article.

## 8. FAQ and glossary

**Is the RSB itself encrypted?** Not in this build. After the `.smf` wrapper is removed, the RSB header parses normally and the groups are stored uncompressed. The RTON files inside carry the `10 00` marker and are encrypted.

**Is Rijndael the same as AES?** AES is Rijndael restricted to a 128-bit block. This game uses a 192-bit block, so a standard AES library cannot decrypt it.

**Did finding the key break the encryption?** No. The game has to carry the key to decrypt its own data. Finding it is extraction; the cipher was not attacked.

**Does the decoder work on every PVZ2 file?** No. It decodes one real file from one build and a set of synthetic cases. Floats, 64-bit integers, UTF-8 strings and RTID are not implemented, and I do not know which of those the other files use.

**Is the decoder original work?** It is my implementation of a documented format, written with an AI assistant and read and understood by me. It is not a new discovery; see §4 and the references.

**Glossary**

- **Magic number**: fixed bytes at the start of a file that identify its type (`1bsr`, `pgsr`, `RTON`, `RSLB`).
- **Offset / length**: where data starts and how many bytes it spans; the basis of almost every binary format.
- **RSB**: a PopCap resource bundle holding many files in resource groups.
- **RSGP**: one resource group inside an RSB.
- **SMF / RSLB**: the wrapper seen in this build that stores an RSB as LZMA-compressed blocks.
- **RTON**: PopCap's binary serialization format for JSON-like data.
- **Varint**: a variable-length integer; small numbers take fewer bytes.
- **Block cipher / block size**: an encryption algorithm that works on fixed-size chunks; Rijndael allows 128, 192 or 256 bits.
- **IV (initialization vector)**: the starting value that CBC mixes into the first block.
- **CBC**: cipher block chaining; each block is mixed with the previous ciphertext block.

## Appendix A: the decoder (`mini_rton/decoder.py`)

MIT licence, copyright 2026 Ray Tian. Only the tags listed in §4 are supported; anything else raises `RtonError`.

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

## Appendix B: synthetic test fixtures (`tests/fixtures.py`)

Every byte is annotated. The error-handling tests are omitted here for length.

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

## Appendix C: RSLB (.smf) decompressor (`rslb.py`)

MIT licence, copyright 2026 Ray Tian. Written with an AI assistant; the layout comes from the format description cited in the references.

```python
"""Decompress an RSLB (.smf) container: a header, a block table, then one raw LZMA1 stream per block.

Layout (from the format description in yhzxcv/Z-Editor's RslbDecompressor comments;
this implementation is written independently):
  0x00 "RSLB" | 0x04 u32 version | 0x08 u64 total_uncompressed | 0x10 u64 packed_size
  0x18 u32 block_size | 0x1C u32 block_count | 0x20 block table, 36 bytes each:
    u64 cum_offset, u32 usize, u32 reserved, u64 data_offset, u32 csize (incl. 5-byte props),
    u8 lzma_props, u32 dict_size, 3 pad
  each block at data_offset: 5 bytes (props + dict) then raw LZMA1 data (no end marker).
"""
import lzma
import struct
import sys


def decompress(src_path, dst_path):
    with open(src_path, "rb") as f:
        data = f.read()
    magic, version, total, packed, block_size, count = struct.unpack_from("<4sIQQII", data, 0)
    if magic != b"RSLB":
        raise ValueError("not an RSLB file")
    produced = 0
    with open(dst_path, "wb") as out:
        for i in range(count):
            cum, usize, _res, doff, csize, props, dict_size = struct.unpack_from(
                "<QIIQIBI", data, 0x20 + i * 36)
            if cum != produced:
                raise ValueError(f"block {i}: offset gap")
            lc = props % 9
            lp = (props // 9) % 5
            pb = props // 45
            filters = [{"id": lzma.FILTER_LZMA1, "dict_size": dict_size, "lc": lc, "lp": lp, "pb": pb}]
            stream = data[doff + 5: doff + csize]
            chunk = lzma.LZMADecompressor(format=lzma.FORMAT_RAW, filters=filters).decompress(
                stream, max_length=usize)
            if len(chunk) != usize:
                raise ValueError(f"block {i}: got {len(chunk)} bytes, expected {usize}")
            out.write(chunk)
            produced += usize
    if produced != total:
        raise ValueError(f"total {produced} != declared {total}")
    return produced


if __name__ == "__main__":
    print(decompress(sys.argv[1], sys.argv[2]), "bytes written")
```


## Appendix D: RSB header and group table reader (`rsb_probe.py`)

Field order follows the layout described in Pvz2Tool (MIT). Read-only: it extracts nothing.

```python
"""Read an RSB header and its resource-group (RSGP) table.

Field order follows the layout described by Pvz2Tool's RsbHeadInfo / RsbRsgpInfo
(MIT). Written independently; read-only, extracts nothing.
"""
import struct
import sys

HEADER_FIELDS = [
    "magic", "version", "zero0", "headLength", "fileList_Length", "fileList_BeginOffset",
    "zero1", "zero2", "rsgpList_Length", "rsgpList_BeginOffset", "rsgp_Number",
    "rsgpInfo_BeginOffset", "rsgpInfo_EachLength", "composite_Number", "compositeInfo_BeginOffset",
    "compositeInfo_EachLength", "compositeList_Length", "compositeList_BeginOffset",
    "autopool_Number", "autopoolInfo_BeginOffset", "autopoolInfo_EachLength", "ptx_Number",
    "ptxInfo_BeginOffset", "ptxInfo_EachLength", "xmlPart1", "xmlPart2", "xmlPart3",
]

GROUP_FIELDS = ["offset", "size", "pool_index", "flags", "fileOffset", "p0_offset", "p0_zsize",
                "p0_size", "p0_size2", "p1_offset", "p1_zsize", "p1_size"]


def read_header(data):
    vals = struct.unpack_from("<" + "I" * len(HEADER_FIELDS), data, 0)
    h = dict(zip(HEADER_FIELDS, vals))
    if data[:4] != b"1bsr":
        raise ValueError("bad RSB magic")
    return h


def read_groups(data, h):
    groups = []
    base, each = h["rsgpInfo_BeginOffset"], h["rsgpInfo_EachLength"]
    for i in range(h["rsgp_Number"]):
        rec = data[base + i * each: base + (i + 1) * each]
        name = rec[:0x80].split(b"\0", 1)[0].decode("ascii", "replace")
        nums = struct.unpack_from("<" + "I" * len(GROUP_FIELDS), rec, 0x80)
        groups.append({"name": name, **dict(zip(GROUP_FIELDS, nums))})
    return groups


if __name__ == "__main__":
    data = open(sys.argv[1], "rb").read()
    h = read_header(data)
    for k in ("version", "headLength", "rsgp_Number", "rsgpInfo_BeginOffset", "rsgpInfo_EachLength",
              "ptxInfo_EachLength"):
        print(f"{k} = {h[k]} (0x{h[k]:X})")
    print("zero fields ok:", h["zero0"] == h["zero1"] == h["zero2"] == 0)
    for g in read_groups(data, h)[:12]:
        print(g["name"], "off", g["offset"], "size", g["size"], "p0", g["p0_zsize"], "->", g["p0_size"],
              "p1", g["p1_zsize"], "->", g["p1_size"], "flags", g["flags"])
```


## Appendix E: Annotated RTON dump (`annotate_rton.py`)

Uses the same tag rules as the decoder; prints the walk-through shown in §3.6.

```python
"""Print an annotated hex walk-through of an (unencrypted) RTON using the same tag rules as mini_rton.
Prints facts only. Usage: python3 -I annotate_rton.py file.rton"""
import struct, sys

def uvarint(d, p):
    r = s = 0
    while True:
        b = d[p]; p += 1
        r |= (b & 0x7F) << s
        if b < 0x80: return r, p
        s += 7

def walk(d):
    rows = []; cache = []; p = 0
    def row(a, b, text, depth): rows.append((a, d[a:b], '  ' * depth + text))
    row(0, 4, 'magic "RTON"', 0); row(4, 8, 'version = 1 (uint32 LE)', 0); p = 8
    def val(p, depth):
        t = d[p]
        if t in (0, 1): row(p, p+1, 'false' if t == 0 else 'true', depth); return p+1
        if t in (0x08, 0x0A, 0x10, 0x12, 0x20):
            n = {0x08:1,0x0A:1,0x10:2,0x12:2,0x20:4}[t]; sg = t in (0x08,0x10,0x20)
            v = int.from_bytes(d[p+1:p+1+n], 'little', signed=sg)
            row(p, p+1+n, f'fixed int, value {v}', depth); return p+1+n
        if t == 0x21: row(p, p+1, 'int32 zero (no payload) = 0', depth); return p+1
        if t in (0x24, 0x25):
            n, q = uvarint(d, p+1); v = n if t == 0x24 else (n//2 if n % 2 == 0 else -(n+1)//2)
            row(p, q, ('unsigned' if t == 0x24 else 'signed') + f' varint = {v}', depth); return q
        if t == 0x81:
            n, q = uvarint(d, p+1); s = d[q:q+n].decode(); row(p, q+n, f'string "{s}"', depth); return q+n
        if t == 0x90:
            n, q = uvarint(d, p+1); s = d[q:q+n].decode(); cache.append(s)
            row(p, q+n, f'define cache[{len(cache)-1}] = "{s}"', depth); return q+n
        if t == 0x91:
            n, q = uvarint(d, p+1); row(p, q, f'recall cache[{n}] = "{cache[n]}"', depth); return q
        if t == 0x85: row(p, p+1, 'object start', depth); return obj(p+1, depth+1)
        if t == 0x86:
            assert d[p+1] == 0xFD; n, q = uvarint(d, p+2); row(p, q, f'array start, {n} item(s)', depth)
            for _ in range(n): q = val(q, depth+1)
            assert d[q] == 0xFE; row(q, q+1, 'array end', depth); return q+1
        raise ValueError(hex(t))
    def key(p, depth):
        t = d[p]
        if t == 0x81 or t == 0x90:
            n, q = uvarint(d, p+1); s = d[q:q+n].decode()
            if t == 0x90: cache.append(s)
            row(p, q+n, ('key, define cache[%d]' % (len(cache)-1) if t == 0x90 else 'key') + f' "{s}"', depth); return q+n
        n, q = uvarint(d, p+1); row(p, q, f'key, recall cache[{n}] = "{cache[n]}"', depth); return q
    def obj(p, depth):
        while d[p] != 0xFF:
            p = key(p, depth); p = val(p, depth)
        row(p, p+1, 'object end', depth-1); return p+1
    p = obj(p, 1)
    row(p, p+4, 'footer "DONE"', 0)
    assert p + 4 == len(d)
    return rows, cache

if __name__ == '__main__':
    d = open(sys.argv[1], 'rb').read()
    rows, cache = walk(d)
    def short(b):
        return b.hex(' ') if len(b) <= 8 else b[:8].hex(' ') + f' ..+{len(b) - 8}'
    for a, b, t in rows: print(f'{a:04X}  {short(b):<30} {t}')
    print('CACHE', cache)
```


## Appendix F: End-to-end reproduction (`reproduce.py`)

Needs `py3rijndael`. Set `MINI_RTON_SRC` to the folder containing the `mini_rton` package, and put `rslb.py` and `rsb_probe.py` next to it.

```python
"""End-to-end reproduction on a locally owned APK. Prints facts only; writes nothing outside work/.

APK -> assets/dynamic.rsb.smf -> (RSLB/LZMA) -> RSB -> RSGP 'WorldPackages_beach' part0
    -> (Rijndael-192 CBC) -> RTON -> JSON via mini_rton

Run with the venv python (needs py3rijndael):  .venv/bin/python -I tools/reproduce.py <apk>
"""
import hashlib
import json
import os
import struct
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.environ["MINI_RTON_SRC"])

from py3rijndael import Rijndael  # noqa: E402

import rslb  # noqa: E402
from mini_rton import decode  # noqa: E402
from rsb_probe import read_groups, read_header  # noqa: E402

[removed] = b"[removed]"


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def rijndael_cbc_decrypt(ct, key, iv, block=24):
    cipher = Rijndael(key, block_size=block)
    out, prev = bytearray(), iv
    for i in range(0, len(ct), block):
        blk = ct[i:i + block]
        out += bytes(a ^ b for a, b in zip(cipher.decrypt(blk), prev))
        prev = blk
    return bytes(out)


def main(apk):
    work = os.path.join(os.path.dirname(HERE), "work")
    print("APK sha256:", sha256(apk))
    with zipfile.ZipFile(apk) as z:
        smf = z.read("assets/dynamic.rsb.smf")
    smf_path = os.path.join(work, "repro_dynamic.rsb.smf")
    rsb_path = os.path.join(work, "repro_dynamic.rsb")
    open(smf_path, "wb").write(smf)
    print("SMF magic:", smf[:4], "size:", len(smf))
    n = rslb.decompress(smf_path, rsb_path)
    data = open(rsb_path, "rb").read()
    print("RSB bytes:", n, "magic:", data[:4])

    h = read_header(data)
    groups = read_groups(data, h)
    print("RSB version:", h["version"], "groups:", h["rsgp_Number"],
          "all groups stored uncompressed (ZSize==Size):",
          all(g["p0_zsize"] == g["p0_size"] and g["p1_zsize"] == g["p1_size"] for g in groups))

    g = next(x for x in groups if x["name"] == "WorldPackages_beach")
    base = g["offset"]
    magic, ver = struct.unpack_from("<4sI", data, base)
    p0_off, p0_size = struct.unpack_from("<I", data, base + 0x18)[0], g["p0_size"]
    assert p0_off == g["p0_offset"], "RSGP header and RSB group record disagree"
    blob = data[base + p0_off: base + p0_off + p0_size]
    print("RSGP magic:", magic, "version:", ver, "part0 bytes:", len(blob),
          "starts with 10 00:", blob[:2] == b"\x10\x00")

    key = [removed]([removed]).hexdigest().encode()
    iv = [removed]
    body = blob[2:]
    plain = rijndael_cbc_decrypt(body[: len(body) // 24 * 24], key, iv)
    end = plain.find(b"DONE") + 4
    rton = plain[:end]
    print("decrypted RTON bytes:", len(rton), "magic:", rton[:4])
    result = decode(rton)
    print(json.dumps(result, indent=1))


if __name__ == "__main__":
    main(sys.argv[1])
```

## References

Other authors' work, listed for context. The Z-Editor entry is GPL-3.0 and was read only for a format description.
