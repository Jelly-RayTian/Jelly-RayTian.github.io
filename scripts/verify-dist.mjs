// Post-build checks on dist/: expected pages, no removed content, internal links resolve, SEO tags present.
import fs from 'node:fs'; import path from 'node:path';
const dist = path.resolve('dist');
const fail = []; const ok = (c, m) => { if (!c) fail.push(m); };
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(dist, f));

const pages = ['', 'about/', 'education/', 'experience/', 'projects/', 'open-source/', 'volunteering/', 'systems/', 'creative/', 'contact/',
  'projects/watdesk/', 'projects/wechatsignals/', 'projects/codecompass/', 'projects/chronicle/', 'projects/madeira-experimental/', 'projects/easytrip/', 'projects/teachflow/',
  'systems/pvz2-resource-analysis/', 'systems/android-device-customization/', 'systems/ios-jailbreaking/'];
const all = [];
for (const lang of ['', 'zh/']) for (const p of pages) { all.push(`${lang}${p}index.html`); }
for (const f of all) ok(exists(f), `missing page ${f}`);
ok(exists('404.html'), 'missing 404.html'); ok(exists('sitemap-index.xml'), 'missing sitemap-index.xml');

// walk all html
const html = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : p.endsWith('.html') && html.push(p); } })(dist);
const banned = [/résumé/i, /Ray-Tian-Resume/i, /resume\.pdf/i, />\s*Resume\s*</i, /Download PDF/i, /Healix/i, /Disconnected/i, /IDA Pro/i, /gmail/i, /Ruiming/i, /mailto:/i];
for (const f of html) {
  const rel = path.relative(dist, f); const s = fs.readFileSync(f, 'utf8');
  for (const b of banned) ok(!b.test(s.replace(/<script[\s\S]*?<\/script>/g, '')), `${rel}: contains ${b}`);
  if (rel !== '404.html') {
    ok(/<title>[^<]+<\/title>/.test(s), `${rel}: no title`);
    ok((s.match(/<h1[ >]/g) || []).length === 1, `${rel}: expected exactly one h1`);
    ok(/rel="canonical"/.test(s) && /hreflang="zh-CN"/.test(s) && /property="og:title"/.test(s), `${rel}: SEO tags missing`);
  }
  // internal links
  for (const m of s.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const href = m[1]; if (href.startsWith('//')) continue;
    const target = href.endsWith('/') ? path.join(href, 'index.html') : href;
    ok(exists(target.slice(1)), `${rel}: broken internal link ${href}`);
  }
}
ok(!exists('assets/Ray-Tian-Resume.pdf'), 'old résumé PDF is still in dist');
const pdfs = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : /\.pdf$/i.test(p) && pdfs.push(p); } })(dist);
ok(pdfs.length === 0, `PDF files in dist: ${pdfs.join(', ')}`);
const sm = fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => read(f)).join('');
for (const p of ['', 'about/', 'systems/pvz2-resource-analysis/', 'zh/about/']) ok(sm.includes(`https://jelly-raytian.github.io/${p}`), `sitemap lacks /${p}`);
console.log(`${html.length} HTML files checked, ${fail.length} problem(s)`);
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
