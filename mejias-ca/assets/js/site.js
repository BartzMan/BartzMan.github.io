(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '16616024323';
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
    var lang = e.target.closest('a.lang');
    if (lang && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); if (!lang.classList.contains('on')) swapLang(lang.href, true); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });
  window.addEventListener('popstate', function () { swapLang(location.href, false); });

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

    /* estimate form: opens WhatsApp with the details filled in */
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
  }

  /* ---- English <-> Español: swap the text in place, no reload, keep the scroll position.
          Each language keeps its own URL (so search engines index both), and we fall back to a normal
          page load if anything goes wrong (including file:// previews, where fetch is blocked). ---- */
  var HEAD_SWAP = ['link[rel="icon"]', 'link[rel="canonical"]', 'link[rel="alternate"]', 'meta[name="description"]', 'meta[property^="og:"]', 'script[type="application/ld+json"]'];
  var swapping = false;
  function swapLang(url, push) {
    if (swapping) return;
    var sameOrigin = false;
    try { sameOrigin = new URL(url, location.href).origin === location.origin; } catch (e) { }
    if (!sameOrigin || location.protocol === 'file:' || !window.fetch || !window.DOMParser) { location.href = url; return; }
    swapping = true;
    var y = window.scrollY, body = document.body;
    var fadeOut = reduce ? Promise.resolve() : new Promise(function (r) {
      body.style.transition = 'opacity .14s ease'; body.style.opacity = '0'; setTimeout(r, 150);
    });
    var load = fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status); return r.text();
    });
    Promise.all([load, fadeOut]).then(function (res) {
      var doc = new DOMParser().parseFromString(res[0], 'text/html');
      if (!doc.body || !$('main', doc)) throw new Error('bad page');
      if (push) history.pushState({}, '', url);          // first, so relative links in the new text resolve against the new URL
      document.title = doc.title;
      document.documentElement.lang = doc.documentElement.lang;
      HEAD_SWAP.forEach(function (sel) {
        $$(sel).forEach(function (n) { n.remove(); });
        $$(sel, doc).forEach(function (n) { document.head.appendChild(document.importNode(n, true)); });
      });
      body.innerHTML = doc.body.innerHTML;
      window.scrollTo(0, y);
      init();
      var l = $('.nav-cta .lang.on'); if (l) l.focus({ preventScroll: true });
      body.style.opacity = '1';
      setTimeout(function () { body.style.transition = ''; body.style.opacity = ''; }, 200);
      swapping = false;
    }).catch(function () { swapping = false; location.href = url; });
  }

  init();
})();
