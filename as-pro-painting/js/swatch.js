/* A&S swatch wall: roll-on reveals, before/after roller, sheen picker, gallery filter (kit.js does menu, dock, lightbox, form). */
(function () {
  'use strict';
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rolls = document.querySelectorAll('[data-roll], .ap-stroke');
  if (!still && 'IntersectionObserver' in window) {
    root.classList.add('ap-js');
    /* a target clipped to zero area never intersects, so watch its unclipped parent and roll the child */
    var map = new Map();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        (map.get(e.target) || []).forEach(function (el) { el.classList.add('is-rolled'); });
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    rolls.forEach(function (el) {
      var t = el.hasAttribute('data-roll') ? el.parentElement : el;
      if (!map.has(t)) { map.set(t, []); io.observe(t); }
      map.get(t).push(el);
    });
  }

  /* before / after roller */
  var wipe = document.querySelector('.ap-wipe');
  if (wipe) {
    var range = wipe.querySelector('.ap-wipe-range');
    var set = function (v) { v = Math.max(0, Math.min(100, v)); wipe.style.setProperty('--pos', v + '%'); range.value = Math.round(v); };
    range.addEventListener('input', function () { set(+range.value); });
    var drag = false;
    var at = function (e) { var r = wipe.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    wipe.addEventListener('pointerdown', function (e) { drag = true; at(e); });
    window.addEventListener('pointermove', function (e) { if (drag) at(e); });
    window.addEventListener('pointerup', function () { drag = false; });
  }

  /* which sheen where */
  var sheens = [
    ['Ceilings', 'Flat', 'Flat hides bumps and seams overhead, and nobody scrubs a ceiling.', 0, '#d9c7b0'],
    ['Living rooms & bedrooms', 'Eggshell', 'A soft low sheen: it hides small flaws but wipes clean better than flat.', 1, '#f2a679'],
    ['Kitchens & baths', 'Satin', 'Stands up to steam, splashes and regular wiping.', 2, '#9fb27e'],
    ['Trim, doors & cabinets', 'Semi-gloss', 'Hard and easy to clean where hands, shoes and bumps land most.', 3, '#e7b04a'],
    ['Exterior siding', 'Satin', 'Sheds dirt and rain on siding. Always use paint made for outdoors.', 2, '#a9472f']
  ];
  var card = document.getElementById('sheen-card');
  var rooms = document.querySelectorAll('.ap-room');
  function pick(i) {
    var s = sheens[i];
    card.setAttribute('data-gloss', s[3]);
    card.querySelector('.ap-sheen-chip').style.background = s[4];
    card.querySelector('.ap-sheen-room').textContent = s[0];
    card.querySelector('.ap-sheen-name').textContent = s[1];
    card.querySelector('.ap-sheen-why').textContent = s[2];
    rooms.forEach(function (r, j) { r.setAttribute('aria-selected', j === i ? 'true' : 'false'); r.tabIndex = j === i ? 0 : -1; });
  }
  rooms.forEach(function (r, i) {
    r.addEventListener('click', function () { pick(i); });
    r.addEventListener('keydown', function (e) {
      var j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % rooms.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + rooms.length) % rooms.length;
      if (j > -1) { e.preventDefault(); rooms[j].focus(); pick(j); }
    });
  });
  if (card) pick(0);

  /* gallery filter */
  var gal = document.querySelector('.ap-gallery');
  var fs = document.querySelectorAll('.ap-filter');
  fs.forEach(function (f) {
    f.addEventListener('click', function () {
      var c = f.getAttribute('data-filter');
      fs.forEach(function (o) { o.setAttribute('aria-pressed', o === f ? 'true' : 'false'); });
      gal.querySelectorAll('.ap-gi').forEach(function (g) { g.hidden = c !== 'all' && g.getAttribute('data-cat') !== c; });
      gal.classList.toggle('ap-filtered', c !== 'all');
    });
  });
})();
