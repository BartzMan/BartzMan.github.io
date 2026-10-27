/* Rose Roofing & Repair - rosette reveals, pitch switcher, petal form, ridge progress */
(function () {
  'use strict';
  var d = document, R = d.documentElement;
  R.classList.add('rr-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* count-up for the rating seal (one-shot) */
  function countUp(el) {
    var num = el.querySelector('.rr-num'); if (!num) return;
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { num.textContent = target.toFixed(1); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      num.textContent = (target * e).toFixed(1);
      if (p < 1) requestAnimationFrame(step);
    }
    num.textContent = '0.0';
    requestAnimationFrame(step);
  }
  function fire(el) {
    if (el.classList.contains('is-in')) return;
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) countUp(el);
  }

  /* one-shot reveals */
  var els = [].slice.call(d.querySelectorAll('[data-rr]'));
  /* sweep: anything whose top has crossed 90% of the viewport (or was scrolled past) fires once */
  var pending = els.slice(), ticking = false;
  function sweep() {
    ticking = false;
    var line = window.innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < line) { fire(el); return false; }
      return true;
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }
  if (reduce) { els.forEach(fire); } else {
    sweep();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', sweep);
  }
  /* ridge progress */
  var bar = d.querySelector('.rr-progress span');
  function prog() {
    if (!bar) return;
    var h = R.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
  }
  window.addEventListener('scroll', prog, { passive: true });
  prog();

  /* phone sheet */
  var burger = d.querySelector('.rr-burger'), sheet = d.getElementById('rr-sheet');
  function setSheet(open) {
    sheet.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setSheet(false); burger.focus(); } });
  }

  /* the pitch: tap a step, the photo and the rose petal follow */
  var steps = [].slice.call(d.querySelectorAll('.rr-step'));
  var frames = [].slice.call(d.querySelectorAll('.rr-frame'));
  var stepPetals = [].slice.call(d.querySelectorAll('.rr-qrose--steps .rr-q'));
  var big = d.querySelector('.rr-pitch__big');
  function setStep(i) {
    steps.forEach(function (s, j) { s.setAttribute('aria-pressed', i === j ? 'true' : 'false'); });
    frames.forEach(function (f, j) { f.classList.toggle('is-on', i === j); });
    stepPetals.forEach(function (p, j) { p.classList.toggle('is-on', j <= i); });
    if (big) big.textContent = '0' + (i + 1);
  }
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  steps.forEach(function (s, i) {
    s.addEventListener('click', function () { setStep(i); });
    if (canHover) s.addEventListener('mouseenter', function () { setStep(i); });
  });
  if (steps.length) setStep(0);

  /* finished roofs: tap to open the caption on touch */
  [].slice.call(d.querySelectorAll('.rr-shot')).forEach(function (f) {
    f.addEventListener('click', function () { f.classList.toggle('is-open'); });
  });

  /* form: one petal per filled field */
  var form = d.getElementById('rr-form');
  if (form) {
    var petals = [].slice.call(form.querySelectorAll('.rr-qrose--form .rr-q'));
    [].slice.call(form.querySelectorAll('input[data-petal],textarea[data-petal]')).forEach(function (f) {
      f.addEventListener('input', function () {
        var p = petals[+f.getAttribute('data-petal')];
        if (p) p.classList.toggle('is-on', f.value.trim() !== '' && f.checkValidity());
      });
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
})();
