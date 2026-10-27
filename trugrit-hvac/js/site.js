/* TruGrit Heating & Cooling - grit reveals, flipping service tags, gauge needle, shoreline, sanded number */
(function () {
  'use strict';
  var d = document, R = d.documentElement;
  R.classList.add('tg-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var num = el.querySelector('.tg-num'); if (!num) return;
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { num.textContent = target.toFixed(1); return; }
    var t0 = null, dur = 2000;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      num.textContent = (target * e).toFixed(1);
      if (p < 1) requestAnimationFrame(step);
    }
    num.textContent = '0.0';
    requestAnimationFrame(step);
  }
  function fire(el) {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el);
  }

  /* one-shot reveals: fire once an element's top crosses 88% of the viewport (or has been scrolled past) */
  var pending = [].slice.call(d.querySelectorAll('[data-tg]')), ticking = false;
  function sweep() {
    ticking = false;
    var line = window.innerHeight * 0.88;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < line) { fire(el); return false; }
      return true;
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } prog(); }
  var bar = d.querySelector('.tg-gritline span');
  function prog() {
    if (!bar) return;
    var h = R.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
  }
  if (reduce) { pending.forEach(fire); pending = []; }
  sweep(); prog();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', sweep);

  /* drawer */
  var btn = d.querySelector('.tg-menu'), drawer = d.getElementById('tg-drawer');
  function setDrawer(open) {
    drawer.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn && drawer) {
    btn.addEventListener('click', function () { setDrawer(btn.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); btn.focus(); } });
  }

  /* service tags flip on tap / click / keyboard */
  [].slice.call(d.querySelectorAll('.tg-tag')).forEach(function (t) {
    t.addEventListener('click', function () {
      t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  var form = d.getElementById('tg-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
