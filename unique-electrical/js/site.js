/* Unique Electrical Services: the page is a breaker panel. Vanilla JS. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var T = window.T || function (k) { return k; };
  var root = document.documentElement;

  /* ---------- circuits ---------- */
  var N = 5, on = {}, touched = {};
  var shKeys = { 1: 'sh1', 2: 'sh2', 3: 'sh3', 4: 'sh4', 5: 'sh5' };
  var leds = $$('.bp-bar-led i'), cnt = $('#cnt'), mainSw = $('#mainSw'), bus = $('#bus');

  function labels() {
    $$('[data-c][role=switch]').forEach(function (b) {
      var n = +b.getAttribute('data-c');
      b.setAttribute('aria-label', T('circuit') + ' 0' + n + ', ' + T(shKeys[n]) + ', ' + T(on[n] ? 'on' : 'off'));
    });
    mainSw.setAttribute('aria-label', T('main_n') + ': ' + T('main_s') + ', ' + T(allOn() ? 'on' : 'off'));
  }
  function allOn() { for (var i = 1; i <= N; i++) if (!on[i]) return false; return true; }
  function count() { var c = 0; for (var i = 1; i <= N; i++) if (on[i]) c++; return c; }

  function setC(n, v, byUser) {
    on[n] = !!v; if (byUser) touched[n] = true;
    var sec = $('#c' + n); sec.classList.toggle('on', !!v);
    $$('[data-c="' + n + '"][role=switch]').forEach(function (b) {
      b.setAttribute('aria-checked', v ? 'true' : 'false');
      var st = $('.st', b) || $('.stt', b);
      if (st) { st.setAttribute('data-i', v ? 'on' : 'off'); window.i18nRender(st); }
      var h = $('.sth', b); if (h) { h.setAttribute('data-i', v ? 'sw_hint_on' : 'sw_hint'); window.i18nRender(h); }
    });
    var c = count();
    cnt.textContent = c;
    leds.forEach(function (l, i) { l.classList.toggle('on', i < c); });
    mainSw.setAttribute('aria-checked', allOn() ? 'true' : 'false');
    root.style.setProperty('--hl', (0.6 + 0.1 * c).toFixed(2));
    labels();
  }
  $$('[data-c][role=switch]').forEach(function (b) {
    b.addEventListener('click', function () { var n = +b.getAttribute('data-c'); setC(n, !on[n], true); });
  });
  mainSw.addEventListener('click', function () {
    var v = !allOn();
    for (var i = 1; i <= N; i++) setTimeout(setC.bind(null, i, v, true), reduce ? 0 : (i - 1) * 110);
  });
  for (var i = 1; i <= N; i++) { on[i] = false; }
  $$('.ckt').forEach(function (s) { s.classList.remove('on'); });
  labels();
  setC(2, true, false);   /* boot: lighting is live so the mechanism is visible at once */

  /* auto power as each circuit scrolls into view (unless the visitor switched it) */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var n = +e.target.getAttribute('data-c');
        if (e.isIntersecting && !touched[n] && !on[n]) { setTimeout(function () { if (!touched[n]) setC(n, true, false); }, reduce ? 0 : 450); }
      });
    }, { threshold: 0.4 });
    $$('.ckt').forEach(function (s) { io.observe(s); });
    var rv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    $$('.rv').forEach(function (n) { if (reduce) n.classList.add('in'); else rv.observe(n); });
  } else { $$('.rv').forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- bus bar fills with scroll; header ---------- */
  var board = $('#circuits'), bar = $('#bar'), tick = false;
  function frame() {
    tick = false;
    bar.classList.toggle('solid', window.scrollY > 40);
    var r = board.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * 0.65 - r.top) / r.height, 0, 1);
    board.style.setProperty('--bus', p.toFixed(4));
    bus.style.setProperty('--bus', p.toFixed(4));
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener('resize', frame); frame();

  /* ---------- dimmer + photo thumbs (circuit 02) ---------- */
  var dim = $('#dim'), dimv = $('#dimv'), c2img = $('#c2img'), c2imgbox = c2img.parentNode;
  dim.addEventListener('input', function () {
    var v = +dim.value; c2imgbox.style.setProperty('--dim', (v / 100).toFixed(2)); dimv.textContent = v + '%';
    $('#c2').style.setProperty('--dim', (v / 100).toFixed(2));
  });
  $$('.ckt-thumbs .th').forEach(function (t) {
    t.addEventListener('click', function () {
      var n = t.getAttribute('data-n');
      c2img.src = 'images/' + n + '.jpg'; c2img.srcset = 'images/' + n + '-720.jpg 720w, images/' + n + '.jpg 1600w';
      c2img.setAttribute('data-ia', 'alt:a_' + n); window.i18nRender(c2img);
      var cap = $('#c2 .ckt-cap'); cap.setAttribute('data-i', 'p_' + n); window.i18nRender(cap);
      $$('.ckt-thumbs .th').forEach(function (o) { o.setAttribute('aria-pressed', o === t ? 'true' : 'false'); });
      if (!on[2]) setC(2, true, true);
    });
  });

  /* ---------- phone menu ---------- */
  var sheet = $('#sheet'), burger = $('#burger');
  function openSheet(o) {
    sheet.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    sheet.setAttribute('aria-hidden', o ? 'false' : 'true');
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) $('#closeSheet').focus(); else burger.focus();
  }
  sheet.setAttribute('aria-hidden', 'true');
  burger.addEventListener('click', function () { openSheet(true); });
  $('#closeSheet').addEventListener('click', function () { openSheet(false); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { openSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) openSheet(false); });

  /* ---------- quote form (preview) ---------- */
  var shown = false;
  $('#quote').addEventListener('submit', function (e) {
    e.preventDefault(); shown = true;
    var ok = $('#ok'); ok.hidden = false; ok.textContent = T('f_ok');
  });
  document.addEventListener('langchange', function () { labels(); if (shown) $('#ok').textContent = T('f_ok'); });
  /* the saved language may have been applied before the switches were wired */
  labels();
})();
