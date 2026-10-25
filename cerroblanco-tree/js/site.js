/* Cerroblanco Tree Service: menu, scroll reveals, rope progress gauge, email form. */
(function () {
  var doc = document.documentElement;

  /* ---- phone menu sheet ---- */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  var closeBtn = sheet && sheet.querySelector('.sheet-x');
  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('open'); });
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('lock');
    var first = sheet.querySelector('.sheet-nav a');
    if (first) first.focus();
  }
  function closeSheet() {
    sheet.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');
    setTimeout(function () { sheet.hidden = true; }, 250);
    burger.focus({ preventScroll: true });
  }
  if (burger && sheet) {
    burger.addEventListener('click', openSheet);
    closeBtn.addEventListener('click', closeSheet);
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSheet); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  }

  /* ---- staggered reveals + hexagons rotating into place ---- */
  var items = document.querySelectorAll('.reveal, .cell');
  var groups = new Map();
  items.forEach(function (el) {
    var p = el.parentElement;
    var i = groups.get(p) || 0;
    el.style.setProperty('--d', (Math.min(i, 6) * 0.11).toFixed(2) + 's');
    groups.set(p, i + 1);
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- the rope: scroll progress in the header bar and the side gauge ---- */
  var labels = Array.prototype.slice.call(document.querySelectorAll('.gauge li'));
  var marks = labels.map(function (li) { return document.getElementById(li.getAttribute('data-for')); });
  var ticking = false;
  function onScroll() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    doc.style.setProperty('--p', p.toFixed(4));
    var on = 0;
    marks.forEach(function (m, i) { if (m && m.getBoundingClientRect().top < window.innerHeight * 0.5) on = i; });
    labels.forEach(function (li, i) { li.classList.toggle('on', i === on); });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- form: opens the visitor's email app with the details filled in ---- */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var err = form.querySelector('.form-err');
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      if (!name || !phone) {
        err.hidden = false;
        (name ? f.phone : f.name).focus();
        return;
      }
      err.hidden = true;
      var jobs = Array.prototype.slice.call(form.querySelectorAll('input[name="job"]:checked')).map(function (c) { return c.value; });
      var body = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + (f.email.value.trim() || '-'),
        'Where is the tree: ' + (f.where.value.trim() || '-'),
        'What needs doing: ' + (jobs.join(', ') || '-'),
        '',
        f.message.value.trim()
      ].join('\n');
      var subject = 'Tree job: ' + (jobs[0] || 'question') + ' (' + name + ')';
      window.location.href = 'mailto:cerroblancotreeandlawn@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---- hexagon cursor on desktop pointers ---- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cur = document.createElement('div');
    cur.className = 'cur';
    cur.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cur);
    document.addEventListener('mousemove', function (e) {
      cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      cur.classList.add('on');
      var t = e.target.closest && e.target.closest('a,button,summary,label,.cell,.mz,.cp,.hex');
      cur.classList.toggle('big', !!t);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { cur.classList.remove('on'); });
  }

  var yr = document.querySelectorAll('.yr');
  yr.forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();

