(function () {
  'use strict';
  var doc = document;

  /* ---- phone menu sheet ---- */
  var burger = doc.querySelector('.ik-burger');
  var sheet = doc.getElementById('ik-sheet');
  var lastFocus = null;
  function focusables() {
    return sheet.querySelectorAll('a[href], button:not([disabled])');
  }
  function openSheet() {
    lastFocus = doc.activeElement;
    sheet.hidden = false;
    doc.body.classList.add('ik-locked');
    burger.setAttribute('aria-expanded', 'true');
    var x = sheet.querySelector('.ik-sheet__x');
    if (x) x.focus();
  }
  function closeSheet(restore) {
    sheet.hidden = true;
    doc.body.classList.remove('ik-locked');
    burger.setAttribute('aria-expanded', 'false');
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  if (burger && sheet) {
    burger.addEventListener('click', openSheet);
    sheet.querySelector('.ik-sheet__x').addEventListener('click', function () { closeSheet(); });
    sheet.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a) closeSheet(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- smooth scroll only for in-page anchor clicks ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var t = id && doc.getElementById(id);
    if (!t) return;
    e.preventDefault();
    var head = doc.querySelector('.ik-top');
    var off = head ? head.offsetHeight + 10 : 0;
    var y = t.getBoundingClientRect().top + window.pageYOffset - off;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
    t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });

  /* ---- reveal: anything at or above the fold line is shown, so fast scrolls never leave gaps ---- */
  var items = [].slice.call(doc.querySelectorAll('[data-reveal]'));
  function check() {
    var limit = window.innerHeight * 0.94;
    items = items.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
      return true;
    });
    if (!items.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; check(); });
  }
  if (items.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
  }

  /* ---- email form: opens the visitor's own mail app ---- */
  var form = doc.getElementById('ik-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        'City or ZIP: ' + v('area'),
        'Job: ' + v('service'),
        '',
        v('message'),
        '',
        '(Photos attached if any.)'
      ].join('\n');
      var subject = 'Painting job: ' + v('service') + (v('area') ? ' in ' + v('area') : '');
      window.location.href = 'mailto:antpaints13@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
