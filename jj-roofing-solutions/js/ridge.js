/* J&J Roofing Solutions: roof plan water flow, pitch slider, leak map, lightbox */
(function () {
  'use strict';
  var root = document.documentElement; root.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- roof plan: contours ---------- */
  var edges = {
    pl1: [[60, 460], [640, 460], [190, 330], [510, 330]],
    pl2: [[60, 200], [60, 460], [190, 330], [190, 330]],
    pl3: [[640, 200], [640, 460], [510, 330], [510, 330]],
    pl4: [[60, 200], [220, 200], [190, 330], [350, 330]],
    pl5: [[480, 200], [640, 200], [350, 330], [510, 330]],
    pl6: [[220, 60], [220, 200], [350, 60], [350, 330]],
    pl7: [[480, 60], [480, 200], [350, 60], [350, 330]]
  };
  var svg = $('#roofSvg');
  var cg = $('#contours');
  if (cg) {
    var html = '';
    Object.keys(edges).forEach(function (k) {
      var e = edges[k];
      for (var i = 1; i <= 4; i++) {
        var t = i / 5;
        var a = [lerp(e[0][0], e[2][0], t), lerp(e[0][1], e[2][1], t)], b = [lerp(e[1][0], e[3][0], t), lerp(e[1][1], e[3][1], t)];
        html += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '"' + (i === 3 ? ' stroke-opacity=".6" stroke-width="1.8"' : '') + '/>';
      }
    });
    cg.innerHTML = html;
  }

  /* ---------- roof plan: water flow ---------- */
  var planes = $$('#planes polygon').map(function (p) {
    var pts = p.getAttribute('points').trim().split(/\s+/).map(function (s) { var a = s.split(','); return [+a[0], +a[1]]; });
    var f = p.getAttribute('data-flow').split(',').map(Number);
    return { el: p, pts: pts, f: f, name: p.getAttribute('data-name') };
  });
  var valleys = [{ a: [220, 200], b: [350, 330], low: [220, 200] }, { a: [480, 200], b: [350, 330], low: [480, 200] }];
  function pip(p, poly) {
    var x = p[0], y = p[1], inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function distSeg(p, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  }
  function planeAt(p) { for (var i = 0; i < planes.length; i++) if (pip(p, planes[i].pts)) return planes[i]; return null; }
  function trace(p) {
    var pl = planeAt(p); if (!pl) return null;
    var q = p.slice(), n = 0;
    while (n++ < 900) {
      var nx = [q[0] + pl.f[0] * 1.5, q[1] + pl.f[1] * 1.5];
      if (!pip(nx, pl.pts)) break; q = nx;
    }
    var pts = [p, q], valley = false;
    for (var i = 0; i < valleys.length; i++) {
      if (distSeg(q, valleys[i].a, valleys[i].b) < 6) { pts.push(valleys[i].low); valley = true; break; }
    }
    return { plane: pl, pts: pts, valley: valley };
  }

  var drop = $('#drop'), home = [350, 96], dropPos = home.slice();
  var readText = $('#readText');
  var fx = null;
  function ensureFx() {
    if (!fx) { fx = document.createElementNS(NS, 'g'); fx.setAttribute('id', 'fx'); svg.insertBefore(fx, drop); }
    return fx;
  }
  function setDrop(p) { dropPos = p; drop.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')'); }
  function toSvg(e) {
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var m = svg.getScreenCTM(); if (!m) return home;
    var r = pt.matrixTransform(m.inverse()); return [clamp(r.x, 0, 700), clamp(r.y, 0, 560)];
  }
  function polyLen(pts) { var l = 0; for (var i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return l; }
  function pointAlong(pts, d) {
    for (var i = 1; i < pts.length; i++) {
      var seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d <= seg || i === pts.length - 1) { var t = seg ? clamp(d / seg, 0, 1) : 1; return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]; }
      d -= seg;
    }
    return pts[pts.length - 1];
  }
  function splash(p) {
    var g = document.createElementNS(NS, 'g'); g.setAttribute('transform', 'translate(' + p[0] + ' ' + p[1] + ')');
    g.innerHTML = '<circle r="6" fill="none" stroke="#2aa9d6" stroke-width="3"/><circle r="6" fill="#2aa9d6" fill-opacity=".35"/>';
    ensureFx().appendChild(g);
    if (g.firstChild.animate && !reduce) {
      $$('circle', g).forEach(function (c, i) { c.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(4.2)', opacity: 0 }], { duration: 900 + i * 200, easing: 'ease-out', fill: 'forwards' }); });
    }
  }
  function runFlow(pts, keep) {
    var g = ensureFx(), pth = document.createElementNS(NS, 'path');
    pth.setAttribute('d', 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L'));
    pth.setAttribute('fill', 'none'); pth.setAttribute('stroke', '#2aa9d6'); pth.setAttribute('stroke-width', '6'); pth.setAttribute('stroke-linecap', 'round'); pth.setAttribute('stroke-linejoin', 'round');
    var len = polyLen(pts) || 1; pth.setAttribute('stroke-dasharray', len); pth.setAttribute('stroke-dashoffset', reduce ? 0 : len);
    g.appendChild(pth);
    var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '9'); dot.setAttribute('fill', '#fff'); dot.setAttribute('stroke', '#2aa9d6'); dot.setAttribute('stroke-width', '4'); g.appendChild(dot);
    var end = pts[pts.length - 1];
    if (reduce) { dot.setAttribute('cx', end[0]); dot.setAttribute('cy', end[1]); splash(end); if (!keep) setTimeout(function () { pth.remove(); dot.remove(); }, 2500); return; }
    var dur = clamp(len * 5, 700, 2400), t0 = null;
    (function step(ts) {
      if (t0 === null) t0 = ts;
      var k = clamp((ts - t0) / dur, 0, 1), e = k * k * (3 - 2 * k), p = pointAlong(pts, len * e);
      dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); pth.setAttribute('stroke-dashoffset', len * (1 - e));
      if (k < 1) requestAnimationFrame(step); else { splash(end); dot.remove(); if (!keep) setTimeout(function () { pth.style.transition = 'opacity .8s'; pth.style.opacity = 0; setTimeout(function () { pth.remove(); }, 900); }, 2200); }
    })(performance.now());
  }
  function say(html) { if (readText) readText.innerHTML = html; }
  function release(p) {
    var tr = trace(p);
    if (!tr) { say('<b>That is off the roof.</b> Drop it on any slope, hip or valley and let go.'); setTimeout(function () { setDrop(home); }, 500); return; }
    if (fx) fx.innerHTML = '';
    runFlow(tr.pts, true);
    say('<b>It landed on ' + tr.plane.name + '.</b> ' + (tr.valley ? 'The water runs down to the valley, then follows the valley to the eave and into the gutter.' : 'The water runs straight down the slope to the eave and into the gutter.'));
    setTimeout(function () { setDrop(home); }, 400);
  }
  if (svg && drop) {
    var dragging = false, moved = false;
    drop.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; try { drop.setPointerCapture(e.pointerId); } catch (_) {}
      if (fx) fx.innerHTML = ''; e.preventDefault();
    });
    drop.addEventListener('pointermove', function (e) { if (!dragging) return; moved = true; setDrop(toSvg(e)); });
    var up = function (e) { if (!dragging) return; dragging = false; if (moved) release(toSvg(e)); else release(dropPos); };
    drop.addEventListener('pointerup', up);
    drop.addEventListener('pointercancel', function () { dragging = false; setDrop(home); });
    svg.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#drop')) return;
      var p = toSvg(e); setDrop(p); release(p);
    });
    var rain = $('#rainBtn'), reset = $('#resetBtn');
    if (rain) rain.addEventListener('click', function () {
      if (fx) fx.innerHTML = ''; var n = 0, tries = 0;
      say('<b>Rain on the whole roof.</b> Every drop finds the eave or a valley.');
      (function next() {
        if (n >= 8 || tries > 200) return; tries++;
        var p = [60 + Math.random() * 580, 60 + Math.random() * 400];
        var tr = trace(p); if (!tr) { next(); return; }
        runFlow(tr.pts, true); n++; setTimeout(next, reduce ? 0 : 420);
      })();
    });
    if (reset) reset.addEventListener('click', function () { if (fx) fx.innerHTML = ''; setDrop(home); say('<b>Drag the raindrop</b> from the ridge onto any part of the roof, then let go.'); });
  }

  /* ---------- pitch slider ---------- */
  var pIn = $('#pitchIn'), roof = $('#pitchRoof'), pl = $('#pitchLabel'), po = $('#pitchOut'), pd = $$('.pd'), pitch = 6, top = [340, 100];
  function setPitch(v) {
    pitch = v; var rise = v * 13; top = [340, 170 - rise];
    if (roof) roof.setAttribute('d', 'M20 170L340 170L340 ' + top[1] + 'Z');
    if (pl) { pl.textContent = v + ' in 12'; pl.setAttribute('y', 30); }
    if (po) po.textContent = v + ' in 12: rises ' + v + ' inches for every 12 inches across. ' + (v <= 4 ? 'Gentle: water leaves slowly.' : v >= 9 ? 'Steep: water leaves quickly.' : 'Moderate slope.');
  }
  if (pIn) {
    pIn.addEventListener('input', function () { setPitch(+pIn.value); });
    setPitch(6);
    var t0 = performance.now();
    var loop = function (now) {
      var period = 3400 - pitch * 230;
      pd.forEach(function (c, i) {
        var k = (((now - t0) / period) + i / pd.length) % 1, x = lerp(top[0] - 6, 26, k), y = lerp(top[1] - 8, 162, k);
        c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('opacity', (1 - Math.abs(k - .5) * .5).toFixed(2));
      });
      requestAnimationFrame(loop);
    };
    if (reduce) pd.forEach(function (c, i) { c.setAttribute('cx', lerp(top[0], 26, (i + 1) / 4)); c.setAttribute('cy', lerp(top[1], 162, (i + 1) / 4)); }); else requestAnimationFrame(loop);
  }

  /* ---------- leak map ---------- */
  var leaks = [
    ['01 · Valley', 'Valleys', 'Where two roof planes meet, water from both rushes down one channel. Look for lifted or worn shingles along the line, and leaves piled in it.'],
    ['02 · Vent pipe', 'Vent pipes', 'The collar around a vent pipe can crack in the sun. From the ground, look for a collar that seems split, or a gap where the pipe meets the roof.'],
    ['03 · Chimney', 'Chimneys', 'Where brick meets roof, metal flashing seals the joint. Brown stains on the ceiling near a chimney after rain are a sign to mention.'],
    ['04 · Roof edge', 'Edges and gutters', 'Gutters packed with leaves make water back up under the edge. If clearing them needs a ladder or the roof, leave it to a professional.']
  ];
  var hots = $$('.hot');
  hots.forEach(function (b) {
    b.addEventListener('click', function () {
      var d = leaks[+b.getAttribute('data-i')];
      hots.forEach(function (h) { h.classList.toggle('is-on', h === b); });
      $('#leakK').textContent = d[0]; $('#leakT').textContent = d[1]; $('#leakP').textContent = d[2];
    });
  });

  /* ---------- Houston topo ---------- */
  var topo = $('#topo');
  if (topo) {
    var out = '';
    [[380, 300, 60, 0.4], [1220, 360, 70, 1.9], [800, 120, 40, 3.1]].forEach(function (c) {
      for (var i = 1; i <= 11; i++) {
        var r0 = c[2] + i * 34, pts = [];
        for (var a = 0; a <= 64; a++) { var th = a / 64 * Math.PI * 2, r = r0 * (1 + .12 * Math.sin(3 * th + c[3] + i * .15) + .06 * Math.sin(5 * th + c[3] * 2)); pts.push((c[0] + Math.cos(th) * r * 1.5).toFixed(1) + ' ' + (c[1] + Math.sin(th) * r * .85).toFixed(1)); }
        out += '<path d="M' + pts.join('L') + 'Z"/>';
      }
    });
    topo.innerHTML = out;
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg');
  $$('[data-lightbox]').forEach(function (b) {
    b.addEventListener('click', function () { lbImg.src = b.getAttribute('data-lightbox'); lbImg.alt = b.getAttribute('data-alt') || ''; if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); });
  });
  if (lb) { $('#lightboxClose').addEventListener('click', function () { lb.close(); }); lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); }); }

  /* ---------- header, progress, menu, reveal ---------- */
  var bar = $('#bar'), prog = $('#progLine');
  function onScroll() {
    var y = window.scrollY || 0, h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.classList.toggle('is-stuck', y > 30);
    if (prog) prog.style.strokeDashoffset = String(100 - 100 * clamp(h > 0 ? y / h : 0, 0, 1));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = $('#burger'), sheet = $('#sheet');
  function menu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', open ? 'true' : 'false'); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (sheet) sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { menu(!document.body.classList.contains('menu-open')); });
  $$('#sheet a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
  addEventListener('resize', function () { if (innerWidth > 1180) menu(false); });
  var rev = $$('[data-reveal]'); rev.forEach(function (n, i) { n.style.setProperty('--i', String(i % 3)); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (n) { io.observe(n); });
    setTimeout(function () { rev.forEach(function (n) { n.classList.add('in'); }); }, 9000);
  } else rev.forEach(function (n) { n.classList.add('in'); });

  /* reticle cursor */
  if (window.matchMedia && matchMedia('(pointer:fine)').matches && !reduce) {
    var r = document.createElement('div'); r.className = 'reticle'; r.setAttribute('aria-hidden', 'true'); document.body.appendChild(r);
    addEventListener('pointermove', function (e) {
      r.classList.add('on'); r.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      r.classList.toggle('is-link', !!(e.target.closest && e.target.closest('a,button,input,label,#drop')));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { r.classList.remove('on'); });
  }

  var form = $('#quoteForm');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); var s = $('#quoteStatus'); if (s) s.textContent = 'Preview version: please call or text for now.'; });
})();
