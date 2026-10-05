(function () {
  var b = document.querySelector('.mm-btn'), m = document.getElementById('mm-sheet');
  if (!b || !m) return;
  var hdr = b.closest('header') || document.querySelector('header');
  if (hdr && getComputedStyle(hdr).position === 'static') hdr.style.position = 'relative';
  var logo = hdr && hdr.querySelector('a');
  if (logo) b.style.color = getComputedStyle(logo).color;
  var h1 = document.querySelector('h1');
  if (h1) m.style.setProperty('--mm-font', getComputedStyle(h1).fontFamily);
  var cta = hdr && hdr.querySelector('a[href^="tel:"]');
  if (cta) { var r = getComputedStyle(cta).borderTopLeftRadius; if (r) m.style.setProperty('--mm-radius', r); }
  var set = function (o) {
    if (o && hdr) m.style.setProperty('--mm-top', Math.max(0, hdr.getBoundingClientRect().bottom) + 'px');
    b.setAttribute('aria-expanded', o ? 'true' : 'false'); m.hidden = !o;
    document.documentElement.classList.toggle('mm-open', o);
    if (o) { var f = m.querySelector('.mm-links a'); if (f) f.focus(); }
  };
  b.addEventListener('click', function () { set(b.getAttribute('aria-expanded') !== 'true'); });
  m.querySelector('.mm-close').addEventListener('click', function () { set(false); b.focus(); });
  m.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) { set(false); b.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && !m.hidden) set(false); });
})();
