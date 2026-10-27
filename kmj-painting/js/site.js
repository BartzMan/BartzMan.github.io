/* KMJ Painting Services - chip reveals, swatch tester, fan deck, palette pins, wet-paint wipe, deck progress */
(function () {
  'use strict';
  var d = document, R = d.documentElement;
  R.classList.add('kc-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('load', function () { R.classList.add('kc-loaded'); });
  setTimeout(function () { R.classList.add('kc-loaded'); }, 400);

  function countUp(el) {
    var num = el.querySelector('.kc-num'); if (!num) return;
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { num.textContent = target.toFixed(1); return; }
    var t0 = null, dur = 1500;
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

  var pending = [].slice.call(d.querySelectorAll('[data-kc]')), ticking = false;
  var strip = [].slice.call(d.querySelectorAll('.kc-strip span'));
  var secs = [].slice.call(d.querySelectorAll('main > section'));
  function sweep() {
    ticking = false;
    var line = window.innerHeight * 0.88;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < line) { fire(el); return false; }
      return true;
    });
    /* header deck strip: one chip per section, lit once you reach it */
    secs.forEach(function (s, i) {
      if (strip[i]) strip[i].classList.toggle('is-on', s.getBoundingClientRect().top < window.innerHeight * 0.5);
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }
  if (reduce) { pending.forEach(fire); pending = []; }
  sweep();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', sweep);

  /* menu */
  var btn = d.querySelector('.kc-burger'), fan = d.getElementById('kc-fan');
  function setMenu(open) {
    fan.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (btn && fan) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    fan.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !fan.hidden) { setMenu(false); btn.focus(); } });
  }

  /* swatch tester: hold a chip up to the house */
  var house = d.querySelector('.kc-house'), now = d.querySelector('.kc-tester__now b');
  var sw = [].slice.call(d.querySelectorAll('.kc-swatch'));
  sw.forEach(function (b) {
    b.addEventListener('click', function () {
      sw.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      if (house) {
        house.style.setProperty('--house', b.getAttribute('data-color'));
        house.style.setProperty('--door', b.getAttribute('data-name') === 'Shutter Black' ? '#9f4826' : '#232529');
      }
      if (now) now.textContent = b.getAttribute('data-name');
    });
  });

  /* palettes: tap a chip, a pin drops where it was sampled */
  [].slice.call(d.querySelectorAll('.kc-pal')).forEach(function (pal) {
    var pin = pal.querySelector('.kc-pal__pin');
    var dabs = [].slice.call(pal.querySelectorAll('.kc-dab'));
    dabs.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        dabs.forEach(function (o) { o.setAttribute('aria-pressed', on && o === b ? 'true' : 'false'); });
        pin.style.setProperty('--px', b.getAttribute('data-x') + '%');
        pin.style.setProperty('--py', b.getAttribute('data-y') + '%');
        pin.style.setProperty('--pc', getComputedStyle(b).getPropertyValue('--c'));
        pin.classList.toggle('is-on', on);
      });
    });
  });

  var form = d.getElementById('kc-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
