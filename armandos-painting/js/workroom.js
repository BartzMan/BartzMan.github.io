/* Armando's workroom: painting stages, prep checklist, gallery filter (kit.js does menu, dock, lightbox, reveals, form). */
(function () {
  'use strict';

  /* 1. How a room gets painted: tape tabs drive the wall elevation */
  var stages = [
    ['Protect', 'Floors get drop cloths, furniture moves to the middle and is covered, and trim is taped wherever a brush can\'t stay clean.'],
    ['Patch', 'Nail holes, dings and cracks are filled, sanded smooth and spot-primed, so they don\'t show through the new colour.'],
    ['Cut in', 'A brush paints a clean band along the ceiling, the corners and the trim: the crisp lines a roller can\'t reach.'],
    ['Roll', 'Rollers fill the open wall in even passes, usually two coats, so the colour reads the same in every light.'],
    ['Pull the tape', 'Tape comes off while the last coat is still fresh enough to leave a sharp edge. Then the room is put back together.']
  ];
  var tabs = document.querySelectorAll('.wr-step');
  var svg = document.querySelector('.wr-elev-svg');
  var panel = document.getElementById('room-panel');
  function setStage(n) {
    if (!svg || !panel) return;
    svg.querySelectorAll('.wr-l').forEach(function (g) {
      var a = +g.getAttribute('data-from'), b = +g.getAttribute('data-to');
      g.classList.toggle('on', n >= a && n <= b);
    });
    tabs.forEach(function (t) {
      var on = +t.getAttribute('data-stage') === n;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    var s = stages[n - 1];
    panel.innerHTML = '<p class="wr-room-stage">Stage ' + n + ' of 5</p><h3>' + s[0] + '</h3><p>' + s[1] + '</p>';
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { setStage(+t.getAttribute('data-stage')); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % tabs.length;
      if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
      if (j > -1) { e.preventDefault(); tabs[j].focus(); setStage(j + 1); }
    });
  });
  setStage(1);

  /* 2. Before painting day: tap to tape each item */
  var checks = document.querySelectorAll('.wr-check');
  var bar = document.querySelector('.wr-roll-bar i');
  var txt = document.querySelector('.wr-roll-txt');
  function count() {
    var n = 0;
    checks.forEach(function (c) { if (c.getAttribute('aria-pressed') === 'true') n++; });
    if (bar) bar.style.width = (n / checks.length * 100) + '%';
    if (txt) txt.textContent = n === checks.length ? 'All 5 ready. Painting day.' : n + ' of 5 ready';
  }
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      count();
    });
  });

  /* 3. Taped-up wall: filter tabs */
  var pinup = document.querySelector('.wr-pinup');
  var filters = document.querySelectorAll('.wr-filter');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.getAttribute('data-filter');
      filters.forEach(function (o) { o.setAttribute('aria-pressed', o === f ? 'true' : 'false'); });
      pinup.querySelectorAll('[data-cat]').forEach(function (p) {
        var c = p.getAttribute('data-cat');
        p.hidden = cat === 'all' ? false : c !== cat;
      });
      pinup.classList.toggle('wr-filtered', cat !== 'all');
    });
  });
})();
