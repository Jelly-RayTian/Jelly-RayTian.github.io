---
pageSlug: "pvz2-resource-analysis"
lang: "en"
title: "Game Resource Reverse Engineering"
subtitle: "Plants vs. Zombies 2, Chinese version, Android"
summary: "How I looked at the encrypted resource files of the Chinese version of Plants vs. Zombies 2 on Android, and what I can and cannot claim about it."
order: 1
references: []
---

> High school · personal experiment

## Independent game resource analysis

### What I did

- Inspected Android native library (.so) files with MT Manager to find encryption-related strings and constants associated with the game's resource files.
- Studied how the Rijndael cipher uses a key and an IV.
- Used existing tools and recovered key material to decrypt and inspect RTON game data, then read the data that could be opened.
- Explored binary file formats, resource encoding and game data protection through independent experimentation.

### Confirmed tools

MT Manager; existing decryption tools (names no longer remembered).

### Outcome

Decrypted RTON resource files and viewed the readable data inside.

### Not remembered or not claimed

This was personal learning, not employment. I make no claim of a custom decryption algorithm, of breaking Rijndael/AES, or of a vulnerability confirmed by the publisher. Exact steps are no longer remembered, so none are reconstructed. Keys, IVs and proprietary game data are not published, and other authors' findings are not claimed as mine.

### Public work

None published on this site yet.
