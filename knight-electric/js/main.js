window.KE_SVC=[{"sq": "f3", "h": "Electrical repairs", "p": "A dead outlet, lights that flicker, a breaker that keeps tripping. We trace the fault and fix what is actually wrong.", "img": "images/stock-multimeter-test.jpg", "w": 1200, "hh": 1200, "alt": "A pair of hands holding test probes against wiring", "cap": "Illustrative stock photo: testing a circuit"}, {"sq": "d4", "h": "Panel upgrades", "p": "Swap or upgrade the breaker panel so the house can carry everything you have plugged into it.", "img": "images/stock-breaker-panel.jpg", "w": 1200, "hh": 1200, "alt": "Rows of circuit breakers and wiring inside an open panel", "cap": "Illustrative stock photo: a breaker panel"}, {"sq": "b5", "h": "Indoor lighting", "p": "Recessed cans, pendants, sconces and chandeliers, hung and wired where you want the light.", "img": "images/stock-recessed-ceiling.jpg", "w": 1200, "hh": 915, "alt": "A coffered ceiling with warm recessed lights", "cap": "Illustrative stock photo: recessed lighting"}, {"sq": "c7", "h": "Outdoor lighting", "p": "Path, porch and landscape lights that make the walk to the front door easy to see.", "img": "images/stock-path-light.jpg", "w": 1600, "hh": 1067, "alt": "A small path light standing among rocks and plants", "cap": "Illustrative stock photo: a path light"}, {"sq": "e8", "h": "Outlets & switches", "p": "New outlets, replacement switches and dimmers: the small jobs that make a room work.", "img": "images/stock-socket-repair.jpg", "w": 1000, "hh": 1498, "alt": "Hands replacing a wall socket on a grey wall", "cap": "Illustrative stock photo: socket repair"}, {"sq": "g7", "h": "Fans & fixtures", "p": "Ceiling fans and light fixtures mounted and wired so they hang straight and run quietly.", "img": "images/stock-ceiling-fan-living.jpg", "w": 1200, "hh": 1200, "alt": "A ceiling fan with a light in a bright living room", "cap": "Illustrative stock photo: a ceiling fan"}, {"sq": "h5", "h": "New wiring & installs", "p": "New circuits and fresh wiring for the things you are adding to the house.", "img": "images/stock-junction-box.jpg", "w": 1600, "hh": 1200, "alt": "An open junction box packed with wires between wall studs", "cap": "Illustrative stock photo: a junction box"}];
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---- 1. header + knight scroll progress (hops each 10%) ---- */
  var head = $('.ke-head'), prog = $('.ke-prog'), lastStep = -1;
  function onScroll() {
    var y = window.scrollY || 0;
    if (head && !head.classList.contains('ke-head-solid')) head.classList.toggle('is-stuck', y > 40);
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = clamp(y / max, 0, 1);
    if (prog) {
      prog.style.setProperty('--p', p.toFixed(4));
      var step = Math.floor(p * 10);
      if (step !== lastStep && !reduce) {
        lastStep = step; prog.classList.remove('hop'); void prog.offsetWidth; prog.classList.add('hop');
      }
    }
    wireProgress();
  }

  /* ---- 2. reveal on scroll, staggered ---- */
  var rvTargets = $$('.ke-sec-head, .ke-panel, .ke-board-col, .ke-dimmer, .ke-dim-stage, .ke-move, .ke-plate, .ke-card, .ke-form, .ke-foot-grid > div, .ke-sec-sub');
  rvTargets.forEach(function (el, i) { el.classList.add('reveal'); var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0; el.style.setProperty('--d', (Math.min(sib, 5) * 0.09).toFixed(2) + 's'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var el = e.target; el.classList.add('in'); io.unobserve(el); setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 1500); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rvTargets.forEach(function (el) { io.observe(el); });
  } else { rvTargets.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- 3. mobile menu sheet ---- */
  var burger = $('.ke-burger'), sheet = $('#ke-sheet');
  function setSheet(open) {
    if (!sheet) return;
    sheet.hidden = !open; burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var x = $('.ke-sheet-x', sheet); x && x.focus(); } else { burger && burger.focus(); }
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(sheet.hidden); });
    $('.ke-sheet-x', sheet).addEventListener('click', function () { setSheet(false); });
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });
  }

  /* ---- 4. THE BOARD: knight hops to the clicked service square ---- */
  var SV = window.KE_SVC || [];
  var board = $('#ke-board'), knight = $('#ke-knight'), panel = $('#ke-panel');
  var started = false;
  var cur = { f: 6, r: 7 }; // g1
  var FILES = 'abcdefgh';
  function place(f, r) { knight.style.left = (f * 12.5) + '%'; knight.style.top = (r * 12.5) + '%'; }
  function showService(i, fromUser) {
    var s = SV[i]; if (!s) return;
    $('#ke-panel-h').textContent = s.h.replace('&amp;', '&');
    $('#ke-panel-p').textContent = s.p;
    $('#ke-panel-sq').textContent = s.sq;
    $('#ke-panel-count').textContent = 'Move ' + (i + 1) + ' of ' + SV.length;
    $('#ke-panel-cap').textContent = s.cap;
    var im = $('#ke-panel-img'); im.src = s.img; im.alt = s.alt; im.width = s.w; im.height = s.hh;
    $('#ke-notation').textContent = 'Knight to ' + s.sq + '. ' + s.h + '.';
    $$('.ke-sq.svc', board).forEach(function (b) { b.classList.toggle('on', +b.dataset.i === i); b.setAttribute('aria-pressed', +b.dataset.i === i ? 'true' : 'false'); });
    if (!reduce) { panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
  }
  var hopTimers = [];
  function later(fn, ms) { hopTimers.push(setTimeout(fn, ms)); }
  function hopTo(btn, userTriggered) {
    hopTimers.forEach(clearTimeout); hopTimers = [];
    if (userTriggered) started = true;
    var f = +btn.dataset.f, r = +btn.dataset.r, i = +btn.dataset.i;
    if (reduce) { place(f, r); cur = { f: f, r: r }; showService(i); return; }
    var dx = Math.abs(f - cur.f), dy = Math.abs(r - cur.r);
    var vertFirst = dy >= dx;
    function leap() { knight.classList.remove('hop'); void knight.offsetWidth; knight.classList.add('hop'); }
    leap();
    if (vertFirst) { knight.style.top = (r * 12.5) + '%'; later(function () { leap(); knight.style.left = (f * 12.5) + '%'; }, 260); }
    else { knight.style.left = (f * 12.5) + '%'; later(function () { leap(); knight.style.top = (r * 12.5) + '%'; }, 260); }
    cur = { f: f, r: r };
    later(function () { showService(i); }, 420);
  }
  if (board && knight) {
    $$('.ke-sq.svc', board).forEach(function (b) { b.addEventListener('click', function () { hopTo(b, true); }); });
    var first = $('.ke-sq.svc[data-i="0"]', board);
    if ('IntersectionObserver' in window && first) {
      var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io2.disconnect(); setTimeout(function () { if (!started) { started = true; hopTo(first); } }, 500); } }); }, { threshold: 0.5 });
      io2.observe(board);
    } else if (first) { showService(0); }
    $$('[data-open]').forEach(function (a) { a.addEventListener('click', function () { var b = $('.ke-sq.svc[data-i="' + a.dataset.open + '"]', board); if (b) setTimeout(function () { hopTo(b, true); }, 700); }); });
  }

  /* ---- 5. dimmer ---- */
  var range = $('#ke-dim-range'), stage = $('#ke-stage'), out = $('#ke-dim-out');
  function setDim(v) {
    stage.style.setProperty('--b', (v / 100).toFixed(3));
    out.textContent = Math.round(v) + '%';
    $$('.ke-dimmer-btns button').forEach(function (b) { b.classList.toggle('on', +b.dataset.v === +v); });
  }
  if (range && stage) {
    range.addEventListener('input', function () { setDim(+range.value); });
    $$('.ke-dimmer-btns button').forEach(function (b) { b.addEventListener('click', function () { range.value = b.dataset.v; setDim(+b.dataset.v); }); });
    setDim(+range.value);
  }

  /* ---- 6. scroll-drawn wire between the three moves ---- */
  var track = $('#ke-moves-track');
  function layoutWire() {
    var svg = $('#ke-wire'); if (!track || !svg) return;
    var W = track.clientWidth, H = track.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    function P(x, y) { return (x * W).toFixed(1) + ' ' + (y * H).toFixed(1); }
    var d = 'M' + P(0, .09) + ' C' + P(.18, .09) + ',' + P(.25, .33) + ',' + P(.335, .5) + ' S' + P(.52, .9) + ',' + P(.665, .64) + ' S' + P(.9, .12) + ',' + P(1, .24);
    $('#ke-wire-bg').setAttribute('d', d); $('#ke-wire-fg').setAttribute('d', d);
  }
  function wireProgress() {
    if (!track) return;
    var r = track.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * 0.78 - r.top) / (r.height * 0.9), 0, 1);
    track.style.setProperty('--p', p.toFixed(4));
  }

  /* ---- 7. plates reel: drag with mouse, arrows, swipe by touch ---- */
  var reel = $('#ke-reel');
  if (reel) {
    var down = false, sx = 0, sl = 0, moved = false;
    reel.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') return; down = true; moved = false; sx = e.clientX; sl = reel.scrollLeft; reel.classList.add('drag'); });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; reel.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { down = false; reel.classList.remove('drag'); });
    function by(dir) { var w = $('.ke-plate', reel).getBoundingClientRect().width + 28; reel.scrollBy({ left: dir * w * 2, behavior: reduce ? 'auto' : 'smooth' }); }
    $('#ke-prev').addEventListener('click', function () { by(-1); });
    $('#ke-next').addEventListener('click', function () { by(1); });
    reel.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { by(1); e.preventDefault(); } if (e.key === 'ArrowLeft') { by(-1); e.preventDefault(); } });
  }

  /* ---- 8. rating card: stars pop in, number counts up ---- */
  var count = $('#ke-count'), stars = $('#ke-stars');
  if (count && 'IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io3.disconnect(); stars && stars.classList.add('in');
        if (reduce) return;
        var to = parseFloat(count.dataset.to), t0 = null;
        function tick(t) { if (!t0) t0 = t; var k = clamp((t - t0) / 1100, 0, 1); count.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(tick); else count.textContent = to.toFixed(1); }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io3.observe(count);
  } else if (stars) { stars.classList.add('in'); }

  /* ---- 9. form: preview only ---- */
  var form = $('#ke-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layoutWire(); onScroll(); });
  layoutWire(); window.addEventListener('load', layoutWire);
  onScroll();
})();
