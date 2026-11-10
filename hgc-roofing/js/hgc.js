(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. the cutaway: tap a layer to read it */
  var L = {
    1: { k: 'LAYER 01', t: 'Roof deck', img: 'images/frame-sky-720.jpg', alt: 'Timber roof rafters against a blue sky',
         what: 'The plywood or boards fixed over the rafters. Every other layer is fastened to it, so it has to be flat and solid.',
         sign: 'Sagging between rafters, or dark damp patches on the underside of the boards when you look from the attic.', cover: 'Roof decking' },
    2: { k: 'LAYER 02', t: 'Underlayment', img: 'images/own-underlayment-720.jpg', alt: 'Blue synthetic underlayment laid across a roof', pos: '50% 88%',
         what: 'A water-resistant sheet laid over the deck before the shingles. It is the second line of defence if wind-driven rain gets under them.',
         sign: 'Water stains on the attic side of the roof, or a ceiling spot that appears after rain.', cover: 'Underlayment' },
    3: { k: 'LAYER 03', t: 'Starter strip + drip edge', img: 'images/gable-720.jpg', alt: 'Grey shingled roof with a triangular gable window',
         what: 'The first row of shingles at the lowest edge, plus the metal edge that guides water into the gutter instead of behind it.',
         sign: 'Shingles lifting along the bottom edge, or stains on the fascia and behind the gutters.', cover: 'Roof repair' },
    4: { k: 'LAYER 04', t: 'Shingles', img: 'images/shingle-wide-720.jpg', alt: 'Rows of grey asphalt shingles',
         what: 'The outer skin of the roof. They shed sun, rain and hail, and the courses overlap so water runs down and off.',
         sign: 'From the yard: curled or missing shingles, bare patches, or grit collecting at the downspouts.', cover: 'Roof replacement' },
    5: { k: 'LAYER 05', t: 'Ridge vent', img: 'images/attic-720.jpg', alt: 'Wooden beams and ceiling inside an attic',
         what: 'A slot along the peak, covered by a cap, that lets hot, damp attic air escape so the roof can breathe.',
         sign: 'An attic that stays hot and stuffy, or ridge caps that look cracked or lifted when seen from the ground.', cover: 'Ridge, vents and flashing' }
  };
  var svg = $('.cut');
  var cur = 0;
  function pick(n, focus) {
    n = +n; cur = n; var d = L[n];
    $$('.cut .lyr').forEach(function (g) { g.classList.toggle('on', +g.dataset.layer === n); });
    $$('.cut .callout').forEach(function (g) { g.classList.toggle('on', +g.dataset.for === n); });
    if (svg) svg.classList.add('has-on');
    $$('[data-layer-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.layerBtn === n)); });
    var im = $('#lyr-img'); im.src = d.img; im.alt = d.alt; im.style.objectPosition = d.pos || '50% 50%';
    $('#lyr-kicker').textContent = d.k; $('#lyr-title').textContent = d.t; $('#lyr-what').textContent = d.what;
    $('#lyr-sign').textContent = d.sign; $('#lyr-cover').textContent = d.cover;
    if (focus) { var c = $('#lyr-card'); if (c && innerWidth < 1100) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  }
  $$('.cut .lyr').forEach(function (g) {
    g.addEventListener('click', function () { pick(g.dataset.layer, true); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(g.dataset.layer, true); } });
  });
  $$('.cut .callout').forEach(function (g) { g.style.cursor = 'pointer'; g.addEventListener('click', function () { pick(g.dataset.for, true); }); });
  $$('[data-layer-btn]').forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.layerBtn, false); }); });
  $$('[data-goto]').forEach(function (a) { a.addEventListener('click', function () { setTimeout(function () { pick(a.dataset.goto, false); }, 350); }); });
  pick(1, false);
  // the layers are lit one after another once, so the drawing shows it is tappable
  var seen = false;
  if ('IntersectionObserver' in window && svg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) {
        if (e.isIntersecting && !seen) {
          seen = true; io.disconnect(); var i = 5;
          (function step() { if (i > 0 && cur !== 0 && !svg.dataset.touched) { pick(i, false); i--; setTimeout(step, 520); } else if (!svg.dataset.touched) pick(1, false); })();
        }
      });
    }, { threshold: 0.5 }).observe(svg);
    svg.addEventListener('pointerdown', function () { svg.dataset.touched = '1'; });
    $$('[data-layer-btn]').forEach(function (b) { b.addEventListener('pointerdown', function () { svg.dataset.touched = '1'; }); });
  }

  /* 2. service cards expand */
  $$('.svc-more').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
    });
  });

  /* 3. the inspection sheet */
  var form = $('#chk-form');
  if (form) {
    var boxes = $$('input[type=checkbox]', form), cnt = $('#chk-count'), res = $('#chk-result');
    function upd() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      cnt.textContent = n + ' of 5 noticed';
      res.textContent = n === 0 ? 'Nothing ticked yet. Take a look from the yard, then come back.'
        : n < 3 ? 'Worth a closer look. Take dated photos from the ground and ask a roofer to check that layer.'
        : 'Several layers are showing signs. Photograph what you can see from the ground and call a roofer to look properly.';
    }
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
    upd();
  }

  /* 4. gallery filter */
  var chips = $$('.chip'), figs = $$('.gal figure');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('is-on', x === c); x.setAttribute('aria-pressed', String(x === c)); });
      figs.forEach(function (f) { f.hidden = !(c.dataset.f === 'all' || f.dataset.t === c.dataset.f); });
    });
    c.setAttribute('aria-pressed', String(c.classList.contains('is-on')));
  });
})();
