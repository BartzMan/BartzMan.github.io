(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  /* reveal */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rvs.forEach(function (n) { io.observe(n); });
  } else { rvs.forEach(function (n) { n.classList.add('in'); }); }

  /* menu */
  var burger = $('.burger'), sheet = $('#sheet');
  function setMenu(o) { burger.setAttribute('aria-expanded', o ? 'true' : 'false'); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); sheet.classList.toggle('open', o); document.body.classList.toggle('lock', o); }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* subway progress line in the header */
  var fill = $('#qfill'), bul = $('#qbul'), tick = false;
  function prog() {
    tick = false;
    var h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.max(0, Math.min(1, scrollY / h)) : 0;
    fill.style.transform = 'scaleX(' + p + ')'; bul.style.left = (p * 100) + '%';
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(prog); } }, { passive: true });
  addEventListener('resize', prog); prog();

  /* nav highlight */
  var navs = { lines: $('.nav a[href="#lines"]'), platform: $('.nav a[href="#platform"]'), jamaica: $('.nav a[href="#jamaica"]'), contact: $('.nav a[href="#contact"]') };
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (e) { var a = navs[e.target.id]; if (a) a.classList.toggle('on', e.isIntersecting); }); }, { rootMargin: '-40% 0px -50% 0px' });
    Object.keys(navs).forEach(function (k) { var s = document.getElementById(k); if (s) so.observe(s); });
  }

  /* ---------- THE MAP: lines, stations, departure board ---------- */
  var LINES = [
    { k: 'C', cls: 'c-bl', lc: '#2d6bff', name: 'Cooling', stops: [
      { n: 'Outdoor unit', t: 'A wall-bracket outdoor unit on a brick wall, gauge hoses connected.', img: 'gree-brick', w: 1200, h: 1600, cap: 'Outdoor unit on a brick wall', own: 1, alt: 'A white wall-mounted outdoor unit on a brick wall with colored gauge hoses attached' },
      { n: 'Coil', t: 'A condenser coil caked in dirt. Airflow suffers when a coil looks like this.', img: 'coil', w: 1419, h: 1600, cap: 'A dirty condenser coil', own: 1, alt: 'A condenser coil covered in dirt beside a brick wall' },
      { n: 'Power', t: 'The disconnect box beside the unit, wiring visible and ready to close up.', img: 'disconnect', w: 810, h: 1080, cap: 'Wiring in the disconnect box', own: 1, alt: 'An open gray disconnect box with black, red, green and yellow wires on beige siding' }] },
    { k: 'H', cls: 'c-rd', lc: '#ee352e', name: 'Heating', stops: [
      { n: 'Thermostat', t: 'Heating starts at the wall control. Tell us what your thermostat is doing.', img: 'stock-thermostat', w: 1600, h: 547, cap: 'A finger on a thermostat, illustrative stock', own: 0, alt: 'A finger pressing the button of a wall thermostat' },
      { n: 'Controls', t: 'Inside an outdoor unit: the control board, capacitor and wiring.', img: 'control-board', w: 810, h: 1080, cap: 'Inside an outdoor unit', own: 1, alt: 'The open control panel of an outdoor unit showing a circuit board, capacitor and wiring' },
      { n: 'Gauges', t: 'Gauge hoses and a gas cylinder beside an outdoor unit, mid-job.', img: 'samsung-gauges', w: 810, h: 1080, cap: 'Gauges on an outdoor unit', own: 1, alt: 'An outdoor unit with gauge hoses attached and a gas cylinder standing next to it' }] },
    { k: 'D', cls: 'c-pu', lc: '#c24bd6', name: 'Ductless', stops: [
      { n: 'Indoor head', t: 'A wall-mounted indoor head. No ductwork needed.', img: 'indoor-head', w: 1200, h: 1600, cap: 'Indoor head on the wall', own: 1, alt: 'A white wall-mounted indoor mini-split head on a painted wall' },
      { n: 'Line set', t: 'The line sets run up the outside wall between the indoor head and the outdoor unit.', img: 'lineset', w: 900, h: 1600, cap: 'Line sets along the siding', own: 1, alt: 'White line sets running along the side of a house with siding' },
      { n: 'Outdoor unit', t: 'The outdoor unit, mounted on the wall with its disconnect beside it.', img: 'fujitsu', w: 1600, h: 1560, cap: 'Outdoor unit on siding', own: 1, alt: 'A grey mini-split outdoor unit mounted on beige siding with a power disconnect box beside it' }] },
    { k: 'R', cls: 'c-gr', lc: '#00a94a', name: 'Service & repair', stops: [
      { n: 'Ladder work', t: 'Line sets and wiring sometimes mean ladders. This one runs up the side of a house.', img: 'ladder', w: 810, h: 1080, cap: 'Ladders and line sets', own: 1, alt: 'Two ladders leaning against the siding of a house with line sets running up the wall' },
      { n: 'Copper', t: 'Copper tubing carries refrigerant between the outdoor and indoor units.', img: 'stock-copper-coil', w: 1600, h: 901, cap: 'Coiled copper, illustrative stock', own: 0, alt: 'A large coil of copper tubing' }] }
  ];
  var cur = 0, curStop = 0, mq = matchMedia('(max-width:860px)');
  var route = $('#route'), train = $('#train'), lnbs = $$('.lnb'), bbl = $('#bbl'), bline = $('#bline'), bname = $('#bname'), btext = $('#btext');
  var mimg = $('#mimg'), mcap = $('#mcap'), mown = $('#mown');

  function scramble(el, text) {
    if (reduce) { el.textContent = text; return; }
    var chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789', f = 0, n = 14;
    clearInterval(el._t);
    el._t = setInterval(function () {
      f++; var out = '';
      for (var i = 0; i < text.length; i++) { out += (text[i] === ' ' || i < (text.length * f / n)) ? text[i] : chars[Math.floor(Math.random() * chars.length)]; }
      el.textContent = out; if (f >= n) { clearInterval(el._t); el.textContent = text; }
    }, 38);
  }
  function placeTrain() {
    var st = $$('.st', route)[curStop]; if (!st) return;
    var ring = $('.ring', st), rr = ring.getBoundingClientRect(), br = route.getBoundingClientRect();
    if (mq.matches) { train.style.top = (rr.top - br.top + rr.height / 2 - 20) + 'px'; train.style.left = '0px'; train.style.marginLeft = '2px'; }
    else { train.style.left = (rr.left - br.left + rr.width / 2) + 'px'; train.style.top = '34px'; train.style.marginLeft = '-20px'; }
  }
  function selectStop(j, first) {
    var L = LINES[cur], s = L.stops[j]; curStop = j;
    $$('.st', route).forEach(function (b, x) { if (x === j) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    placeTrain();
    bbl.className = 'bl ' + L.cls; bbl.textContent = L.k; var mcl = $('#mcl'); if (mcl) mcl.textContent = L.name.toLowerCase();
    bline.textContent = 'Next stop · Line ' + L.k + ' ' + L.name;
    scramble(bname, s.n); btext.textContent = s.t;
    mcap.textContent = s.cap; mown.textContent = s.own ? 'Own photo' : 'Stock'; mown.className = 'own' + (s.own ? '' : ' st');
    if (!first) { mimg.classList.add('sw'); }
    setTimeout(function () {
      mimg.src = 'images/' + s.img + '.jpg'; mimg.srcset = 'images/' + s.img + '-720.jpg 720w, images/' + s.img + '.jpg ' + s.w + 'w';
      mimg.width = s.w; mimg.height = s.h; mimg.alt = s.alt;
      mimg.parentNode.style.aspectRatio = s.w > s.h * 1.2 ? '4/3' : (s.w > s.h ? '1/1' : '4/5');
      mimg.classList.remove('sw');
    }, first ? 0 : 230);
  }
  function build(i, first) {
    cur = i; var L = LINES[i];
    lnbs.forEach(function (b, x) { b.setAttribute('aria-selected', x === i ? 'true' : 'false'); b.tabIndex = x === i ? 0 : -1; });
    $$('.st', route).forEach(function (b) { b.parentNode.removeChild(b); });
    route.style.setProperty('--lc', L.lc);
    L.stops.forEach(function (s, j) {
      var b = document.createElement('button'); b.className = 'st'; b.type = 'button'; b.style.setProperty('--i', j);
      b.innerHTML = '<span class="ring"></span><span class="lb"></span>'; $('.lb', b).textContent = s.n;
      b.addEventListener('click', function () { selectStop(j); }); route.appendChild(b);
    });
    train.textContent = L.k;
    route.classList.remove('draw'); void route.offsetWidth;
    requestAnimationFrame(function () { route.classList.add('draw'); });
    selectStop(0, first);
    setTimeout(placeTrain, 60);
  }
  lnbs.forEach(function (b, i) {
    b.addEventListener('click', function () { build(i); });
    b.addEventListener('keydown', function (e) {
      var n = i; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % lnbs.length; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + lnbs.length - 1) % lnbs.length; else return;
      e.preventDefault(); build(n); lnbs[n].focus();
    });
  });
  $$('[data-line]').forEach(function (a) { if (a.classList.contains('lnb')) return; a.addEventListener('click', function () { build(parseInt(a.getAttribute('data-line'), 10)); }); });
  build(0, true);
  addEventListener('resize', placeTrain);
  if ('IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { route.classList.add('draw'); placeTrain(); } }, { threshold: 0.25 });
    mo.observe(route);
  }

  /* ---------- PLATFORM strips ---------- */
  var strips = $$('#strips .qs');
  function openStrip(i) { strips.forEach(function (s, j) { s.classList.toggle('act', i === j); s.setAttribute('aria-pressed', i === j ? 'true' : 'false'); }); }
  strips.forEach(function (s, i) {
    s.addEventListener('click', function () { openStrip(i); });
    s.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !mq.matches) openStrip(i); });
  });
  var wh = $('#whint'); if (wh && matchMedia('(max-width:860px)').matches) wh.textContent = 'Swipe the platform';

  /* form (preview) */
  var f = $('#qf');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = f.querySelector('.sc-form-msg');
    if (!m) { m = document.createElement('p'); m.className = 'sc-form-msg'; m.setAttribute('role', 'status'); f.appendChild(m); }
    m.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
