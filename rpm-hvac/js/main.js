(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs) { var e = d.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  /* hero tachometer ring: 0-7 x1000 r/min over 270 degrees, red line from 6 */
  var tick = d.querySelector('.fan__ticks');
  if (tick) {
    for (var i = 0; i <= 70; i++) {
      var a = (-225 + i * (270 / 70)) * Math.PI / 180, maj = i % 10 === 0;
      var r1 = 160, r2 = maj ? 140 : (i % 5 === 0 ? 147 : 152);
      var ln = el('line', { x1: 200 + r1 * Math.cos(a), y1: 200 + r1 * Math.sin(a), x2: 200 + r2 * Math.cos(a), y2: 200 + r2 * Math.sin(a) });
      if (maj) ln.setAttribute('class', 'maj' + (i >= 60 ? ' hot' : ''));
      else if (i >= 60) ln.setAttribute('class', 'hot');
      tick.appendChild(ln);
      if (maj) {
        var t = el('text', { x: 200 + 128 * Math.cos(a), y: 200 + 128 * Math.sin(a) + 5, 'text-anchor': 'middle' });
        t.textContent = i / 10; tick.appendChild(t);
      }
    }
  }
  /* grille spokes */
  [['.fan__spokes', 20, 92, 24], ['.ftr__spokes', 32, 96, 36], ['.hub__spokes', 22, 96, 30]].forEach(function (s) {
    var g = d.querySelector(s[0]); if (!g) return;
    for (var j = 0; j < s[3]; j++) {
      var b = j * 2 * Math.PI / s[3];
      g.appendChild(el('line', { x1: s[1] * Math.cos(b), y1: s[1] * Math.sin(b), x2: s[2] * Math.cos(b), y2: s[2] * Math.sin(b) }));
    }
  });
  /* five-blade hub for the services */
  var hb = d.querySelector('.hub__blades');
  if (hb) for (var k = 0; k < 5; k++) hb.appendChild(el('path', { d: 'M8 -12 C 30 -50 74 -62 92 -34 C 80 -12 44 6 10 10 Z', transform: 'rotate(' + (k * 72) + ')' }));
  /* leak dial texture */
  var ld = d.querySelector('.leak__dialticks');
  if (ld) for (var m = 0; m <= 40; m++) {
    var an = (-225 + m * 270 / 40) * Math.PI / 180, mj = m % 5 === 0;
    ld.appendChild(el('line', { x1: 300 + 290 * Math.cos(an), y1: 300 + 290 * Math.sin(an), x2: 300 + (mj ? 240 : 265) * Math.cos(an), y2: 300 + (mj ? 240 : 265) * Math.sin(an), 'class': mj ? 'maj' : '' }));
  }
  /* rating + scroll gauges ticks */
  [['.rate__ticks', 100, 100, 92, 84, 10], ['.gauge__ticks', 50, 50, 44, 39, 14]].forEach(function (s) {
    var g = d.querySelector(s[0]); if (!g) return;
    for (var n = 0; n <= s[5]; n++) {
      var q = (-225 + n * 270 / s[5]) * Math.PI / 180;
      g.appendChild(el('line', { x1: s[1] + s[3] * Math.cos(q), y1: s[2] + s[3] * Math.sin(q), x2: s[1] + s[4] * Math.cos(q), y2: s[2] + s[4] * Math.sin(q) }));
    }
  });

  /* menu */
  var burger = d.querySelector('.burger'), sheet = d.getElementById('sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    sheet.hidden = !open;
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* reveal */
  var rv = d.querySelectorAll('.rv, .range');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (x) { io.observe(x); });
  } else rv.forEach(function (x) { x.classList.add('in'); });

  /* fans: steady spin, speed up on Call hover and with scroll speed */
  var spins = [].slice.call(d.querySelectorAll('[data-spin]')).map(function (e) { return { e: e, k: parseFloat(e.getAttribute('data-spin')) || 1 }; });
  var readout = d.querySelector('[data-rpm]'), readout2 = d.querySelector('[data-rpm2]'), needle = d.querySelector('.gauge__needle');
  var angle = 0, speed = 50, target = 50, boost = 0, lastY = window.scrollY, last = performance.now();
  d.querySelectorAll('[data-boost]').forEach(function (b) {
    b.addEventListener('mouseenter', function () { boost = 1; });
    b.addEventListener('mouseleave', function () { boost = 0; });
    b.addEventListener('focus', function () { boost = 1; });
    b.addEventListener('blur', function () { boost = 0; });
  });
  var scrollKick = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    var y = window.scrollY, dy = Math.abs(y - lastY); lastY = y;
    scrollKick = Math.max(scrollKick * 0.94, Math.min(500, dy * 9));
    target = 50 + boost * 900 + scrollKick;
    speed += (target - speed) * Math.min(1, dt * 2.4);
    angle = (angle + speed * dt) % 360;
    for (var i = 0; i < spins.length; i++) spins[i].e.style.transform = 'rotate(' + (angle * spins[i].k) + 'deg)';
    if (readout) readout.textContent = ('000' + Math.round(speed * 17)).slice(-4);
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);

  /* round RPM gauge = scroll progress */
  function onScroll() {
    var h = root.scrollHeight - window.innerHeight, p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if (needle) needle.style.transform = 'rotate(' + (-135 + p * 270) + 'deg)';
    if (readout2) readout2.textContent = Math.round(p * 7000);
    var area = d.querySelector('.area__h');
    if (area) {
      var r = area.getBoundingClientRect(), vh = window.innerHeight;
      var f = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.2)));
      area.style.setProperty('--fill', (reduce ? 100 : Math.round(f * 100)) + '%');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* service links preselect the form */
  var sel = d.getElementById('svc');
  d.querySelectorAll('[data-svc]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!sel) return;
      var v = a.getAttribute('data-svc');
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].text === v) sel.selectedIndex = i;
    });
  });

  /* form -> email app */
  var form = d.getElementById('form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!f.name.value.trim() || !f.reach.value.trim()) { (f.name.value.trim() ? f.reach : f.name).focus(); return; }
    var body = 'Name: ' + f.name.value + '\nPhone or email: ' + f.reach.value + '\nService: ' + f.svc.value + '\n\nWhat it is doing:\n' + f.msg.value + '\n';
    window.location.href = 'mailto:rpmhvac777@gmail.com?subject=' + encodeURIComponent('Service request: ' + f.svc.value) + '&body=' + encodeURIComponent(body);
  });

  /* phone call bar: hidden while the hero buttons are on screen */
  var dock = d.querySelector('.dock'), heroCta = d.querySelector('.hero__cta');
  function dockCheck() { if (dock) dock.classList.toggle('on', !heroCta || heroCta.getBoundingClientRect().bottom < 0); }
  window.addEventListener('scroll', dockCheck, { passive: true });
  dockCheck();

  var yr = d.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();
})();
