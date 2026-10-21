(function () {
  var burger = document.querySelector('.burger');
  var sheet = document.getElementById('menu');
  var closeBtn = sheet && sheet.querySelector('.close');
  function openMenu() { sheet.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; (closeBtn || sheet).focus(); }
  function closeMenu() { sheet.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; burger.focus(); }
  if (burger && sheet) {
    burger.addEventListener('click', function () { sheet.classList.contains('open') ? closeMenu() : openMenu(); });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) closeMenu(); });
  }

  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var subject = 'Metal roofing request from ' + (f.name.value || 'website visitor');
      var body = [
        'Name: ' + f.name.value,
        'Phone: ' + f.phone.value,
        'Email: ' + f.email.value,
        'City / ZIP: ' + f.city.value,
        'Job type: ' + f.job.value,
        '',
        'Details:',
        f.details.value
      ].join('\n');
      window.location.href = 'mailto:jose@lsmetalroofing.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
