(function () {
  // phone menu
  var btn = document.querySelector('.bar-menu');
  var menu = document.getElementById('panel-menu');
  if (btn && menu) {
    var off = function (back) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('dark-lock');
      if (back) btn.focus();
    };
    btn.addEventListener('click', function () {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('dark-lock');
      menu.querySelector('.pmenu-links a').focus();
    });
    menu.querySelector('.pmenu-close').addEventListener('click', function () { off(true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) off(false); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') off(true);
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !menu.hidden) off(false); });
  }

  // form -> the visitor's own email app
  var form = document.getElementById('volt-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('fi-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'Town: ' + (v('town') || '-'), 'Job: ' + v('job'), '', v('message')].join('\n');
      window.location.href = 'mailto:hivoltage65@gmail.com?subject=' + encodeURIComponent(v('job') + (v('town') ? ' in ' + v('town') : '')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
