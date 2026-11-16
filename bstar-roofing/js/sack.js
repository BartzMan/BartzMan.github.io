(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ROOF IN THE SACK */
  var data = {
    deck: { n: '1 · Deck', src: 'images/deck-aerial.jpg', w: 1600, h: 1180, alt: 'Aerial view of two workers on a decked roof beside a ladder', cap: 'Their own photo. Decking on a roof, aerial view.', t: 'The plywood deck is what everything else nails into. Houston humidity can leave it soft, so spongy or stained patches are worth replacing before any new roofing goes on.' },
    underlayment: { n: '2 · Underlayment', src: 'images/underlay.jpg', w: 1024, h: 1024, alt: 'New synthetic underlayment going on beside a grey roof', cap: 'Their own photo. New synthetic underlayment going on.', t: 'A water-shedding sheet laid over the deck. If wind-driven rain gets past a shingle in a storm, this is the second line it has to beat.' },
    shingles: { n: '3 · Shingles', src: 'images/shingle.jpg', w: 1600, h: 1067, alt: 'A close-up of a grey shingle roof', cap: 'Illustrative stock photo (Hal Gatewood / Unsplash). Shingle courses.', t: 'The layer you see. In Gulf Coast sun it takes UV and heat every day, and in a storm it is the first thing the wind tries to lift.' },
    flashing: { n: '4 · Flashing and vents', src: 'images/chimney-tearoff.jpg', w: 813, h: 600, alt: 'A tear-off with underlayment around a brick chimney', cap: 'Their own photo. Underlayment and a chimney during a tear-off.', t: 'Metal around chimneys, walls and vents, plus the ridge vent that lets attic heat out. Leaks often start where a roof meets something else.' }
  };
  var tabs = $$('.sk-ltab'), layers = $$('#sk-svg .layer'), calls = $$('#sk-svg .call');
  var img = $('#sk-layer-img'), cap = $('#sk-layer-cap'), ti = $('#sk-layer-title'), tp = $('#sk-layer-p');
  function pick(k) {
    var d = data[k]; if (!d) return;
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-k') === k ? 'true' : 'false'); });
    layers.forEach(function (l) { l.classList.toggle('on', l.getAttribute('data-layer') === k); });
    calls.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-for') === k); });
    img.style.opacity = 0;
    setTimeout(function () {
      img.src = d.src; img.width = d.w; img.height = d.h; img.alt = d.alt;
      cap.textContent = d.cap; ti.textContent = d.n; tp.textContent = d.t;
      img.style.opacity = 1;
    }, 150);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { pick(t.getAttribute('data-k')); }); });
  layers.forEach(function (l) {
    l.addEventListener('click', function () { pick(l.getAttribute('data-layer')); });
    l.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(l.getAttribute('data-layer')); } });
  });
  pick('deck');
  img.style.opacity = 1;

  /* SHINGLE / TILE */
  var sw = $$('.sk-switch button'), sh = $('#svc-shingle'), ti2 = $('#svc-tile');
  sw.forEach(function (b) {
    b.addEventListener('click', function () {
      var tile = b.getAttribute('data-roof') === 'tile';
      sw.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      sh.hidden = tile; ti2.hidden = !tile;
    });
  });

  /* SEASON MANIFEST */
  var checks = $$('.sk-check'), n = $('#sk-n'), done = $('#sk-done');
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var k = checks.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
      n.textContent = k; done.hidden = k < 5;
    });
  });
})();
