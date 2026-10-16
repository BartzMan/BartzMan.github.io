/* ASJ Electric — CEILING PLAN
   Behaviour: menu sheet, sticky call/text bar, scroll-lit can symbols, mailto form.
   Everything degrades: with JS off the page is complete and readable. */
(function () {
  'use strict';

  var motion = window.matchMedia('(prefers-reduced-motion: no-preference)');

  /* ---------- full-screen menu sheet ---------- */
  var burger = document.querySelector('.rcp-burger');
  var sheet = document.getElementById('rcp-sheet');
  var closeBtn = sheet ? sheet.querySelector('.rcp-sheet__close') : null;

  function openSheet() {
    if (!sheet) return;
    sheet.hidden = false;
    document.body.classList.add('rcp-lock-scroll');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    if (closeBtn) closeBtn.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    document.body.classList.remove('rcp-lock-scroll');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    window.setTimeout(function () {
      if (!sheet.classList.contains('is-open')) sheet.hidden = true;
    }, 230);
    burger.focus();
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      if (sheet.classList.contains('is-open')) { closeSheet(); } else { openSheet(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeSheet(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.classList.contains('is-open')) { closeSheet(); }
    });
  }

  /* ---------- sticky call / text bar (phones): on after the hero, off at the footer ---------- */
  var bar = document.querySelector('.rcp-callbar');
  var hero = document.querySelector('.rcp-hero');
  var foot = document.querySelector('.rcp-foot');
  if (bar && hero && foot && 'IntersectionObserver' in window) {
    var past = false, atFoot = false;
    var sync = function () { bar.classList.toggle('is-on', past && !atFoot); };
    new IntersectionObserver(function (e) {
      past = e[0].boundingClientRect.bottom < 0;
      sync();
    }, { threshold: 0 }).observe(hero);
    new IntersectionObserver(function (e) {
      atFoot = e[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(foot);
  }

  /* ---------- the plan: can circles light up warm, one by one ---------- */
  var plan = document.querySelector('.rcp-plan');
  if (plan && motion.matches) {
    var cans = Array.prototype.slice.call(plan.querySelectorAll('.rcp-can'));
    plan.classList.add('rcp-plan--armed');
    if ('IntersectionObserver' in window) {
      var lit = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || lit) return;
          lit = true;
          cans.forEach(function (c, i) {
            window.setTimeout(function () { c.classList.add('rcp-can--on'); }, i * 170);
          });
          io.disconnect();
        });
      }, { threshold: 0.35 });
      io.observe(plan);
    } else {
      cans.forEach(function (c) { c.classList.add('rcp-can--on'); });
    }
  }

  /* ---------- contact form: hand off to the visitor's own mail app ---------- */
  var form = document.getElementById('asj-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var lines = [
        'Name: ' + get('f-name'),
        'Reply to: ' + get('f-email'),
        'Part of town: ' + get('f-town'),
        'What is needed: ' + get('f-need'),
        '',
        'Details:',
        get('f-note')
      ];
      var href = 'mailto:sharonscar@verizon.net' +
        '?subject=' + encodeURIComponent('Ceiling job in Tampa') +
        '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
    });
  }

  /* ---------- smooth scrolling scoped to in-page anchors only ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var t = document.getElementById(id);
    if (!t) return;
    e.preventDefault();
    if (motion.matches) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else { t.scrollIntoView(); }
  });
}());