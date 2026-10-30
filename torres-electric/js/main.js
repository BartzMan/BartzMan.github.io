/* Torres Electric: master switch + ceiling fan, wiring-chart routing, field-note lightbox, breaker house. Vanilla JS. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var root = document.documentElement;

  /* ---- reveals ---- */
  var sel = ['.disp', '.lead', '.sub', '.chart-head', '.dos-tx', '.pr', '.breakers', '.house', '.panel-ph', '.ccard', '.qf', '.giant', '.tb-cell'];
  var tg = [];
  sel.forEach(function (s) { $$(s).forEach(function (el, i) { el.classList.add('rv'); el.style.setProperty('--d', String(i % 5)); tg.push(el); }); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    tg.forEach(function (t) { io.observe(t); });
  } else { tg.forEach(function (t) { t.classList.add('in'); }); }

  /* ---- 1. master switch + ceiling fan (spins up and down with easing) ---- */
  var switches = $$('[data-power-switch]'), prop = $('.prop'), spin = $('.p-spin'), reads = $$('[data-power-read]'), hint = $('#hint span');
  var on = false, speed = 0, angle = 0, last = 0, touched = false, rafId = 0;
  function paint() {
    root.setAttribute('data-power', on ? 'on' : 'off');
    switches.forEach(function (s) { s.setAttribute('aria-checked', on ? 'true' : 'false'); });
    reads.forEach(function (r) { r.textContent = on ? 'ON' : 'OFF'; });
    if (hint) hint.textContent = on ? 'Power is on. Flip it again to bring the fan to rest.' : 'The master switch is live. Flip it and watch the ceiling fan.';
  }
  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    var target = on ? 1 : 0;
    speed += (target - speed) * Math.min(1, dt * (on ? 1.6 : 1.1));
    if (Math.abs(target - speed) < 0.003) speed = target;
    angle = (angle + speed * 1500 * dt) % 360;
    if (spin) spin.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';
    if (prop) prop.style.setProperty('--spd', speed.toFixed(3));
    if (speed > 0 || on) rafId = requestAnimationFrame(loop); else rafId = 0;
  }
  function setPower(v, user) {
    on = v; if (user) touched = true; paint();
    if (reduce) { speed = v ? 1 : 0; if (prop) prop.style.setProperty('--spd', speed); return; }
    if (!rafId) { last = performance.now(); rafId = requestAnimationFrame(loop); }
  }
  switches.forEach(function (s) { s.addEventListener('click', function () { setPower(!on, true); }); });
  paint();
  setTimeout(function () { if (!touched) setPower(true, false); }, reduce ? 200 : 1800);

  /* ---- header, progress, wire line, spark ---- */
  var bar = $('#bar'), fl = $('.fline'), flD = $('#flineD'), flP = $('#flineP'), fly = $('#fly'), day = $('.town'), dayBg = $('#townBg');
  var ticking = false;
  function frame() {
    ticking = false;
    var max = Math.max(1, root.scrollHeight - innerHeight), p = clamp(scrollY / max, 0, 1);
    bar.style.setProperty('--p', p.toFixed(4)); bar.classList.toggle('solid', scrollY > 30);
    if (fl) fl.style.setProperty('--p', p.toFixed(4));
    if (day) {
      var r = day.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        var q = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
        if (!reduce) { dayBg.style.setProperty('--py', ((r.top - innerHeight / 2) * -0.08).toFixed(1) + 'px'); }
        fly.style.transform = 'translate(' + (-160 + q * (r.width + 320)).toFixed(0) + 'px,' + (Math.sin(q * Math.PI * 2) * -26).toFixed(0) + 'px) rotate(' + (Math.cos(q * Math.PI * 2) * -6).toFixed(1) + 'deg)';
      }
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } });
  frame();

  /* ---- menu ---- */
  var ham = $('#ham'), dr = $('#drawer');
  function menu(open) {
    dr.classList.toggle('open', open); dr.setAttribute('aria-hidden', open ? 'false' : 'true');
    ham.setAttribute('aria-expanded', open ? 'true' : 'false'); ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  ham.addEventListener('click', function () { menu(!dr.classList.contains('open')); });
  $$('a', dr).forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
  addEventListener('resize', function () { if (innerWidth >= 1000) menu(false); });

  /* ---- 2. wiring chart: a spark runs the wire to the chosen field ---- */
  var route = $('#route'), plane = $('#plane'), flds = $$('.fld'), glows = [$('#wireGlowW'), $('#wireGlowT')], paths = [$('#wirePathW'), $('#wirePathT')];
  var DOS = [
    { n: 'FIELD 01 / 04', h: 'Meters & service', p: 'Meter bases, service entrances and the conduit that joins them to the panel, wired by Torres Electric.', c: 'Plate 01 · A meter, panel and conduit run on an exterior wall.' },
    { n: 'FIELD 02 / 04', h: 'Panels & disconnects', p: 'Service panels, disconnects and breakers: opened up, tested and wired so every circuit is easy to read.', c: 'Plate 02 · A disconnect and meter, with a clamp meter on the door.' },
    { n: 'FIELD 03 / 04', h: 'Lighting & fans', p: 'Recessed lighting and ceiling fans, with the switching that goes with them, in covered outdoor living areas and rooms.', c: 'Plate 03 · Recessed lights and ceiling fans over a stone fireplace.' },
    { n: 'FIELD 04 / 04', h: 'Testing & repairs', p: 'Hands-on work inside meter bases and service equipment, from connections through to testing.', c: 'Plate 04 · Working inside a meter base on a brick wall.' }
  ];
  var T = [0, 0.335, 0.675, 1], cur = 0, tPos = 0, anim = 0;
  function wideMode() { return innerWidth >= 1000; }
  function posOnPath(t) {
    var w = wideMode(), path = paths[w ? 0 : 1], vb = w ? [1000, 420] : [400, 700];
    var L = path.getTotalLength(), pt = path.getPointAtLength(L * t), pt2 = path.getPointAtLength(Math.min(L, L * t + 4));
    var rect = route.getBoundingClientRect();
    var sx = rect.width / vb[0], sy = rect.height / vb[1];
    return { x: pt.x * sx, y: pt.y * sy, a: Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI, L: L };
  }
  function drawPlane(t) {
    var p = posOnPath(t); plane.style.left = p.x + 'px'; plane.style.top = p.y + 'px'; plane.style.transform = 'rotate(' + p.a.toFixed(1) + 'deg)';
  }
  function glow(t) {
    var w = wideMode(), sc = route.getBoundingClientRect().width / (w ? 1000 : 400);
    glows.forEach(function (g, i) { var L = paths[i].getTotalLength() * sc; g.style.setProperty('--len', L.toFixed(1) + 'px'); g.style.setProperty('--off', (L - L * t).toFixed(1) + 'px'); });
  }
  function goField(i) {
    cur = i; var from = tPos, to = T[i], t0 = performance.now(), dur = reduce ? 1 : 900;
    cancelAnimationFrame(anim); glow(to);
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      tPos = from + (to - from) * e; drawPlane(tPos); if (k < 1) anim = requestAnimationFrame(step);
    })(t0);
    flds.forEach(function (f, k) { f.classList.toggle('is-on', k === i); f.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    var d = DOS[i]; $('#dosNo').textContent = d.n; $('#dosH').textContent = d.h; $('#dosP').textContent = d.p; $('#dosCap').textContent = d.c;
    $$('.dos-ph img').forEach(function (im, k) { im.classList.toggle('on', k === i); });
  }
  if (route) {
    flds.forEach(function (f, i) { f.addEventListener('click', function () { goField(i); }); });
    addEventListener('resize', function () { glow(T[cur]); drawPlane(tPos); });
    tPos = 0; glow(0); drawPlane(0); goField(0);
  }

  /* ---- 3. field notes lightbox ---- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lastBtn = null;
  function openLb(btn) {
    var im = $('img', btn); if (!im) return; lastBtn = btn;
    var big = im.getAttribute('src'); lbImg.src = big; lbImg.alt = im.alt; lbCap.textContent = btn.getAttribute('data-cap').replace(/&middot;/g, '·');
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  }
  function closeLb() { if (lb.close) lb.close(); else lb.removeAttribute('open'); if (lastBtn) lastBtn.focus(); }
  if (lb) {
    $$('.pr').forEach(function (b) { b.addEventListener('click', function () { openLb(b); }); });
    $('#lbX').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }

  /* ---- 4. breakers light the rooms ---- */
  var brks = $$('.brk'), rms = $$('.rm'), allBtn = $('#allBrk'), allTx = $('#allTx');
  function setRoom(i, v) { brks[i].setAttribute('aria-pressed', v ? 'true' : 'false'); rms[i].classList.toggle('on', v); }
  function syncAll() { var n = brks.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length; allTx.textContent = n === brks.length ? 'Main breaker: all off' : 'Main breaker: all on'; }
  brks.forEach(function (b, i) { b.addEventListener('click', function () { setRoom(i, b.getAttribute('aria-pressed') !== 'true'); syncAll(); }); });
  if (allBtn) allBtn.addEventListener('click', function () {
    var n = brks.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length, v = n !== brks.length;
    brks.forEach(function (b, i) { setTimeout(function () { setRoom(i, v); syncAll(); }, reduce ? 0 : i * 90); });
  });
  if ('IntersectionObserver' in window && !reduce && $('#house')) {
    var h = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { h.disconnect(); [0, 2, 5].forEach(function (i, k) { setTimeout(function () { setRoom(i, true); syncAll(); }, 500 + k * 350); }); } }); }, { threshold: 0.5 });
    h.observe($('#house'));
  }

  /* ---- 5. quote form ---- */
  var chips = $$('.cp'), det = $('#details');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var s = chips.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.getAttribute('data-v'); });
      var rest = det.value.split('\n'); if (/^Needs:/.test(rest[0])) rest.shift();
      det.value = (s.length ? 'Needs: ' + s.join(', ') + '\n' : '') + rest.join('\n');
    });
  });
  var qf = $('#qf'); if (qf) qf.addEventListener('submit', function (e) { e.preventDefault(); });
  var up = $('#toTop'); if (up) up.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
