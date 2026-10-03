(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '16616024323';

  /* ---- nav ---- */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 10); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  if (burger) burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  function closeSubs(except) {
    $$('.has-sub').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false');
    });
  }
  $$('.has-sub > button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.parentNode, open = !li.classList.contains('open');
      closeSubs(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      e.stopPropagation();
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.has-sub')) closeSubs(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (nav) nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- reveal ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* ---- hero sun parallax ---- */
  var sun = $('#sun'), tick = false;
  if (sun && !reduce) {
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { sun.style.transform = 'translateY(' + Math.min(window.scrollY * .12, 80) + 'px)'; tick = false; });
    }, { passive: true });
  }

  /* ---- lightbox ---- */
  var lb = $('#lb');
  if (lb) {
    var lbImg = $('#lb-img'), lbCap = $('#lb-cap'), shots = $$('[data-lb]'), cur = 0;
    var show = function (i) {
      cur = (i + shots.length) % shots.length; var s = shots[cur];
      lbImg.src = s.dataset.full; lbImg.alt = s.dataset.alt; lbCap.textContent = s.dataset.cap;
      if (!lb.open && lb.showModal) lb.showModal();
    };
    shots.forEach(function (s, i) { s.addEventListener('click', function () { show(i); }); });
    $('#lb-close').addEventListener('click', function () { lb.close(); });
    $('#lb-prev').addEventListener('click', function () { show(cur - 1); });
    $('#lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  }

  /* ---- estimate form: opens WhatsApp with the details filled in (no email address on file) ---- */
  var form = $('#quote');
  if (form) {
    var toast = $('#toast'), D = form.dataset;
    var pre = new URLSearchParams(location.search).get('s');
    if (pre) { var pc = $('input[data-slug="' + pre.replace(/[^a-z0-9-]/gi, '') + '"]', form); if (pc) pc.checked = true; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var needs = $$('input[name=need]:checked', form).map(function (i) { return i.value; });
      var bad = false;
      ['name', 'where'].forEach(function (k) {
        var el = form[k], empty = !el.value.trim(); el.classList.toggle('field-err', empty); if (empty) bad = true;
      });
      toast.className = 'toast show' + (bad ? ' err' : '');
      if (bad) { toast.textContent = D.err; return; }
      toast.textContent = D.ok;
      var msg = form.msg.value.trim();
      var body = D.hello + '\n' + D.job + ': ' + (needs.join(', ') || D.anyjob) + '\n' + D.where + ': ' + form.where.value.trim() +
        '\n' + D.name + ': ' + form.name.value.trim() + (msg ? '\n' + D.details + ': ' + msg : '');
      window.location.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(body);
    });
  }

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
