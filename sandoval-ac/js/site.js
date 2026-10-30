/* Sandoval Service A/C & Refrigeration: sun arc, A/C switch, coil wipe, checks, lightbox */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(c1, c2, t) { var a = hex(c1), b = hex(c2); return 'rgb(' + a.map(function (v, i) { return Math.round(lerp(v, b[i], t)); }).join(',') + ')'; }
  function ramp(stops, t) {
    var n = stops.length - 1, p = clamp(t, 0, 1) * n, i = Math.min(Math.floor(p), n - 1);
    return mix(stops[i], stops[i + 1], p - i);
  }

  /* ---------- state shared by hero + house ---------- */
  var state = { t: 0.5, outdoor: 91, ac: false, indoor: 85, userTouched: false };
  var tempOf = function (t) { return Math.round(74 + 25 * Math.pow(t, 0.85)); };
  var listeners = [];

  /* ---------- hero: drag the sun ---------- */
  var path = $('#sunPath'), svg = $('#arcSvg'), sun = $('#sun'), range = $('#sunRange');
  var clock = $('#clock'), tempEl = $('#temp'), sky = $('.sky'), kick = $('#kickBtn');
  var plen = path ? path.getTotalLength() : 0;

  function fmtTime(t) {
    var mins = Math.round((7 * 60 + t * 540) / 5) * 5, h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? 'PM' : 'AM', h12 = h > 12 ? h - 12 : h;
    return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }

  function setT(t) {
    t = clamp(t, 0, 1);
    state.t = t;
    var temp = tempOf(t), heat = (temp - 74) / 25;
    state.outdoor = temp;
    if (path) {
      var p = path.getPointAtLength(plen * t);
      sun.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
      path.style.strokeDashoffset = String(100 - 100 * t);
    }
    var s1 = ramp(['#7dc2f1', '#58aeec', '#6db6e8', '#ffb25c', '#ff9a3c'], t);
    var s2 = ramp(['#dff1ff', '#fff3cf', '#ffe6a8', '#ffc26a', '#ff7a2a'], t);
    root.style.setProperty('--heat', heat.toFixed(3));
    if (sky) {
      sky.style.setProperty('--sky1', s1);
      sky.style.setProperty('--sky2', s2);
      sky.style.setProperty('--word', ramp(['#0b4a85', '#14609c', '#a3320b', '#6e1500'], heat));
    }
    if (clock) clock.textContent = fmtTime(t);
    if (tempEl) tempEl.textContent = temp + '°F';
    if (range) {
      range.value = Math.round(t * 1000);
      range.setAttribute('aria-valuetext', fmtTime(t) + ', ' + temp + ' degrees');
    }
    if (kick) kick.hidden = t < 0.86;
    listeners.forEach(function (fn) { fn(); });
  }

  if (svg && path) {
    var dragging = false;
    var toT = function (e) {
      var r = svg.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * 700;
      return clamp((x - 50) / 600, 0, 1);
    };
    svg.addEventListener('pointerdown', function (e) {
      if (!e.target.classList.contains('sun-hit')) return;
      dragging = true; state.userTouched = true;
      try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
      setT(toT(e));
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) { if (dragging) setT(toT(e)); });
    var stop = function () { dragging = false; };
    svg.addEventListener('pointerup', stop);
    svg.addEventListener('pointercancel', stop);
    // clicking/tapping the stage area moves the sun too (mouse only, so touch scrolling still works)
    var scene = $('.scene');
    if (scene) scene.addEventListener('click', function (e) {
      if (e.target.closest('button,a')) return;
      if (e.pointerType === 'touch') return;
      state.userTouched = true; setT(toT(e));
    });
  }
  if (range) {
    range.addEventListener('input', function () { state.userTouched = true; setT(range.value / 1000); });
  }

  // intro: the sun climbs on first view so the page visibly "heats"
  var introDone = false;
  function intro() {
    if (introDone || reduce) { setT(0.5); return; }
    introDone = true;
    var t0 = null, from = 0, to = 0.56, dur = 2600;
    setT(from);
    function step(ts) {
      if (state.userTouched) return;
      if (t0 === null) t0 = ts;
      var k = clamp((ts - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      setT(lerp(from, to, e));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- house: A/C kicks on ---------- */
  var sw = $('#acSwitch'), indoorNum = $('#indoorNum'), badge = $('#indoorBadge'), fill = $('#meterFill');
  var veilHot = $('#veilHot'), veilCool = $('#veilCool'), photo = $('.house-photo'), houseEl = $('.house');
  var acState = $('#acState'), switchSmall = $('#switchSmall');
  var tween = null;
  var targetIndoor = function () { return state.ac ? 73 : Math.max(76, state.outdoor - 4); };

  function paintIndoor(v) {
    state.indoor = v;
    var n = Math.round(v);
    if (indoorNum) indoorNum.textContent = n;
    if (badge) badge.textContent = n + '°';
    if (fill) fill.style.width = clamp((v - 70) / 32, 0.05, 1) * 100 + '%';
    var hotA = clamp((v - 76) / 22, 0, 1) * 0.78;
    if (veilHot) veilHot.style.opacity = hotA.toFixed(2);
    if (veilCool) veilCool.style.opacity = state.ac ? clamp((82 - v) / 9, 0, 1).toFixed(2) : '0';
  }
  function runTween(to, ms) {
    if (tween) cancelAnimationFrame(tween);
    var from = state.indoor;
    if (reduce) { paintIndoor(to); return; }
    var t0 = null;
    (function step(ts) {
      if (t0 === null) t0 = ts;
      var k = clamp((ts - t0) / ms, 0, 1), e = 1 - Math.pow(1 - k, 3);
      paintIndoor(lerp(from, to, e));
      if (k < 1) tween = requestAnimationFrame(step);
    })(performance.now());
  }
  function setAc(on, instant) {
    state.ac = on;
    if (sw) sw.setAttribute('aria-checked', on ? 'true' : 'false');
    if (photo) photo.classList.toggle('is-cool', on);
    if (houseEl) houseEl.classList.toggle('is-cooled', on);
    if (acState) acState.textContent = on ? 'A/C is running. The house cools down.' : 'A/C is off. The house is heating up.';
    if (switchSmall) switchSmall.textContent = on ? 'Currently running' : 'Currently off';
    if (instant) paintIndoor(targetIndoor()); else runTween(targetIndoor(), 2200);
  }
  if (sw) sw.addEventListener('click', function () { setAc(!state.ac); });
  listeners.push(function () {
    if (!state.ac) { if (tween) cancelAnimationFrame(tween); paintIndoor(targetIndoor()); }
  });
  if (kick) kick.addEventListener('click', function () {
    var h = $('#house');
    if (h) h.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () { setAc(true); }, reduce ? 0 : 700);
  });

  /* ---------- coil wipe ---------- */
  var wipe = $('#wipe'), wr = $('#wipeRange');
  function setWipe(p) {
    p = clamp(p, 0, 100);
    if (wipe) wipe.style.setProperty('--wipe', p + '%');
    if (wr) wr.value = Math.round(p);
  }
  if (wipe) {
    var wdrag = false;
    var wx = function (e) { var r = wipe.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
    wipe.addEventListener('pointerdown', function (e) {
      wdrag = true; try { wipe.setPointerCapture(e.pointerId); } catch (_) {}
      setWipe(wx(e));
    });
    wipe.addEventListener('pointermove', function (e) { if (wdrag) { setWipe(wx(e)); if (e.pointerType === 'mouse') e.preventDefault(); } });
    ['pointerup', 'pointercancel'].forEach(function (n) { wipe.addEventListener(n, function () { wdrag = false; }); });
    if (wr) wr.addEventListener('input', function () { setWipe(+wr.value); });
    // wipe hint: slide once when it first scrolls into view
    if ('IntersectionObserver' in window && !reduce) {
      var hint = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          hint.disconnect();
          var t0 = null;
          (function step(ts) {
            if (t0 === null) t0 = ts;
            var k = (ts - t0) / 1600;
            if (k >= 1 || wdrag) { if (!wdrag) setWipe(50); return; }
            setWipe(50 + Math.sin(k * Math.PI * 2) * 28 * (1 - k));
            requestAnimationFrame(step);
          })(performance.now());
        });
      }, { threshold: 0.5 });
      hint.observe(wipe);
    }
  }

  /* ---------- checks stepper ---------- */
  var steps = [
    { name: 'Thermostat', set: '72°', title: '1. Thermostat', text: 'Set it to Cool, with the temperature a few degrees below the room. If the screen is blank, replace the batteries.' },
    { name: 'Air filter', set: '2/4', title: '2. Air filter', text: 'A clogged filter chokes airflow. Slide it out: if you cannot see light through it, swap in a new one of the same size.' },
    { name: 'Breaker', set: '3/4', title: '3. Breaker', text: 'Look at your breaker panel for a tripped A/C switch. Flip it fully off, then on, once. If it trips again, leave it off.' },
    { name: 'Outdoor unit', set: '4/4', title: '4. Outdoor unit', text: 'Is the outdoor unit running, with leaves, boxes and plants cleared from around it? Clear what you can, and keep hands away from the fan.' }
  ];
  var cur = 0;
  var el = { title: $('#stepTitle'), text: $('#stepText'), dots: $$('#stepDots li'), step: $('#thStep'), icon: $('#thIcon'), set: $('#thSet'),
    btns: $('#stepBtns'), back: $('#stepBack'), end: $('#stepEnd'), endText: $('#endText'), ring: $('.thermo-ring') };
  function paintStep() {
    var s = steps[cur];
    if (!el.title) return;
    el.title.textContent = s.title; el.text.textContent = s.text;
    el.step.textContent = 'Step ' + (cur + 1) + ' of 4'; el.icon.textContent = s.name; el.set.textContent = cur === 0 ? '72°' : (cur + 1) + '/4';
    el.dots.forEach(function (d, i) { d.className = i < cur ? 'done' : (i === cur ? 'on' : ''); });
    el.back.hidden = cur === 0;
    if (el.ring) el.ring.style.transform = 'rotate(' + cur * 90 + 'deg)';
  }
  function finish(fixed) {
    el.btns.hidden = true; el.back.hidden = true; el.end.hidden = false;
    el.dots.forEach(function (d) { d.className = 'done'; });
    el.title.textContent = fixed ? 'Good. Cool air is back.' : 'Still warm after four checks?';
    el.text.textContent = '';
    el.endText.textContent = fixed
      ? 'If it stops cooling again, that is worth a call. Do not open the unit or touch wiring or refrigerant lines.'
      : 'Time to call a technician. Switch the system off, and leave the unit, wiring and refrigerant lines alone.';
    el.step.textContent = fixed ? 'Done' : 'Call a pro'; el.icon.textContent = fixed ? 'Cooling' : 'Technician'; el.set.textContent = fixed ? '72°' : '?';
  }
  if (el.title) {
    $('#stepFixed').addEventListener('click', function () { finish(true); });
    $('#stepNext').addEventListener('click', function () { if (cur < 3) { cur++; paintStep(); } else finish(false); });
    el.back.addEventListener('click', function () { if (cur > 0) { cur--; paintStep(); } });
    $('#stepRestart').addEventListener('click', function () { cur = 0; el.btns.hidden = false; el.end.hidden = true; el.text.textContent = ''; paintStep(); });
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox'), lbImg = $('#lightboxImg');
  $$('[data-lightbox]').forEach(function (b) {
    b.addEventListener('click', function () {
      lbImg.src = b.getAttribute('data-lightbox'); lbImg.alt = b.getAttribute('data-alt') || '';
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    });
  });
  if (lb) {
    $('#lightboxClose').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- header, menu, scroll sun, reveals ---------- */
  var mast = $('#mast'), miniSun = $('#miniSun'), miniArc = $('#miniArc');
  var mlen = miniArc ? miniArc.getTotalLength() : 0;
  function onScroll() {
    var y = window.scrollY || 0;
    if (mast) mast.classList.toggle('is-stuck', y > 40);
    if (miniSun && mlen) {
      var h = document.documentElement.scrollHeight - innerHeight;
      var p = miniArc.getPointAtLength(mlen * clamp(h > 0 ? y / h : 0, 0, 1));
      miniSun.setAttribute('cx', p.x.toFixed(1)); miniSun.setAttribute('cy', p.y.toFixed(1));
    }
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

  var rev = $$('[data-reveal]');
  rev.forEach(function (n, i) { n.style.setProperty('--i', String(i % 3)); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (n) { io.observe(n); });
    setTimeout(function () { rev.forEach(function (n) { n.classList.add('in'); }); }, 9000);
  } else { rev.forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- sun cursor (mouse only) ---------- */
  if (window.matchMedia && matchMedia('(pointer:fine)').matches && !reduce) {
    var cur2 = document.createElement('div'); cur2.className = 'sun-cursor'; cur2.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cur2);
    addEventListener('pointermove', function (e) {
      cur2.classList.add('on');
      cur2.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      cur2.classList.toggle('is-link', !!e.target.closest && !!e.target.closest('a,button,input,label,.sun-hit,.wipe'));
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cur2.classList.remove('on'); });
  }

  /* ---------- forms ---------- */
  var form = $('#quoteForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = $('#quoteStatus');
    if (s) s.textContent = 'Preview version: please call or text for now.';
  });

  /* init */
  setAc(false, true);
  setT(reduce ? 0.5 : 0);
  intro();
})();
