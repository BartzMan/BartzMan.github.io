/* SUNSET FAN DECK — concept interactions only.
   kit.js already owns: menu sheet, sticky bar, lightbox, reveals,
   nav highlight, form preview, scroll variable, year.
   This file owns: the fan deck (chip -> repaint + service panel),
   repaint-check accordions. */

(function () {
  'use strict';

  /* 1 — Fan deck: tap a chip to repaint the stucco house and
        open the service that goes with that chip. Arrow-key roving. */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.deck-chip'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.deck-panel'));
  var walls = document.querySelector('.house-walls');
  var sun = document.querySelector('.house-sun');
  var chipName = document.querySelector('[data-house-chip]');

  var CHIP_COLORS = ['#f2e7cf', '#e8c99a', '#d88a62', '#b25a3a', '#3a3f5e'];
  var CHIP_NAMES = ['NOON STUCCO', 'SAND GLAZE', 'MESA ROSE', 'COPPER ROOF', 'FRANKLIN DUSK'];

  function selectChip(tab, focus) {
    var i = chips.indexOf(tab);
    if (i < 0) return;
    chips.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-open', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (p) {
      var show = p.id === tab.getAttribute('data-chip').replace('chip', 'chipPanel');
      p.classList.toggle('is-open', show);
      p.hidden = !show;
    });
    if (walls) walls.setAttribute('fill', CHIP_COLORS[i]);
    if (sun) sun.setAttribute('fill', CHIP_COLORS[Math.max(0, i - 1)]);
    if (chipName) chipName.textContent = CHIP_NAMES[i];
    if (focus) tab.focus();
  }

  chips.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectChip(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = chips[(i + 1) % chips.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = chips[(i - 1 + chips.length) % chips.length];
      if (e.key === 'Home') next = chips[0];
      if (e.key === 'End') next = chips[chips.length - 1];
      if (next) { e.preventDefault(); selectChip(next, true); }
    });
  });
  if (chips.length) chips.forEach(function (t) { t.tabIndex = t.classList.contains('is-open') ? 0 : -1; });

  /* 2 — Repaint checks: tap to open. */
  document.querySelectorAll('[data-check]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.repaint-check');
      var body = wrap.querySelector('.repaint-body');
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.hidden = !open;
      body.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });
})();
