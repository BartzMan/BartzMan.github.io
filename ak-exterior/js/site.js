(function () {
  'use strict';

  // ---- phone menu (full-screen sheet) ----
  var burger = document.querySelector('.mast-burger');
  var sheet = document.getElementById('sheet');
  if (burger && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var shut = function (back) {
      sheet.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (back) burger.focus();
    };
    burger.addEventListener('click', function () {
      sheet.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var first = sheet.querySelector('.sheet-links a');
      if (first) first.focus();
    });
    closeBtn.addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { shut(true); return; }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a[href], button');
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) shut(false); });
  }

  // ---- the envelope: hotspots light up their card ----
  var hots = document.querySelectorAll('.hot');
  var cards = document.querySelectorAll('.env-card');
  var light = function (n) {
    hots.forEach(function (h) { h.classList.toggle('is-on', h.getAttribute('data-env') === n); });
    cards.forEach(function (c) { c.classList.toggle('is-on', c.id === 'env-' + n); });
  };
  var sideBySide = function () { return window.matchMedia('(min-width: 1101px)').matches; };
  hots.forEach(function (h) {
    var n = h.getAttribute('data-env');
    h.addEventListener('click', function (e) {
      light(n);
      if (sideBySide()) {
        e.preventDefault(); // the card is already beside the drawing
        var card = document.getElementById('env-' + n);
        if (card && history.replaceState) history.replaceState(null, '', '#env-' + n);
      }
    });
    h.addEventListener('mouseenter', function () { if (sideBySide()) light(n); });
    h.addEventListener('focus', function () { light(n); });
  });
  cards.forEach(function (c) {
    c.addEventListener('mouseenter', function () { light(c.id.replace('env-', '')); });
  });
  if (/^#env-[1-4]$/.test(location.hash)) light(location.hash.slice(5));
  else if (hots.length) light('1');

  // ---- "which job do I need": routes to the matching trade ----
  var pickOut = document.getElementById('pick-out');
  var tips = {
    '1': '<strong>Likely the roof.</strong> Ceiling stains, or shingles or panels that look lifted or missing from the ground, usually point up. Stay off the roof and send photos from the yard.',
    '2': '<strong>Likely the windows.</strong> Drafts, fog between the panes or a sash that will not move are the usual signs. Photos of each window, inside and out, help.',
    '3': '<strong>Likely the siding.</strong> Cracked, loose or warped boards and panels let water in behind the wall. A photo of each wall, from a few steps back, is a good start.',
    '4': '<strong>Likely masonry.</strong> Crumbling mortar, gaps between bricks or a leaning chimney are worth a look. Photos of the wall and the chimney are enough to start.'
  };
  document.querySelectorAll('.pick-b').forEach(function (b) {
    b.addEventListener('click', function () {
      var n = b.getAttribute('data-pick');
      document.querySelectorAll('.pick-b').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      light(n);
      if (pickOut) pickOut.innerHTML = tips[n];
    });
  });

  // ---- quote form: the demo note is added by js/sc-form.js ----
  var form = document.getElementById('text-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
