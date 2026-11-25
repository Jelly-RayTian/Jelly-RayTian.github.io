# Ray Tian — portfolio

Multi-page static site built with [Astro](https://astro.build) (TypeScript, static output), deployed to GitHub Pages at <https://jelly-raytian.github.io/>.

```bash
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run check     # type check
npm run verify    # post-build checks (pages, links, SEO, removed content)
```

## Structure

```
src/
  pages/[...lang]/     one file per page; serves / (English) and /zh/ (Chinese)
    index.astro  about/  education/  experience/  projects/  open-source/
    volunteering/  systems/  creative/  contact/
    projects/[slug].astro   systems/[slug].astro   detail pages from Markdown
  layouts/BaseLayout.astro   head, SEO, Open Graph, hreflang, header, footer
  components/                Header, Footer, PrWall, PrExplorer, CaseStudies, cards
  content/
    projects/{en,zh}/*.md    one Markdown file per project and language
    systems/{en,zh}/*.md     systems articles (text, code blocks, images, references)
    data/                    content.json (experience, education, honours), prs.json, cases.json, pages.ts
  i18n/ui.ts                 routes and interface strings (EN/ZH)
  lib/                       data helpers
  scripts/                   theme/menu, background canvas, PR filter (small client scripts)
  styles/global.css
public/assets/               screenshots
scripts/verify-dist.mjs      build verification
```

## Adding things
- **A project page:** add `src/content/projects/en/<name>.md` and `zh/<name>.md` (same `pageSlug`). It appears at `/projects/<name>/`.
- **A systems article:** add `src/content/systems/{en,zh}/<name>.md`. Code blocks, images in `public/`, inline SVG diagrams and a `references` list in the front matter are supported. Write only what you can stand behind.
- **Experience, education, honours:** edit `src/content/data/content.json` (English and Chinese side by side).
- **Bilibili videos:** none are listed because none have been verified. Add them to `content.json` under `creative` once the title, link and numbers are checked on the video page.
- **PR statuses:** `src/content/data/prs.json` is the snapshot refreshed by this site's Deploy site workflow.

## Deployment
`.github/workflows/deploy.yml` runs `astro check`, `astro build` and `npm run verify`, then publishes `dist/` with the official GitHub Pages actions. In the repository settings, Pages → Source must be **GitHub Actions**.

### Pull-request data
`src/content/data/prs.json` feeds the PR wall and counts. The workflow is scheduled **every 30 minutes** and can run on demand under Actions → Deploy site → Run workflow. The refresh script reads PRs authored by `Jelly-RayTian` from the GitHub API. When the data changes, the workflow commits the snapshot and redeploys.

- Merged, open and draft statuses for external PRs update on the next successful refresh. GitHub Actions can delay scheduled runs.
- Hand-checked facts are kept: each PR's `summary`, and the closed-but-integrated classes (`squashed`, `consolidated`, `retained`). A new PR gets its title as summary; edit it in `prs.json` to improve it. A PR that is closed without being merged shows as `closed_unverified` until classified by hand.
- Own-repository and private-repository PRs are never listed. Run locally with `node scripts/update-prs.mjs`.

## Notes
- Personal email and phone are intentionally not on the site.
- The site has no résumé page or download.
- Languages: English at the root, Chinese under `/zh/`. Each page links to its counterpart and declares `hreflang`.
