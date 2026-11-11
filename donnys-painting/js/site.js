(function () {
  'use strict';
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* chip strips drop in when they scroll into view */
  var strips = $('[data-strip]');
  if (still || !('IntersectionObserver' in window)) { strips.forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    strips.forEach(function (e) { io.observe(e); });
  }

  /* before / after sliders (an invisible range input does the dragging: mouse, touch and keyboard) */
  function setPos(box, v) {
    box.style.setProperty('--pos', v + '%');
    box.style.setProperty('--pos-n', (v / 100).toFixed(4));
  }
  $('[data-ba]').forEach(function (box) {
    var r = box.querySelector('.ba-range');
    setPos(box, 50);
    var used = false;
    function use() { if (!used) { used = true; box.classList.add('used'); } }
    r.addEventListener('input', function () { use(); setPos(box, +r.value); });
    r.addEventListener('pointerdown', use);
    if (!still && 'IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          seen.disconnect();
          if (used) return;
          var t0 = null, from = 50;
          function step(t) {
            if (used) return;
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / 1800);
            var v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p * 0.3);
            r.value = v; setPos(box, v);
            if (p < 1) requestAnimationFrame(step); else { r.value = 50; setPos(box, 50); }
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      seen.observe(box);
    }
  });

  /* interior / exterior switch */
  var tabs = $('.sw-b');
  tabs.forEach(function (b, i) {
    function pick() {
      tabs.forEach(function (o) {
        var on = o === b;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
    }
    b.addEventListener('click', pick);
    b.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[n].click(); tabs[n].focus(); e.preventDefault();
    });
  });

  /* when to paint outside: month chips */
  var mo = $('.mo'), vc = document.getElementById('vcard');
  var col = { cold: 'var(--slate)', maybe: 'var(--stone)', good: 'var(--barn)' };
  mo.forEach(function (b) {
    b.addEventListener('click', function () {
      mo.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      vc.style.setProperty('--c', col[b.dataset.s]);
      document.getElementById('vmo').textContent = b.querySelector('b').textContent;
      document.getElementById('vhd').textContent = b.dataset.h;
      document.getElementById('vtx').textContent = b.dataset.t;
    });
  });
})();
