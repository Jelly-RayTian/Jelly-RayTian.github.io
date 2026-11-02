import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User site: https://jelly-raytian.github.io/ is served from the domain root, so no `base`.
export default defineConfig({
  site: 'https://jelly-raytian.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: { shikiConfig: { theme: 'github-dark', wrap: true } },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', zh: 'zh-CN' } },
    }),
  ],
});
