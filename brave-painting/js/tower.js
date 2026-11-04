/* Lifeguard tower: concept interactions (tower tabs, paint-day flags, log filters) */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. services: a row of towers works as tabs; the big board shows the work */
  var towers = $$('.tower');
  function pick(t, focus) {
    towers.forEach(function (o) {
      var on = o === t;
      o.setAttribute('aria-selected', on ? 'true' : 'false');
      o.tabIndex = on ? 0 : -1;
      var p = document.getElementById(o.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) t.focus();
  }
  towers.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var n = null, k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = towers[(i + 1) % towers.length];
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = towers[(i - 1 + towers.length) % towers.length];
      if (k === 'Home') n = towers[0];
      if (k === 'End') n = towers[towers.length - 1];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = document.querySelector('form[data-kit-form] textarea');
      if (d && !d.value) d.value = 'About: ' + a.getAttribute('data-service') + '. ';
    });
  });

  /* 2. paint-day flags: raise a flag, the board shows that day's advice */
  var flags = $$('.fp');
  flags.forEach(function (f) {
    f.addEventListener('click', function () {
      flags.forEach(function (o) { o.setAttribute('aria-pressed', o === f ? 'true' : 'false'); });
      $$('.chalk-card').forEach(function (c) { c.hidden = c.getAttribute('data-card') !== f.getAttribute('data-flag'); });
    });
  });

  /* 3. tower log: filter chips */
  var chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      $$('.lg').forEach(function (g) { g.classList.toggle('is-off', f !== 'all' && g.getAttribute('data-c') !== f); });
    });
  });
})();
