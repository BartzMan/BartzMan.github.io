/* A&A Service Company / SERVICE CALL */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return [].slice.call((c || d).querySelectorAll(s)); }

  var rvs = $$('[data-rv]'), once = [];
  function onView(el, fn, at) { once.push({ el: el, fn: fn, at: at || 0.82 }); }
  function sweep() {
    var h = window.innerHeight;
    rvs = rvs.filter(function (el) {
      if (el.getBoundingClientRect().top < h * 0.9) { el.classList.add('rv-on'); return false; }
      return true;
    });
    once = once.filter(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.top < h * o.at && r.bottom > 0) { o.fn(); return false; }
      return true;
    });
  }

  function countUp(el, to, dec, ms, pad) {
    if (still) { el.textContent = pad ? String(to).padStart(pad, '0') : to.toFixed(dec); return; }
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / ms), v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = pad ? String(Math.round(v)).padStart(pad, '0') : v.toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* 1. hero: numbering machine rolls the ticket number, DISPATCHED stamp lands once */
  var hero = $('.tk-hero'), roll = $('.tk-roll');
  if (hero) {
    if (roll) countUp(roll, 427, 0, 1100, 4);
    requestAnimationFrame(function () { hero.classList.add('is-on'); });
  }

  /* 2. scope: each line's box ticks as it reaches the middle of the screen; the pinned photo follows */
  var lines = $$('.tk-line'), follow = $('.tk-follow');
  var fImg = follow ? $('img', follow) : null, fCode = follow ? $('.tk-follow-code', follow) : null;
  var current = -1;
  function bigSrc(img) {
    var set = (img.getAttribute('srcset') || '').split(',').map(function (s) { return s.trim().split(/\s+/)[0]; });
    return set[set.length - 1] || img.getAttribute('src');
  }
  function setActive(i) {
    if (i === current || !fImg) return;
    current = i;
    lines.forEach(function (l, j) { l.classList.toggle('is-active', j === i); });
    var li = lines[i], img = $('.tk-line-img', li);
    fImg.src = bigSrc(img);
    fImg.removeAttribute('srcset');
    fImg.width = img.getAttribute('width'); fImg.height = img.getAttribute('height');
    fCode.textContent = $('.tk-code', li).textContent;
    if (!still) { fImg.classList.remove('is-in'); void fImg.offsetWidth; fImg.classList.add('is-in'); }
  }
  lines.forEach(function (l) { onView(l, function () { l.classList.add('is-ticked'); }, 0.7); });
  function followScroll() {
    if (!follow || !lines.length) return;
    var mid = window.innerHeight * 0.5, best = 0;
    lines.forEach(function (l, i) { if (l.getBoundingClientRect().top < mid) best = i; });
    setActive(best);
  }

  /* 3. carbon copies: tear the top sheet off, it goes to the back of the pad */
  var pad = $('.tk-pad'), tear = $('.tk-tear'), read = $('.tk-tear-read');
  if (pad && tear) {
    var busy = false, n = 1, total = $$('.tk-copy', pad).length;
    var label = function () {
      var top = pad.lastElementChild;
      read.innerHTML = 'Copy ' + n + ' of ' + total + ' &middot; ' + top.getAttribute('data-cap');
    };
    /* the furnace copy (first in the markup) starts on top */
    $$('.tk-copy', pad).reverse().forEach(function (c) { pad.appendChild(c); });
    label();
    var flip = function () {
      if (busy) return;
      busy = true;
      var top = pad.lastElementChild;
      top.classList.add('is-torn');
      setTimeout(function () {
        pad.insertBefore(top, pad.firstElementChild);
        top.classList.remove('is-torn');
        n = n % total + 1;
        label();
        busy = false;
      }, still ? 0 : 480);
    };
    tear.addEventListener('click', flip);
    pad.addEventListener('click', flip);
  }

  /* 4. route: the street pans through the letters once */
  var route = $('.tk-route');
  if (route && !still) onView(route, function () { route.classList.add('is-on'); }, 0.75);

  /* 5. the form writes through to the carbon copy underneath */
  $$('[data-carbon]').forEach(function (f) {
    var out = $('[data-mirror="' + f.getAttribute('data-carbon') + '"]');
    if (!out) return;
    f.addEventListener('input', function () { out.textContent = f.value.trim() ? f.value.replace(/\s+/g, ' ') : ' '; });
  });

  /* 6. rating stamp counts up once */
  var cnt = $('.tk-count');
  if (cnt && !still) { cnt.textContent = '0.0'; onView(cnt, function () { countUp(cnt, 4.7, 1, 1300); }, 0.97); }

  /* phone sheet */
  var burger = $('.tk-burger'), sheet = $('#tk-sheet');
  if (burger && sheet) {
    var setSheet = function (open) {
      sheet.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      $('use', burger).setAttribute('href', open ? '#i-close' : '#i-menu');
      root.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { setSheet(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setSheet(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setSheet(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060 && !sheet.hidden) setSheet(false); });
  }

  /* request form: the publishing step wires delivery */
  var form = $('#quote');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });

  function tick() { sweep(); followScroll(); }
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });
  window.addEventListener('load', tick);
  tick();
})();
