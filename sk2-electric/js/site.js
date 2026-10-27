/* SK2: menu, one-shot ticks as you scroll, scroll checklist rail, demo form */
(function () {
  var d = document, html = d.documentElement;
  html.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero: one-shot entrance once fonts are in (or after a short wait)
  var go = function () { html.classList.add('ready'); };
  if (reduce) go(); else { (d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(go); }); setTimeout(go, 1200); }

  // header shadow
  var hdr = d.getElementById('hdr');
  var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // full-screen menu
  var btn = d.getElementById('burger'), menu = d.getElementById('menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.burger__lbl').textContent = open ? 'Close' : 'Menu';
    menu.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
    html.classList.toggle('menu-open', open);
    if (open) { var a = menu.querySelector('a'); if (a) a.focus(); }
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

  // stagger ticks inside lists
  d.querySelectorAll('.sched, .clist, .checks, .lines').forEach(function (list) {
    list.querySelectorAll('[data-tick]').forEach(function (el, i) { el.style.setProperty('--d', (i * 0.09).toFixed(2) + 's'); });
  });

  // one-shot: tick when seen, never untick
  var ticks = d.querySelectorAll('[data-tick]');
  if (reduce || !('IntersectionObserver' in window)) {
    ticks.forEach(function (el) { el.classList.add('on'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.35 });
    ticks.forEach(function (el) { io.observe(el); });
  }

  // reveal blocks (one shot)
  var rv = d.querySelectorAll('.board, .polaroid, .door, .checks, .panels__mast, .panels__disc, .sheet, .oneline, .wo, .fire__quote');
  rv.forEach(function (el) { el.setAttribute('data-rv', ''); });
  if (reduce || !('IntersectionObserver' in window)) { rv.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io2.observe(el); });
  }

  // checklist rail: a section is ticked once you've scrolled into it; menu boxes mirror it
  var rail = d.getElementById('rail');
  var secs = Array.prototype.slice.call(d.querySelectorAll('main > section[id]'));
  function railUpdate() {
    var y = window.scrollY + window.innerHeight * 0.45, cur = null;
    secs.forEach(function (s) {
      if (s.offsetTop <= y) {
        cur = s.id;
        var li = rail.querySelector('[data-for="' + s.id + '"]');
        if (li && !li.classList.contains('on')) { li.classList.add('on'); li.querySelector('.box').classList.add('on'); }
        var m = menu.querySelector('a[href="#' + s.id + '"] .box'); if (m) m.classList.add('done');
      }
    });
    rail.querySelectorAll('li').forEach(function (li) { li.classList.toggle('now', li.getAttribute('data-for') === cur); });
  }
  window.addEventListener('scroll', railUpdate, { passive: true }); window.addEventListener('resize', railUpdate); railUpdate();

  // demo form: stays on the page
  var f = d.getElementById('quote');
  if (f) f.addEventListener('submit', function (e) { e.preventDefault(); });

  var yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
