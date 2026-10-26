(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu sheet */
  var burger = d.querySelector('.burger'), sheet = d.getElementById('sheet'), hdr = d.querySelector('.hdr');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    var sr = burger.querySelector('.sr'); if (sr) sr.textContent = open ? 'Close menu' : 'Open menu';
    sheet.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
    if (hdr) hdr.classList.toggle('solid', open || window.scrollY > 40);
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) { setMenu(false); burger.focus(); } });
  }

  /* reveals + one light sweep per section (never looping) */
  var reveals = d.querySelectorAll('.reveal'), sheens = d.querySelectorAll('.sheen');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    var lo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('lit'); lo.unobserve(e.target); } });
    }, { threshold: 0.25 });
    sheens.forEach(function (el) { lo.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* drawdown card: fills as you scroll, names the current sheen */
  var label = d.querySelector('.dd-label'), dd = d.querySelector('.drawdown'), strip = d.querySelector('.topstrip');
  var marks = Array.prototype.slice.call(d.querySelectorAll('[data-sheen]'));
  var scaleLinks = d.querySelectorAll('.sc');
  var ticking = false, dock = d.querySelector('.dock'), cta = d.querySelector('.hero-cta') || d.querySelector('.hero');
  function update() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (dd) dd.style.setProperty('--left', (1 - p).toFixed(4));
    if (strip) strip.style.setProperty('--p', p.toFixed(4));
    var name = 'Flat', mid = window.innerHeight * 0.45;
    marks.forEach(function (m) { if (m.getBoundingClientRect().top < mid) name = m.getAttribute('data-sheen'); });
    if (label && label.textContent !== name) label.textContent = name;
    if (hdr) hdr.classList.toggle('solid', window.scrollY > 40 || (sheet && !sheet.hidden));
    if (dock && cta) dock.classList.toggle('show', cta.getBoundingClientRect().bottom < 0);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* quote form: the publishing step adds the delivery */
  var form = d.getElementById('quote');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
