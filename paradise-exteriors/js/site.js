(function () {
  'use strict';

  // ---- phone menu (full-screen sheet) ----
  var burger = document.querySelector('.mast-burger');
  var sheet = document.getElementById('sheet');
  if (burger && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var shut = function (back) {
      sheet.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (back) burger.focus();
    };
    burger.addEventListener('click', function () {
      sheet.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var first = sheet.querySelector('.sheet-links a');
      if (first) first.focus();
    });
    closeBtn.addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { shut(true); return; }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a[href], button');
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) shut(false); });
  }

  // ---- the envelope: hotspots light up their card ----
  var hots = document.querySelectorAll('.hot');
  var cards = document.querySelectorAll('.env-card');
  var light = function (n) {
    hots.forEach(function (h) { h.classList.toggle('is-on', h.getAttribute('data-env') === n); });
    cards.forEach(function (c) { c.classList.toggle('is-on', c.id === 'env-' + n); });
  };
  var sideBySide = function () { return window.matchMedia('(min-width: 1101px)').matches; };
  hots.forEach(function (h) {
    var n = h.getAttribute('data-env');
    h.addEventListener('click', function (e) {
      light(n);
      if (sideBySide()) {
        e.preventDefault(); // the card is already beside the drawing
        var card = document.getElementById('env-' + n);
        if (card && history.replaceState) history.replaceState(null, '', '#env-' + n);
      }
    });
    h.addEventListener('mouseenter', function () { if (sideBySide()) light(n); });
    h.addEventListener('focus', function () { light(n); });
  });
  cards.forEach(function (c) {
    c.addEventListener('mouseenter', function () { light(c.id.replace('env-', '')); });
  });
  if (/^#env-[1-5]$/.test(location.hash)) light(location.hash.slice(5));
  else if (hots.length) light('1');

  // ---- contact form -> the visitor's own text app ----
  var form = document.getElementById('text-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var lines = ['Hi Paradise Exteriors, this is ' + v('name') + '.', 'Job: ' + v('job')];
      if (v('city')) lines.push('City/ZIP: ' + v('city'));
      if (v('message')) lines.push(v('message'));
      var body = encodeURIComponent(lines.join('\n'));
      var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      window.location.href = 'sms:+17272910810' + (ios ? '&' : '?') + 'body=' + body;
    });
  }
})();
