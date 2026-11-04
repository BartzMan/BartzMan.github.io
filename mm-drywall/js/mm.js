/* M&M Drywall: stage tabs, coat-by-coat seam, read-your-wall picker */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Stage tabs (services) */
  var tabs = $$('.mm-tablist [role=tab]');
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    if (window.matchMedia('(max-width: 900px)').matches && tab.scrollIntoView) {
      tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  /* 2. Coat by coat: the seam cross-section builds as the steps scroll past, or on tap */
  var view = document.querySelector('.mm-section-view');
  var num = document.querySelector('[data-coat-num]');
  var steps = $$('.mm-coat-btn');
  function coat(n) {
    if (!view) return;
    view.setAttribute('data-coat', n);
    if (num) num.textContent = n;
    steps.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-step') === String(n) ? 'true' : 'false'); });
  }
  steps.forEach(function (b) { b.addEventListener('click', function () { coat(+b.getAttribute('data-step')); }); });
  if ('IntersectionObserver' in window && steps.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) coat(+e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (b) { io.observe(b); });
  }

  /* 3. Read your wall: tap a mark, read the card, jump to the stage that fixes it */
  var marks = $$('.mm-mark-btn');
  var cards = $$('[data-mark-card]');
  function mark(id) {
    marks.forEach(function (m) { m.setAttribute('aria-pressed', m.getAttribute('data-mark') === id ? 'true' : 'false'); });
    cards.forEach(function (c) { c.hidden = c.getAttribute('data-mark-card') !== id; });
  }
  marks.forEach(function (m) { m.addEventListener('click', function () { mark(m.getAttribute('data-mark')); }); });
  $$('.mm-route').forEach(function (r) {
    r.addEventListener('click', function () {
      var t = document.getElementById(r.getAttribute('data-route'));
      var sec = document.getElementById('stages');
      if (t) select(t);
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (t) setTimeout(function () { t.focus({ preventScroll: true }); }, 600);
    });
  });
})();
