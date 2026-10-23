/* Envoy Electric · DIMMER: the page that warms from night to daylight */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone = window.matchMedia('(max-width: 759px)');

  /* ---- phone menu sheet ---- */
  var sheet = document.getElementById('sheet');
  var opener = document.querySelector('[data-open-sheet]');
  var closer = document.querySelector('[data-close-sheet]');
  function openSheet() { if (!sheet) return; sheet.hidden = false; document.body.classList.add('locked'); opener && opener.setAttribute('aria-expanded', 'true'); closer && closer.focus(); }
  function closeSheet(refocus) { if (!sheet || sheet.hidden) return; sheet.hidden = true; document.body.classList.remove('locked'); if (opener) { opener.setAttribute('aria-expanded', 'false'); if (refocus) opener.focus(); } }
  opener && opener.addEventListener('click', openSheet);
  closer && closer.addEventListener('click', function () { closeSheet(true); });
  sheet && sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { closeSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(true); });

  /* ---- header + scroll progress (the page's own dimmer rail) ---- */
  var hd = document.querySelector('.hd');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    doc.style.setProperty('--p', p.toFixed(4));
    if (hd && !hd.classList.contains('hd--solid')) hd.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- the hero dimmer ---- */
  var hero = document.getElementById('hero');
  var dim = document.getElementById('dimmer');
  var track = document.getElementById('dimTrack');
  var img = document.getElementById('heroImg');
  var num = document.getElementById('dimNum');
  var word = document.getElementById('dimWord');
  var level = 72, intro = null;

  function words(v) { return v < 3 ? 'Off' : v < 30 ? 'Low' : v < 58 ? 'Evening' : v < 88 ? 'Bright' : 'Full'; }
  function setLevel(v) {
    level = Math.round(Math.max(0, Math.min(100, v)));
    var t = level / 100;
    if (dim) dim.style.setProperty('--v', t);
    if (hero) hero.style.setProperty('--lv', t);
    if (img) img.style.filter = 'brightness(' + (0.14 + t * 0.98).toFixed(3) + ') saturate(' + (0.45 + t * 0.6).toFixed(3) + ') contrast(1.06) sepia(' + (0.18 - t * 0.1).toFixed(3) + ')';
    if (num) num.textContent = level;
    if (word) word.textContent = words(level);
    if (track) { track.setAttribute('aria-valuenow', level); track.setAttribute('aria-valuetext', level + ' percent, ' + words(level).toLowerCase()); }
  }
  function stopIntro() { if (intro) { cancelAnimationFrame(intro); intro = null; } }
  function fromPointer(e) {
    var r = track.getBoundingClientRect();
    var t = phone.matches ? (e.clientX - r.left - 27) / (r.width - 54) : 1 - (e.clientY - r.top - 25) / (r.height - 50);
    setLevel(t * 100);
  }
  if (track) {
    track.addEventListener('pointerdown', function (e) {
      stopIntro(); track.setPointerCapture(e.pointerId); track.classList.add('dragging'); fromPointer(e); e.preventDefault();
    });
    track.addEventListener('pointermove', function (e) { if (track.hasPointerCapture(e.pointerId)) fromPointer(e); });
    ['pointerup', 'pointercancel'].forEach(function (n) { track.addEventListener(n, function () { track.classList.remove('dragging'); }); });
    track.addEventListener('keydown', function (e) {
      var k = e.key, step = e.shiftKey ? 10 : 5, v = level;
      if (k === 'ArrowUp' || k === 'ArrowRight') v += step;
      else if (k === 'ArrowDown' || k === 'ArrowLeft') v -= step;
      else if (k === 'PageUp') v += 20; else if (k === 'PageDown') v -= 20;
      else if (k === 'Home') v = 0; else if (k === 'End') v = 100; else return;
      e.preventDefault(); stopIntro(); setLevel(v);
    });
    /* lights come on when the page opens */
    if (reduce) { setLevel(72); }
    else {
      setLevel(6);
      var t0 = null;
      var run = function (ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / 1900), e = 1 - Math.pow(1 - k, 3);
        setLevel(6 + e * 66);
        intro = k < 1 ? requestAnimationFrame(run) : null;
      };
      setTimeout(function () { intro = requestAnimationFrame(run); }, 450);
    }
  }

  /* ---- torch cursor: lights dark rooms, turns green over Call ---- */
  var torch = document.querySelector('.torch');
  if (torch && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var tx = 0, ty = 0, raf = null;
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var el = e.target && e.target.closest ? e.target : null;
      torch.classList.toggle('lit', !!(el && el.closest('[data-dark]')));
      torch.classList.toggle('cta', !!(el && el.closest('.pill--call')));
      if (!raf) raf = requestAnimationFrame(function () { raf = null; torch.style.transform = 'translate(' + tx + 'px,' + ty + 'px)'; });
    }, { passive: true });
    document.addEventListener('pointerleave', function () { torch.classList.remove('lit'); });
  }

  /* ---- light plan: fixtures switch services on ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.fx'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t, false); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });
  /* "Ask about ..." pre-selects the service in the form */
  var svcSelect = document.getElementById('q-service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { if (svcSelect) svcSelect.value = a.getAttribute('data-service'); });
  });
  /* warm up the hidden service photos once the page is idle */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.svc[hidden] img').forEach(function (im) { im.loading = 'eager'; });
    }, 1500);
  });

  /* ---- reveals + gallery switches ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal], .road__arrow').forEach(function (el) { io.observe(el); });

    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target, im = el.querySelector('img');
          var go = function () { el.classList.add('on'); };
          if (im && !im.complete) { im.addEventListener('load', go, { once: true }); im.addEventListener('error', go, { once: true }); } else { setTimeout(go, 120); }
          gio.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.tile').forEach(function (t) { gio.observe(t); });
  } else {
    document.querySelectorAll('[data-reveal], .road__arrow').forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.tile').forEach(function (t) { t.classList.add('on'); });
  }

  /* phone gallery: swipe meter + switch tiles on as they slide in */
  var gal = document.getElementById('gal');
  var count = document.getElementById('galCount');
  var meter = document.querySelector('.gal__meter');
  if (gal && count) {
    var tiles = gal.querySelectorAll('.tile');
    gal.addEventListener('scroll', function () {
      var w = tiles[0] ? tiles[0].getBoundingClientRect().width + 12 : 1;
      var i = Math.min(tiles.length - 1, Math.round(gal.scrollLeft / w));
      count.textContent = (i + 1) + ' / ' + tiles.length;
      if (meter) meter.style.setProperty('--g', ((i + 1) / tiles.length).toFixed(3));
      if (tiles[i]) tiles[i].classList.add('on');
    }, { passive: true });
  }

  /* ---- form: opens the visitor's email app ---- */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = v('q-name');
      if (!name) { var n = document.getElementById('q-name'); n.focus(); n.setAttribute('aria-invalid', 'true'); return; }
      var lines = ['Name: ' + name];
      if (v('q-phone')) lines.push('Phone: ' + v('q-phone'));
      if (v('q-service')) lines.push('Service: ' + v('q-service'));
      if (v('q-zip')) lines.push('Area / ZIP: ' + v('q-zip'));
      if (v('q-msg')) lines.push('', v('q-msg'));
      lines.push('', '(Photos attached if I added them.)');
      var subject = 'Website request: ' + (v('q-service') || 'electrical job') + ' (' + name + ')';
      window.location.href = 'mailto:dtorrelectric@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
