(function () {
  var burger = document.querySelector('.burger');
  var sheet = document.querySelector('.sheet');
  var close = sheet ? sheet.querySelector('.close') : null;
  function open() { sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; close.focus(); }
  function shut() { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; burger.focus(); }
  if (burger && sheet && close) {
    burger.addEventListener('click', open);
    close.addEventListener('click', shut);
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) shut(); });
  }
  var form = document.getElementById('estimate-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var subject = 'Roofing request from ' + (g('name') || 'website visitor') + (g('zip') ? ' - ' + g('zip') : '');
      var body = ['Name: ' + g('name'), 'Phone: ' + g('phone'), 'ZIP: ' + g('zip'), 'Type of work: ' + g('work'), '', 'Details:', g('details'), '', 'Sent from the Rosendo\'s Roofing website'].join('\n');
      window.location.href = 'mailto:rosendosroofing.remodeling@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
