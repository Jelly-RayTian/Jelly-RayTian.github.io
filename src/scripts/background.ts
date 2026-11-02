// Constellation background: drifting nodes joined by faint lines, repelled by the pointer.
const cv = document.getElementById('bg') as HTMLCanvasElement | null;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (cv) {
  const ctx = cv.getContext('2d')!;
  const root = document.documentElement;
  type Node = { x: number; y: number; vx: number; vy: number; r: number };
  let W = 0, H = 0, dpr = 1, mx = -9999, my = -9999;
  const nodes: Node[] = [];
  const col = { a: '#f2c14e', b: '#7fa8ff' };
  const css = (n: string) => getComputedStyle(root).getPropertyValue(n).trim();
  const pal = () => { col.a = css('--gold') || col.a; col.b = css('--blue') || col.b; };

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv!.width = innerWidth * dpr;
    H = cv!.height = innerHeight * dpr;
    const n = innerWidth < 700 ? 30 : Math.round((innerWidth * innerHeight) / 18000);
    while (nodes.length < n) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr, r: (Math.random() * 1.4 + 0.7) * dpr });
    }
    nodes.length = n;
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const L = 150 * dpr, M = 210 * dpr;
    for (const p of nodes) {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mx * dpr, dy = p.y - my * dpr, d = Math.hypot(dx, dy);
      if (!reduce && d < M && d > 0) { p.x += (dx / d) * 0.6 * dpr; p.y += (dy / d) * 0.6 * dpr; }
    }
    ctx.lineWidth = dpr;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < L) { ctx.globalAlpha = (1 - d / L) * 0.38; ctx.strokeStyle = col.b; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      const d = Math.hypot(a.x - mx * dpr, a.y - my * dpr);
      if (d < M) { ctx.globalAlpha = (1 - d / M) * 0.7; ctx.strokeStyle = col.a; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx * dpr, my * dpr); ctx.stroke(); }
      ctx.globalAlpha = 0.8; ctx.fillStyle = d < M ? col.a : col.b; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    if (!reduce && !document.hidden) requestAnimationFrame(frame);
  }

  addEventListener('resize', size);
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(frame); });
  new MutationObserver(pal).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  pal(); size(); frame();
}
