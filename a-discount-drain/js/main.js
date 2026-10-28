(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* header, menu, spine */
  var bar = $('#bar'), wl = $('.wl i'), burger = $('.burger'), sheet = $('#sheet');
  function setMenu(o) {
    burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    sheet.classList.toggle('open', o); document.body.style.overflow = o ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var town = $('#town'), cutSvg = $('#cut');
  function onScroll() {
    var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight), p = clamp(y / max, 0, 1);
    bar.classList.toggle('sm', y > 40);
    wl.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    root.style.setProperty('--sp', p.toFixed(4));
    var vh = window.innerHeight, r = town.getBoundingClientRect();
    town.style.setProperty('--w', reduce ? 1 : clamp((vh * 0.95 - r.top) / (r.height * 0.85), 0, 1).toFixed(3));
    cutUpdate();
  }

  /* reveal */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- hero: drag the snake ---------- */
  var top = $('#top'), pipe = $('#pipe'), head = $('#head'), msg = $('#rig-msg'), pctEl = $('#rig-pct'), P0 = 0.06, P1 = 0.98;
  var p = P0, used = false, dragging = false;
  function setP(v) {
    p = clamp(v, P0, P1);
    top.style.setProperty('--p', p.toFixed(4));
    var flow = clamp((p - 0.45) / 0.5, 0, 1);
    top.style.setProperty('--flow', flow.toFixed(3));
    var pc = Math.round((p - P0) / (P1 - P0) * 100);
    pctEl.textContent = pc + '%'; head.setAttribute('aria-valuenow', pc);
    var done = pc >= 96;
    top.classList.toggle('done', done);
    msg.textContent = done ? 'Line clear. Water is moving.' : (p > 0.36 && p < 0.66 ? 'Working through the clog' : (p >= 0.66 ? 'Almost there' : 'Drag the snake through the pipe'));
  }
  function ptr(e) { var r = pipe.getBoundingClientRect(), pad = parseFloat(getComputedStyle($('.bore', pipe)).left) || 26; setP((e.clientX - r.left - pad) / (r.width - 2 * pad) * (1 - 0) ); }
  function touch() { used = true; pipe.classList.add('used'); }
  pipe.addEventListener('pointerdown', function (e) { dragging = true; touch(); pipe.classList.add('moving'); pipe.setPointerCapture(e.pointerId); ptr(e); });
  pipe.addEventListener('pointermove', function (e) { if (dragging) ptr(e); });
  ['pointerup', 'pointercancel'].forEach(function (n) { pipe.addEventListener(n, function () { dragging = false; pipe.classList.remove('moving'); }); });
  head.addEventListener('keydown', function (e) {
    var d = { ArrowRight: 0.04, ArrowUp: 0.04, ArrowLeft: -0.04, ArrowDown: -0.04, End: 1, Home: -1 }[e.key];
    if (d) { e.preventDefault(); touch(); pipe.classList.add('moving'); setP(e.key === 'End' ? P1 : (e.key === 'Home' ? P0 : p + d)); setTimeout(function () { pipe.classList.remove('moving'); }, 400); }
  });
  setP(reduce ? P1 : P0);
  if (!reduce) setTimeout(function () {
    if (used) return;
    var t0 = performance.now();
    pipe.classList.add('moving');
    (function s(n) {
      if (used) { pipe.classList.remove('moving'); return; }
      var k = clamp((n - t0) / 2400, 0, 1); setP(P0 + 0.2 * Math.sin(k * Math.PI));
      if (k < 1) requestAnimationFrame(s); else pipe.classList.remove('moving');
    })(t0);
  }, 3500);

  /* ---------- valves ---------- */
  $$('.valve').forEach(function (v) {
    v.addEventListener('click', function () {
      var run = v.closest('.run'), open = !run.classList.contains('open');
      run.classList.toggle('open', open); v.setAttribute('aria-expanded', open);
      $('span:last-child', v).textContent = open ? 'Close the valve' : 'Open the valve';
    });
  });

  /* ---------- cutaway: the snake runs the line as you scroll ---------- */
  var snake = $('#snakeP'), augG = $('#aug'), augSpin = $('#augspin'), clog = $('#clogG'), water = $('#waterP'), cutMsg = $('#cut-msg');
  var L = snake.getTotalLength(), mobile = false, rot = 0, lastP = -1;
  function cutUpdate() {
    var vh = window.innerHeight, r = cutSvg.getBoundingClientRect(), q;
    q = reduce ? 1 : clamp((vh * 0.88 - r.top) / (r.height + vh * 0.35), 0, 1);
    if (q === lastP) return; lastP = q;
    snake.style.strokeDashoffset = (1 - q).toFixed(4);
    var pt = snake.getPointAtLength(q * L);
    augG.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    rot += 40; augSpin.setAttribute('transform', 'rotate(' + rot + ')');
    var cleared = q > 0.7;
    clog.style.opacity = cleared ? 0 : (q > 0.5 ? 1 - (q - 0.5) / 0.2 : 1);
    clog.style.transition = 'opacity .5s';
    water.style.opacity = cleared ? 1 : 0.28; water.style.transition = 'opacity .6s';
    cutMsg.textContent = q < 0.08 ? 'Snake in the clean-out' : (q < 0.5 ? 'Running the line' : (q < 0.7 ? 'Through the clog' : 'Line clear, water moving'));
    var small = window.innerWidth < 760;
    if (small) { var vx = clamp(pt.x - 250, 0, 700); cutSvg.setAttribute('viewBox', vx.toFixed(0) + ' 90 500 380'); cutSvg.style.aspectRatio = '500/380'; mobile = true; }
    else if (mobile) { cutSvg.setAttribute('viewBox', '0 0 1200 480'); cutSvg.style.aspectRatio = ''; mobile = false; }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', function () { lastP = -1; onScroll(); }); onScroll();

  /* ---------- rail ---------- */
  var rail = $('#rail'), rbar = $('#rbar'), cards = $$('.card');
  function railUpdate() { rbar.style.width = (clamp((rail.scrollLeft + rail.clientWidth) / rail.scrollWidth, 0.05, 1) * 100) + '%'; }
  rail.addEventListener('scroll', railUpdate, { passive: true }); railUpdate();
  $('#rp').addEventListener('click', function () { rail.scrollBy({ left: -cards[0].offsetWidth - 20, behavior: reduce ? 'auto' : 'smooth' }); });
  $('#rn').addEventListener('click', function () { rail.scrollBy({ left: cards[0].offsetWidth + 20, behavior: reduce ? 'auto' : 'smooth' }); });
  var dx = 0, sx = 0, sl = 0, down = false, moved = false;
  rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  window.addEventListener('pointermove', function (e) { if (!down) return; dx = e.clientX - sx; if (Math.abs(dx) > 6) { moved = true; rail.classList.add('drag'); } rail.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('drag'); });
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), cur = 0;
  function show(i) {
    cur = (i + cards.length) % cards.length; var c = cards[cur], im = $('img', c);
    var srcs = (im.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(' ')[0]; }).filter(Boolean);
    lbImg.src = srcs[srcs.length - 1] || im.src; lbImg.alt = im.alt; lbCap.textContent = c.getAttribute('data-c');
  }
  cards.forEach(function (c, i) { c.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; return; } show(i); lb.showModal(); }); });
  $('#lb-x').addEventListener('click', function () { lb.close(); });
  $('#lb-pv').addEventListener('click', function () { show(cur - 1); });
  $('#lb-nx').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* ---------- rating count-up ---------- */
  var rn = $('#rate-n');
  if (!reduce) {
    rn.textContent = '0.0';
    var rio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { rio.disconnect(); var t0 = performance.now(); (function s(n) { var k = clamp((n - t0) / 1300, 0, 1); rn.textContent = (4.7 * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(s); })(t0); }
    }, { threshold: 0.6 });
    rio.observe(rn);
  }

  /* ---------- drop cursor ---------- */
  var cu = $('.cur');
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    window.addEventListener('mousemove', function (e) {
      cu.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; cu.classList.add('on');
      cu.classList.toggle('hv', !!e.target.closest('a,button,[role=slider],input,textarea,.pipe'));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cu.classList.remove('on'); });
  }

  /* ---------- form (demo) ---------- */
  var form = $('#qform'), ok = $('#f-ok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var miss = $$('input[required]', form).filter(function (i) { return !i.value.trim(); });
    if (miss.length) { ok.textContent = 'Please add your name, phone and email.'; miss[0].focus(); return; }
    ok.textContent = 'Preview: on the live website this request goes straight to A Discount Drain Cleaning Services.';
  });
})();
