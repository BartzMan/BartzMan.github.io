/* ==========================================================================
   CLEAN TILE — Pomonok Heating and Plumbing
   Vanilla JS, no dependencies, no network calls.
   1. marks the document as JS-capable so reveal-on-scroll can be opt-in
   2. reveals .reveal elements as they scroll in (content is never hidden
      when JS is off, unavailable, or motion is reduced)
   3. turns the contact form into an sms: link that opens the visitor's own
      messaging app with their details already filled in
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---- reveal on scroll -------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  function showAll() {
    for (var i = 0; i < reveals.length; i++) { reveals[i].classList.add('is-in'); }
  }
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('is-in');
            io.unobserve(entries[i].target);
          }
        }
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      for (var j = 0; j < reveals.length; j++) { io.observe(reveals[j]); }
    } else {
      showAll();
    }
  }

  /* ---- contact form -> sms: -------------------------------------------- */
  var form = document.getElementById('text-request');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var get = function (field) {
        var node = form.elements[field];
        return node && typeof node.value === 'string' ? node.value.replace(/\s+/g, ' ').trim() : '';
      };

      var name = get('name');
      var where = get('where');
      var job = get('job');

      var lines = ['Hi Pomonok Heating and Plumbing,'];
      if (name) { lines.push('This is ' + name + '.'); }
      if (where) { lines.push('Location: ' + where); }
      if (job) { lines.push('Job: ' + job); }
      lines.push('Please call or text me back.');

      window.location.href = 'sms:+13473437843&body=' + encodeURIComponent(lines.join('\n'));
    });
  }

  /* ---- header: nothing to run, kept for a single entry point ------------- */
})();