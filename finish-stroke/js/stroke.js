/* Finish Stroke: one brush trail through the page (drawn as you scroll, ending at the quote form),
   unrolling service scrolls, and the "before the first stroke" steps. */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. Hanging scrolls: one open at a time */
  var scrolls = $$('.fs-scroll');
  scrolls.forEach(function (sc) {
    var btn = sc.querySelector('.fs-scroll-btn');
    btn.addEventListener('click', function () {
      scrolls.forEach(function (o) {
        var on = o === sc;
        o.classList.toggle('is-open', on);
        o.querySelector('.fs-scroll-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      setTimeout(build, 700);
    });
  });

  /* 2. Before the first stroke: steps */
  var STEPS = [
    ['Clear the walls', 'Move furniture to the middle of the room and take down pictures, shelves and curtains, so every wall can be reached in one pass.'],
    ['Take off plates', 'Switch plates and outlet covers come off with a screwdriver. Keep the screws in a labelled bag so nothing goes missing.'],
    ['Wash the greasy spots', 'Kitchen walls and the area around light switches: mild soap and water, then let them dry. Paint does not grip grease.'],
    ['Point out the damage', 'Show the holes, cracks and water stains before work starts, so they are patched and primed before any colour goes on.'],
    ['Live with a sample', 'Paint a patch of the colour on two walls and look at it in morning and evening light before choosing.']
  ];
  var stepBtns = $$('.fs-step');
  var panel = document.querySelector('.fs-panel');
  var at = 0;
  function showStep(i) {
    at = (i + STEPS.length) % STEPS.length;
    stepBtns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === at ? 'true' : 'false'); });
    if (!panel) return;
    panel.querySelector('[data-out=n]').textContent = String(at + 1);
    panel.querySelector('[data-out=t]').textContent = STEPS[at][0];
    panel.querySelector('[data-out=d]').textContent = STEPS[at][1];
    if (panel.animate) panel.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 300 });
  }
  stepBtns.forEach(function (b, k) { b.addEventListener('click', function () { showStep(k); }); });
  var next = document.querySelector('.fs-step-next');
  if (next) next.addEventListener('click', function () { showStep(at + 1); });

  /* 3. The brush trail */
  var main = document.querySelector('.fs-main');
  var svg = document.querySelector('.fs-trail');
  if (!main || !svg) return;
  var path = svg.querySelector('.fs-trail-path'), wash = svg.querySelector('.fs-trail-wash');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var table = [], total = 0, best = 0;

  function anchors(el, mainRect) {
    var r = el.getBoundingClientRect();
    var f = function (s, base, size) { return s.slice(-2) === 'px' ? base + parseFloat(s) : base + parseFloat(s) * size; };
    var phone = window.matchMedia('(max-width: 900px)').matches;
    return (el.getAttribute('data-trail') || '').split(';').map(function (a) {
      var v = a.trim().split(/\s+/);
      if (v[3] === 'd' && phone) return null;
      return [f(v[0], r.left - mainRect.left, r.width), f(v[1] || '0', r.top - mainRect.top, r.height), parseFloat(v[2] || '0')];
    }).filter(Boolean);
  }
  function smooth(p) {
    if (p.length < 2) return '';
    var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function build() {
    var mr = main.getBoundingClientRect();
    svg.style.height = main.scrollHeight + 'px';
    svg.setAttribute('viewBox', '0 0 ' + mr.width + ' ' + main.scrollHeight);
    var pts = [];
    $$('[data-trail]', main).forEach(function (el) { if (el.offsetParent !== null) pts = pts.concat(anchors(el, mr)); });
    pts.sort(function (a, b) { return a[2] - b[2]; });
    var d = smooth(pts);
    path.setAttribute('d', d); wash.setAttribute('d', d);
    total = path.getTotalLength();
    table = [];
    for (var i = 0; i <= 300; i++) { var pt = path.getPointAtLength(total * i / 300); table.push(pt.y); }
    path.style.strokeDasharray = total; wash.style.strokeDasharray = total;
    best = still ? 1 : Math.max(best, 0);
    draw();
  }
  function draw() {
    if (!total) return;
    var mr = main.getBoundingClientRect();
    var y = window.innerHeight * 0.78 - mr.top, k = 0;
    while (k < table.length - 1 && table[k + 1] <= y) k++;
    best = Math.max(best, k / (table.length - 1));
    path.style.strokeDashoffset = total * (1 - best);
    wash.style.strokeDashoffset = total * (1 - best);
  }
  var t;
  window.addEventListener('scroll', function () { window.requestAnimationFrame(draw); }, { passive: true });
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  build();
})();
