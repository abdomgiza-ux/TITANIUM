import './style.css';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-sans-arabic/300.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScene } from './scene.js';
import { getLang, saveLang, t } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('js');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };

let lang = getLang();
let introDur = 0; // seconds the splash holds the hero text back
const stage = createScene($('#stage'), { reducedMotion: reduced });
if (!stage) $('#stage').style.display = 'none';

/* ------------------------------------------------------------------ *
 *  Language + text
 * ------------------------------------------------------------------ */
function splitWords(el, kind) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  el.setAttribute('aria-label', words.join(' '));
  words.forEach((word, i) => {
    if (kind === 'scrub') {
      const sw = document.createElement('span');
      sw.className = 'sw';
      sw.setAttribute('aria-hidden', 'true');
      sw.textContent = word;
      el.append(sw, i < words.length - 1 ? ' ' : '');
    } else {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      const wi = document.createElement('span');
      wi.className = 'wi';
      wi.textContent = word;
      w.append(wi);
      el.append(w, i < words.length - 1 ? ' ' : '');
    }
  });
}

const splitTriggers = new WeakMap();

function buildSplits(animate) {
  $$('.split').forEach((el) => {
    splitTriggers.get(el)?.kill();
    splitWords(el, 'mask');
    const words = $$('.wi', el);
    if (!animate || reduced) { gsap.set(words, { yPercent: 0 }); return; }
    const isHero = el.classList.contains('hero-title');
    gsap.set(words, { yPercent: 115 });
    const tween = gsap.to(words, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.07,
      delay: isHero ? 0.15 + introDur : 0,
      scrollTrigger: isHero ? null : { trigger: el, start: 'top 88%', once: true },
    });
    splitTriggers.set(el, tween.scrollTrigger || tween);
  });

  const st = $('#statement');
  splitTriggers.get(st)?.kill();
  splitWords(st, 'scrub');
  const sw = $$('.sw', st);
  if (reduced) { gsap.set(sw, { opacity: 1 }); return; }
  const tl = gsap.fromTo(sw, { opacity: 0.16 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.6,
    duration: 1,
    scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  });
  splitTriggers.set(st, tl.scrollTrigger);
}

function applyLang(next, animate) {
  lang = next;
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach((el) => { el.textContent = t(lang, el.dataset.i18n); });
  document.title = lang === 'ar'
    ? 'TiTANiUM Technology — البنية التحتية لتقنية المعلومات في دبي'
    : 'TiTANiUM Technology — IT infrastructure in Dubai';
  buildSplits(animate);
  measure();
  ScrollTrigger.refresh();
}

$('#lang').addEventListener('click', () => {
  const next = lang === 'en' ? 'ar' : 'en';
  saveLang(next);
  applyLang(next, false);
});

/* ------------------------------------------------------------------ *
 *  Scroll-driven 3D pose
 * ------------------------------------------------------------------ */
const ORDER = ['hero', 'intro', 'services', 'numbers', 'process', 'work', 'about', 'contact'];
const STICKY = new Set(['intro', 'services', 'process']);
const POSES = [
  { explode: 0,    ry: -0.7, rx: 0.28, x: 2.9,  y: 0, s: 0.86, o: 1 },
  { explode: 0,    ry: 0.2,  rx: 0.2,  x: 0,    y: 0, s: 1.35, o: 0.2 },
  { explode: 0,    ry: -0.5, rx: 0.22, x: -2.7, y: 0, s: 0.9,  o: 1 },
  { explode: 1,    ry: 0.55, rx: 0.16, x: -2.7, y: 0, s: 0.82, o: 1 },
  { explode: 0.15, ry: 1.9,  rx: 0.3,  x: 0,    y: 0, s: 1.5,  o: 0.1 },
  { explode: 0,    ry: 6.0,  rx: 0.22, x: 3.2,  y: 0, s: 0.88, o: 1 },
  { explode: 0.3,  ry: 6.6,  rx: 0.2,  x: 0,    y: 0, s: 1.3,  o: 0.04 },
  { explode: 0.1,  ry: 7.0,  rx: 0.25, x: 0,    y: 0, s: 1.3,  o: 0.04 },
  { explode: 0,    ry: 7.6,  rx: 0.25, x: 0,    y: 0, s: 1.2,  o: 0.08 },
];

let metrics = [];
function measure() {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  metrics = ORDER.map((id) => {
    const el = document.getElementById(id);
    const r = el.getBoundingClientRect();
    const height = r.height;
    const len = Math.max(1, STICKY.has(id) ? height - vh : height);
    return { id, el, top: r.top + sy, height, len };
  });
}

const svcEls = $$('.svc');
const svcDots = $$('.svc-dots li');
const stepEls = $$('.step');
const procFill = $('#procFill');
let svcIdx = 0;
let stepIdx = 0;

function setOn(list, idx) { list.forEach((el, i) => el.classList.toggle('on', i === idx)); }

