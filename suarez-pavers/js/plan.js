/* The plan view: concept interactions (site-plan zones, section layers) */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1. A-1 site plan: tap a lettered paver (or a zone) to open that part of the work */
  var plan = document.querySelector('.plan-svg');
  var pvs = $$('.pv');
  function zone(z) {
    pvs.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-zone') === z ? 'true' : 'false'); });
    $$('.zone').forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-zone') === z); });
    if (plan) plan.classList.add('has-sel');
    $$('.det').forEach(function (d) { d.hidden = d.getAttribute('data-det') !== z; });
  }
  pvs.forEach(function (b) { b.addEventListener('click', function () { zone(b.getAttribute('data-zone')); }); });
  $$('.zone').forEach(function (g) {
    g.style.cursor = 'pointer';
    g.addEventListener('click', function () { zone(g.getAttribute('data-zone')); });
  });
  zone('walk');

  /* 2. S-1 section: tap a layer to see what it does and what to watch for */
  var xs = document.querySelector('.xsec-svg');
  var lyb = $$('.lyb');
  function layer(l) {
    lyb.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ly') === l ? 'true' : 'false'); });
    $$('.ly').forEach(function (g) { g.classList.toggle('is-on', g.getAttribute('data-ly') === l); });
    if (xs) xs.classList.add('has-sel');
    $$('.xn').forEach(function (n) { n.hidden = n.getAttribute('data-xn') !== l; });
  }
  lyb.forEach(function (b) { b.addEventListener('click', function () { layer(b.getAttribute('data-ly')); }); });
  $$('.ly').forEach(function (g) {
    g.style.cursor = 'pointer';
    g.addEventListener('click', function () { if (g.getAttribute('data-ly') !== 'soil') layer(g.getAttribute('data-ly')); });
  });

  /* the section builds itself, layer by layer, when it scrolls into view */
  if (xs && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var lys = $$('.ly', xs);
    lys.forEach(function (g, i) { g.style.transform = 'translateY(-40px)'; g.style.opacity = '0'; g.style.transition = 'transform .6s ' + (i * 0.16) + 's cubic-bezier(.2,.7,.2,1), opacity .6s ' + (i * 0.16) + 's'; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          lys.forEach(function (g) { g.style.transform = ''; g.style.opacity = ''; });
          setTimeout(function () { lys.forEach(function (g) { g.style.transition = ''; }); layer('pavers'); }, 1400);
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(xs);
  } else { layer('pavers'); }

  /* "Ask about ..." links note the service in the quote form */
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = document.querySelector('form[data-kit-form] textarea');
      if (d && !d.value) d.value = 'About: ' + a.getAttribute('data-service') + '. ';
    });
  });
})();
