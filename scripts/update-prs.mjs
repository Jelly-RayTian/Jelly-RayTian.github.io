// Refreshes src/content/data/prs.json from GitHub (read-only GET requests).
//
// The file is the source of truth for hand-checked facts. For every PR already in it,
// `summary` and the closed-but-integrated classes (squashed / consolidated / retained) are kept,
// because they were verified against the upstream history and cannot be derived from the API.
// Live facts come from GitHub: merged / open / draft, and new PRs.
//   - a PR that is merged on GitHub becomes "merged"
//   - an open PR becomes "open" or "draft"
//   - a closed, unmerged PR keeps its curated class, otherwise becomes "closed_unverified"
//   - a new PR gets its title as summary until a better one is written
// Pull requests in my own repositories and in private repositories are never listed.
//
// Usage: node scripts/update-prs.mjs   (GITHUB_TOKEN, else `gh auth token`, else anonymous)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src/content/data/prs.json');
const USER = 'Jelly-RayTian';
const API = 'https://api.github.com';
const KEEP_CLOSED = new Set(['squashed', 'consolidated', 'retained']);

let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  try { token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim(); } catch { /* anonymous */ }
}

async function get(url, { allowMissing = false } = {}) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-pr-refresh', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (res.ok) return res.json();
    if (allowMissing && res.status === 404) return null;
    if ([403, 429, 500, 502, 503, 504].includes(res.status)) {
      await new Promise((r) => setTimeout(r, 2000 * 2 ** attempt));
      continue;
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  throw new Error(`Giving up on ${url}`);
}

const current = JSON.parse(fs.readFileSync(file, 'utf8'));
const repoCache = new Map();
async function resolveRepo(name) {
  const key = name.toLowerCase();
  if (!repoCache.has(key)) {
    const repo = await get(`${API}/repos/${name}`, { allowMissing: true });
    repoCache.set(key, repo);
    if (repo) repoCache.set(repo.full_name.toLowerCase(), repo);
  }
  return repoCache.get(key);
}

const isExcluded = (repo) => repo.private || repo.full_name.split('/')[0].toLowerCase() === USER.toLowerCase();
const prKey = (repo, number) => `${repo.toLowerCase()}#${number}`;
const known = new Map();
for (const p of current.prs) {
  const resolved = await resolveRepo(p.repo);
  if (resolved && isExcluded(resolved)) continue;
  const repo = resolved?.full_name ?? p.repo;
  const url = resolved ? `https://github.com/${repo}/pull/${p.number}` : p.url;
  const key = prKey(repo, p.number);
  const previous = known.get(key);
  if (!previous) {
    known.set(key, { ...p, repo, url });
  } else {
    // Keep hand-verified details even if the current-name record was generated later.
    if (previous.summary === previous.title && p.summary !== p.title) previous.summary = p.summary;
    if (previous.status === 'closed_unverified' && KEEP_CLOSED.has(p.status)) previous.status = p.status;
  }
}

const items = [];
for (let page = 1; ; page++) {
  const r = await get(`${API}/search/issues?q=author:${USER}+type:pr&per_page=100&page=${page}`);
  items.push(...r.items);
  if (r.items.length < 100) break;
}

const next = new Map();
for (const it of items) {
  const name = it.repository_url.split('/repos/')[1];
  if (name.split('/')[0].toLowerCase() === USER.toLowerCase()) continue;
  const resolved = await resolveRepo(name);
  if (!resolved || isExcluded(resolved)) continue;
  const repo = resolved.full_name;
  const key = prKey(repo, it.number);
  if (next.has(key)) continue;
  const pr = await get(`${API}/repos/${repo}/pulls/${it.number}`);
  const old = known.get(key);
  let status;
  if (pr.merged_at) status = 'merged';
  else if (pr.state === 'open') status = pr.draft ? 'draft' : 'open';
  else status = old && KEEP_CLOSED.has(old.status) ? old.status : 'closed_unverified';
  next.set(key, { repo, number: pr.number, url: pr.html_url, title: pr.title, status, summary: old?.summary ?? pr.title });
}

// Never lose a PR because search lagged or hid it: keep entries that were not returned.
for (const [key, p] of known) if (!next.has(key)) next.set(key, p);

const prs = [...next.values()].sort((a, b) => a.repo.toLowerCase().localeCompare(b.repo.toLowerCase()) || a.number - b.number);
const changed = JSON.stringify(prs) !== JSON.stringify(current.prs);

if (changed) {
  const out = { generated_on: new Date().toISOString().slice(0, 10), prs };
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n');
}
const added = prs.filter((p) => !known.has(prKey(p.repo, p.number)));
const moved = prs.filter((p) => known.has(prKey(p.repo, p.number)) && known.get(prKey(p.repo, p.number)).status !== p.status);
console.log(`${prs.length} PRs (${added.length} new, ${moved.length} changed status). ${changed ? 'prs.json updated.' : 'No change.'}`);
for (const p of added) console.log(`  new:  ${p.repo}#${p.number} [${p.status}] ${p.title}`);
for (const p of moved) console.log(`  moved: ${p.repo}#${p.number} ${known.get(prKey(p.repo, p.number)).status} -> ${p.status}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
