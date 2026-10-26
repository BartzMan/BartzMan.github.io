(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* phone menu sheet */
  var sheet = document.getElementById('sheet');
  var openBtn = document.querySelector('.hdr .burger');
  function setSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle('open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = sheet.querySelector('[data-close]'); if (c) c.focus(); }
    else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setSheet(true); });
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('nav a')) setSheet(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) setSheet(false); });
  }

  /* rope pays out with scroll: one CSS variable, transform only */
  var payout = document.querySelector('.payout');
  var tip = document.querySelector('.payout-tip');
  var bar = document.querySelector('.hdr-progress');
  var ticking = false;
  function progress() {
    ticking = false;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var v = p.toFixed(4);
    if (payout) payout.style.setProperty('--p', v);
    if (tip) tip.style.setProperty('--p', v);
    if (bar) bar.style.setProperty('--p', v);
  }
  if (!reduce) {
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
    window.addEventListener('resize', progress);
  }
  progress();

  /* reveals + lowered logs: each runs once */
  var targets = document.querySelectorAll('[data-r], .lower, .hero, .rig-photo');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in', 'is-down'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.classList.contains('lower')) en.target.classList.add('is-down');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* quote form: no backend in the demo */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }
})();
