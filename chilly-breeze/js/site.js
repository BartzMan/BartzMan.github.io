(function () {
  'use strict';

  // ---- phone menu: full-screen sheet ----
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closer = sheet.querySelector('.sheet-close');
    var openSheet = function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var first = sheet.querySelector('.sheet-nav a');
      if (first) first.focus();
    };
    var closeSheet = function (returnFocus) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (returnFocus) btn.focus();
    };
    btn.addEventListener('click', openSheet);
    closer.addEventListener('click', function () { closeSheet(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) closeSheet(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { closeSheet(true); return; }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a[href], button');
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060 && !sheet.hidden) closeSheet(false); });
  }

  // ---- contact form: opens the visitor's own email app, details filled in ----
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('form-error');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + (v('phone') || '-'),
        'Town or ZIP: ' + (v('town') || '-'),
        'Job: ' + v('job'),
        '',
        v('message') || '(no details yet)'
      ].join('\n');
      var subject = v('job') + ' request from ' + v('name');
      window.location.href = 'mailto:bobbykroboth@yahoo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
