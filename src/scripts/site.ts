const root = document.documentElement;
const lang = root.dataset.lang;

// theme toggle
document.getElementById('theme')?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
});

// mobile menu
const mb = document.getElementById('menu-btn');
const nav = document.getElementById('site-nav');
mb?.addEventListener('click', () => {
  const open = mb.getAttribute('aria-expanded') !== 'true';
  mb.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mb?.getAttribute('aria-expanded') === 'true') {
    mb.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
    mb.focus();
  }
});

// highlight the section link for the part of the page in view
document.querySelectorAll<HTMLElement>('[data-spy]').forEach((spy) => {
  const links = [...spy.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean) as HTMLElement[];
  const update = () => {
    const y = scrollY + innerHeight * 0.3;
    let cur = targets[0]?.id;
    for (const t of targets) if (t.offsetTop <= y) cur = t.id;
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = targets[targets.length - 1]?.id;
    links.forEach((a) => a.classList.toggle('on', a.hash.slice(1) === cur));
  };
  addEventListener('scroll', update, { passive: true });
  update();
});

// PR wall tooltip
const tip = document.getElementById('tip');
document.querySelectorAll<HTMLElement>('.tile').forEach((t) => {
  const show = (e: Event) => {
    if (!tip) return;
    tip.textContent = '';
    tip.append(t.dataset.title ?? '');
    const s = document.createElement('small');
    s.textContent = t.dataset.meta ?? '';
    tip.append(s);
    tip.style.opacity = '1';
    const r = t.getBoundingClientRect();
    const me = e as MouseEvent;
    const x = me.clientX ?? r.left, y = me.clientY ?? r.top;
    tip.style.left = Math.min(x + 14, innerWidth - 310) + 'px';
    tip.style.top = y + 18 + 'px';
  };
  const hide = () => { if (tip) tip.style.opacity = '0'; };
  t.addEventListener('mouseenter', show); t.addEventListener('mousemove', show); t.addEventListener('mouseleave', hide);
  t.addEventListener('focus', show); t.addEventListener('blur', hide);
});

// Old single-page anchors (#education, #systems, ...) -> new pages.
const legacy: Record<string, string> = {
  about: '/about/', achievements: '/about/#honours', leadership: '/experience/#leadership',
  cases: '/open-source/#cases', explorer: '/open-source/#all-prs', wall: '/open-source/', community: '/experience/#volunteering',
  systems: '/systems/', creative: '/about/#creative', papers: '/#research', competitions: '/experience/#competitions',
  writing: '/#research', yc: '/#looking',
};
const path = location.pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
const target = legacy[location.hash.slice(1)];
if (path === '/' && target) location.replace((lang === 'zh' ? '/zh' : '') + target);

