/* Macario: lid tabs (services) and the sheen picker */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  var tabs = $$('.mc-lidrow [role=tab]');
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    var row = tab.parentNode;
    if (row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0];
      if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  var rooms = $$('.mc-room');
  rooms.forEach(function (r) {
    r.addEventListener('click', function () {
      var k = r.getAttribute('data-room'), s = r.getAttribute('data-sheen');
      rooms.forEach(function (x) { x.setAttribute('aria-pressed', x === r ? 'true' : 'false'); });
      $$('[data-room-note]').forEach(function (n) { n.hidden = n.getAttribute('data-room-note') !== k; });
      $$('[data-sheen-card]').forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-sheen-card') === s); });
    });
  });
})();
