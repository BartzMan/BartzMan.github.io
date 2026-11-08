/* ROUTE 66 ROADSIDE — concept interactions only.
   kit.js already owns: menu sheet, sticky bar, lightbox, reveals,
   nav highlight, form preview, scroll variable, year.
   This file owns: the highway drive (drag + buttons + progress),
   hail-check accordions. */

(function () {
  'use strict';

  /* 1 — The drive: a horizontal highway of billboards.
        Swipe on touch, drag on desktop, step with the arrows.
        Native overflow-x scroll is kept (accessible), with
        pointer-drag added on top for mouse users. */
  var strip = document.querySelector('[data-drive]');
  var fill = document.querySelector('.drive-fill');
  var count = document.querySelector('[data-drive-count]');
  var prev = document.querySelector('[data-drive-prev]');
  var next = document.querySelector('[data-drive-next]');
  var boards = Array.prototype.slice.call(document.querySelectorAll('.billboard'));

  function scrollStep(dir) {
    if (!strip) return;
    var first = boards[0];
    var step = first ? first.getBoundingClientRect().width + 26 : strip.clientWidth * 0.8;
    strip.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  if (prev) prev.addEventListener('click', function () { scrollStep(-1); });
  if (next) next.addEventListener('click', function () { scrollStep(1); });

  function syncDrive() {
    if (!strip) return;
    var max = strip.scrollWidth - strip.clientWidth;
    var pct = max > 0 ? strip.scrollLeft / max : 0;
    var dr = document.querySelector('.drive'); if (dr) dr.style.setProperty('--drive-p', pct.toFixed(3));
    if (fill) fill.style.width = (pct * 100).toFixed(1) + '%';
    /* which billboard is centred in the viewport of the strip */
    var mid = strip.scrollLeft + strip.clientWidth / 2;
    var idx = 0;
    boards.forEach(function (b, i) {
      var center = b.offsetLeft + b.offsetWidth / 2;
      if (Math.abs(center - mid) < Math.abs(boards[idx].offsetLeft + boards[idx].offsetWidth / 2 - mid)) idx = i;
    });
    if (count) count.textContent = String(idx + 1);
    if (prev) prev.disabled = strip.scrollLeft < 8;
    if (next) next.disabled = max - strip.scrollLeft < 8;
  }
  if (strip) {
    strip.addEventListener('scroll', syncDrive, { passive: true });
    strip.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollStep(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollStep(-1); }
    });
    /* drag-to-scroll for mouse */
    var dragging = false, startX = 0, startScroll = 0, moved = false;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragging = true; moved = false;
      startX = e.clientX; startScroll = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
      strip.classList.add('is-dragging');
    });
    strip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = startScroll - dx;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove('is-dragging');
      /* if it was a drag, swallow the click that follows so links
         inside billboards don't fire accidentally */
      if (moved) {
        strip.addEventListener('click', function swallow(ev) {
          ev.preventDefault(); ev.stopPropagation();
          strip.removeEventListener('click', swallow, true);
        }, true);
      }
      syncDrive();
    }
    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', syncDrive);
    syncDrive();
  }

  /* 2 — Hail checks: tap a marker to open its card. */
  document.querySelectorAll('[data-check]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('.hail-check');
      var body = wrap.querySelector('.hail-body');
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.hidden = !open;
      body.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });
})();

(function () {
  'use strict';
  /* 3 - Yard plan: tap a numbered pin to open that check. */
  var pins = document.querySelectorAll('[data-pin]');
  function syncPins() {
    pins.forEach(function (p) {
      var b = document.getElementById('checkBtn' + p.getAttribute('data-pin'));
      p.classList.toggle('is-on', !!b && b.getAttribute('aria-expanded') === 'true');
    });
  }
  function openCheck(n) {
    var btn = document.getElementById('checkBtn' + n);
    if (!btn) return;
    if (btn.getAttribute('aria-expanded') !== 'true') btn.click();
  }
  pins.forEach(function (pin) {
    var n = pin.getAttribute('data-pin');
    pin.addEventListener('click', function () { openCheck(n); });
    pin.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCheck(n); }
    });
  });
  document.querySelectorAll('[data-check]').forEach(function (btn) {
    btn.addEventListener('click', function () { setTimeout(syncPins, 0); });
  });
  syncPins();
})();
