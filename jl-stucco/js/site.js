(function () {
  'use strict';
  var d = document;
  var burger = d.querySelector('.burger'), sheet = d.getElementById('sheet');
  if (burger && sheet) {
    var close = sheet.querySelector('.sheet-close');
    var openSheet = function () { sheet.hidden = false; burger.setAttribute('aria-expanded', 'true'); d.body.classList.add('locked'); (close || sheet).focus(); };
    var shut = function (back) { sheet.hidden = true; burger.setAttribute('aria-expanded', 'false'); d.body.classList.remove('locked'); if (back) burger.focus(); };
    burger.addEventListener('click', openSheet);
    if (close) close.addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) shut(true); });
  }
  // email form: opens the visitor's own email app with the details written out
  var form = d.getElementById('mail-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, name = f.name.value.trim();
      var lines = ['Hi JL Stucco,', ''];
      if (f.msg.value.trim()) lines.push(f.msg.value.trim(), '');
      lines.push('Job: ' + f.job.value);
      if (f.area.value.trim()) lines.push('City or ZIP: ' + f.area.value.trim());
      if (name) lines.push('Name: ' + name);
      if (f.phone.value.trim()) lines.push('Phone: ' + f.phone.value.trim());
      lines.push('', '(Photos of the wall attached)');
      var subject = 'Stucco request' + (name ? ' from ' + name : '');
      window.location.href = 'mailto:jlstucco96@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();
