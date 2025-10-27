/* /assets/js/hero-carousel.js  (non-module, auto-init) */
(function () {
  function initHeroCarousel(root) {
    const viewport = root.querySelector('.hc-viewport') || root;
    const track = root.querySelector('.hc-track') || root;
    const realSlides = Array.from(track.querySelectorAll('.hc-frame'));
    if (realSlides.length <= 1) return;

    // ---- build clones for seamless loop ----
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone  = realSlides[realSlides.length - 1].cloneNode(true);
    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone  = 'last';
    track.insertBefore(lastClone, realSlides[0]);
    track.appendChild(firstClone);

    const slides = Array.from(track.querySelectorAll('.hc-frame')); // now includes clones

    let page = 1;                       // start on first REAL slide
    let w = viewport.clientWidth;       // width of one "page"
    let hovering = false;
    let timer = null;

    const setX = (x, withTransition) => {
      track.style.transition = withTransition ? 'transform .5s ease' : 'none';
      track.style.transform = `translate3d(${-x}px,0,0)`;
    };
    const indexToX = (idx) => idx * w;

    const snapTo = (idx) => {           // animated move
      page = idx;
      setX(indexToX(page), true);
    };

    const jumpTo = (idx) => {           // instant jump (no animation)
      page = idx;
      setX(indexToX(page), false);
      // re-enable transition on next frame to avoid flicker
      requestAnimationFrame(() => { track.style.transition = 'transform .5s ease'; });
    };

    // initial placement (no animation)
    jumpTo(1);

    // wrap seamlessly after crossing a clone
    track.addEventListener('transitionend', () => {
      const lastRealIdx = slides.length - 2; // because last element is firstClone
      if (page === slides.length - 1) {
        // landed on firstClone → jump to real first
        jumpTo(1);
      } else if (page === 0) {
        // landed on lastClone → jump to real last
        jumpTo(lastRealIdx);
      }
    });

    // autoplay with hover pause
    const start = (ms = 4000) => {
      stop();
      timer = setInterval(() => { if (!hovering) snapTo(page + 1); }, ms);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    root.addEventListener('mouseenter', () => { hovering = true; });
    root.addEventListener('mouseleave', () => { hovering = false; });

    // keep slide aligned on resize (recompute width)
    const onResize = () => {
      w = viewport.clientWidth;
      jumpTo(page);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // hook up optional arrows if present
    root.querySelector('[data-hc-next]')?.addEventListener('click', () => snapTo(page + 1));
    root.querySelector('[data-hc-prev]')?.addEventListener('click', () => snapTo(page - 1));

    // go!
    start(4000);

    // expose a tiny API if you want to call it later
    root._hc = { next: () => snapTo(page + 1), prev: () => snapTo(page - 1), start, stop, destroy() {
      stop();
      window.removeEventListener('resize', onResize);
    }};
  }

  function autoInit() {
    document.querySelectorAll('.hero-carousel').forEach(initHeroCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Optional: expose for manual init if you ever need it
  window.initHeroCarousel = initHeroCarousel;
})();
