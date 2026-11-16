(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* The plat: tap a flagged lot (or a chip) to see that job */
  var plat = $('[data-plat]');
  if (plat) {
    var panels = $$('.pp');
    var chips = $$('.chip', plat);
    var lots = $$('.lot-hot', plat);
    var set = function (kind) {
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== kind; });
      chips.forEach(function (c) { c.setAttribute('aria-selected', c.getAttribute('data-kind') === kind ? 'true' : 'false'); });
      lots.forEach(function (l) { l.classList.toggle('on', l.getAttribute('data-kind') === kind); });
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { set(c.getAttribute('data-kind')); }); });
    lots.forEach(function (l) {
      l.addEventListener('click', function () { set(l.getAttribute('data-kind')); });
      l.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(l.getAttribute('data-kind')); } });
    });
    set('new');
  }

  /* New build / existing home switch */
  var sw = $('[data-switch]');
  if (sw) {
    var tabs = $$('.sw-tab', sw), pans = $$('[data-swp]', sw);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-sw');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        pans.forEach(function (p) { p.hidden = p.getAttribute('data-swp') !== k; });
      });
    });
  }

  /* Punch list: flags, two lists */
  var ctabs = $$('.ctab'), lists = $$('[data-punch]'), count = $('[data-count]');
  var tally = function () {
    var cur = lists.filter(function (l) { return !l.hidden; })[0];
    if (cur && count) count.textContent = $$('button[aria-pressed="true"]', cur).length;
  };
  ctabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-list');
      ctabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      lists.forEach(function (l) { l.hidden = l.getAttribute('data-punch') !== k; });
      tally();
    });
  });
  lists.forEach(function (l) {
    $$('button', l).forEach(function (b) {
      b.addEventListener('click', function () {
        b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        tally();
      });
    });
  });
})();
