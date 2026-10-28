/* Above All Exteriors: altitude HUD, target lock, wipe, anatomy pins, flight path. Vanilla JS, no deps. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---- reveal on scroll (staggered) ---- */
  var groups = ['.big', '.lead', '.hud-chip', '.hero-sub', '.tgt', '.stage', '.note', '.legend', '.fr', '.card', '.qform', '.bignum', '.band figure', '.base-col'];
  var targets = [];
  groups.forEach(function (g) {
    $$(g).forEach(function (el, i) {
      if (el.closest('.hero') && g !== '.hero-sub') return;
      el.classList.add('rv'); el.style.setProperty('--d', String(i % 5)); targets.push(el);
    });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(function (t) { t.classList.add('in'); }); }

  /* ---- scroll: altitude readout, tape, progress bar, header, banner parallax + drone ---- */
  var top = $('#top'), tape = $('#tape'), alts = $$('[data-alt]');
  var city = $('.city'), cityBg = $('#cityBg'), drone = $('#drone'), path = $('#flightPath'), pathSvg = $('.city-path');
  var ticking = false;
  function pad(n) { n = String(n); while (n.length < 4) n = '0' + n; return n; }
  function frame() {
    ticking = false;
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = clamp(window.scrollY / max, 0, 1);
    var alt = Math.round(p * 400);
    alts.forEach(function (a) { a.textContent = pad(alt); });
    top.style.setProperty('--p', p.toFixed(4));
    top.classList.toggle('solid', window.scrollY > 40);
    if (tape) tape.style.setProperty('--ty', (-(window.scrollY * 0.45)).toFixed(1) + 'px');
    if (city) {
      var r = city.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        if (!reduce) cityBg.style.setProperty('--py', ((r.top - vh / 2) * -0.1).toFixed(1) + 'px');
        var q = clamp((vh - r.top) / (vh + r.height), 0, 1);
        if (path && drone && pathSvg) {
          var L = path.getTotalLength(), pt = path.getPointAtLength(L * q), sb = pathSvg.getBoundingClientRect();
          drone.style.left = ((pt.x / 1000) * sb.width).toFixed(1) + 'px';
          drone.style.top = ((sb.top - r.top) + (pt.y / 160) * sb.height).toFixed(1) + 'px';
        }
      }
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ---- menu sheet ---- */
  var burger = $('#burger'), sheet = $('#sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setMenu(false); });
  }

  /* ---- custom cursor (desktop, fine pointer) ---- */
  var cur = $('#cursor');
  if (cur && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var cx = 0, cy = 0, raf = 0;
    document.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY; cur.classList.add('on');
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; cur.style.transform = 'translate(' + (cx - window.innerWidth / 2) + 'px,' + (cy - window.innerHeight / 2) + 'px)';
        var t = e.target.closest && e.target.closest('a,button,.vf,input,textarea,.fr');
        cur.classList.toggle('lock', !!t);
      });
    });
    document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  }

  /* ---- hero crosshair follows the pointer ---- */
  var hf = $('#heroFrame');
  if (hf && !reduce) {
    document.addEventListener('mousemove', function (e) {
      var r = hf.getBoundingClientRect();
      var x = clamp((e.clientX - (r.left + r.width / 2)) / window.innerWidth, -0.5, 0.5);
      var y = clamp((e.clientY - (r.top + r.height / 2)) / window.innerHeight, -0.5, 0.5);
      hf.style.setProperty('--mx', (x * r.width * 0.5).toFixed(1) + 'px');
      hf.style.setProperty('--my', (y * r.height * 0.5).toFixed(1) + 'px');
    });
  }

  /* ---- 1. target lock stage ---- */
  var T = [
    { n: 'SHINGLE ROOFS', cap: 'Ridge line on a shingle roof, photographed from the roof edge.', d: 'New shingle roofs and replacements, with the courses laid straight and the ridge and valley lines kept clean.' },
    { n: 'FLAT & LOW-SLOPE', cap: 'A flat roof stripped to the deck, with the old surface rolled back at the edge.', d: 'Flat roof surfaces stripped back to the deck and finished with a new membrane, with edges and curbs detailed.' },
    { n: 'SKYLIGHTS', cap: 'A skylight set into a shingle roof above a wooden deck.', d: 'The roof around a skylight: the curb, the flashing and a clean line where glass meets roof.' },
    { n: 'ROOF REPAIRS', cap: 'Work on the tower roof, with a ladder up the wall.', d: 'Leaks, damaged sections and worn edges looked at from the roof itself, not only from the yard.' }
  ];
  var stage = $('#stage');
  if (stage) {
    var imgs = $$('.stage-imgs img', stage), btns = $$('.tgt'), lockbox = $('#lockbox');
    var setT = function (i, user) {
      stage.setAttribute('data-t', i);
      imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
      btns.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      $('#lockTag').textContent = 'TGT 0' + (i + 1) + ' · LOCKED';
      $('#stageNo').textContent = 'TARGET 0' + (i + 1) + ' / 04';
      $('#stageName').textContent = T[i].n;
      $('#stageCap').textContent = T[i].cap;
      $('#stageDesc').textContent = T[i].d;
      if (!reduce && lockbox.animate) lockbox.animate([{ transform: 'scale(1.9)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
    };
    btns.forEach(function (b, i) { b.addEventListener('click', function () { setT(i, true); }); });
    setT(0);
  }

  /* ---- 2. wipe ---- */
  var wipe = $('#wipe'), win = $('#wipeIn');
  if (wipe && win) {
    var setW = function (v) { wipe.style.setProperty('--w', v + '%'); };
    win.addEventListener('input', function () { setW(win.value); });
    var fromX = function (e) {
      var r = wipe.getBoundingClientRect();
      var v = clamp(((e.clientX - r.left) / r.width) * 100, 4, 96); win.value = v; setW(v);
    };
    win.addEventListener('pointerdown', fromX);
    win.addEventListener('pointermove', function (e) { if (e.buttons) fromX(e); });
    /* gentle intro sweep when it first scrolls into view */
    if ('IntersectionObserver' in window && !reduce) {
      var once = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return; once.disconnect();
          var t0 = performance.now();
          (function step(t) {
            var k = clamp((t - t0) / 1600, 0, 1), v = 50 + Math.sin(k * Math.PI * 2) * 30 * (1 - k);
            win.value = v; setW(v); if (k < 1) requestAnimationFrame(step); else { win.value = 50; setW(50); }
          })(t0);
        });
      }, { threshold: 0.45 });
      once.observe(wipe);
    }
  }

  /* ---- 3. anatomy pins ---- */
  var P = [
    { n: 'Ridge', t: 'The high line where two slopes meet. Caps cover it, and it is the first place wind finds a loose shingle.', x: 41, y: 21.5 },
    { n: 'Hip', t: 'A sloping line where two roof planes meet at an outside corner. Each hip needs its own run of cap shingles.', x: 49.5, y: 14.5 },
    { n: 'Valley', t: 'Where two slopes meet and drain. Water from both runs down this line, so the seam here matters most.', x: 32.5, y: 44 },
    { n: 'Shingle field', t: 'The open stretch of shingles between the edges. Straight courses and even exposure keep the field flat and clean.', x: 73, y: 38 },
    { n: 'Eave & gutter', t: 'The lower edge of the roof. Drip edge and gutters carry water off the shingles and away from the walls.', x: 66, y: 62.2 }
  ];
  var zoom = $('#zoom');
  if (zoom) {
    var pins = $$('.pin', zoom), lgs = $$('.lg'), zimg = $('img', zoom), note = $('#note'), read = $('#zoomRead');
    var place = function (z, ox, oy) {
      zoom.style.setProperty('--ox', ox + '%'); zoom.style.setProperty('--oy', oy + '%'); zoom.style.setProperty('--z', z);
      pins.forEach(function (pn, k) {
        pn.style.left = (ox + (P[k].x - ox) * z) + '%'; pn.style.top = (oy + (P[k].y - oy) * z) + '%';
      });
      read.textContent = z.toFixed(1) + 'x';
    };
    var setP = function (i) {
      pins.forEach(function (pn, k) { pn.classList.toggle('is-on', k === i); });
      lgs.forEach(function (l, k) { l.classList.toggle('is-on', k === i); l.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      $('h3', note).textContent = P[i].n; $('p', note).textContent = P[i].t;
      var z = 2.1, ox = clamp((50 - z * P[i].x) / (1 - z), 0, 100), oy = clamp((50 - z * P[i].y) / (1 - z), 0, 100);
      place(z, ox, oy);
    };
    pins.forEach(function (b, i) { b.addEventListener('click', function () { setP(i); }); });
    lgs.forEach(function (b, i) { b.addEventListener('click', function () { setP(i); }); });
    $('#anatReset').addEventListener('click', function () { place(1, 50, 50); });
    place(1, 50, 50);
  }

  /* ---- 4. quote form: roof chips fill the details ---- */
  var chips = $$('.chip'), det = $('#details');
  if (chips.length && det) {
    var sync = function () {
      var sel = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).map(function (c) { return c.getAttribute('data-v'); });
      var rest = det.value.split('\n'); if (/^Roof:/.test(rest[0])) rest.shift();
      det.value = (sel.length ? 'Roof: ' + sel.join(', ') + '\n' : '') + rest.join('\n');
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); sync(); }); });
  }
  var qf = $('#qform');
  if (qf) qf.addEventListener('submit', function (e) { e.preventDefault(); });

  /* ---- back to ground level ---- */
  var up = $('#toTop');
  if (up) up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
