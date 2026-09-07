function shouldGate() {
  const ua = navigator.userAgent || '';
  const phone = /iPhone|iPod|Android.+Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const narrow = window.matchMedia('(max-width: 1023px)').matches;
  const tablet = window.matchMedia('(hover: none) and (pointer: coarse)').matches && window.innerWidth < 1280;
  return phone || narrow || tablet;
}

function applyGate() {
  const gated = shouldGate();
  document.documentElement.classList.toggle('is-gated', gated);
  document.documentElement.classList.toggle('is-desktop', !gated);
  return gated;
}

applyGate();

const PAGES = [
  { id: 'home', labelKey: 'tabs.home', file: 'index.html', url: 'silkroad.by' },
  { id: 'catalog', labelKey: 'tabs.catalog', file: 'catalog.html', url: 'silkroad.by/catalog' },
  { id: 'car', labelKey: 'tabs.car', file: 'car.html?id=eqe-suv', url: 'silkroad.by/car' },
  { id: 'about', labelKey: 'tabs.about', file: 'about.html', url: 'silkroad.by/about' },
  { id: 'delivery', labelKey: 'tabs.delivery', file: 'delivery.html', url: 'silkroad.by/delivery' },
  { id: 'contacts', labelKey: 'tabs.contacts', file: 'contacts.html', url: 'silkroad.by/contacts' }
];

const ROOT = 'avto/';

const tabs = document.getElementById('pageTabs');
const frame = document.getElementById('mockFrame');
const urlBar = document.getElementById('urlBar');

let current = PAGES[0];

function srcFor(file) {
  return ROOT + file;
}

function setPage(page) {
  current = page;
  if (applyGate()) return;
  frame.src = srcFor(page.file);
  urlBar.textContent = page.url;
  tabs.querySelectorAll('button').forEach((btn) => {
    btn.classList.toggle('is-on', btn.dataset.id === page.id);
  });
}

function pageLabel(page) {
  return typeof t === 'function' ? t(page.labelKey) : page.labelKey;
}

function refreshTabs() {
  if (!tabs) return;
  tabs.querySelectorAll('button').forEach((btn) => {
    const page = PAGES.find((p) => p.id === btn.dataset.id);
    if (page) btn.textContent = pageLabel(page);
  });
}

PAGES.forEach((page) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.dataset.id = page.id;
  btn.textContent = pageLabel(page);
  btn.addEventListener('click', () => setPage(page));
  tabs.append(btn);
});

setPage(PAGES[0]);

window.addEventListener('resize', () => {
  const gated = applyGate();
  if (!gated && frame && !/\/avto\//.test(frame.src || '')) setPage(current);
});

document.querySelectorAll('.card[data-page]').forEach((card) => {
  card.addEventListener('click', () => {
    const file = card.dataset.page;
    const page = PAGES.find((p) => p.file === file) || {
      id: file,
      file,
      url: 'silkroad.by'
    };
    setPage(page);
    document.getElementById('theater').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        entry.target.classList.remove('wait');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.brief .reveal, .preview .reveal, .scope .reveal, .offer .reveal, .price .reveal, .foot .reveal').forEach((el) => {
  el.classList.add('wait');
  io.observe(el);
});

const track = document.getElementById('track');
const trackLabel = document.getElementById('trackLabel');
const sections = [...document.querySelectorAll('[id]')].filter((el) =>
  ['intro', 'brief', 'preview', 'scope', 'offer', 'price', 'contact'].includes(el.id)
);

function updateTrack() {
  let active = sections[0];
  sections.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.42) active = el;
  });
  if (!active || !track) return;
  track.querySelectorAll('a').forEach((link) => {
    link.classList.toggle('is-on', link.dataset.track === active.id);
  });
  const on = track.querySelector('a.is-on');
  if (trackLabel && on) trackLabel.textContent = on.textContent;
}

updateTrack();
window.addEventListener('scroll', updateTrack, { passive: true });
window.addEventListener('resize', updateTrack);
document.addEventListener('kp:lang', () => {
  refreshTabs();
  updateTrack();
});
