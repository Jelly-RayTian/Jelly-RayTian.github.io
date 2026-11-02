---
pageSlug: "wechatsignals"
lang: "en"
title: "WechatSignals"
summary: "A local-first macOS client for analysing one-to-one chats: read-only access, anonymisation, SQLite and Keychain."
kind: "software"
order: 2
featured: true
stack: "TypeScript · Swift · SQLite · macOS"
period: "Oct 2026"
status: "Beta: v0.1.0-beta.1, arm64, ad-hoc signed and not notarized."
image: "/assets/wechatsignals-screenshot.webp"
imageDark: "/assets/wechatsignals-screenshot.webp"
icon: "/assets/wechatsignals-icon.png"
flow: ["Read one-to-one chats, read-only", "Anonymise participants (Me, Person A)", "Send for analysis only when you click", "API key kept in macOS Keychain"]
links: [{"label": "Release v0.1.0-beta.1", "url": "https://github.com/Jelly-RayTian/WechatSignals/releases/tag/v0.1.0-beta.1"}, {"label": "Source", "url": "https://github.com/Jelly-RayTian/WechatSignals"}]
---

## Design constraints
- Reads one-to-one chats only, read-only, from the local machine.
- Contacts, caches and analysis results stay on the machine.
- Data is sent for analysis only when I click to analyse the selected chat.
- Participants are anonymised ("Me", "Person A") before anything is sent; no IDs, nicknames, avatars, phone numbers or local paths are included.
- The API key is stored in the macOS Keychain, not in a config file.

## Status and limits
This is a beta release. It is ad-hoc signed and not notarized, so macOS will warn on first launch. It has not been tested across a wide range of machines.
