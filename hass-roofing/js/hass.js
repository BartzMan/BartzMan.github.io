(function () {
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };

  /* year counter 1978 -> current year, once */
  var yr = $('[data-yr]');
  if (yr) {
    var to = new Date().getFullYear(), from = +yr.getAttribute('data-from') || 1978;
    yr.setAttribute('data-n', to);
    if (!still) {
      var t0 = null, dur = 2200;
      yr.setAttribute('data-n', from);
      var tick = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        yr.setAttribute('data-n', Math.round(from + (to - from) * e));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* fly-over strip arrows */
  var strip = $('[data-strip]');
  $$('[data-fly]').forEach(function (b) {
    b.addEventListener('click', function () {
      var w = strip.querySelector('.fly').getBoundingClientRect().width + 28;
      strip.scrollBy({ left: w * +b.getAttribute('data-fly'), behavior: still ? 'auto' : 'smooth' });
    });
  });
  if (strip) strip.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') strip.scrollBy({ left: 400, behavior: 'smooth' });
    if (e.key === 'ArrowLeft') strip.scrollBy({ left: -400, behavior: 'smooth' });
  });

  /* protection stepper: zoom the photo to each spot */
  var texts = [
    ['Cover the water', 'At the bottom of the photo a tarp is stretched over the pool and the deck beside it. Covering the water keeps shingle bits and nails out of it, so it is a fair thing to ask about before work starts.'],
    ['Tarp the walls and beds', 'Blue tarps run along the base of the house and collect the scraps that slide off the roof. Planting beds and patio edges are the places to ask about, because they are hard to pick clean afterwards.'],
    ['Old roofing leaves by the load', 'Top right, a trailer waits beside the drive. Old shingles belong in a trailer or a bin, not piled on the lawn, so ask where the load goes and how it is kept off the grass.'],
    ['Sweep before leaving', 'The drive and the lawn beside it are where nails and tabs end up. A magnet sweep at the end of each day, and again at the finish, is a normal thing to ask for.']
  ];
  var zoom = $('[data-zoom]');
  if (zoom) {
    var img = $('img', zoom), ring = $('[data-ring]', zoom), out = $('[data-step-out]');
    var btns = $$('.step');
    var go = function (b, i) {
      btns.forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
      var x = +b.dataset.x, y = +b.dataset.y, s = +b.dataset.s;
      img.style.transformOrigin = x + '% ' + y + '%';
      img.style.transform = 'scale(' + s + ')';
      ring.style.left = x + '%'; ring.style.top = y + '%';
      out.innerHTML = '<h3></h3><p></p>';
      out.firstChild.textContent = texts[i][0];
      out.lastChild.textContent = texts[i][1];
    };
    btns.forEach(function (b, i) { b.setAttribute('aria-pressed', i === 0); b.addEventListener('click', function () { go(b, i); }); });
  }

  /* checklist meter */
  var list = $('[data-check]');
  if (list) {
    var meter = $('[data-meter]'), txt = $('[data-meter-txt]');
    var boxes = $$('input', list);
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      meter.style.width = (n / boxes.length * 100) + '%';
      txt.textContent = n === boxes.length ? 'All set. Roof day, here you come.' : n + ' of ' + boxes.length + ' done';
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
  }
})();
