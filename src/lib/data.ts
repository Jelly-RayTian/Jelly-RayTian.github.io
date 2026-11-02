import content from '../content/data/content.json';
import prsData from '../content/data/prs.json';
import casesData from '../content/data/cases.json';
import type { Lang } from '../i18n/ui';

export { content };
export const cases = casesData;
export const prs = prsData.prs;
export const generatedOn: string = prsData.generated_on;

export type Status = 'merged' | 'squashed' | 'consolidated' | 'open' | 'draft' | 'retained' | 'closed_unverified';
export const statusOrder: Status[] = ['merged', 'squashed', 'consolidated', 'open', 'draft', 'retained', 'closed_unverified'];

export const statusMeta: Record<Status, { color: string; en: { n: string; d: string }; zh: { n: string; d: string } }> = {
  merged: { color: '--ok', en: { n: 'Merged', d: 'GitHub marks it merged; merge commit is on the default branch.' }, zh: { n: '已合并', d: 'GitHub 标记为已合并，合并提交在默认分支上。' } },
  squashed: { color: '--gold', en: { n: 'Squashed onto main', d: 'Closed, but the maintainer applied it to main as my commit.' }, zh: { n: '已 squash 进 main', d: 'PR 已关闭，但维护者把它以我的提交应用到了 main。' } },
  consolidated: { color: '--blue', en: { n: 'Consolidated', d: "Closed into a maintainer PR; my commits are in main's history." }, zh: { n: '已整合', d: '已关闭并并入维护者的整合 PR；我的提交在 main 的历史中。' } },
  open: { color: '--warn', en: { n: 'Open', d: 'Under review.' }, zh: { n: '审核中', d: '审核中。' } },
  draft: { color: '--muted', en: { n: 'Draft', d: 'Experimental draft; no integration claimed.' }, zh: { n: '草稿', d: '实验性草稿；不声称已整合。' } },
  retained: { color: '--muted', en: { n: 'Retained, unproven', d: '' }, zh: { n: '已保留（未证实）', d: '' } },
  closed_unverified: { color: '--muted', en: { n: 'Closed, unverified', d: '' }, zh: { n: '已关闭（未验证）', d: '' } },
};

export const statusName = (s: string, lang: Lang) => statusMeta[s as Status][lang].n;

export const sortedPrs = [...prs].sort(
  (a, b) => statusOrder.indexOf(a.status as Status) - statusOrder.indexOf(b.status as Status) || a.repo.localeCompare(b.repo) || a.number - b.number,
);

export const count = (s: Status) => prs.filter((p) => p.status === s).length;
export const repoStats = (repo: string) => ({
  total: prs.filter((p) => p.repo === repo).length,
  merged: prs.filter((p) => p.repo === repo && p.status === 'merged').length,
  squashed: prs.filter((p) => p.repo === repo && p.status === 'squashed').length,
  consolidated: prs.filter((p) => p.repo === repo && p.status === 'consolidated').length,
  open: prs.filter((p) => p.repo === repo && (p.status === 'open' || p.status === 'draft')).length,
});
export const repos = [...new Set(prs.map((p) => p.repo))];

export const entriesFor = (section: string) => content.entries.filter((e) => e.section === section);
export const entry = (id: string) => content.entries.find((e) => e.id === id)!;
