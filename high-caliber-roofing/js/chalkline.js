(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- tape-measure progress rail ---- */
  var ticking = false;
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    root.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(progress); }
  }, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* ---- chalk snaps + reveals ---- */
  var snaps = [].slice.call(document.querySelectorAll('.cl-snap'));
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal]'));
  function showAll() {
    snaps.forEach(function (s) { s.classList.add('is-snapped'); });
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  }
  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add(e.target.classList.contains('cl-snap') ? 'is-snapped' : 'is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px 240px 0px' });
    snaps.concat(reveals).forEach(function (el) { io.observe(el); });
    /* safety net: anything already above the viewport bottom is shown, even after a fast jump */
    var sweep = function () {
      var limit = window.innerHeight + 240;
      reveals.forEach(function (r) {
        if (!r.classList.contains('is-in') && r.getBoundingClientRect().top < limit) r.classList.add('is-in');
      });
      snaps.forEach(function (s) {
        if (!s.classList.contains('is-snapped') && s.getBoundingClientRect().top < limit) s.classList.add('is-snapped');
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('load', sweep);
    sweep();
  }

  /* ---- smooth anchor scrolling (scoped to clicks) ---- */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    ev.preventDefault();
    closeSheet(false);
    var head = document.querySelector('.cl-head');
    var y = t.getBoundingClientRect().top + window.scrollY - (head ? head.offsetHeight : 0) + 2;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ---- phone menu sheet ---- */
  var sheet = document.getElementById('cl-sheet');
  var burger = document.querySelector('.cl-burger');
  var closeBtn = sheet ? sheet.querySelector('.cl-sheet__close') : null;
  function focusables() {
    return [].slice.call(sheet.querySelectorAll('a[href], button'));
  }
  function openSheet() {
    sheet.hidden = false;
    document.body.classList.add('cl-locked');
    burger.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function closeSheet(refocus) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove('cl-locked');
    burger.setAttribute('aria-expanded', 'false');
    if (refocus !== false) burger.focus();
  }
  if (sheet && burger) {
    burger.addEventListener('click', openSheet);
    closeBtn.addEventListener('click', function () { closeSheet(true); });
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeSheet(true); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    sheet.querySelectorAll('a[href^="tel:"], a[href^="sms:"]').forEach(function (a) {
      a.addEventListener('click', function () { closeSheet(false); });
    });
  }

  /* ---- email form (mailto, nothing is sent from the site) ---- */
  var form = document.getElementById('cl-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var name = v('name');
      if (!name) { form.elements.name.focus(); return; }
      var body = [
        'Name: ' + name,
        'Phone: ' + (v('phone') || '-'),
        'Town: ' + v('town'),
        'Job: ' + v('job'),
        '',
        v('message') || '(no details yet)',
        '',
        'I can send photos of the roof by text.'
      ].join('\n');
      var subject = v('job') + ' - ' + name + ' (' + v('town') + ')';
      window.location.href = 'mailto:highcaliberroofing3@yahoo.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
