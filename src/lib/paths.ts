import type { Lang } from '../i18n/ui';

/** Static paths for pages that exist once per language: `/x/` (en) and `/zh/x/` (zh). */
export function localePaths(): { params: { lang: string | undefined }; props: { lang: Lang } }[] {
  return [
    { params: { lang: undefined }, props: { lang: 'en' } },
    { params: { lang: 'zh' }, props: { lang: 'zh' } },
  ];
}

export function localeParam(lang: Lang): string | undefined {
  return lang === 'zh' ? 'zh' : undefined;
}
