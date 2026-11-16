(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PICK A PATTERN ---------- */
  var PATS = {
    herring: {
      n: 1, name: 'Herringbone 45°', fill: 'p-herring-terra', fig: 'Fig. 2.1',
      note: 'Each paver locks against its neighbours at an angle, so the whole surface works as one piece. It is the pattern most often chosen where cars drive and turn, and on a patio it brings movement to a plain area.',
      suits: 'Driveways, pool decks, patios',
      img: 'own-patio-red', w: 1200, h: 1600, pos: '50% 60%',
      alt: 'A red and orange paver patio along the back of a white house with a tile roof',
      cap: 'A red-toned paver patio at a tile-roof home. Close in feel to this pattern; the exact layout may differ.'
    },
    basket: {
      n: 2, name: 'Basketweave', fill: 'p-basket-terra', fig: 'Fig. 2.2',
      note: 'Pairs of pavers sit side by side, then turn a quarter-turn for the next pair, like a woven mat. It reads calm and traditional, and suits small areas where people walk rather than park.',
      suits: 'Patios, entries, landings',
      img: 'own-landing', w: 1600, h: 900, pos: '50% 50%',
      alt: 'A small paver landing at a screen door with a red border course around a tan and grey field',
      cap: 'A small landing at a screen door: a red border around a tan, blocky field. Close in feel to this pattern.'
    },
    running: {
      n: 3, name: 'Running bond', fill: 'p-running-terra', fig: 'Fig. 2.3',
      note: 'Rows of pavers, each row shifted half a paver along, the way a brick wall is laid. It is the simplest pattern, and it makes a long patio or walkway feel longer.',
      suits: 'Patios, walkways, pool decks',
      img: 'own-patio-slab', w: 1600, h: 1200, pos: '40% 60%',
      alt: 'A long paver patio slab laid along a lawn, with pines and a hedge in the distance',
      cap: 'A long paver patio slab laid along a lawn. Close in feel to this pattern.'
    },
    circle: {
      n: 4, name: 'Circle kit', fill: 'p-running-terra', fig: 'Fig. 2.4', roundel: true,
      note: 'Curved pavers laid in rings make a round medallion, usually set into a square or rectangular field. It gives a patio or a driveway apron a centrepiece without changing the rest of the paving.',
      suits: 'Patios, entries, driveway aprons',
      img: 'own-patio-pergola', w: 1600, h: 1200, pos: '30% 55%',
      alt: 'A round paver patio joined to a larger paver terrace beside a white pergola on stone-look columns',
      cap: 'A round patio meeting a larger terrace beside a white pergola.'
    },
    soldier: {
      n: 5, name: 'Soldier border', fill: 'p-running-terra', fig: 'Fig. 2.5', border: true,
      note: 'One course of pavers laid end to end around the edge of the area. It frames the field, holds the edge in place and is where a contrast colour goes. It goes with any pattern, on any area.',
      suits: 'Any edge, any area',
      img: 'own-pool-deck', w: 1600, h: 1200, pos: '50% 55%',
      alt: 'A large grey paver pool deck with a dark border course, a pool and a white vinyl fence behind',
      cap: 'A grey pool deck with a dark border course, white fence behind.'
    }
  };
  var stage = $('#stage');
  var current = 'herring';
  var wipe = $('#stg-wipe');
  var raf;

  function runWipe() {
    if (!wipe) return;
    cancelAnimationFrame(raf);
    if (still) { wipe.setAttribute('width', 900); return; }
    var t0 = null, dur = 760;
    wipe.setAttribute('width', 0);
    (function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      wipe.setAttribute('width', (900 * e).toFixed(1));
      if (k < 1) raf = requestAnimationFrame(step);
    })(performance.now());
  }

  function pick(key, opts) {
    var p = PATS[key]; if (!p) return;
    opts = opts || {};
    current = key;
    $$('.sw').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pat') === key)); });
    ['drive', 'walk', 'patio'].forEach(function (s) { $('#fill-' + s).setAttribute('fill', 'url(#' + p.fill + ')'); });
    $('#stg-roundel').hidden = !p.roundel;
    $('#stg-border').hidden = !p.border;
    $('#stage-name').textContent = p.name;
    $('#stage-fig').textContent = p.fig;
    $('#pick-no').textContent = 'Pattern ' + p.n + ' of 5';
    $('#pick-name').textContent = p.name;
    $('#pick-note').textContent = p.note;
    $('#pick-suits').textContent = p.suits;
    var fig = $('.pick-photo'), img = $('#pk-img');
    if (!opts.init) fig.classList.add('swap');
    if (!opts.init) setTimeout(function () {
      img.src = 'images/' + p.img + '.jpg';
      img.srcset = 'images/' + p.img + '-720.jpg 720w, images/' + p.img + '.jpg ' + p.w + 'w';
      img.width = p.w; img.height = p.h; img.alt = p.alt;
      img.style.objectPosition = p.pos;
      $('#pk-cap').textContent = p.cap;
      img.onload = function () { fig.classList.remove('swap'); };
      setTimeout(function () { fig.classList.remove('swap'); }, 500);
    }, still ? 0 : 220);
    if (!opts.silent) runWipe();
  }
  $$('.sw').forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-pat')); }); });
  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () { var k = a.getAttribute('data-pick'); setTimeout(function () { pick(k); }, 350); });
  });
  var firstImg = $('#pk-img'); if (firstImg) firstImg.style.objectPosition = PATS.herring.pos;

  /* ---------- SERVICES TABS ---------- */
  var SV = [
    { id: 'drive', h: 'Driveways', cta: 'Ask about a driveway', img: 'own-driveway-pallets', w: 1600, hh: 1200, pos: '50% 55%',
      alt: 'A curved herringbone paver driveway with pallets of pavers stacked on the lawn beside it',
      cap: 'Their photo: a curved driveway, pallets of pavers still on the lawn.',
      what: 'A paver driveway is made of single pavers locked together over a compacted base, so it carries the weight of cars and can be repaired one section at a time.',
      when: 'When concrete has cracked or stained, or when the front of the house wants more shape and colour.', pats: [['herring', 'Herringbone 45°'], ['soldier', 'Soldier border']] },
    { id: 'patio', h: 'Patios', cta: 'Ask about a patio', img: 'own-patio-dusk', w: 1600, hh: 1200, pos: '50% 60%',
      alt: 'A paver patio behind a brick home at dusk, with lawn in front',
      cap: 'Their photo: a paver patio behind a brick home, at dusk.',
      what: 'A paver patio is a hard, level floor for the outdoor room: a table, a grill, a fire pit, a few chairs.',
      when: 'When the back door opens straight onto lawn or sand and the yard has no place to sit.', pats: [['basket', 'Basketweave'], ['circle', 'Circle kit']] },
    { id: 'pool', h: 'Pool decks', cta: 'Ask about a pool deck', img: 'own-pool-deck', w: 1600, hh: 1200, pos: '50% 55%',
      alt: 'A large grey paver pool deck with a dark border course, a pool and a white vinyl fence behind',
      cap: 'Their photo: a grey pool deck, dark border course, white fence behind.',
      what: 'The paved ground around a pool, where people walk wet and barefoot. Paver colour matters here, because lighter tones reflect more of the sun.',
      when: 'When the pool is in but the ground around it is bare, or the old deck is worn out.', pats: [['running', 'Running bond'], ['herring', 'Herringbone 45°']] },
    { id: 'walk', h: 'Walkways and steps', cta: 'Ask about a walkway', img: 'own-landing', w: 1600, hh: 900, pos: '50% 55%',
      alt: 'A small paver landing at a screen door with a red border course around a tan and grey field',
      cap: 'Their photo: a small landing at a screen door, red border, tan field.',
      what: 'The route from the drive to the front door or the yard, plus the step or landing where it ends.',
      when: 'For a defined path across the yard, or a clean landing outside a sliding door.', pats: [['soldier', 'Soldier border'], ['running', 'Running bond']] }
  ];
  var tabs = $$('.stab');
  function showSv(i, focus) {
    var s = SV[i];
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    var panel = $('#serv-panel'); panel.setAttribute('aria-labelledby', tabs[i].id);
    var fig = $('.serv-photo'), img = $('#sv-img');
    fig.classList.add('swap');
    setTimeout(function () {
      img.src = 'images/' + s.img + '.jpg';
      img.srcset = 'images/' + s.img + '-720.jpg 720w, images/' + s.img + '.jpg ' + s.w + 'w';
      img.width = s.w; img.height = s.hh; img.alt = s.alt; img.style.objectPosition = s.pos;
      $('#sv-cap').textContent = s.cap;
      img.onload = function () { fig.classList.remove('swap'); };
      setTimeout(function () { fig.classList.remove('swap'); }, 500);
    }, still ? 0 : 200);
    $('#sv-no').textContent = '0' + (i + 1) + ' / 04';
    $('#sv-h').textContent = s.h; $('#sv-what').textContent = s.what; $('#sv-when').textContent = s.when; $('#sv-cta').textContent = s.cta;
    var pat = $('.serv-pat');
    pat.innerHTML = '<b>Patterns that fit</b> ' + s.pats.map(function (p) { return '<button type="button" class="chip-link" data-pickjump="' + p[0] + '">' + p[1] + '</button>'; }).join(' ');
    bindJump();
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showSv(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length;
      if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); showSv((i + 1) % n, true); }
      if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); showSv((i + n - 1) % n, true); }
    });
  });
  function bindJump() {
    $$('[data-pickjump]').forEach(function (b) {
      if (b._bound) return; b._bound = true;
      b.addEventListener('click', function () {
        pick(b.getAttribute('data-pickjump'), { silent: false });
        $('#pattern').scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }
  bindJump();

  /* ---------- PLAN IT: five things ---------- */
  var steps = $$('.pstep');
  function showStep(i, focus) {
    steps.forEach(function (s, j) {
      s.setAttribute('aria-selected', String(j === i)); s.tabIndex = j === i ? 0 : -1;
      var p = document.getElementById('pp-' + (j + 1)); if (p) p.hidden = j !== i;
    });
    if (focus) steps[i].focus();
  }
  steps.forEach(function (s, i) {
    s.addEventListener('click', function () { showStep(i); });
    s.addEventListener('keydown', function (e) {
      var n = steps.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); showStep((i + 1) % n, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); showStep((i + n - 1) % n, true); }
    });
  });

  /* ---------- GALLERY FILTER ---------- */
  var chips = $$('.chip'), mosaic = $('.mosaic');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      mosaic.classList.toggle('filtered', f !== 'all');
      $$('figure', mosaic).forEach(function (fig) { fig.classList.toggle('off', f !== 'all' && fig.getAttribute('data-cat') !== f); });
    });
  });

  /* ---------- cursor chip on gallery ---------- */
  var chip = $('.cursor-chip');
  if (chip && window.matchMedia('(hover:hover) and (pointer:fine)').matches && mosaic) {
    mosaic.addEventListener('pointermove', function (e) { chip.style.transform = 'translate(' + (e.clientX + 16) + 'px,' + (e.clientY + 16) + 'px)'; });
    mosaic.addEventListener('pointerenter', function () { chip.classList.add('on'); });
    mosaic.addEventListener('pointerleave', function () { chip.classList.remove('on'); });
  }
  pick('herring', { silent: true, init: true });
})();
