/* Trade Services: heat index. --h = 1 (104F) .. 0 (72F) drives every colour on the page. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- the comfort dial ---------- */
  var svg = $('#dialSvg'), knob = $('#knob'), needle = $('#needle');
  var CX = 220, CY = 215, R = 170, TMIN = 72, TMAX = 104;
  var h = 1, anim = null;
  var NS = 'http://www.w3.org/2000/svg';

  (function ticks() {
    var g = $('#ticks'); if (!g) return;
    for (var t = TMIN; t <= TMAX; t += 4) {
      var a = Math.PI * (1 - (t - TMIN) / (TMAX - TMIN));
      var x1 = CX + (R + 18) * Math.cos(a), y1 = CY - (R + 18) * Math.sin(a);
      var x2 = CX + (R + 28) * Math.cos(a), y2 = CY - (R + 28) * Math.sin(a);
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('class', 'tick'); l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      g.appendChild(l);
      var tx = CX + (R + 46) * Math.cos(a), ty = CY - (R + 46) * Math.sin(a) + 5;
      var tt = document.createElementNS(NS, 'text');
      tt.setAttribute('class', 'tl'); tt.setAttribute('x', tx); tt.setAttribute('y', ty); tt.setAttribute('text-anchor', 'middle');
      tt.textContent = t; g.appendChild(tt);
    }
  })();

  function mood(v) { return v > 0.72 ? ['Sweltering', 'Sticky'] : v > 0.4 ? ['Warm', 'Muggy'] : v > 0.12 ? ['Easing', 'Cooling'] : ['Comfortable', 'Calm']; }
  var LEDE = [
    'Houston humidity does not care about your plans. Trade Services does air conditioning and heating for Houston homes, so the inside of your house can be a different place.',
    'That is more like it. When your system cannot hold a number like this, call or text and tell us what it is doing.'
  ];

  function setH(v, from) {
    h = clamp(v, 0, 1);
    root.style.setProperty('--h', h.toFixed(3));
    var temp = Math.round(TMIN + h * (TMAX - TMIN));
    var a = Math.PI * (1 - h);
    var kx = CX + R * Math.cos(a), ky = CY - R * Math.sin(a);
    knob.setAttribute('cx', kx); knob.setAttribute('cy', ky);
    needle.setAttribute('x2', CX + (R - 22) * Math.cos(a)); needle.setAttribute('y2', CY - (R - 22) * Math.sin(a));
    $('#dnum').textContent = temp + '°';
    $('#bigNum').textContent = temp;
    var m = mood(h);
    $('#dmood').textContent = m[0]; $('#moodB').textContent = m[1];
    var hum = Math.round(45 + 43 * h);
    $('#hum').textContent = hum + '%';
    $('#humBar').style.setProperty('--bar', hum);
    $('#moodBar').style.setProperty('--bar', Math.round(10 + 90 * h));
    knob.setAttribute('aria-valuenow', temp);
    knob.setAttribute('aria-valuetext', temp + ' degrees, ' + m[0].toLowerCase());
    $('#lede').textContent = h > 0.5 ? LEDE[0] : LEDE[1];
    $('#goCool').setAttribute('aria-pressed', h < 0.15 ? 'true' : 'false');
    $('#goHot').setAttribute('aria-pressed', h > 0.85 ? 'true' : 'false');
    var tc = document.querySelector('meta[name=theme-color]');
    if (tc && from !== 'init') tc.setAttribute('content', h > 0.5 ? '#1c0d05' : '#04141f');
  }

  function pt(e) {
    var r = svg.getBoundingClientRect();
    var sx = (e.clientX - r.left) * (500 / r.width) - 30, sy = (e.clientY - r.top) * (284 / r.height) - 22;
    var ang = Math.atan2(CY - sy, sx - CX);
    if (ang < 0) ang = sx < CX ? Math.PI : 0;
    return 1 - clamp(ang, 0, Math.PI) / Math.PI;
  }
  var dragging = false;
  function down(e) { dragging = true; stopAnim(); try { svg.setPointerCapture(e.pointerId); } catch (_) {} setH(pt(e)); e.preventDefault(); }
  function move(e) { if (dragging) setH(pt(e)); }
  function up() { dragging = false; }
  svg.addEventListener('pointerdown', down);
  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointercancel', up);
  knob.addEventListener('keydown', function (e) {
    var step = 1 / (TMAX - TMIN), k = e.key, used = true;
    stopAnim();
    if (k === 'ArrowRight' || k === 'ArrowUp') setH(h + step);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') setH(h - step);
    else if (k === 'Home') setH(0);
    else if (k === 'End') setH(1);
    else if (k === 'PageUp') setH(h + step * 4);
    else if (k === 'PageDown') setH(h - step * 4);
    else used = false;
    if (used) e.preventDefault();
  });
  function stopAnim() { if (anim) { cancelAnimationFrame(anim); anim = null; } }
  function glide(to) {
    stopAnim();
    if (reduce) { setH(to); return; }
    var from = h, t0 = performance.now(), dur = 1100;
    (function step(now) {
      var p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      setH(from + (to - from) * e);
      if (p < 1) anim = requestAnimationFrame(step); else anim = null;
    })(t0);
  }
  $('#goCool').addEventListener('click', function () { glide(0); });
  $('#goHot').addEventListener('click', function () { glide(1); });
  setH(1, 'init');

  /* ---------- header, scroll mercury, thermometer ---------- */
  var bar = $('#bar'), merc = $('#merc'), topbar = $('#topbar'), mercNum = $('#mercNum');
  var thermo = $('#thermo'), how = $('#call'), steps = $$('.hx-step'), tticks = $$('.hx-th-ticks span');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? clamp(y / max, 0, 1) : 0;
    root.style.setProperty('--p', p.toFixed(4));
    mercNum.textContent = Math.round(98 - 26 * p) + '°F';
    bar.classList.toggle('solid', y > 40);
    if (how && thermo) {
      var r = how.getBoundingClientRect(), vh = window.innerHeight;
      var q = clamp((vh * 0.55 - r.top - vh * 0.2) / Math.max(1, r.height - vh * 0.3), 0, 1);
      thermo.style.setProperty('--q', q.toFixed(4));
      steps.forEach(function (s, i) { s.classList.toggle('on', q > i / steps.length - 0.02); });
      tticks.forEach(function (t) { t.classList.toggle('on', q >= parseFloat(t.getAttribute('data-at')) - 0.06); });
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(function (n) { io.observe(n); });
  } else { rvs.forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- registers (click to open the louvres) ---------- */
  $$('.reg').forEach(function (r) {
    var b = $('.reg-btn', r);
    function toggle() { var o = r.classList.toggle('open'); b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.setAttribute('aria-label', (o ? 'Close ' : 'Open ') + r.getAttribute('data-name')); }
    b.addEventListener('click', toggle);
  });

  /* ---------- humidity counters ---------- */
  var city = $('#houston');
  if (city) {
    var counted = false;
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !counted) {
          counted = true; city.classList.add('go');
          $$('.hx-gauge b', city).forEach(function (b) {
            var to = +b.getAttribute('data-to'), t0 = performance.now(), dur = reduce ? 1 : 1600;
            (function step(now) {
              var p = clamp((now - t0) / dur, 0, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
              b.firstChild.nodeValue = v; if (p < 1) requestAnimationFrame(step);
            })(t0);
          });
        }
      });
    }, { threshold: 0.35 });
    co.observe(city);
  }

  /* ---------- photo strip: drag with mouse, arrows, native swipe on touch ---------- */
  var strip = $('#strip');
  if (strip) {
    var down0 = false, sx = 0, sl = 0, moved = 0;
    strip.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down0 = true; moved = 0; sx = e.clientX; sl = strip.scrollLeft; strip.classList.add('drag'); });
    window.addEventListener('pointermove', function (e) { if (!down0) return; moved = Math.abs(e.clientX - sx); strip.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', function () { down0 = false; strip.classList.remove('drag'); });
    var by = function () { return Math.min(560, strip.clientWidth * 0.8); };
    $('#prev').addEventListener('click', function () { strip.scrollBy({ left: -by(), behavior: reduce ? 'auto' : 'smooth' }); });
    $('#next').addEventListener('click', function () { strip.scrollBy({ left: by(), behavior: reduce ? 'auto' : 'smooth' }); });
    strip.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { strip.scrollBy({ left: 300, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { strip.scrollBy({ left: -300, behavior: 'smooth' }); e.preventDefault(); }
    });
  }

  /* ---------- phone menu ---------- */
  var sheet = $('#sheet'), burger = $('#burger');
  function openSheet(o) {
    sheet.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) $('#closeSheet').focus(); else burger.focus();
  }
  burger.addEventListener('click', function () { openSheet(true); });
  $('#closeSheet').addEventListener('click', function () { openSheet(false); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { openSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) openSheet(false); });
  sheet.setAttribute('aria-hidden', 'true');
  new MutationObserver(function () { sheet.setAttribute('aria-hidden', sheet.classList.contains('open') ? 'false' : 'true'); }).observe(sheet, { attributes: true, attributeFilter: ['class'] });

  /* ---------- quote form (preview) ---------- */
  var form = $('#quote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = $('#ok');
    ok.hidden = false;
    ok.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
