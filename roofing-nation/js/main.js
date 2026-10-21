(function () {
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('sheet');
  var closeBtn = sheet ? sheet.querySelector('.sheet-close') : null;

  function focusables() {
    return sheet.querySelectorAll('a[href], button:not([disabled])');
  }
  function openSheet() {
    sheet.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeSheet(returnFocus) {
    sheet.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) burger.focus();
  }
  if (burger && sheet && closeBtn) {
    burger.addEventListener('click', openSheet);
    closeBtn.addEventListener('click', function () { closeSheet(true); });
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeSheet(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(true); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (!sheet.hidden && window.innerWidth > 1100) closeSheet(false);
    });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.reportValidity && !form.reportValidity()) return;
      var g = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var subject = 'Roof request: ' + (g('f-type') || 'roofing') + ' (' + (g('f-zip') || 'ZIP not given') + ')';
      var body = [
        'Name: ' + g('f-name'),
        'Phone: ' + g('f-phone'),
        'Email: ' + (g('f-email') || '-'),
        'ZIP: ' + (g('f-zip') || '-'),
        'Type of work: ' + g('f-type'),
        '',
        'What I am seeing:',
        g('f-details') || '-'
      ].join('\n');
      var url = 'mailto:sales@roofingnationrenovation.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      form.setAttribute('data-last-mailto', url);
      window.location.href = url;
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
