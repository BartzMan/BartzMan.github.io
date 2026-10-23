/* Arguelles A/C Systems — HEAT INDEX: thermostat dial, scroll temperature, menu, WhatsApp form */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* temperature -> colour (118 red ... 74 cool) */
  var STOPS = [[74, [63, 167, 214]], [85, [63, 167, 214]], [98, [201, 162, 126]], [112, [242, 140, 40]], [118, [229, 72, 43]]];
  function tempColor(t) {
    t = Math.max(74, Math.min(118, t));
    for (var i = 0; i < STOPS.length - 1; i++) {
      var a = STOPS[i], b = STOPS[i + 1];
      if (t <= b[0]) {
        var k = (t - a[0]) / (b[0] - a[0]);
        var c = a[1].map(function (v, j) { return Math.round(v + (b[1][j] - v) * k); });
        return 'rgb(' + c.join(',') + ')';
      }
    }
    return 'rgb(229,72,43)';
  }

  /* ---------- thermostat dial ---------- */
  var ticks = document.getElementById('dialTicks');
  if (ticks) {
    var ns = 'http://www.w3.org/2000/svg', html = '';
    for (var v = 60; v <= 120; v += 2) {
      var ang = (135 + 270 * (v - 60) / 60) * Math.PI / 180;
      var maj = v % 10 === 0, r1 = maj ? 92 : 97, r2 = 104;
      html += '<line class="' + (maj ? 'maj' : '') + '" x1="' + (150 + r1 * Math.cos(ang)).toFixed(1) + '" y1="' + (150 + r1 * Math.sin(ang)).toFixed(1) +
        '" x2="' + (150 + r2 * Math.cos(ang)).toFixed(1) + '" y2="' + (150 + r2 * Math.sin(ang)).toFixed(1) + '"/>';
    }
    ticks.innerHTML = html;
  }
  var arc = document.getElementById('dialArc'), needle = document.getElementById('dialNeedle'),
      num = document.getElementById('dialNum'), sub = document.getElementById('dialSub');
  function setDial(t) {
    if (!arc) return;
    var f = (t - 60) / 60;
    arc.setAttribute('stroke-dasharray', (f * 100).toFixed(2) + ' 100');
    needle.setAttribute('transform', 'rotate(' + (270 * f - 135).toFixed(2) + ' 150 150)');
    num.textContent = Math.round(t);
    var col = tempColor(t);
    num.style.fill = col;
    needle.querySelector('circle').style.stroke = col;
  }
  if (arc) {
    if (reduce) { setDial(74); sub.textContent = 'COMFORT'; }
    else {
      setDial(118);
      var start = null, DUR = 2600, DELAY = 700;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min(1, Math.max(0, (ts - start - DELAY) / DUR));
        var e = 1 - Math.pow(1 - p, 3);
        setDial(118 - 44 * e);
        if (p < 1) requestAnimationFrame(step); else sub.textContent = 'COMFORT';
      };
      requestAnimationFrame(step);
    }
  }

  /* ---------- scroll temperature (header chip, thermometer, cursor colour) ---------- */
  var secs = [].slice.call(document.querySelectorAll('main [data-temp]'));
  var lives = [].slice.call(document.querySelectorAll('[data-live]'));
  var mast = document.querySelector('.mast'), dock = document.querySelector('.dock');
  var ticking = false;
  function readTemp() {
    var mid = window.innerHeight * 0.45, t = 118;
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      var here = +secs[i].getAttribute('data-temp');
      if (r.top <= mid && r.bottom > mid) {
        var next = secs[i + 1] ? +secs[i + 1].getAttribute('data-temp') : here;
        var k = Math.min(1, Math.max(0, (mid - r.top) / r.height));
        t = here + (next - here) * Math.max(0, (k - 0.55) / 0.45);
        break;
      }
      if (r.bottom <= mid) t = secs[i + 1] ? +secs[i + 1].getAttribute('data-temp') : here;
    }
    return t;
  }
  function onScroll() {
    ticking = false;
    var t = readTemp();
    var col = tempColor(t);
    root.style.setProperty('--live', col);
    root.style.setProperty('--merc', ((t - 60) / 60).toFixed(3));
    lives.forEach(function (el) { el.textContent = Math.round(t); });
    if (mast) mast.classList.toggle('scrolled', window.scrollY > 40);
    if (dock) dock.classList.toggle('show', window.scrollY > 520);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveal + section temperature count-down ---------- */
  var counted = new WeakSet();
  function countDown(el) {
    if (counted.has(el)) return; counted.add(el);
    var to = +el.getAttribute('data-count'), from = Math.min(118, to + 14);
    if (reduce) { el.textContent = to; return; }
    var s = null;
    (function f(ts) {
      if (s === null) s = ts;
      var p = Math.min(1, (ts - s) / 1100), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from - (from - to) * e);
      if (p < 1) requestAnimationFrame(f);
    })(performance.now());
  }
  var watch = [].slice.call(document.querySelectorAll('[data-reveal], [data-count], .roof-diagram'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.hasAttribute('data-count')) countDown(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    watch.forEach(function (el) { io.observe(el); });
  } else {
    watch.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- phone menu sheet ---------- */
  var burger = document.querySelector('.burger'), sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { sheet.hidden = false; sheet.classList.add('open'); document.body.style.overflow = 'hidden'; }
    else { sheet.hidden = true; sheet.classList.remove('open'); document.body.style.overflow = ''; }
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); burger.focus(); } });
  }

  /* ---------- custom cursor ring ---------- */
  var cur = document.querySelector('.cursor');
  if (cur && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var x = -100, y = -100, cx = -100, cy = -100;
    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY; cur.classList.add('on');
      cur.classList.toggle('big', !!e.target.closest('a, button, summary, label'));
    });
    document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- WhatsApp form: answers prefilled into the message ---------- */
  var form = document.getElementById('waForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var area = (d.get('area') || '').toString().trim();
      var err = document.getElementById('fErr');
      if (!name || !area) { err.hidden = false; (name ? form.area : form.name).focus(); return; }
      err.hidden = true;
      var lines = [
        'Hi Arguelles A/C Systems,',
        '',
        'Name: ' + name,
        'Area: ' + area,
        'Need: ' + d.get('service'),
        'Unit: ' + d.get('unit')
      ];
      var det = (d.get('details') || '').toString().trim();
      if (det) lines.push('What it is doing: ' + det);
      lines.push('', '(I can send a photo of the unit label.)');
      var url = 'https://wa.me/14805650730?text=' + encodeURIComponent(lines.join('\n'));
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (x) {} } else { window.location.href = url; }
    });
  }
})();
