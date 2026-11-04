/* Heldt Painting: Flag City interactions (the kit does menu, bar, lightbox, reveals, form). */
(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* the hero flag stops waving for reduced motion */
  if (still) $$('.wave-anim').forEach(function (a) { a.parentNode.removeChild(a); });

  /* colour bands unfurl from the hoist side when they reach the screen */
  var bands = $$('.bands');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    bands.forEach(function (b) { io.observe(b); });
  } else bands.forEach(function (b) { b.classList.add('on'); });

  /* before / after: drag the halyard to raise the after */
  var frame = $('.wipe-frame'), range = $('.wipe-range');
  if (frame && range) {
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      frame.style.setProperty('--p', 'calc(' + v + '% )');
      frame.style.setProperty('--pn', (v / 100).toFixed(4));
      range.value = Math.round(v);
    };
    var hoistW = function () { return parseFloat(getComputedStyle(frame).getPropertyValue('--hoist')) || 0; };
    var fromX = function (x) { var r = frame.getBoundingClientRect(), h = hoistW(); return (x - r.left - h) / (r.width - h) * 100; };
    var drag = false;
    frame.addEventListener('pointerdown', function (e) { drag = true; frame.setPointerCapture(e.pointerId); set(fromX(e.clientX)); });
    frame.addEventListener('pointermove', function (e) { if (drag) set(fromX(e.clientX)); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { frame.addEventListener(t, function () { drag = false; }); });
    range.addEventListener('input', function () { set(+range.value); });
    // the after image is clipped from the hoist edge: map % of the photo area, not the whole frame
    var apply = function () {
      var v = +range.value, h = hoistW(), w = frame.getBoundingClientRect().width || 1;
      var pct = (h + (w - h) * v / 100) / w * 100;
      frame.style.setProperty('--p', pct.toFixed(3) + '%');
    };
    var oldSet = set;
    set = function (v) { oldSet(v); apply(); };
    window.addEventListener('resize', apply);
    set(50);
    // a slow first hoist so people see it moves
    if (!still && 'IntersectionObserver' in window) {
      var shown = false;
      var io2 = new IntersectionObserver(function (es) {
        if (shown || !es[0].isIntersecting) return; shown = true; io2.disconnect();
        var t0 = null;
        var step = function (t) {
          if (drag) return;
          if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600);
          var v = k < .5 ? 50 - 30 * Math.sin(k * 2 * Math.PI) : 50 + 22 * Math.sin((k - .5) * 2 * Math.PI);
          set(v); if (k < 1) requestAnimationFrame(step); else set(50);
        };
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
      io2.observe(frame);
    }

    /* pennant tabs swap the room */
    var pairs = [
      { b: 'builtin-before', a: 'builtin-after', bw: 910, aw: 908,
        ba: 'Before: built-in shelves and desk in primer, floor covered in plastic sheeting and blue tape',
        aa: 'After: white built-in shelves and desk against dark taupe walls, glossy wood floor',
        note: 'Primer and plastic sheeting, then white built-ins against dark walls and a finished wood floor.' },
      { b: 'basement-before', a: 'basement-after', bw: 910, aw: 908,
        ba: 'Before: open basement room with a wrapped column and paper-covered floor marked with blue tape',
        aa: 'After: the same room with cream walls, a white column and a wood-look plank floor in the light from a sliding door',
        note: 'Column wrapped and lines taped on the paper, then cream walls, a white column and a new plank floor.' }
    ];
    var before = $('.wipe-before'), after = $('.wipe-after'), note = $('.hoist-note');
    $$('.pennant').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = pairs[+btn.getAttribute('data-pair')];
        $$('.pennant').forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
        before.src = 'images/' + p.b + '.jpg'; before.srcset = 'images/' + p.b + '-720.jpg 720w, images/' + p.b + '.jpg 1016w'; before.alt = p.ba;
        after.src = 'images/' + p.a + '.jpg'; after.srcset = 'images/' + p.a + '-720.jpg 720w, images/' + p.a + '.jpg 1016w'; after.alt = p.aa;
        note.textContent = p.note;
        set(50);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var all = $$('.pennant'), i = all.indexOf(btn), n = all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
        n.focus(); n.click();
      });
    });
  }

  /* checklist: each line ticked paints one stripe of the flag */
  var boxes = $$('.check-list input[type=checkbox]');
  if (boxes.length) {
    var stripes = $$('.cf-s'), count = $('.cf-count'), done = $('.check-done');
    var upd = function () {
      var n = 0;
      boxes.forEach(function (b, i) { if (b.checked) n++; });
      stripes.forEach(function (s, i) { s.classList.toggle('on', i < n); });
      count.textContent = n + '/5';
      done.textContent = n === 0 ? 'Tick a line to start.' : n < 5 ? n + ' of 5 checked. Keep going.' :
        'All five checked. If any of them turned something up, text a photo to (419) 360-2382.';
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
    upd();
  }
})();
