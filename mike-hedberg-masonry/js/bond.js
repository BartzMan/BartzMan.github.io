/* Mike Hedberg Masonry - RUNNING BOND
   Phone sheet and the text-message handoff. No email address is published for
   this business, so the form composes an sms: link instead of a mailto. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var burger = document.querySelector('.rb-burger');
  var sheet = document.getElementById('rb-sheet');
  var closer = sheet ? sheet.querySelector('[data-close]') : null;
  var opener = null;
  var NUMBER = '18172714716';

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

  var form = document.getElementById('rb-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var job = (form.elements.job.value || '').trim();
      var where = (form.elements.where.value || '').trim();
      var note = (form.elements.note.value || '').trim();
      if (!job) { form.elements.job.focus(); return; }

      var body = [
        'Job: ' + job,
        'Where: ' + (where || '(not given)'),
        '',
        'What is wrong with it:',
        (note || '(not given)')
      ].join('\n');

      window.location.href = 'sms:+' + NUMBER + '?&body=' + encodeURIComponent(body);
    });
  }
})();