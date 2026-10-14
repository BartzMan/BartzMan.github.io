/* Night & Day Lighting Solutions - DAWN TO DUSK
   The phone sheet, the mailto handoff, and one scroll progress variable that
   moves the sun down the day track. All animation itself is CSS. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var burger = document.querySelector('.dn-burger');
  var sheet = document.getElementById('dn-sheet');
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

  /* ---------- how far down the day we are ---------- */
  var track = document.querySelector('.dn-track');
  if (track) {
    var queued = false;
    function paint() {
      queued = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.pageYOffset / max : 0;
      track.style.setProperty('--day', Math.max(0, Math.min(1, p)).toFixed(4));
    }
    function queue() {
      if (!queued) { queued = true; window.requestAnimationFrame(paint); }
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    paint();
  }

  var form = document.getElementById('dn-form');
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
        'What the house is doing:',
        (job || '(not given)')
      ].join('\n');

      window.location.href = 'mailto:nightanddaylightingsolutions@gmail.com'
        + '?subject=' + encodeURIComponent('Electrical enquiry - ' + (name || 'new enquiry'))
        + '&body=' + encodeURIComponent(body);
    });
  }
})();