(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- sky: dawn -> noon -> storm, tied to scroll ---- */
  var ticking = false;
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function sky() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    root.style.setProperty('--sk-dawn', clamp(1 - p / 0.2).toFixed(3));
    root.style.setProperty('--sk-storm', clamp((p - 0.5) / 0.3).toFixed(3));
    root.classList.toggle('sky-late', p > 0.62);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(sky); } }, { passive: true });
  window.addEventListener('resize', sky);
  sky();

  /* ---- stars ---- */
  var starPath = 'M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8z';
  $$('[data-stars]').forEach(function (el, n) {
    var r = parseFloat(el.getAttribute('data-stars')), h = '';
    for (var i = 0; i < 5; i++) {
      var f = clamp(r - i);
      var id = 'sg' + n + '-' + i;
      h += '<svg viewBox="0 0 24 24"><defs><linearGradient id="' + id + '"><stop offset="' + (f * 100) + '%" stop-color="#D9892B"/><stop offset="' + (f * 100) + '%" stop-color="#B7B2A6"/></linearGradient></defs><path d="' + starPath + '" fill="url(#' + id + ')"/></svg>';
    }
    el.innerHTML = h;
  });

  /* ---- hail ruler ---- */
  var HAIL = [
    { k: 'Pea', d: 0.25, sz: '1/4 in', v: 'ok', vt: 'Roof check: usually not needed.', t: 'Pea-size hail mostly bounces off. A healthy asphalt roof rarely notices it, though it can still dent soft things like a thin gutter or a garden table.', img: 'hail-grass', alt: 'Hailstones lying in green grass', cap: 'Illustrative photo: hail on grass' },
    { k: 'Marble', d: 0.5, sz: '1/2 in', v: 'ok', vt: 'Roof check: only if you see other signs.', t: 'Marble-size hail is normally too small to hurt shingles in good shape. Older, dry shingles can lose some granules, so look at the downspouts.', img: 'hail-grass', alt: 'Hailstones lying in green grass', cap: 'Illustrative photo: hail on grass' },
    { k: 'Quarter', d: 1, sz: '1 in', v: 'check', vt: 'Worth a roof check.', t: 'About an inch across is the size often quoted as where hail starts to bruise asphalt shingles. Dents in gutters and vents are a clue the roof took a hit too.', img: 'gutter-line', alt: 'A gutter and downspout on the edge of a roof against a blue sky', cap: 'Illustrative photo: gutter and downspout' },
    { k: 'Golf ball', d: 1.75, sz: '1 3/4 in', v: 'check', vt: 'Worth a roof check.', t: 'Stones this size commonly dent gutters, vents and air-conditioner fins and can crack or bruise shingles. A close look at the roof is a good idea.', img: 'gutter-line', alt: 'A gutter and downspout on the edge of a roof against a blue sky', cap: 'Illustrative photo: gutter and downspout' },
    { k: 'Baseball', d: 2.75, sz: '2 3/4 in', v: 'urgent', vt: 'Get a roof check as soon as it is safe.', t: 'Baseball-size hail can crack and puncture shingles and damage the decking underneath. If a storm dropped stones like these, have the whole roof looked over.', img: 'storm-sky', alt: 'A dark storm sky over trees and rooftops', cap: 'Illustrative photo: storm sky' }
  ];
  function stoneSVG(seed) {
    var pts = [], n = 18, i, a, r;
    for (i = 0; i < n; i++) {
      a = i / n * Math.PI * 2;
      r = 44 + Math.sin(seed * 7 + i * 2.3) * 2.2 + Math.cos(seed * 3 + i * 4.1) * 1.8;
      pts.push((50 + Math.cos(a) * r).toFixed(1) + ' ' + (50 + Math.sin(a) * r).toFixed(1));
    }
    var id = 'hg' + seed;
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#DCEBF7"/><stop offset="1" stop-color="#9DBBD6"/></radialGradient></defs>' +
      '<polygon points="' + pts.join(' ') + '" fill="url(#' + id + ')" stroke="#6E93B5" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="50" cy="50" r="30" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/><circle cx="50" cy="50" r="17" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>' +
      '<ellipse cx="36" cy="30" rx="10" ry="5" fill="#fff" fill-opacity=".85" transform="rotate(-30 36 30)"/></svg>';
  }
  var stones = $('#stones');
  if (stones) {
    var setHail = function (i) {
      var h = HAIL[i];
      $$('.stone').forEach(function (s, j) { s.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      $('#hpSize').innerHTML = h.k + ' <small>' + h.sz + '</small>';
      $('#hpText').textContent = h.t;
      var v = $('#hpVerdict'); v.textContent = h.vt; v.setAttribute('data-v', h.v);
      var im = $('#hpImg'); im.style.opacity = 0;
      setTimeout(function () { im.src = 'images/' + h.img + '-720.jpg'; im.alt = h.alt; $('#hpCap').textContent = h.cap; im.style.opacity = 1; }, reduce ? 0 : 180);
    };
    HAIL.forEach(function (h, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'stone'; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.setAttribute('aria-label', h.k + ', ' + h.sz);
      b.innerHTML = stoneSVG(i + 2) + '<span class="sz">' + h.sz + '</span><span class="nm">' + h.k + '</span>';
      var svg = b.querySelector('svg');
      svg.style.width = 'calc(var(--in) * ' + h.d + ')'; svg.style.height = 'calc(var(--in) * ' + h.d + ')';
      b.addEventListener('click', function () { setHail(i); });
      stones.appendChild(b);
    });
    setHail(0);
    // inch numbers fill the ruler
    var nums = $('.ruler-nums'), rl = $('.ruler');
    var fillNums = function () {
      var tmp = document.createElement('span'); tmp.style.cssText = 'position:absolute;width:var(--in);height:1px;visibility:hidden'; rl.appendChild(tmp);
      var inchPx = tmp.getBoundingClientRect().width || 96; rl.removeChild(tmp);
      var w = rl.clientWidth, h = '';
      for (var k = 0; k * inchPx < w; k++) h += '<span>' + (k === 0 ? '0' : k + '"') + '</span>';
      nums.innerHTML = h;
    };
    fillNums(); window.addEventListener('resize', fillNums);
  }

  /* ---- roof sections ---- */
  var ROOFS = [
    { t: 'Roof inspections', x: 'A careful look at a roof from edge to ridge to see what shape it is in: shingles, flashing, vents and gutters.', w: 'After a hailstorm or high wind, when you are buying or selling, or when a roof is simply getting on in years.', img: 'gable', alt: 'A gable with a small triangular window on a shingled roof', cap: 'Illustrative photo: a gable roof' },
    { t: 'Roof replacement', x: 'A complete new roof for a house or building. The old roofing comes off and a new roof goes on, for roofs of all types.', w: 'When a roof is worn out, leaks in more than one place, or is too damaged to patch.', img: 'courses', alt: 'Workers laying new roof tiles on a building', cap: 'Illustrative photo: roof going on' },
    { t: 'Roof repair', x: 'Fixing a specific problem: a leak, missing or lifted shingles, or flashing that has let go.', w: 'When most of the roof is still in good shape but one area is letting water in or looks damaged.', img: 'damaged-shingles', alt: 'Grey asphalt shingles with a dark patch where shingles are missing', cap: 'Illustrative photo: damaged shingles' },
    { t: 'Storm and hail damage repairs', x: 'Looking over a roof after hail or high wind and repairing what the storm did to it.', w: 'When you see dents in gutters, bare patches, or shingle pieces in the yard after a storm.', img: 'storm-lake', alt: 'A fork of lightning over dark water under a stormy sky', cap: 'Illustrative photo: storm sky' }
  ];
  var tabs = $$('.rtab'), parts = $$('.rp');
  function setRoof(i) {
    var r = ROOFS[i];
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    parts.forEach(function (p, j) { p.classList.toggle('on', j === i); });
    $('#rpTitle').textContent = r.t; $('#rpText').textContent = r.x; $('#rpWhen').textContent = r.w;
    var im = $('#rpImg'); im.src = 'images/' + r.img + '-720.jpg'; im.alt = r.alt; $('#rpCap').textContent = r.cap;
    $('#rpanel').setAttribute('aria-labelledby', 'rt' + i);
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { setRoof(+t.getAttribute('data-i')); }); });
  parts.forEach(function (p) { p.addEventListener('click', function () { setRoof(+p.getAttribute('data-i')); }); });
  setRoof(1);

  /* ---- the year overhead ---- */
  var YEAR = [
    { t: 'Wind', x: 'Spring wind works at the edges. From the yard, look along the ridge and eaves for lifted or curled shingle tabs, and for pieces blown into the grass.', img: 'roof-vent', alt: 'A roof vent and shingle edge against a grey sky', cap: 'Illustrative photo: roof vent and edge', lab: 'Spring wind' },
    { t: 'Hail', x: 'Hail season is about dents and bruises: dimpled vents and gutters, bare spots on shingles, and grit collecting where the downspouts empty.', img: 'shingle', alt: 'Close view of asphalt shingles on a roof', cap: 'Illustrative photo: shingles', lab: 'Hail season' },
    { t: 'Sun', x: 'Summer sun bakes a roof for months. Shingles slowly lose granules, dry out and curl at the edges. Look for bare-looking, faded or curling shingles.', img: 'roof-shingles', alt: 'Brown asphalt roof shingles in sunlight', cap: 'Illustrative photo: sun-baked shingles', lab: 'Summer sun' }
  ];
  var yb = $('#yearBox'), yr = $('#yRange');
  function setYear(i) {
    var y = YEAR[i]; yb.setAttribute('data-s', i); yr.value = i; yr.setAttribute('aria-valuetext', y.lab);
    $('#yTitle').textContent = y.t; $('#yText').textContent = y.x;
    var im = $('#yImg'); im.src = 'images/' + y.img + '-720.jpg'; im.alt = y.alt; $('#yCap').textContent = y.cap;
    $$('.slider button').forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  }
  yr.addEventListener('input', function () { setYear(+yr.value); });
  $$('.slider button').forEach(function (b) { b.addEventListener('click', function () { setYear(+b.getAttribute('data-s')); }); });
  setYear(0);

  /* ---- walk checklist ---- */
  var MSG = ['Nothing ticked yet. Start with the gutters.', 'One down. Keep walking the edge of the yard.', 'Two marks. Look up at the roof line next.', 'Three. You are building a good picture.', 'Four. One more to go.', 'Walk complete. If anything on the list showed up, call a roofer to take a proper look.'];
  var boxes = $$('.post input'), ws = $('#walkScore');
  function walk() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    $('#wsNum').textContent = n; $('#wsMsg').textContent = MSG[n];
    ws.style.setProperty('--done', n);
  }
  boxes.forEach(function (b) { b.addEventListener('change', walk); });
  walk();
})();
