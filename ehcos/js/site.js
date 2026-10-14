(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  // phone menu sheet
  var sheet = d.getElementById('sheet'), burger = d.getElementById('burger'), close = d.getElementById('sheet-x');
  function setOpen(open) {
    if (!sheet) return;
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
    if (open && close) close.focus(); else if (burger) burger.focus({ preventScroll: true });
  }
  if (burger) burger.addEventListener('click', function () { setOpen(true); });
  if (close) close.addEventListener('click', function () { setOpen(false); });
  if (sheet) sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet && sheet.classList.contains('open')) setOpen(false); });

  // reveal on scroll (content is visible without JS)
  var els = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // ribbons draw in when they come into view
  var dr = d.querySelectorAll('.draw');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('go'); io2.unobserve(e.target); } });
    }, { threshold: 0.2 });
    dr.forEach(function (el) { io2.observe(el); });
  } else { dr.forEach(function (el) { el.classList.add('go'); }); }

  // form: opens the visitor's own email app
  var f = d.getElementById('quote');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
    if (!v('name')) { f.elements.name.focus(); return; }
    var body = 'Name: ' + v('name') + '\nPhone: ' + v('phone') + '\nArea / ZIP: ' + v('area') + '\nService: ' + v('service') + '\n\n' + v('details') + '\n\n(Photos of the unit and its model plate help: attach them here.)';
    var subj = 'Request: ' + (v('service') || 'heating and air') + ' - ' + v('name');
    window.location.href = 'mailto:' + f.getAttribute('data-to') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });

  var y = d.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
