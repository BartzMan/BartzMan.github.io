(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- shingle courses: rows start out of true and slide into straight courses ---- */
  $$('.fil-courses').forEach(function (c, ci) {
    var rows = +c.getAttribute('data-rows') || 3;
    for (var k = 0; k < rows; k++) {
      var r = document.createElement('div'); r.className = 'row';
      var dir = (k + ci) % 2 ? -1 : 1;
      r.style.top = (k * 22) + 'px';
      r.style.setProperty('--bx', (k % 2 ? 32 : 0) + 'px');
      r.style.setProperty('--o', (dir * (26 + k * 14)) + 'px');
      r.style.setProperty('--rot', (dir * (1.6 - k * .3)) + 'deg');
      r.style.setProperty('--dl', (k * .14) + 's');
      c.appendChild(r);
    }
  });

  /* ---- fall into line on scroll (once per element) ---- */
  var targets = $$('.fall, .fil-courses');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-true'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(function (t) { t.classList.add('is-true'); }); }

  function openService(i) { var t = $('#tab-' + i); if (t) t.click(); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-svc]');
    if (!a) return;
    e.preventDefault(); openService(+a.getAttribute('data-svc'));
    $('#services').scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---- 1. OUT OF LINE? ---- */
  var PROBS = [
    { t: 'Sagging ridge', img: 'images/stock-storm-roofline-720.jpg', alt: 'Roof edge and trees on a stormy grey day', cap: 'Illustrative photo',
      look: 'The top line of the roof dips in the middle instead of running straight.',
      means: 'Often a sign that the structure or decking underneath has moved or taken on water. It is worth having someone look at it.', svc: [1] },
    { t: 'Lifted shingles', img: 'images/stock-damaged-shingles-720.jpg', alt: 'Asphalt shingle roof with a patch of shingles missing', cap: 'Illustrative photo',
      look: 'Edges standing up, or bare patches where a few shingles have blown off.',
      means: 'Wind or age has broken the seal. The next gust can lift more, and water can get under the rows above.', svc: [1, 2] },
    { t: 'Gutter pulling away', img: 'images/stock-gutter-line-720.jpg', alt: 'Copper-coloured gutter and white downspout against a blue sky', cap: 'Illustrative photo',
      look: 'A gap between the gutter and the fascia board, or a run that sags in the middle.',
      means: 'Fasteners have loosened or the gutter is carrying more than it was set for, so water can run behind it instead of away.', svc: [3] },
    { t: 'Flashing gap at a wall', img: 'images/stock-gable-720.jpg', alt: 'Gable with a triangular window and trim on a shingled roof', cap: 'Illustrative photo',
      look: 'A thin gap or lifted metal where a roof slope meets a wall.',
      means: 'Flashing is what sheds water at joints. When it lifts, water can follow the wall down inside.', svc: [1] },
    { t: 'Leaning chimney cap', img: 'images/stock-chimney-720.jpg', alt: 'Dormer windows and a small chimney on a grey shingled roof', cap: 'Illustrative photo',
      look: 'The cap or crown sits crooked, or the stack looks tilted when held against a plumb line.',
      means: 'Mortar or the cap may have loosened. Leaks often start where a chimney meets the roof.', svc: [1] }
  ];
  var SVC = [
    { t: 'Roof replacement', img: 'images/stock-tearoff-720.jpg', alt: 'Old shingles being stripped from a roof', text: 'A full new roof, from stripping the old layers to laying fresh, straight courses. It is the answer when patching has stopped making sense.' },
    { t: 'Roof repair', img: 'images/stock-roof-hammer-720.jpg', alt: 'Gloved hand holding a hammer on roof boards', text: 'Fixing one specific problem, such as lifted shingles, a leak or loose flashing, without redoing the whole roof.' },
    { t: 'Storm damage repairs', img: 'images/stock-storm-suburb-720.jpg', alt: 'Suburban neighbourhood with tree-lined streets under a cloudy sky', text: 'Putting right what wind, hail and falling branches left behind after a Central Texas storm.' },
    { t: 'Gutters and roof trim', img: 'images/stock-gutter-line-720.jpg', alt: 'Copper-coloured gutter and white downspout against a blue sky', text: 'The gutters, fascia and edge trim that carry water off the roof and finish its lines.' }
  ];
  var SNAMES = ['Roof replacement', 'Roof repair', 'Storm damage repairs', 'Gutters and roof trim'];

  var spots = $$('.fil-spot'), drawing = $('#drawing'), card = $('#ool-card');
  function showProb(i) {
    var p = PROBS[i];
    spots.forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-p') === i ? 'true' : 'false'); });
    $$('.prob', drawing).forEach(function (g) { g.classList.toggle('is-true', +g.getAttribute('data-p') === i); });
    $('#ool-no').textContent = 'Problem ' + (i + 1) + ' of 5';
    $('#ool-title').textContent = p.t;
    var im = $('#ool-img'); im.src = p.img; im.alt = p.alt; im.removeAttribute('loading');
    $('#ool-cap').textContent = p.cap;
    $('#ool-look').textContent = p.look;
    $('#ool-means').textContent = p.means;
    var dd = $('#ool-svc'); dd.textContent = '';
    p.svc.forEach(function (s, n) {
      if (n) dd.appendChild(document.createTextNode(' and '));
      var a = document.createElement('a'); a.href = '#services'; a.setAttribute('data-svc', s); a.textContent = SNAMES[s]; dd.appendChild(a);
    });
    $('#draw-note').textContent = 'Problem ' + (i + 1) + ' has settled into line. Tap another number.';
    card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap');
  }
  spots.forEach(function (b) { b.addEventListener('click', function () { showProb(+b.getAttribute('data-p')); }); });
  showProb(0);

  /* ---- 2. services as courses ---- */
  var tabs = $$('.fil-tab'), panel = $('#svc-panel');
  function showSvc(i) {
    var s = SVC[i];
    tabs.forEach(function (t, k) { var on = k === i; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
    panel.setAttribute('aria-labelledby', 'tab-' + i);
    var im = $('#svc-img'); im.src = s.img; im.alt = s.alt; im.removeAttribute('loading');
    $('#svc-cap').textContent = 'Illustrative photo';
    $('#svc-no').textContent = 'Course ' + (i + 1) + ' of 4';
    $('#svc-title').textContent = s.t; $('#svc-text').textContent = s.text;
    panel.classList.remove('is-swap'); void panel.offsetWidth; panel.classList.add('is-swap');
  }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { showSvc(i); }); });
  tabs.forEach(function (t, i) {
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!n) return; e.preventDefault(); var k = (i + n + tabs.length) % tabs.length; showSvc(k); tabs[k].focus();
    });
  });
  showSvc(0);

  /* ---- 3. storm check ---- */
  var boxes = $$('#checks input'), score = $('#score');
  function tally() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    score.classList.toggle('has', n > 0);
    score.textContent = n === 0 ? 'Nothing ticked yet.' : n + ' of 5 ticked. Worth a call to Fall In Line.';
  }
  boxes.forEach(function (b) { b.addEventListener('change', tally); });

  /* ---- 4. gallery filter ---- */
  var chips = $$('.fil-chip'), strip = $('#strip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      strip.classList.toggle('filtered', f !== 'all');
      $$('.g', strip).forEach(function (g) { g.classList.toggle('is-off', f !== 'all' && g.getAttribute('data-c') !== f); });
    });
  });
})();
