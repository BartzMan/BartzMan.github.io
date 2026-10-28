(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* header, load bar, menu */
  var hd = $('#hd'), bar = $('.load i'), burger = $('.burger'), sheet = $('#sheet');
  function setMenu(o) {
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    sheet.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var hills = $('#hills'), truck = $('.truck'), wh = [$('#wh1'), $('#wh2')], lastX = 0, spin = 0;
  function onScroll() {
    var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    hd.classList.toggle('sm', y > 40);
    bar.style.transform = 'scaleX(' + clamp(y / max, 0, 1).toFixed(4) + ')';
    var vh = window.innerHeight, r = hills.getBoundingClientRect();
    var t = reduce ? 0.55 : clamp((vh * 0.9 - r.top) / (r.height + vh * 0.5), 0, 1);
    truck.style.setProperty('--tx', t.toFixed(4));
    spin += (t - lastX) * 5200; lastX = t;
    wh.forEach(function (w) { w.style.transform = 'rotate(' + spin.toFixed(1) + 'deg)'; });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); onScroll();

  /* reveal */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* bays: pull the latch, the door rolls up */
  $$('.bay').forEach(function (bay) {
    var latch = $('.latch', bay);
    latch.addEventListener('click', function () {
      var open = !bay.classList.contains('open');
      bay.classList.toggle('open', open); latch.setAttribute('aria-expanded', open);
      $('.tx', latch).textContent = open ? 'Close it' : 'Pull open';
    });
  });

  /* photo roll filter + lightbox */
  var chips = $$('.chip'), shots = $$('.rollg .ph');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
      shots.forEach(function (s) { s.classList.toggle('hide', f !== 'all' && s.getAttribute('data-k') !== f); });
    });
  });
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), cur = 0, vis = [];
  function show(i) {
    cur = (i + vis.length) % vis.length; var s = vis[cur], im = $('img', s);
    var srcs = (im.getAttribute('srcset') || '').split(',').map(function (x) { return x.trim().split(' ')[0]; }).filter(Boolean);
    lbImg.src = srcs.length ? srcs[srcs.length - 1] : im.getAttribute('src'); lbImg.alt = im.alt; lbCap.textContent = s.getAttribute('data-c');
  }
  shots.forEach(function (s) {
    s.addEventListener('click', function () { vis = shots.filter(function (x) { return !x.classList.contains('hide'); }); show(vis.indexOf(s)); lb.showModal(); });
  });
  $('#lb-x').addEventListener('click', function () { lb.close(); });
  $('#lb-pv').addEventListener('click', function () { show(cur - 1); });
  $('#lb-nx').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* work order chips write into the details */
  var sw = $$('#sw button'), msg = $('#f-msg'), PRE = /^I need: [^\n]*\n\n?/;
  function sync() {
    var picked = sw.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).map(function (b) { return b.textContent.trim(); });
    var rest = msg.value.replace(PRE, '');
    msg.value = picked.length ? 'I need: ' + picked.join(', ') + '\n\n' + rest : rest;
  }
  sw.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); sync(); }); });

  /* rating plate count-up */
  var rn = $('#rate-n');
  if (!reduce) {
    rn.textContent = '0.0';
    var rio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { rio.disconnect(); var t0 = performance.now(); (function s(n) { var k = clamp((n - t0) / 1300, 0, 1); rn.textContent = (5 * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(s); })(t0); }
    }, { threshold: 0.6 });
    rio.observe(rn);
  }

  /* hex-nut cursor */
  var cu = $('.cur');
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    window.addEventListener('mousemove', function (e) {
      cu.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; cu.classList.add('on');
      cu.classList.toggle('hv', !!e.target.closest('a,button,input,textarea'));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cu.classList.remove('on'); });
  }

  /* quote form (demo: no backend) */
  var form = $('#qform'), ok = $('#f-ok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var miss = $$('input[required]', form).filter(function (i) { return !i.value.trim(); });
    if (miss.length) { ok.textContent = 'Please add your name, phone and email.'; miss[0].focus(); return; }
    ok.textContent = 'Preview: on the live website this request goes straight to Combined Professional Services.';
  });
})();
