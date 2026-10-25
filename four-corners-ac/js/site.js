(function () {
  var root = document.documentElement;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setMenu(false); });
  }

  /* the cut: every split moves as its section crosses the screen, and the cold side wins */
  var splits = [].slice.call(document.querySelectorAll('[data-from]'));
  var area = document.querySelector('.area');
  var areaText = document.querySelector('.area__big');
  var footText = document.querySelector('.split-text--foot');
  var foot = document.querySelector('.foot');
  var hero = document.querySelector('.hero');
  var compass = document.querySelector('.compass');
  var quad = document.querySelector('.quad');
  var thermo = document.querySelector('.thermo');

  function progress(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh - r.top) / (vh + r.height);
    return Math.max(0, Math.min(1, p));
  }
  function tick() {
    var max = root.scrollHeight - window.innerHeight;
    var prog = max > 0 ? window.scrollY / max : 0;
    if (thermo) thermo.style.setProperty('--prog', prog.toFixed(4));
    if (still) return;
    splits.forEach(function (el) {
      var a = parseFloat(el.getAttribute('data-from')), b = parseFloat(el.getAttribute('data-to'));
      var x = a + (b - a) * progress(el);
      el.style.setProperty('--x', x.toFixed(2) + '%');
    });
    if (hero) {
      var h = Math.min(1, window.scrollY / Math.max(1, hero.offsetHeight));
      hero.style.setProperty('--y1', (74 - 30 * h).toFixed(2) + '%');
      hero.style.setProperty('--y2', (46 - 30 * h).toFixed(2) + '%');
    }
    if (area && areaText) areaText.style.setProperty('--x', (70 - 45 * progress(area)).toFixed(2) + '%');
    if (foot && footText) footText.style.setProperty('--x', (60 - 30 * progress(foot)).toFixed(2) + '%');
    if (compass && quad) compass.style.setProperty('--spin', (-140 + 320 * progress(quad)).toFixed(1) + 'deg');
  }
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; tick(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  tick();

  /* reveal on scroll, staggered */
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if (still || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = [].slice.call(el.parentNode.querySelectorAll(':scope > .reveal'));
        el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) % 4) * 110 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* the form opens the visitor's email app, filled in */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (!f.name.value.trim() || !f.phone.value.trim()) {
        (f.name.value.trim() ? f.phone : f.name).focus();
        return;
      }
      var where = form.querySelector('input[name="where"]:checked');
      var body = [
        'Name: ' + f.name.value.trim(),
        'Phone: ' + f.phone.value.trim(),
        'Email: ' + (f.email.value.trim() || '-'),
        'Need: ' + f.service.value,
        'Unit: ' + (where ? where.value : '-'),
        '',
        f.msg.value.trim()
      ].join('\n');
      window.location.href = 'mailto:fourcornersac@gmail.com?subject=' +
        encodeURIComponent(f.service.value + ' request from the website') + '&body=' + encodeURIComponent(body);
    });
  }

  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
