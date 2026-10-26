(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // phone menu: full-screen sheet
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  function closeSheet() {
    sheet.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.sr').textContent = 'Open menu';
    document.body.style.overflow = '';
  }
  if (btn && sheet) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { closeSheet(); return; }
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('.sr').textContent = 'Close menu';
      document.body.style.overflow = 'hidden';
    });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeSheet(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { closeSheet(); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) closeSheet(); });
  }

  // cut-in reveals: each section's blue frame draws once; each photo is cut in from primer grey once
  var targets = [].slice.call(document.querySelectorAll('.cut, .paint'));
  if (!reduce && 'IntersectionObserver' in window) {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0 && !el.closest('.hero')) return; // already on screen: leave as is
      if (el.closest('.hero')) {
        el.classList.add('pre');
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('go'); el.classList.remove('pre'); }); });
        return;
      }
      el.classList.add('pre');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('go');
        el.classList.remove('pre');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach(function (el) { if (el.classList.contains('pre')) io.observe(el); });
  }

  // scroll progress: the cut-in line under the header trim
  var bar = document.getElementById('progress');
  var dock = document.querySelector('.dock');
  var ticking = false;
  function paintBar() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (dock) dock.classList.toggle('on', window.scrollY > 420);
    ticking = false;
  }
  if (bar) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paintBar); } }, { passive: true });
    paintBar();
  }

  // quote form: no backend yet
  var form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
