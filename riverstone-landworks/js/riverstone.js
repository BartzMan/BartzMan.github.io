/* Riverstone Landworks: phone menu, reveal, mailto form, and the one continuous river. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;

  /* ---------- phone menu sheet ---------- */
  var sheet = doc.getElementById('rs-sheet');
  var burger = doc.querySelector('.rs-burger');
  var closeBtn = sheet ? sheet.querySelector('.rs-sheet__close') : null;
  var lastFocus = null;

  function focusables() {
    return Array.prototype.slice.call(sheet.querySelectorAll('a[href], button'));
  }
  function onKey(e) {
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openSheet() {
    lastFocus = doc.activeElement;
    sheet.hidden = false;
    root.classList.add('rs-lock');
    burger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
    doc.addEventListener('keydown', onKey);
  }
  function closeSheet(returnFocus) {
    sheet.hidden = true;
    root.classList.remove('rs-lock');
    burger.setAttribute('aria-expanded', 'false');
    doc.removeEventListener('keydown', onKey);
    if (returnFocus !== false && lastFocus) lastFocus.focus();
  }
  if (sheet && burger && closeBtn) {
    burger.addEventListener('click', openSheet);
    closeBtn.addEventListener('click', function () { closeSheet(); });
    sheet.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && (a.getAttribute('href') || '').charAt(0) === '#') closeSheet(false);
    });
  }

  /* ---------- reveal on scroll (anything already passed is revealed too) ---------- */
  var pending = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));
  var ticking = false;
  function check() {
    var h = window.innerHeight;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < h * 0.94) { el.setAttribute('data-reveal', 'in'); return false; }
      return true;
    });
    if (!pending.length) window.removeEventListener('scroll', onScroll);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; check(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  check();

  /* ---------- contact form -> the visitor's own email app ---------- */
  var form = doc.getElementById('rs-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.reportValidity && !form.reportValidity()) return;
      var v = function (n) { return ((form.elements[n] || {}).value || '').trim(); };
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + (v('phone') || '-'),
        'Town: ' + v('town'),
        'Service: ' + v('service'),
        'Photo: ' + v('photo'),
        '',
        'About the tree:',
        v('message') || '-'
      ].join('\n');
      var subject = 'Tree work request: ' + v('service') + ' in ' + v('town');
      window.location.href = 'mailto:riverstonelandworks@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- the river: one path through every visible [data-rv] waypoint ---------- */
  var layer = doc.querySelector('.rs-riverlayer');
  if (!layer) return;
  var svg = layer.querySelector('svg');
  var paths = svg.querySelectorAll('path');
  var queued = false;

  function points() {
    var out = [], sx = window.scrollX, sy = window.scrollY;
    doc.querySelectorAll('[data-rv]').forEach(function (el) {
      if (!el.getClientRects().length) return;           /* breakpoint-hidden waypoint */
      var r = el.getBoundingClientRect();
      var p = [r.left + r.width / 2 + sx, r.top + r.height / 2 + sy];
      if (out.length && p[1] <= out[out.length - 1][1] + 4) return;  /* keep it flowing downhill */
      out.push(p);
    });
    return out;
  }
  function f(n) { return n.toFixed(1); }
  function build() {
    queued = false;
    var p = points();
    if (p.length < 2) return;
    var W = root.clientWidth;
    var H = Math.ceil(p[p.length - 1][1] + 30);
    /* vertical tangents at every waypoint: straight in a channel, an S-bend between channels */
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], k = (b[1] - a[1]) * 0.5;
      d += ' C' + f(a[0]) + ' ' + f(a[1] + k) + ' ' + f(b[0]) + ' ' + f(b[1] - k) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    layer.style.height = H + 'px';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    for (var j = 0; j < paths.length; j++) paths[j].setAttribute('d', d);
    stones(paths[0], W);
  }
  /* small wet stones on both banks, set along the path (they stay inside the river's channel) */
  var stoneG = svg.querySelector('.rs-river__stones');
  var tones = ['#8E9A9B', '#6f7c7e', '#a9b2ae', '#5d6a6c', '#c2b8a3'];
  function stones(path, W) {
    if (!stoneG || !path.getTotalLength) return;
    var wide = W >= 1100, len = path.getTotalLength();
    var step = wide ? 120 : 150, off = wide ? 21 : 13, rmax = wide ? 8 : 5.5;
    var out = '', n = 0;
    for (var s = 60; s < len - 60; s += step, n++) {
      var a = path.getPointAtLength(s), b = path.getPointAtLength(s + 2);
      var dx = b.x - a.x, dy = b.y - a.y, m = Math.sqrt(dx * dx + dy * dy) || 1;
      var side = n % 2 ? 1 : -1, jitter = (n * 37 % 7) / 7;
      var o = off + jitter * 4;
      var x = a.x - dy / m * o * side, y = a.y + dx / m * o * side;
      var rx = rmax * (0.6 + jitter * 0.4), ry = rx * 0.62;
      var rot = Math.atan2(dy, dx) * 57.3 + (jitter - 0.5) * 30;
      out += '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rx) + '" ry="' + f(ry) +
        '" fill="' + tones[n % tones.length] + '" transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')"/>';
    }
    stoneG.innerHTML = out;
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(build);
  }
  build();
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(queue);
  if ('ResizeObserver' in window) new ResizeObserver(queue).observe(doc.body);
})();
