(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- header, progress ruler, menu ---------- */
  var hdr = $('.hdr'), rulerBar = $('.ruler i'), rulerTag = $('.ruler-tag');
  function onScroll() {
    var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    hdr.classList.toggle('on', y > 40);
    var p = clamp(y / max, 0, 1);
    rulerBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    rulerTag.textContent = String(Math.round(p * 100)).padStart(2, '0') + '% DRAWN';
    sysUpdate();
  }
  var menuBtn = $('.menu'), sheetNav = $('#sheet-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheetNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(!sheetNav.classList.contains('open')); });
  $$('#sheet-nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); if (e.target.id === 'stars') e.target.classList.add('on'); } });
  }, { threshold: 0.12 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- the dial ---------- */
  var MIN = 55, MAX = 90, TARGET = 72;
  var dial = $('#dial-el'), knob = $('#dial-knob'), num = $('#dial-num'), msg = $('#dial-msg'), ticks = $('#dial-ticks');
  var val = reduce ? TARGET : 64, locked = false, touched = false, snapEl = null;
  var ang = function (t) { return -135 + (t - MIN) / (MAX - MIN) * 270; };
  var NS = 'http://www.w3.org/2000/svg';
  (function build() {
    for (var t = MIN; t <= MAX; t++) {
      var a = ang(t) * Math.PI / 180, major = t % 5 === 0, tgt = t === TARGET;
      var r1 = 154, r2 = tgt ? 128 : (major ? 138 : 146);
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', 159 + r1 * Math.sin(a)); l.setAttribute('y1', 159 - r1 * Math.cos(a));
      l.setAttribute('x2', 159 + r2 * Math.sin(a)); l.setAttribute('y2', 159 - r2 * Math.cos(a));
      l.setAttribute('class', 'tick' + (tgt ? ' t' : (major ? ' m' : '')));
      ticks.appendChild(l);
      if (major && t !== 55) {
        var tx = document.createElementNS(NS, 'text'), rr = 118;
        tx.setAttribute('x', 159 + rr * Math.sin(a)); tx.setAttribute('y', 159 - rr * Math.cos(a) + 4);
        tx.setAttribute('text-anchor', 'middle'); tx.textContent = t;
        if (t === 70) tx.setAttribute('style', 'opacity:.9');
        ticks.appendChild(tx);
      }
    }
  })();
  function setC(c) { root.style.setProperty('--c', c.toFixed(3)); }
  function render(t, initial) {
    val = clamp(t, MIN, MAX);
    knob.style.transform = 'rotate(' + ang(val).toFixed(2) + 'deg)';
    var r = Math.round(val);
    num.innerHTML = r + '<sup>&deg;</sup>';
    dial.setAttribute('aria-valuenow', r); dial.setAttribute('aria-valuetext', r + ' degrees');
    var near = Math.abs(val - TARGET) < 0.5;
    if (near && !locked) { locked = true; dial.classList.add('lock'); msg.textContent = 'Locked on 72'; fire(initial); }
    if (!near) { if (locked) { locked = false; dial.classList.remove('lock'); } msg.textContent = r < TARGET ? 'Turn it up' : 'Turn it down'; }
    setC(near ? 0 : clamp(Math.abs(val - TARGET) / 14, 0, 1));
  }
  function fire(initial) {
    if (initial || reduce) return;
    if (!snapEl) { snapEl = document.createElement('div'); snapEl.className = 'snap'; snapEl.setAttribute('aria-hidden', 'true'); document.body.appendChild(snapEl); }
    snapEl.classList.remove('go'); void snapEl.offsetWidth; snapEl.classList.add('go');
    if (navigator.vibrate) { try { navigator.vibrate(18); } catch (e) {} }
  }
  function tween(to, ms) {
    var from = val, t0 = performance.now();
    function step(now) {
      var k = clamp((now - t0) / ms, 0, 1), e = 1 - Math.pow(1 - k, 3);
      render(from + (to - from) * e);
      if (k < 1 && !drag) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var drag = false;
  function fromPointer(ev) {
    var r = dial.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var a = Math.atan2(ev.clientX - cx, -(ev.clientY - cy)) * 180 / Math.PI;
    var cur = ang(val);
    if (Math.abs(a - cur) > 200) return val;
    a = clamp(a, -135, 135);
    return MIN + (a + 135) / 270 * (MAX - MIN);
  }
  dial.addEventListener('pointerdown', function (e) { drag = true; touched = true; dial.setPointerCapture(e.pointerId); render(fromPointer(e)); });
  dial.addEventListener('pointermove', function (e) { if (drag) render(fromPointer(e)); });
  var up = function () { if (!drag) return; drag = false; render(Math.abs(val - TARGET) < 1.1 ? TARGET : Math.round(val)); };
  dial.addEventListener('pointerup', up); dial.addEventListener('pointercancel', up);
  dial.addEventListener('keydown', function (e) {
    var d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 }[e.key];
    if (d) { e.preventDefault(); touched = true; render(Math.round(val) + d); }
    if (e.key === 'Home') { e.preventDefault(); render(MIN); }
    if (e.key === 'End') { e.preventDefault(); render(MAX); }
  });
  $('#dial-snap').addEventListener('click', function () { touched = true; if (reduce) render(TARGET); else tween(TARGET, 1400); });
  render(val, true);
  if (!reduce) setTimeout(function () { if (!touched && !locked) tween(TARGET, 2600); }, 9000);

  /* ---------- service tabs ---------- */
  var tabs = $$('[role=tab]'), panels = $$('.stage .ph'), stage = $('#stage'), specImg = $('#spec-img');
  function pick(i, focus) {
    tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    specImg.classList.toggle('on', i === 0);
    stage.classList.remove('draw'); void stage.offsetWidth; stage.classList.add('draw');
    if (focus) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); pick((i + 1) % n, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); pick((i + n - 1) % n, true); }
    });
  });

  /* ---------- 58 to 72 caliper ---------- */
  var cal = $('#cal'), jaw = $('#cal-jaw'), now = $('#cal-now'), pct = 50, calDrag = false;
  function setP(p) {
    pct = clamp(p, 4, 96);
    cal.style.setProperty('--p', pct + '%');
    var t = 58 + pct / 100 * 14, r = Math.round(t);
    now.innerHTML = '<b>' + r + '</b>&deg;' + (r >= 72 ? ' just right' : ' and moving');
    jaw.setAttribute('aria-valuenow', r);
  }
  function calPtr(e) { var r = cal.getBoundingClientRect(); setP((e.clientX - r.left) / r.width * 100); }
  cal.addEventListener('pointerdown', function (e) { calDrag = true; cal.setPointerCapture(e.pointerId); calPtr(e); });
  cal.addEventListener('pointermove', function (e) { if (calDrag) calPtr(e); });
  ['pointerup', 'pointercancel'].forEach(function (n) { cal.addEventListener(n, function () { calDrag = false; }); });
  jaw.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setP(pct + 5); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setP(pct - 5); }
  });
  setP(50);
  if (!reduce) {
    var calIO = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) {
        calIO.disconnect(); var t0 = performance.now();
        (function s(n) { var k = clamp((n - t0) / 1800, 0, 1); if (!calDrag) setP(10 + 40 * (1 - Math.pow(1 - k, 3))); if (k < 1 && !calDrag) requestAnimationFrame(s); })(t0);
      }
    }, { threshold: 0.5 });
    calIO.observe(cal);
  }

  /* ---------- system drawing ---------- */
  var sys = $('#sys'), groups = $$('.g', sys), sysPct = $('#sys-pct'), texts = $$('text', sys);
  groups.forEach(function (g) { var gh = g.cloneNode(true); gh.setAttribute('class', 'gh'); g.parentNode.insertBefore(gh, g); });
  groups.forEach(function (g) { $$('path', g).forEach(function (p) { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = reduce ? '0' : '1'; }); });
  function sysUpdate() {
    if (reduce) { texts.forEach(function (t) { t.classList.add('on'); }); $$('.legend li').forEach(function (l) { l.classList.add('on'); }); sysPct.textContent = '100%'; return; }
    var vh = window.innerHeight, p;
    if (getComputedStyle(sys).position === 'sticky') {
      var r = sys.parentElement.getBoundingClientRect();
      p = clamp((vh * 0.55 - r.top) / (r.height - vh * 0.1), 0, 1);
    } else {
      var q = sys.getBoundingClientRect();
      p = clamp((vh * 0.92 - q.top) / (vh * 0.72), 0, 1);
    }
    var N = groups.length;
    groups.forEach(function (g, i) {
      var gp = clamp((p * 1.02 - i * (0.9 / N)) / (1.0 / N + 0.04), 0, 1);
      $$('path', g).forEach(function (pa) { pa.style.strokeDashoffset = (1 - gp).toFixed(3); });
      texts.forEach(function (t) { if (+t.getAttribute('data-t') === i) t.classList.toggle('on', gp > 0.85); });
      $$('.legend li').forEach(function (l) { if (+l.getAttribute('data-g') === i) l.classList.toggle('on', gp > 0.85); });
    });
    sysPct.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- rating count-up ---------- */
  var rn = $('#rate-num');
  if (!reduce) {
    rn.textContent = '0.0';
    var rio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) {
        rio.disconnect(); var t0 = performance.now();
        (function s(n) { var k = clamp((n - t0) / 1300, 0, 1); rn.textContent = (5 * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(s); })(t0);
      }
    }, { threshold: 0.6 });
    rio.observe(rn);
  } else { $('#stars').classList.add('on'); }

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), shots = $$('.gal button'), cur = 0;
  function show(i) {
    cur = (i + shots.length) % shots.length;
    var b = shots[cur], im = $('img', b), srcs = (im.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(' ')[0]; }).filter(Boolean);
    lbImg.src = srcs.length ? srcs[srcs.length - 1] : im.getAttribute('src');
    lbImg.alt = im.alt; lbCap.textContent = $('.cp', b).textContent + ' · Illustrative photo';
  }
  shots.forEach(function (b, i) { b.addEventListener('click', function () { show(i); lb.showModal(); }); });
  $('#lb-x').addEventListener('click', function () { lb.close(); });
  $('#lb-pv').addEventListener('click', function () { show(cur - 1); });
  $('#lb-nx').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  /* ---------- reticle cursor ---------- */
  var curEl = $('.cur');
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    window.addEventListener('mousemove', function (e) {
      curEl.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; curEl.classList.add('on');
      curEl.classList.toggle('hv', !!e.target.closest('a,button,[role=tab],[role=slider],input,textarea'));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { curEl.classList.remove('on'); });
  }

  /* ---------- quote form (demo: no backend) ---------- */
  var form = $('#qform'), ok = $('#f-ok');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = $$('input[required]', form).filter(function (i) { return !i.value.trim(); });
    if (missing.length) { ok.textContent = 'Please add your name, phone and email.'; missing[0].focus(); return; }
    ok.textContent = 'Preview: on the live website this request goes straight to Perfection Contracting.';
  });
})();
