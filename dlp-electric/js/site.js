(function () {
  // phone menu: full-screen sheet
  var btn = document.querySelector('.menu-toggle');
  var sheet = document.getElementById('menu-sheet');
  if (btn && sheet) {
    var close = function (back) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      if (back) btn.focus();
    };
    btn.addEventListener('click', function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      var first = sheet.querySelector('.ms-links a');
      if (first) first.focus();
    });
    sheet.querySelector('.ms-close').addEventListener('click', function () { close(true); });
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
    window.addEventListener('resize', function () { if (window.innerWidth > 1200 && !sheet.hidden) close(false); });
  }

  // job form -> the visitor's own email app (no backend)
  var form = document.getElementById('job-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'Town: ' + (v('town') || '-'), 'Job: ' + v('job'), '', v('message')].join('\n');
      var subject = v('job') + (v('town') ? ' in ' + v('town') : '');
      window.location.href = 'mailto:dlpsrv@aol.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
