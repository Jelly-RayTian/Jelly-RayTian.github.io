---
pageSlug: "ios-jailbreaking"
lang: "en"
title: "iOS Jailbreaking & Mobile Systems Exploration"
subtitle: "Signing, sideloading, jailbreaking and IPA repackaging · high school"
summary: "Hands-on iOS experiments: how Apple code signing works, sideloading with AltStore and SideStore, the Dopamine jailbreak, TrollStore on an iPad mini 6, tweaks, and repackaging a PVZ2 IPA."
order: 3
updated: "2026-11-02"
glance: [{"k": "Context", "v": "Personal experiments in high school; not employment"}, {"k": "Tools", "v": "Dopamine, TrollStore, AltStore, SideStore, Filza, third-party software sources (all other authors' work)"}, {"k": "Device", "v": "iPad mini 6 on iOS 15.4.1 (Dopamine and TrollStore); signing only on later devices"}, {"k": "Outcome", "v": "Tools set up and used; I modified an IPA but did not develop a jailbreak or exploit"}]
references: [{"label": "Dopamine — jailbreak by opa334", "url": "https://github.com/opa334/Dopamine"}, {"label": "TrollStore — by opa334", "url": "https://github.com/opa334/TrollStore"}]
---

## Overview

In high school I experimented with iOS device customization. I learned how Apple code signing works (developer certificates, free Apple ID signing and enterprise signing), sideloaded apps, used the Dopamine jailbreak, set up TrollStore on an iPad mini 6, and repackaged the IPA of a game (Plants vs. Zombies 2) myself. I used tools written by other people. I did not develop a jailbreak, an exploit or any of these tools. These were personal experiments, not professional work. Some implementation details are no longer documented.

## Technical Background

- **Jailbreaking** removes some of iOS's restrictions so that apps and tweaks can change how the system behaves.
- **Dopamine**, by opa334, is described by its author as a semi-untethered jailbreak for a range of iOS 15 to 26 versions.
- **TrollStore**, also by opa334, is described by its author as an app that can install IPA files permanently, and it only works on specific iOS versions.
- **Software sources** are package repositories that a jailbroken device can pull apps and tweaks from.
- **Code signing**: iOS only runs apps signed with a certificate Apple recognises. A free Apple ID signs an app for 7 days; **AltStore** and **SideStore** re-sign apps automatically to work around that; **enterprise certificates** are meant for in-house company distribution.
- **Rootless and rootful jailbreaks** differ in where the jailbreak lives: rootful modifies the real root filesystem, while rootless keeps everything under a separate prefix (Dopamine is rootless), so tweaks have to be built for the matching layout.
- **Dylib tweaks** are dynamic libraries loaded into an app to change its behaviour; **JIT** (just-in-time compilation) is a capability some apps need that iOS normally restricts; **Filza** is a file manager for browsing the filesystem on a jailbroken device.

## My Experiment

- Used the Dopamine jailbreak on an iPad mini 6 running iOS 15.4.1 and understood the difference between rootless and rootful jailbreaks.
- Set up TrollStore on the same iPad mini 6 (iOS 15.4.1).
- Worked with third-party software sources and used Filza to browse the filesystem.
- Sideloaded apps with a free Apple ID (7-day signing) using AltStore and SideStore.
- Enabled JIT for apps and used dylib tweaks.
- Modified and repackaged the IPA of Plants vs. Zombies 2 for personal study.
- On later devices I only used enterprise-certificate or Apple ID signing to install apps (no jailbreak).

## Result

I got these tools running and used them, and I repackaged the PVZ2 IPA myself. The modified package was for personal study on my own devices and I do not distribute it. Which tweaks I changed and the exact steps were not recorded, so they are not stated here.

## What I Learned

- That which tool works depends on the exact device and iOS version, so the project's own supported-version notes are the first thing to read.
- How apps are installed and signed on iOS differs from other platforms, and third-party sources need the same care as any outside code.
- Why certificate expiry, entitlements and the filesystem layout of a jailbreak decide what can and cannot be installed.

## References

Other authors' projects, listed for context. None of them is mine. AltStore and SideStore are likewise other authors' projects.
