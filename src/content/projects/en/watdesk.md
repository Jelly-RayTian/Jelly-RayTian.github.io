---
pageSlug: "watdesk"
lang: "en"
title: "WatDesk"
summary: "One side panel for Waterloo deadlines, exams and grades from LEARN, Crowdmark and Odyssey, kept in your own browser."
kind: "software"
order: 1
featured: true
stack: "TypeScript · React · Vite · Edge extension"
period: "Oct 2026 – Present"
status: "Edge Add-ons listing: under review (per the repository README, checked 2026-11-02). Install from GitHub releases."
image: "/assets/watdesk.jpg"
imageDark: "/assets/watdesk-dark.jpg"
links: [{"label": "Latest release", "url": "https://github.com/Jelly-RayTian/WatDesk/releases/latest"}, {"label": "Source", "url": "https://github.com/Jelly-RayTian/WatDesk"}]
---

WatDesk is an independent student project, not a University of Waterloo product.

## What it does
- One timeline for assignments, quizzes and exams, grouped by day and filterable by course.
- A two-week workload view that shows which days are crowded before they arrive.
- An exam page with countdowns, room and seat, and change alerts.
- Sortable grades, with released scores kept separate from estimates.
- Calendar and `.ics` export, reminders, English and Simplified Chinese, light and dark, and five looks including Liquid Glass.
- Quiet background sync that does not take over your tabs and keeps the last good data if a site is down.

## Privacy design
It reads each site in your own signed-in session. Academic data stays in your browser and is not uploaded to a WatDesk backend. It never sees or stores passwords, cookies or verification codes, and never submits anything for you. An anonymous usage counter is on by default and can be turned off in setup or Settings; the Settings page shows exactly what it sends.

## Verification
At v1.9.0 the repository's continuous integration ran type checks, a production build and 284 tests across 67 test files, all passing. The project has 8 tagged releases (latest v1.9.0).
