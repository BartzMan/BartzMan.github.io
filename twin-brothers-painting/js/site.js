(function () {
  // phone menu sheet
  var btn = document.querySelector('.hdr-menu');
  var sheet = document.getElementById('m-sheet');
  if (btn && sheet) {
    var shut = function (back) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('held');
      if (back) btn.focus();
    };
    btn.addEventListener('click', function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('held');
      sheet.querySelector('.msheet-links a').focus();
    });
    sheet.querySelector('.msheet-close').addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') shut(true);
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a, button'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100 && !sheet.hidden) shut(false); });
  }

  // form -> the visitor's own email app
  var form = document.getElementById('paint-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('fl-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'Town: ' + (v('town') || '-'), 'Job: ' + v('job'), '', v('message')].join('\n');
      window.location.href = 'mailto:thetwinbrotherspainting@gmail.com?subject=' + encodeURIComponent(v('job') + ' quote request') + '&body=' + encodeURIComponent(body);
    });
  }
})();
