/* Roofing Figueroa: swatch flipper, menu sheet, scroll strip, reveals, cursor chip, WhatsApp form */
(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu sheet */
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  function setMenu(open) {
    if (!burger || !sheet) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.querySelector('.sr').textContent = open ? 'Close menu' : 'Open menu';
    sheet.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* swatch flipper */
  var flipper = document.querySelector('[data-flipper]');
  if (flipper) {
    var cards = flipper.querySelectorAll('.card-photo');
    var tabs = flipper.querySelectorAll('[data-show]');
    var timer = null, busy = false;
    function show(name) {
      var front = flipper.querySelector('.card-photo.is-front');
      if (busy || !front || front.dataset.swatch === name) return;
      var next = flipper.querySelector('.card-photo[data-swatch="' + name + '"]');
      busy = true;
      front.classList.remove('is-front'); front.classList.add('is-back');
      next.classList.remove('is-back'); next.classList.add('is-front');
      if (!reduce) { front.classList.add('anim-back'); next.classList.add('anim-front'); }
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.dataset.show === name ? 'true' : 'false'); });
      setTimeout(function () { front.classList.remove('anim-back'); next.classList.remove('anim-front'); busy = false; }, reduce ? 0 : 950);
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { stop(); show(t.dataset.show); }); });
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.classList.contains('is-back')) { stop(); show(c.dataset.swatch); }
      });
    });
    function cycle() {
      var front = flipper.querySelector('.card-photo.is-front');
      show(front && front.dataset.swatch === 'wood' ? 'charcoal' : 'wood');
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    if (!reduce) {
      timer = setInterval(cycle, 5200);
      flipper.addEventListener('mouseenter', stop);
    }
  }

  /* scroll strip */
  var strip = document.querySelector('.progress');
  function onScroll() {
    if (!strip) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    strip.style.setProperty('--p', h > 0 ? Math.min(1, window.scrollY / h).toFixed(3) : 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* staggered reveals */
  var items = document.querySelectorAll('.reveal');
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
    el.style.setProperty('--d', (sibs.indexOf(el) * 0.09).toFixed(2) + 's');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* cursor chip over photos and CTAs */
  var chip = document.querySelector('.cursor-chip');
  if (chip && window.matchMedia('(pointer: fine)').matches && !reduce) {
    var label = chip.querySelector('span');
    var colours = { 'Cedar': '#5A3B2A', 'Weathered Wood': '#7A5C4A', 'Call': '#F2A93B', 'Send': '#25D366' };
    document.querySelectorAll('[data-chip],[data-badge]').forEach(function (el) {
      var name = el.getAttribute('data-chip') || el.getAttribute('data-badge');
      el.addEventListener('mouseenter', function () { label.textContent = name; chip.style.setProperty('--c', colours[name] || '#7A5C4A'); chip.classList.add('on'); });
      el.addEventListener('mouseleave', function () { chip.classList.remove('on'); });
    });
    window.addEventListener('mousemove', function (e) { chip.style.left = e.clientX + 'px'; chip.style.top = e.clientY + 'px'; }, { passive: true });
  }

  /* WhatsApp form */
  var form = document.getElementById('quote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var err = document.getElementById('f-err');
      if (!name) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var look = form.querySelector('input[name="look"]:checked');
      var lines = [
        'Hi Roofing Figueroa,',
        'Name: ' + name,
        'Job: ' + form.elements.job.value,
        'Area/ZIP: ' + (form.elements.area.value.trim() || '-'),
        'Look I like: ' + (look ? look.value : 'Not sure yet'),
        'Details: ' + (form.elements.msg.value.trim() || '-'),
        'I can send roof photos here.'
      ];
      window.open('https://wa.me/14695084462?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
})();
