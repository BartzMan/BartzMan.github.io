(function () {
  // full-screen phone menu
  var btn = document.querySelector('.menu-btn');
  var sheet = document.getElementById('sheet');
  if (btn && sheet) {
    var closeBtn = sheet.querySelector('.sheet-close');
    var open = function () {
      sheet.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('locked');
      var first = sheet.querySelector('.sheet-nav a');
      if (first) first.focus();
    };
    var close = function (back) {
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('locked');
      if (back) btn.focus();
    };
    btn.addEventListener('click', open);
    closeBtn.addEventListener('click', function () { close(true); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close(true);
      if (e.key === 'Tab') {
        var f = sheet.querySelectorAll('a, button');
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1160 && !sheet.hidden) close(false); });
  }

  // the hour marker of the section in view glows a little
  if ('IntersectionObserver' in window) {
    var marks = document.querySelectorAll('.sec .hr, .night .hr');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var m = en.target.querySelector('.hr');
        if (m) m.classList.toggle('is-now', en.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    marks.forEach(function (m) { io.observe(m.closest('.sec, .night')); });
  }

  // contact form: open the visitor's own email app with the details filled in
  var form = document.getElementById('rivera-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var err = document.getElementById('form-err');
      if (!v('name')) { err.hidden = false; form.elements.name.focus(); return; }
      err.hidden = true;
      var body = [
        'Name: ' + v('name'),
        'Phone: ' + (v('phone') || '-'),
        'Email: ' + (v('email') || '-'),
        'City or ZIP: ' + (v('zip') || '-'),
        'Need: ' + v('job'),
        '',
        v('message')
      ].join('\n');
      var subject = v('job') + ' - ' + v('name');
      window.location.href = 'mailto:pjr228@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
