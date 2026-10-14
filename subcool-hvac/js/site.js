(function () {
  'use strict';

  // ---- phone menu ----
  var btn = document.querySelector('.hd-menu');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var shut = function (back) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (back) btn.focus();
    };
    btn.addEventListener('click', function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var a = sheet.querySelector('.sheet-links a');
      if (a) a.focus();
    });
    sheet.querySelector('.sheet-close').addEventListener('click', function () { shut(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) shut(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { shut(true); return; }
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a[href], button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !sheet.hidden) shut(false); });
  }

  // ---- the copper loop fills from superheat red to subcool blue as you scroll ----
  var root = document.documentElement;
  var ticking = false;
  var update = function () {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty('--flow', p.toFixed(4));
    ticking = false;
  };
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // ---- contact form -> the visitor's own email app ----
  var form = document.getElementById('mail-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('f-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = ['Name: ' + v('name'), 'Phone: ' + (v('phone') || '-'), 'Area: ' + (v('area') || '-'), 'About: ' + v('job'), '', v('message')].join('\n');
      window.location.href = 'mailto:subcool319@gmail.com?subject=' + encodeURIComponent(v('job') + (v('area') ? ' in ' + v('area') : '')) + '&body=' + encodeURIComponent(body);
    });
  }
})();
