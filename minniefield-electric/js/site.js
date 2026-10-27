(function () {
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lights on: each section switches on once, the first time it is reached.
  var secs = [].slice.call(d.querySelectorAll('[data-lit]'));
  function on(s) { s.classList.add('on'); }
  if (reduce || !('IntersectionObserver' in w)) {
    secs.forEach(on);
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { on(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -28% 0px' });
    secs.forEach(function (s) {
      if (s.id === 'top') { w.setTimeout(function () { on(s); }, 420); }
      else { io.observe(s); }
    });
  }

  // The hero switch really works.
  var hero = d.getElementById('top'), big = d.querySelector('.bigswitch');
  if (hero && big) {
    var sync = function () { big.setAttribute('aria-pressed', hero.classList.contains('on') ? 'true' : 'false'); };
    w.setTimeout(sync, 500);
    big.addEventListener('click', function () { hero.classList.toggle('on'); sync(); });
  }

  // Header background after scrolling.
  var hdr = d.getElementById('hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', w.scrollY > 30); };
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Full-screen menu.
  var menu = d.getElementById('menu'), btn = d.querySelector('.menu-btn'), close = d.querySelector('.menu__close');
  function setMenu(open) {
    if (!menu) return;
    if (open) { menu.hidden = false; w.requestAnimationFrame(function () { menu.classList.add('open'); }); close.focus(); }
    else { menu.classList.remove('open'); w.setTimeout(function () { menu.hidden = true; }, 300); btn.focus(); }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn) btn.addEventListener('click', function () { setMenu(true); });
  if (close) close.addEventListener('click', function () { setMenu(false); });
  if (menu) {
    [].forEach.call(menu.querySelectorAll('nav a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  var f = d.getElementById('quote-form');
  if (f) f.addEventListener('submit', function (e) { e.preventDefault(); });

  var yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
