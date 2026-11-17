(function () {
  'use strict';
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero stalls paint once, staggered */
  $('.stalls li').forEach(function (li, i) { li.style.setProperty('--i', i); });

  /* STRIPE THE LOT */
  var svg = document.querySelector('.lot'), chips = $('.chip'), cards = $('.lcard');
  var order = ['sealcoat', 'stalls', 'ada', 'fire', 'ev', 'arrows'];
  function layerEls(k) { var a = [svg.querySelector('#L-' + k)]; if (k === 'stalls') a.push(svg.querySelector('#L-nums')); return a; }
  function paint(k, on) {
    layerEls(k).forEach(function (g) { if (g) g.classList.toggle('on', on); });
    if (k === 'sealcoat') svg.classList.toggle('sealed', on);
    chips.forEach(function (c) { if (c.getAttribute('data-l') === k) c.classList.toggle('done', on); });
  }
  function show(k) {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-l') === k)); });
    cards.forEach(function (c) { c.hidden = c.id !== 'c-' + k; });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var k = c.getAttribute('data-l'); paint(k, true); show(k);
      var info = document.querySelector('.lot-info');
      if (window.innerWidth <= 1100 && info) { var r = info.getBoundingClientRect(); if (r.top > innerHeight * .75 || r.bottom < 0) info.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });
  var allBtn = document.querySelector('[data-all]'), clr = document.querySelector('[data-clear]');
  function paintAll(slow) {
    order.forEach(function (k, i) { setTimeout(function () { paint(k, true); }, slow ? i * 650 : 0); });
  }
  if (allBtn) allBtn.addEventListener('click', function () { paintAll(true); });
  if (clr) clr.addEventListener('click', function () { order.forEach(function (k) { paint(k, false); }); show('sealcoat'); });
  var lotSec = document.getElementById('lot');
  if (lotSec && 'IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { paintAll(true); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(lotSec);
  } else { paintAll(false); }

  /* commercial / driveways */
  var sws = $('.sw');
  sws.forEach(function (s) {
    s.addEventListener('click', function () {
      var m = s.getAttribute('data-m');
      sws.forEach(function (o) { o.setAttribute('aria-selected', String(o === s)); });
      $('.svc-panel').forEach(function (p) { p.hidden = p.id !== 'm-' + m; });
    });
  });

  /* 5 signs */
  var bays = $('.bay'), count = document.querySelector('[data-count]'), msg = document.querySelector('[data-msg]');
  var texts = ['Tap the stalls that sound like your lot.', 'One sign so far. Worth keeping an eye on.', 'A few signs. A look at the lot could be worthwhile.', 'A few signs. A look at the lot could be worthwhile.', 'Most stalls are full. It may be time to ask for a quote.', 'Every stall is full. It may be time to ask for a quote.'];
  function tally() {
    var n = bays.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    count.textContent = n + ' of 5'; msg.textContent = texts[n];
  }
  bays.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); tally(); }); });
})();
