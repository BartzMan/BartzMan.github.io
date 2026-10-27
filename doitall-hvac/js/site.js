(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* one-shot reveals: each element animates once, then is forgotten */
  var items = document.querySelectorAll('[data-reveal],[data-once]');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('rwy')) {
          /* approach lights switch on one after another, once */
          el.querySelectorAll('.rwy-lights i').forEach(function (l, i) { l.style.transitionDelay = (0.25 + i * 0.07) + 's'; });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* "Ask about this" links prefill the request */
  var details = document.getElementById('q-details');
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (details && !details.value.trim()) details.value = link.getAttribute('data-service') + ': ';
    });
  });

  /* demo form: stays on the page */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = form.querySelector('.fp-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
    });
  }

  /* full-screen phone menu */
  var btn = document.querySelector('.mm-btn'), sheet = document.getElementById('mm-sheet');
  if (btn && sheet) {
    var set = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheet.hidden = !open;
      doc.classList.toggle('mm-open', open);
      if (open) { var f = sheet.querySelector('.mm-links a'); if (f) f.focus(); }
    };
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    sheet.querySelector('.mm-close').addEventListener('click', function () { set(false); btn.focus(); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) set(false); });
  }
})();
