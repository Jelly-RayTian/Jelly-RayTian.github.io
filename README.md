# Ray Tian portfolio

Static site, no build step. Open `index.html` in a browser (or `python3 -m http.server` in this folder).

| File | What it holds |
|---|---|
| `index.html` | Page skeleton, hero, PR wall, projects, open-source case studies and the full PR list |
| `css/style.css` | Colours (CSS variables at the top), layout, animations, print styles |
| `js/data.js` | Verified PR list and statuses (generated; regenerate when statuses change) |
| `js/cases.js` | Open-source case studies, English and Chinese |
| `js/content.js` | **All personal content** (about, education, leadership, community, research, honours), English and Chinese. Edit here |
| `js/videos.js` | Selected Bilibili videos (empty until links are verified) |
| `js/render.js` | Builds the sections and the one-page résumé from `content.js` |
| `js/main.js` | Language and theme toggles, PR wall, page-level Chinese strings, effects |
| `tools/build-resume.mjs` | `node tools/build-resume.mjs` regenerates `assets/Ray-Tian-Resume.pdf` (needs Edge or Chrome). `--variant systems` makes a targeted copy (Mobile, Android, Embedded or Security roles) that adds the PvZ2 and device-customization lines. Add `--email … --phone … --out ~/Desktop/file.pdf` for a private application copy |
| `assets/` | WatDesk screenshots and the English résumé PDF (no email or phone) |

Chinese text for static page parts lives in the `ZH` list in `js/main.js`, keyed by CSS selector; section content is bilingual inside `js/content.js`. Fonts load from Google Fonts.

Source of truth and the PR-refresh scripts: github.com/Jelly-RayTian/Jelly-RayTian.


## Experience update — 2026-11-01

Added bilingual coursework, team projects, creative work and research activities from Ray's original résumé and local project history. `#experience` contains six entries. The résumé now prints as two A4 pages in the selected language, with activities on page two. Education, coursework, languages and contact links have also been restored from the original résumé.

Activity cards use paired `.localized[data-lang]` elements in `index.html`; the existing page translations still use `ZH` in `js/main.js`. Original PR data and online statuses were not refreshed in this content update.
