/* Arlington General Contractors: lift-the-roof behaviours. Vanilla JS. */
(function () {
  'use strict';
  var d = document, w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* roof-course progress + sticky header */
  var courses = $('#courses'), top = $('#top');
  function onScroll() {
    var h = d.documentElement.scrollHeight - w.innerHeight;
    courses.style.setProperty('--p', (h > 0 ? Math.min(1, w.scrollY / h) : 0).toFixed(4));
    top.classList.toggle('is-stuck', w.scrollY > 40);
  }

  /* hero house: drag the roof up, or use the slider */
  var stage = $('#stage'), rng = $('#lift'), out = $('#lift-out'), roof = $('.h-roof', stage), svg = $('svg.house', stage);
  var lift = 0, touched = false;
  function setLift(v, user) {
    lift = Math.max(0, Math.min(1, v));
    if (user) touched = true;
    stage.style.setProperty('--lift', lift.toFixed(3));
    rng.value = Math.round(lift * 100);
    rng.style.setProperty('--fill', Math.round(lift * 100) + '%');
    roof.setAttribute('aria-valuenow', Math.round(lift * 100));
    out.textContent = lift < 0.08 ? 'Roof on' : lift > 0.92 ? 'Roof off' : 'Lifting';
  }
  rng.addEventListener('input', function () { setLift(rng.value / 100, true); });
  var dragging = false, y0 = 0, l0 = 0;
  function pt(e) { var r = svg.getBoundingClientRect(); return { y: e.clientY, k: 730 / r.height }; }
  roof.addEventListener('pointerdown', function (e) {
    dragging = true; touched = true; y0 = e.clientY; l0 = lift; roof.classList.add('drag');
    try { roof.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault();
  });
  roof.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var p = pt(e); setLift(l0 + (y0 - e.clientY) * p.k / 190, true);
  });
  function endDrag() { if (!dragging) return; dragging = false; roof.classList.remove('drag'); }
  roof.addEventListener('pointerup', endDrag); roof.addEventListener('pointercancel', endDrag);
  roof.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); setLift(lift + 0.1, true); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); setLift(lift - 0.1, true); }
  });
  roof.addEventListener('click', function () { if (!touched || lift < 0.05) setLift(1, true); });
  setLift(0);
  if (!reduce) { setTimeout(function () { if (!touched) setLift(0.62); }, 900); } else { setLift(0.62); }

  /* services: floors */
  var floors = $$('#floors .floor'), bodies = $$('#fb-txt [data-b]'), pics = $$('#fb-pic > img'), inset = $('#fb-inset');
  function floor(i) {
    floors.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    bodies.forEach(function (b, k) { b.hidden = k !== i; });
    pics.forEach(function (p, k) { p.classList.toggle('on', k === i); if (k === i) p.loading = 'eager'; });
    inset.classList.toggle('on', i === 0);
  }
  floors.forEach(function (b, i) {
    b.addEventListener('click', function () { floor(i); });
    b.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % 4;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i + 3) % 4;
      if (n !== null) { e.preventDefault(); floor(n); floors[n].focus(); }
    });
  });
  floor(0);
  $$('[data-svc]').forEach(function (a) { a.addEventListener('click', function () { var s = $('#f-svc'); if (s) s.value = a.getAttribute('data-svc'); }); });

  /* plan steps with the mini house */
  var steps = [
    { h: 'Look up before you look in', p: 'Check upstairs ceilings for stains, and scan the roof from the ground for missing shingles. A roof that leaks can ruin new paint, floors and cabinets.', lift: 0, glow: 'roof' },
    { h: 'List what the rooms need', p: 'Write down what you want changed inside: the kitchen, floors, lighting, the layout. Put the must-haves first and trim the rest later.', lift: 1, glow: 'rooms' },
    { h: 'Put the dry-in first', p: 'Roof and outside work normally go first so the inside stays dry. Interior finishes such as cabinets, tile and paint come last.', lift: 0, glow: 'roof' },
    { h: 'Ask for one order of work', p: 'When you talk to contractors, ask them to write the order of work in one plan: roof, then structure, then finishes. Compare plans, not just totals.', lift: 0.55, glow: 'rooms' }
  ];
  var tabs = $$('#step-tabs button'), ph = $('#plan-house'), phRoof = $('.h-roof', ph), phBack = $('.h-back', ph), si = 0;
  function step(i) {
    si = (i + steps.length) % steps.length; var s = steps[si];
    tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === si); });
    $('#st-n').textContent = 'Step ' + (si + 1) + ' of 4'; $('#st-h').textContent = s.h; $('#st-p').textContent = s.p;
    ph.style.setProperty('--lift', s.lift);
    phRoof.classList.toggle('glow', s.glow === 'roof'); phBack.classList.toggle('glow', s.glow === 'rooms');
  }
  tabs.forEach(function (b, i) { b.addEventListener('click', function () { step(i); }); });
  $('#st-prev').addEventListener('click', function () { step(si - 1); });
  $('#st-next').addEventListener('click', function () { step(si + 1); });
  step(0);

  /* gallery lightbox (native dialog) */
  var dlg = $('#lbd'), tiles = $$('.sheetf'), li = 0, lastF = null;
  function show(i) { li = (i + tiles.length) % tiles.length; var t = tiles[li]; var im = $('#lbd-img'); im.src = t.getAttribute('data-full'); im.alt = t.querySelector('img').alt; $('#lbd-cap').textContent = t.getAttribute('data-cap'); }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { lastF = t; show(i); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }); });
  function closeD() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); if (lastF) lastF.focus(); }
  $('#lbd-x').addEventListener('click', closeD);
  $('#lbd-p').addEventListener('click', function () { show(li - 1); });
  $('#lbd-n').addEventListener('click', function () { show(li + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lbd-in')) closeD(); });
  dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(li + 1); if (e.key === 'ArrowLeft') show(li - 1); });

  /* mobile menu */
  var sheet = $('#sheet'), mb = $('#menu-btn');
  function openS() { sheet.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); d.body.style.overflow = 'hidden'; $('#sheet-x').focus(); }
  function closeS() { sheet.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; }
  mb.addEventListener('click', openS);
  $('#sheet-x').addEventListener('click', function () { closeS(); mb.focus(); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', closeS); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) { closeS(); mb.focus(); } });

  /* reveal + dimension lines draw on scroll */
  var rv = $$('.rv');
  if ('IntersectionObserver' in w && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* cursor marker */
  var cur = $('#cur');
  if (w.matchMedia && w.matchMedia('(pointer: fine)').matches && !reduce) {
    var cx = 0, cy = 0, tx = 0, ty = 0, run = false;
    var loop = function () { cx += (tx - cx) * 0.3; cy += (ty - cy) * 0.3; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); };
    d.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); if (!run) { run = true; loop(); } });
    d.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
    d.addEventListener('mouseover', function (e) { cur.classList.toggle('big', !!e.target.closest('a,button,input,select,textarea,.h-roof')); });
  }

  $('#quote').addEventListener('submit', function (e) { e.preventDefault(); });
  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll);
  onScroll();
})();
