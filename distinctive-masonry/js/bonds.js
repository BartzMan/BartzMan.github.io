/* Distinctive Design Masonry: brick-wall services, stoop check, running-bond photo wall */
(function () {
  'use strict';
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  function tabs(tabSel, panelSel) {
    var t = $$(tabSel), p = $$(panelSel);
    if (!t.length) return null;
    function pick(i, focus) {
      t.forEach(function (x, k) { x.setAttribute('aria-selected', k === i ? 'true' : 'false'); x.tabIndex = k === i ? 0 : -1; if (k === i && focus) x.focus(); });
      p.forEach(function (x, k) { x.classList.toggle('is-on', k === i); });
    }
    t.forEach(function (x, k) {
      x.addEventListener('click', function () { pick(k); });
      x.addEventListener('keydown', function (e) {
        var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key], n = t.length;
        if (d) { e.preventDefault(); pick((k + d + n) % n, true); }
        if (e.key === 'Home') { e.preventDefault(); pick(0, true); }
        if (e.key === 'End') { e.preventDefault(); pick(n - 1, true); }
      });
    });
    pick(0);
    return pick;
  }

  /* 1. services: pull a brick out of the wall */
  var pickJob = tabs('.job-brick', '.job-panel');
  $$('[data-goto-job]').forEach(function (a) {
    a.addEventListener('click', function () { if (pickJob) pickJob(+a.getAttribute('data-goto-job')); });
  });

  /* 2. useful: climb the stoop, one check per step */
  tabs('.stoop-steps .st', '.sp');

  /* 3. photo wall: highlight one kind of job, the bond stays in place */
  var wall = document.querySelector('.photo-wall');
  $$('.bond-filter button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      wall.classList.toggle('is-filtering', f !== 'all');
      $$('.pb', wall).forEach(function (x) { x.classList.toggle('is-match', x.getAttribute('data-k') === f); });
    });
  });
})();
