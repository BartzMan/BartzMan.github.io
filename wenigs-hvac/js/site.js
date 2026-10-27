(function () {
  var doc = document.documentElement;

  /* one-shot reveals: each element animates in once, then the observer forgets it */
  var items = document.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* service links prefill the request */
  var form = document.getElementById('quote-form');
  var details = document.getElementById('q-details');
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (details && !details.value.trim()) details.value = link.dataset.service + ': ';
    });
  });

  /* demo form: nothing leaves the page, the owner sees what the live site would do */
  if (form) {
    var status = form.querySelector('.wh-form-status');
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
    window.addEventListener('resize', function () { if (window.innerWidth > 980 && !sheet.hidden) set(false); });
  }
})();
