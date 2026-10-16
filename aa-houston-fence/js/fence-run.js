/* A&A Houston Fence — FENCE LINE
   Progressive enhancement only: with JS off every panel is fully visible,
   the sheet stays hidden, and the contact form falls back to a mailto: form post. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveal (never leaves content hidden) ---------- */
  var rises = [].slice.call(document.querySelectorAll('.fl-rise'));
  function showAll() { rises.forEach(function (el) { el.classList.add('is-in'); }); }
  if (!reduced && 'IntersectionObserver' in window && rises.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rises.forEach(function (el) { io.observe(el); });
    /* failsafe: never leave anything invisible if the observer misses a jump-scroll */
    window.setTimeout(showAll, 2600);
    window.addEventListener('beforeunload', function () { io.disconnect(); });
  } else {
    showAll();
  }

  /* ---------- anchor links scroll smoothly, page does not ---------- */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    ev.preventDefault();
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  });

  /* ---------- full-screen phone sheet ---------- */
  var sheet = document.getElementById('fl-sheet');
  var burger = document.getElementById('fl-burger');
  var closeBtn = document.getElementById('fl-sheet-close');
  var lastFocus = null;

  function lockScroll(on) {
    document.body.style.overflow = on ? 'hidden' : '';
  }
  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.setAttribute('data-open', 'true');
    sheet.removeAttribute('aria-hidden');
    lockScroll(true);
    if (closeBtn) {
      /* the sheet's visibility flips on the same frame as data-open, so focus
         lands here reliably; the rAF is a belt-and-braces fallback */
      closeBtn.focus();
      window.requestAnimationFrame(function () { closeBtn.focus(); });
    }
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.setAttribute('data-open', 'false');
    sheet.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openSheet);
  if (closeBtn) closeBtn.addEventListener('click', closeSheet);
  if (sheet) {
    sheet.addEventListener('click', function (ev) {
      if (ev.target.closest('a[href]')) closeSheet();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && sheet.getAttribute('data-open') === 'true') closeSheet();
      if (ev.key === 'Tab' && sheet.getAttribute('data-open') === 'true') {
        var f = [].slice.call(sheet.querySelectorAll('a[href], button'));
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- contact form -> the visitor's own email app ---------- */
  var form = document.getElementById('fl-enquiry');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var what = (form.querySelector('[name="what"]') || {}).value || '';
      var body = 'Name: ' + name + '\nPhone: ' + phone + '\n\nFence wanted:\n' + what + '\n';
      window.location.assign('mailto:aahoustonfence@gmail.com?subject=' +
        encodeURIComponent('Fence enquiry from the website') +
        '&body=' + encodeURIComponent(body));
    });
  }

  /* ---------- the fence run rail: drag it with a mouse too ---------- */
  var rail = document.getElementById('fl-rail');
  if (rail) {
    var down = false, startX = 0, startScroll = 0, moved = false;
    rail.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      down = true; moved = false;
      startX = ev.clientX; startScroll = rail.scrollLeft;
    });
    rail.addEventListener('pointermove', function (ev) {
      if (!down) return;
      var dx = ev.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      rail.scrollLeft = startScroll - dx;
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (t) {
      rail.addEventListener(t, function () { down = false; });
    });
    rail.addEventListener('click', function (ev) { if (moved) ev.preventDefault(); }, true);
    rail.addEventListener('dragstart', function (ev) { ev.preventDefault(); });
  }
}());