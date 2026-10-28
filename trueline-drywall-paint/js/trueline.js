(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---- header, ruler, laser readout ---- */
  var head = $('.t-head'), ruler = $('.t-ruler'), num = $('#t-ruler-num'), tag = $('#t-laser-tag');
  var marks = [['.t-hero', 'Level · hero'], ['.t-ticker', 'Level · six steps'], ['#stages', '01 · stages'], ['#reveal', '02 · mud to paint'], ['#log', '03 · job log'], ['#request', '04 · Toledo']]
    .map(function (m) { return { el: $(m[0]), label: m[1] }; }).filter(function (m) { return m.el; });
  var lastTag = '';
  function onScroll() {
    var y = window.scrollY || 0, vh = window.innerHeight;
    if (head && !head.classList.contains('t-head-solid')) head.classList.toggle('is-stuck', y > 30);
    var max = Math.max(1, document.documentElement.scrollHeight - vh);
    var p = clamp(y / max, 0, 1);
    if (ruler) { ruler.style.setProperty('--p', p.toFixed(4)); num.textContent = Math.round(y / 12) + ' in'; }
    if (tag) {
      var ly = vh * 0.38, label = marks.length ? marks[0].label : 'Laser on';
      marks.forEach(function (m) { var r = m.el.getBoundingClientRect(); if (r.top <= ly) label = m.label; });
      if (label !== lastTag) { lastTag = label; tag.textContent = label; }
    }
    checkReveal();
  }

  /* ---- reveal: snap into place when passing 80% of the viewport ---- */
  var rv = $$('.t-head2, .t-card, .t-form, .t-cmp, .t-knife, .t-steps, .t-foot-grid > div');
  rv.forEach(function (el) { el.classList.add('reveal'); var i = Array.prototype.indexOf.call(el.parentNode.children, el); el.style.setProperty('--d', (Math.min(i, 5) * 0.08).toFixed(2) + 's'); });
  function checkReveal() {
    var vh = window.innerHeight;
    for (var i = rv.length - 1; i >= 0; i--) {
      var el = rv[i], r = el.getBoundingClientRect();
      if (r.top < vh * 0.88) { el.classList.add('in'); rv.splice(i, 1); (function (e) { setTimeout(function () { e.classList.remove('reveal'); e.style.removeProperty('--d'); if (!e.classList.contains('t-head2')) e.classList.remove('in'); }, 1600); })(el); }
    }
  }

  /* ---- menu sheet ---- */
  var burger = $('.t-burger'), sheet = $('#t-sheet');
  function setSheet(open) { sheet.hidden = !open; burger.setAttribute('aria-expanded', open ? 'true' : 'false'); document.body.style.overflow = open ? 'hidden' : ''; if (open) $('.t-sheet-x').focus(); else burger.focus(); }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(sheet.hidden); });
    $('.t-sheet-x').addEventListener('click', function () { setSheet(false); });
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });
  }

  /* ---- stages accordion ---- */
  var stages = $$('.t-stage');
  function openStage(i) {
    stages.forEach(function (s, k) {
      var on = k === i; s.classList.toggle('is-open', on);
      $('.t-stage-btn', s).setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }
  stages.forEach(function (s, i) {
    $('.t-stage-btn', s).addEventListener('click', function () { openStage(s.classList.contains('is-open') && window.innerWidth <= 1000 ? -1 : i); });
  });
  $$('[data-open]').forEach(function (a) { a.addEventListener('click', function () { openStage(+a.dataset.open); }); });

  /* ---- mud to paint slider + steps ---- */
  var cmp = $('#t-cmp'), range = $('#t-cmp-range'), steps = $$('.t-steps li');
  function setX(v) {
    cmp.style.setProperty('--x', v + '%');
    var n = Math.round((v / 100) * steps.length);
    steps.forEach(function (li, i) { li.classList.toggle('on', i < n); });
  }
  if (cmp && range) {
    range.addEventListener('input', function () { setX(+range.value); });
    setX(+range.value);
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return; io.disconnect();
          var t0 = null, from = 12, to = 50;
          range.value = from; setX(from);
          function tick(t) { if (!t0) t0 = t; var k = clamp((t - t0) / 1400, 0, 1), v = from + (to - from) * (1 - Math.pow(1 - k, 3)); if (+range.value !== Math.round(v) && !touched) { range.value = v; setX(v); } if (k < 1 && !touched) requestAnimationFrame(tick); }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.45 });
      var touched = false;
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { range.addEventListener(ev, function () { touched = true; }, { passive: true }); });
      io.observe(cmp);
    }
  }

  /* ---- job log lightbox ---- */
  var lb = $('#t-lb'), shots = $$('.t-shot'), cur = 0;
  function showShot(i) {
    cur = (i + shots.length) % shots.length; var s = shots[cur];
    var im = $('#t-lb-img'); im.src = s.dataset.full; im.alt = s.dataset.alt; $('#t-lb-cap').textContent = s.dataset.cap;
  }
  if (lb && typeof lb.showModal === 'function') {
    shots.forEach(function (s, i) { s.addEventListener('click', function () { showShot(i); lb.showModal(); }); });
    $('#t-lb-x').addEventListener('click', function () { lb.close(); });
    $('#t-lb-prev').addEventListener('click', function () { showShot(cur - 1); });
    $('#t-lb-next').addEventListener('click', function () { showShot(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') showShot(cur - 1); if (e.key === 'ArrowRight') showShot(cur + 1); });
  }

  /* ---- plumb bob push ---- */
  var plumb = $('#t-bob');
  if (plumb) plumb.addEventListener('click', function () { plumb.classList.remove('push'); void plumb.offsetWidth; plumb.classList.add('push'); });

  /* ---- rating count-up ---- */
  var count = $('#t-count'), stars = $('#t-stars');
  if (count && 'IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io3.disconnect(); stars && stars.classList.add('in'); if (reduce) return;
        var to = parseFloat(count.dataset.to), t0 = null;
        function tick(t) { if (!t0) t0 = t; var k = clamp((t - t0) / 1100, 0, 1); count.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(tick); else count.textContent = to.toFixed(1); }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io3.observe(count);
  } else if (stars) { stars.classList.add('in'); }

  var form = $('#t-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
