---
pageSlug: "pvz2-resource-analysis"
lang: "en"
title: "PvZ2 Resource Analysis"
subtitle: "Plants vs. Zombies 2 (Chinese version, Android) · high school"
summary: "How the encrypted resource files of a mobile game are packed, protected and read, investigated with existing community tools."
order: 1
updated: "2026-11-02"
glance: [{"k": "Context", "v": "Personal learning project in high school; not employment"}, {"k": "Tools", "v": "MT Manager; existing community tools for unpacking, decryption and RTON decoding (names not recorded)"}, {"k": "Outcome", "v": "Decrypted RTON resource files and read the decoded configuration data"}, {"k": "Ongoing", "v": "Network traffic analysis, not yet verified"}]
references: []
---

## Overview

In high school I took the encrypted resource files of the Chinese version of *Plants vs. Zombies 2* (Android) apart to see how they were packed and protected. I followed the community's existing tools and documentation. I did not write the unpacker, the decryption code or an RTON parser, and I make no claim of a vulnerability.

This was personal learning, not paid or professional work. Some implementation details are no longer documented.

## Technical Background

- **RSB** is a resource archive format used by PopCap games. It bundles the game's assets and is documented by community authors.
- **RTON** is a binary, JSON-like format used for the game's configuration data.
- In the Chinese build, RTON data is encrypted with **Rijndael**, the cipher family that AES comes from. Decrypting needs a **key** and an **IV** (initialisation vector), which the game's own native code has to contain.
- **MT Manager** is an Android file and binary viewer. I used it to read the game's native library (`.so`).

<figure class="flow" aria-label="Plants vs. Zombies 2 resource pipeline, with the Android native library as an auxiliary key-analysis step">
<ol class="flow-main">
<li><b>RSB</b><small>resource package</small></li>
<li class="tool"><b>Unpack</b><small>existing tools</small></li>
<li><b>Encrypted RTON</b><small>data files</small></li>
<li class="tool"><b>Rijndael Decrypt</b><small>existing tools</small></li>
<li class="tool"><b>RTON Decode</b><small>existing tools</small></li>
<li><b>JSON</b><small>readable data</small></li>
</ol>
<div class="flow-aux"><span class="mine"><b>.so key analysis</b><small>MT Manager · my inspection</small></span><span class="flow-link">key and IV feed the Rijndael Decrypt step</span></div>
<figcaption>The pipeline as I understand it. Steps with a gold edge were done with existing community tools, not code I wrote. The dashed box is the part I did by hand: inspecting the Android native library for key material.</figcaption>
</figure>

## My Experiment

1. Unpacked an RSB package and extracted the RTON files, using existing tools.
2. As a separate, auxiliary step, opened the Android `.so` file in MT Manager and looked through its strings and constants for encryption-related material.
3. Found key material connected to the Rijndael encryption, and studied how the key and IV are used. The values are not published here.
4. Used existing tools to decrypt the RTON files and decode them.
5. Read the decrypted game configuration data.

### Network traffic analysis (ongoing)

I also looked at how the Chinese version talks to its servers. Its HTTP requests carry form-style fields like this (values are placeholders):

```text
req=V1270
e=<encrypted payload>
ev=3
```

I have not verified what each field means. Community projects handle related server data, for example [Lawnstrings-Server](https://github.com/viiguess/Lawnstrings-Server), which Base64-decodes a server-delivered file into an encrypted RTON. I have also come across community implementations of this request format that use Base64URL and block-cipher handling, but I have not checked them against my own captures and do not cite them as sources.

I have not confirmed that my older captured requests can be decrypted. This is ongoing exploration, not a result. No account data, server tokens or third-party keys are published on this site.

## Result

- Decrypted RTON resource files and read the decoded configuration data, using existing tools.
- Located encryption-related strings and key material in the Android native library by hand.
- Network request analysis is unfinished and unverified.

The decryption, unpacking and decoding tools are other authors' work. My contribution was the investigation and the key-material inspection.

## What I Learned

- How a game can protect its data with a symmetric cipher, and why the key and IV have to be reachable from the game's own code.
- How to approach an unfamiliar binary format by reading community documentation and comparing tool output instead of guessing.
- To keep notes while experimenting, so a result can be reproduced later, and to say plainly which parts were mine and which came from existing tools.
