(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* centerline progress */
  var ticking = false;
  function progress() {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* revision clouds around .cloud figures */
  function cloud(el) {
    var old = el.querySelector('.cloud-svg');
    if (old) old.remove();
    var pad = window.innerWidth < 900 ? 10 : 16;
    var w = el.offsetWidth + pad * 2, h = el.offsetHeight + pad * 2;
    var r = 13, s = r * 2;
    var nx = Math.max(2, Math.round(w / s)), ny = Math.max(2, Math.round(h / s));
    var sx = w / nx, sy = h / ny;
    var d = 'M0 0';
    var i;
    for (i = 0; i < nx; i++) d += ' a' + (sx / 2) + ' ' + r + ' 0 0 1 ' + sx + ' 0';
    for (i = 0; i < ny; i++) d += ' a' + r + ' ' + (sy / 2) + ' 0 0 1 0 ' + sy;
    for (i = 0; i < nx; i++) d += ' a' + (sx / 2) + ' ' + r + ' 0 0 1 ' + (-sx) + ' 0';
    for (i = 0; i < ny; i++) d += ' a' + r + ' ' + (sy / 2) + ' 0 0 1 0 ' + (-sy);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'cloud-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.style.left = -pad + 'px'; svg.style.top = -pad + 'px';
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('pathLength', '1');
    svg.appendChild(path);
    el.appendChild(svg);
  }
  var clouds = [].slice.call(document.querySelectorAll('.cloud'));
  function drawClouds() { clouds.forEach(cloud); }
  window.addEventListener('load', drawClouds);
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(drawClouds, 200); });
  drawClouds();

  /* reveal + drawing on scroll, staggered within each parent */
  var targets = [].slice.call(document.querySelectorAll('.rv, .markup, .riser, .cl-strike, .cloud, .note'));
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('rv') && el.parentElement) {
          var sibs = [].slice.call(el.parentElement.children).filter(function (c) { return c.classList.contains('rv'); });
          el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) * 0.09) + 's';
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* fixture schedule <-> photos */
  var rows = document.querySelectorAll('.sched tr[data-fx]');
  [].forEach.call(rows, function (row) {
    var fig = document.querySelector('.fx[data-fx="' + row.getAttribute('data-fx') + '"]');
    if (!fig) return;
    function on() { row.classList.add('hl'); fig.classList.add('hl'); }
    function off() { row.classList.remove('hl'); fig.classList.remove('hl'); }
    row.addEventListener('mouseenter', on); row.addEventListener('mouseleave', off);
    fig.addEventListener('mouseenter', on); fig.addEventListener('mouseleave', off);
  });

  /* phone menu */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    [].forEach.call(sheet.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* work order -> email app */
  var form = document.getElementById('wo');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var lines = [
        'WORK ORDER (from the website)',
        '',
        '01 Name: ' + f.name.value,
        '02 Phone or email: ' + f.reach.value,
        '03 Building: ' + f.building.value,
        '04 Work: ' + f.work.value,
        '05 Site area or city: ' + f.site.value,
        '06 Notes: ' + f.notes.value,
        '',
        '(Photos attached if any)'
      ];
      var subject = 'Work order: ' + f.work.value + (f.name.value ? ' (' + f.name.value + ')' : '');
      window.location.href = 'mailto:jon@centerline.pl?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
