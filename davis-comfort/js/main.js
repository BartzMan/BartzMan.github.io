/* Davis Comfort Solutions: one season dial repaints the whole page. Vanilla JS. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var root = document.documentElement;

  /* ---- hills: generated ridgelines, one SVG path per layer ---- */
  var CFG = {
    hero: { w: 1600, h: 360, L: [['--h1', .30, .16, 3, 2.1], ['--h2', .46, .15, 7, 2.7], ['--h3', .62, .13, 11, 3.3], ['--h4', .80, .11, 17, 2.4]] },
    footer: { w: 1600, h: 220, L: [['--h2', .38, .2, 5, 2.3], ['--h3', .58, .17, 9, 2.9], ['--h4', .80, .12, 13, 2.2]] },
    wav: { w: 1600, h: 300, L: [['--h2', .42, .2, 21, 2.2], ['--h3', .62, .16, 25, 2.9], ['--paper', .86, .1, 31, 2.1]] },
    legal: { w: 1200, h: 120, L: [['--h2', .35, .25, 41, 2.4], ['--h3', .6, .2, 45, 3.1]] }
  };
  function ridge(w, h, base, amp, seed, fr) {
    var n = 28, pts = [];
    for (var i = 0; i <= n; i++) {
      var x = (i / n) * w, t = (i / n) * Math.PI * 2 * fr;
      var v = Math.sin(t + seed) * .5 + Math.sin(t * 2.1 + seed * 1.7) * .3 + Math.sin(t * 4.3 + seed * .6) * .14;
      pts.push([x, h * (base + amp * v)]);
    }
    var d = 'M0 ' + h + ' L' + pts[0][0] + ' ' + pts[0][1].toFixed(1);
    for (var k = 0; k < pts.length - 1; k++) {
      var p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(pts.length - 1, k + 2)];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ',' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ',' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + ' L' + w + ' ' + h + ' Z';
  }
  var heroGs = [];
  $$('[data-hills]').forEach(function (svg) {
    var key = svg.getAttribute('data-hills'), c = CFG[key]; if (!c) return;
    svg.setAttribute('viewBox', '0 0 ' + c.w + ' ' + c.h);
    var ns = 'http://www.w3.org/2000/svg';
    c.L.forEach(function (l, i) {
      var g = document.createElementNS(ns, 'g'), p = document.createElementNS(ns, 'path');
      p.setAttribute('d', ridge(c.w, c.h, l[1], l[2], l[3], l[4])); p.setAttribute('class', 'hl'); p.style.fill = 'var(' + l[0] + ')';
      g.appendChild(p); svg.appendChild(g); if (key === 'hero') heroGs.push(g);
    });
  });

  /* ---- falling things for the current season ---- */
  var parts = $('#parts');
  if (parts && !reduce) {
    for (var i = 0; i < 34; i++) {
      var s = document.createElement('span'); s.className = 'p';
      s.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%'); s.style.setProperty('--s', (6 + Math.random() * 11).toFixed(1) + 'px');
      s.style.setProperty('--t', (8 + Math.random() * 10).toFixed(1) + 's'); s.style.setProperty('--dl', (-Math.random() * 16).toFixed(1) + 's');
      s.style.setProperty('--dx', ((Math.random() - .5) * 260).toFixed(0) + 'px'); s.style.setProperty('--r', (180 + Math.random() * 540).toFixed(0) + 'deg');
      parts.appendChild(s);
    }
  }

  /* ---- 1. the season dial (state lives on <html data-season>) ---- */
  var SEASONS = ['winter', 'spring', 'summer', 'fall'], NAMES = { winter: 'Winter', spring: 'Spring', summer: 'Summer', fall: 'Fall' };
  var SERVICE = { winter: 'Heating', spring: 'Ductwork', summer: 'Air conditioning', fall: 'Ductless mini-splits' };
  var CAP = {
    winter: 'A furnace standing in a utility room with the framing still open.',
    spring: 'Wrapped ductwork laid along an attic floor between the rafters.',
    summer: 'A condenser unit on its pad beside a vinyl-sided house.',
    fall: 'Outdoor unit of a ductless mini-split, beside a metal-roofed house.'
  };
  var dial = $('#dial'), hand = $('#dlHand'), dbtns = $$('.dl-b'), archImgs = $$('#arch .arch-ph img'), panels = $$('.sp'), cyc = $('[data-cycle]');
  var ang = 90, cur = 'fall';
  function setSeason(k) {
    var idx = SEASONS.indexOf(k); if (idx < 0) return; cur = k;
    root.setAttribute('data-season', k);
    $$('[data-season-name]').forEach(function (e) { e.textContent = NAMES[k]; });
    if (cyc) { cyc.setAttribute('aria-label', 'Change season. Current season: ' + NAMES[k]); $('use', cyc).setAttribute('href', '#s-' + k); }
    dbtns.forEach(function (b) { var on = b.getAttribute('data-s') === k; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    var target = [180, 270, 360, 450][idx]; while (target - ang > 180) target -= 360; while (target - ang < -180) target += 360; ang = target;
    if (hand) hand.style.setProperty('--ang', ang + 'deg');
    archImgs.forEach(function (im, i) { im.classList.toggle('on', i === idx); });
    var ac = $('#archCap'), nt = $('#nowTx'); if (ac) ac.textContent = CAP[k]; if (nt) nt.textContent = SERVICE[k];
    panels.forEach(function (p) { var on = p.getAttribute('data-s') === k; p.setAttribute('data-on', on ? '1' : '0'); $('.sp-h', p).setAttribute('aria-expanded', on ? 'true' : 'false'); });
    var tm = document.querySelector('meta[name="theme-color"]');
  }
  if (dial) {
    dbtns.forEach(function (b) { b.addEventListener('click', function () { setSeason(b.getAttribute('data-s')); }); });
    var dragging = false;
    var fromPointer = function (e) {
      var r = dial.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < r.width * 0.12) return;
      var a = Math.atan2(dy, dx) * 180 / Math.PI, idx = Math.round((((a + 90) % 360 + 360) % 360) / 90) % 4; setSeason(SEASONS[idx]);
    };
    dial.addEventListener('pointerdown', function (e) { dragging = true; try { dial.setPointerCapture(e.pointerId); } catch (x) {} fromPointer(e); });
    dial.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
    dial.addEventListener('pointerup', function () { dragging = false; });
    dial.addEventListener('pointercancel', function () { dragging = false; });
    dial.addEventListener('keydown', function (e) {
      var i = SEASONS.indexOf(cur), d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
      if (!d) return; e.preventDefault(); setSeason(SEASONS[(i + d + 4) % 4]); dbtns[(i + d + 4) % 4].focus();
    });
  }
  if (cyc) cyc.addEventListener('click', function () { setSeason(SEASONS[(SEASONS.indexOf(cur) + 1) % 4]); });
  panels.forEach(function (p) { $('.sp-h', p).addEventListener('click', function () { setSeason(p.getAttribute('data-s')); }); });
  /* start on the season the visitor is actually in */
  var m = new Date().getMonth(); setSeason(m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'fall');

  /* ---- reveals ---- */
  var sel = ['.disp', '.lead', '.sp', '.ph', '.card', '.qf', '.giant', '.ft-col'], tg = [];
  sel.forEach(function (s) { $$(s).forEach(function (el, i) { el.classList.add('rv'); el.style.setProperty('--d', String(i % 4)); tg.push(el); }); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    tg.forEach(function (t) { io.observe(t); });
  } else { tg.forEach(function (t) { t.classList.add('in'); }); }

  /* ---- scroll: header, progress, hill parallax, banner parallax ---- */
  var hd = $('#hd'), wav = $('.wav'), wph = $('.wav-ph'), mx = .5, ticking = false;
  function frame() {
    ticking = false;
    var max = Math.max(1, root.scrollHeight - innerHeight), p = clamp(scrollY / max, 0, 1);
    hd.style.setProperty('--p', p.toFixed(4)); hd.classList.toggle('solid', scrollY > 30);
    if (!reduce) {
      heroGs.forEach(function (g, k) { g.style.transform = 'translate3d(' + (((mx - .5) * -34 * (k + 1)) + scrollY * .028 * (k - 1.5)).toFixed(1) + 'px,' + (-scrollY * .02 * k).toFixed(1) + 'px,0)'; });
      if (wav) { var r = wav.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) wph.style.setProperty('--py', ((r.top - innerHeight / 2) * -.09).toFixed(1) + 'px'); }
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } });
  document.addEventListener('mousemove', function (e) { mx = e.clientX / innerWidth; if (!ticking) { ticking = true; requestAnimationFrame(frame); } });
  frame();

  /* ---- menu ---- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(o) { menu.classList.toggle('open', o); menu.setAttribute('aria-hidden', o ? 'false' : 'true'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); document.body.style.overflow = o ? 'hidden' : ''; }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', function () { if (innerWidth >= 1000) setMenu(false); });

  /* ---- photo filter ---- */
  var chipsF = $$('.fchip'), figs = $$('.ph');
  chipsF.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chipsF.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      figs.forEach(function (fg) {
        var show = f === 'all' || fg.getAttribute('data-c').split(' ').indexOf(f) > -1;
        fg.classList.toggle('out', !show);
        if (show) { fg.classList.remove('in2'); void fg.offsetWidth; fg.classList.add('in2'); }
      });
    });
  });

  /* ---- quote form ---- */
  var cps = $$('.cp'), det = $('#details');
  cps.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      var s = cps.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; }).map(function (x) { return x.getAttribute('data-v'); });
      var rest = det.value.split('\n'); if (/^Needs:/.test(rest[0])) rest.shift();
      det.value = (s.length ? 'Needs: ' + s.join(', ') + '\n' : '') + rest.join('\n');
    });
  });
  var qf = $('#qf'); if (qf) qf.addEventListener('submit', function (e) { e.preventDefault(); });
  var up = $('#toTop'); if (up) up.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
