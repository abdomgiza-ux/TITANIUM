/* TiTANiUM Technology — language switching, scroll assembly, ticket form */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG — the Web3Forms access key (carried over from the previous site).
     Manage it at https://web3forms.com (the destination inbox is set in
     your Web3Forms account, so no email address ever appears in this site).
     ------------------------------------------------------------------ */
  var WEB3FORMS_ACCESS_KEY = '858c51ff-6741-4b14-851d-f76a9b9daad1';

  var WHATSAPP_URL = 'https://wa.me/971541938341';
  var STORAGE_KEY = 'titanium_lang';
  var root = document.documentElement;

  /* The HTML ships in Arabic. English lives here; Arabic is read back from the page. */
  var EN = {
    'skip': 'Skip to content',
    'nav.label': 'Main menu',
    'nav.about': 'What I do',
    'nav.services': 'Services',
    'nav.how': 'How I work',
    'nav.contact': 'Contact',
    'lang.label': 'Language',
    'cta.waShort': 'WhatsApp',
    'cta.wa': 'Message me on WhatsApp',
    'cta.ticket': 'Open a support ticket',

    'hero.place': 'Dubai, UAE',
    'hero.h1a': 'Abdulrahman',
    'hero.h1b': 'Mansour',
    'hero.role': 'IT technician in Dubai',
    'hero.sub': 'I fix computers and laptops, sort out network problems, and install CCTV cameras. I work in Dubai.',
    'hero.artTitle': 'Exploded drawing of a network rack: firewall, patch panel, switch, and a CCTV camera',
    'hero.l.firewall': 'Firewall',
    'hero.l.patch': 'Patch panel · Cat6',
    'hero.l.switch': '24-port switch',
    'hero.l.rack': '19-inch rack',
    'hero.l.cctv': 'CCTV dome',
    'spec.1': 'About 6 years in IT',
    'spec.2': 'Two of them in the UAE',
    'spec.3': 'Cabling, cameras, networks',
    'spec.4': 'All over Dubai',

    'svc.title': 'Services',
    'svc.lead': 'Six services I carry out at your place.',

    'st.1': 'I\u2019m Abdulrahman.',
    'st.2': 'I repair devices',
    'st.3': 'I tidy up networks',
    'st.4': 'I install cameras',
    'st.6': 'I service printers',
    'st.5': 'You talk to me directly, and I am the one who comes to you.',
    'dk.1': 'Systems I work on',
    'dk.1a': 'Accounts, mailboxes, and licences',
    'dk.1b': 'Users, permissions, and file sharing',
    'dk.1c': 'Firewall setup and rules',
    'dk.2': 'Field work',
    'dk.2at': 'Racks and Cat6 cabling',
    'dk.2a': 'Runs, termination, labelling, and testing',
    'dk.2bt': 'Cameras and recorders',
    'dk.2b': 'Mounting, setup, and viewing on your phone',
    'dk.2ct': 'Laptops and PCs',
    'dk.2c': 'SSD upgrades, cleaning, and Windows installs',
    'dk.3': 'How I deal with you',
    'dk.3at': 'Free initial check',
    'dk.3a': 'I diagnose the problem before any cost',
    'dk.3bt': 'Price before work',
    'dk.3b': 'You approve the amount, then I start',
    'dk.3ct': 'Tested in front of you',
    'dk.3c': 'We check the result together before I leave',
    'svc.request': 'Request this service',

    's1.t': 'Laptop & PC repair + speed-up',
    's1.d': 'Slow, overheating, or not starting? I find the fault, replace what has failed, and bring the machine back to speed.',
    's1.a': 'SSD and RAM upgrades',
    's1.b': 'Internal cleaning, thermal paste, and fan repair',
    's1.c': 'Windows install, drivers, and data transfer',

    's2.t': 'Wi-Fi & network problems fixed',
    's2.d': 'Dead spots, dropouts, or a slow connection. I look for the cause in the network itself.',
    's2.a': 'Wi-Fi coverage and access point installation',
    's2.b': 'Router and switch setup',
    's2.c': 'Shared printers and files for shops and offices',

    's3.t': 'CCTV installation & maintenance',
    's3.d': 'Cameras placed where they actually see, recording you can play back, and live view on your phone.',
    's3.a': 'New camera installation',
    's3.b': 'DVR / NVR setup and remote viewing',
    's3.c': 'No-image, recording, and cable faults fixed',

    's4.t': 'Network cabling & rack setup',
    's4.d': 'Clean copper cabling and a rack you can read at a glance: every cable labelled and tested.',
    's4.a': 'Cat6 / Cat6A cable runs and termination',
    's4.b': 'Rack, patch panel, switch, and firewall installation',
    's4.c': 'Cable labelling and testing',

    's5.t': 'Printer maintenance & ink / toner',
    's5.d': 'Paper jams, faded prints, or a printer that will not connect. I service it and supply the right ink or toner.',
    's5.a': 'Laser and inkjet printer maintenance',
    's5.b': 'Ink and toner supply',
    's5.c': 'Network and Wi-Fi printer setup',

    's6.t': 'Phone repair & software support',
    's6.d': 'Phone faults, and everyday software problems on your phone or computer.',
    's6.a': 'Screen and battery replacement',
    's6.b': 'System issues, updates, and data transfer',
    's6.c': 'Program installation and setup',

    'dg.tag': 'Digital & growth division',
    'dg.t': 'Social media & paid ads',
    'dg.d': 'Page setup, content, and paid campaigns on Facebook and Instagram for local businesses.',

    'art.laptop': 'Open laptop: SSD and RAM modules slide in and the fan spins up',
    'art.wifi': 'Wi-Fi access point wired with a network cable and sending signal to devices',
    'art.cctv': 'CCTV camera mounting on a wall and linking to a recorder',
    'art.rack': 'Network rack filling with a firewall, patch panel, switch, and tidy copper patch cables',
    'art.printer': 'Laser printer: cover opens, cartridges seat, and a test page feeds out',
    'art.phone': 'Exploded phone: back, battery, board, and screen come together and diagnostics pass',
    'art.digital': 'Ad campaign chart: result bars and a growth line',

    'how.title': 'How I work',
    'how.1t': 'You message me',
    'how.1d': 'On WhatsApp, or by opening a support ticket.',
    'how.2t': 'Free initial check',
    'how.2d': 'I diagnose the problem and explain it clearly.',
    'how.3t': 'Clear upfront price',
    'how.3d': 'You approve the full cost before any work begins.',
    'how.4t': 'Fix or install',
    'how.4d': 'Clean work, tested in front of you.',

    'why.title': 'Why work with me',
    'why.1t': 'About 6 years of field experience',
    'why.1d': 'Hands-on work with hardware, office and shop networks, and troubleshooting.',
    'why.3t': 'Transparent pricing',
    'why.3d': 'No hidden fees. You get the full quote before I touch your hardware.',
    'why.4t': 'You deal with me directly',
    'why.4d': 'I answer your message and I do the work. No middlemen, no call centre.',

    'ct.title': 'Device down? Message me now.',
    'ct.lead': 'WhatsApp is fastest. Or open a ticket and I will get back to you.',
    'ct.waUae': 'WhatsApp (UAE)',
    'ct.waEg': 'WhatsApp (Egypt)',
    'ct.ig': 'Instagram',
    'ct.fb': 'Facebook',

    'ft.loc': 'Abdulrahman Mansour, Dubai, United Arab Emirates',
    'ft.ticket': 'Open a support ticket',
    'ft.home': 'Home',

    'tk.title': 'Open a support ticket',
    'tk.lead': 'Describe the problem and leave your number. I contact you to arrange the free initial check.',
    'tk.name': 'Full name',
    'tk.phone': 'Phone or WhatsApp number',
    'tk.service': 'Service needed',
    'tk.choose': 'Choose a service',
    'tk.message': 'Describe the problem or request',
    'tk.messagePh': 'Example: the laptop overheats and shuts down ten minutes after starting.',
    'tk.time': 'Preferred time for a call or visit',
    'tk.timePh': 'Example: today after 5 pm',
    'tk.optional': '(optional)',
    'tk.send': 'Send ticket',
    'tk.sending': 'Sending ticket…',
    'tk.next': 'What happens after you send?',
    'tk.n1': 'Your ticket reaches me right away.',
    'tk.n2': 'I contact you on the number you entered to set a time.',
    'tk.n3': 'I check the problem for free and tell you the price before starting.',
    'tk.waInstead': 'Or message me on WhatsApp',

    'meta.home.title': 'Abdulrahman Mansour | IT technician in Dubai | TiTANiUM Technology',
    'meta.home.desc': 'Abdulrahman Mansour, IT technician in Dubai: laptop and PC repair, Wi-Fi and network fixes, CCTV installation, network cabling, and printer maintenance. Free initial check and a clear price before we start.',
    'meta.ticket.title': 'Open a support ticket | Abdulrahman Mansour, TiTANiUM Technology',
    'meta.ticket.desc': 'Open a support ticket with Abdulrahman Mansour in Dubai: describe the problem, leave your number, and I contact you to arrange the check.'
  };

  /* Messages that only exist in script (never in the static HTML). */
  var MSG = {
    ar: {
      'tk.sending': 'جارٍ إرسال التذكرة…',
      'err.name': 'اكتب اسمك.',
      'err.phone': 'اكتب رقم هاتف صحيحاً يمكننا الاتصال به.',
      'err.service': 'اختر نوع الخدمة.',
      'err.message': 'اكتب وصفاً قصيراً للمشكلة.',
      'ok': 'تم إرسال التذكرة. سأتواصل معك على الرقم الذي كتبته.',
      'fail': 'لم تُرسَل التذكرة. تحقق من اتصالك بالإنترنت ثم أعد المحاولة، أو ',
      'notConfigured': 'نموذج التذاكر غير مفعَّل بعد. حالياً ',
      'waLink': 'راسلني على واتساب'
    },
    en: {
      'tk.sending': 'Sending ticket…',
      'err.name': 'Enter your name.',
      'err.phone': 'Enter a valid phone number we can reach you on.',
      'err.service': 'Choose a service.',
      'err.message': 'Describe the problem in a few words.',
      'ok': 'Ticket sent. I will contact you on the number you entered.',
      'fail': 'The ticket was not sent. Check your connection and try again, or ',
      'notConfigured': 'The ticket form is not switched on yet. For now, ',
      'waLink': 'message me on WhatsApp'
    }
  };

  var AR = {};            // filled from the DOM on first run
  var current = 'ar';
  var page = document.body.getAttribute('data-page') === 'ticket' ? 'ticket' : 'home';

  function each(sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); }

  function captureArabic() {
    each('[data-i18n]', function (el) { var k = el.getAttribute('data-i18n'); if (!(k in AR)) AR[k] = el.textContent; });
    each('[data-i18n-html]', function (el) { var k = el.getAttribute('data-i18n-html'); if (!(k in AR)) AR[k] = el.innerHTML; });
    each('[data-i18n-attr]', function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':'); if (!(p[1] in AR)) AR[p[1]] = el.getAttribute(p[0]);
      });
    });
    AR['meta.' + page + '.title'] = document.title;
    var d = document.querySelector('meta[name="description"]');
    AR['meta.' + page + '.desc'] = d ? d.getAttribute('content') : '';
  }

  function t(key) {
    var dict = current === 'en' ? EN : AR;
    return key in dict ? dict[key] : (AR[key] || '');
  }
  function m(key) { return MSG[current][key]; }

  function applyLang(lang, persist) {
    current = lang === 'en' ? 'en' : 'ar';
    root.lang = current;
    root.dir = current === 'ar' ? 'rtl' : 'ltr';
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    each('[data-i18n-attr]', function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':'); el.setAttribute(p[0], t(p[1]));
      });
    });
    document.title = t('meta.' + page + '.title');
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', t('meta.' + page + '.desc'));
    each('.lang button', function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === current)); });
    if (persist) { try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* storage unavailable */ } }
    root.classList.remove('i18n-pending');
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  /* ------------------------------ motion ------------------------------ */
  function drawFrom(tl, el, at, len) {
    var L = 0;
    try { L = el.getTotalLength(); } catch (e) { L = 0; }
    if (!L || el.classList.contains('dash')) { tl.from(el, { opacity: 0, duration: len }, at); return; }
    window.gsap.set(el, { strokeDasharray: L });
    tl.from(el, { strokeDashoffset: L, duration: len, ease: 'none' }, at);
  }

  function buildAssembly(svg, trigger, start, end) {
    var gsap = window.gsap;
    var tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 1 },
      scrollTrigger: { trigger: trigger, start: start, end: end, scrub: 0.6 }
    });
    each('[data-a]', function (el) {
      var a = el.getAttribute('data-a');
      var at = parseFloat(el.getAttribute('data-o') || '0');
      var len = parseFloat(el.getAttribute('data-len') || '1');
      var origin = el.getAttribute('data-origin') || undefined;
      if (a === 'in') {
        tl.from(el, {
          x: parseFloat(el.getAttribute('data-x') || '0'),
          y: parseFloat(el.getAttribute('data-y') || '0'),
          opacity: el.hasAttribute('data-keep') ? 1 : 0, duration: len
        }, at);
      } else if (a === 'fade' || a === 'draw-g') {
        tl.from(el, { opacity: 0, duration: len }, at);
      } else if (a === 'draw') {
        drawFrom(tl, el, at, len);
      } else if (a === 'spin') {
        tl.to(el, { rotation: 540, svgOrigin: origin, duration: len, ease: 'power1.in' }, at);
      } else if (a === 'pop') {
        tl.from(el, { scale: 0, opacity: 0, svgOrigin: origin, duration: 0.5, ease: 'back.out(2)' }, at);
      } else if (a === 'grow') {
        tl.from(el, { scaleX: 0, opacity: 0, svgOrigin: origin, duration: len }, at);
      } else if (a === 'rise') {
        tl.from(el, { scaleY: 0, svgOrigin: origin, duration: 0.6 }, at);
      } else if (a === 'swing') {
        tl.to(el, { rotation: parseFloat(el.getAttribute('data-r')), svgOrigin: origin, duration: 0.8 }, at)
          .to(el, { rotation: 0, svgOrigin: origin, duration: 0.8 }, parseFloat(el.getAttribute('data-o2')));
      }
    }, svg);
    return tl;
  }

  /* card decks: stacked until they scroll into view, then dealt out once */
  function initDecks() {
    var decks = document.querySelectorAll('[data-deck]');
    if (!decks.length || root.classList.contains('reduced') || !('IntersectionObserver' in window)) return;
    root.classList.add('js-motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-dealt'); io.unobserve(e.target); } });
    }, { threshold: 0.35 });
    each('[data-deck]', function (d) { io.observe(d); });
    var st = document.querySelector('[data-statement]');
    if (st) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { st.classList.add('is-in'); io2.disconnect(); } });
      }, { threshold: 0.45 });
      io2.observe(st);
    }
  }

  function initMotion() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || root.classList.contains('reduced')) return;
    gsap.registerPlugin(ST);

    var mm = gsap.matchMedia();
    mm.add({ desk: '(min-width: 1000px)', mob: '(max-width: 999.98px)' }, function (ctx) {
      var desk = ctx.conditions.desk;

      /* hero: the exploded rack — parts appear once, then seat into the rack as you scroll */
      var art = document.querySelector('.hero-art');
      if (art) {
        gsap.from(art.querySelectorAll('.h-unit, #h-cam'), { opacity: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out', delay: 0.15 });
        each('.h-leader polyline', function (pl) {
          var L = pl.getTotalLength();
          gsap.fromTo(pl, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.9, delay: 0.7, ease: 'power2.out' });
        }, art);
        gsap.from(art.querySelectorAll('.h-leader text, .h-leader circle'), { opacity: 0, duration: 0.5, delay: 1.2 });

        var htl = gsap.timeline({
          scrollTrigger: desk
            ? { trigger: '.hero', start: 'top top', end: '+=34%', scrub: 0.6 }
            : { trigger: '.hero-art-wrap', start: 'top 42%', end: 'bottom 88%', scrub: 0.6 }
        });
        ['#h-sw', '#h-pp', '#h-fw'].forEach(function (id, i) {
          var el = art.querySelector(id);
          if (el) htl.to(el, { y: parseFloat(el.getAttribute('data-drop')), duration: 1, ease: 'power2.inOut' }, i * 0.45);
        });
        htl.to('#h-cables', { opacity: 1, duration: 0.35 }, '>-0.1');
      }

      /* services: each drawing assembles while its panel is pinned (desktop) or passes by (mobile) */
      each('.svc', function (article) {
        var svg = article.querySelector('svg.svc-art');
        if (!svg) return;
        if (desk) buildAssembly(svg, article, 'top 55%', 'bottom 118%');
        else buildAssembly(svg, article.querySelector('.svc-fig'), 'top 82%', 'center 40%');
      });
      var dg = document.querySelector('#svc-digital svg');
      if (dg) buildAssembly(dg, '#svc-digital', 'top 85%', 'center 55%');
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    window.addEventListener('load', function () { ST.refresh(); });
  }

  /* ---------------------------- ticket form ---------------------------- */
  function initTicket() {
    var form = document.getElementById('ticketForm');
    if (!form) return;
    var ok = document.getElementById('formOk');
    var err = document.getElementById('formErr');
    var btn = document.getElementById('formSubmit');
    function F(name) { return form.elements[name]; }

    try {
      var want = new URLSearchParams(location.search).get('service');
      if (want && F('service').querySelector('option[value="' + want.replace(/[^a-z]/g, '') + '"]')) F('service').value = want.replace(/[^a-z]/g, '');
    } catch (e) { /* ignore */ }

    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return v.replace(/\D/g, '').length >= 7 && /^[+\d\s().-]+$/.test(v.trim()); },
      service: function (v) { return v !== ''; },
      message: function (v) { return v.trim().length >= 5; }
    };

    function check(name) {
      var input = F(name);
      var good = rules[name](input.value);
      input.setAttribute('aria-invalid', String(!good));
      document.getElementById('e-' + name).textContent = good ? '' : m('err.' + name);
      return good;
    }
    Object.keys(rules).forEach(function (name) {
      F(name).addEventListener('blur', function () { if (F(name).value !== '') check(name); });
      F(name).addEventListener('input', function () { if (F(name).getAttribute('aria-invalid') === 'true') check(name); });
    });

    function show(el, text, withWhatsApp) {
      ok.hidden = true; err.hidden = true;
      el.textContent = text;
      if (withWhatsApp) {
        var a = document.createElement('a');
        a.href = WHATSAPP_URL; a.target = '_blank'; a.rel = 'noopener'; a.textContent = m('waLink');
        el.appendChild(a); el.appendChild(document.createTextNode('.'));
      }
      el.hidden = false; el.focus();
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (name) { if (!check(name) && !firstBad) firstBad = F(name); });
      if (firstBad) { firstBad.focus(); return; }

      if (F('botcheck').checked) { form.reset(); show(ok, m('ok')); return; }   // bot: pretend success, send nothing

      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        show(err, m('notConfigured'), true); return;
      }

      var opt = F('service').options[F('service').selectedIndex];
      var serviceEn = EN[opt.getAttribute('data-i18n')] || opt.textContent;
      var payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New support ticket: ' + serviceEn,
        from_name: 'TiTANiUM website',
        name: F('name').value.trim(),
        phone: F('phone').value.trim(),
        service: serviceEn,
        message: F('message').value.trim(),
        preferred_time: F('preferred_time').value.trim() || '-',
        page_language: current,
        botcheck: ''
      };

      btn.disabled = true; btn.textContent = m('tk.sending');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json().then(function (j) { return r.ok && j && j.success; }); })
        .then(function (sent) {
          if (sent) { form.reset(); show(ok, m('ok')); }
          else { show(err, m('fail'), true); }
        })
        .catch(function () { show(err, m('fail'), true); })
        .then(function () { btn.disabled = false; btn.textContent = t('tk.send'); });
    });
  }

  /* ------------------------------- start ------------------------------- */
  function start() {
    captureArabic();
    applyLang(window.__lang === 'en' ? 'en' : 'ar', false);
    each('.lang button', function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
    });
    initTicket();
    initDecks();
    initMotion();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
