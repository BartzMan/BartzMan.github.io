(function () {
  'use strict';
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* fish-scale courses lay themselves when they scroll into view */
  var sc = $('.scales');
  if (still || !('IntersectionObserver' in window)) { sc.forEach(function (e) { e.classList.add('laid'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('laid'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    sc.forEach(function (e) { io.observe(e); });
  }

  /* shingle style tabs */
  var tabs = $('.tab[role="tab"]');
  function pick(t) {
    tabs.forEach(function (b) {
      var on = b === t;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
      if (n < 0) return;
      n = (n + tabs.length) % tabs.length; pick(tabs[n]); tabs[n].focus(); e.preventDefault();
    });
  });

  /* older-home accordion */
  $('.acc-b').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      $('.acc-b').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* five questions: spindles fill as you tick */
  var qs = $('.q'), sp = $('#spind svg'), st = document.getElementById('askstate');
  function count() {
    var n = qs.filter(function (q) { return q.getAttribute('aria-pressed') === 'true'; }).length;
    sp.forEach(function (s, i) { s.classList.toggle('on', i < n); });
    if (st) st.textContent = n === 5 ? 'Five of five asked. You are ready to say yes.' : n + ' of 5 asked';
  }
  qs.forEach(function (q) {
    q.addEventListener('click', function () {
      q.setAttribute('aria-pressed', q.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      count();
    });
  });
})();
