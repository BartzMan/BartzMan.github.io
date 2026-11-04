/* Next Level Property Pros: the level (the kit does menu, bar, lightbox, reveals, form). */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* 1. the step up: drag the bubble across the bathroom floor */
  var wipe = $('.wipe'), wr = $('.wipe-r');
  if (wipe && wr) {
    var set = function (v) { v = Math.max(0, Math.min(100, v)); wipe.style.setProperty('--p', v.toFixed(2) + '%'); wr.value = Math.round(v); };
    var fromX = function (x) { var r = wipe.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
    var drag = false;
    wipe.addEventListener('pointerdown', function (e) { drag = true; wipe.setPointerCapture(e.pointerId); set(fromX(e.clientX)); });
    wipe.addEventListener('pointermove', function (e) { if (drag) set(fromX(e.clientX)); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { wipe.addEventListener(t, function () { drag = false; }); });
    wr.addEventListener('input', function () { set(+wr.value); });
    set(50);
    if (!still && 'IntersectionObserver' in window) {
      var io0 = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io0.disconnect();
        var t0 = null, go = function (t) {
          if (drag) return; if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1800);
          set(50 + 32 * Math.sin(k * Math.PI * 2) * (1 - k)); if (k < 1) requestAnimationFrame(go); else set(50);
        };
        requestAnimationFrame(go);
      }, { threshold: 0.5 });
      io0.observe(wipe);
    }
  }

  /* 2. kitchen cabinets: before / after switch, the bubble moves with it */
  var frame = $('.cab-frame'), sw = $('.cab-switch');
  $$('.cab-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = b.getAttribute('data-s');
      frame.setAttribute('data-state', s);
      sw.classList.toggle('is-before', s === 'before');
      $$('.cab-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  /* 3. level check: each step done brings the bubble closer to centre */
  var boxes = $$('.ck-list input[type=checkbox]'), vial = $('.ck-vial'), say = $('.ck-say');
  var lines = ['0 of 5 done. The bubble is off to one side.', '1 of 5 done. Getting there.', '2 of 5 done. Keep going.', '3 of 5 done. Nearly between the lines.', '4 of 5 done. One more.', 'All 5 done. Dead level: the room is ready for paint.'];
  var upd = function () {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    if (vial) vial.style.setProperty('--b', (-0.9 + 0.9 * n / boxes.length).toFixed(3));
    if (say) say.textContent = lines[n];
  };
  boxes.forEach(function (b) { b.addEventListener('change', upd); });

  /* 4. dividers and the Columbus level settle when they reach the screen */
  var settle = $$('.divider, .city');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    settle.forEach(function (d) { io.observe(d); });
  } else settle.forEach(function (d) { d.classList.add('on'); });
})();
