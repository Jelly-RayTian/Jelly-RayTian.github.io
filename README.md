# Ray Tian portfolio

Static site, no build step. Open `index.html` in a browser (or `python3 -m http.server` in this folder).

| File | What it holds |
|---|---|
| `index.html` | Page structure and all visible English text, including the two résumé sheets (English and Chinese) |
| `css/style.css` | Colours (CSS variables at the top), layout, animations, print styles for the résumé sheet |
| `js/data.js` | Verified PR list and statuses (generated; regenerate when statuses change) |
| `js/cases.js` | Case-study text, English (`CASES`) and Chinese (`CASEZ`) |
| `js/main.js` | Chinese strings for the page (`ZH` list), language and theme toggles, PR wall, effects (background network, tilt, cursor) |
| `assets/` | WatDesk screenshots |

Chinese text for static page parts lives in the `ZH` list in `js/main.js`, keyed by CSS selector. Fonts load from Google Fonts.

Source of truth and the PR-refresh scripts: github.com/Jelly-RayTian/Jelly-RayTian.


## Experience update — 2026-11-01

Added bilingual coursework, team projects, creative work and research activities from Ray's original résumé and local project history. `#experience` contains six entries. The résumé now prints as two A4 pages in the selected language, with activities on page two. Education, coursework, languages and contact links have also been restored from the original résumé.

Activity cards use paired `.localized[data-lang]` elements in `index.html`; the existing page translations still use `ZH` in `js/main.js`. Original PR data and online statuses were not refreshed in this content update.
