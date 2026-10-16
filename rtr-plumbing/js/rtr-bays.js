/* RTR Plumbing: roll-up bay doors, office-door menu, builder form (mailto). */
(function () {
  'use strict';

  /* ---- roll-up doors ----
     The doors only exist with JS + motion allowed (see CSS). A bay opens as soon as its top passes
     82% of the viewport, OR whenever it is already above the viewport (anchor jumps, fast flicks,
     reloads mid-page), so content is never left behind a closed door. */
  var bays = [].slice.call(document.querySelectorAll('.bay-sec'));
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function openBay(s) { s.classList.add('is-open'); }
  function check() {
    var limit = window.innerHeight * 0.82;
    var left = 0;
    bays.forEach(function (s) {
      if (s.classList.contains('is-open')) return;
      if (s.getBoundingClientRect().top < limit) openBay(s); else left++;
    });
    if (!left) {
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
  if (reduce || !('IntersectionObserver' in window)) {
    bays.forEach(openBay);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { openBay(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0 });
    bays.forEach(function (s) { io.observe(s); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', check);
    window.addEventListener('load', check);
    window.addEventListener('beforeprint', function () { bays.forEach(openBay); });
    check();
  }

  /* ---- office-door menu sheet ---- */
  var sheet = document.getElementById('bay-sheet');
  var burger = document.querySelector('.bay-burger');
  if (sheet && burger) {
    var closeBtn = sheet.querySelector('.bay-sheet__close');
    var focusables = function () {
      return [].slice.call(sheet.querySelectorAll('a[href],button:not([disabled])'));
    };
    var openSheet = function () {
      sheet.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('bay-locked');
      closeBtn.focus();
    };
    var closeSheet = function (back) {
      sheet.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('bay-locked');
      if (back !== false) burger.focus();
    };
    burger.addEventListener('click', openSheet);
    closeBtn.addEventListener('click', function () { closeSheet(); });
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) { closeSheet(); return; }
      var a = e.target.closest('a[href^="#"]');
      if (a) closeSheet(false);
    });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(); return; }
      if (e.key === 'Tab') {
        var f = focusables(), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (!sheet.hidden && window.innerWidth >= 1220) closeSheet(false); });
  }

  /* ---- builder form: opens the visitor's own email app ---- */
  var form = document.querySelector('.bay-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var type = v('type'), city = v('city');
      var subject = 'New construction project: ' + type + (city ? ' in ' + city : '');
      var lines = [
        'Name: ' + v('name'),
        'Company: ' + v('company'),
        'Reply to: ' + v('reply'),
        'Project type: ' + type,
        'Number of homes or units: ' + v('units'),
        'Project city: ' + city,
        'Expected start: ' + v('start'),
        '',
        v('notes'),
        '',
        '(Plans attached / to follow)'
      ];
      window.location.href = 'mailto:rtrplumbingllc@gmail.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
