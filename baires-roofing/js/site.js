(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------- match your brick ---------- */
  var ROOFS = {
    char:    { name: 'Charcoal',        r1: '#33363B', r2: '#3B3F45', re: '#1E2023', img: 'roof-char' },
    black:   { name: 'Black',           r1: '#1F2124', r2: '#26292C', re: '#0E0F10', img: 'roof-black' },
    wood:    { name: 'Weathered wood',  r1: '#7A6A5A', r2: '#86766A', re: '#4E4338', img: 'roof-wood' },
    dkbrown: { name: 'Dark brown',      r1: '#4A3428', r2: '#55392C', re: '#2A1C14', img: 'roof-dkbrown' },
    burg:    { name: 'Burgundy',        r1: '#6E2E3A', r2: '#7A3542', re: '#3E1920', img: 'roof-burg' },
    slate:   { name: 'Slate grey',      r1: '#5C6670', r2: '#66717B', re: '#353C43', img: 'roof-slate' }
  };
  var BRICKS = {
    red: { name: 'Classic red brick', w: ['#A14A35', '#96412F', '#AD523C', '#9B4632'], m: '#D8CCB3',
      note: 'Red brick has warm orange undertones. Cool dark greys and blacks let the brick stay the star; a dark brown keeps the look soft and traditional.',
      roofs: [['char', 'Cool and calm next to the red'], ['black', 'A crisp, formal edge'], ['dkbrown', 'Warm on warm, softer']],
      photo: { src: 'own-g02', w: 1440, h: 886, ext: 'jpg', big: 1440, alt: 'Roofers at work on a pink-red brick French-style home with arched windows', cap: 'a red brick home, crew on the roof' } },
    tan: { name: 'Tan brick', w: ['#C9A878', '#BF9B6B', '#D2B58B', '#C4A171'], m: '#E3D9C3',
      note: 'Tan brick is soft and sandy. Deep browns echo the warmth, charcoal adds contrast, and weathered wood blends in quietly.',
      roofs: [['dkbrown', 'Echoes the warmth of the brick'], ['char', 'Adds contrast'], ['wood', 'Blends in quietly']],
      photo: { src: 'own-g01', w: 960, h: 720, ext: 'jpg', big: 960, alt: 'A light brick home with a dormer under a new dark grey shingle roof', cap: 'light brick, charcoal shingles' } },
    brown: { name: 'Brown brick', w: ['#6F4A3A', '#62402F', '#7B5444', '#684436'], m: '#CFC3AE',
      note: 'Brown brick already has depth. Charcoal and slate cool it down; weathered wood keeps everything earthy.',
      roofs: [['char', 'Cools the brown down'], ['slate', 'A soft, cool grey'], ['wood', 'Earthy and natural']],
      photo: { src: 'stock-brown-brick', w: 1600, h: 1000, ext: 'jpg', big: 1600, alt: 'A brown brick house with a charcoal roof and a front porch (illustrative stock photo)', cap: 'brown brick, charcoal roof (stock photo)' } },
    white: { name: 'Painted white brick', w: ['#F1EEE6', '#E8E4DA', '#F4F1EA', '#ECE8DE'], m: '#C9C3B5',
      note: 'Painted white brick is crisp and bright. Black or charcoal gives a strong, clean edge, and burgundy adds a note of colour.',
      roofs: [['black', 'The strongest contrast'], ['char', 'Clean and softer than black'], ['burg', 'A note of colour']],
      photo: null },
    lime: { name: 'Limestone', w: ['#D8CDB4', '#CBBFA5', '#E0D6BF', '#D0C4AA'], m: '#B5A98F',
      note: 'Limestone is pale and warm. Charcoal gives contrast, burgundy suits the cream tones, and dark brown feels traditional.',
      roofs: [['char', 'Strong, even contrast'], ['burg', 'Suits the cream tones'], ['dkbrown', 'Traditional and warm']],
      photo: { src: 'own-g03', w: 1440, h: 1080, ext: 'jpg', big: 1440, alt: 'A large stone-and-stucco home with a terrace and bare trees in front', cap: 'stone and stucco, big roofline' } }
  };
  var house = $('#house'), chips = $$('.bk-brick-chip'), roofWrap = $('#roofChips');
  var cur = 'red', curRoof = 'char';

  function paintHouse() {
    var b = BRICKS[cur], r = ROOFS[curRoof], s = house.style;
    s.setProperty('--w1', b.w[0]); s.setProperty('--w2', b.w[1]); s.setProperty('--w3', b.w[2]); s.setProperty('--w4', b.w[3]); s.setProperty('--wm', b.m);
    s.setProperty('--r1', r.r1); s.setProperty('--r2', r.r2); s.setProperty('--re', r.re);
    $('#houseCap').textContent = 'Drawn house, not to scale. ' + b.name + ' with a ' + r.name.toLowerCase() + ' roof.';
  }
  function renderRoofs() {
    roofWrap.innerHTML = '';
    BRICKS[cur].roofs.forEach(function (p) {
      var key = p[0], btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'bk-roof-chip' + (key === curRoof ? ' is-on' : '');
      btn.setAttribute('aria-pressed', key === curRoof ? 'true' : 'false');
      btn.innerHTML = '<i style="background-image:url(images/' + ROOFS[key].img + '.svg)"></i><span>' + ROOFS[key].name + '<small>' + p[1] + '</small></span>';
      btn.addEventListener('click', function () { curRoof = key; renderRoofs(); paintHouse(); });
      roofWrap.appendChild(btn);
    });
  }
  function pickBrick(key) {
    cur = key; var b = BRICKS[key];
    chips.forEach(function (c) { var on = c.getAttribute('data-brick') === key; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    curRoof = b.roofs[0][0];
    $('#resTitle').textContent = b.name; $('#resNote').textContent = b.note;
    var fig = $('#resPhoto');
    if (b.photo) {
      var im = $('#resImg'), p = b.photo;
      im.src = 'images/' + p.src + '.' + p.ext;
      im.srcset = 'images/' + p.src + '-720.' + p.ext + ' 720w, images/' + p.src + '.' + p.ext + ' ' + p.big + 'w';
      im.width = p.w; im.height = p.h; im.alt = p.alt; $('#resCap').textContent = p.cap; fig.hidden = false;
    } else { fig.hidden = true; }
    renderRoofs(); paintHouse();
  }
  chips.forEach(function (c) { c.addEventListener('click', function () { pickBrick(c.getAttribute('data-brick')); }); });
  pickBrick('red');

  /* ---------- replace / repair tabs ---------- */
  var tabs = $$('.bk-swap-tab');
  function pick(t) {
    tabs.forEach(function (x) {
      var on = x === t; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; pick(n); n.focus(); }
    });
  });

  /* ---------- tips wall ---------- */
  var TIPS = [
    ['Look at the brick in daylight', 'Brick can look redder in sun and browner in shade. Judge the colour outdoors, at different times of day, before you pick a shingle.'],
    ['Match the trim, not just the brick', 'Window frames, gutters, doors and trim set the tone too. Choose a shingle that works with all of them, not only the wall.'],
    ['Darker roofs run hotter', 'Dark shingles absorb more heat than light ones. In a Texas summer, that is worth thinking about alongside the look.'],
    ['Check what the neighbours have', 'A walk down the street shows what colours already sit well with brick like yours, and what the neighbourhood expects.'],
    ['See a real sample on the roof', 'A small chip in the hand looks different from a whole roof. Ask to see a full shingle in daylight, against your brick.']
  ];
  var bricks = $$('.bk-tip-brick');
  bricks.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = parseInt(b.getAttribute('data-tip'), 10);
      bricks.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      $('#tipN').textContent = 'Tip ' + (i + 1); $('#tipH').textContent = TIPS[i][0]; $('#tipP').textContent = TIPS[i][1];
    });
  });
})();
