// Animate on Scroll (AOS) — minimal, fast, no deps
// Usage: add class "aos" to any element, optional data-aos-delay="200"
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.aos');

  // If user prefers reduced motion: just show everything
  if (prefersReduced) {
    els.forEach(el => el.classList.add('aos-ready', 'aos-visible'));
    return;
  }

  // IntersectionObserver to reveal elements
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // Optional stagger via data attribute (ms)
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          el.classList.add('aos-visible');
          obs.unobserve(el); // reveal once
        }, Math.max(0, delay));
      }
    });
  }, {
    threshold: 0.2,        // fire when 20% of element is visible
    rootMargin: '0px 0px -5% 0px' // slight pre-trigger near bottom
  });

  // Prime elements + observe
  els.forEach((el, i) => {
    el.classList.add('aos-ready'); // starting state (opacity 0, translate)
    // If you want auto-stagger without attributes, uncomment:
    // el.style.transitionDelay = `${i * 80}ms`;
    observer.observe(el);
  });
})();
