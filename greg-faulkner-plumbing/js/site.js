/* Greg Faulkner Plumbing Company: menu, one-shot reveals, quote form. No network calls. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  /* one-shot reveal: each element animates once, the first time it enters the screen */
  var items = document.querySelectorAll('.reveal, .line');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* full-screen phone menu */
  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  if (btn && menu) {
    var set = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      root.classList.toggle('menu-open', open);
      if (open) { var a = menu.querySelector('a'); if (a) a.focus(); }
    };
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    menu.querySelector('.menu__close').addEventListener('click', function () { set(false); btn.focus(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 980 && !menu.hidden) set(false); });
  }

  /* quote form: demo only, the page stays put */
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }
})();
