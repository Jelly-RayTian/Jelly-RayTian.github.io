const root = document.documentElement;
const lang = root.dataset.lang;

// theme toggle
const tb = document.getElementById('theme') as HTMLButtonElement | null;
const syncTheme = () => {
  if (!tb) return;
  tb.textContent = root.dataset.theme === 'dark' ? tb.dataset.light! : tb.dataset.dark!;
};
syncTheme();
tb?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  syncTheme();
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

// reveal on scroll
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// scroll progress
const prog = document.getElementById('prog');
addEventListener('scroll', () => {
  if (prog) prog.style.transform = `scaleX(${scrollY / (document.body.scrollHeight - innerHeight || 1)})`;
}, { passive: true });

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

// hero glow follows the pointer
const hero = document.querySelector<HTMLElement>('.hero');
if (hero) addEventListener('pointermove', (e) => { hero.style.setProperty('--mx', e.clientX + 'px'); hero.style.setProperty('--my', e.clientY + scrollY + 'px'); }, { passive: true });

// Old single-page anchors (#education, #systems, ...) -> new pages.
const legacy: Record<string, string> = {
  about: '/about/', education: '/education/', achievements: '/education/', leadership: '/experience/', research: '/experience/',
  projects: '/projects/', cases: '/open-source/', explorer: '/open-source/', wall: '/open-source/', community: '/volunteering/',
  systems: '/systems/', creative: '/creative/', contact: '/contact/',
};
const path = location.pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
const target = legacy[location.hash.slice(1)];
if (path === '/' && target) location.replace((lang === 'zh' ? '/zh' : '') + target);

