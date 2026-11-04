/* Acadian Tree Service: field-guide interactions (job key, field marks plate, specimen drawers) */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. the key: pairs of plain choices route to a service plate */
  var PLATES = {
    2: ['Plate II: Climbing & trimming', 'A climber cuts back the limbs that are the problem; the tree stays.'],
    3: ['Plate III: Tree removal', 'The tree comes down in pieces. Plates IV and V (stump grinding, log loading) usually follow.'],
    4: ['Plate IV: Stump grinding', 'The stump is ground down below the grass line.']
  };
  var steps = $$('.key-step'), name = document.getElementById('key-res-name'), note = document.getElementById('key-res-note'),
      link = document.getElementById('key-res-link'), path = [];
  function showStep(n, focus) {
    steps.forEach(function (s) { s.classList.toggle('is-on', s.getAttribute('data-step') === String(n)); });
    if (focus) { var b = document.querySelector('.key-step.is-on .key-opt'); if (b) b.focus({ preventScroll: true }); }
  }
  if (steps.length) {
    showStep(1);
    $$('.key-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.querySelector('.key-c').textContent;
        path.push(code);
        if (b.hasAttribute('data-go')) { showStep(b.getAttribute('data-go'), true); name.textContent = 'Keep going'; note.textContent = 'So far: ' + path.join(' then '); return; }
        var p = PLATES[b.getAttribute('data-result')];
        name.textContent = p[0]; note.textContent = p[1] + ' (Your path: ' + path.join(' then ') + '.)';
        link.setAttribute('href', '#plate-' + b.getAttribute('data-result'));
        var plate = document.getElementById('plate-' + b.getAttribute('data-result'));
        $$('.plate-svc').forEach(function (x) { x.classList.remove('is-keyed'); });
        if (plate) plate.classList.add('is-keyed');
      });
    });
    var restart = document.querySelector('.key-restart');
    if (restart) restart.addEventListener('click', function () {
      path = []; showStep(1, true); name.textContent = 'Pick a line above'; note.textContent = 'The answer appears here, with a link to that plate.'; link.setAttribute('href', '#plates');
    });
  }

  /* 2. field marks: tap a number on the plate */
  var pins = $$('.fm-pin'), notes = $$('.fm-note');
  function mark(i) {
    pins.forEach(function (p) { p.setAttribute('aria-pressed', p.getAttribute('data-mark') === String(i) ? 'true' : 'false'); });
    notes.forEach(function (n) { n.classList.toggle('is-on', n.getAttribute('data-mark') === String(i)); });
  }
  pins.forEach(function (p) { p.addEventListener('click', function () { mark(p.getAttribute('data-mark')); }); });
  if (pins.length) mark(0);

  /* 3. specimen drawers */
  var grid = document.querySelector('.spec-grid');
  $$('.drawer-tabs button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-show');
      all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.sheet', grid).forEach(function (s) { s.classList.toggle('is-out', k !== 'all' && s.getAttribute('data-kind') !== k); });
      grid.classList.toggle('is-filtered', k !== 'all');
      if (grid.scrollLeft) grid.scrollLeft = 0;
    });
  });
})();