function update() {
  if (!metrics.length) return;
  const sy = window.scrollY;
  let i = 0;
  for (let k = 0; k < metrics.length; k++) if (sy >= metrics[k].top - 1) i = k;
  const m = metrics[i];
  const p = clamp((sy - m.top) / m.len, 0, 1);
  const A = POSES[i];
  const B = POSES[i + 1];
  const flip = document.documentElement.dir === 'rtl' ? -1 : 1;

  const e = m.id === 'intro' ? smooth(0.7, 1, p) : m.id === 'numbers' ? smooth(0, 0.4, p) : p;
  const explode = m.id === 'services'
    ? lerp(A.explode, B.explode, smooth(0, 0.25, p))
    : lerp(A.explode, B.explode, e);

  if (stage) {
    stage.setPose({
      explode,
      ry: lerp(A.ry, B.ry, e) * flip,
      rx: lerp(A.rx, B.rx, e),
      x: lerp(A.x, B.x, e) * flip,
      y: lerp(A.y, B.y, e),
      s: lerp(A.s, B.s, e),
      o: lerp(A.o, B.o, e),
    });
  }

  const svcAt = metrics.findIndex((x) => x.id === 'services');
  const CH = svcEls.length;
  if (m.id === 'services') {
    const f = p * (CH + 0.15);
    const idx = Math.min(CH - 1, Math.floor(p * 0.9999 * CH));
    if (idx !== svcIdx) { svcIdx = idx; setOn(svcEls, idx); setOn(svcDots, idx); }
    stage?.setServices(f, flip);
  } else {
    stage?.setServices(i < svcAt ? -1 : CH + 0.2, flip);
  }

  if (m.id === 'process') {
    const idx = Math.min(stepEls.length - 1, Math.floor(p * 0.9999 * stepEls.length));
    if (idx !== stepIdx) { stepIdx = idx; setOn(stepEls, idx); }
    procFill.style.width = `${(p * 100).toFixed(1)}%`;
  }
}

gsap.ticker.add(update);
window.addEventListener('resize', () => { measure(); });

/* ------------------------------------------------------------------ *
 *  Reveals, counters, hero intro
 * ------------------------------------------------------------------ */
function setupReveals() {
  $$('[data-reveal]').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target + suffix; return; }
    const o = { v: 0 };
    gsap.to(o, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(o.v) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  if (!reduced) {
    gsap.fromTo($$('[data-hero]:not(.split)'), { opacity: 0, y: 28 }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.35 + introDur,
    });
  }
}

/* ------------------------------------------------------------------ *
 *  Boot
 * ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ *
 *  Logo splash: ~1 s of logo with a heartbeat, then fade out
 * ------------------------------------------------------------------ */
function startSplash() {
  const splash = $('#splash');
  let seen = false;
  try { seen = sessionStorage.getItem('introSeen') === '1'; } catch (e) { /* ignore */ }
  if (!splash || reduced || seen) { splash?.remove(); return; }
  try { sessionStorage.setItem('introSeen', '1'); } catch (e) { /* ignore */ }

  const img = $('#splash-logo', splash);
  const letters = $$('#sl-word path', splash);
  const tag = $('#sl-tag', splash);
  const stops = [$('#sg0'), $('#sg1'), $('#sg2')];
  const root = document.documentElement;
  root.classList.add('intro-on');
  introDur = 1.5;

  const beat = (t) => {
    const p = t % 1.1;
    return Math.exp(-(((p - 0.12) / 0.06) ** 2)) + 0.6 * Math.exp(-(((p - 0.38) / 0.07) ** 2));
  };
  const t0 = performance.now();
  (function frame() {
    const t = (performance.now() - t0) / 1000;
    const b = beat(Math.max(0, t - 0.4));
    const outK = smooth(1.25, 1.75, t);
    // letters are struck in one by one, left to right
    letters.forEach((el, i) => {
      const k = smooth(0.05 + i * 0.05, 0.3 + i * 0.05, t);
      el.style.opacity = String(k);
      el.style.transform = `translateY(${((1 - k) * 26).toFixed(1)}px)`;
    });
    tag.style.opacity = String(smooth(0.45, 0.75, t));
    // a band of light sweeps across the metal
    const sweep = -0.1 + 1.25 * smooth(0.15, 1.15, t);
    stops[0].setAttribute('offset', clamp(sweep - 0.12, 0, 1).toFixed(3));
    stops[1].setAttribute('offset', clamp(sweep, 0, 1).toFixed(3));
    stops[2].setAttribute('offset', clamp(sweep + 0.12, 0, 1).toFixed(3));
    img.style.opacity = String(1 - outK);
    img.style.transform = `scale(${(1 + 0.03 * b).toFixed(4)})`;
    splash.style.opacity = String(1 - outK);
    stage?.setPulse(b * (1 - outK * 0.5));
    if (t < 1.8) requestAnimationFrame(frame);
    else { splash.remove(); root.classList.remove('intro-on'); stage?.setPulse(0); }
  })();
}
startSplash();

applyLang(lang, true);
setupReveals();
measure();
ScrollTrigger.refresh();
document.fonts?.ready.then(() => { measure(); ScrollTrigger.refresh(); });
window.addEventListener('load', () => { measure(); ScrollTrigger.refresh(); });
