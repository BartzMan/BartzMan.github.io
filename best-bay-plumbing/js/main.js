(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  /* ---------- reveal on scroll ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (n) { io.observe(n); });
  } else { rvs.forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- mobile menu ---------- */
  var burger = $('.burger'), sheet = $('#sheet');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.classList.toggle('open', open);
    document.body.classList.toggle('lock', open);
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- scroll: pipe progress + steps fill ---------- */
  var prog = $('.prog i'), steps = $('#steps'), stepEls = $$('.step'), ticking = false;
  function onScroll() {
    ticking = false;
    var h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    if (steps) {
      var r = steps.getBoundingClientRect();
      var p = (innerHeight * 0.72 - r.top) / (r.height + 20);
      p = Math.max(0, Math.min(1, p));
      steps.style.setProperty('--p', p.toFixed(3));
      var n = stepEls.length;
      stepEls.forEach(function (s, i) { s.classList.toggle('on', p >= (i + 0.15) / n); });
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- cursor badge ---------- */
  var cur = $('.cur');
  if (cur && matchMedia('(pointer:fine)').matches && !reduce) {
    var cx = -100, cy = -100, tx = -100, ty = -100, shown = false;
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { cur.textContent = t.getAttribute('data-cursor'); cur.classList.add('on'); } else { cur.classList.remove('on'); }
      shown = true;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- THE GAUGE ---------- */
  var svg = $('#gaugeSvg'), needle = $('#needle'), gz = $('#gz'), gt = $('#gt');
  var NS = 'http://www.w3.org/2000/svg', MAX = 120, A0 = -225, SWEEP = 270;
  var ZONES = [
    { a: 0, b: 29, c: '#6f9fc2', k: 'lo', name: 'Trickle', msg: 'Showers sputter, taps fill slowly and appliances can struggle to fill. Something may be restricting the supply.' },
    { a: 30, b: 39, c: '#9cc2d9', k: 'lo', name: 'Soft', msg: 'Usable, but a shower feels weak and some fixtures run slow.' },
    { a: 40, b: 60, c: '#58b093', k: 'ok', name: 'Comfortable', msg: 'The range most household fixtures and appliances are happy in.' },
    { a: 61, b: 79, c: '#d9b25c', k: 'ok', name: 'Firm', msg: 'Strong flow. Fine for most homes, but worth keeping an eye on.' },
    { a: 80, b: 120, c: '#c8643f', k: 'hi', name: 'Too high', msg: 'Hoses, valves and fittings take extra strain, and leaks and banging pipes become more likely. Worth a look. Call (408) 334-9261.' }
  ];
  function ang(p) { return A0 + SWEEP * p / MAX; }
  function pt(r, a) { var t = a * Math.PI / 180; return [200 + r * Math.cos(t), 200 + r * Math.sin(t)]; }
  function mk(n, at) { var e = document.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); return e; }
  if (svg) {
    ZONES.forEach(function (z) {
      var s = pt(152, ang(z.a)), e = pt(152, ang(z.b + 1 > MAX ? MAX : z.b + 1));
      var large = (ang(z.b + 1) - ang(z.a)) > 180 ? 1 : 0;
      gz.appendChild(mk('path', { d: 'M' + s[0].toFixed(2) + ' ' + s[1].toFixed(2) + ' A152 152 0 ' + large + ' 1 ' + e[0].toFixed(2) + ' ' + e[1].toFixed(2), fill: 'none', stroke: z.c, 'stroke-width': 11, opacity: .92 }));
    });
    for (var v = 0; v <= MAX; v += 5) {
      var major = v % 20 === 0, a = ang(v), p1 = pt(144, a), p2 = pt(major ? 126 : 135, a);
      gt.appendChild(mk('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: '#12324d', 'stroke-width': major ? 2.6 : 1.3, 'stroke-linecap': 'round' }));
      if (major) {
        var tp = pt(107, a);
        var t = mk('text', { x: tp[0], y: tp[1] + 5, 'text-anchor': 'middle', class: 'gtxt', 'font-size': 15, 'font-weight': 500 });
        t.textContent = v; gt.appendChild(t);
      }
    }
  }
  var gnum = $('#gnum'), gstate = $('#gstate'), gmsg = $('#gmsg'), gread = $('#gread');
  var psi = 52, touched = false;
  function zoneOf(p) { for (var i = 0; i < ZONES.length; i++) if (p >= ZONES[i].a && p <= ZONES[i].b) return ZONES[i]; return ZONES[4]; }
  function setPsi(p) {
    psi = Math.max(0, Math.min(MAX, Math.round(p)));
    var z = zoneOf(psi);
    needle.style.transform = 'rotate(' + ang(psi).toFixed(2) + 'deg)';
    gnum.textContent = psi; gstate.textContent = z.name; gmsg.textContent = z.msg;
    gread.setAttribute('data-z', z.k);
    svg.setAttribute('aria-valuenow', psi); svg.setAttribute('aria-valuetext', psi + ' psi, ' + z.name.toLowerCase());
  }
  function fromEvent(e) {
    var r = svg.getBoundingClientRect(), cxp = r.left + r.width / 2, cyp = r.top + r.height / 2;
    var d = Math.atan2(e.clientY - cyp, e.clientX - cxp) * 180 / Math.PI;
    var s = (d - A0) % 360; if (s < 0) s += 360;
    if (s > SWEEP) s = s < SWEEP + (360 - SWEEP) / 2 ? SWEEP : 0;
    return s / SWEEP * MAX;
  }
  if (svg) {
    var dragging = false;
    svg.addEventListener('pointerdown', function (e) {
      dragging = true; touched = true; svg.classList.add('drag');
      try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      setPsi(fromEvent(e)); e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) { if (dragging) setPsi(fromEvent(e)); });
    var end = function () { dragging = false; svg.classList.remove('drag'); };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    svg.addEventListener('keydown', function (e) {
      var st = e.shiftKey ? 10 : 1, k = e.key, used = true;
      if (k === 'ArrowRight' || k === 'ArrowUp') setPsi(psi + st);
      else if (k === 'ArrowLeft' || k === 'ArrowDown') setPsi(psi - st);
      else if (k === 'Home') setPsi(0); else if (k === 'End') setPsi(MAX); else used = false;
      if (used) { touched = true; e.preventDefault(); }
    });
    setPsi(52);
    if (!reduce) {
      var demo = [52, 58, 66, 46, 90, 38, 54], di = 0;
      setInterval(function () { if (!touched && document.visibilityState === 'visible') { di = (di + 1) % demo.length; setPsi(demo[di]); } }, 2800);
    }
  }

  /* ---------- SERVICES: valve accordion + photo swap ---------- */
  var rows = $$('.vrow'), pics = $$('#vstack .fr'), cap = $('#vcap');
  var caps = ['Fig. 01 · Gloved hands on a fitting · illustrative stock', 'Fig. 02 · Drain pipe in a gravel trench · illustrative stock', 'Fig. 03 · Kitchen faucet, running · illustrative stock', 'Fig. 04 · Double vanity · illustrative stock', 'Fig. 05 · Valves and gauges · illustrative stock'];
  function openRow(i) {
    rows.forEach(function (r, j) {
      var on = i === j; r.classList.toggle('act', on);
      r.querySelector('.vbtn').setAttribute('aria-expanded', on ? 'true' : 'false');
      if (pics[j]) pics[j].classList.toggle('act', on);
    });
    if (cap) cap.textContent = caps[i];
  }
  rows.forEach(function (r, i) { r.querySelector('.vbtn').addEventListener('click', function () { openRow(i); }); });

  /* ---------- THE DRIP ---------- */
  var stage = $('#dstage'), valve = $('#dvalve'), dn = $('#dn'), dl = $('#dl');
  if (stage && valve) {
    var count = 0, open = true, vis = false, timer = null;
    var paint = function () { dn.textContent = ('000' + count).slice(-3); };
    var update = function () {
      var run = open && vis && !reduce;
      stage.classList.toggle('dripping', run);
      if (run && !timer) timer = setInterval(function () { count++; paint(); }, 1000);
      if (!run && timer) { clearInterval(timer); timer = null; }
      dl.textContent = !open ? 'valve closed. The drip stopped' : (reduce ? 'turn the valve to see the count' : 'drops since you got here');
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; update(); }, { threshold: 0.12 }).observe(stage);
    } else { vis = true; }
    valve.addEventListener('click', function () {
      open = !open; valve.setAttribute('aria-pressed', open ? 'false' : 'true'); update();
    });
    paint(); update();
  }

  /* ---------- GALLERY RAIL: drag + buttons ---------- */
  var rail = $('#rail'), rbar = $('#rbar');
  if (rail) {
    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('dragging');
      try { rail.setPointerCapture(e.pointerId); } catch (x) {}
    });
    rail.addEventListener('pointermove', function (e) { if (down) { moved = Math.abs(e.clientX - sx); rail.scrollLeft = sl - (e.clientX - sx); } });
    var up = function () { down = false; rail.classList.remove('dragging'); };
    rail.addEventListener('pointerup', up); rail.addEventListener('pointercancel', up);
    var step = function () { return Math.max(260, rail.clientWidth * 0.7); };
    $('#rprev').addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    $('#rnext').addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: 200 }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -200 }); e.preventDefault(); }
    });
    var barUpdate = function () {
      var m = rail.scrollWidth - rail.clientWidth; var f = m > 0 ? rail.scrollLeft / m : 0;
      var w = Math.max(14, Math.min(100, rail.clientWidth / rail.scrollWidth * 100));
      rbar.style.width = w + '%'; rbar.style.left = (f * (100 - w)) + '%';
    };
    rail.addEventListener('scroll', barUpdate, { passive: true }); addEventListener('resize', barUpdate); barUpdate();
  }

  /* ---------- quote form (preview) ---------- */
  var f = $('#qf');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = f.querySelector('.sc-form-msg');
    if (!m) { m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status'); f.appendChild(m); }
    m.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
