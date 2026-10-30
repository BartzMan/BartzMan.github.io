(function () {
  var doc = document.documentElement;
  doc.classList.add('js');

  /* phone menu */
  var burger = document.querySelector('.ff-burger');
  var sheet = document.getElementById('ff-sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* reveal on scroll, staggered inside each section */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('section').forEach(function (sec) {
      sec.querySelectorAll('.rv').forEach(function (el, i) {
        if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', Math.min(i, 5));
      });
    });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* the build tracker: the house goes up as you scroll */
  var bar = document.querySelector('.ff-progress');
  var track = document.querySelector('.ff-track');
  var lbl = track ? track.querySelector('b') : null;
  var stages = [
    ['framing', 1], ['roofing', 3], ['finishes', 4], ['house', 5]
  ].map(function (s) { return [document.getElementById(s[0]), s[1]]; });
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) bar.style.setProperty('--p', p.toFixed(4));
    if (!track) return;
    var mid = window.innerHeight * 0.6, st = 0;
    stages.forEach(function (s) {
      if (s[0] && s[0].getBoundingClientRect().top < mid) st = s[1];
    });
    if (st === 3 && stages[1][0] && stages[1][0].getBoundingClientRect().top > window.innerHeight * 0.2) st = 2;
    track.className = 'ff-track' + (window.scrollY > 200 ? ' on' : '');
    for (var i = 1; i <= st; i++) track.classList.add('s' + st);
    if (lbl) lbl.textContent = '0' + st;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* service links pick the job in the form */
  var form = document.getElementById('ff-form');
  document.querySelectorAll('[data-job]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!form) return;
      var sel = form.elements.job, want = a.getAttribute('data-job');
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === want) sel.selectedIndex = i;
    });
  });

  /* quote form: the demo note is added by js/sc-form.js */
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* spring look-over checklist */
  var chk = document.getElementById('ff-check');
  if (chk) {
    var out = document.getElementById('ff-check-out');
    chk.addEventListener('change', function () {
      var n = chk.querySelectorAll('input:checked').length;
      out.textContent = n === 0 ? 'Nothing ticked yet.' : n + ' of 5 ticked. Each one is worth a closer look: send a photo from the side, and stay off any rail that moves.';
    });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
