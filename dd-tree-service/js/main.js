(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    burger.addEventListener('click', function () { setMenu(sheet.hidden); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });
  }

  /* reveal on scroll */
  var items = document.querySelectorAll('.rv, .frond');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* wind: scroll progress + palms that lean with scroll speed */
  var names = ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate', 'Fresh breeze', 'Strong breeze', 'Near gale', 'Gale'];
  var feathers = document.querySelectorAll('.wind__barb .f');
  var forceEl = document.querySelector('.wind__force');
  var lastY = window.scrollY, lastT = performance.now(), lean = 0, target = 0, ticking = false, lastForce = -1;

  function progress() {
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : 0);
  }
  function frame() {
    var now = performance.now();
    var dt = Math.max(16, now - lastT);
    var v = (window.scrollY - lastY) / dt; // px per ms
    lastY = window.scrollY; lastT = now;
    target = Math.max(-16, Math.min(16, v * 9));
    lean += (target - lean) * 0.18;
    if (Math.abs(lean) < 0.05 && Math.abs(target) < 0.05) { lean = 0; ticking = false; }
    root.style.setProperty('--lean', lean.toFixed(2));
    var force = Math.min(8, Math.round(Math.abs(lean) / 2));
    if (force !== lastForce) {
      lastForce = force;
      if (forceEl) forceEl.textContent = names[force];
      feathers.forEach(function (f, i) { f.classList.toggle('on', force > i * 2); });
    }
    if (ticking) requestAnimationFrame(frame);
  }
  window.addEventListener('scroll', function () {
    progress();
    if (!reduce && !ticking) { ticking = true; lastT = performance.now() - 16; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  /* quote form: opens the visitor's email app */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, err = form.querySelector('.report__err');
      if (!f.name.value.trim() || !f.phone.value.trim()) { err.hidden = false; f.name.focus(); return; }
      err.hidden = true;
      var body = 'Name: ' + f.name.value + '\nPhone: ' + f.phone.value + '\nJob: ' + f.job.value +
        '\nCity or ZIP: ' + f.where.value + '\n\nThe tree:\n' + f.notes.value + '\n';
      window.location.href = 'mailto:yoelito38@yahoo.com?subject=' + encodeURIComponent('Tree request: ' + f.job.value) +
        '&body=' + encodeURIComponent(body);
    });
  }

  var yr = document.querySelector('.yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
