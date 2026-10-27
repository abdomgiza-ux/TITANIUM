import './style.css';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-sans-arabic/300.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import { getLang, saveLang, t } from './i18n.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let lang = getLang();

function applyLang(next) {
  lang = next;
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach((el) => { el.textContent = t(lang, el.dataset.i18n); });
  document.title = t(lang, 'tk.doc');
}

$('#lang').addEventListener('click', () => {
  const next = lang === 'en' ? 'ar' : 'en';
  saveLang(next);
  applyLang(next);
});

function newTicketId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TT-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}

const form = $('#ticketForm');
const status = $('#formStatus');

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  $$('input, textarea', form).forEach((f) => f.classList.remove('bad'));
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !okEmail || !message) {
    if (!name) form.elements.name.classList.add('bad');
    if (!okEmail) form.elements.email.classList.add('bad');
    if (!message) form.elements.message.classList.add('bad');
    status.className = 'form-status err';
    status.textContent = t(lang, 'status.invalid');
    return;
  }

  const id = newTicketId();
  $('#ticketId').value = id;
  status.className = 'form-status';
  status.textContent = t(lang, 'status.sending');
  const btn = $('button[type="submit"]', form);
  btn.disabled = true;

  try {
    const data = Object.fromEntries(new FormData(form));
    data.subject = `[${id}] ${data.subject || data.topic || 'New ticket'}`;
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || out.success === false) throw new Error(out.message || String(res.status));
    form.reset();
    status.className = 'form-status ok';
    status.textContent = `${t(lang, 'tk.ok')} ${id}`;
  } catch (err) {
    status.className = 'form-status err';
    status.textContent = `${t(lang, 'status.err')} (${err.message})`;
  } finally {
    btn.disabled = false;
  }
});

applyLang(lang);
