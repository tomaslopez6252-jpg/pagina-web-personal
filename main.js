// AGENCIA FLOW — shared behavior

document.addEventListener('DOMContentLoaded', () => {
  /* ---- custom cursor (desktop pointer only) ---- */
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hasFinePointer) {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (cursor && ring) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      });
      const loop = () => {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
        requestAnimationFrame(loop);
      };
      loop();
      document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('chover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('chover'));
      });
    }
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-container')?.querySelectorAll('.faq-item.open').forEach((el) => {
        if (el !== item) el.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---- animated counters (data-count targets) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.count.includes('.') ? 1 : 0;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (decimals ? val.toFixed(1) : Math.round(val)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => countObs.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
  }

  /* ---- progress bars (why-section) ---- */
  const bars = document.querySelectorAll('.progress-track');
  if ('IntersectionObserver' in window && bars.length) {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('filled');
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach((el) => barObs.observe(el));
  } else {
    bars.forEach((el) => el.classList.add('filled'));
  }

  /* ---- hero visual subtle parallax on pointer move (desktop) ---- */
  const heroVisual = document.querySelector('.hero-v2-visual');
  if (heroVisual && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const frame = heroVisual.querySelector('.hero-v2-frame img');
    heroVisual.addEventListener('mousemove', (e) => {
      const r = heroVisual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (frame) frame.style.transform = `scale(1.08) translate(${px * -14}px, ${py * -14}px)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      if (frame) frame.style.transform = '';
    });
  }
});
