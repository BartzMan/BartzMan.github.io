/* Two Nicks Electric / LIVE WIRE GRID */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || d).querySelectorAll(s)); }

  /* reveal sweep (fires once per element) */
  var rvs = $$('[data-rv]');
  var once = [];
  function onView(el, fn) { once.push({ el: el, fn: fn }); }
  function sweep() {
    var line = window.innerHeight * 0.9;
    rvs = rvs.filter(function (el) {
      if (el.getBoundingClientRect().top < line) { el.classList.add('rv-on'); return false; }
      return true;
    });
    once = once.filter(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) { o.fn(); return false; }
      return true;
    });
  }

  /* header bus + side wire: scroll progress */
  var bus = $('.gx-bus'), wire = $('.gx-wire');
  var nodes = wire ? $$('b', wire) : [];
  function progress() {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bus) bus.style.setProperty('--p', p.toFixed(4));
    if (wire) {
      wire.style.setProperty('--p', p.toFixed(4));
      nodes.forEach(function (b) {
        var sec = d.getElementById(b.getAttribute('data-node'));
        if (!sec) return;
        var at = max > 0 ? Math.min(1, sec.offsetTop / max) : 0;
        b.style.top = (at * 100).toFixed(2) + '%';
        b.classList.toggle('on', p >= at - 0.002);
      });
    }
  }
  function tick() { sweep(); progress(); }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });
  window.addEventListener('load', tick);

  /* hero: one-line diagram energises once */
  var hero = $('.gx-hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-live'); });

  /* 1. main breaker: power cut -> transfer switch -> generator */
  var main = $('.gx-main'), sw = $('.gx-main-sw'), read = $('.gx-main-read');
  var busy = false;
  function say(state, b, s) {
    main.setAttribute('data-state', state);
    read.innerHTML = '<b>' + b + '</b> <span>' + s + '</span>';
  }
  if (sw) sw.addEventListener('click', function () {
    if (busy) return;
    busy = true;
    sw.setAttribute('aria-pressed', 'true');
    hero.classList.add('is-out');
    say('out', 'Utility power: lost.', 'The house goes dark. The transfer switch is watching the line.');
    var t = still ? 400 : 1300;
    setTimeout(function () {
      say('transfer', 'Transfer switch: moving.', 'The standby generator starts and takes the load.');
      setTimeout(function () {
        hero.classList.remove('is-out');
        hero.classList.add('is-gen');
        say('gen', 'Standby generator: on.', 'Lights back without anyone touching a cord. That is the job.');
        setTimeout(function () {
          hero.classList.remove('is-gen');
          sw.setAttribute('aria-pressed', 'false');
          say('on', 'Utility power: on.', 'Flip the main again any time.');
          busy = false;
        }, still ? 1200 : 3200);
      }, t);
    }, t);
  });

  /* 2. breaker panel tabs */
  var tabs = $$('.gx-brk'), panes = $$('.gx-pane');
  function pick(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panes.forEach(function (p) {
      var on = p.id === tab.getAttribute('aria-controls');
      if (on && p.hidden) {
        p.hidden = false;
        if (!still) { p.classList.remove('is-flick'); void p.offsetWidth; p.classList.add('is-flick'); }
      } else if (!on) p.hidden = true;
    });
    if (focus) tab.focus();
  }
  if (tabs.length) {
    var first = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    panes.forEach(function (p) { p.hidden = p.id !== first.getAttribute('aria-controls'); });
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0];
        if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); pick(n, true); }
      });
    });
  }

  /* 3. dimmer: brings the after-dark photos up; ramps once when first seen */
  var lux = $('#gx-lux'), col = $('.gx-collage'), out = $('.gx-dimmer-out');
  function setLux(v) {
    v = Math.round(v);
    col.style.setProperty('--lux', v);
    out.textContent = v + '%';
    lux.setAttribute('aria-valuetext', 'Lights at ' + v + ' percent');
  }
  if (lux && col) {
    lux.addEventListener('input', function () { setLux(+lux.value); });
    if (!still) {
      onView(col, function () {
        var t0 = null, from = 18, to = 100;
        lux.value = from; setLux(from);
        function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / 1600), e = 1 - Math.pow(1 - k, 3);
          var v = from + (to - from) * e;
          lux.value = v; setLux(v);
          if (k < 1) requestAnimationFrame(step);
        }
        setTimeout(function () { requestAnimationFrame(step); }, 250);
      });
    }
  }

  /* 4. feeder map: lines draw once, tap a town to energise its feeder */
  var map = $('.gx-map');
  if (map) {
    $$('.gx-map-lines path', map).forEach(function (p) { p.setAttribute('pathLength', '1'); });
    onView(map, function () { map.classList.add('is-drawn'); });
    var btns = $$('.gx-towns button');
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var town = b.getAttribute('data-town');
        var on = b.getAttribute('aria-pressed') !== 'true';
        btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        $$('[data-line],[data-node]', map).forEach(function (el) { el.classList.remove('on'); });
        if (on) {
          b.setAttribute('aria-pressed', 'true');
          $$('[data-line="' + town + '"],[data-node="' + town + '"]', map).forEach(function (el) { el.classList.add('on'); });
        }
      });
    });
  }

  /* 5. meter: needle swings and the register counts up to 5.0 once */
  var meter = $('.gx-meter');
  if (meter) {
    var needle = $('.gx-meter-needle', meter), num = $('.gx-meter-num', meter);
    var END = 125; /* degrees from 12 o'clock for a full-scale 5 */
    if (still) { needle.style.setProperty('--deg', END + 'deg'); }
    else {
      needle.style.setProperty('--deg', '-135deg');
      num.textContent = '0.0';
      onView(meter, function () {
        needle.style.setProperty('--deg', END + 'deg');
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / 1400);
          num.textContent = (5 * (1 - Math.pow(1 - k, 3))).toFixed(1);
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }

  /* phone sheet */
  var burger = $('.gx-burger'), sheet = $('#gx-sheet');
  if (burger && sheet) {
    var setSheet = function (open) {
      sheet.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      $('use', burger).setAttribute('href', open ? '#i-close' : '#i-menu');
      root.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setSheet(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060 && !sheet.hidden) setSheet(false); });
  }

  /* 404: reset the tripped breaker */
  var trip = $('.gx-trip');
  if (trip) trip.addEventListener('click', function () {
    trip.classList.add('is-reset');
    var href = trip.getAttribute('data-home') || './';
    setTimeout(function () { window.location.href = href; }, still ? 0 : 450);
  });

  /* request form: the publishing step wires delivery */
  var form = $('#quote');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  tick();
})();
