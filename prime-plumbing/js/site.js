(function () {
  var d = document;
  var b = d.querySelector('.burger'), s = d.getElementById('sheet');
  function setOpen(o) {
    if (!b || !s) return;
    b.setAttribute('aria-expanded', o ? 'true' : 'false');
    b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    s.hidden = !o; d.body.style.overflow = o ? 'hidden' : '';
  }
  if (b && s) {
    b.addEventListener('click', function () { setOpen(b.getAttribute('aria-expanded') !== 'true'); });
    s.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }
  var f = d.getElementById('jobform');
  if (f) f.addEventListener('submit', function (e) { e.preventDefault(); });
})();
