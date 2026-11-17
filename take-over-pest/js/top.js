(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var root = document.documentElement;

  /* THE BUILDING: tap a room, see the work order */
  var units = $$('.unit'), panels = $$('.pn');
  function pick(k, scroll) {
    units.forEach(function (u) { u.setAttribute('aria-pressed', u.getAttribute('data-u') === k ? 'true' : 'false'); });
    panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-p') === k); });
    if (scroll && window.matchMedia('(max-width:900px)').matches) {
      var on = $('.pn.on');
      if (on) { var r = on.getBoundingClientRect(); if (r.top > innerHeight * 0.7 || r.top < 60) on.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  }
  units.forEach(function (u) { u.addEventListener('click', function () { pick(u.getAttribute('data-u'), true); }); });

  /* Apartment / Whole building */
  function setMode(m) {
    root.setAttribute('data-mode', m);
    $$('.mode button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
    var who = m === 'bldg' ? 'Whole building' : 'Apartment';
    $$('.who button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-who') === who ? 'true' : 'false'); });
    var h = $('input[name=scope]'); if (h) h.value = who;
  }
  $$('.mode button').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
  $$('.who button').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-who') === 'Whole building' ? 'bldg' : 'apt'); }); });

  /* 5 things to do today */
  var chk = $$('#chk button'), n = $('#chkn'), box = $('.u-note');
  function count() {
    var d = chk.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).length;
    if (n) n.textContent = d === 5 ? 'All 5 done. Still seeing them? Call.' : d + ' of 5 done';
    if (box) box.style.setProperty('--done', d / 5);
  }
  chk.forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); count(); }); });
  count();

  /* elevator floor readout tied to scroll */
  var lift = $('#lift'), last = 0;
  function floor() {
    var s = parseFloat(getComputedStyle(root).getPropertyValue('--kit-scroll')) || 0;
    var f = 6 - Math.round(s * 5);
    if (lift && f !== last) { lift.textContent = f; last = f; }
  }
  addEventListener('scroll', floor, { passive: true }); floor();
})();
