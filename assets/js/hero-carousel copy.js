// hero-carousel — tiny slider (no deps)
(function () {
  const carousels = document.querySelectorAll('.hero-carousel');
  carousels.forEach(init);

  function init(root) {
    const frame = root.querySelector('.hc-viewport') || root;
    const track = root.querySelector('.hc-track');
    const slides = root.querySelectorAll('.hc-frame');
    if (!track || slides.length === 0) return;

    // function perView() { return 1; }

    function perView() {
        const wRoot = frame.getBoundingClientRect().width;
        const wSlide = slides[0].getBoundingClientRect().width || 1;
        return Math.max(1, Math.floor(wRoot / wSlide));
    }

    function pages() { return Math.max(1, Math.ceil(slides.length / perView())); }

    let page = 0, timer = null, hovering = false;

    function go(nextPage) {
        const pgs = pages();
        page = ((nextPage % pgs) + pgs) % pgs;  // wrap page index
        const w = frame.getBoundingClientRect().width; // visible frame width
        track.style.transform = `translateX(${-page * w}px)`;
    }

    function start() {
      stop();
      timer = setInterval(() => { if (!hovering) go(page + 1); }, 4000);
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    root.addEventListener('mouseenter', () => { hovering = true; });
    root.addEventListener('mouseleave', () => { hovering = false; });
    // keep slides aligned if the page resizes
    window.addEventListener('resize', () => {
        const w = frame.getBoundingClientRect().width;
        track.style.transform = `translateX(${-page * w}px)`;
    }, { passive: true });

    // start
    go(0);
    start();

    // expose for console debugging if needed
    root._hc = { next: () => go(page + 1), prev: () => go(page - 1), goto: go, stop, start };
  }
})();
