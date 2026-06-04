// MERIDIANO — shared interactions

// Suppress benign ResizeObserver browser noise (Chrome quirk, not a real bug)
(function suppressROW() {
  const ignore = (msg) => typeof msg === 'string' && msg.includes('ResizeObserver loop');
  window.addEventListener('error', (e) => {
    if (ignore(e.message)) { e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);
  const origError = console.error;
  console.error = function (...args) {
    if (args.length && ignore(args[0])) return;
    return origError.apply(console, args);
  };
  // Patch ResizeObserver to swallow the loop notification itself
  if (typeof ResizeObserver !== 'undefined') {
    const RO = ResizeObserver;
    window.ResizeObserver = class extends RO {
      constructor(cb) {
        super((entries, observer) => {
          requestAnimationFrame(() => {
            try { cb(entries, observer); } catch (e) {}
          });
        });
      }
    };
  }
})();

(function () {
  // ---- Sticky header tint on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Reveal on scroll
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- FAQ (uses <details> behavior; we just toggle class for animation)
  document.querySelectorAll('.faq-row').forEach((row) => {
    const trigger = row.querySelector('.faq-trigger');
    const body = row.querySelector('.faq-body');
    if (!trigger || !body) return;

    // Hide initially unless open
    body.style.maxHeight = row.open ? body.scrollHeight + 'px' : '0px';
    body.style.overflow = 'hidden';
    body.style.transition = 'max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';
    body.style.opacity = row.open ? '1' : '0';

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const wasOpen = row.hasAttribute('open');
      if (wasOpen) {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
          body.style.maxHeight = '0px';
          body.style.opacity = '0';
        });
        setTimeout(() => row.removeAttribute('open'), 500);
      } else {
        row.setAttribute('open', '');
        body.style.maxHeight = body.scrollHeight + 'px';
        body.style.opacity = '1';
        body.addEventListener(
          'transitionend',
          () => {
            if (row.hasAttribute('open')) body.style.maxHeight = 'none';
          },
          { once: true }
        );
      }
    });
  });

  // ---- Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      })
    );
  }

  // ---- Cookie bar
  const bar = document.querySelector('.cookie-bar');
  if (bar) {
    try {
      if (localStorage.getItem('meridiano:cookies') === 'ok') {
        bar.classList.add('is-hidden');
      } else {
        setTimeout(() => bar.classList.add('is-visible'), 600);
      }
    } catch (e) {}
    bar.querySelectorAll('[data-cookie]').forEach((b) =>
      b.addEventListener('click', () => {
        try { localStorage.setItem('meridiano:cookies', 'ok'); } catch (e) {}
        bar.classList.add('is-hidden');
      })
    );
  }

  // ---- Form mock
  const form = document.querySelector('[data-lead-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (!data.get('privacy')) {
        const err = form.querySelector('[data-form-error]');
        if (err) {
          err.textContent = 'Devi accettare la Privacy Policy per inviare la richiesta.';
          err.style.display = 'block';
        }
        return;
      }
      const fs = form.querySelector('[data-form-stage]');
      if (fs) fs.dataset.stage = 'success';
    });
  }

  // ---- Demo login for private prototype
  const loginForm = document.querySelector('[data-demo-login]');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(loginForm);
      const username = String(data.get('username') || '').trim();
      const password = String(data.get('password') || '');
      const error = loginForm.querySelector('[data-login-error]');
      if (username === 'admin' && password === 'admin') {
        try { sessionStorage.setItem('meridiano:demo-auth', 'ok'); } catch (err) {}
        const params = new URLSearchParams(window.location.search);
        const requestedNext = params.get('next') || 'corrispondenza-cliente.html';
        const next = requestedNext === 'corrispondenza-cliente.html' ? requestedNext : 'corrispondenza-cliente.html';
        window.location.href = next;
        return;
      }
      if (error) {
        error.textContent = 'Credenziali non valide. Usa admin / admin per la demo.';
        error.classList.add('is-visible');
      }
    });
  }

  document.querySelectorAll('[data-demo-logout]').forEach((link) => {
    link.addEventListener('click', () => {
      try { sessionStorage.removeItem('meridiano:demo-auth'); } catch (err) {}
    });
  });

  // ---- Parallax for hero images (light)
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    const onPar = () => {
      const y = window.scrollY;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.15');
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    };
    window.addEventListener('scroll', onPar, { passive: true });
    onPar();
  }

  // ---- Guide TOC scroll-spy + smooth scroll
  const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
  if (tocLinks.length) {
    const targets = tocLinks
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    tocLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const y = el.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top: y, behavior: 'smooth' });
          history.replaceState(null, '', '#' + id);
        }
      });
    });

    const spy = () => {
      const pos = window.scrollY + 120;
      let active = targets[0];
      for (const t of targets) {
        if (t.offsetTop <= pos) active = t;
      }
      tocLinks.forEach((a) =>
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + (active && active.id))
      );
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // =============================================================
  //   TWEAKS PANEL — typography swap
  // =============================================================
  const FONTS = {
    'hanken':        { label: 'Hanken Grotesk',     stack: "'Hanken Grotesk', 'Inter', system-ui, sans-serif", note: 'professional · default' },
    'jakarta':       { label: 'Plus Jakarta Sans',  stack: "'Plus Jakarta Sans', system-ui, sans-serif",       note: 'corporate · trusted' },
    'sora':          { label: 'Sora',               stack: "'Sora', system-ui, sans-serif",                    note: 'geometric · sharp' },
    'geist':         { label: 'Geist',              stack: "'Geist', 'Inter', system-ui, sans-serif",          note: 'neutral · clean' },
    'space-grotesk': { label: 'Space Grotesk',      stack: "'Space Grotesk', system-ui, sans-serif",           note: 'tech · confident' },
    'manrope':       { label: 'Manrope',            stack: "'Manrope', system-ui, sans-serif",                 note: 'soft · modern' },
  };
  const ACCENTS = {
    'blue':    { label: 'Blue',   clay: '34 98 240',  clayDeep: '26 76 200',  claySoft: '188 211 255', clayWash: '237 243 255' },
    'navy':    { label: 'Navy',   clay: '30 64 140',  clayDeep: '18 44 100',  claySoft: '180 198 235', clayWash: '235 240 250' },
    'azure':   { label: 'Azure',  clay: '14 132 220', clayDeep: '10 104 180', claySoft: '186 224 250', clayWash: '232 245 254' },
    'teal':    { label: 'Teal',   clay: '13 148 160', clayDeep: '10 116 126', claySoft: '180 226 230', clayWash: '232 248 249' },
  };
  const TYPE_SCALE = {
    'tight':   { label: 'Tight',     value: '-0.035em' },
    'normal':  { label: 'Standard',  value: '-0.022em' },
    'open':    { label: 'Open',      value: '-0.01em' },
  };

  const PERSIST_KEY = 'meridiano:tweaks:v3';
  const defaults = { font: 'hanken', tracking: 'tight', accent: 'blue' };
  let state;
  try {
    state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(PERSIST_KEY) || '{}'));
    // Belt and suspenders: if the saved font isn't in our current FONTS map, fall back to default.
    if (!FONTS[state.font]) state.font = defaults.font;
  } catch (e) { state = { ...defaults }; }

  // Clear old keys (migration cleanup)
  try { localStorage.removeItem('meridiano:tweaks'); localStorage.removeItem('meridiano:tweaks:v2'); } catch (e) {}

  // Apply on load
  const apply = () => {
    const root = document.documentElement.style;
    root.setProperty('--font-display', FONTS[state.font]?.stack || FONTS.hanken.stack);
    root.setProperty('--font-accent', FONTS[state.font]?.stack || FONTS.hanken.stack);
    root.setProperty('--display-tracking', TYPE_SCALE[state.tracking]?.value || TYPE_SCALE.tight.value);
    const a = ACCENTS[state.accent] || ACCENTS.blue;
    root.setProperty('--clay', a.clay);
    root.setProperty('--clay-deep', a.clayDeep);
    root.setProperty('--clay-soft', a.claySoft);
    root.setProperty('--clay-wash', a.clayWash);
  };
  apply();

  const persist = () => {
    try { localStorage.setItem(PERSIST_KEY, JSON.stringify(state)); } catch (e) {}
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*');
    } catch (e) {}
  };

  // Build panel lazily
  let panel = null;
  const buildPanel = () => {
    if (panel) return panel;
    panel = document.createElement('aside');
    panel.className = 'tweaks-panel';
    panel.setAttribute('aria-label', 'Tweaks');
    panel.innerHTML = `
      <header class="tp-head">
        <div>
          <div class="tp-eyebrow">Tweaks</div>
          <h3 class="tp-title">Type<span class="tp-it"> &amp; </span>treatment</h3>
        </div>
        <button class="tp-close" aria-label="Close tweaks">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
        </button>
      </header>

      <section class="tp-section">
        <div class="tp-label">Display font</div>
        <div class="tp-fonts">
          ${Object.entries(FONTS).map(([key, f]) => `
            <button class="tp-font" data-font="${key}" style="font-family: ${f.stack};">
              <span class="tp-font-name">${f.label}</span>
              <span class="tp-font-note">${f.note}</span>
              <span class="tp-font-preview">Aa <em>Florida</em></span>
            </button>
          `).join('')}
        </div>
      </section>

      <section class="tp-section">
        <div class="tp-label">Accent colour</div>
        <div class="tp-swatches">
          ${Object.entries(ACCENTS).map(([key, a]) => `
            <button class="tp-swatch" data-accent="${key}" title="${a.label}">
              <span class="tp-swatch-dot" style="background: rgb(${a.clay});"></span>
              <span class="tp-swatch-name">${a.label}</span>
            </button>
          `).join('')}
        </div>
      </section>

      <section class="tp-section">
        <div class="tp-label">Headline tracking</div>
        <div class="tp-segmented">
          ${Object.entries(TYPE_SCALE).map(([key, t]) => `
            <button class="tp-seg" data-tracking="${key}">${t.label}</button>
          `).join('')}
        </div>
      </section>

      <footer class="tp-foot">
        <div class="tp-hint">Choices persist on this device.</div>
        <button class="tp-reset">Reset</button>
      </footer>
    `;
    document.body.appendChild(panel);

    const refresh = () => {
      panel.querySelectorAll('.tp-font').forEach(b => b.classList.toggle('is-active', b.dataset.font === state.font));
      panel.querySelectorAll('.tp-seg').forEach(b => b.classList.toggle('is-active', b.dataset.tracking === state.tracking));
      panel.querySelectorAll('.tp-swatch').forEach(b => b.classList.toggle('is-active', b.dataset.accent === state.accent));
    };
    refresh();

    panel.querySelectorAll('.tp-swatch').forEach((b) => {
      b.addEventListener('click', () => {
        state.accent = b.dataset.accent;
        apply(); refresh(); persist();
      });
    });

    panel.querySelectorAll('.tp-font').forEach((b) => {
      b.addEventListener('click', () => {
        state.font = b.dataset.font;
        apply(); refresh(); persist();
      });
    });
    panel.querySelectorAll('.tp-seg').forEach((b) => {
      b.addEventListener('click', () => {
        state.tracking = b.dataset.tracking;
        apply(); refresh(); persist();
      });
    });
    panel.querySelector('.tp-reset').addEventListener('click', () => {
      Object.assign(state, defaults);
      apply(); refresh(); persist();
    });
    panel.querySelector('.tp-close').addEventListener('click', () => {
      panel.classList.remove('is-open');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
    });

    return panel;
  };

  // Listen FIRST, then announce availability
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') {
      buildPanel().classList.add('is-open');
    } else if (d.type === '__deactivate_edit_mode') {
      if (panel) panel.classList.remove('is-open');
    }
  });

  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) {}
})();
