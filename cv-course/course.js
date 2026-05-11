// Shared course behavior: scroll-spy, progress tracking, sidebar mobile toggle.

(function () {
  const PROGRESS_KEY = 'cv-course-last-module';

  // === Progress tracking on lesson pages ===
  // Pages set <body data-module="N"> via inline hint, else we infer from filename.
  function currentModule() {
    const m = document.body.dataset.module;
    if (m) return m;
    const match = location.pathname.match(/(\d{2})-/);
    return match ? match[1] : null;
  }

  const mod = currentModule();
  if (mod) {
    try { localStorage.setItem(PROGRESS_KEY, mod); } catch (e) {}
  }

  // === Scroll-spy on lesson sidebar ===
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    const links = Array.from(sidebar.querySelectorAll('a[href^="#"]'));
    const targets = links
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    if (targets.length) {
      const setActive = (id) => {
        links.forEach(a => {
          a.classList.toggle('scroll-active', a.getAttribute('href') === '#' + id);
        });
      };

      const observer = new IntersectionObserver((entries) => {
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

      targets.forEach(t => observer.observe(t));
    }
  }

  // === Mobile sidebar toggle ===
  // Inserts a "Sections ▾" button before .sidebar when narrow.
  if (sidebar && window.matchMedia('(max-width: 800px)').matches) {
    const toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.type = 'button';
    toggle.textContent = 'Sections ▾';
    toggle.setAttribute('aria-expanded', 'false');
    sidebar.parentNode.insertBefore(toggle, sidebar);
    sidebar.classList.add('collapsed');
    toggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('collapsed') === false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Sections ▴' : 'Sections ▾';
    });
  }

  // === Course-index "continue" CTA ===
  // On the course home, if there is a saved module, swap the primary button.
  const cta = document.querySelector('.hero-text .btn-primary');
  if (cta && !document.querySelector('.sidebar')) {
    let last = null;
    try { last = localStorage.getItem(PROGRESS_KEY); } catch (e) {}
    if (last && /^\d{2}$/.test(last)) {
      const cards = Array.from(document.querySelectorAll('.module-card'));
      const card = cards.find(c => c.getAttribute('href').startsWith(last + '-'));
      if (card) {
        const href = card.getAttribute('href');
        const num = parseInt(last, 10);
        cta.setAttribute('href', href);
        cta.textContent = `Continue from Module ${num} →`;
        card.classList.add('module-last');
      }
    }
  }
})();
