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

  // job ticket -> the visitor's own email app
  var form = document.getElementById('job');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!val('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var surf = Array.prototype.filter.call(form.querySelectorAll('input[name="surf"]'), function (c) { return c.checked; })
        .map(function (c) { return c.value; });
      var body = [
        'Name: ' + val('name'),
        'Phone: ' + (val('phone') || '-'),
        'Town: ' + (val('town') || '-'),
        'Type of job: ' + val('job'),
        'Surfaces: ' + (surf.length ? surf.join(', ') : '-'),
        '',
        val('message'),
        ''
      ].join('\n');
      var subject = val('job') + (val('town') ? ' in ' + val('town') : '');
      window.location.href = 'mailto:laapainting1@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
