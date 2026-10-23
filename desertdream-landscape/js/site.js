/* DesertDream Landscape : Botanical Plates */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  /* phone sheet */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    sheet.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    var t = burger.querySelector('.burger__txt');
    if (t) t.textContent = open ? 'Close' : 'Index';
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* before / after sliders: left = before, right = after */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var dragging = false;
    function set(p) {
      p = Math.max(2, Math.min(98, p));
      ba.style.setProperty('--pos', p + '%');
      if (range) range.value = Math.round(p);
    }
    function fromEvent(e) {
      var r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }
    ba.addEventListener('pointerdown', function (e) {
      dragging = true; ba.dataset.touched = '1';
      if (ba.setPointerCapture) ba.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
      ba.addEventListener(t, function () { dragging = false; });
    });
    if (range) range.addEventListener('input', function () { ba.dataset.touched = '1'; set(+range.value); });
    ba._set = set;
  });

  /* reveal on scroll, staggered; draw the line drawings; nudge each slider once */
  var revealEls = document.querySelectorAll('.rv, .draw');
  if ('IntersectionObserver' in window && !reduce) {
    var groups = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var parent = el.parentElement;
        var n = groups.get(parent) || 0;
        groups.set(parent, n + 1);
        el.style.setProperty('--d', Math.min(n * 0.09, 0.45) + 's');
        el.classList.add('in');
        io.unobserve(el);
        var ba = el.querySelector && el.querySelector('.ba');
        if (ba && !ba.dataset.touched) sweep(ba);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }
  function sweep(ba) {
    var t0 = null, dur = 1800;
    function step(t) {
      if (ba.dataset.touched) return;
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      ba._set(50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k));
      if (k < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 700);
  }

  /* scroll progress, plate index, Phoenix parallax */
  var bar = document.querySelector('.progress__bar');
  var idx = document.querySelectorAll('.plate-index a');
  var secs = document.querySelectorAll('[data-plate-sec]');
  var phx = document.querySelector('.phx__photo img');
  var dock = document.querySelector('.dock');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var h = doc.scrollHeight - window.innerHeight;
    if (dock) dock.classList.toggle('is-hidden', window.scrollY < 420);
    if (bar) bar.style.setProperty('--p', h > 0 ? (window.scrollY / h).toFixed(4) : 0);
    var cur = null;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = s.getAttribute('data-plate-sec'); });
    idx.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('data-plate') === cur); });
    if (phx && !reduce) {
      var r = phx.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        phx.style.setProperty('--py', (-(r.top + r.height) * 0.1).toFixed(1) + 'px');
      }
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* hover badge that follows the pointer over CTAs and sliders */
  var cur = document.querySelector('.cursor');
  if (cur && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var label = cur.querySelector('span');
    document.addEventListener('pointermove', function (e) {
      cur.style.setProperty('--cx', e.clientX + 'px');
      cur.style.setProperty('--cy', e.clientY + 'px');
      var t = e.target.closest && e.target.closest('[data-cursor]');
      if (t && t.classList.contains('ba')) {
        label.textContent = t.getAttribute('data-cursor');
        cur.classList.add('is-on');
      } else {
        cur.classList.remove('is-on');
      }
    });
  }

  /* quote card -> WhatsApp with the answers filled in */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var err = form.querySelector('.card__err');
      var name = (f.name.value || '').trim();
      if (!name) { if (err) err.hidden = false; f.name.focus(); return; }
      if (err) err.hidden = true;
      var area = form.querySelector('input[name=area]:checked');
      var lines = [
        'Hi DesertDream Landscape, I would like a quote for my yard.',
        'Name: ' + name,
        'Service: ' + f.service.value,
        'Area: ' + (area ? area.value : ''),
      ];
      if (f.where.value.trim()) lines.push('Neighborhood/ZIP: ' + f.where.value.trim());
      if (f.notes.value.trim()) lines.push('Notes: ' + f.notes.value.trim());
      lines.push('I will attach photos of the yard here.');
      window.location.href = 'https://wa.me/14804335704?text=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
