(function () {
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var open = function () {
      sheet.hidden = false; btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var f = sheet.querySelector('.sheet-nav a'); if (f) f.focus();
    };
    var close = function (back) {
      sheet.hidden = true; btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked'); if (back) btn.focus();
    };
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close(true);
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) close(false); });
  }
  var items = document.querySelectorAll('[data-reveal]');
  var show = function (el) { el.classList.add('in'); };
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { show(x.target); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(show); }
  var form = document.getElementById('pave-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('form-error');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'City or ZIP: ' + (v('zip') || '-'), 'Job: ' + v('job'), '', v('message')].join('\n');
      window.location.href = 'mailto:itapaiva21@gmail.com?subject=' + encodeURIComponent(v('job') + ' request from ' + v('name')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
