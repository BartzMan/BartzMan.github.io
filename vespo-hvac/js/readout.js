/* Vespo HVAC readout: mode keys (services), system-check codes (useful section), service-log filters. */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Mode keys: tabs that switch the service screen (click, tap, arrow keys) */
  var tabs = $$('.rd-key[role="tab"]');
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    if (tab.scrollIntoView && window.matchMedia('(max-width: 900px)').matches) {
      tab.parentNode.scrollTo({ left: tab.offsetLeft - 12, behavior: 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t, false); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  /* 2. System check: an error code shows its plain checks, and routes to the matching mode */
  var codes = $$('.rd-code');
  codes.forEach(function (c) {
    c.addEventListener('click', function () {
      codes.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      $$('.rd-stat-panel').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== c.getAttribute('data-code'); });
    });
  });
  $$('.rd-stat-go').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = document.getElementById(b.getAttribute('data-go'));
      if (!t) return;
      select(t, false);
      document.getElementById('modes').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function () { t.focus({ preventScroll: true }); }, 700);
    });
  });

  /* 3. Service log filters */
  var grid = document.querySelector('.rd-log-grid');
  var chips = $$('.rd-filter');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      $$('.rd-shot', grid).forEach(function (s) { s.hidden = f !== 'all' && s.getAttribute('data-tag') !== f; });
      grid.classList.toggle('is-filtered', f !== 'all');
      if (grid.scrollTo) grid.scrollTo({ left: 0 });
    });
  });
})();
