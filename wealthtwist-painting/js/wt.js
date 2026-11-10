(function () {
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  /* 1. the tape peel: each [data-peel] element is peeled as it scrolls into view */
  var peels = $$('[data-peel]');
  function peel() {
    var vh = innerHeight;
    peels.forEach(function (el) {
      var p;
      if (el.dataset.peel === 'hero') p = clamp(0.2 + scrollY / 380);
      else { var r = el.getBoundingClientRect(); p = clamp((vh * 0.95 - r.top) / (vh * 0.42)); }
      el.style.setProperty('--peel', still ? 1 : p.toFixed(3));
    });
  }
  if (peels.length) {
    var t = false;
    addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(function () { t = false; peel(); }); } }, { passive: true });
    addEventListener('resize', peel);
    peel();
  }

  /* 2. before / after tape wipes (mouse, touch, keyboard through the range input) */
  var wipes = {};
  $$('[data-wipe]').forEach(function (w) {
    var inp = $('input', w), id = w.dataset.wipe;
    function set(v) { w.style.setProperty('--w', v.toFixed(3)); inp.value = Math.round(v * 100); }
    wipes[id] = { set: set, get: function () { return +inp.value / 100; } };
    inp.addEventListener('input', function () { w.style.setProperty('--w', (inp.value / 100).toFixed(3)); w.dataset.touched = '1'; });
    // once, when it scrolls into view, the tape is pulled across so people see it moves
    if ('IntersectionObserver' in window && !still) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            io.disconnect();
            var t0 = null;
            requestAnimationFrame(function step(ts) {
              if (w.dataset.touched) return;
              if (t0 === null) t0 = ts;
              var k = clamp((ts - t0) / 1500), ease = 1 - Math.pow(1 - k, 3);
              set(0.94 - 0.44 * ease);
              if (k < 1) requestAnimationFrame(step);
            });
          }
        });
      }, { threshold: 0.45 });
      io.observe(w);
    }
  });
  $$('[data-wipe-set]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = b.dataset.wipeSet.split(':'), w = wipes[a[0]];
      if (!w) return;
      $('[data-wipe="' + a[0] + '"]').dataset.touched = '1';
      var from = w.get(), to = +a[1] === 1 ? 1 : 0, t0 = null;
      requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var k = clamp((ts - t0) / (still ? 1 : 600)), e = 1 - Math.pow(1 - k, 3);
        w.set(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
      });
    });
  });

  /* 3. cabinets: four checks and a verdict */
  var cards = $$('.ck'), verdict = $('#ck-verdict'), ans = {};
  cards.forEach(function (c) {
    $$('button', c).forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        $$('button', c).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        ans[c.dataset.q] = +b.dataset.v;
        verdictUpd();
      });
    });
  });
  function verdictUpd() {
    var keys = Object.keys(ans), good = keys.reduce(function (n, k) { return n + ans[k]; }, 0), msg;
    if (keys.length < 4) msg = keys.length + ' of 4 answered. Keep going.';
    else if (good >= 3) msg = 'Leans towards repainting. It is worth having someone look at the doors and boxes in person.';
    else if (good <= 1) msg = 'Leans towards replacing, or at least a closer look before anyone picks up a brush.';
    else msg = 'A mix. Painting may still work for some parts: a look in person will settle it.';
    verdict.innerHTML = '<span class="wt-marker">your result</span>';
    verdict.appendChild(document.createTextNode(' ' + msg));
  }

  /* 4. gallery filter */
  var chips = $$('.wt-chip'), figs = $$('.wt-masonry figure');
  chips.forEach(function (c) {
    c.setAttribute('aria-pressed', String(c.classList.contains('is-on')));
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.toggle('is-on', x === c); x.setAttribute('aria-pressed', String(x === c)); });
      figs.forEach(function (f) { f.hidden = !(c.dataset.f === 'all' || f.dataset.t === c.dataset.f); });
    });
  });
})();
