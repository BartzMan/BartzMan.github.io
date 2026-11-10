(function () {
  'use strict';
  var SW = [
    ['Weathered Wood', '#7d6a55', 'Warm brown tones sit comfortably with red and tan brick.'],
    ['Charcoal', '#36383d', 'Strong contrast against light trim and pale brick. Dark roofs hold more heat in summer sun.'],
    ['Pewter Grey', '#8a8f96', 'A mid grey that works with warm and cool brick alike.'],
    ['Desert Tan', '#c0a578', 'A lighter shade reflects more sun and softens a brick-heavy front.'],
    ['Slate', '#566478', 'A cool blue-grey that flatters cream trim and stone.']
  ];
  var BR = [['Red brick', '#9b4a38'], ['Tan brick', '#b59470'], ['Brown brick', '#6e4a3c']];
  var elev = document.getElementById('elev');
  var tag = document.getElementById('elev-tag');
  var note = document.getElementById('elev-note');
  var sw = 0, br = 0;

  function paint() {
    if (!elev) return;
    elev.style.setProperty('--roof', SW[sw][1]);
    elev.style.setProperty('--brick', BR[br][1]);
    tag.textContent = 'Sample 0' + (sw + 1) + ' · ' + SW[sw][0] + ' · ' + BR[br][0];
    note.textContent = SW[sw][2];
    document.querySelectorAll('.sb-swatches [data-sw]').forEach(function (b) {
      b.setAttribute('aria-checked', String(+b.dataset.sw === sw));
    });
    document.querySelectorAll('.sb-bricks [data-br]').forEach(function (b) {
      b.setAttribute('aria-checked', String(+b.dataset.br === br));
    });
  }
  document.querySelectorAll('.sb-swatches [data-sw]').forEach(function (b) {
    b.addEventListener('click', function () { sw = +b.dataset.sw; paint(); });
  });
  document.querySelectorAll('.sb-bricks [data-br]').forEach(function (b) {
    b.addEventListener('click', function () { br = +b.dataset.br; paint(); });
  });
  document.querySelectorAll('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () { sw = +a.dataset.pick; paint(); });
  });

  /* gallery filter */
  var chips = document.querySelectorAll('.sb-filter [data-f]');
  var tiles = document.querySelectorAll('.sb-st');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      var f = c.dataset.f;
      tiles.forEach(function (t) { t.classList.toggle('is-off', f !== 'all' && t.dataset.sw !== f); });
      var g = document.getElementById('street-grid'); if (g) g.scrollLeft = 0;
    });
  });

  /* useful tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sb-look-tabs [role="tab"]'));
  function show(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show((i + tabs.length - 1) % tabs.length, true); }
    });
  });
})();
