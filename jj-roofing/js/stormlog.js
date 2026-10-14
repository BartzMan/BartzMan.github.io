/* J&J Roofing & Remodeling - STORM LOG
   Small behaviours only: the phone sheet, the log rail, the mailto form.
   All motion lives in CSS; this file toggles state, never animates. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- full-screen phone sheet ---------- */
  var burger = document.querySelector('.sl-burger');
  var sheet = document.getElementById('sl-sheet');
  var closer = sheet ? sheet.querySelector('[data-close]') : null;
  var opener = null;

  function sheetOpen() { return sheet && !sheet.hasAttribute('hidden'); }

  function openSheet() {
    if (!sheet) return;
    opener = document.activeElement;
    sheet.removeAttribute('hidden');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closer) closer.focus();
  }
  function closeSheet() {
    if (!sheet || !sheetOpen()) return;
    sheet.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      if (sheetOpen()) { closeSheet(); } else { openSheet(); }
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('[data-close]')) closeSheet();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) closeSheet();
    });
  }

  /* ---------- log rail: reading progress + current entry ---------- */
  var rail = document.querySelector('.sl-rail');
  if (rail) {
    var ticks = Array.prototype.slice.call(rail.querySelectorAll('.sl-rail__ticks li'));
    var targets = ticks.map(function (li) {
      return document.getElementById(li.getAttribute('data-for'));
    }).filter(Boolean);
    var active = -1;
    var queued = false;

    function paint() {
      queued = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.pageYOffset / max : 0;
      rail.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));

      var line = window.innerHeight * 0.42;
      var now = 0;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= line) { now = i; }
      }
      if (now !== active) {
        if (ticks[active]) ticks[active].classList.remove('is-on');
        ticks[now].classList.add('is-on');
        active = now;
      }
    }
    function queue() {
      if (!queued) { queued = true; window.requestAnimationFrame(paint); }
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    paint();
  }

  /* ---------- contact form: hand off to the visitor's email app ---------- */
  var form = document.getElementById('sl-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.elements.name.value || '').trim();
      var contact = (form.elements.contact.value || '').trim();
      var where = (form.elements.where.value || '').trim();
      var what = (form.elements.what.value || '').trim();
      if (!contact) { form.elements.contact.focus(); return; }

      var lines = [
        'Name: ' + (name || '(not given)'),
        'Phone or email: ' + contact,
        'Location: ' + (where || '(not given)'),
        '',
        'What the roof is doing:',
        (what || '(not given)')
      ];
      var href = 'mailto:mantodelri7@gmail.com'
        + '?subject=' + encodeURIComponent('Roof job in Houston - ' + (name || 'new enquiry'))
        + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }
})();