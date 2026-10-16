(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- phone sheet ---- */
  var burger = document.querySelector('.mb-burger');
  var sheet = document.getElementById('mb-sheet');
  if (burger && sheet) {
    var closeBtn = sheet.querySelector('.mb-sheet__close');
    var focusables = function () {
      return Array.prototype.slice.call(sheet.querySelectorAll('a[href], button:not([disabled])'));
    };
    var open = function () {
      sheet.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mb-locked');
      closeBtn.focus();
    };
    var close = function (returnFocus) {
      sheet.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mb-locked');
      if (returnFocus !== false) burger.focus();
    };
    burger.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(); });
    sheet.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- reveal on scroll (content is visible without JS; CSS hides only under html.js) ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var show = function (el) { el.classList.add('is-in'); };
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px 12% 0px', threshold: 0 });
    items.forEach(function (el) { io.observe(el); });
    /* safety net: anything already scrolled past (fast scroll / jump links) is revealed too */
    var sweep = function () {
      var h = window.innerHeight;
      items.forEach(function (el) {
        if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < h) show(el);
      });
    };
    var t;
    window.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(sweep, 80); }, { passive: true });
    window.addEventListener('load', sweep);
  }

  /* ---- UTILITY / GENERATOR transfer switch ---- */
  var ts = document.querySelector('.mb-ts');
  if (ts) {
    var btn = ts.querySelector('.mb-ts__btn');
    var read = ts.querySelector('#mb-ts-read strong');
    var touched = false;
    var set = function (gen) {
      ts.setAttribute('data-src', gen ? 'g' : 'u');
      btn.setAttribute('aria-pressed', gen ? 'true' : 'false');
      read.textContent = gen ? 'Generator' : 'Utility';
    };
    btn.addEventListener('click', function () {
      touched = true;
      set(btn.getAttribute('aria-pressed') !== 'true');
    });
    /* flips once when scrolled into view; static under reduced motion */
    if (!reduce && 'IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          tio.disconnect();
          setTimeout(function () { if (!touched) set(true); }, 900);
        }
      }, { threshold: 0.6 });
      tio.observe(btn);
    }
  }

  /* ---- email form: opens the visitor's own email app ---- */
  var form = document.getElementById('mb-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var subject = 'Job request: ' + v('job');
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        'Part of town or ZIP: ' + v('area'),
        'Type of job: ' + v('job'),
        '',
        v('message')
      ].join('\n');
      window.location.href = 'mailto:arkelectricalservice@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
