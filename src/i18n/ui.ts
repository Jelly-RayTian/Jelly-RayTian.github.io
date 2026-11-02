export const locales = ['en', 'zh'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'en';
export const htmlLang: Record<Lang, string> = { en: 'en', zh: 'zh-CN' };

/** Path for a page in a language. `path` like "/about/" (always leading and trailing slash). */
export function route(lang: Lang, path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? p : `/zh${p}`;
}

/** Strip the locale prefix from a pathname. */
export function stripLang(pathname: string): { lang: Lang; path: string } {
  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    return { lang: 'zh', path: pathname.slice(3) || '/' };
  }
  return { lang: 'en', path: pathname };
}

export const nav = [
  { path: '/', key: 'home' },
  { path: '/about/', key: 'about' },
  { path: '/education/', key: 'education' },
  { path: '/experience/', key: 'experience' },
  { path: '/projects/', key: 'projects' },
  { path: '/open-source/', key: 'openSource' },
  { path: '/volunteering/', key: 'volunteering' },
  { path: '/systems/', key: 'systems' },
  { path: '/creative/', key: 'creative' },
  { path: '/contact/', key: 'contact' },
] as const;

type Dict = Record<string, string>;
export const ui: Record<Lang, Dict> = {
  en: {
    home: 'Home', about: 'About', education: 'Education', experience: 'Experience', projects: 'Projects',
    openSource: 'Open source', volunteering: 'Volunteering', systems: 'Systems', creative: 'Creative', contact: 'Contact',
    skip: 'Skip to content', menu: 'Menu', langSwitch: '中文', langSwitchLabel: 'Switch to Chinese', themeLight: 'Light', themeDark: 'Dark',
    themeLabel: 'Toggle colour theme', viewMore: 'View more', viewAll: 'View all', readMore: 'Read more', backTo: 'Back to',
    siteTitle: 'Ray Tian', tagline: 'Ray Tian — University of Waterloo, Honours Mathematics (Co-op)',
    footNote: 'Open-source claims link to PRs, maintainer comments or commits. Personal activities are self-reported and described conservatively.',
    ledger: 'Full contribution ledger', source: 'Source', repo: 'Repository', status: 'Status',
    mergedTiles: 'pull requests to other people\'s projects', hoverTip: 'Hover, focus or tap a tile for the PR.',
    allRepos: 'All repositories', allStatuses: 'All statuses', search: 'Search title or description', noMatch: 'No matching pull requests.',
    updated: 'Updated', external: 'external pull requests', notMerged: 'Squashed and consolidated PRs are shown separately and are not counted as merged. Pull requests in my own repositories are excluded.',
    aiNote: 'Most of this work was developed with AI coding assistance, which the PR descriptions state; I scope each bug, review the diff and check the tests.',
    stack: 'Stack', period: 'Period', links: 'Links', references: 'References', notFound: 'Page not found', notFoundText: 'This page does not exist. Try the home page.',
    seeEvidence: 'See the evidence', skills: 'Skills, honestly tiered', interests: 'Interests', languagesLabel: 'Languages',
    coursework: 'Relevant coursework', featuredProjects: 'Featured projects', openSourceTitle: 'Open source', beyond: 'Beyond the code',
    aboutMe: 'About me', coursework2: 'Coursework concepts', researchPres: 'Research & presentations', articles: 'Articles and notes',
    profile: 'Profile', followMe: 'Find me',
  },
  zh: {
    home: '首页', about: '关于', education: '教育', experience: '经历', projects: '项目',
    openSource: '开源', volunteering: '志愿', systems: '系统探索', creative: '创作', contact: '联系',
    skip: '跳到正文', menu: '菜单', langSwitch: 'EN', langSwitchLabel: '切换到英文', themeLight: '浅色', themeDark: '深色',
    themeLabel: '切换配色', viewMore: '查看更多', viewAll: '查看全部', readMore: '阅读更多', backTo: '返回',
    siteTitle: 'Ray Tian', tagline: 'Ray Tian — 滑铁卢大学数学荣誉学士（Co-op）',
    footNote: '开源贡献附有 PR、维护者评论或提交链接；个人活动为自述，措辞保守。',
    ledger: '完整贡献记录', source: '源码', repo: '仓库', status: '状态',
    mergedTiles: '个提交给他人项目的 pull request', hoverTip: '悬停、聚焦或点按方块查看 PR。',
    allRepos: '全部仓库', allStatuses: '全部状态', search: '搜索标题或描述', noMatch: '没有匹配的 pull request。',
    updated: '更新于', external: '个外部 pull request', notMerged: '“squash”和“整合”的 PR 单独标示，不计为已合并。我自己仓库里的 PR 不包含在内。',
    aiNote: '这些工作大多借助 AI 编程助手完成（PR 描述中已注明）；我负责界定问题、审查 diff、检查测试。',
    stack: '技术栈', period: '时间', links: '链接', references: '参考资料', notFound: '页面不存在', notFoundText: '这个页面不存在，请回到首页。',
    seeEvidence: '查看证据', skills: '技能（如实分级）', interests: '兴趣', languagesLabel: '语言',
    coursework: '相关课程', featuredProjects: '精选项目', openSourceTitle: '开源贡献', beyond: '代码之外',
    aboutMe: '关于我', coursework2: '课程概念项目', researchPres: '研究与展示', articles: '文章与笔记',
    profile: '简介', followMe: '联系渠道',
  },
};
export const t = (lang: Lang, key: string): string => ui[lang][key] ?? ui.en[key] ?? key;
