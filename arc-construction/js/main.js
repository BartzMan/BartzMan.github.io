(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer:fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  /* reveal */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rvs.forEach(function (n) { io.observe(n); });
  } else { rvs.forEach(function (n) { n.classList.add('in'); }); }

  /* menu */
  var burger = $('.burger'), sheet = $('#sheet');
  function setMenu(o) { burger.setAttribute('aria-expanded', o ? 'true' : 'false'); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); sheet.classList.toggle('open', o); document.body.classList.toggle('lock', o); }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* sparks */
  var layer = $('#sparks'), last = 0;
  function spark(x, y, n) {
    if (reduce || !layer) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('i'); s.className = 'sp';
      var a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 60;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px'); s.style.setProperty('--dy', (Math.sin(a) * d - 18).toFixed(1) + 'px');
      layer.appendChild(s);
      (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 750); })(s);
    }
  }
  if (fine) {
    $$('[data-spark]').forEach(function (b) {
      b.addEventListener('pointerenter', function (e) { var r = b.getBoundingClientRect(); spark(r.left + r.width / 2, r.top + r.height / 2, 10); });
    });
    var gg = $('#gg');
    if (gg) gg.addEventListener('pointermove', function (e) {
      var t = performance.now(); if (t - last < 60) return; last = t; spark(e.clientX, e.clientY, 2);
    });
  }

  /* header arch progress */
  var pfill = $('#pfill'), pkey = $('#pkey'), tick = false;
  function prog() {
    tick = false;
    var h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.max(0, Math.min(1, scrollY / h)) : 0;
    pfill.style.transform = 'scaleX(' + p + ')'; pkey.style.left = Math.max(1.5, Math.min(98.5, p * 100)) + '%';
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(prog); } }, { passive: true });
  addEventListener('resize', prog); prog();

  /* services arches */
  var cards = $$('.ac');
  cards.forEach(function (c) {
    var b = $('button.arc', c);
    b.addEventListener('click', function () {
      var open = !c.classList.contains('open');
      cards.forEach(function (o) { o.classList.remove('open'); $('button.arc', o).setAttribute('aria-expanded', 'false'); });
      if (open) { c.classList.add('open'); b.setAttribute('aria-expanded', 'true'); if (fine) { var r = b.getBoundingClientRect(); spark(r.left + r.width / 2, r.top + 30, 8); } }
    });
  });

  /* pitch */
  var rng = $('#rng'), roof = $('#roof'), roofb = $('#roofb'), courses = $('#courses'), attic = $('#attic'), rise = $('#rise'), ridge = $('#ridge'), glow = $('#ridgeglow'), ang = $('#ang');
  var pv = $('#pv'), pdeg = $('#pdeg'), pkind = $('#pkind'), ptext = $('#ptext'), trun = $('#t-run'), trise = $('#t-rise');
  var BANDS = [
    { max: 0.5, k: 'Flat', t: 'Flat roofs are not truly flat. They are built with a slight fall so water finds the drain. Membrane roofing, like the rolls in the photos above, is made for them.' },
    { max: 3.5, k: 'Low slope', t: 'A gentle slope. Water runs off slowly, so these roofs are usually covered with membrane or sheet systems rather than shingles.' },
    { max: 7.5, k: 'Conventional', t: 'The classic pitch on many houses. Water sheds easily and the roof can still be walked on.' },
    { max: 12.1, k: 'Steep', t: 'Water and snow run off fast. Steeper roofs look dramatic, and they take more care and safety gear to work on.' }
  ];
  function setPitch(v) {
    v = Math.max(0, Math.min(12, parseFloat(v) || 0));
    var ry = 256 - 20 * v, pts = '60,256 300,' + ry + ' 540,256';
    roof.setAttribute('points', pts); roofb.setAttribute('points', pts); courses.setAttribute('points', pts);
    attic.setAttribute('points', '90,262 300,' + (ry + 8) + ' 510,262');
    rise.setAttribute('y2', ry); ridge.setAttribute('cy', ry); glow.setAttribute('cy', ry);
    trise.setAttribute('y', Math.min(240, (256 + ry) / 2 + 8)); trise.textContent = (v % 1 ? v.toFixed(1) : v) + ' rise';
    var deg = Math.atan(v / 12) * 180 / Math.PI, th = deg * Math.PI / 180;
    var r0 = 70, x0 = 540, y0 = 256, sx = x0 - r0, sy = y0, ex = x0 - r0 * Math.cos(th), ey = y0 - r0 * Math.sin(th);
    ang.setAttribute('d', v === 0 ? 'M0 0' : 'M' + sx + ' ' + sy + ' A' + r0 + ' ' + r0 + ' 0 0 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1));
    pv.textContent = (v % 1 ? v.toFixed(1) : v); pdeg.textContent = deg.toFixed(1) + '°';
    var band = BANDS[BANDS.length - 1]; for (var i = 0; i < BANDS.length; i++) { if (v <= BANDS[i].max) { band = BANDS[i]; break; } }
    pkind.textContent = band.k; ptext.textContent = band.t;
    rng.setAttribute('aria-valuetext', pv.textContent + ' in 12, ' + band.k);
    $$('.pre').forEach(function (b) { b.setAttribute('aria-pressed', parseFloat(b.getAttribute('data-v')) === v ? 'true' : 'false'); });
  }
  if (rng) {
    rng.addEventListener('input', function () { setPitch(rng.value); if (fine && !reduce) { var r = ridge.getBoundingClientRect(); spark(r.left + r.width / 2, r.top + r.height / 2, 2); } });
    $$('.pre').forEach(function (b) { b.addEventListener('click', function () { rng.value = b.getAttribute('data-v'); setPitch(rng.value); }); });
    setPitch(rng.value);
  }

  /* banner arches draw on scroll */
  var arcs = $$('#arcs path'), ban = $('#bronx');
  arcs.forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p._L = L; });
  function drawArcs() {
    if (!ban) return; var r = ban.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height * 0.3)));
    var q = Math.min(1, p * 1.7);
    arcs.forEach(function (a, i) { var t = Math.max(0, Math.min(1, q * 1.6 - i * 0.18)); a.style.strokeDashoffset = a._L * (1 - (reduce ? 1 : t)); });
  }
  addEventListener('scroll', drawArcs, { passive: true }); addEventListener('resize', drawArcs); drawArcs();

  /* form (preview) */
  var f = $('#qf');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = f.querySelector('.sc-form-msg');
    if (!m) { m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status'); f.appendChild(m); }
    m.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
