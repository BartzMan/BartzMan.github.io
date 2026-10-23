/* Quality Tree Solutions — LOOK UP
   Height ruler (0 ft at the top of the page, 60 ft at the footer), menu sheet,
   scroll reveals, cursor badge and the WhatsApp quote form. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- ruler ---- */
  var PX = 28, TOP_FT = 80, MAX_FT = 60;
  var tape = document.querySelector('.ruler-tape');
  var num = document.querySelector('.ruler-num');
  var alt = document.querySelector('.alt-num');
  var ruler = document.querySelector('.ruler');
  if (tape) {
    tape.style.height = (100 * PX) + 'px';
    for (var f = 0; f <= MAX_FT; f += 5) {
      var s = document.createElement('span');
      s.textContent = f + "'";
      if (f === 0 || f === MAX_FT) s.className = 'z';
      s.style.top = ((TOP_FT - f) * PX) + 'px';
      tape.appendChild(s);
    }
  }
  var hdr = document.querySelector('.hdr');
  var ticking = false;
  function update() {
    ticking = false;
    var max = doc.scrollHeight - window.innerHeight;
    var r = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var ft = r * MAX_FT;
    var label = (ft < 9.5 ? '0' : '') + Math.round(ft);
    if (num) num.textContent = label;
    if (alt) alt.textContent = label;
    if (tape) {
      var needle = window.innerHeight / 2;
      tape.style.transform = 'translateY(' + (needle - (TOP_FT - ft) * PX) + 'px)';
    }
    if (ruler) ruler.style.setProperty('--p', (r * 100) + '%');
    if (hdr) hdr.classList.toggle('solid', window.scrollY > 40 || document.body.classList.contains('inner'));
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---- lens tick ring ---- */
  var g = document.querySelector('.lens-ticks');
  if (g) {
    var ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < 72; i++) {
      var a = i * 5 * Math.PI / 180, long = i % 6 === 0;
      var r1 = 97, r2 = long ? 88 : 92;
      var l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', 100 + r1 * Math.cos(a)); l.setAttribute('y1', 100 + r1 * Math.sin(a));
      l.setAttribute('x2', 100 + r2 * Math.cos(a)); l.setAttribute('y2', 100 + r2 * Math.sin(a));
      g.appendChild(l);
    }
  }

  /* ---- menu sheet ---- */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) { var first = sheet.querySelector('a'); if (first) first.focus(); }
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---- reveals ---- */
  var items = document.querySelectorAll('.rv, .grow, .city-h');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- cursor badge over photos (fine pointers only) ---- */
  var cur = document.querySelector('.cursor');
  if (cur && !reduce && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
    }, { passive: true });
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('on'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
    });
  }

  /* ---- WhatsApp quote form ---- */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var err = form.querySelector('.f-err');
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var h = form.querySelector('input[name="height"]:checked');
      var lines = [
        'Hi Quality Tree Solutions, I would like a quote.',
        'Name: ' + name,
        'Service: ' + form.elements.service.value,
        'Roughly how tall: ' + (h ? h.value : 'Not sure')
      ];
      if (form.elements.area.value.trim()) lines.push('Area / ZIP: ' + form.elements.area.value.trim());
      if (form.elements.notes.value.trim()) lines.push('Notes: ' + form.elements.notes.value.trim());
      lines.push('I will add a photo of the tree here.');
      window.open('https://wa.me/17024674739?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
