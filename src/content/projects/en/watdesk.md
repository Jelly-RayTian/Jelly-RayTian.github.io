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
status: "Listed on Microsoft Edge Add-ons; v1.10.1 is released on GitHub and submitted for store review (checked 2026-11-04)."
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
- An optional, read-only Course Outlines source (v1.10.1) that adds explicitly dated assessments from each course outline; dates that are not published are never guessed.
- Hover a day in the workload view to see that day's tasks.
- Quiet background sync that does not take over your tabs and keeps the last good data if a site is down.

## Privacy design
It reads each site in your own signed-in session. Academic data stays in your browser and is not uploaded to a WatDesk backend. It never sees or stores passwords, cookies or verification codes, and never submits anything for you. An anonymous usage counter is on by default and can be turned off in setup or Settings; the Settings page shows exactly what it sends.

## Verification
At v1.10.1 the release notes record type checks, a production build and 290 tests across 69 test files, all passing, and a package that matches the main-branch build. The notes also say the authenticated school-platform flows were not retested for that release. The project has 9 tagged releases (latest v1.10.1, 2026-11-04).
