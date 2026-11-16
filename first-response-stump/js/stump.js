(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* RUN BOARD: tabs */
  var tabs = $$('.run-card'), panels = $$('.run-panel');
  function pick(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (panels[k]) panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); pick((i + 1) % n, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); pick((i + n - 1) % n, true); }
    });
  });
  $$('.unit-strip a').forEach(function (a) {
    a.addEventListener('click', function () { pick(parseInt(a.getAttribute('data-run'), 10) || 0); });
  });

  /* DEPTH CHECK: stump cross-section */
  var svg = $('#depth-svg');
  if (svg) {
    var states = [
      { t: 'Stump standing', x: 'This is what you see above the soil line, plus the flare of wood just under it. The soil line is called grade.', top: 60 },
      { t: 'Ground to grade', x: 'The grinder cuts the stump down until it is level with the soil. Chips pile up around the spot. The stump is gone from sight and the mower can pass over.', top: 190 },
      { t: 'Below grade', x: 'Cut deeper, to a few inches under the surface, and the hole fills with chips or soil. This is the usual choice when you plan to sod, seed or plant on the spot.', top: 252 },
      { t: 'The roots', x: 'The large roots under the surface normally stay in the ground and break down over the years. Grinding takes the stump, it does not dig the roots out.', top: 252 }
    ];
    var clip = $('#clip-rect'), ell = [$('#top-ell'), $('#top-ell2'), $('#top-ell3')], wheel = $('#wheel'), chips = $('#chips'), hole = $('#hole'), dmark = $('#depth-mark'), rl = $('#roots-lab'), fill = $('#chip-fill');
    var btns = $$('.depth-btn'), slider = $('#depth-slider'), cur = 60, raf = 0;
    function draw(y) {
      cur = y;
      clip.setAttribute('y', y);
      clip.setAttribute('height', 380 - y);
      ell.forEach(function (e) { e.setAttribute('cy', y); });
      wheel.setAttribute('transform', 'translate(320 ' + (y - 6) + ')');
      var open = y > 190;
      hole.setAttribute('opacity', open ? 1 : 0);
      if (open) hole.firstElementChild.setAttribute('height', Math.max(0, y - 190));
      fill.setAttribute('height', open ? Math.max(0, y - 190) : 0);
    }
    function go(i) {
      var s = states[i], to = s.top;
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      slider.value = i; slider.setAttribute('aria-valuetext', s.t);
      $('#depth-title').textContent = s.t; $('#depth-text').textContent = s.x;
      chips.setAttribute('opacity', i >= 1 && i < 4 ? 1 : 0);
      dmark.setAttribute('opacity', i === 2 ? 1 : 0);
      rl.setAttribute('opacity', i === 3 ? 1 : 0);
      svg.classList.toggle('show-roots', i === 3);
      wheel.setAttribute('opacity', (i === 1 || i === 2) ? 1 : 0);
      clearInterval(raf);
      if (still) { draw(to); return; }
      var from = cur, t0 = Date.now(), dur = 700;
      raf = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        draw(from + (to - from) * e);
        if (k >= 1) clearInterval(raf);
      }, 16);
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
    slider.addEventListener('input', function () { go(parseInt(slider.value, 10)); });
    draw(60);
  }

  /* STORM CHECKLIST */
  var checks = $$('.check'), n = $('#report-n');
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      n.textContent = checks.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).length;
    });
  });

  /* GALLERY FILTER */
  var chipsEl = $$('.chip'), figs = $$('.log figure');
  chipsEl.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chipsEl.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      figs.forEach(function (fg) { fg.classList.toggle('is-filtered', f !== 'all' && fg.getAttribute('data-cat') !== f); });
    });
  });
})();
