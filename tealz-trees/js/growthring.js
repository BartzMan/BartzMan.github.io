/* Tealz Trees: growth-ring interactions (services ring picker, year-ring yard check, gallery filter) */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* tabs that are driven both by buttons and by SVG shapes */
  function tabset(opts) {
    var tabs = $$(opts.tabs), panels = $$(opts.panels), shapes = $$(opts.shapes), extra = opts.extra || [];
    if (!tabs.length) return null;
    function pick(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
      shapes.forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute(opts.attr) === i); });
      extra.forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute(opts.attr) === i); });
      if (opts.onPick) opts.onPick(i, tabs[i]);
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { pick(k); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (d) { e.preventDefault(); pick((k + d + n) % n, true); }
        if (e.key === 'Home') { e.preventDefault(); pick(0, true); }
        if (e.key === 'End') { e.preventDefault(); pick(n - 1, true); }
      });
    });
    shapes.forEach(function (s) {
      s.addEventListener('click', function () { pick(+s.getAttribute(opts.attr)); });
    });
    var start = 0;
    tabs.forEach(function (t, k) { if (t.getAttribute('aria-selected') === 'true') start = k; });
    pick(start);
    return pick;
  }

  /* 1. services: tap a ring of the cut trunk */
  var pickRing = tabset({ tabs: '.rp-tabs [role=tab]', panels: '.rp-panel', shapes: '.rp-band', extra: $$('.rp-num[data-ring]'), attr: 'data-ring' });
  $$('[data-goto-ring]').forEach(function (a) {
    a.addEventListener('click', function () { if (pickRing) pickRing(+a.getAttribute('data-goto-ring')); });
  });

  /* 2. useful: one ring is one year, tap a season */
  var label = document.getElementById('yr-label');
  tabset({ tabs: '.yr-tabs [role=tab]', panels: '.yr-panel', shapes: '.yr-seg', attr: 'data-season',
    onPick: function (i, t) { if (label && t) label.textContent = t.textContent; } });

  /* 3. gallery filter chips */
  var grid = document.querySelector('.work-grid');
  $$('.work-filter button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.wk', grid).forEach(function (w) {
        var tags = (w.getAttribute('data-tags') || '').split(' ');
        w.classList.toggle('is-out', f !== 'all' && tags.indexOf(f) < 0);
      });
      grid.classList.toggle('is-filtered', f !== 'all');
      if (grid.scrollLeft) grid.scrollLeft = 0;
    });
  });
})();
