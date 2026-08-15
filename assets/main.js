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
});
