/* FC Roofing: storm radar behaviours. Vanilla JS, no deps. */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* scroll progress + sticky header */
  var bar = $('.sweepbar'), top = $('#top');
  function onScroll() {
    var h = d.documentElement.scrollHeight - w.innerHeight;
    var p = h > 0 ? Math.min(1, w.scrollY / h) : 0;
    bar.style.setProperty('--p', p.toFixed(4));
    top.classList.toggle('is-stuck', w.scrollY > 40);
    heroTarget();
  }

  /* hero scope: storm clears as the roof is finished (scroll or button) */
  var scope = $('#scope'), btn = $('#scope-btn'), btnT = $('#scope-btn-t'), hero = $('#hero');
  var forced = false, scrollClear = 0, cur = 0, target = 0, raf = 0;
  var hudCells = $('#hud-cells'), hudPct = $('#hud-pct'), hudState = $('#hud-state');
  function paint(v) {
    scope.style.setProperty('--clear', v.toFixed(3));
    var cells = v > 0.92 ? 0 : v > 0.66 ? 1 : v > 0.33 ? 2 : 4;
    hudCells.textContent = 'Cells ' + cells;
    hudPct.textContent = 'Roof ' + Math.round(v * 100) + '%';
    hudState.textContent = v < 0.33 ? 'Deck open' : v < 0.66 ? 'Underlayment on' : v < 0.97 ? 'Shingling' : 'Shingled · clear';
  }
  function step() {
    var diff = target - cur;
    if (Math.abs(diff) < 0.004) { cur = target; paint(cur); raf = 0; return; }
    cur += diff * 0.08; paint(cur); raf = requestAnimationFrame(step);
  }
  function heroTarget() {
    var r = hero.getBoundingClientRect();
    scrollClear = Math.max(0, Math.min(1, -r.top / (r.height * 0.55)));
    target = forced ? 1 : scrollClear;
    if (reduce) { cur = target; paint(cur); return; }
    if (!raf) raf = requestAnimationFrame(step);
  }
  btn.addEventListener('click', function () {
    forced = !forced;
    btn.setAttribute('aria-pressed', forced);
    btnT.textContent = forced ? 'Bring the storm back' : 'Finish the roof';
    heroTarget();
  });
  paint(0);

  /* services: blips + legend */
  var blips = $$('.blip'), legend = $$('#legend button'), bodies = $$('#svc-bodies [data-b]'), pics = $$('.svc-pic img'), tag = $('#svc-tag');
  function pick(i) {
    blips.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    legend.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i); });
    bodies.forEach(function (b, k) { b.hidden = k !== i; });
    pics.forEach(function (p, k) { p.classList.toggle('on', k === i); if (k === i) p.loading = 'eager'; });
    tag.textContent = 'Blip 0' + (i + 1);
  }
  blips.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(i); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); var n = (i + 1) % 4; pick(n); blips[n].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); var p = (i + 3) % 4; pick(p); blips[p].focus(); }
    });
  });
  legend.forEach(function (b, i) { b.addEventListener('click', function () { pick(i); }); });
  pick(0);
  $$('[data-svc]').forEach(function (a) { a.addEventListener('click', function () { var s = $('#f-svc'); if (s) s.value = a.getAttribute('data-svc'); }); });

  /* useful: five-point check */
  var chks = $$('.chk'), ring = $('#ring'), ringN = $('#ring-n'), resT = $('#res-t'), resP = $('#res-p'), result = $('#chk-result');
  function chkUpdate() {
    var ok = 0, warn = 0, a;
    chks.forEach(function (c) { var v = c.getAttribute('data-v'); if (v === 'ok') ok++; if (v === 'warn') warn++; });
    var n = ok + warn;
    ring.style.setProperty('--pc', n * 20);
    ringN.textContent = n;
    a = result.querySelector('a');
    if (n < 5) {
      resT.textContent = n ? 'Scope sweeping: ' + n + ' of 5' : 'Scope idle';
      resP.textContent = 'Answer all five and the scope will tell you what to do next.';
      if (a) a.remove();
      return;
    }
    if (warn === 0) { resT.textContent = 'All clear'; resP.textContent = 'Nothing worried you today. Repeat the walk-around after any big storm, and keep an eye on those ceilings.'; }
    else { resT.textContent = warn + (warn === 1 ? ' check' : ' checks') + ' worth a look'; resP.textContent = 'Take a photo of each one from the ground, then give a roofer a call. Do not climb up to look closer.'; }
    if (!a) { a = d.createElement('a'); a.className = 'pill pill-solid pill-sm'; a.href = 'tel:+18322878733'; a.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-phone"/></svg>Call (832) 287-8733'; result.appendChild(a); }
  }
  chks.forEach(function (c) {
    var yes = c.querySelector('.yes'), no = c.querySelector('.no');
    function set(v) { c.setAttribute('data-v', v); yes.setAttribute('aria-pressed', v === 'ok'); no.setAttribute('aria-pressed', v === 'warn'); chkUpdate(); }
    yes.addEventListener('click', function () { set('ok'); });
    no.addEventListener('click', function () { set('warn'); });
  });
  chkUpdate();

  /* storm tracker slider */
  var trk = $('#trk'), city = $('#houston'), trkV = $('#trk-v');
  function trkUpdate() {
    var v = +trk.value; // 0 = T-6h, 50 = now, 100 = moved on
    city.style.setProperty('--t', ((v - 22) / 100).toFixed(3));
    var label;
    if (v < 46) label = 'T-' + Math.max(1, Math.round((50 - v) * 6 / 50)) + 'h';
    else if (v < 58) label = 'Now';
    else if (v < 90) label = 'T+' + Math.round((v - 50) * 6 / 50) + 'h';
    else label = 'Moved on';
    trkV.textContent = label;
  }
  trk.addEventListener('input', trkUpdate); trkUpdate();

  /* lightbox */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), tiles = $$('.log-t'), li = 0, lastFocus = null;
  function lbShow(i) { li = (i + tiles.length) % tiles.length; var t = tiles[li]; lbImg.src = t.getAttribute('data-full'); lbImg.alt = t.querySelector('img').alt; lbCap.textContent = t.getAttribute('data-cap'); }
  function lbOpen(i) { lastFocus = d.activeElement; lbShow(i); lb.hidden = false; d.body.style.overflow = 'hidden'; $('#lb-x').focus(); }
  function lbClose() { lb.hidden = true; d.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { lbOpen(i); }); });
  $('#lb-x').addEventListener('click', lbClose);
  $('#lb-p').addEventListener('click', function () { lbShow(li - 1); });
  $('#lb-n').addEventListener('click', function () { lbShow(li + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
  d.addEventListener('keydown', function (e) {
    if (!lb.hidden) { if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowRight') lbShow(li + 1); if (e.key === 'ArrowLeft') lbShow(li - 1); }
    else if (e.key === 'Escape') closeSheet();
  });
  var sx = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) lbShow(li + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* mobile sheet */
  var sheet = $('#sheet'), mb = $('#menu-btn');
  function openSheet() { sheet.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); d.body.style.overflow = 'hidden'; $('#sheet-x').focus(); }
  function closeSheet() { if (!sheet.classList.contains('open')) return; sheet.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; mb.focus(); }
  mb.addEventListener('click', openSheet);
  $('#sheet-x').addEventListener('click', closeSheet);
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { sheet.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; }); });

  /* reveal on scroll */
  var rv = $$('.rv, .line-draw');
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* custom radar cursor (fine pointers only) */
  var cur2 = $('#cur');
  if (w.matchMedia && w.matchMedia('(pointer: fine)').matches && !reduce) {
    var cx = 0, cy = 0, tx = 0, ty = 0, run = false;
    var loop = function () { cx += (tx - cx) * 0.25; cy += (ty - cy) * 0.25; cur2.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); };
    d.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cur2.classList.add('on'); if (!run) { run = true; loop(); } });
    d.addEventListener('mouseleave', function () { cur2.classList.remove('on'); });
    d.addEventListener('mouseover', function (e) { cur2.classList.toggle('big', !!e.target.closest('a,button,input,select,textarea')); });
  }

  /* quote form: demo, no backend yet */
  $('#quote').addEventListener('submit', function (e) { e.preventDefault(); });

  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll);
  onScroll();
})();
