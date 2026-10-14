/* Eagle Brick Solutions - HERRINGBONE
   Phone sheet and the mailto handoff. Motion is CSS; this only toggles state. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var burger = document.querySelector('.hb-burger');
  var sheet = document.getElementById('hb-sheet');
  var closer = sheet ? sheet.querySelector('[data-close]') : null;
  var opener = null;

  function isOpen() { return sheet && !sheet.hasAttribute('hidden'); }

  function open() {
    if (!sheet) return;
    opener = document.activeElement;
    sheet.removeAttribute('hidden');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closer) closer.focus();
  }
  function shut() {
    if (!sheet || !isOpen()) return;
    sheet.setAttribute('hidden', '');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      if (isOpen()) { shut(); } else { open(); }
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('[data-close]')) shut();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shut();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) shut();
    });
  }

  var form = document.getElementById('hb-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.elements.name.value || '').trim();
      var contact = (form.elements.contact.value || '').trim();
      var where = (form.elements.where.value || '').trim();
      var job = (form.elements.job.value || '').trim();
      if (!contact) { form.elements.contact.focus(); return; }

      var body = [
        'Name: ' + (name || '(not given)'),
        'Phone or email: ' + contact,
        'Job location: ' + (where || '(not given)'),
        '',
        'What is there now:',
        (job || '(not given)')
      ].join('\n');

      window.location.href = 'mailto:itapaiva21@gmail.com'
        + '?subject=' + encodeURIComponent('Paver enquiry - ' + (name || 'new enquiry'))
        + '&body=' + encodeURIComponent(body);
    });
  }
})();