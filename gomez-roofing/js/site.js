(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* chalk line snaps once per section as it comes into view */
  var snaps = $$('[data-snap]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('snapped'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -30% 0px' });
    snaps.forEach(function (s) { io.observe(s); });
  } else {
    snaps.forEach(function (s) { s.classList.add('snapped'); });
  }

  /* penetration clinic */
  var hots = $$('.hot');
  hots.forEach(function (h) {
    h.addEventListener('click', function () {
      hots.forEach(function (x) { x.classList.toggle('is-on', x === h); x.setAttribute('aria-pressed', x === h ? 'true' : 'false'); });
      $$('.cp').forEach(function (p) { p.hidden = p.id !== 'cp-' + h.getAttribute('data-hot'); });
    });
    h.setAttribute('aria-pressed', h.classList.contains('is-on') ? 'true' : 'false');
  });

  /* repair / replace tabs */
  var tabs = $$('.fix-tab');
  function pick(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(n); n.focus();
      }
    });
  });

  /* leak check */
  var leaks = $$('.leak'), count = document.getElementById('leakCount');
  leaks.forEach(function (li) {
    var btn = li.querySelector('.leak-btn'), box = li.querySelector('input');
    btn.addEventListener('click', function () {
      var open = li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    box.addEventListener('change', function () {
      li.classList.toggle('is-done', box.checked);
      count.textContent = leaks.filter(function (l) { return l.classList.contains('is-done'); }).length;
    });
  });
})();
