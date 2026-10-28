(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---- header + paint-stroke progress ---- */
  var head = $('.jg-head'), prog = $('.jg-prog');
  function onScroll() {
    var y = window.scrollY || 0, vh = window.innerHeight;
    if (head && !head.classList.contains('jg-head-solid')) head.classList.toggle('is-stuck', y > 40);
    var max = Math.max(1, document.documentElement.scrollHeight - vh);
    if (prog) prog.style.setProperty('--p', clamp(y / max, 0, 1).toFixed(4));
    checkReveal();
  }

  /* ---- reveal ---- */
  var rv = $$('.reveal');
  rv.forEach(function (el) { var i = Array.prototype.indexOf.call(el.parentNode.children, el); el.style.setProperty('--d', (Math.min(i, 4) * 0.1).toFixed(2) + 's'); });
  function checkReveal() {
    var vh = window.innerHeight;
    for (var i = rv.length - 1; i >= 0; i--) {
      var el = rv[i], r = el.getBoundingClientRect();
      if (r.top < vh * 0.9) { el.classList.add('in'); rv.splice(i, 1); (function (e) { setTimeout(function () { e.classList.remove('reveal', 'in'); e.style.removeProperty('--d'); }, 1600); })(el); }
    }
  }

  /* ---- menu sheet ---- */
  var burger = $('.jg-burger'), sheet = $('#jg-sheet');
  function setSheet(open) { sheet.hidden = !open; burger.setAttribute('aria-expanded', open ? 'true' : 'false'); document.body.style.overflow = open ? 'hidden' : ''; if (open) $('.jg-sheet-x').focus(); else burger.focus(); }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(sheet.hidden); });
    $('.jg-sheet-x').addEventListener('click', function () { setSheet(false); });
    $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) setSheet(false); });
  }

  /* ---- COLOR MIXER ---- */
  var SW = [['Lake blue', '#4aa3cf'], ['Harbor steel', '#8c98a4'], ['Rust', '#d4743a'], ['Sunrise', '#f3c04c'], ['Sage', '#8fb08a'], ['Plum', '#8a5a86']];
  var NAMES = [['Harbor blue', '#5b8fb0'], ['Foam', '#bfe0e0'], ['Sage', '#9db591'], ['Moss', '#7a8f55'], ['Sand', '#e3cfa0'], ['Sunrise', '#f3c04c'], ['Clay', '#c8825c'], ['Rust', '#b9582c'], ['Brick', '#9a4a3c'], ['Plum', '#7c5578'], ['Slate', '#6f7c8a'], ['Steel', '#a3adb6'], ['Cream', '#efe5cf'], ['Teal', '#3f9a95'], ['Dune', '#c9b690'], ['Ember', '#e5733a'], ['Lake blue', '#4aa3cf'], ['Mist', '#c7d3dc'], ['Olive', '#a2a064'], ['Rose clay', '#c9928a']];
  var PRIMER = '#efece4';
  function hex2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function rgb2hex(c) { return '#' + c.map(function (v) { v = Math.round(clamp(v, 0, 255)); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function lerp(a, b, t) { return a.map(function (v, i) { return v + (b[i] - v) * t; }); }
  function nearest(rgb) { var best = NAMES[0][0], bd = 1e9; NAMES.forEach(function (n) { var c = hex2rgb(n[1]), d = 0; for (var i = 0; i < 3; i++) d += (c[i] - rgb[i]) * (c[i] - rgb[i]); if (d < bd) { bd = d; best = n[0]; } }); return best; }
  var room = $('#jg-room'), track = $('#jg-tray-track'), tray = $('#jg-tray');
  var dA = $('#jg-drop-a'), dB = $('#jg-drop-b');
  var state = { ca: SW[0][1], cb: SW[3][1], pa: 0, pb: 1 };
  function buildSw(box, key) {
    var host = $('[role=radiogroup]', box);
    SW.forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'jg-sw'; b.style.setProperty('--c', s[1]);
      b.setAttribute('role', 'radio'); b.setAttribute('aria-label', s[0]); b.setAttribute('aria-checked', s[1] === state[key] ? 'true' : 'false'); b.dataset.c = s[1];
      b.addEventListener('click', function () { state[key] = s[1]; $$('.jg-sw', host).forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); }); apply(); });
      host.appendChild(b);
    });
  }
  function syncSwatches() {
    ['a', 'b'].forEach(function (k) { var key = 'c' + k; $$('#jg-pick-' + k + ' .jg-sw').forEach(function (x) { x.setAttribute('aria-checked', x.dataset.c === state[key] ? 'true' : 'false'); }); });
  }
  function apply() {
    var A = hex2rgb(state.ca), B = hex2rgb(state.cb), mix = lerp(A, B, 0.5);
    var t = 1 - Math.abs(state.pa - state.pb);
    var e = t * t * (3 - 2 * t);
    var wall = lerp(hex2rgb(PRIMER), mix, e), whex = rgb2hex(wall);
    room.style.setProperty('--wall', whex);
    $('#jg-read-sw').style.background = whex;
    tray.style.setProperty('--t', t.toFixed(3));
    track.style.setProperty('--mix', rgb2hex(mix));
    track.style.setProperty('--pa', state.pa.toFixed(4)); track.style.setProperty('--pb', state.pb.toFixed(4));
    dA.style.setProperty('--p', state.pa.toFixed(4)); dB.style.setProperty('--p', state.pb.toFixed(4));
    dA.style.setProperty('--c', state.ca); dB.style.setProperty('--c', state.cb);
    dA.setAttribute('aria-valuenow', Math.round(state.pa * 100)); dB.setAttribute('aria-valuenow', Math.round(state.pb * 100));
    var nm = t < 0.08 ? 'Primer white' : nearest(wall);
    $('#jg-read-name').textContent = nm; $('#jg-chipname').textContent = nm;
    $('#jg-read-hex').textContent = whex.toUpperCase();
  }
  function dragify(el, key) {
    var active = false;
    function setFromX(clientX) {
      var r = track.getBoundingClientRect(), dw = el.getBoundingClientRect().width;
      state[key] = clamp((clientX - r.left - dw / 2) / (r.width - dw), 0, 1); apply();
    }
    el.addEventListener('pointerdown', function (e) { active = true; el.setPointerCapture(e.pointerId); dA.classList.remove('on'); dB.classList.remove('on'); el.classList.add('on'); setFromX(e.clientX); e.preventDefault(); });
    el.addEventListener('pointermove', function (e) { if (active) setFromX(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(function (ev) { el.addEventListener(ev, function () { active = false; }); });
    el.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? -0.05 : e.key === 'ArrowRight' ? 0.05 : 0;
      if (e.key === 'Home') { state[key] = 0; apply(); e.preventDefault(); return; }
      if (e.key === 'End') { state[key] = 1; apply(); e.preventDefault(); return; }
      if (d) { state[key] = clamp(state[key] + d, 0, 1); apply(); e.preventDefault(); }
    });
  }
  var userMoved = false;
  if (room && track && dA && dB) {
    buildSw($('#jg-pick-a'), 'ca'); buildSw($('#jg-pick-b'), 'cb');
    dragify(dA, 'pa'); dragify(dB, 'pb');
    [dA, dB].forEach(function (d) { d.addEventListener('pointerdown', function () { userMoved = true; }); d.addEventListener('keydown', function () { userMoved = true; }); });
    apply();
    $('#jg-reset').addEventListener('click', function () { userMoved = true; state.pa = 0; state.pb = 1; state.ca = SW[0][1]; state.cb = SW[3][1]; syncSwatches(); apply(); });
    $('#jg-shuffle').addEventListener('click', function () {
      userMoved = true;
      var i = Math.floor(Math.random() * SW.length), j = (i + 1 + Math.floor(Math.random() * (SW.length - 1))) % SW.length;
      state.ca = SW[i][1]; state.cb = SW[j][1]; state.pa = 0.18; state.pb = 0.82; syncSwatches(); apply();
      glide(0.38, 0.62);
    });
    function glide(ta, tb) {
      if (reduce) { state.pa = ta; state.pb = tb; apply(); return; }
      var a0 = state.pa, b0 = state.pb, t0 = null;
      function tick(t) { if (!t0) t0 = t; var k = clamp((t - t0) / 1100, 0, 1), e = 1 - Math.pow(1 - k, 3); state.pa = a0 + (ta - a0) * e; state.pb = b0 + (tb - b0) * e; apply(); if (k < 1) requestAnimationFrame(tick); }
      requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); setTimeout(function () { if (!userMoved) glide(0.36, 0.64); }, 500); } }); }, { threshold: 0.4 });
      io.observe(tray);
    }
  }

  /* ---- gallery filter ---- */
  var chips = $$('.jg-chipbtn'), tiles = $$('.jg-tile'), note = $('#jg-grid-note');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var f = c.dataset.f, n = 0;
      tiles.forEach(function (t) {
        var show = f === 'all' || t.dataset.cat === f;
        if (show) { n++; t.classList.remove('gone'); void t.offsetWidth; t.classList.remove('out'); }
        else { t.classList.add('out'); (function (tt) { setTimeout(function () { if (tt.classList.contains('out')) tt.classList.add('gone'); }, reduce ? 0 : 300); })(t); }
      });
      note.textContent = f === 'all' ? 'Showing every photo.' : 'Showing ' + n + ' ' + (f === 'int' ? 'inside' : 'outside') + ' photos.';
    });
  });

  /* ---- rating count ---- */
  var count = $('#jg-count'), stars = $('#jg-stars');
  if (count && 'IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; io3.disconnect(); stars && stars.classList.add('in'); if (reduce) return;
        var to = parseFloat(count.dataset.to), t0 = null;
        function tick(t) { if (!t0) t0 = t; var k = clamp((t - t0) / 1100, 0, 1); count.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(tick); else count.textContent = to.toFixed(1); }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    io3.observe(count);
  } else if (stars) { stars.classList.add('in'); }

  var form = $('#jg-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
