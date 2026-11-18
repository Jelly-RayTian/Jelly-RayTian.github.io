import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

test('repository transfers preserve curated records without counting redirected PRs twice', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-prs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  const dataDir = join(root, 'src/content/data');
  await mkdir(dataDir, { recursive: true });
  const script = join(root, 'scripts/update-prs.mjs');
  await cp(new URL('./update-prs.mjs', import.meta.url), script);

  const repo = 'NewOrg/project';
  const oldRepo = 'OldOrg/project';
  const url = (name, number) => `https://github.com/${name}/pull/${number}`;
  const record = (name, number, status, summary) => ({
    repo: name, number, url: url(name, number), title: `PR ${number}`, status, summary,
  });
  const file = join(dataDir, 'prs.json');
  await writeFile(file, JSON.stringify({
    generated_on: '2026-11-16',
    prs: [
      record(repo, 1, 'closed_unverified', 'PR 1'),
      record(oldRepo, 1, 'squashed', 'Maintainer applied the patch'),
      record(oldRepo, 2, 'merged', 'Existing PR missing from search'),
    ],
  }));

  const preload = join(root, 'github.mjs');
  const githubResponses = {
    '/search/issues': { items: [{ repository_url: `https://api.github.com/repos/${oldRepo}`, number: 1 }] },
    [`/repos/${oldRepo}`]: { full_name: repo, private: false },
    [`/repos/${repo}`]: { full_name: repo, private: false },
    [`/repos/${oldRepo}/pulls/1`]: { number: 1, html_url: url(repo, 1), title: 'PR 1', state: 'closed' },
    [`/repos/${repo}/pulls/1`]: { number: 1, html_url: url(repo, 1), title: 'PR 1', state: 'closed' },
  };
  await writeFile(preload, `
    const responses = ${JSON.stringify(githubResponses)};
    globalThis.fetch = async (url) => {
      const pathname = new URL(url).pathname;
      if (!Object.hasOwn(responses, pathname)) throw new Error('Unexpected GitHub request: ' + pathname);
      return Response.json(responses[pathname]);
    };
  `);

  const refresh = () => execFileSync(process.execPath, ['--import', preload, script], {
    env: { ...process.env, GITHUB_TOKEN: 'test-token', GITHUB_OUTPUT: '' },
    encoding: 'utf8',
  });
  refresh();
  const refreshed = await readFile(file, 'utf8');
  assert.deepEqual(JSON.parse(refreshed).prs, [
    record(repo, 1, 'squashed', 'Maintainer applied the patch'),
    record(repo, 2, 'merged', 'Existing PR missing from search'),
  ]);
  assert.match(refresh(), /No change/);
  assert.equal(await readFile(file, 'utf8'), refreshed);
});
