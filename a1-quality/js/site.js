(function () {
  document.documentElement.classList.add('js');

  // phone menu sheet
  var openBtn = document.querySelector('.hd-menu');
  var menu = document.getElementById('menu');
  if (openBtn && menu) {
    var shut = function (refocus) {
      menu.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (refocus) openBtn.focus();
    };
    openBtn.addEventListener('click', function () {
      menu.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      var first = menu.querySelector('.menu-links a');
      if (first) first.focus();
    });
    menu.querySelector('.menu-close').addEventListener('click', function () { shut(true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') shut(true);
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !menu.hidden) shut(false); });
  }

  // annotations draw in when they scroll into view (CSS does the motion)
  var anns = document.querySelectorAll('.ann');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    Array.prototype.forEach.call(anns, function (a) { io.observe(a); });
  } else {
    Array.prototype.forEach.call(anns, function (a) { a.classList.add('in'); });
  }

  // work order -> the visitor's own email app
  var form = document.getElementById('wo');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!val('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var sym = Array.prototype.filter.call(form.querySelectorAll('input[name="sym"]'), function (c) { return c.checked; })
        .map(function (c) { return c.value; });
      var body = [
        'Name: ' + val('name'),
        'Phone: ' + (val('phone') || '-'),
        'Neighborhood or ZIP: ' + (val('where') || '-'),
        'What needs work: ' + val('job'),
        'What it is doing: ' + (sym.length ? sym.join(', ') : '-'),
        '',
        val('message'),
        ''
      ].join('\n');
      var subject = val('job') + (val('where') ? ' in ' + val('where') : '');
      window.location.href = 'mailto:a.1qualitycontracting@yahoo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
