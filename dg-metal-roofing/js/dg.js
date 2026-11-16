(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- coil rack ---- */
  var stage = $('[data-rack-stage]');
  if (stage) {
    var img = $('.dg-stage-img', stage), note = $('.dg-note', stage);
    var D = {
      copper: { c: '#B8693A', dark: 0, k: 'Copper', p: 'A warm, classic look that sits well with stone, brick and green landscaping. A good match for older and country-style homes.', src: 'images/copper.jpg', alt: 'A copper-coloured standing seam roof with a dormer against green fields' },
      red:    { c: '#C2432D', dark: 1, k: 'Signal red', p: 'Bold and warm. A deep red shows off the shape of a roof, and suits tile-style profiles. Dark colours take on more heat than light ones.', src: 'images/hero.jpg', alt: 'Drone view of a large home with a red-orange metal tile-profile roof' },
      galv:   { c: '#BFC6CC', dark: 0, k: 'Galvalume', p: 'The silver-grey of bare coated steel. A clean, modern look that reflects sun, and a common choice for ranch homes and outbuildings.', src: 'images/ranch.jpg', alt: 'A white ranch house with a light metal roof and a green lawn' },
      white:  { c: '#F6F7F5', dark: 0, k: 'Salt white', p: 'A bright light colour. Light roofs reflect more sun, which counts on hot coastal afternoons, and they look crisp against a blue sky.', src: 'images/gable.jpg', alt: 'A white metal roof with a front gable entry seen from above' },
      blue:   { c: '#2D6E9E', dark: 1, k: 'Coastal blue', p: 'A cool tone that echoes sea and sky. Works with white trim and siding, and suits porches and raised homes near the water.', src: 'images/blue.jpg', alt: 'A crew working on a blue metal roof on a porch home beside a ladder' }
    };
    var coils = $$('.dg-coil');
    var pick = function (k) {
      var d = D[k];
      coils.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-coil') === k ? 'true' : 'false'); });
      document.documentElement.style.setProperty('--coil', d.c === '#F6F7F5' ? '#8e9ba4' : d.c);
      note.style.background = d.c; note.setAttribute('data-dark', d.dark);
      $('.dg-note-k', note).textContent = d.k; $('.dg-note-p', note).textContent = d.p;
      if (!img.src.endsWith(d.src)) {
        img.classList.add('swap');
        setTimeout(function () { img.removeAttribute('srcset'); img.src = d.src; img.alt = d.alt; img.onload = function () { img.classList.remove('swap'); }; }, reduce ? 0 : 200);
      }
    };
    coils.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-coil')); }); });
  }

  /* ---- generic tabs ---- */
  function tabs(root) {
    var t = $$('[role=tab]', root), p = $$('[role=tabpanel]', root);
    function sel(i, f) {
      t.forEach(function (x, j) { x.setAttribute('aria-selected', j === i ? 'true' : 'false'); x.tabIndex = j === i ? 0 : -1; });
      p.forEach(function (x, j) { x.hidden = j !== i; });
      if (f) t[i].focus();
    }
    t.forEach(function (x, i) {
      x.addEventListener('click', function () { sel(i); });
      x.addEventListener('keydown', function (e) {
        var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (n) { e.preventDefault(); sel((i + n + t.length) % t.length, true); }
      });
    });
    sel(0);
  }
  $$('[data-tabs],[data-prof]').forEach(tabs);

  /* ---- 5 questions ---- */
  var qs = $('[data-qs]');
  if (qs) {
    var bs = $$('button', qs);
    bs.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        bs.forEach(function (x) { x.setAttribute('aria-expanded', 'false'); document.getElementById(x.getAttribute('aria-controls')).hidden = true; });
        if (!open) { b.setAttribute('aria-expanded', 'true'); document.getElementById(b.getAttribute('aria-controls')).hidden = false; }
      });
    });
  }

  /* ---- panels unroll off the coil as you scroll ---- */
  var un = $$('[data-unroll]');
  function roll() {
    var vh = window.innerHeight;
    un.forEach(function (u) {
      var s = $('.dg-sheet-strip', u), r = u.getBoundingClientRect();
      var p = Math.max(0.06, Math.min(1, (vh * 0.98 - r.top) / (vh * 0.5)));
      s.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
    });
  }
  if (un.length) { window.addEventListener('scroll', roll, { passive: true }); window.addEventListener('resize', roll); roll(); }
})();
