/* Stump Removal Near Me: GROWTH RINGS interactions (vanilla JS) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- phone menu sheet ---- */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setSheet(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { sheet.hidden = false; document.body.style.overflow = 'hidden'; }
    else { sheet.hidden = true; document.body.style.overflow = ''; }
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSheet(false); });
  }

  /* ---- stump-to-ground slider ---- */
  var cmp = document.getElementById('compare');
  var range = document.getElementById('cmpRange');
  if (cmp && range) {
    var setPos = function (v) { cmp.style.setProperty('--pos', v + '%'); };
    range.addEventListener('input', function () { setPos(range.value); });
    // pointer drag anywhere on the photo
    var dragging = false;
    var fromEvent = function (e) {
      var r = cmp.getBoundingClientRect();
      var v = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      range.value = Math.round(v); setPos(v);
    };
    cmp.addEventListener('pointerdown', function (e) { dragging = true; fromEvent(e); });
    window.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    window.addEventListener('pointerup', function () { dragging = false; });
  }

  /* ---- services: rings <-> list ---- */
  var rings = document.querySelectorAll('.ring');
  var items = document.querySelectorAll('.svc-i');
  function pick(n) {
    rings.forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-svc') === n); });
    items.forEach(function (li) {
      var on = li.getAttribute('data-svc') === n;
      li.classList.toggle('is-on', on);
      var b = li.querySelector('button'); if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  }
  rings.forEach(function (g) {
    var n = g.getAttribute('data-svc');
    g.addEventListener('click', function () { pick(n); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n); } });
    g.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) pick(n); });
  });
  items.forEach(function (li) {
    var b = li.querySelector('button');
    if (b) b.addEventListener('click', function () { pick(li.getAttribute('data-svc')); });
  });

  /* ---- scroll: progress ring, ring counter, spreading rings ---- */
  var counter = document.querySelector('.counter');
  var dock = document.querySelector('.dock');
  var ringNow = document.getElementById('ringNow');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main [data-ring]'));
  var spreads = Array.prototype.slice.call(document.querySelectorAll('.spread, .disc'));
  var ticking = false;
  var pending = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    var max = Math.max(1, doc.scrollHeight - vh);
    doc.style.setProperty('--scroll', (window.scrollY / max).toFixed(4));
    var cur = '00';
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top < vh * 0.5) cur = sections[i].getAttribute('data-ring');
    }
    if (ringNow && ringNow.textContent !== cur) ringNow.textContent = cur;
    if (counter) counter.classList.toggle('show', window.scrollY > vh * 0.6);
    if (dock) dock.classList.toggle('show', window.scrollY > vh * 0.7);
    // belt and braces: reveal anything already above the fold line (fast scrolls, jumps to anchors)
    if (pending.length) {
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.94) { el.classList.add('in'); return false; }
        return true;
      });
    }
    if (!reduce) {
      spreads.forEach(function (el) {
        var host = el.closest('section, footer') || el;
        var b = host.getBoundingClientRect();
        var p = (vh - b.top) / (vh + b.height);
        el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      });
    }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- reveal on scroll (staggered) ---- */
  var rv = document.querySelectorAll('.rv');
  var groups = new Map();
  rv.forEach(function (el) {
    var host = el.parentElement;
    var k = groups.get(host) || 0;
    el.style.setProperty('--d', (k * 0.09).toFixed(2) + 's');
    groups.set(host, k + 1);
  });
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---- ring cursor (desktop, fine pointer only) ---- */
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    var label = cursor.querySelector('span');
    window.addEventListener('pointermove', function (e) {
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      if (t) { label.textContent = t.getAttribute('data-cursor'); cursor.classList.add('on'); }
      else cursor.classList.remove('on');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('on'); });
  }

  /* ---- quote form: opens the visitor's own email app ---- */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? String(el.value || '').trim() : ''; };
      var err = document.getElementById('qErr');
      if (!v('name') || !v('reach')) { if (err) err.hidden = false; (v('name') ? form.elements.reach : form.elements.name).focus(); return; }
      if (err) err.hidden = true;
      var svc = (form.querySelector('input[name="svc"]:checked') || {}).value || 'Stump grinding';
      var subject = 'Quote request: ' + svc + ' (' + v('name') + ')';
      var body = [
        'Hello Stump Removal Near Me,', '',
        'I would like a quote for: ' + svc,
        'How many stumps: ' + (v('count') || 'not sure'),
        'Rough width across the top: ' + (v('width') || 'not sure'),
        'Where it is / what is close by: ' + (v('notes') || '-'), '',
        'Name: ' + v('name'),
        'Phone or email: ' + v('reach'), '',
        'I can text or email a photo of the stump.'
      ].join('\n');
      window.location.href = 'mailto:stumpremovalnearmellc@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
