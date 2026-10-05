/* Waylon HVAC — "Quiet Room"
   Two small progressive enhancements only:
   1. a gentle scroll reveal that never hides content that JS cannot reach
   2. the contact form, which composes a text message in the visitor's own app
*/
(function () {
  'use strict';

  /* ---------- scroll reveal ---------- */
  var items = document.querySelectorAll('[data-reveal]');

  function showAll() {
    for (var i = 0; i < items.length; i++) { items[i].classList.add('is-in'); }
  }

  if (!('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    for (var j = 0; j < items.length; j++) { observer.observe(items[j]); }

    /* if anything is still hidden after a moment, show it anyway */
    window.setTimeout(showAll, 2500);
  }

  /* ---------- contact form -> sms: ---------- */
  var form = document.getElementById('text-form');

  if (form) {
    var NUMBER = '+13478375286';

    function field(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = field('f-name');
      var phone = field('f-phone');
      var what = field('f-what');

      if (!name && !phone && !what) { return; }

      var lines = [];
      if (name) { lines.push('Name: ' + name); }
      if (phone) { lines.push('Phone: ' + phone); }
      if (what) { lines.push('Details: ' + what); }
      lines.push('');
      lines.push('Sent from the Waylon HVAC website.');

      window.location.href = 'sms:' + NUMBER + '?body=' + encodeURIComponent(lines.join('\n'));
    });
  }
})();