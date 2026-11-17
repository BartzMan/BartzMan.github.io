(function () {
  'use strict';
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* EN / ES switch: Spanish says the same facts */
  var tr = $('[data-es]');
  tr.forEach(function (el) { el.setAttribute('data-en', el.innerHTML); });
  function setLang(l) {
    tr.forEach(function (el) { el.innerHTML = el.getAttribute(l === 'es' ? 'data-es' : 'data-en'); });
    root.lang = l;
    $('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    try { localStorage.setItem('mv-lang', l); } catch (e) {}
  }
  $('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); }); });
  try { if (localStorage.getItem('mv-lang') === 'es') setLang('es'); } catch (e) {}

  /* panel map */
  var brks = $('button.brk'), details = $('.detail');
  brks.forEach(function (b) {
    b.addEventListener('click', function () {
      brks.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      details.forEach(function (d) { d.hidden = d.id !== 'd-' + b.getAttribute('data-k'); });
      var wrap = document.querySelector('.detail-wrap');
      if (window.innerWidth < 1100 && wrap) {
        var r = wrap.getBoundingClientRect();
        if (r.top > window.innerHeight * .7 || r.bottom < 0) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* 4 checks route */
  var stops = $('.stop'), steps = $('.route-card .step'), cur = 0;
  function go(i) {
    cur = i;
    stops.forEach(function (s, k) { s.setAttribute('aria-pressed', String(k === i)); });
    steps.forEach(function (p, k) { p.hidden = k !== i; });
  }
  stops.forEach(function (s, i) { s.addEventListener('click', function () { go(i); }); });
  var nx = document.querySelector('[data-next]');
  if (nx) nx.addEventListener('click', function () { go((cur + 1) % stops.length); });

  /* home / building */
  var sws = $('.sw');
  sws.forEach(function (s) {
    s.addEventListener('click', function () {
      var m = s.getAttribute('data-m');
      sws.forEach(function (o) { o.setAttribute('aria-selected', String(o === s)); });
      $('.m-panel').forEach(function (p) { p.hidden = p.id !== 'm-' + m; });
    });
  });
})();
