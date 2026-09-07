const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;

if (reduce) {
  document.querySelectorAll('.hero-bg video').forEach((video) => {
    video.pause();
    video.removeAttribute('autoplay');
    video.style.display = 'none';
  });
}

const topBar = document.querySelector('.top');
const onScroll = () => {
  topBar?.classList.toggle('is-scrolled', window.scrollY > 16);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const nav = document.getElementById('site-nav');
const toggle = document.getElementById('menu-toggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  topBar?.classList.toggle('nav-open', open);
});
nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    topBar?.classList.remove('nav-open');
  });
});

if (!reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.16 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

if (!coarse) {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cur && ring) {
    cur.hidden = false;
    ring.hidden = false;
    window.addEventListener('pointermove', (event) => {
      cur.style.left = `${event.clientX}px`;
      cur.style.top = `${event.clientY}px`;
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('pointerenter', () => document.body.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => document.body.classList.remove('is-hover'));
    });
  }
}

document.querySelectorAll('.faq-item button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((el) => {
      el.classList.remove('open');
      el.querySelector('button')?.setAttribute('aria-expanded', 'false');
      const mark = el.querySelector('i');
      if (mark) mark.textContent = '+';
    });
    if (!open) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      const mark = btn.querySelector('i');
      if (mark) mark.textContent = '−';
    }
  });
});

const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
  const d = phone.value.replace(/\D/g, '').slice(0, 9);
  const a = d.slice(0, 2);
  const b = d.slice(2, 5);
  const c = d.slice(5, 7);
  const e = d.slice(7, 9);
  let out = '';
  if (a) out = `(${a}`;
  if (a.length === 2) out += ')';
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (e) out += `-${e}`;
  phone.value = out;
});

const params = new URLSearchParams(location.search);
const preselect = params.get('model');
const modelSelect = document.querySelector('#quote-form [name="model"]');
if (modelSelect && preselect) modelSelect.value = preselect;

const form = document.getElementById('quote-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = form.name.value.trim();
  const tel = form.phone.value.trim();
  if (!name || !tel) return;
  document.getElementById('form-ok')?.classList.add('show');
  form.reset();
  if (preselect && modelSelect) modelSelect.value = preselect;
});

document.querySelectorAll('[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => {
      item.classList.toggle('is-on', item === btn);
    });
    const cards = document.querySelectorAll('.catalog-grid .car');
    let visible = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.stock === filter || card.dataset.type === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const empty = document.querySelector('.catalog-empty');
    if (empty) empty.hidden = visible > 0;
  });
});

const cookie = document.getElementById('cookie');
if (cookie && !localStorage.getItem('sra-cookie')) cookie.classList.add('show');
cookie?.querySelector('button')?.addEventListener('click', () => {
  localStorage.setItem('sra-cookie', '1');
  cookie.classList.remove('show');
});
