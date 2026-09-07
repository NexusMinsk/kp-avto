(function () {
  const canvas = document.getElementById('hero-fx');
  if (!canvas) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const lerp = (a, b, t) => a + (b - a) * t;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let lines = [];
  let visible = true;

  function makeLines() {
    const n = w < 720 ? 7 : 10;
    lines = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      lines.push({
        y0: h * lerp(0.16, 0.9, t),
        y1: h * lerp(0.04, 0.46, t),
        amp: lerp(8, 42, t),
        freq: lerp(1.05, 2.35, t) * Math.PI,
        phase: t * 5.1 + i * 0.41,
        speed: lerp(0.07, 0.16, t),
        flow: lerp(18, 48, t),
        glow: lerp(3, 7, t),
        core: lerp(1, 2.1, t),
        alpha: lerp(0.22, 0.58, t),
        dash: lerp(160, 280, t),
        gap: lerp(70, 130, t),
        rgb: t > 0.55 ? '110,170,255' : '55,85,255',
      });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const nextW = Math.max(1, Math.round(rect.width));
    const nextH = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (nextW === w && nextH === h && nextDpr === dpr) return;
    w = nextW;
    h = nextH;
    dpr = nextDpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeLines();
  }

  function yAt(line, x, sec) {
    const t = x / w;
    return line.y0 + (line.y1 - line.y0) * t
      + Math.sin(t * line.freq + sec * line.speed + line.phase) * line.amp * (0.3 + t * 0.7);
  }

  function paint(now) {
    const sec = now * 0.001;
    ctx.fillStyle = '#05060e';
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'lighter';

    const steps = Math.max(36, (w / 14) | 0);
    for (const line of lines) {
      ctx.beginPath();
      ctx.moveTo(0, yAt(line, 0, sec));
      for (let i = 1; i <= steps; i++) {
        const x = (i / steps) * w;
        ctx.lineTo(x, yAt(line, x, sec));
      }

      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(${line.rgb},${line.alpha * 0.18})`;
      ctx.lineWidth = line.glow;
      ctx.stroke();

      ctx.strokeStyle = `rgba(${line.rgb},${line.alpha})`;
      ctx.lineWidth = line.core;
      ctx.stroke();

      ctx.setLineDash([line.dash, line.gap]);
      ctx.lineDashOffset = -(sec * line.flow + line.phase * 18);
      ctx.strokeStyle = `rgba(210,230,255,${line.alpha * 0.75})`;
      ctx.lineWidth = Math.max(0.7, line.core * 0.45);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.setLineDash([]);
  }

  function loop(now) {
    paint(now);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (reduce) {
      paint(0);
      return;
    }
    if (raf || !visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  resize();
  start();

  let resizeTick = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(() => {
      resize();
      if (reduce) paint(0);
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.02 });
    io.observe(canvas);
  }
})();
