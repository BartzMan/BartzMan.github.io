(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* full-screen menu */
  var btn = document.querySelector('.menu-btn'), sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var setOpen = function (open) {
      sheet.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.documentElement.classList.toggle('mm-open', open);
      if (open) closeBtn.focus(); else btn.focus({ preventScroll: true });
    };
    btn.addEventListener('click', function () { setOpen(true); });
    closeBtn.addEventListener('click', function () { setOpen(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) { sheet.hidden = true; btn.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('mm-open'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) setOpen(false); });
  }

  /* one-shot reveals */
  var els = document.querySelectorAll('.reveal, .map');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* dial readout counts up once with the needle */
  var num = document.querySelector('.dial-num');
  if (num && !reduce) {
    var start = null, from = -8, to = 70, dur = 2200, delay = 400;
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    var step = function (ts) {
      if (start === null) start = ts + delay;
      var t = Math.min(1, Math.max(0, (ts - start) / dur));
      var v = Math.round(from + (to - from) * ease(t));
      num.textContent = (v < 0 ? '\u2212' + Math.abs(v) : v) + '\u00b0';
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* scroll thermometer: the page warms from -8 to 70 */
  var rail = document.querySelector('.rail'), fill = rail && rail.querySelector('.rail-tube i'), label = rail && rail.querySelector('[data-temp]');
  if (rail) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      fill.style.setProperty('--p', (8 + p * 92).toFixed(1) + '%');
      var v = Math.round(-8 + p * 78);
      label.textContent = (v < 0 ? '\u2212' + Math.abs(v) : v) + '\u00b0';
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* service buttons prefill the request form */
  var form = document.getElementById('quote');
  document.querySelectorAll('[data-service]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!form) return;
      var d = form.elements.details;
      if (!d.value.trim()) d.value = 'About: ' + b.dataset.service + '\n';
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, reduce ? 0 : 600);
    });
  });

  /* demo quote form: on the live site this posts to the owner's inbox */
  if (form) {
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      msg.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
    });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
