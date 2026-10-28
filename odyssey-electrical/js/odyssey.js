/* Odyssey Electrical Services - behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- reveal on scroll ---- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add('in'); }); }

  /* ---- header + progress ---- */
  var head = $('#head'), prog = $('.od-prog');
  var banner = $('#bannerimg'), bannerSec = banner && banner.parentNode;
  function onScroll() {
    var y = window.scrollY || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    prog.style.setProperty('--p', Math.min(1, y / max).toFixed(4));
    head.classList.toggle('is-solid', y > 40);
    if (banner && !reduce) {
      var r = bannerSec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var t = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        banner.style.transform = 'translate3d(0,' + (t * -36).toFixed(1) + 'px,0)';
      }
    }
    drawRoute();
  }

  /* ---- phone menu ---- */
  var burger = $('#burger'), sheet = $('#sheet');
  function setMenu(open) {
    sheet.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  $$('[data-close]', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---- hero lantern: warm light follows the pointer (drifts on touch) ---- */
  var hero = $('.od-hero'), lan = $('#lantern');
  if (hero && !reduce) {
    var moved = false;
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      moved = true;
      var r = hero.getBoundingClientRect();
      lan.style.setProperty('--lx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      lan.style.setProperty('--ly', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
    var t0 = performance.now();
    (function drift(t) {
      if (!moved) {
        var k = (t - t0) / 5200;
        lan.style.setProperty('--lx', (58 + Math.sin(k) * 24).toFixed(1) + '%');
        lan.style.setProperty('--ly', (62 + Math.cos(k * 0.8) * 10).toFixed(1) + '%');
      }
      requestAnimationFrame(drift);
    })(t0);
  }

  /* ---- THE CHART: route draws with scroll, ports light, click a port ---- */
  var svg = $('#chartsvg'), mapEl = $('#map');
  var route = $('#route'), glow = $('#routeglow'), ship = $('#ship');
  var ports = $$('.port', svg);
  var LEN = route.getTotalLength();
  route.style.strokeDasharray = glow.style.strokeDasharray = LEN;
  var PT = ports.map(function (p) {
    var x = +p.getAttribute('data-x'), y = +p.getAttribute('data-y'), best = 0, bd = 1e9;
    for (var i = 0; i <= 600; i++) {
      var q = route.getPointAtLength(LEN * i / 600), d = (q.x - x) * (q.x - x) + (q.y - y) * (q.y - y);
      if (d < bd) { bd = d; best = i / 600; }
    }
    return best;
  });
  var SERV = [
    { n: 'Henderson', t: 'Home port', img: 'stock-house-night', w: 1600, h: 1200, a: 'A house glowing from its windows beneath a night sky full of stars', c: 'Home port · Henderson, NV 89044', p: 'Every route starts here. Call or message and tell us what you need. Panel, repair, lighting or a new install.' },
    { n: 'Panel upgrades', img: 'stock-breaker-panel', w: 1200, h: 1200, a: 'Open breaker panel with labelled circuit breakers', c: 'Breaker panel · illustrative stock', p: 'A crowded or tired panel is the heart of the house. When it is time to bring yours up to date, tell us what you run and we will talk it through.' },
    { n: 'Repairs & troubleshooting', img: 'stock-multimeter-test', w: 1200, h: 1200, a: 'Gloved hands holding multimeter probes against wiring', c: 'Tracing a fault · illustrative stock', p: 'Flickering lights, a dead outlet, a breaker that will not stay on. We trace the fault, explain what we found in plain words and fix it.' },
    { n: 'Indoor lighting', img: 'stock-recessed-ceiling', w: 1200, h: 915, a: 'Looking up at a grid of recessed ceiling lights glowing warm white', c: 'Recessed lights · illustrative stock', p: 'Recessed lights, fixtures and dimmers placed where the room actually needs them.' },
    { n: 'Outdoor lighting', img: 'stock-garden-globes', w: 1600, h: 900, a: 'Glowing round garden lights on a dark lawn', c: 'Garden lights · illustrative stock', p: 'Path, patio and porch lighting, so the yard still works long after the sun is down.' },
    { n: 'Outlets & switches', img: 'stock-outlet', w: 1000, h: 1250, a: 'A wall outlet on a teal painted wall', c: 'Outlet · illustrative stock', p: 'New outlets where you need them, and worn switches swapped for ones that feel right under your hand.' },
    { n: 'Fans & fixtures', img: 'stock-ceiling-fan', w: 1200, h: 1500, a: 'A white ceiling fan with a light kit seen from below', c: 'Ceiling fan · illustrative stock', p: 'Ceiling fans and fixtures hung, wired and tested, ready to run.' }
  ];
  var cur = 1, progress = 0;
  var pimg = $('#pimg'), panel = $('#panel');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function show(i, fromUser) {
    cur = i;
    var s = SERV[i];
    panel.classList.add('swap');
    setTimeout(function () {
      pimg.src = 'images/' + s.img + '-720.jpg';
      pimg.srcset = 'images/' + s.img + '-720.jpg 720w, images/' + s.img + '.jpg ' + s.w + 'w';
      pimg.width = s.w; pimg.height = s.h; pimg.alt = s.a;
      $('#pcap').textContent = s.c;
      $('#pnum').textContent = i === 0 ? 'Home port' : 'Port ' + pad(i) + ' of 06';
      $('#ptitle').textContent = s.n;
      $('#ptext').textContent = s.p;
      panel.classList.remove('swap');
    }, reduce ? 0 : 220);
    ports.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    $$('button', chips).forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    if (mapEl.scrollWidth > mapEl.clientWidth + 4) {
      var sw = svg.getBoundingClientRect().width, px = (+ports[i].getAttribute('data-x')) / 1200 * sw;
      mapEl.scrollTo({ left: Math.max(0, px - mapEl.clientWidth / 2), behavior: reduce ? 'auto' : 'smooth' });
    }
    if (fromUser && PT[i] > userMax) { userMax = PT[i]; draw(); }
  }
  var chips = $('#chips');
  SERV.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.textContent = i === 0 ? 'Home' : pad(i) + ' ' + s.n.split(' ')[0];
    b.addEventListener('click', function () { show(i, true); });
    chips.appendChild(b);
  });
  ports.forEach(function (p, i) {
    p.addEventListener('click', function () { show(i, true); });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i, true); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); var n = ports[(i + 1) % ports.length]; n.focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); var m = ports[(i + ports.length - 1) % ports.length]; m.focus(); }
    });
  });
  $('#pnext').addEventListener('click', function () { show(cur >= SERV.length - 1 ? 1 : cur + 1, true); });

  var userMax = 0;
  function draw() {
    var p = Math.max(progress, userMax);
    if (p < 0.004) p = 0.004;
    var off = LEN * (1 - p);
    route.style.strokeDashoffset = off; glow.style.strokeDashoffset = off;
    var pt = route.getPointAtLength(LEN * p);
    ship.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
    ports.forEach(function (el, i) { el.classList.toggle('lit', i === 0 || p >= PT[i] - 0.004); });
  }
  function drawRoute() {
    var r = mapEl.getBoundingClientRect(), vh = window.innerHeight;
    var start = vh * 0.9, end = vh * 0.18 - r.height * 0.2;
    var p = (start - r.top) / (start - end);
    p = Math.max(0, Math.min(1, p));
    if (reduce) p = 1;
    if (Math.abs(p - progress) > 0.001) { progress = p; draw(); }
  }
  progress = reduce ? 1 : 0; draw();
  show(1, false);

  /* ---- dimmer ---- */
  var dim = $('#dim'), range = $('#dimmer'), out = $('#dimout');
  function setDim() {
    var v = +range.value;
    dim.style.setProperty('--b', (v / 100).toFixed(2));
    out.textContent = v + '%';
    $('#dimbig').textContent = v;
    $$('.od-presets button').forEach(function (b) { b.setAttribute('aria-pressed', (+b.getAttribute('data-v') === v) ? 'true' : 'false'); });
  }
  $$('.od-presets button').forEach(function (b) { b.addEventListener('click', function () { range.value = b.getAttribute('data-v'); setDim(); }); });
  range.addEventListener('input', setDim);
  setDim();

  /* ---- cursor ring (fine pointers only) ---- */
  var cur$ = $('.od-cur');
  if (window.matchMedia('(pointer:fine)').matches && !reduce) {
    var cx = 0, cy = 0, tx = 0, ty = 0, on = false;
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!on) { on = true; cur$.classList.add('on'); cx = tx; cy = ty; }
      var hot = e.target.closest && e.target.closest('a,button,.port,input,textarea,label');
      cur$.classList.toggle('big', !!hot);
    }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur$.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---- form: preview only ---- */
  $('#request').addEventListener('submit', function (e) { e.preventDefault(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
