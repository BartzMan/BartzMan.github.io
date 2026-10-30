/* Classic Electric - motion + interaction (27 Oct 2026). One-shot or visitor-triggered only; reduced motion = final states at once. */
(function () {
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = w.matchMedia && w.matchMedia('(hover: none), (pointer: coarse)').matches;
  var hasIO = 'IntersectionObserver' in w;
  function $$(s, r) { return [].slice.call((r || d).querySelectorAll(s)); }

  // once(el, fn, margin): run fn the first time el comes into view
  function once(els, fn, margin) {
    if (!els.length) return;
    if (reduce || !hasIO) { els.forEach(fn); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
    }, { threshold: 0, rootMargin: margin || '0px 0px -16% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function inView(el) { el.classList.add('in'); }

  // ---- shared staggered reveals ----
  var groups = [
    ['.sec-head > div, .sec-head > p', ''], ['.row', ''], ['.house-ph', ''], ['.cut', 'rv-l'], ['.house-side .brk, .house-side .brk-hint, .legend li', 'rv-r'],
    ['.area-copy > *', ''], ['.area-map', 'rv-r'], ['.proc-head > div', ''], ['.node', ''], ['.formside', 'rv-r'], ['.info .kick, .info .two, .info .send', '']
  ];
  groups.forEach(function (g) {
    $$(g[0]).forEach(function (el, i) {
      el.classList.add('rv'); if (g[1]) el.classList.add(g[1]);
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i % 6) * 0.09 + 's');
    });
  });
  $$('.row').forEach(function (el) { el.style.setProperty('--d', '0s'); });
  once($$('.rv'), inView);

  // strip, banner, map, card, footer, process photo: one-shot "in" states
  $$('.strip .wrap > div svg').forEach(function (s, i) { s.style.setProperty('--d', i * 0.18 + 's'); });
  $$('.ftr-rail i').forEach(function (s, i) { s.style.setProperty('--i', i); });
  $$('.lines li').forEach(function (s, i) { s.style.setProperty('--i', i); });
  $$('.mtrace').forEach(function (p, i) { p.style.setProperty('--d', (0.3 + i * 0.22) + 's'); });
  $$('.mnode').forEach(function (c, i) { c.style.setProperty('--d', (1.1 + i * 0.07) + 's'); });
  once($$('.strip, .area-banner, .area-map, .card, .proc-ph'), inView);
  once($$('.ftr'), inView, '0px 0px -5% 0px');

  // ticks light one after another when a row is lit
  $$('.row .ticks').forEach(function (ul) { $$('li', ul).forEach(function (li, i) { li.style.setProperty('--i', i); }); });

  // ---- services: on touch screens the row nearest the middle of the screen lights up (hover does it on desktop) ----
  if (coarse && hasIO) {
    var mid = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('on', e.isIntersecting); });
    }, { threshold: 0, rootMargin: '-42% 0px -42% 0px' });
    $$('.row').forEach(function (r) { mid.observe(r); });
  }

  // ---- inside the house: main breaker ----
  var house = d.getElementById('inside'), brk = d.querySelector('.brk');
  if (house && brk) {
    var state = brk.querySelector('.brk-state'), hint = d.querySelector('.brk-hint');
    $$('.cut .wires path').forEach(function (p, i) { p.style.setProperty('--d', [0, 0.25, 0.15, 0.45][i] + 's'); });
    $$('.cut .cone').forEach(function (c, i) { c.style.setProperty('--d', (0.55 + i * 0.16) + 's'); });
    var touched = false;
    var set = function (on) {
      brk.setAttribute('aria-pressed', on ? 'true' : 'false');
      state.textContent = on ? 'On' : 'Off';
      house.classList.toggle('off', !on);
      house.classList.remove('live');
      if (on) { void house.offsetWidth; house.classList.add('live'); }
      if (hint) hint.textContent = on ? 'Power is on. Flip it again to switch the house off.' : 'Flip it to power the house';
    };
    if (reduce) { set(true); }
    else {
      set(false);
      // the first time the drawing is well in view the power comes on by itself, once
      once([d.querySelector('.cut')], function () { w.setTimeout(function () { if (!touched) set(true); }, 700); }, '0px 0px -35% 0px');
    }
    brk.addEventListener('click', function () { touched = true; set(brk.getAttribute('aria-pressed') !== 'true'); });

    // legend item <-> numbered callout in the drawing
    var calls = {};
    $$('.cut .call').forEach(function (g) { calls[g.getAttribute('data-call')] = g; });
    $$('.legend li[data-call]').forEach(function (li) {
      var g = calls[li.getAttribute('data-call')];
      var on = function () { li.classList.add('hi'); if (g) g.classList.add('hi'); };
      var off = function () { li.classList.remove('hi'); if (g) g.classList.remove('hi'); };
      li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
      li.addEventListener('click', function () {
        var was = li.classList.contains('hi');
        $$('.legend li.hi').forEach(function (x) { x.classList.remove('hi'); });
        $$('.cut .call.hi').forEach(function (x) { x.classList.remove('hi'); });
        if (!was) on();
      });
    });
  }

  // ---- service area: chips find their label on the map ----
  var map = d.querySelector('.area-map .map');
  if (map) {
    var chips = $$('.rail .chip');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var was = c.getAttribute('aria-pressed') === 'true';
        chips.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        $$('.hood', map).forEach(function (h) { h.classList.remove('hi'); });
        map.classList.toggle('picking', !was);
        if (!was) {
          c.setAttribute('aria-pressed', 'true');
          var h = map.querySelector('.hood[data-hood="' + c.getAttribute('data-hood') + '"]');
          if (h) { h.classList.add('hi'); h.parentNode.appendChild(h); }
          if (w.innerWidth <= 980) { var m = d.querySelector('.area-map'); var r = m.getBoundingClientRect(); if (r.top > w.innerHeight * .5 || r.bottom < 80) m.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
        }
      });
    });
  }

  // ---- 89115 meter: the big zip counts up once ----
  var zip = d.querySelector('.zip[data-count]');
  if (zip && !reduce) {
    var target = +zip.getAttribute('data-count');
    zip.textContent = '00000';
    once([zip.parentNode], function () {
      var t0 = null, dur = 1600;
      var step = function (t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        zip.textContent = String(Math.round(target * e)).padStart(5, '0');
        if (k < 1) w.requestAnimationFrame(step);
      };
      w.requestAnimationFrame(step);
    }, '0px 0px -30% 0px');
  }

  // ---- process: copper fills the line as you scroll; steps light when reached ----
  var nodes = d.querySelector('.nodes');
  if (nodes) {
    var items = $$('.node', nodes), ticking = false;
    var update = function () {
      ticking = false;
      var r = nodes.getBoundingClientRect(), vh = w.innerHeight;
      if (w.innerWidth > 980) {
        var p = Math.max(0, Math.min(1, (vh * 0.86 - r.top) / (vh * 0.5)));
        nodes.style.setProperty('--p', p.toFixed(3));
        items.forEach(function (n, i) { if (p >= (i / (items.length - 1)) * 0.96) n.classList.add('lit'); else n.classList.remove('lit'); });
      } else {
        items.forEach(function (n) { var b = n.getBoundingClientRect(); n.classList.toggle('lit', b.top < vh * 0.62 && b.bottom > 0); });
      }
    };
    if (reduce) { nodes.style.setProperty('--p', 1); items.forEach(function (n) { n.classList.add('lit'); }); }
    else {
      w.addEventListener('scroll', function () { if (!ticking) { ticking = true; w.requestAnimationFrame(update); } }, { passive: true });
      w.addEventListener('resize', update);
      update();
    }
  }
})();
