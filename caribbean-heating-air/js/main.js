(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header + thermostat + phone progress bar + setting sun
  var hdr = document.querySelector('.hdr');
  var thermo = document.querySelector('.thermo');
  var tVal = document.getElementById('thermoVal');
  var tFill = document.getElementById('thermoFill');
  var tRead = document.querySelector('.thermo__read');
  var bar = document.getElementById('topbarFill');
  var sun = document.querySelector('.hero__sun');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || 0;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, y / max));
    if (hdr) hdr.classList.toggle('is-solid', y > 40);
    if (thermo) {
      thermo.classList.toggle('show', y > window.innerHeight * 0.5);
      var t = Math.round(95 - 23 * p);
      tVal.textContent = t;
      tFill.style.height = (100 - p * 70) + '%';
      tRead.style.color = p > 0.7 ? '#18C3BE' : (p > 0.35 ? '#FF3E8A' : '#FF8C3B');
    }
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (sun && !reduce && y < window.innerHeight * 1.2) sun.style.setProperty('--sink', (y * 0.22) + 'px');
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // phone menu sheet
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = sheet.querySelector('a'); if (f) f.focus(); }
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); burger.focus(); }
    });
  }

  // reveals, neon switch-on, line-set drawing
  var targets = document.querySelectorAll('.rv, [data-neon], .mt__sign, .nb__rail, .area__h');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in', 'on', 'drawn'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.classList.contains('rv')) el.classList.add('in');
        if (el.hasAttribute('data-neon') || el.classList.contains('mt__sign') || el.classList.contains('area__h')) {
          setTimeout(function () { el.classList.add('on'); }, 250);
        }
        if (el.classList.contains('nb__rail')) el.classList.add('drawn');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  }

  // quote form -> email app
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var err = document.getElementById('formErr');
      if (!String(d.get('name') || '').trim() || !String(d.get('reach') || '').trim()) {
        err.hidden = false; return;
      }
      err.hidden = true;
      var body = 'Name: ' + d.get('name') + '\nPhone or email: ' + d.get('reach') +
        '\nService: ' + d.get('service') + '\nTown: ' + (d.get('town') || '') +
        '\n\nWhat it is doing:\n' + (d.get('msg') || '');
      window.location.href = 'mailto:caribbeanheatingandairfl@gmail.com?subject=' +
        encodeURIComponent('AC request: ' + d.get('service')) + '&body=' + encodeURIComponent(body);
    });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
