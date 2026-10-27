/* Main Drain: camera-feed HUD (distance counter, timestamp), one-shot reveals, menu, quote form. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RUN_FT = 250;

  /* ---- HUD: distance in feet follows the scroll, timestamp like a camera overlay ---- */
  var ftEls = [].slice.call(document.querySelectorAll('[data-ft]'));
  var clockEls = [].slice.call(document.querySelectorAll('[data-clock]'));
  var rail = document.querySelector('.rail');
  var run = document.querySelector('.run');
  var cable = document.querySelector('.run__cable');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function stamp() {
    var d = new Date();
    return pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  var ticking = false;
  function update() {
    ticking = false;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    var ft = (p * RUN_FT).toFixed(1);
    while (ft.length < 6) ft = '0' + ft;
    for (var i = 0; i < ftEls.length; i++) ftEls[i].textContent = ft;
    if (rail) { rail.style.setProperty('--p', p.toFixed(4)); rail.classList.toggle('is-off', window.scrollY < window.innerHeight * 0.7); }
    var s = stamp();
    for (var j = 0; j < clockEls.length; j++) clockEls[j].textContent = s;
    if (run && cable && !reduce) {
      var r = run.getBoundingClientRect();
      var q = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      cable.style.setProperty('--cable', q.toFixed(4));
    }
  }
  /* chapter marks show the same distance the counter reads when that part of the page reaches the top */
  var marks = [].slice.call(document.querySelectorAll('[data-at]'));
  function markAll() {
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var hdr = (document.getElementById('hdr') || {}).offsetHeight || 0;
    marks.forEach(function (el) {
      var t = document.querySelector(el.getAttribute('data-at'));
      if (!t) return;
      var y = t.getBoundingClientRect().top + window.scrollY - hdr - 12;
      var v = Math.min(RUN_FT, Math.max(0, y / max * RUN_FT));
      var mode = el.getAttribute('data-fmt');
      if (mode === 'i') { var n = String(Math.round(v)); while (n.length < 3) n = '0' + n; el.textContent = n + ' FT'; return; }
      var f = v.toFixed(1); while (f.length < 6) f = '0' + f;
      el.textContent = mode === 'n' ? f : f + ' FT';
    });
  }
  window.addEventListener('load', markAll);
  window.addEventListener('resize', function () { clearTimeout(markAll.t); markAll.t = setTimeout(markAll, 200); });
  markAll();
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---- one-shot reveals ---- */
  var targets = document.querySelectorAll('.sec-head, .stop, .jetter__big, .jetter__cols, .mainline__copy, .area__head, .area__grid, .faq__list, .contact__copy, .monitor');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    [].forEach.call(targets, function (t) { t.classList.add('rv'); io.observe(t); });
    var main = document.querySelector('.mainline');
    if (main) {
      var io2 = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { main.classList.add('on'); io2.disconnect(); }
      }, { threshold: 0.28 });
      io2.observe(main);
    }
  } else {
    var m = document.querySelector('.mainline'); if (m) m.classList.add('on');
  }

  /* ---- full-screen menu (phones) ---- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 960 && !menu.hidden) setMenu(false); });
  }

  /* ---- quote form: wired to the real handler at launch ---- */
  var form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
