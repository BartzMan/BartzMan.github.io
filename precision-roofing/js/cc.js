/* Precision Commercial Roofing Systems: core-cut interactions (own code, vanilla) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }

  /* ---------- 1. gauge: which layer is under the middle of the screen ---------- */
  var segs = $$('.cc-gauge-seg');
  var layers = $$('[data-layer]');
  function whichLayer() {
    var mid = window.innerHeight * 0.45, cur = 1;
    layers.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid) cur = +s.getAttribute('data-layer');
    });
    segs.forEach(function (g) { g.classList.toggle('is-on', +g.getAttribute('data-seg') === cur); });
    document.documentElement.setAttribute('data-layer', cur);
  }
  var tick = false;
  window.addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { tick = false; whichLayer(); });
  }, { passive: true });
  window.addEventListener('resize', whichLayer);
  whichLayer();

  /* ---------- 2. Commercial / Residential switch ---------- */
  var whoTabs = $$('.cc-switch-btn');
  function pickWho(btn, focus) {
    whoTabs.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) btn.focus();
  }
  whoTabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pickWho(b); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); pickWho(whoTabs[(i + 1) % whoTabs.length], true);
      }
    });
  });

  /* ---------- 3. PICK YOUR SYSTEM: draw a core for each roof ---------- */
  function buildCore(panel, key) {
    var holder = $('.cc-core', panel), list = $('.cc-layers-list', panel);
    var spec = panel.getAttribute('data-core').split(';').map(function (s) {
      var p = s.split('|'); return { name: p[0], color: p[1], w: parseFloat(p[2]) };
    });
    var total = spec.reduce(function (a, l) { return a + l.w; }, 0);
    var H = 190, RX = 80, RY = 22, X = 15, top = 30, y = top;
    var svg = el('svg', { viewBox: '0 0 190 270', width: 190, height: 270, focusable: 'false' });
    var defs = el('defs', {}); svg.appendChild(defs);
    var g = el('g', { stroke: '#2B343C', 'stroke-width': 2, 'stroke-linejoin': 'round' });
    var capColor = spec[0].color;
    spec.forEach(function (l, i) {
      var h = Math.round(H * l.w / total);
      var d = 'M' + X + ' ' + y + 'a' + RX + ' ' + RY + ' 0 0 0 ' + (RX * 2) + ' 0v' + h + 'a' + RX + ' ' + RY + ' 0 0 1 ' + (-RX * 2) + ' 0z';
      var p = el('path', { d: d, fill: l.color, 'class': 'cc-core-layer' });
      p.style.animationDelay = (i * 120) + 'ms';
      g.appendChild(p);
      /* surface texture by layer name */
      var tex = null, id = 'cc-t-' + key + '-' + i;
      if (/deck/i.test(l.name)) {
        tex = el('pattern', { id: id, width: 12, height: 8, patternUnits: 'userSpaceOnUse' });
        tex.appendChild(el('rect', { x: 0, y: 0, width: 6, height: 8, fill: 'rgba(255,255,255,.12)' }));
      } else if (/insulation|polyiso/i.test(l.name)) {
        tex = el('pattern', { id: id, width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' });
        tex.appendChild(el('rect', { x: 0, y: 0, width: 5, height: 14, fill: 'rgba(255,255,255,.28)' }));
      } else if (/gravel|cap sheet/i.test(l.name)) {
        tex = el('pattern', { id: id, width: 9, height: 9, patternUnits: 'userSpaceOnUse' });
        tex.appendChild(el('circle', { cx: 2, cy: 2, r: 1.5, fill: 'rgba(30,34,38,.45)' }));
        tex.appendChild(el('circle', { cx: 6.5, cy: 6, r: 1.2, fill: 'rgba(255,255,255,.4)' }));
      } else if (/shingle/i.test(l.name)) {
        tex = el('pattern', { id: id, width: 20, height: 10, patternUnits: 'userSpaceOnUse' });
        tex.appendChild(el('rect', { x: 0, y: 0, width: 20, height: 1.5, fill: 'rgba(0,0,0,.35)' }));
        tex.appendChild(el('rect', { x: 10, y: 0, width: 1.5, height: 5, fill: 'rgba(0,0,0,.3)' }));
      }
      if (tex) {
        defs.appendChild(tex);
        var q = el('path', { d: d, fill: 'url(#' + id + ')', stroke: 'none', 'class': 'cc-core-layer' });
        q.style.animationDelay = (i * 120) + 'ms';
        g.appendChild(q);
      }
      var li = document.createElement('li');
      li.innerHTML = '<i style="background:' + l.color + '"></i><span>' + l.name + '</span>';
      list.appendChild(li);
      y += h;
    });
    var cap = el('ellipse', { cx: X + RX, cy: top, rx: RX, ry: RY, fill: capColor });
    g.appendChild(cap);
    svg.appendChild(g);
    /* cut-line brackets */
    svg.appendChild(el('path', { d: 'M4 ' + top + 'v' + (H) + 'M186 ' + top + 'v' + H, stroke: '#2B343C', 'stroke-width': 1.5, 'stroke-dasharray': '3 5', fill: 'none' }));
    holder.appendChild(svg);
  }

  var panels = $$('.cc-sys-panel');
  panels.forEach(function (p) { buildCore(p, p.id.replace('sp-', '')); });

  var sysTabs = $$('.cc-sys-tab');
  function pickSys(key, focus) {
    sysTabs.forEach(function (t) {
      var on = t.getAttribute('data-key') === key;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) {
        if (on && p.hidden) { p.hidden = false; p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); }
        else if (!on) { p.hidden = true; p.classList.remove('is-in'); }
      }
      if (on && focus) {
        t.focus();
        if (t.scrollIntoView && window.innerWidth <= 900) t.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    });
  }
  sysTabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pickSys(t.getAttribute('data-key')); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % sysTabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + sysTabs.length) % sysTabs.length;
      if (n !== null) { e.preventDefault(); pickSys(sysTabs[n].getAttribute('data-key'), true); }
    });
  });
  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () { pickSys(a.getAttribute('data-pick')); });
  });
  var first = $('.cc-sys-panel:not([hidden])'); if (first) first.classList.add('is-in');

  /* ---------- 4. flat roof checks ---------- */
  var checks = $$('.cc-check');
  var count = $('.cc-chk-count'), msg = $('.cc-chk-msg'), meter = $('.cc-chk-meter');
  var texts = [
    'Tap what you can see. Stay off the roof: look from inside, a window or the ground.',
    'One sign is worth a roofer’s eyes. Note the date and take a photo from a safe spot.',
    'Two signs together: take photos and have a roofer look at it.',
    'Several signs together. Have a roofer look at the roof before the next heavy rain.',
    'Several signs together. Have a roofer look at the roof before the next heavy rain.',
    'Every sign ticked. Have a roofer look at the roof soon and keep your photos handy.'
  ];
  function update() {
    var n = checks.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).length;
    count.textContent = n + ' of 5';
    msg.textContent = texts[n];
    meter.style.setProperty('--n', n);
  }
  checks.forEach(function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    });
  });
  update();
})();
