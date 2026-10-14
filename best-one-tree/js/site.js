(function () {
  // phone menu: full-screen sheet
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var open = function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var first = sheet.querySelector('.sheet-nav a');
      if (first) first.focus();
    };
    var close = function (back) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (back) btn.focus();
    };
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close(true);
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a, button');
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) close(false); });
  }

  // contact form: no backend; opens the visitor's own email app with the details filled in
  var form = document.getElementById('tree-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('form-error');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var lines = [
        'Hi Best One Tree Service,',
        '',
        'Name: ' + v('name'),
        v('phone') ? 'Phone: ' + v('phone') : '',
        v('area') ? 'Neighborhood or city: ' + v('area') : '',
        'Job: ' + v('job'),
        '',
        v('message')
      ].filter(function (l, i) { return l !== '' || i === 1 || i === 6; });
      window.location.href = 'mailto:bestonetreeservice@gmail.com?subject=' + encodeURIComponent('Tree work: ' + v('job')) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
