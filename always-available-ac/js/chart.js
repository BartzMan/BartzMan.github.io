/* Intracoastal chart: concept interactions (buoy tabs, inset buoys, bearing compass, drawn course) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. services: buoys on a channel (tabs) */
  var tabs = $$('.buoy-tab');
  function openTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openTab(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); openTab(n, true); }
    });
  });
  $$('[data-open]').forEach(function (a) {
    a.addEventListener('click', function () { var t = document.getElementById(a.getAttribute('data-open')); if (t) openTab(t); });
  });
  /* "Ask about ..." links note the service in the quote form */
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = $('form[data-kit-form] textarea');
      if (d && !d.value) d.value = 'About: ' + a.getAttribute('data-service') + '. ';
    });
  });

  /* 2. inset B: numbered buoys on the drawing show each part */
  var hots = $$('.hot, .part-btn');
  hots.forEach(function (h) {
    h.addEventListener('click', function () {
      var id = h.getAttribute('data-view');
      hots.forEach(function (o) { o.setAttribute('aria-pressed', o.getAttribute('data-view') === id ? 'true' : 'false'); });
      $$('.view').forEach(function (v) { v.hidden = v.id !== id; });
    });
  });

  /* 3. take a bearing: the needle swings to the symptom and its checks */
  var needle = $('.needle');
  var bs = $$('.bearing');
  bs.forEach(function (b) {
    b.addEventListener('click', function () {
      bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      if (needle) needle.style.setProperty('--deg', b.getAttribute('data-deg') + 'deg');
      $$('.bcard').forEach(function (c) { c.hidden = c.getAttribute('data-card') !== b.getAttribute('data-b'); });
    });
  });

  /* 4. passage plan: the course draws itself as the section scrolls by */
  var route = $('.passage-route');
  if (route) {
    if (still || !('requestAnimationFrame' in window)) { route.style.setProperty('--route', 1); }
    else {
      var tick = false;
      var upd = function () {
        tick = false;
        var r = route.getBoundingClientRect(), vh = window.innerHeight;
        var p = (vh * 0.75 - r.top) / (r.height);
        route.style.setProperty('--route', Math.max(0, Math.min(1, p)).toFixed(3));
      };
      window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    }
  }
})();
