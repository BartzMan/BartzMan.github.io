/* Nice and Fast: fast lane behaviour. Vanilla JS, no libraries. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- header solid on scroll, hero photo drift, skyline parallax ---------- */
  var bar = $('#top-bar'), heroImg = $('#heroImg'), sky = $('#sky');
  var skyL = $$('svg', sky);
  var race = $('#race'), pin = $('#racePin'), track = $('#track'), roadI = $('.ln-road i'), van = $('.ln-van');
  var stages = $$('.stg'), hand = $('#raceHand'), now = $('#raceNow');
  var names = ['Call', 'Look', 'Open up', 'Cover', 'Finish'];
  var ticking = false;
  function mobile() { return window.innerWidth <= 760; }

  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    bar.classList.toggle('solid', y > 40);
    if (heroImg && !reduce && y < vh) heroImg.style.transform = 'scale(1.06) translate3d(' + (-y * 0.05).toFixed(1) + 'px,' + (y * 0.06).toFixed(1) + 'px,0)';
    if (sky && !reduce) {
      var r = sky.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var t = (vh - r.top) / (vh + r.height);
        skyL.forEach(function (s, i) { s.style.transform = 'translate3d(' + (-(t * (i + 1) * 9)).toFixed(2) + '%,0,0)'; });
      }
    }
    if (race && track && !mobile()) {
      var rr = race.getBoundingClientRect();
      var dist0 = Math.max(0, track.scrollWidth - window.innerWidth);
      var p = clamp(-rr.top / Math.max(1, rr.height - vh), 0, 1);
      var dist = Math.max(0, track.scrollWidth - window.innerWidth);
      race.style.setProperty('--dist', Math.round(dist + 120) + 'px');
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      pin.parentNode.style.setProperty('--p', p.toFixed(4));
      var idx = Math.min(stages.length - 1, Math.floor(p * stages.length * 0.999));
      stages.forEach(function (s, i) { s.classList.toggle('on', i <= idx); });
      now.textContent = names[idx];
      hand.style.transform = 'rotate(' + (p * 1080).toFixed(1) + 'deg)';
    } else if (race && track) {
      track.style.transform = '';
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  frame();

  /* mobile: light up the stage that is on screen */
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (mobile() && e.isIntersecting) { stages.forEach(function (s) { s.classList.remove('on'); }); e.target.classList.add('on'); now.textContent = names[stages.indexOf(e.target)]; } });
    }, { threshold: 0.6 });
    stages.forEach(function (s) { so.observe(s); });
  }

  /* ---------- reveal ---------- */
  var rvs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rvs.forEach(function (n) { io.observe(n); });
  } else { rvs.forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- lanes: open one ---------- */
  $$('.lane').forEach(function (l) {
    var b = $('.lane-btn', l);
    b.addEventListener('click', function () {
      var o = l.classList.toggle('open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
      $('span', b).textContent = o ? 'Close' : 'More';
    });
  });

  /* ---------- lightbox ---------- */
  var tiles = $$('.ln-tile'), lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), cur = 0, lastFocus = null;
  function show(i) {
    cur = (i + tiles.length) % tiles.length;
    var t = tiles[cur];
    lbImg.src = t.getAttribute('data-src'); lbImg.alt = t.getAttribute('data-alt') || '';
    lbCap.textContent = t.getAttribute('data-cap');
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('#lbX').focus(); }
  function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lbImg.src = ''; if (lastFocus) lastFocus.focus(); }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { openLb(i); }); });
  $('#lbX').addEventListener('click', closeLb);
  $('#lbP').addEventListener('click', function () { show(cur - 1); });
  $('#lbN').addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'ArrowLeft') show(cur - 1);
  });

  /* ---------- phone menu ---------- */
  var sheet = $('#sheet'), burger = $('#burger');
  function openSheet(o) {
    sheet.classList.toggle('open', o);
    burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    sheet.setAttribute('aria-hidden', o ? 'false' : 'true');
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) $('#closeSheet').focus(); else burger.focus();
  }
  sheet.setAttribute('aria-hidden', 'true');
  burger.addEventListener('click', function () { openSheet(true); });
  $('#closeSheet').addEventListener('click', function () { openSheet(false); });
  $$('a', sheet).forEach(function (a) { a.addEventListener('click', function () { openSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) openSheet(false); });

  /* ---------- quote form (preview) ---------- */
  $('#quote').addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = $('#ok'); ok.hidden = false;
    ok.textContent = 'Preview: on your live website, this request would be sent straight to your email.';
  });
})();
