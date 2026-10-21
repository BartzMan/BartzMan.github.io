(function () {
  var btn = document.querySelector('.nav-toggle');
  var sheet = document.getElementById('sheet');
  function setOpen(open) {
    if (!btn || !sheet) return;
    if (open) { sheet.removeAttribute('hidden'); } else { sheet.setAttribute('hidden', ''); }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', open);
    if (open) {
      var c = sheet.querySelector('.sheet-close');
      if (c) c.focus();
    } else {
      btn.focus();
    }
  }
  if (btn && sheet) {
    btn.addEventListener('click', function () { setOpen(sheet.hasAttribute('hidden')); });
    var close = sheet.querySelector('.sheet-close');
    if (close) close.addEventListener('click', function () { setOpen(false); });
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        sheet.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hasAttribute('hidden')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000 && !sheet.hasAttribute('hidden')) {
        sheet.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  var f = document.getElementById('quote-form');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var v = function (k) { return (d.get(k) || '').toString().trim(); };
      var note = document.getElementById('form-note');
      if (!v('name') || !v('phone')) {
        if (note) note.textContent = 'Please add your name and phone number so we can reach you.';
        (v('name') ? f.querySelector('#f-phone') : f.querySelector('#f-name')).focus();
        return;
      }
      var body = 'Name: ' + v('name') + '\nPhone: ' + v('phone') + '\nZIP code: ' + v('zip') +
        '\nSystem: ' + v('system') + '\n\nWhat it is doing:\n' + v('message') + '\n';
      var subject = 'Service request: ' + v('system') + ' (' + v('name') + ')';
      window.location.href = 'mailto:collinsairandheat@yahoo.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      if (note) note.textContent = 'Your email app should open with the request filled in. If it does not, call (281) 960-4789.';
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
