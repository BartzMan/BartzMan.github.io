(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null, sunTick = false;

  /* ---- listeners that live on document/window: bound once, look elements up when they fire ---- */
  window.addEventListener('scroll', function () {
    var nav = $('#nav'); if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    var sun = $('#sun');
    if (sun && !reduce && !sunTick) {
      sunTick = true;
      requestAnimationFrame(function () { sun.style.transform = 'translateY(' + Math.min(window.scrollY * .12, 80) + 'px)'; sunTick = false; });
    }
  }, { passive: true });
  function closeSubs(except) {
    $$('.has-sub').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open'); li.firstElementChild.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeSubs();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });

  /* ---- per-page wiring: runs on load and again after an in-place language swap ---- */
  function init() {
    var nav = $('#nav'), burger = $('#burger');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    if (burger) burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
    });
    $$('.has-sub > button').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var li = btn.parentNode, open = !li.classList.contains('open');
        closeSubs(li); li.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
        e.stopPropagation();
      });
    });
    $$('#menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav) nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });

    /* reveal on scroll */
    if (io) io.disconnect();
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in'); io.unobserve(e.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
      $$('.reveal').forEach(function (el) { io.observe(el); });
    } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

    /* lightbox */
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

    /* estimate form: opens a text message to Osorio with the details filled in */
    var form = $('#quote');
    if (form) {
      var toast = $('#toast'), D = form.dataset;
      var pre = new URLSearchParams(location.search).get('s');
      if (pre) { var pc = $('input[data-slug="' + pre.replace(/[^a-z0-9-]/gi, '') + '"]', form); if (pc) pc.checked = true; }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var needs = $$('input[name=need]:checked', form).map(function (i) { return i.value; });
        var bad = false;
        ['name', 'phone'].forEach(function (k) {
          var el = form[k], empty = !el.value.trim(); el.classList.toggle('field-err', empty); if (empty) bad = true;
        });
        toast.className = 'toast show' + (bad ? ' err' : '');
        if (bad) { toast.textContent = D.err; return; }
        toast.textContent = D.ok;
        var msg = form.msg.value.trim();
        var body = D.hello + '\nJob: ' + (needs.join(', ') || 'a tree, palm or yard job') + '\nWhere: ' + form.city.value +
          '\nName: ' + form.name.value.trim() + '\nPhone: ' + form.phone.value.trim() + (msg ? '\nDetails: ' + msg : '');
        window.location.href = 'sms:' + D.phone + '?body=' + encodeURIComponent(body);
      });
    }

    var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  }

  init();
})();
