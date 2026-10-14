(function () {
  var d = document, root = d.documentElement;
  // phone menu sheet
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
  // charge level: fills as you scroll (static under reduced motion)
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pct = d.querySelector('.cs-p');
  function charge() {
    var h = root.scrollHeight - root.clientHeight;
    var v = reduce ? 1 : (h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 1);
    root.style.setProperty('--charge', v.toFixed(3));
    if (pct) pct.textContent = Math.round(v * 100) + '%';
  }
  charge();
  if (!reduce) { window.addEventListener('scroll', charge, { passive: true }); window.addEventListener('resize', charge); }
  // text-message form
  var f = d.getElementById('jobform');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
    var body = 'Hi CenCal Electric, this is ' + (g('name') || '(name)') + (g('where') ? ' in ' + g('where') : '') + '. Job: ' + g('job') + '. ' + g('msg');
    window.location.href = 'sms:+14083105246?&body=' + encodeURIComponent(body);
  });
})();
