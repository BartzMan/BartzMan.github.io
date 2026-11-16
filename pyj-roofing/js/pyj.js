(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- nail-head cursor ---- */
  var cur = $('.pj-cursor');
  if (cur && window.matchMedia('(hover:hover) and (min-width:901px)').matches) {
    document.addEventListener('pointermove', function (e) {
      cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      cur.classList.add('on');
      cur.classList.toggle('big', !!e.target.closest('a,button,label,[data-xr]'));
    });
    document.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
  }

  /* ---- build gauge: which layer is on screen ---- */
  var gauge = $('[data-gauge]');
  var secs = $$('[data-layer-sec]');
  function setLayer(n) {
    document.body.setAttribute('data-layer', n);
    $$('li', gauge).forEach(function (li) {
      var g = +li.getAttribute('data-g');
      li.classList.toggle('on', g === n);
      li.classList.toggle('done', g < n);
    });
  }
  function onScroll() {
    var mid = window.innerHeight * 0.45, cur = 1;
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= mid) cur = +s.getAttribute('data-layer-sec');
    });
    setLayer(cur);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- roof x-ray ---- */
  var xr = $('[data-xr]');
  if (xr) {
    var VB = { w: 1600, h: 1200 }, TY = 150, ANG = -9 * Math.PI / 180, CX = 800, CY = 420;
    var targets = {
      drip:    { x: 232, y: 380, label: 'Drip edge' },
      shingle: { x: 760, y: 320, label: 'Shingles' },
      under:   { x: 760, y: 380, label: 'Underlayment' },
      deck:    { x: 760, y: 435, label: 'Deck' },
      ridge:   { x: 1390, y: 330, label: 'Ridge cap' }
    };
    var info = {
      deck: { n: 'Layer 1 of 5', h: 'The deck', p: 'Plywood sheets nailed across the rafters. Everything else sits on this, so it should be flat, dry and solid.', img: 'images/deck-720.jpg', cap: 'Fresh plywood deck, underlayment edge at the corner', alt: 'Plywood roof decking with the edge of the underlayment' },
      under: { n: 'Layer 2 of 5', h: 'Underlayment', p: 'A water-resistant sheet rolled over the deck. It is the back-up layer if water gets past the top.', img: 'images/under-720.jpg', cap: 'Synthetic underlayment over a whole roof', alt: 'Printed synthetic underlayment rolled over a whole roof' },
      drip: { n: 'Layer 3 of 5', h: 'Drip edge', p: 'A bent metal strip along the roof edge that guides water into the gutter instead of behind it.', img: 'images/stock-gutter-line.jpg', cap: 'Illustrative: the roof edge, gutter and downspout', alt: 'A copper-coloured gutter and white downspout under a roof edge' },
      shingle: { n: 'Layer 4 of 5', h: 'Shingle courses', p: 'Overlapping rows laid from the bottom edge up, each row covering the nails of the one below.', img: 'images/shingle-720.jpg', cap: 'New tan shingles to the ridge', alt: 'Tan shingle roof and ridge beside a gutter' },
      ridge: { n: 'Layer 5 of 5', h: 'Ridge cap', p: 'The pieces that cap the peak where two slopes meet, so rain cannot slip in along the top.', img: 'images/hero-720.jpg', cap: 'The roofline of the brick house above', alt: 'A two-storey brick house with a worker on the roof', pos: '30% 40%' }
    };
    var card = $('#xr-card'), fig = $('.pj-card-fig', card), figImg = $('img', fig), figCap = $('figcaption', fig);
    var chips = $$('.pj-chips button');
    var st = { x: 0.40, y: 0.55 }, current = null;

    function toStage(gx, gy) { // group coords -> viewBox coords
      var dx = gx - CX, dy = gy - CY, c = Math.cos(ANG), s = Math.sin(ANG);
      return { x: CX + dx * c - dy * s, y: CY + dx * s + dy * c + TY };
    }
    function toGroup(vx, vy) {
      var dx = vx - CX, dy = vy - TY - CY, c = Math.cos(-ANG), s = Math.sin(-ANG);
      return { x: CX + dx * c - dy * s, y: CY + dx * s + dy * c };
    }
    // the svg uses "slice": map stage fraction <-> viewBox through the cover transform
    function cover() {
      var r = xr.getBoundingClientRect(), k = Math.max(r.width / VB.w, r.height / VB.h);
      return { r: r, k: k, ox: (r.width - VB.w * k) / 2, oy: (r.height - VB.h * k) / 2 };
    }
    function vbFromFrac(fx, fy) { var c = cover(); return { x: (fx * c.r.width - c.ox) / c.k, y: (fy * c.r.height - c.oy) / c.k }; }
    function fracFromVb(vx, vy) { var c = cover(); return { x: (vx * c.k + c.ox) / c.r.width, y: (vy * c.k + c.oy) / c.r.height }; }

    function size() {
      var w = xr.getBoundingClientRect().width;
      xr.style.setProperty('--r', Math.round(w * (window.innerWidth < 901 ? 0.2 : 0.185)) + 'px');
    }
    function place() {
      xr.style.setProperty('--lx', (st.x * 100).toFixed(2) + '%');
      xr.style.setProperty('--ly', (st.y * 100).toFixed(2) + '%');
    }
    function nearest() {
      var v = vbFromFrac(st.x, st.y), g = toGroup(v.x, v.y), best = null, bd = 1e12;
      Object.keys(targets).forEach(function (k) {
        var t = targets[k], d = Math.pow((g.x - t.x) * (k === 'drip' || k === 'ridge' ? 0.55 : 1), 2) + Math.pow(g.y - t.y, 2);
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }
    function show(k, fromChip) {
      if (k === current && !fromChip) return;
      current = k;
      var d = info[k];
      chips.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-layer') === k ? 'true' : 'false'); });
      $('.pj-card-stamp', card).textContent = d.n;
      $('.pj-card-h', card).textContent = d.h;
      $('.pj-card-p', card).textContent = d.p;
      figImg.src = d.img; figImg.alt = d.alt; figImg.style.objectPosition = d.pos || '50% 50%';
      figCap.textContent = d.cap; fig.hidden = false;
    }
    function clampF(fx, fy) {
      var r = xr.getBoundingClientRect(), rp = (parseFloat(getComputedStyle(xr).getPropertyValue('--r')) || 100) * 0.8;
      var mx = rp / r.width, my = rp / r.height;
      return { x: Math.max(mx, Math.min(1 - mx, fx)), y: Math.max(my, Math.min(1 - my, fy)) };
    }
    function move(fx, fy) {
      var c = clampF(fx, fy); st.x = c.x; st.y = c.y;
      place(); show(nearest());
    }
    var dragging = false, off = { x: 0, y: 0 };
    function pt(e) { var r = xr.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; }
    xr.addEventListener('pointerdown', function (e) {
      var p = pt(e), c = cover(), rpx = parseFloat(getComputedStyle(xr).getPropertyValue('--r')) || 100;
      var dist = Math.hypot((p.x - st.x) * c.r.width, (p.y - st.y) * c.r.height);
      dragging = true; xr.classList.add('drag', 'touched');
      off = dist < rpx ? { x: st.x - p.x, y: st.y - p.y } : { x: 0, y: 0 };
      try { xr.setPointerCapture(e.pointerId); } catch (_) {}
      if (dist >= rpx) move(p.x, p.y);
      e.preventDefault();
    });
    xr.addEventListener('pointermove', function (e) { if (!dragging) return; var p = pt(e); move(p.x + off.x, p.y + off.y); });
    var end = function () { dragging = false; xr.classList.remove('drag'); };
    xr.addEventListener('pointerup', end); xr.addEventListener('pointercancel', end);
    xr.addEventListener('keydown', function (e) {
      var s = e.shiftKey ? 0.1 : 0.04, m = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
      if (m) { e.preventDefault(); xr.classList.add('touched'); move(st.x + m[0], st.y + m[1]); }
    });
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-layer'), t = targets[k], v = toStage(t.x, t.y), f = fracFromVb(v.x, v.y);
        xr.classList.add('touched');
        f = clampF(f.x, f.y);
        animateTo(f.x, f.y);
        show(k, true);
      });
    });
    function animateTo(tx, ty) {
      var sx = st.x, sy = st.y, t0 = null, dur = 520;
      if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { st.x = tx; st.y = ty; place(); return; }
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        st.x = sx + (tx - sx) * e; st.y = sy + (ty - sy) * e; place();
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    window.addEventListener('resize', function () { size(); place(); });
    size();
    // start the lens over the roof of the brick house
    var start = fracFromVb(900, 640); st.x = Math.min(0.5, start.x); st.y = Math.min(0.62, start.y); place();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { size(); place(); });
  }

  /* ---- shingle / metal switch ---- */
  var sw = $('[data-sw]');
  if (sw) {
    var tabs = $$('[role=tab]', sw), panels = $$('[role=tabpanel]', sw);
    var pick = function (i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick((i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length, true); }
      });
    });
    pick(0);
  }

  /* ---- layer checklist ---- */
  var ck = $('[data-check]');
  if (ck) {
    var boxes = $$('input[type=checkbox]', ck), arc = $('.pj-meter-arc', ck), cnt = $('[data-count]', ck), msg = $('[data-msg]', ck);
    var words = ['Tick each layer as you ask. Good questions come first.', 'One layer covered. Keep going.', 'Two down. The hidden layers matter most.', 'Three layers asked about.', 'Nearly there: one more question.', 'All five layers covered. You know what to ask.'];
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      cnt.textContent = n;
      arc.style.strokeDashoffset = 314 - 314 * n / boxes.length;
      msg.textContent = words[n];
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });
    upd();
  }
})();
