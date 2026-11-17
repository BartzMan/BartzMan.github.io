(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* bend readout tied to scroll */
  var deg = $('#bendDeg'), bar = $('.fp-bendread-bar'), ticking = false;
  function readout() {
    ticking = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if (deg) deg.textContent = ('00' + Math.round(p * 180)).slice(-3) + '°';
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(readout); } }, { passive: true });
  readout();

  /* lazy images in hidden panels */
  function loadImgs(panel) {
    $$('img[data-src]', panel).forEach(function (im) {
      if (im.getAttribute('data-srcset')) im.setAttribute('srcset', im.getAttribute('data-srcset'));
      im.setAttribute('src', im.getAttribute('data-src'));
      im.removeAttribute('data-src'); im.removeAttribute('data-srcset');
    });
  }

  /* generic tabs */
  function tabs(list, onPick) {
    var btns = $$('[role=tab]', list);
    function pick(b, focus) {
      btns.forEach(function (x) { var on = x === b; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; });
      onPick(b);
      if (focus) b.focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = btns[(i + 1) % btns.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
    return pick;
  }

  function panelSwap(btn, attr, map) {
    Object.keys(map).forEach(function (k) {
      var p = document.getElementById(map[k]);
      var on = k === btn.getAttribute(attr);
      p.hidden = !on;
      if (on) loadImgs(p);
    });
  }
  var st = $('.fp-tabs');
  if (st) tabs(st, function (b) { panelSwap(b, 'data-tab', { roof: 'p-roof', metal: 'p-metal' }); });
  var sw = $('.fp-switch');
  if (sw) tabs(sw, function (b) { panelSwap(b, 'data-who', { build: 'w-build-p', home: 'w-home-p' }); });

  /* ready list */
  var checks = $$('.fp-checks input'), cnt = $('#readyCount'), rb = $('#readyBar'), go = $('#readyGo');
  function tally() {
    var n = checks.filter(function (c) { return c.checked; }).length;
    cnt.textContent = n + ' OF 5 READY';
    rb.style.width = (n * 20) + '%';
    go.hidden = n < 5;
  }
  checks.forEach(function (c) { c.addEventListener('change', tally); });
  tally();

  /* FOLD A PART */
  var PARTS = {
    gutter: { code: 'P-01', name: 'Box gutter', h0: 180, L: [14, 44, 84, 44, 14], T: [90, 90, 90, 90],
      text: 'A square-sided channel that catches roof water and carries it to the downspout. Four bends turn one flat strip into the channel.',
      img: 'stock-gutter', w: 1600, h: 1067, alt: 'A gutter and downspout at the edge of a roof', cap: 'Illustrative stock photo: a gutter and downspout at a roof edge.', pos: '50% 50%' },
    drip: { code: 'P-02', name: 'Drip edge', h0: 180, L: [40, 22, 10], T: [90, -45],
      text: 'A bent strip along the roof edge that guides water off the deck and clear of the fascia. Two bends: a 90 at the edge and a 45 kick-out.',
      img: 'membrane-gable', w: 1600, h: 778, alt: 'A white membrane flat roof meeting a shingle gable at its edge', cap: 'White membrane roof edge beside a shingle gable.', pos: '50% 50%' },
    coping: { code: 'P-03', name: 'Coping cap', h0: 45, L: [8, 26, 70, 26, 8], T: [45, -90, -90, 45],
      text: 'The cap over the top of a parapet wall, so rain runs off instead of into the wall. Legs drop each side and 45 degree drip kicks shed water clear.',
      img: 'blue-parapet', w: 1600, h: 900, alt: 'Blue corrugated metal panel in the top of a parapet wall', cap: 'Metal panel at the top of a parapet wall.', pos: '50% 50%' },
    counter: { code: 'P-04', name: 'Counter-flashing', h0: 90, L: [8, 14, 46, 10], T: [-90, -90, 30],
      text: 'Tucks into a slot in the wall above, then hangs over the base flashing so water running down the wall cannot get behind it.',
      img: 'white-roof-hips', w: 1600, h: 900, alt: 'A white flat roof meeting a wall, with brown standing-seam hips', cap: 'White flat roof meeting a wall, brown standing-seam hips.', pos: '50% 50%' },
    seam: { code: 'P-05', name: 'Standing-seam panel', h0: 0, L: [7, 24, 64, 24, 7], T: [-90, 90, 90, -90],
      text: 'A long roof panel with raised seams on each side. Neighbouring panels lock together over the seam, so the fasteners stay out of the weather.',
      img: 'seam-farmhouse', w: 1600, h: 900, alt: 'A standing-seam metal roof on a green farmhouse with a brick chimney', cap: 'Standing-seam metal roof on a farmhouse.', pos: '50% 50%' },
    wall: { code: 'P-06', name: 'Wall panel', h0: 0, L: [12, 9, 12, 9, 12, 9, 12, 9, 12], T: [60, -60, -60, 60, 60, -60, -60, 60],
      text: 'A formed metal panel for a wall. The ribs add stiffness to thin sheet and give the wall its line. Eight bends in one strip.',
      img: 'siding', w: 1600, h: 2844, alt: 'Long grey siding panels running down the side of a new building', cap: 'Metal siding panels on a new building.', pos: '50% 20%' }
  };
  var cur = 'gutter', t = 0, anim = null;
  var foldSvg = $('#foldSvg'), flatSvg = $('#flatSvg'), range = $('#foldRange'), btn = $('#foldBtn');
  if (!foldSvg) return;
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, txt) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; }
  function ease(x) { x = Math.min(1, Math.max(0, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  var rad = Math.PI / 180;

  function shape(part, tt) {
    var n = part.T.length, d = .45 / n, w = 1 - (n - 1) * d;
    var g = ease(tt), head = part.h0 * g, x = 0, y = 0, pts = [[0, 0]], joints = [];
    for (var i = 0; i < part.L.length; i++) {
      var hr = head * rad;
      x += Math.cos(hr) * part.L[i]; y += Math.sin(hr) * part.L[i];
      pts.push([x, y]);
      if (i < n) {
        var p = ease((tt - i * d) / w), a = part.T[i] * p, hin = head;
        head += a;
        joints.push({ x: x, y: y, a: Math.abs(a), din: hin * rad, dout: head * rad, turn: part.T[i] });
      }
    }
    return { pts: pts, joints: joints };
  }
  var fit = null;
  function computeFit(part) {
    var minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
    shape(part, 1).pts.forEach(function (p) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
    var W = 640, H = 300, pad = 70, bw = Math.max(maxx - minx, 1), bh = Math.max(maxy - miny, 1);
    var total = part.L.reduce(function (a, b) { return a + b; }, 0);
    var s = Math.min((W - pad * 2) / bw, (H - pad * 2) / bh, 4.6, 540 / total);
    fit = { s: s, ox: (W - bw * s) / 2 - minx * s, oy: (H + bh * s) / 2 + miny * s };
  }
  function X(x) { return fit.ox + x * fit.s; }
  function Y(y) { return fit.oy - y * fit.s; }

  function drawFold() {
    var part = PARTS[cur], sh = shape(part, t);
    while (foldSvg.firstChild) foldSvg.removeChild(foldSvg.firstChild);
    foldSvg.appendChild(el('rect', { x: 0, y: 0, width: 640, height: 300, fill: 'none' }));
    var gridG = el('g', { stroke: 'rgba(184,190,196,.12)', 'stroke-width': 1 });
    for (var gx = 40; gx < 640; gx += 40) gridG.appendChild(el('path', { d: 'M' + gx + ' 0V300' }));
    for (var gy = 30; gy < 300; gy += 30) gridG.appendChild(el('path', { d: 'M0 ' + gy + 'H640' }));
    foldSvg.appendChild(gridG);
    var d = sh.pts.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join('');
    foldSvg.appendChild(el('path', { d: d, fill: 'none', stroke: '#6E4B36', 'stroke-width': 11, 'stroke-linejoin': 'miter', 'stroke-linecap': 'butt', opacity: .55, transform: 'translate(3 4)' }));
    foldSvg.appendChild(el('path', { d: d, fill: 'none', stroke: '#B8BEC4', 'stroke-width': 8, 'stroke-linejoin': 'miter', 'stroke-miterlimit': 6, 'stroke-linecap': 'butt' }));
    foldSvg.appendChild(el('path', { d: d, fill: 'none', stroke: '#F3F3F0', 'stroke-width': 1.5, opacity: .6, 'stroke-linejoin': 'miter' }));
    sh.joints.forEach(function (j) {
      var jx = X(j.x), jy = Y(j.y);
      foldSvg.appendChild(el('circle', { cx: jx, cy: jy, r: 4.5, fill: '#1E2125', stroke: '#6FA6E3', 'stroke-width': 2 }));
      var din = [Math.cos(j.din), Math.sin(j.din)], dout = [Math.cos(j.dout), Math.sin(j.dout)];
      var ox = din[0] - dout[0], oy = din[1] - dout[1], len = Math.sqrt(ox * ox + oy * oy);
      if (len < .35) { var s = j.turn > 0 ? 1 : -1; ox = Math.sin(j.din) * s; oy = -Math.cos(j.din) * s; len = 1; }
      ox /= len; oy /= len;
      var lx = jx + ox * 26, ly = jy - oy * 26;
      foldSvg.appendChild(el('text', { x: lx, y: ly + 4, 'text-anchor': 'middle', class: 'fp-svgmono', fill: '#F3F3F0' }, Math.round(j.a) + '°'));
    });
  }

  function drawFlat() {
    var part = PARTS[cur], total = part.L.reduce(function (a, b) { return a + b; }, 0);
    while (flatSvg.firstChild) flatSvg.removeChild(flatSvg.firstChild);
    var x0 = 40, wd = 560, y0 = 30, hh = 34, k = wd / total, acc = 0;
    flatSvg.appendChild(el('rect', { x: x0, y: y0, width: wd, height: hh, fill: '#B8BEC4' }));
    for (var i = 0; i < 34; i++) flatSvg.appendChild(el('path', { d: 'M' + (x0 + i * 17) + ' ' + y0 + 'V' + (y0 + hh), stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1 }));
    flatSvg.appendChild(el('rect', { x: x0, y: y0, width: wd, height: hh, fill: 'none', stroke: '#F3F3F0', 'stroke-width': 1.5 }));
    part.L.forEach(function (l, i) {
      var mid = x0 + (acc + l / 2) * k;
      flatSvg.appendChild(el('text', { x: mid, y: y0 + hh + 18, 'text-anchor': 'middle', class: 'fp-svgmono', fill: '#B8BEC4' }, String.fromCharCode(65 + i)));
      acc += l;
      if (i < part.T.length) {
        var bx = x0 + acc * k;
        flatSvg.appendChild(el('path', { d: 'M' + bx + ' ' + (y0 - 8) + 'V' + (y0 + hh + 8), stroke: '#6FA6E3', 'stroke-width': 2, 'stroke-dasharray': '5 4' }));
        flatSvg.appendChild(el('text', { x: bx, y: y0 - 13, 'text-anchor': 'middle', class: 'fp-svgmono', fill: '#F3F3F0' }, Math.abs(part.T[i]) + '°'));
      }
    });
  }

  function setT(v) { t = Math.min(1, Math.max(0, v)); range.value = Math.round(t * 100); drawFold(); btn.textContent = t >= 1 ? 'Unfold' : 'Fold it'; }
  function run(to) {
    if (anim) cancelAnimationFrame(anim);
    if (reduce) { setT(to); return; }
    var from = t, t0 = null, dur = 1700 * Math.abs(to - from) + 200;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var q = Math.min(1, (ts - t0) / dur);
      setT(from + (to - from) * q);
      if (q < 1) anim = requestAnimationFrame(step); else anim = null;
    }
    anim = requestAnimationFrame(step);
  }
  function choose(key, auto) {
    cur = key; var part = PARTS[key];
    computeFit(part); drawFlat();
    $('#stageTitle').textContent = part.code + ' · ' + part.name.toUpperCase();
    $('#partName').textContent = part.name; $('#partText').textContent = part.text;
    var im = $('#partImg');
    im.src = 'images/' + part.img + '.jpg'; im.srcset = 'images/' + part.img + '-720.jpg 720w, images/' + part.img + '.jpg 1600w';
    im.width = part.w; im.height = part.h; im.alt = part.alt; im.style.objectPosition = part.pos;
    $('#partCap').textContent = part.cap;
    $('#foldPanel').setAttribute('aria-labelledby', 't-' + key);
    if (anim) cancelAnimationFrame(anim);
    setT(0);
    if (auto) setTimeout(function () { run(1); }, 220);
  }
  var tabList = $('.fp-fold-tabs');
  tabs(tabList, function (b) { choose(b.getAttribute('data-part'), true); });
  btn.addEventListener('click', function () { run(t >= 1 ? 0 : 1); });
  range.addEventListener('input', function () { if (anim) cancelAnimationFrame(anim); anim = null; setT(range.value / 100); });
  choose('gutter', false);
  var started = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) { if (e.isIntersecting && !started) { started = true; setTimeout(function () { run(1); }, 350); ob.disconnect(); } });
    }, { threshold: .35 }).observe($('#foldPanel'));
  } else { setT(1); }
})();
