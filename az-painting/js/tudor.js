/* AZ Painting & Home Improvement - behaviour. Vanilla JS. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* reveal */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add('in'); }); }

  /* header, timber progress beam, banner parallax */
  var head = $('#head'), beam = $('.az-beam'), limg = $('#localimg'), lsec = limg && limg.parentNode;
  function onScroll() {
    var y = window.scrollY || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    beam.style.setProperty('--p', Math.min(1, y / max).toFixed(4));
    head.classList.toggle('is-solid', y > 40);
    if (limg && !reduce) {
      var r = lsec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var t = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        limg.style.transform = 'translate3d(0,' + (t * -40).toFixed(1) + 'px,0)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* phone menu */
  var burger = $('#burger'), sheet = $('#sheet');
  function setMenu(open) {
    sheet.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!sheet.classList.contains('open')); });
  $$('[data-close]', sheet).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* light glint follows the pointer across the leaded windows */
  $$('.az-win').forEach(function (w) {
    var g = $('.glint', w);
    if (!g) return;
    w.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = w.getBoundingClientRect();
      g.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      g.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });

  /* ---- colour fan deck ---- */
  var fan = $('#fan'), rivet = $('#rivet'), chips = $$('.az-chip');
  var cmp = $('#cmp'), selname = $('#selname'), selhex = $('#selhex');
  function setOpen(o) {
    fan.classList.toggle('open', o);
    rivet.setAttribute('aria-expanded', o ? 'true' : 'false');
    rivet.textContent = o ? 'Close' : 'Open';
    chips.forEach(function (c) { c.tabIndex = o ? 0 : -1; });
    if (o) selhex.textContent = 'Tap a swatch, then drag the wipe';
  }
  function pick(c) {
    chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
    cmp.style.setProperty('--wall', c.getAttribute('data-c'));
    selname.textContent = c.getAttribute('data-n');
    selhex.textContent = c.getAttribute('data-c').toUpperCase() + ' · wall colour preview';
  }
  rivet.addEventListener('click', function () { setOpen(!fan.classList.contains('open')); });
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      if (!fan.classList.contains('open')) { setOpen(true); return; }
      pick(c);
    });
  });
  setOpen(false);
  /* open the deck the first time it scrolls into view */
  if ('IntersectionObserver' in window && !reduce) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { setTimeout(function () { setOpen(true); }, 500); fio.disconnect(); } });
    }, { threshold: 0.5 });
    fio.observe(fan);
  }

  /* ---- wall wipe ---- */
  var wipe = $('#wipe');
  function setWipe() { cmp.style.setProperty('--pos', wipe.value + '%'); }
  wipe.addEventListener('input', setWipe);
  setWipe();
  if (!reduce && 'IntersectionObserver' in window) {
    var wio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        wio.disconnect();
        var t0 = performance.now(), touched = false;
        wipe.addEventListener('pointerdown', function () { touched = true; }, { once: true });
        (function demo(t) {
          if (touched) return;
          var k = (t - t0) / 2400;
          if (k > 1) { wipe.value = 55; setWipe(); return; }
          wipe.value = 55 + Math.sin(k * Math.PI * 2) * 28 * (1 - k * .3);
          setWipe();
          requestAnimationFrame(demo);
        })(t0);
      });
    }, { threshold: 0.6 });
    wio.observe(cmp);
  }

  /* ---- gallery lightbox ---- */
  var lb = $('#lb'), lbimg = $('#lbimg'), lbcap = $('#lbcap');
  var items = $$('[data-lb]'), idx = 0;
  function openLb(i) {
    idx = (i + items.length) % items.length;
    var b = items[idx];
    lbimg.src = b.getAttribute('data-lb');
    lbimg.alt = $('img', b).alt;
    lbcap.textContent = b.getAttribute('data-cap');
    if (!lb.open) { if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); }
  }
  items.forEach(function (b, i) { b.addEventListener('click', function () { openLb(i); }); });
  $('.x', lb).addEventListener('click', function () { lb.close(); });
  $('.nx', lb).addEventListener('click', function () { openLb(idx + 1); });
  $('.pv', lb).addEventListener('click', function () { openLb(idx - 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') openLb(idx + 1);
    if (e.key === 'ArrowLeft') openLb(idx - 1);
  });

  /* ---- panels flip ---- */
  $$('[data-panel]').forEach(function (p) {
    var front = $('.front', p), back = $('.back', p);
    var ft = $('.tog', front), bt = $('.tog', back);
    function set(on) {
      p.classList.toggle('flip', on);
      front.setAttribute('aria-hidden', on ? 'true' : 'false');
      back.setAttribute('aria-hidden', on ? 'false' : 'true');
      ft.tabIndex = on ? -1 : 0; bt.tabIndex = on ? 0 : -1;
      ft.setAttribute('aria-expanded', on ? 'true' : 'false');
      (on ? bt : ft).focus({ preventScroll: true });
    }
    ft.addEventListener('click', function () { set(true); });
    bt.addEventListener('click', function () { set(false); });
  });

  /* form: preview only */
  $('#request').addEventListener('submit', function (e) { e.preventDefault(); });
})();
