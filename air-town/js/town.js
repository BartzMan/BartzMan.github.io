/* Air Town - behaviour. Vanilla JS. The town goes from hot to cool as you scroll. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* reveal */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add('in'); }); }

  /* menu */
  var burger = $('#burger'), sheet = $('#sheet');
  function setMenu(open) {
    sheet.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  $$('[data-close]', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---- global heat: scroll cools the whole town ---- */
  var head = $('#head'), thout = $('#thout');
  var forced = false, target = 0, cur = 0;
  var strips = $$('.strip:not(.night):not(.mini)').map(function (s) {
    var hs = $$('.house', s);
    return { hs: hs, n: hs.length };
  });
  var progress = 0;
  function targetHeat() { return forced ? 1 : Math.min(1, progress * 1.18); }
  function apply() {
    root.style.setProperty('--h', cur.toFixed(3));
    thout.textContent = cur < 0.34 ? 'hot' : (cur < 0.68 ? 'warm' : 'cool');
    strips.forEach(function (st) {
      st.hs.forEach(function (h, i) {
        var thr = (i + 1) / (st.n + 1) * 0.94;
        var on = cur >= thr;
        if (on !== h.classList.contains('cool')) h.classList.toggle('cool', on);
      });
    });
  }
  function tick() {
    target = targetHeat();
    var d = target - cur;
    if (Math.abs(d) > 0.002) { cur += d * (reduce ? 1 : 0.075); apply(); requestAnimationFrame(tick); }
    else { if (cur !== target) { cur = target; apply(); } running = false; }
  }
  var running = false;
  function kick() { if (!running) { running = true; requestAnimationFrame(tick); } }

  /* van drives along the road */
  var van = $('#van'), road = $('.at-road'), lim = $('#localimg'), lsec = lim && lim.parentNode;
  function onScroll() {
    var y = window.scrollY || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress = Math.min(1, y / max);
    head.classList.toggle('is-solid', y > 40);
    kick();
    var vh = window.innerHeight;
    if (van && !reduce) {
      var r = road.getBoundingClientRect();
      var t = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      var w = road.clientWidth, vw = van.getBoundingClientRect().width || 160;
      van.style.transform = 'translateX(' + ((t * (w + vw * 2)) - vw).toFixed(1) + 'px)';
    }
    if (lim && !reduce) {
      var q = lsec.getBoundingClientRect();
      if (q.bottom > 0 && q.top < vh) {
        var k = (q.top + q.height / 2 - vh / 2) / vh;
        lim.style.transform = 'translate3d(0,' + (k * -40).toFixed(1) + 'px,0)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- A/C switch (hero) ---- */
  var ac = $('#acbtn'), aclab = $('#aclab');
  ac.addEventListener('click', function () {
    forced = !forced;
    ac.setAttribute('aria-pressed', forced ? 'true' : 'false');
    aclab.textContent = forced ? 'A/C is on' : 'Turn on the A/C';
    kick();
  });

  /* ---- Main Street rail: drag sideways, cool a house ---- */
  var rail = $('#rail');
  var down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - sx;
    if (!moved && Math.abs(dx) > 6) { moved = true; rail.classList.add('drag'); }
    if (moved) rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', function () { if (down) { down = false; setTimeout(function () { rail.classList.remove('drag'); }, 0); } });
  rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  $$('.at-card', rail).forEach(function (c) {
    var b = $('.tg', c), o = $('output', c);
    b.addEventListener('click', function () {
      var on = !c.classList.contains('cool');
      c.classList.toggle('cool', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Warm it back up' : 'Cool this house';
      o.textContent = on ? 'Cool inside' : 'Hot day';
    });
  });

  /* ---- thermostat ---- */
  var range = $('#trange'), big = $('#tbig'), tset = $('#tset'), tmode = $('#tmode'), dial = $('#dial');
  var mini = $$('.strip.mini .house');
  function setT(v) {
    v = Math.max(60, Math.min(90, v));
    range.value = v;
    big.firstChild.nodeValue = String(v);
    tset.textContent = v + '°F';
    tmode.textContent = v <= 72 ? 'Cooling the whole town' : (v <= 78 ? 'Cooling Main Street' : 'A/C resting. Warm out there.');
    dial.style.setProperty('--ts', ((90 - v) / 30).toFixed(3));
    dial.classList.toggle('is-cool', v <= 76);
    mini.forEach(function (h, j) { h.classList.toggle('cool', v <= 84 - j * 4); });
  }
  range.addEventListener('input', function () { setT(+range.value); });
  $('#tdn').addEventListener('click', function () { setT(+range.value - 1); });
  $('#tup').addEventListener('click', function () { setT(+range.value + 1); });
  setT(75);

  /* form: preview only */
  $('#request').addEventListener('submit', function (e) { e.preventDefault(); });
})();
